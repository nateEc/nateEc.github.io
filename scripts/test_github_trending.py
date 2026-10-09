import importlib.util
import io
import json
import sys
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from urllib.error import HTTPError, URLError


SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
import github_trending_digest as digest
from github_trending_digest import build_payload, parse_trending_html, validate_payload


FIXTURE = """
<article class="Box-row">
  <h2><a href="/acme/agent-kit"> acme / agent-kit </a></h2>
  <p class="col-9 color-fg-muted my-1 pr-4">An agent runtime &amp; developer toolkit.</p>
  <span itemprop="programmingLanguage">TypeScript</span>
  <a href="/acme/agent-kit/stargazers">12,345</a>
  <a href="/acme/agent-kit/forks">678</a>
  <span>1,204 stars today</span>
</article>
<article class="Box-row">
  <h2><a href="/example/secure-db"> example / secure-db </a></h2>
  <p class="col-9 color-fg-muted my-1 pr-4">Private database tooling.</p>
  <span itemprop="programmingLanguage">Rust</span>
  <a href="/example/secure-db/stargazers">900</a>
  <span>88 stars today</span>
</article>
"""


class GitHubTrendingContractTests(unittest.TestCase):
    def test_parser_preserves_rank_and_daily_momentum(self):
        repos = parse_trending_html(FIXTURE)
        self.assertEqual([repo["fullName"] for repo in repos], ["acme/agent-kit", "example/secure-db"])
        self.assertEqual(repos[0]["starsToday"], 1204)
        self.assertEqual(repos[0]["totalStars"], 12345)
        self.assertEqual(repos[0]["description"], "An agent runtime & developer toolkit.")

    def test_payload_builds_language_mix_and_subject_themes(self):
        payload = build_payload(parse_trending_html(FIXTURE), datetime.now().astimezone())
        self.assertEqual(payload["languages"][0]["share"], 50)
        self.assertIn("Developer tools", {theme["name"] for theme in payload["themes"]})
        self.assertEqual(validate_payload(payload), payload["date"])

    def test_contract_rejects_non_github_links_and_duplicate_names(self):
        payload = build_payload(parse_trending_html(FIXTURE), datetime.now().astimezone())
        payload["repositories"][0]["url"] = "https://evil.example/repo"
        with self.assertRaisesRegex(ValueError, "unsafe"):
            validate_payload(payload)


class GitHubTrendingFetchTests(unittest.TestCase):
    def http_error(self, status, headers=None):
        return HTTPError(digest.SOURCE_URL, status, "gateway error", headers or {}, None)

    def test_gateway_timeout_switches_to_direct_official_source(self):
        with patch.object(digest, "urlopen", side_effect=self.http_error(504)) as configured, \
                patch.object(digest, "build_opener", create=True) as opener, \
                patch.object(digest.time, "sleep") as sleep:
            opener.return_value.open.return_value = io.BytesIO(FIXTURE.encode())
            payload = digest.fetch_payload()
        self.assertEqual(payload["source"], digest.SOURCE_URL)
        self.assertEqual(len(payload["repositories"]), 2)
        self.assertEqual(configured.call_count, 1)
        self.assertEqual(opener.return_value.open.call_count, 1)
        self.assertEqual(opener.call_args.args[0].proxies, {})
        request = opener.return_value.open.call_args.args[0]
        self.assertEqual(request.full_url, digest.SOURCE_URL)
        sleep.assert_called_once_with(2)

    def test_transport_failures_can_recover_on_configured_route(self):
        with patch.object(digest, "urlopen", side_effect=[URLError("reset"), io.BytesIO(FIXTURE.encode())]) as configured, \
                patch.object(digest, "build_opener", create=True) as opener, \
                patch.object(digest.time, "sleep") as sleep:
            opener.return_value.open.side_effect = URLError("direct reset")
            digest.fetch_payload()
        self.assertEqual(configured.call_count, 2)
        self.assertEqual(opener.return_value.open.call_count, 1)
        self.assertEqual([call.args[0] for call in sleep.call_args_list], [2, 4])

    def test_permanent_http_failure_does_not_switch_route_or_retry(self):
        with patch.object(digest, "urlopen", side_effect=self.http_error(403)) as configured, \
                patch.object(digest, "build_opener", create=True) as opener, \
                patch.object(digest.time, "sleep") as sleep:
            with self.assertRaisesRegex(RuntimeError, "after 1 attempt"):
                digest.fetch_payload()
        self.assertEqual(configured.call_count, 1)
        opener.assert_not_called()
        sleep.assert_not_called()

    def test_rate_limit_respects_bounded_retry_after_without_route_switch(self):
        with patch.object(digest, "urlopen", side_effect=[self.http_error(429, {"Retry-After": "30"}), io.BytesIO(FIXTURE.encode())]) as configured, \
                patch.object(digest, "build_opener", create=True) as opener, \
                patch.object(digest.time, "sleep") as sleep:
            digest.fetch_payload()
        self.assertEqual(configured.call_count, 2)
        opener.assert_not_called()
        sleep.assert_called_once_with(30)

    def test_persistent_gateway_failure_is_bounded_and_reports_routes(self):
        with patch.object(digest, "urlopen", side_effect=self.http_error(504)) as configured, \
                patch.object(digest, "build_opener", create=True) as opener, \
                patch.object(digest.time, "sleep") as sleep:
            opener.return_value.open.side_effect = self.http_error(504)
            with self.assertRaisesRegex(RuntimeError, "after 5 attempts.*direct.*HTTP 504"):
                digest.fetch_payload()
        self.assertEqual(configured.call_count + opener.return_value.open.call_count, 5)
        self.assertEqual([call.args[0] for call in sleep.call_args_list], [2, 4, 8, 12])

    def test_invalid_success_response_fails_without_hiding_contract_drift(self):
        with patch.object(digest, "urlopen", return_value=io.BytesIO(b"<html>maintenance</html>")) as configured, \
                patch.object(digest.time, "sleep") as sleep:
            with self.assertRaisesRegex(RuntimeError, "no repositories"):
                digest.fetch_payload()
        self.assertEqual(configured.call_count, 1)
        sleep.assert_not_called()

    def test_long_rate_limit_cooldown_fails_without_retrying_early(self):
        with patch.object(digest, "urlopen", side_effect=self.http_error(429, {"Retry-After": "120"})) as configured, \
                patch.object(digest.time, "sleep") as sleep:
            with self.assertRaisesRegex(RuntimeError, "HTTP 429"):
                digest.fetch_payload()
        self.assertEqual(configured.call_count, 1)
        sleep.assert_not_called()


class GitHubTrendingSyncTests(unittest.TestCase):
    def test_sync_keeps_previous_snapshot_when_fetch_fails(self):
        spec = importlib.util.spec_from_file_location("sync_github_trending", SCRIPTS / "sync-github-trending.py")
        module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp) / "github-trending.json"
            output.write_text('{"stable": true}\n')
            with patch.object(module, "OUTPUT", output), patch.object(module, "fetch_payload", side_effect=RuntimeError("offline")):
                self.assertEqual(module.main(), 1)
            self.assertEqual(json.loads(output.read_text()), {"stable": True})

    def test_publisher_is_scoped_to_radar_snapshot(self):
        spec = importlib.util.spec_from_file_location("publish_github_trending", SCRIPTS / "publish-github-trending.py")
        module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
        self.assertEqual(module.base.NEWS_PATH.as_posix(), "public/tech-news/github-trending.json")
        self.assertEqual(module.base.SYNC_SCRIPT.name, "sync-github-trending.py")
        self.assertEqual(module.base.DEPLOYMENT_URL, "https://nateec.github.io/tech-news/github-trending.json")
        self.assertIs(module.base.validate_payload, module.validate_payload)

    def test_publisher_reports_terminal_error_alongside_retry_warnings(self):
        spec = importlib.util.spec_from_file_location("publish_github_trending_failure", SCRIPTS / "publish-github-trending.py")
        module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
        with tempfile.TemporaryDirectory() as temp, \
                patch.object(module.base, "PROJECT_ROOT", Path(temp)), \
                patch.object(module.base, "_ensure_publishable_worktree"), \
                patch.object(module.base, "_ensure_dependencies"), \
                patch.object(module.base, "_run", return_value=SimpleNamespace(
                    returncode=1, stdout="error: terminal HTTP 504", stderr="warning: retry exhausted")):
            with self.assertRaisesRegex(RuntimeError, "terminal HTTP 504[\\s\\S]*retry exhausted"):
                module.publish()


if __name__ == "__main__":
    unittest.main()

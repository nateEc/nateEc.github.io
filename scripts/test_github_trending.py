import importlib.util
import json
import sys
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from unittest.mock import patch


SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
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


if __name__ == "__main__":
    unittest.main()

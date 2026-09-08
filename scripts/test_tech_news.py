import importlib.util
from datetime import datetime
import fcntl
import json
from pathlib import Path
import subprocess
import shutil
import sys
import tempfile
import unittest
from urllib.error import HTTPError, URLError
from unittest.mock import patch, MagicMock

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

sync = load('sync_news', 'sync-tech-news.py')
publisher = load('publisher', 'publish-tech-news.py')
hn = load('hn', 'hacker_news_digest.py')
from news_contract import validate_payload, validate_digest, write_snapshot
import news_http

def payload():
    now = datetime.now().astimezone()
    return {'schemaVersion': 1, 'date': now.date().isoformat(), 'updatedAt': now.isoformat(),
            'sections': [{'name': name, 'source': 'https://example.org', 'items': [
                {'title': 'A real title', 'url': 'https://example.org/article', 'published': now.isoformat()}
            ]} for name in ['AI资讯', 'Hacker News', 'TechCrunch']]}

class SyncTests(unittest.TestCase):
    def test_partial_source_error_retries_then_fails(self):
        result = subprocess.CompletedProcess([], 0, json.dumps({'sources': [
            {'name': 'Hacker News', 'error': 'TLS EOF'},
            {'name': 'TechCrunch', 'items': [{'title': 'ok'}]},
        ]}), '')
        with patch.object(sync.subprocess, 'run', return_value=result) as run, patch.object(sync.time, 'sleep'):
            with self.assertRaisesRegex(RuntimeError, 'Hacker News'):
                sync._run_digest(Path(__file__))
            self.assertEqual(run.call_count, sync.FETCH_ATTEMPTS)

    def test_invalid_fetch_preserves_existing_snapshot(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'latest.json'
            target.write_text('previous valid snapshot')
            with patch.object(sync, 'OUTPUT_JSON', target), patch.object(sync, '_last_completed_run', return_value=None), patch.object(sync, '_run_digest', return_value={'error': 'offline'}):
                self.assertEqual(sync.main(), 1)
            self.assertEqual(target.read_text(), 'previous valid snapshot')

    def test_recovers_on_second_attempt(self):
        bad = subprocess.CompletedProcess([], 0, '{"error":"timeout"}', '')
        good = subprocess.CompletedProcess([], 0, '{"items":[{"title":"ok"}]}', '')
        with patch.object(sync.subprocess, 'run', side_effect=[bad, good]), patch.object(sync.time, 'sleep'):
            self.assertEqual(len(sync._run_digest(Path(__file__))['items']), 1)

    def test_optional_execution_metadata_cannot_block_fresh_news(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'latest.json'
            with patch.object(sync, 'OUTPUT_JSON', target), patch.object(sync, '_last_completed_run', side_effect=sync.sqlite3.OperationalError('locked')), patch.object(sync, '_run_digest', return_value={}), patch.object(sync, '_to_json_payload', return_value=payload()):
                self.assertEqual(sync.main(), 0)
            validate_payload(json.loads(target.read_text()))

class ContractTests(unittest.TestCase):
    def test_rejects_missing_duplicate_empty_sources(self):
        for mutate in [lambda p: p['sections'].pop(), lambda p: p['sections'].append(p['sections'][0]), lambda p: p['sections'][1].update(items=[])]:
            data = payload(); mutate(data)
            with self.assertRaises(ValueError): validate_payload(data)

    def test_rejects_missing_digest_source(self):
        with self.assertRaises(ValueError):
            validate_digest({'sources': [{'name': 'TechCrunch', 'items': [{}]}]})

    def test_rejects_unsafe_or_undated_item(self):
        for value in [{'url': 'javascript:alert(1)'}, {'published': ''}, {'published': '2026-01-01'}]:
            data = payload(); data['sections'][0]['items'][0].update(value)
            with self.assertRaises(ValueError): validate_payload(data)

    def test_atomic_replace_failure_keeps_old_snapshot(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'latest.json'; target.write_text('good')
            with patch('news_contract.os.replace', side_effect=OSError('disk error')):
                with self.assertRaises(OSError): write_snapshot(target, payload())
            self.assertEqual(target.read_text(), 'good')
            self.assertEqual(list(Path(folder).glob('.news-*')), [])

    def test_valid_snapshot_roundtrip(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'latest.json'; data = payload()
            write_snapshot(target, data)
            self.assertEqual(json.loads(target.read_text()), data)

class FetchTests(unittest.TestCase):
    def test_transient_transport_failure_retries_with_verified_tls(self):
        response = MagicMock()
        response.__enter__.return_value.read.return_value = b'valid response'
        with patch.object(news_http, 'urlopen', side_effect=[OSError('TLS EOF'), response]) as request, patch.object(news_http.time, 'sleep'):
            self.assertEqual(news_http.fetch('https://example.org'), b'valid response')
            self.assertEqual(request.call_count, 2)
            self.assertNotIn('context', request.call_args.kwargs)

    def test_persistent_transport_failure_is_not_success(self):
        with patch.object(news_http, 'urlopen', side_effect=OSError('offline')) as request, patch.object(news_http.time, 'sleep'):
            with self.assertRaisesRegex(RuntimeError, 'offline'): news_http.fetch('https://example.org')
            self.assertEqual(request.call_count, 2)

    def test_hn_rss_failure_uses_api(self):
        fallback = {'items': [{'title': 'real', 'link': 'https://example.org', 'summary': 'summary'}]}
        with patch.object(hn, 'fetch_rss_source', side_effect=RuntimeError('TLS EOF')), patch.object(hn, 'fetch_hn_api', return_value=fallback), patch.object(hn, 'enrich_summary', return_value='summary'):
            result = hn.fetch_source(hn.SOURCES[0])
            self.assertEqual(len(result['items']), 1)
            self.assertIn('official HN API', result['warning'])

    def test_empty_api_does_not_fake_success(self):
        with patch.object(hn, 'fetch', return_value=b'[]'):
            with self.assertRaises(RuntimeError): hn.fetch_hn_api(hn.SOURCES[0])

    def test_api_skips_dead_and_uses_https_discussion_for_http(self):
        def item(hn_id):
            return {'type': 'story', 'dead': hn_id == '2', 'title': 'API title', 'time': 1788800000, 'url': 'http://example.org'}
        with patch.object(hn, 'fetch', return_value=b'[1,2]'), patch.object(hn, 'fetch_hn_item', side_effect=item):
            result = hn.fetch_hn_api(hn.SOURCES[0])
            self.assertEqual(len(result['items']), 1)
            self.assertEqual(result['items'][0]['link'], 'https://news.ycombinator.com/item?id=1')

class DeploymentTests(unittest.TestCase):
    def evidence(self, state='success', run_sha='abc', conclusion='success'):
        return [[{'id': 123, 'sha': 'abc', 'ref': 'main', 'environment': 'github-pages'}],
                [{'state': state, 'log_url': 'https://github.com/nateEc/nateEc.github.io/actions/runs/456/job/789'}],
                {'head_sha': run_sha, 'head_branch': 'main', 'path': '.github/workflows/pages.yml', 'status': 'completed', 'conclusion': conclusion}]

    def test_api_requires_exact_sha_successful_pages_workflow(self):
        with patch.object(publisher, '_github_api', side_effect=self.evidence()):
            self.assertIn('/runs/456/', publisher._github_deployment_evidence('abc'))
        for responses in [self.evidence(state='failure'), self.evidence(run_sha='different'), self.evidence(conclusion='failure')]:
            with patch.object(publisher, '_github_api', side_effect=responses):
                self.assertIsNone(publisher._github_deployment_evidence('abc'))

    def test_api_rejects_other_sha_without_querying_its_status(self):
        with patch.object(publisher, '_github_api', return_value=self.evidence()[0]) as api:
            self.assertIsNone(publisher._github_deployment_evidence('different'))
            api.assert_called_once()

    def test_transport_block_can_use_explicit_deployment_evidence(self):
        with patch.object(publisher, 'urlopen', side_effect=URLError('DNS sinkhole')), patch.object(publisher, '_checked', return_value='abc'), patch.object(publisher, '_github_deployment_evidence', return_value='https://github.com/nateEc/nateEc.github.io/actions/runs/456'):
            self.assertIn('local HTTP unavailable', publisher._wait_for_deployment(payload()['date'], payload()['updatedAt']))

    def test_http_server_failure_is_not_masked_by_deployment_success(self):
        with patch.object(publisher, 'urlopen', side_effect=HTTPError('https://example.org', 503, 'unavailable', {}, None)), patch.object(publisher, '_github_deployment_evidence') as api, patch.object(publisher, 'DEPLOYMENT_TIMEOUT_SECONDS', 1), patch.object(publisher.time, 'monotonic', side_effect=[0, 1]):
            with self.assertRaises(RuntimeError):
                publisher._wait_for_deployment(payload()['date'], payload()['updatedAt'])
            api.assert_not_called()

class PublisherTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name); self.remote = self.root / 'remote.git'; self.dev = self.root / 'dev'; self.bot = self.root / 'bot'
        self.git(self.root, 'init', '--bare', str(self.remote))
        self.git(self.root, 'clone', str(self.remote), str(self.dev))
        self.git(self.dev, 'checkout', '-b', 'main')
        self.identity(self.dev)
        (self.dev / 'public/tech-news').mkdir(parents=True)
        (self.dev / publisher.NEWS_PATH).write_text(json.dumps(payload()))
        (self.dev / 'app.txt').write_text('original')
        self.commit(self.dev, 'initial')
        self.git(self.dev, 'push', '-u', 'origin', 'main')
        self.git(self.root, 'clone', '--branch', 'main', str(self.remote), str(self.bot))
        self.identity(self.bot)
        (self.bot / '.git/tech-signal-publisher').touch()
        self.override = patch.object(publisher, 'PROJECT_ROOT', self.bot); self.override.start(); self.addCleanup(self.override.stop)
        if not (publisher.NODE_BIN / 'node').is_file():
            runtime = patch.object(publisher, 'NODE_BIN', Path(shutil.which('node')).parent)
            runtime.start(); self.addCleanup(runtime.stop)

    def git(self, root, *args):
        return subprocess.run(['git', *args], cwd=root, text=True, capture_output=True, check=True).stdout.strip()

    def identity(self, root):
        self.git(root, 'config', 'user.email', 'test@example.org'); self.git(root, 'config', 'user.name', 'Test')

    def commit(self, root, subject):
        self.git(root, 'add', '.'); self.git(root, 'commit', '-m', subject, '-m', 'fixture')

    def test_fast_forward_leaves_dirty_developer_checkout_alone(self):
        (self.dev / 'app.txt').write_text('remote update'); self.commit(self.dev, 'update')
        self.git(self.dev, 'push'); (self.dev / 'app.txt').write_text('unpublished game')
        publisher._ensure_publishable_worktree()
        self.assertEqual((self.bot / 'app.txt').read_text(), 'remote update')
        self.assertEqual((self.dev / 'app.txt').read_text(), 'unpublished game')

    def test_interrupted_snapshot_is_backed_up_and_restored(self):
        target = self.bot / publisher.NEWS_PATH; target.write_text('incomplete')
        publisher._ensure_publishable_worktree()
        self.assertEqual((self.bot / '.git/tech-news-recovery.json').read_text(), 'incomplete')
        validate_payload(json.loads(target.read_text()))

    def test_rejects_unrelated_bot_changes(self):
        (self.bot / 'app.txt').write_text('unexpected')
        with self.assertRaisesRegex(RuntimeError, 'unrelated'): publisher._ensure_publishable_worktree()
        self.assertEqual((self.bot / 'app.txt').read_text(), 'unexpected')

    def test_rejects_unmarked_checkout(self):
        (self.bot / '.git/tech-signal-publisher').unlink()
        with self.assertRaisesRegex(RuntimeError, 'designated isolated'): publisher._ensure_publishable_worktree()

    def test_pending_news_commit_rebases_and_recovers_push(self):
        (self.bot / publisher.NEWS_PATH).write_text(json.dumps(payload()) + '\n')
        self.commit(self.bot, 'pending news')
        (self.dev / 'app.txt').write_text('new remote feature'); self.commit(self.dev, 'remote feature'); self.git(self.dev, 'push')
        publisher._ensure_publishable_worktree()
        self.assertEqual(self.git(self.bot, 'rev-parse', 'HEAD'), self.git(self.bot, 'rev-parse', 'origin/main'))
        self.assertEqual((self.bot / 'app.txt').read_text(), 'new remote feature')

    def test_conflicting_news_commits_are_preserved_without_force_push(self):
        (self.bot / publisher.NEWS_PATH).write_text('local pending snapshot')
        self.commit(self.bot, 'pending news'); pending = self.git(self.bot, 'rev-parse', 'HEAD')
        (self.dev / publisher.NEWS_PATH).write_text('new remote snapshot')
        self.commit(self.dev, 'remote news'); self.git(self.dev, 'push')
        with self.assertRaisesRegex(RuntimeError, 'conflict'): publisher._ensure_publishable_worktree()
        self.assertEqual(self.git(self.bot, 'rev-parse', 'HEAD'), pending)
        self.assertEqual((self.bot / publisher.NEWS_PATH).read_text(), 'local pending snapshot')
        self.assertNotEqual(pending, self.git(self.bot, 'rev-parse', 'origin/main'))

    def test_push_transient_failure_is_retried(self):
        real_run = publisher._run
        attempts = []
        def flaky_run(command, **kwargs):
            if command[:2] == ['git', 'push']:
                attempts.append(command)
                if len(attempts) == 1:
                    return subprocess.CompletedProcess(command, 1, '', 'temporary network outage')
            return real_run(command, **kwargs)
        with patch.object(publisher, '_run', side_effect=flaky_run), patch.object(publisher.time, 'sleep'):
            publisher._push_main()
        self.assertEqual(len(attempts), 2)

    def test_fetch_transient_failure_is_retried(self):
        with patch.object(publisher, '_run', side_effect=[subprocess.CompletedProcess([], 1, '', 'offline'), subprocess.CompletedProcess([], 0, '', '')]) as run, patch.object(publisher.time, 'sleep'):
            publisher._fetch_main()
        self.assertEqual(run.call_count, 2)

    def test_fetch_timeout_is_retried(self):
        with patch.object(publisher, '_run', side_effect=[subprocess.TimeoutExpired('git', 120), subprocess.CompletedProcess([], 0, '', '')]) as run, patch.object(publisher.time, 'sleep'):
            publisher._fetch_main()
        self.assertEqual(run.call_count, 2)

    def test_deployment_with_matching_date_but_empty_source_is_rejected(self):
        data = payload(); data['sections'][1]['items'] = []
        response = MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps(data)
        with patch.object(publisher, 'urlopen', return_value=response), patch.object(publisher, 'DEPLOYMENT_TIMEOUT_SECONDS', 1), patch.object(publisher.time, 'monotonic', side_effect=[0, 1]):
            with self.assertRaisesRegex(RuntimeError, 'no items'):
                publisher._wait_for_deployment(data['date'], data['updatedAt'])

    def test_same_day_retry_does_not_generate_new_commit(self):
        with patch.object(publisher, '_wait_for_deployment') as verify, patch.object(publisher, '_ensure_dependencies') as install:
            self.assertEqual(publisher._publish(), 0)
            verify.assert_called_once(); install.assert_not_called()

    def test_file_lock_blocks_concurrent_publisher(self):
        with (self.bot / '.git/tech-signal.lock').open('a') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            self.assertEqual(publisher.main(), 1)

if __name__ == '__main__':
    unittest.main()

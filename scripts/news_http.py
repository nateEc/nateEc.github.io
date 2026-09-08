"""Bounded, certificate-verified transport for public news sources."""
import time
from urllib.request import Request, urlopen

UA = 'Mozilla/5.0 (compatible; HermesAgent/1.0; +https://hermes-agent.nousresearch.com)'

def fetch(url, *, timeout=10, accepts='*/*', attempts=2):
    error = None
    for attempt in range(attempts):
        try:
            request = Request(url, headers={'User-Agent': UA, 'Accept': accepts})
            with urlopen(request, timeout=min(timeout, 10)) as response:
                return response.read(2 * 1024 * 1024)
        except Exception as exc:
            error = exc
            if attempt + 1 < attempts:
                time.sleep(attempt + 1)
    raise RuntimeError(f'{url}: {type(error).__name__}: {error}') from error

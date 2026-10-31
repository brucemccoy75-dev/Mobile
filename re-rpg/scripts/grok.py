#!/usr/bin/env python3
"""Call xAI's Grok Imagine API from the repo (docs/ART.md, "Generating art with the API").

usage:
  grok.py image "<prompt>" --out art-src/x.jpg [--n 1] [--model grok-imagine-image-2.0]
  grok.py edit  "<prompt>" --ref art-src/hero_warrior_styleC.jpg [--ref ...] --out art-src/x.jpg
  grok.py video "<prompt>" [--ref still.jpg] --out art-src/x.mp4 [--duration 6]
  grok.py models

The key comes from $XAI_API_KEY, else from re-rpg/.env.local (git ignores it; never commit a key).
Every output gets a sidecar <out>.json with the prompt, model, references and the API's reply,
so a good result can be made again. With --n above 1 the files are numbered <out>-1, <out>-2, ...
"""
import argparse, base64, json, mimetypes, os, ssl, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = 'https://api.x.ai/v1'


def key() -> str:
    k = os.environ.get('XAI_API_KEY')
    env = os.path.join(ROOT, '.env.local')
    if not k and os.path.exists(env):
        for line in open(env):
            if line.startswith('XAI_API_KEY='): k = line.split('=', 1)[1].strip()
    if not k: sys.exit('No XAI_API_KEY: set it in the environment settings, or save it to re-rpg/.env.local')
    return k


def ctx() -> ssl.SSLContext:
    # The cloud machine's proxy re-signs TLS; trust its bundle when there is one.
    for ca in (os.environ.get('SSL_CERT_FILE'), os.environ.get('REQUESTS_CA_BUNDLE'), '/root/.ccr/ca-bundle.crt'):
        if ca and os.path.exists(ca): return ssl.create_default_context(cafile=ca)
    return ssl.create_default_context()


def call(method: str, path: str, body: dict | None = None) -> dict:
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Authorization': f'Bearer {key()}', 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, context=ctx(), timeout=300) as r: return json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f'{method} {path}: HTTP {e.code}: {e.read().decode()[:800]}')


def data_uri(path: str) -> str:
    mime = mimetypes.guess_type(path)[0] or 'image/png'
    return f'data:{mime};base64,{base64.b64encode(open(path, "rb").read()).decode()}'


def save(item: dict, out: str) -> None:
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    if item.get('b64_json'): open(out, 'wb').write(base64.b64decode(item['b64_json']))
    elif item.get('url'):
        # The image host turns away Python's default user agent.
        with urllib.request.urlopen(urllib.request.Request(item['url'], headers={'User-Agent': 'Mozilla/5.0 (re-rpg art script)'}), context=ctx(), timeout=300) as r: open(out, 'wb').write(r.read())
    else: sys.exit(f'no image in reply: {json.dumps(item)[:400]}')


def numbered(out: str, i: int, n: int) -> str:
    if n == 1: return out
    stem, ext = os.path.splitext(out)
    return f'{stem}-{i + 1}{ext}'


def sidecar(out: str, record: dict) -> None:
    json.dump(record, open(out + '.json', 'w'), indent=2)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument('cmd', choices=['image', 'edit', 'video', 'models'])
    p.add_argument('prompt', nargs='?', default='')
    p.add_argument('--out')
    p.add_argument('--ref', action='append', default=[])
    p.add_argument('--n', type=int, default=1)
    p.add_argument('--model')
    p.add_argument('--duration', type=int, default=6)
    a = p.parse_args()
    if a.cmd == 'models':
        print('\n'.join(m['id'] for m in call('GET', '/models')['data'])); return
    if not a.out: sys.exit('--out is required')
    when = time.strftime('%Y-%m-%dT%H:%M:%S')
    if a.cmd in ('image', 'edit'):
        model = a.model or 'grok-imagine-image-2.0'
        body: dict = {'model': model, 'prompt': a.prompt, 'n': a.n}
        if a.cmd == 'edit':
            if not a.ref: sys.exit('edit needs --ref')
            # One reference goes as an object; several go as a list of URL strings (the API refuses objects there).
            body['image'] = {'url': data_uri(a.ref[0]), 'type': 'image_url'} if len(a.ref) == 1 else [data_uri(r) for r in a.ref]
        reply = call('POST', '/images/generations' if a.cmd == 'image' else '/images/edits', body)
        items = reply.get('data', [])
        for i, item in enumerate(items):
            out = numbered(a.out, i, len(items))
            save(item, out)
            sidecar(out, {'when': when, 'cmd': a.cmd, 'model': model, 'prompt': a.prompt, 'refs': a.ref,
                          'revised_prompt': item.get('revised_prompt'), 'reply': {k: v for k, v in reply.items() if k != 'data'}})
            print(out)
        return
    # Video: submit, then poll until done, then download.
    model = a.model or 'grok-imagine-video-1.5'
    body = {'model': model, 'prompt': a.prompt, 'duration': a.duration}
    if a.ref: body['image'] = {'url': data_uri(a.ref[0]), 'type': 'image_url'}
    job = call('POST', '/videos/generations', body)
    rid = job.get('request_id') or job.get('id')
    if not rid: sys.exit(f'no request id: {json.dumps(job)[:400]}')
    for _ in range(120):
        time.sleep(5)
        st = call('GET', f'/videos/{rid}')
        status = st.get('status')
        if status == 'done':
            url = (st.get('video') or {}).get('url') or st.get('url')
            save({'url': url}, a.out)
            sidecar(a.out, {'when': when, 'cmd': 'video', 'model': model, 'prompt': a.prompt, 'refs': a.ref, 'reply': st})
            print(a.out); return
        if status in ('failed', 'error', 'expired'): sys.exit(f'video {status}: {json.dumps(st)[:600]}')
    sys.exit(f'video still not done after 10 minutes: request {rid}')


if __name__ == '__main__':
    main()

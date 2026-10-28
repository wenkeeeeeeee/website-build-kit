"""Local preview server for static website builds.

No caching (edits show on a normal reload) and byte-range support (video seek, loop and replay work).
Python's plain `http.server` has neither: Chrome keeps stale JS and videos fail to loop or seek.

Usage: python serve.py [root] [port]      root defaults to the current folder, port to 8080
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8080


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        m = re.match(r'bytes=(\d*)-(\d*)$', self.headers.get('Range', ''))
        path = self.translate_path(self.path)
        if not m or not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        start = int(m[1]) if m[1] else max(0, size - int(m[2] or 0))
        end = min(int(m[2]), size - 1) if m[1] and m[2] else size - 1
        if start >= size:
            self.send_error(416)
            return None
        f = open(path, 'rb')
        f.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()
        self._left = end - start + 1
        return f

    def copyfile(self, src, dst):
        left = getattr(self, '_left', None)
        if left is None:
            return super().copyfile(src, dst)
        while left > 0:
            chunk = src.read(min(64 * 1024, left))
            if not chunk:
                break
            dst.write(chunk)
            left -= len(chunk)


Handler.extensions_map.update({'.webm': 'video/webm', '.mp4': 'video/mp4', '.webp': 'image/webp', '.js': 'text/javascript', '.mjs': 'text/javascript'})

if __name__ == '__main__':
    print(f'Serving {ROOT} at http://127.0.0.1:{PORT}/')
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()

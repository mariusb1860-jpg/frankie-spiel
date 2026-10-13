"""Static file server for browser tests: like python -m http.server, but the browser
never keeps old files (Cache-Control: no-store). Usage: python -I nocache_server.py <root> <port>"""
import functools
import http.server
import sys

ROOT, PORT = sys.argv[1], int(sys.argv[2])


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):
        pass


class Server(http.server.ThreadingHTTPServer):
    # Windows refuses connections when ~25 modules load at once with the default queue of 5.
    request_queue_size = 128


Server(("127.0.0.1", PORT), functools.partial(NoCacheHandler, directory=ROOT)).serve_forever()

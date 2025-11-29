#!/usr/bin/env python3
"""
Simple HTTP server with cache disabled for development
"""
import http.server
import socketserver
from datetime import datetime

PORT = 8080

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable all caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Add timestamp to logs
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}")

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"=" * 60)
        print(f"🚀 Chess Puzzle Server (NO CACHE)")
        print(f"=" * 60)
        print(f"Server running at: http://localhost:{PORT}/")
        print(f"Cache headers: DISABLED (no-store, no-cache)")
        print(f"Press Ctrl+C to stop")
        print(f"=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server stopped")


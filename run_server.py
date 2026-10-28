import http.server
import socketserver
import webbrowser
import socket
import sys
import re
import os

PORT = 8080

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class CheerpJServerHandler(http.server.SimpleHTTPRequestHandler):
    """
    HTTP Server Handler with full HTTP Range Request (RFC 7233) support.
    Required by CheerpJ 3 WebAssembly Java Runtime for chunked JAR downloads.
    """

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization')
        self.send_header('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        range_header = self.headers.get('Range')
        if not range_header:
            return super().send_head()

        match = re.match(r'^bytes=(\d*)-(\d*)$', range_header)
        if not match:
            return super().send_head()

        total_bytes = os.fstat(f.fileno()).st_size
        start_str, end_str = match.groups()

        if start_str and end_str:
            start = int(start_str)
            end = int(end_str)
        elif start_str:
            start = int(start_str)
            end = total_bytes - 1
        elif end_str:
            start = total_bytes - int(end_str)
            end = total_bytes - 1
        else:
            return super().send_head()

        if start < 0 or start >= total_bytes or end < start or end >= total_bytes:
            self.send_response(416, "Requested Range Not Satisfiable")
            self.send_header("Content-Range", f"bytes */{total_bytes}")
            self.end_headers()
            f.close()
            return None

        self.send_response(206, "Partial Content")
        ctype = self.guess_type(path)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Range", f"bytes {start}-{end}/{total_bytes}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()

        self.range_start = start
        self.range_end = end
        return f

    def copyfile(self, source, outputfile):
        if not hasattr(self, 'range_start'):
            try:
                super().copyfile(source, outputfile)
            except (ConnectionResetError, BrokenPipeError):
                pass
            return

        source.seek(self.range_start)
        bytes_to_send = self.range_end - self.range_start + 1
        buffer_size = 64 * 1024

        try:
            while bytes_to_send > 0:
                chunk = source.read(min(bytes_to_send, buffer_size))
                if not chunk:
                    break
                outputfile.write(chunk)
                bytes_to_send -= len(chunk)
        except (ConnectionResetError, BrokenPipeError):
            pass

def run():
    # Ensure working directory is project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    # Allow custom port via CLI argument
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), CheerpJServerHandler) as httpd:
        local_ip = get_local_ip()
        print("=" * 60)
        print("  ULTIMATE MORTAL KOMBAT 3 - WEB RUNNER & DEV SERVER")
        print("=" * 60)
        print(f"[*] Local URL       : http://localhost:{port}/player/")
        print(f"[*] Mobile Wi-Fi URL: http://{local_ip}:{port}/player/")
        print("=" * 60)
        print("[*] Press Ctrl+C in this console to stop the server.")
        print()

        # Auto-open browser if no argument passed
        if "--no-browser" not in sys.argv:
            webbrowser.open(f"http://localhost:{port}/player/")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[*] Server stopped.")

if __name__ == "__main__":
    run()

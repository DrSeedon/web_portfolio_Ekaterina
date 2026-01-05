import os
import sys

# Add current directory to path for imports
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

import cleanup
import update_images
import http.server
import socketserver

PORT = 8001

def start_server():
    # Change directory to the web_portfolio folder
    os.chdir(script_dir)
    Handler = http.server.SimpleHTTPRequestHandler
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"📡 Server started at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped.")
            httpd.server_close()

def main():
    print("🚀 --- Portfolio Dev Orchestrator ---")
    
    # 1. Run Cleanup
    cleanup.run_cleanup()
    
    # 2. Update Images
    update_images.update_manifest()
    
    # 3. Start Server
    start_server()

if __name__ == "__main__":
    main()

import os
import shutil

def run_cleanup():
    print("🧹 Starting cleanup...")
    # Clean up python cache
    for root, dirs, files in os.walk('.'):
        for d in dirs:
            if d == '__pycache__':
                path = os.path.join(root, d)
                print(f"Removing {path}")
                shutil.rmtree(path)
    print("✅ Cleanup finished!")

if __name__ == "__main__":
    run_cleanup()

import os
import json

def update_manifest():
    print("Updating image manifest...")
    portfolio_path = "assets/images/portfolio"
    manifest = {}

    if not os.path.exists(portfolio_path):
        print(f"ERROR: Path {portfolio_path} not found.")
        return

    # List all project directories
    projects = [d for d in os.listdir(portfolio_path) if os.path.isdir(os.path.join(portfolio_path, d))]
    
    for project in projects:
        project_path = os.path.join(portfolio_path, project)
        images = [f for f in os.listdir(project_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.svg', '.webp'))]
        manifest[project] = sorted(images)

    with open("assets/images_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=4, ensure_ascii=False)

    print(f"DONE: Manifest updated! Found {len(projects)} projects.")

if __name__ == "__main__":
    update_manifest()

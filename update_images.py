import os
import json

def update_manifest():
    print("Updating image manifest...")
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_path = os.path.join(script_dir, 'assets', 'images', 'portfolio')
    
    manifest = {}

    if not os.path.exists(base_path):
        print(f"Error: Path {base_path} not found.")
        return

    # Scan project folders
    projects = [d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d))]
    
    valid_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')

    for project in projects:
        project_path = os.path.join(base_path, project)
        images = [f for f in os.listdir(project_path) 
                 if f.lower().endswith(valid_extensions)]
        # Sort to keep some order (e.g. 1.jpg, 2.jpg)
        images.sort()
        manifest[project] = images

    # Save to JSON
    manifest_path = os.path.join(script_dir, 'assets', 'images_manifest.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=4, ensure_ascii=False)

        print(f"DONE: Manifest updated! Found {len(projects)} projects.")

if __name__ == "__main__":
    update_manifest()

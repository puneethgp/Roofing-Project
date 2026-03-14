import json
import os
import subprocess
import sys

def load_config():
    try:
        with open('hosting-config.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: hosting-config.json not found.")
        sys.exit(1)

def deploy_to_netlify():
    print("🚀 Deploying to Netlify...")
    # Requires netlify-cli installed: npm install -g netlify-cli
    # Requires NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID env vars or login
    try:
        subprocess.run(["npx", "netlify-cli", "deploy", "--prod", "--dir=."], check=True)
        print("✅ Netlify deployment successful!")
    except Exception as e:
        print(f"❌ Netlify deployment failed: {e}")

def deploy_to_vercel():
    print("🚀 Deploying to Vercel...")
    # Requires vercel cli: npm install -g vercel
    try:
        subprocess.run(["npx", "vercel", "--prod", "--confirm"], check=True)
        print("✅ Vercel deployment successful!")
    except Exception as e:
        print(f"❌ Vercel deployment failed: {e}")

def deploy_to_github_pages():
    print("🚀 Deploying to GitHub Pages...")
    print("ℹ️ GitHub Pages is best handled via GitHub Actions.")
    print("Ensure you have a workflow in .github/workflows/static.yml")

def main():
    config = load_config()
    provider = config.get("active_provider")

    if provider == "netlify":
        deploy_to_netlify()
    elif provider == "vercel":
        deploy_to_vercel()
    elif provider == "github_pages":
        deploy_to_github_pages()
    else:
        print(f"Unknown provider: {provider}")

if __name__ == "__main__":
    main()

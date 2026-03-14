# 🌐 Multi-Hosting Switcher Guide

You can now switch between hosting platforms (Netlify, Vercel, or GitHub Pages) by changing a single field in your repository.

## 🚀 How to Switch Hosts

1.  Open [hosting-config.json](file:///c:/Users/megha/Puneeth/FirstclaudeProject/Roofing-Project/hosting-config.json).
2.  Change `"active_provider": "netlify"` to `"vercel"` or `"github_pages"`.
3.  Commit and push your changes to GitHub.

The **GitHub Action** will automatically read this file and deploy your site to the chosen platform.

---

## 🛠️ Infrastructure Overview

- **`hosting-config.json`**: Your master switch.
- **`deploy.py`**: A Python script to trigger deployments manually from your computer.
- **`.github/workflows/deploy.yml`**: Automates the switching process on every push.
- **Platform Configs**: `netlify.toml` and `vercel.json` are pre-configured with best practices (caching, clean URLs).

---

## 🔑 Required Setup (GitHub Secrets)

To make this "Plug & Play", you need to add the following secrets to your GitHub Repository (**Settings > Secrets and variables > Actions**):

### **For Netlify:**
- `NETLIFY_AUTH_TOKEN`: Your personal access token from Netlify.
- `NETLIFY_SITE_ID`: The API ID of your Netlify site.

### **For Vercel:**
- `VERCEL_TOKEN`: Your access token from Vercel settings.
- `VERCEL_ORG_ID`: Your Team or User ID in Vercel.
- `VERCEL_PROJECT_ID`: The Project ID from Vercel.

### **For GitHub Pages:**
- No extra setup needed! It uses the built-in `GITHUB_TOKEN`.

---

## 💻 Manual Deployment

If you want to deploy from your local terminal instead of waiting for GitHub, you can run:
```bash
python deploy.py
```
*(Ensure you have the appropriate CLIs installed: `npm install -g netlify-cli vercel`)*

# GitHub Pages Setup Guide

This guide will help you deploy your ToolMaster frontend to GitHub Pages for free static hosting.

## 🚀 Quick Setup

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### 2. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your React frontend for GitHub Pages
- Create a 404.html file for SPA routing
- Deploy to GitHub Pages when you push to the main branch

### 3. Access Your Site

After the first deployment completes, your site will be available at:
```
https://yourusername.github.io/ToolMaster/
```

## 🛠️ Manual Deployment (Optional)

If you need to deploy manually:

```bash
# Build for GitHub Pages
npm run build:pages

# The built files will be in the dist/ folder
# You can manually upload these to GitHub Pages
```

## ⚙️ Configuration Details

### Base Path
The GitHub Pages configuration uses `/ToolMaster/` as the base path to ensure all assets load correctly.

### SPA Routing
A `404.html` file is created to support client-side routing. This ensures that users can navigate directly to routes like `/text-converter` or `/password`.

### Build Configuration
- **Config file**: `vite.pages.config.ts`
- **Output directory**: `dist/`
- **Base path**: `/ToolMaster/`
- **Build command**: `npm run build:pages`

## 📝 Important Notes

### Backend API
GitHub Pages only hosts static files. The backend API (Express server, database, etc.) will need to be deployed separately to services like:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

### Environment Variables
The GitHub Pages deployment only includes the frontend. Any environment variables needed for the backend should be configured in your chosen backend hosting service.

### Custom Domain
If you want to use a custom domain:
1. Configure your DNS settings
2. Add the custom domain in GitHub repository Settings → Pages
3. Update the `base` path in `vite.pages.config.ts` if needed

## 🔧 Troubleshooting

### Common Issues

1. **404 Errors on Navigation**
   - Ensure the `404.html` file is present in the deployment
   - Check that GitHub Pages is configured to use GitHub Actions

2. **Assets Not Loading**
   - Verify the `base` path in `vite.pages.config.ts` matches your repository name
   - Check that all asset paths are relative

3. **Build Failures**
   - Run `npm run build:pages` locally to test
   - Check the GitHub Actions logs for specific errors

### Checking Deployment Status

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select the **Deploy to GitHub Pages** workflow
4. View the logs for the latest run

## 🔄 Updating Your Site

Any push to the `main` branch will automatically trigger a new deployment. The changes will be live within a few minutes.

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite GitHub Pages Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

---

**Note**: This setup only deploys the frontend. For a full-stack deployment, consider using platforms like Vercel, Railway, or Render that can host both frontend and backend.
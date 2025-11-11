# 🚀 CodeVibe V2 Deployment Guide

Complete guide to deploying CodeVibe V2 to various hosting platforms.

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ A Gemini API key from [https://ai.google.dev](https://ai.google.dev)
2. ✅ Git installed and repository pushed to GitHub
3. ✅ Node.js 18+ installed locally
4. ✅ Built and tested the app locally

---

## 🎯 Quick Deploy Options

### Option 1: Vercel (Recommended - Fastest)

**Vercel is perfect for:**
- Zero-configuration deployments
- Automatic HTTPS
- Edge network CDN
- Preview deployments for PRs

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment Variables:**
   ```bash
   vercel env add VITE_GEMINI_API_KEY production
   # Paste your Gemini API key when prompted
   ```

3. **Deploy:**
   ```bash
   # First time deployment
   vercel

   # Production deployment
   vercel --prod
   ```

4. **Alternative: Deploy via GitHub Integration:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_GEMINI_API_KEY`: Your Gemini API key
     - `VITE_MODEL_NAME`: `gemini-2.0-flash-exp` (optional)
   - Click "Deploy"

**Your app will be live at:** `https://your-project.vercel.app`

---

### Option 2: Netlify

**Netlify is perfect for:**
- Simple static hosting
- Form handling (future feature)
- Serverless functions
- Team collaboration

**Steps:**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Locally:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   # Login to Netlify
   netlify login

   # Deploy to draft URL
   netlify deploy

   # Deploy to production
   netlify deploy --prod
   ```

4. **Add Environment Variables:**
   ```bash
   # Via CLI
   netlify env:set VITE_GEMINI_API_KEY "your-api-key-here"

   # Or via Netlify Dashboard:
   # Site settings → Environment variables → Add variable
   ```

5. **Alternative: Deploy via GitHub Integration:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select repository
   - Build settings (auto-detected from `netlify.toml`):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Site settings
   - Click "Deploy site"

**Your app will be live at:** `https://your-site.netlify.app`

---

### Option 3: Docker (Self-Hosted)

**Docker is perfect for:**
- Complete control over infrastructure
- Private/air-gapped deployments
- Corporate environments
- Custom domains and SSL

**Steps:**

1. **Build Docker Image:**
   ```bash
   docker build -t codevibe-v2:latest .
   ```

2. **Run Container:**
   ```bash
   docker run -d \
     -p 5173:5173 \
     -e VITE_GEMINI_API_KEY="your-api-key" \
     --name codevibe \
     codevibe-v2:latest
   ```

3. **Access the App:**
   - Open [http://localhost:5173](http://localhost:5173)

4. **Stop Container:**
   ```bash
   docker stop codevibe
   ```

5. **Remove Container:**
   ```bash
   docker rm codevibe
   ```

---

### Option 4: Docker Compose (Production-Ready)

**Perfect for adding databases, reverse proxies, etc.**

**Create `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  codevibe:
    build: .
    ports:
      - "5173:5173"
    environment:
      - VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
      - VITE_MODEL_NAME=gemini-2.0-flash-exp
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5173"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Optional: Add nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - codevibe
    restart: unless-stopped
```

**Run:**
```bash
docker-compose up -d
```

---

### Option 5: Cloudflare Pages

**Cloudflare Pages is perfect for:**
- Free unlimited bandwidth
- Global CDN
- DDoS protection
- Integration with Cloudflare Workers (future features)

**Steps:**

1. **Via GitHub Integration:**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   - Configure build settings:
     - Framework preset: `Vite`
     - Build command: `npm run build`
     - Build output directory: `dist`
   - Add environment variables:
     - `VITE_GEMINI_API_KEY`: Your API key
   - Click "Save and Deploy"

2. **Via Wrangler CLI:**
   ```bash
   npm install -g wrangler
   wrangler login
   npm run build
   wrangler pages publish dist
   ```

**Your app will be live at:** `https://codevibe-v2.pages.dev`

---

### Option 6: Railway

**Railway is perfect for:**
- Simple deployment from GitHub
- Automatic deployments on push
- Built-in databases (for future features)

**Steps:**

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables:
   - `VITE_GEMINI_API_KEY`: Your API key
5. Railway auto-detects build settings
6. Click "Deploy"

**Your app will be live at:** `https://your-project.up.railway.app`

---

### Option 7: GitHub Pages (Static Only)

**GitHub Pages is perfect for:**
- Free hosting for public repos
- Simple static sites
- Documentation sites

**Steps:**

1. **Install gh-pages:**
   ```bash
   npm install -D gh-pages
   ```

2. **Update `package.json`:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://YOUR_USERNAME.github.io/AICodeAgent"
   }
   ```

3. **Update `vite.config.js`:**
   ```javascript
   export default defineConfig({
     base: '/AICodeAgent/', // Your repo name
     // ... rest of config
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages:**
   - Go to repository settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

**Note:** Environment variables need to be built into the app (not recommended for production).

**Your app will be live at:** `https://YOUR_USERNAME.github.io/AICodeAgent`

---

## 🔒 Security Best Practices

### Protecting Your API Key

1. **Never commit `.env` to Git**
   ```bash
   # Verify .env is in .gitignore
   cat .gitignore | grep .env
   ```

2. **Use Platform Environment Variables**
   - All platforms above support secure environment variables
   - Add `VITE_GEMINI_API_KEY` in platform dashboard

3. **Rotate Keys Regularly**
   - Generate new API keys every 90 days
   - Update in deployment platform

4. **Monitor Usage**
   - Check [Google AI Studio](https://ai.google.dev) for API usage
   - Set up usage alerts

### Domain Security

1. **Enable HTTPS** (automatic on most platforms)
2. **Configure CSP Headers** (see `netlify.toml` or `vercel.json`)
3. **Use Custom Domain:**
   ```bash
   # Vercel
   vercel domains add yourdomain.com

   # Netlify
   netlify domains:add yourdomain.com
   ```

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `VITE_GEMINI_API_KEY is not defined`

**Solution:**
```bash
# Check environment variables are set
vercel env ls  # or netlify env:list

# Add missing variable
vercel env add VITE_GEMINI_API_KEY production
```

### API Calls Fail in Production

**Error:** `Failed to fetch from Gemini API`

**Solution:**
1. Verify API key is correct in platform settings
2. Check API key has no extra spaces or quotes
3. Ensure `VITE_` prefix is present (Vite requirement)
4. Rebuild and redeploy after adding env vars

### Preview Not Working

**Error:** Blank preview panel

**Solution:**
1. Check browser console for errors
2. Ensure `index.html` exists in file explorer
3. Click "Refresh" button in preview panel
4. Verify no Content Security Policy blocking scripts

---

## 📊 Post-Deployment Checklist

- [ ] App loads successfully at production URL
- [ ] API key is working (test by running a prompt)
- [ ] File explorer loads and navigates correctly
- [ ] Code editor allows editing files
- [ ] Live preview renders HTML correctly
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive design displays properly
- [ ] Keyboard shortcuts function (Ctrl+S, F5, etc.)
- [ ] Export/import project features work
- [ ] No console errors in browser DevTools

---

## 🎉 Success!

Your CodeVibe V2 app is now live! Share your deployment:

- **Twitter:** Share your project with #CodeVibeV2
- **GitHub:** Add deployment URL to README badges
- **Community:** Join discussions and share feedback

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Gemini API Docs](https://ai.google.dev/docs)

---

**Need Help?** Open an issue at [github.com/patriotnewsactivism/AICodeAgent/issues](https://github.com/patriotnewsactivism/AICodeAgent/issues)

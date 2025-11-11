# ⚡ CodeVibe V2 - Quick Start & Deployment

## 🎉 What We've Built

**CodeVibe V2** is now production-ready with all the features of a Replit/Lovable alternative:

✅ AI-powered code generation with Gemini API
✅ Real-time live preview
✅ Professional file explorer with tree navigation
✅ Dark/light mode theming
✅ Mobile-responsive design
✅ Keyboard shortcuts
✅ Project export/import
✅ Production deployment configurations

---

## 🚀 Fastest Path to Deployment (5 Minutes)

### Option 1: Deploy to Vercel (Recommended)

**Why Vercel?** Zero configuration, automatic HTTPS, global CDN, and preview deployments.

1. **Get your Gemini API key:**
   - Visit [https://ai.google.dev](https://ai.google.dev)
   - Click "Get API Key" → Create key in new project
   - Copy the key (starts with `AIza...`)

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy (follow prompts)
   vercel

   # Add your API key
   vercel env add VITE_GEMINI_API_KEY production
   # Paste your API key when prompted

   # Deploy to production
   vercel --prod
   ```

3. **Done!** Your app is live at `https://your-project.vercel.app`

---

### Option 2: Deploy to Netlify

1. **Get your Gemini API key** (same as above)

2. **Deploy to Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Deploy
   netlify deploy --prod

   # Add API key
   netlify env:set VITE_GEMINI_API_KEY "your-api-key-here"
   ```

3. **Done!** Your app is live at `https://your-site.netlify.app`

---

### Option 3: GitHub Integration (No CLI Required)

**For Vercel:**
1. Push your code to GitHub (already done!)
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import your GitHub repository: `patriotnewsactivism/AICodeAgent`
4. Add environment variable:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your API key
5. Click "Deploy"

**For Netlify:**
1. Go to [netlify.com](https://netlify.com) → "Add new site"
2. Import from GitHub: `patriotnewsactivism/AICodeAgent`
3. Build settings auto-detected from `netlify.toml`
4. Add environment variable in Site settings
5. Deploy

---

## 🔧 Local Development

### First Time Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/patriotnewsactivism/AICodeAgent.git
   cd AICodeAgent
   npm install
   ```

2. **Add your API key:**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env and add your key
   echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:5173](http://localhost:5173)**

---

## 🎯 Testing Your Deployment

After deploying, verify everything works:

### ✅ Deployment Checklist

1. **App loads** - Visit your deployment URL
2. **Dark mode toggle** - Click moon/sun icon
3. **File explorer** - Create/edit/delete files
4. **AI generation** - Type a prompt and click "Run"
   - Example: "Create a todo list app"
5. **Live preview** - Check right panel shows rendered HTML
6. **Mobile view** - Resize browser to test responsive design

### 🐛 Common Issues

**Issue:** "Gemini API key not found"
**Fix:** Add `VITE_GEMINI_API_KEY` in platform environment variables and redeploy

**Issue:** Blank screen
**Fix:** Check browser console for errors, ensure API key has `VITE_` prefix

**Issue:** API calls fail
**Fix:** Verify API key is active at [ai.google.dev](https://ai.google.dev)

---

## 📚 What's Included

### New Files Added

- **`.env.example`** - Environment variable template
- **`Dockerfile`** - Multi-stage production Docker build
- **`.dockerignore`** - Clean Docker builds
- **`vercel.json`** - Vercel deployment config
- **`netlify.toml`** - Netlify deployment config
- **`DEPLOY.md`** - Complete deployment guide (7+ platforms)

### Improvements to Existing Files

- **`src/App.js`**:
  - Fixed API URL (generativelace → generativelanguage)
  - Environment variable support
  - Keyboard shortcuts (Ctrl+S, F5, Ctrl+P, Ctrl+/)
  - Better error handling for missing API keys

- **`README.md`**:
  - Complete rewrite as professional product docs
  - Feature comparison tables
  - 5-phase roadmap
  - Use cases and examples

---

## 🎹 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save & refresh preview |
| `F5` | Refresh preview |
| `Ctrl/Cmd + P` | Focus file search |
| `Ctrl/Cmd + /` | Toggle AI panel (mobile) |

---

## 🔒 Security Best Practices

1. **Never commit `.env` to Git** (already in `.gitignore`)
2. **Use platform environment variables** for production
3. **Rotate API keys every 90 days**
4. **Monitor usage** at [ai.google.dev](https://ai.google.dev)
5. **Enable rate limiting** on your API key if available

---

## 🎨 Customization

### Change AI Model

Edit `.env`:
```bash
VITE_MODEL_NAME=gemini-1.5-pro  # More powerful but slower
# Or
VITE_MODEL_NAME=gemini-2.0-flash-exp  # Fast and efficient (default)
```

### Add Custom Domain

**Vercel:**
```bash
vercel domains add yourdomain.com
```

**Netlify:**
```bash
netlify domains:add yourdomain.com
```

---

## 📈 Next Steps

### Immediate (Post-Deployment)

1. ✅ Share your deployment URL
2. ✅ Test all features thoroughly
3. ✅ Add custom domain (optional)
4. ✅ Set up monitoring/analytics

### Short Term (Next Week)

1. 🔄 Add real-time collaboration features
2. 🔄 Integrate actual GitHub API (beyond simulation)
3. 🔄 Add database for saving projects (Supabase/Firebase)
4. 🔄 Implement user authentication

### Long Term (Next Month)

1. 🔮 Multi-model AI support (GPT-4, Claude, Llama)
2. 🔮 Plugin/extension system
3. 🔮 Rights-tech templates (FOIA generators, etc.)
4. 🔮 Automated testing and CI/CD

---

## 💡 Pro Tips

1. **Cost Optimization:** Gemini has a generous free tier (60 requests/minute)
2. **Performance:** Use `gemini-2.0-flash-exp` for fastest responses
3. **Quality:** Use `gemini-1.5-pro` for complex code generation
4. **Debugging:** Check browser DevTools console for errors
5. **Backups:** Use project export feature regularly

---

## 🆘 Get Help

- **Documentation:** See `README.md` and `DEPLOY.md`
- **Issues:** [github.com/patriotnewsactivism/AICodeAgent/issues](https://github.com/patriotnewsactivism/AICodeAgent/issues)
- **Discussions:** [github.com/patriotnewsactivism/AICodeAgent/discussions](https://github.com/patriotnewsactivism/AICodeAgent/discussions)

---

## 🎉 You're Ready!

Your CodeVibe V2 platform is production-ready and can now compete with Replit and Lovable.

**Choose your deployment path above and go live in 5 minutes!** 🚀

---

<p align="center">
  <strong>Made with ❤️ by Patriot News Activism</strong><br>
  Building tools that matter for developers and activists worldwide
</p>

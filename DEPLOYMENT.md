# 🚀 Deployment Guide: Traffic Safety AI (Next.js + FastAPI)

This guide walks you through uploading your files to **GitHub**, deploying the **Next.js Frontend to Vercel**, and hosting the **FastAPI Inference Backend** with your custom `best.pt` model.

---

## 📁 Project Architecture Overview

```text
├── frontend/             # Next.js 16 Web Application (Deploys to Vercel)
│   ├── app/              # App router & pages
│   ├── components/       # Detection canvas, stats cards, upload zone, filters
│   ├── lib/              # API client & mock data generator
│   ├── public/           # Sample traffic scenes (sample1.svg, sample2.svg)
│   ├── types/            # TypeScript schemas
│   ├── .env.example      # Environment variable template
│   └── package.json
│
├── backend/              # FastAPI Python Inference Backend
│   ├── main.py           # API endpoints & CORS middleware
│   ├── detector.py       # Dual YOLO inference (best.pt + pretrained vehicles)
│   ├── schemas.py        # Pydantic data models
│   ├── models/
│   │   └── best.pt       # Custom YOLO helmet detection model weights (~5.2MB)
│   ├── Dockerfile        # Production container for cloud deployment
│   ├── requirements.txt  # Python packages (ultralytics, torch, fastapi, etc.)
│   └── run.py            # Local starter script
│
├── vercel.json           # Vercel deployment configuration
├── .gitignore            # Git exclusion rules
└── README.md
```

---

## Part 1: Push Code to GitHub

### 1.1 Open Terminal / PowerShell
Navigate to the root directory where the project is located:
```powershell
cd "c:\Users\Abdul Rehman\Desktop\TrafficGuard"
```

### 1.2 Initialize Git and Commit
```powershell
# 1. Initialize git repository
git init

# 2. Add all project files
git add .

# 3. Create your initial commit
git commit -m "feat: Traffic Safety AI Next.js frontend + FastAPI YOLO backend"
```

### 1.3 Create a New Repository on GitHub
1. Go to [GitHub.com](https://github.com/new) and click **New Repository**.
2. Name it (for example: `traffic-safety-ai`).
3. Set visibility to **Public** or **Private**.
4. Do **not** initialize with README, .gitignore, or license (we already have them).
5. Click **Create repository**.

### 1.4 Link and Push to GitHub
Copy the remote URL from GitHub and run:
```powershell
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/traffic-safety-ai.git
git push -u origin main
```
> **Note on `best.pt`**: Your trained weights file is ~5.2 MB, which is safely below GitHub's 100 MB file limit. It will push directly without requiring Git LFS!

---

## Part 2: Deploy Next.js Frontend on Vercel

### 2.1 Import to Vercel
1. Sign in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository (`traffic-safety-ai`) and click **Import**.

### 2.2 Configure Project Settings
In the Vercel project configuration screen:
* **Framework Preset**: Next.js (automatically detected)
* **Root Directory**: Click *Edit* and select **`frontend`** (or leave root if relying on `vercel.json`).
* **Build Command**: `npm run build`
* **Output Directory**: `.next`

### 2.3 Set Environment Variable
Under the **Environment Variables** section:
* **Key**: `NEXT_PUBLIC_API_URL`
* **Value**: Your production backend URL (e.g. `https://your-traffic-backend.onrender.com`)
  > *If your backend is not deployed yet, you can leave it blank or set to `http://localhost:8000`. The frontend will run in **Interactive Demo/Simulation Mode** so your Vercel preview works smoothly immediately!*

### 2.4 Deploy!
Click **Deploy**. Within 45 seconds, your site will be live at:
`https://your-project.vercel.app`

---

## Part 3: Deploy FastAPI Python Backend

Because the backend loads PyTorch and `best.pt`, it requires a Python container runtime. You can host it for free on **Render** or **Railway**.

### Option A: Deploy on Render.com (Recommended Free Tier)
1. Sign up / Log in to [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure:
   * **Name**: `traffic-safety-api`
   * **Root Directory**: `backend`
   * **Environment**: `Python 3` or `Docker` (Render will detect the included `Dockerfile` automatically)
   * **Branch**: `main`
   * **Plan**: Free
   * If using Python environment:
     * **Build Command**: `pip install -r requirements.txt`
     * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.
6. Once deployed, Render will provide a URL like `https://traffic-safety-api.onrender.com`.

### Option B: Deploy on Railway.app
1. Go to [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your repository.
4. Set root directory to `/backend`.
5. Railway will detect `backend/Dockerfile` and deploy it automatically.

---

## Part 4: Connect Frontend to Backend

1. Copy your live backend URL from Render or Railway (e.g., `https://traffic-safety-api.onrender.com`).
2. Go to your **Vercel Project** → **Settings** → **Environment Variables**.
3. Add / Update:
   ```text
   NEXT_PUBLIC_API_URL=https://traffic-safety-api.onrender.com
   ```
4. Click **Save** and trigger a **Redeploy** on Vercel.
5. Open your live Vercel app:
   * The status indicator in the top header will turn **Green ("FastAPI Online")**.
   * Uploading any image will now run live inference across both `best.pt` and the pretrained vehicle YOLO model!

---

## Part 5: Running Locally (Development)

To test the entire stack on your local machine:

### Terminal 1: Backend
```powershell
cd "c:\Users\Abdul Rehman\Desktop\TrafficGuard\backend"
py -m pip install -r requirements.txt
py run.py
```
Backend will be live at: `http://localhost:8000` (Interactive docs: `http://localhost:8000/docs`)

### Terminal 2: Frontend
```powershell
cd "c:\Users\Abdul Rehman\Desktop\TrafficGuard\frontend"
npm.cmd run dev
```
Frontend will be live at: `http://localhost:3000`

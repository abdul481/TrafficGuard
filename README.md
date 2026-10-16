# 🚦 TrafficGuard AI — Road Safety & Vehicle Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![YOLO](https://img.shields.io/badge/Ultralytics-YOLO11%20%2F%20v8-blue)](https://docs.ultralytics.com/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?logo=vercel)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

A fullstack computer vision system for traffic safety compliance. It combines a custom-trained YOLO model (`best.pt`) for motorcycle rider helmet compliance with a pretrained YOLO model for vehicle detection (cars, motorcycles, bicycles).

Designed with a dark-mode dashboard suitable for immediate deployment to **Vercel** (frontend) and **Render / Railway / Docker** (inference backend).

---

## 🌟 Key Features

* **Dual-Engine YOLO Pipeline**:
  * **Custom Helmet Model (`best.pt`)**: Detects `With Helmet` (safe) and `Without Helmet` (safety violation).
  * **Pretrained Vehicle Model**: Tracks `Car`, `Motorcycle`, and `Bicycle` traffic density.
* **Interactive HUD Canvas Viewer**:
  * Real-time bounding box visualization with normalized coordinates (responsive across mobile, tablet, and ultra-wide screens).
  * Color-coded classification: Emerald Green for helmets, Crimson Red for violations, Electric Violet for motorbikes, Sky Blue for cars.
  * Synchronized hover highlighting between visual canvas and tabular breakdown.
* **Live Safety Metrics & KPIs**:
  * Adherence count (`With Helmet`) vs infractions (`Without Helmet`).
  * Safety Compliance Rate (`0% - 100%`) with automatic risk grading (`SAFE`, `MODERATE`, `CRITICAL`).
  * Vehicle category counts (Cars, Motos, Bicycles) and dual-model inference latency in milliseconds.
* **Controls & Filtering**:
  * Real-time confidence threshold slider (`10% - 95%`).
  * Category filter pills (`All`, `Helmets Only`, `Vehicles Only`, `Violations Only`).
  * One-click Export: Download high-resolution annotated image or export raw prediction JSON.
* **Zero-Downtime Fallback (Vercel-Optimized)**:
  * If the backend is loading or offline, the frontend gracefully falls back to client simulation mode with preloaded sample traffic scenes, so your Vercel preview operates without error.

---

## 📂 Repository Structure

```text
├── frontend/                   # Next.js 16 Web Application
│   ├── app/
│   │   ├── layout.tsx          # SEO metadata & global layout
│   │   ├── page.tsx            # Main interactive dashboard
│   │   └── globals.css         # Modern dark theme & glassmorphism
│   ├── components/
│   │   ├── Header.tsx          # Real-time backend status & model pills
│   │   ├── StatsCards.tsx      # Compliance, violation, and vehicle cards
│   │   ├── DetectionViewer.tsx # SVG & Canvas bounding box renderer
│   │   ├── ImageUploader.tsx   # Drag & drop upload + sample presets
│   │   ├── ControlsBar.tsx     # Confidence slider & category filters
│   │   ├── DetectionsList.tsx  # Detailed data table
│   │   └── DeploymentModal.tsx # In-app GitHub & Vercel deployment guide
│   ├── lib/
│   │   ├── api.ts              # FastAPI client with health check
│   │   └── mockData.ts         # Sample data & simulation generator
│   ├── public/
│   │   └── samples/            # Preloaded traffic test images
│   ├── types/
│   │   └── detection.ts        # TypeScript schemas
│   ├── package.json
│   └── .env.example
│
├── backend/                    # FastAPI Python Inference Service
│   ├── main.py                 # FastAPI app, CORS, routes
│   ├── detector.py             # Model loader & inference pipeline
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── models/
│   │   └── best.pt             # Custom helmet YOLO model weights (~5.2MB)
│   ├── Dockerfile              # Container definition with PyTorch & OpenCV
│   ├── requirements.txt        # Python dependencies
│   └── run.py                  # Local launch helper
│
├── DEPLOYMENT.md               # Step-by-step deployment guide
├── vercel.json                 # Vercel monorepo configuration
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### 1. Run the FastAPI Backend

```powershell
cd backend
py -m pip install -r requirements.txt
py run.py
```
* **API Server**: `http://localhost:8000`
* **Interactive Swagger UI**: `http://localhost:8000/docs`
* **Health Check**: `http://localhost:8000/health`

### 2. Run the Next.js Frontend

```powershell
cd frontend
npm install
npm run dev
```
* **Web Dashboard**: `http://localhost:3000`

---

## 🌐 Deploy to Vercel & Cloud

Read our full [DEPLOYMENT.md](file:///c:/Users/Abdul%20Rehman/Desktop/ai%20ahghaa/DEPLOYMENT.md) for step-by-step instructions:

1. **Push to GitHub**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: Traffic Safety AI"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. **Deploy Frontend on Vercel**:
   * Import repo in Vercel.
   * Set Root Directory to `frontend`.
   * Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`.
3. **Deploy Backend on Render / Railway**:
   * Connect your GitHub repo and select `backend` directory.
   * Render will automatically use the included `Dockerfile` or `requirements.txt`.

---

## 📡 API Endpoints Specification

### `POST /api/detect`
Accepts multipart image upload and returns structured detections.

**Query Parameters:**
* `confidence` (float, default `0.25`): Minimum confidence threshold.
* `iou` (float, default `0.45`): Non-Maximum Suppression (NMS) IoU threshold.

**Sample JSON Response:**
```json
{
  "success": true,
  "image_dimensions": { "width": 1280, "height": 720 },
  "inference_time_ms": 28.4,
  "counts": {
    "total_with_helmet": 2,
    "total_without_helmet": 1,
    "total_cars": 3,
    "total_motorcycles": 2,
    "total_bicycles": 1,
    "total_vehicles": 6,
    "total_riders": 3,
    "total_detections": 9,
    "safety_compliance_rate": 66.7,
    "risk_level": "MODERATE"
  },
  "detections": [
    {
      "id": "det-1",
      "class_id": 0,
      "class_name": "With Helmet",
      "category": "helmet",
      "confidence": 0.942,
      "bbox": { "x1": 280, "y1": 180, "x2": 360, "y2": 275 },
      "normalized_bbox": { "norm_x1": 0.2187, "norm_y1": 0.25, "norm_x2": 0.2812, "norm_y2": 0.3819 },
      "is_violation": false,
      "color": "#10B981"
    },
    {
      "id": "det-2",
      "class_id": 1,
      "class_name": "Without Helmet",
      "category": "helmet",
      "confidence": 0.915,
      "bbox": { "x1": 520, "y1": 165, "x2": 595, "y2": 260 },
      "normalized_bbox": { "norm_x1": 0.4062, "norm_y1": 0.2292, "norm_x2": 0.4648, "norm_y2": 0.3611 },
      "is_violation": true,
      "color": "#EF4444"
    }
  ],
  "model_sources": {
    "helmet_model": "best.pt",
    "vehicle_model": "yolo11n.pt"
  }
}
```

---

## 🛡️ License
MIT License. Created for Traffic Safety AI Inspection.

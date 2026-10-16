import os
from fastapi import FastAPI, UploadFile, File, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch

try:
    from schemas import DetectionResponse, HealthResponse
    from detector import detector_instance
except ImportError:
    from backend.schemas import DetectionResponse, HealthResponse
    from backend.detector import detector_instance

app = FastAPI(
    title="Traffic Safety AI - YOLO Inference Backend",
    description="FastAPI service for dual-model detection: Custom YOLO Helmet Model (best.pt) + Pretrained YOLO Vehicle Model",
    version="1.0.0"
)

# Enable CORS for Next.js frontend (localhost and Vercel domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins including localhost:3000 and any *.vercel.app domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["General"])
def root():
    return {
        "service": "Traffic Safety AI Inference API",
        "status": "online",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "detect": "POST /api/detect",
            "classes": "GET /api/classes"
        }
    }

@app.get("/health", response_model=HealthResponse, tags=["General"])
def health_check():
    cuda_available = False
    try:
        cuda_available = torch.cuda.is_available()
    except Exception:
        pass

    return HealthResponse(
        status="healthy",
        cuda_available=cuda_available,
        helmet_model_loaded=detector_instance.helmet_model is not None,
        vehicle_model_loaded=detector_instance.vehicle_model is not None,
        helmet_model_path=str(detector_instance.helmet_model_path),
        vehicle_model_name=str(detector_instance.vehicle_model_name)
    )

@app.get("/api/classes", tags=["Inference"])
def get_classes():
    return {
        "helmet_model": {
            "name": os.path.basename(detector_instance.helmet_model_path),
            "classes": detector_instance.helmet_classes
        },
        "vehicle_model": {
            "name": detector_instance.vehicle_model_name,
            "target_classes": ["bicycle", "car", "motorcycle"]
        }
    }

@app.post("/api/detect", response_model=DetectionResponse, tags=["Inference"])
async def detect_traffic_safety(
    file: UploadFile = File(..., description="Image file to analyze (JPG, PNG, WebP)"),
    confidence: float = Query(0.25, ge=0.05, le=0.95, description="Confidence threshold"),
    iou: float = Query(0.45, ge=0.1, le=0.9, description="IoU NMS threshold")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: '{file.content_type}'. Please upload an image file (e.g. image/jpeg, image/png)."
        )

    try:
        image_bytes = await file.read()
        if len(image_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty file uploaded."
            )

        response = detector_instance.detect(
            image_bytes=image_bytes,
            conf_threshold=confidence,
            iou_threshold=iou
        )
        return response

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference failure: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

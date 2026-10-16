from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BoundingBox(BaseModel):
    x1: float = Field(..., description="Top-left X in pixels")
    y1: float = Field(..., description="Top-left Y in pixels")
    x2: float = Field(..., description="Bottom-right X in pixels")
    y2: float = Field(..., description="Bottom-right Y in pixels")

class NormalizedBBox(BaseModel):
    norm_x1: float = Field(..., description="Normalized top-left X [0.0 - 1.0]")
    norm_y1: float = Field(..., description="Normalized top-left Y [0.0 - 1.0]")
    norm_x2: float = Field(..., description="Normalized bottom-right X [0.0 - 1.0]")
    norm_y2: float = Field(..., description="Normalized bottom-right Y [0.0 - 1.0]")

class DetectionItem(BaseModel):
    id: str
    class_id: int
    class_name: str
    category: str = Field(..., description="'helmet' or 'vehicle'")
    confidence: float
    bbox: BoundingBox
    normalized_bbox: NormalizedBBox
    is_violation: bool
    color: str

class DetectionCounts(BaseModel):
    total_with_helmet: int = 0
    total_without_helmet: int = 0
    total_cars: int = 0
    total_motorcycles: int = 0
    total_bicycles: int = 0
    total_vehicles: int = 0
    total_riders: int = 0
    total_detections: int = 0
    safety_compliance_rate: float = Field(0.0, description="Percentage of helmet compliance")
    risk_level: str = Field("SAFE", description="'SAFE', 'MODERATE', or 'CRITICAL'")

class ImageDimensions(BaseModel):
    width: int
    height: int

class DetectionResponse(BaseModel):
    success: bool
    image_dimensions: ImageDimensions
    inference_time_ms: float
    counts: DetectionCounts
    detections: List[DetectionItem]
    model_sources: Dict[str, str]
    message: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    cuda_available: bool
    helmet_model_loaded: bool
    vehicle_model_loaded: bool
    helmet_model_path: str
    vehicle_model_name: str

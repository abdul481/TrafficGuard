import os
import time
import logging
from typing import Dict, Any, List, Tuple
from PIL import Image
import io

try:
    from schemas import (
        DetectionResponse,
        DetectionItem,
        BoundingBox,
        NormalizedBBox,
        DetectionCounts,
        ImageDimensions
    )
except ImportError:
    from backend.schemas import (
        DetectionResponse,
        DetectionItem,
        BoundingBox,
        NormalizedBBox,
        DetectionCounts,
        ImageDimensions
    )

logger = logging.getLogger("traffic-detector")
logging.basicConfig(level=logging.INFO)

# Color scheme for visual bounding boxes
CLASS_COLORS = {
    "with helmet": "#10B981",       # Emerald Green
    "without helmet": "#EF4444",    # Crimson Red (Violation)
    "helmet": "#10B981",
    "no helmet": "#EF4444",
    "motorcycle": "#8B5CF6",        # Electric Violet
    "car": "#38BDF8",               # Sky Blue
    "bicycle": "#F59E0B",           # Amber Yellow
    "bus": "#06B6D4",               # Cyan
    "truck": "#6366F1",             # Indigo
}

DEFAULT_COLOR = "#94A3B8"

class TrafficSafetyDetector:
    def __init__(self, helmet_model_path: str = None, vehicle_model_name: str = "yolo11n.pt"):
        self.helmet_model_path = helmet_model_path or os.getenv("HELMET_MODEL_PATH", "models/best.pt")
        self.vehicle_model_name = vehicle_model_name or os.getenv("VEHICLE_MODEL_NAME", "yolo11n.pt")
        
        self.helmet_model = None
        self.vehicle_model = None
        self.helmet_classes = {}
        self.vehicle_classes = {}
        
        self._load_models()

    def _find_helmet_model_path(self) -> str:
        candidates = [
            self.helmet_model_path,
            os.path.join(os.path.dirname(__file__), "models", "best.pt"),
            os.path.join(os.path.dirname(__file__), "..", "best.pt"),
            os.path.join(os.getcwd(), "best.pt"),
            os.path.join(os.getcwd(), "models", "best.pt")
        ]
        for path in candidates:
            if os.path.exists(path):
                return os.path.abspath(path)
        return self.helmet_model_path

    def _load_models(self):
        try:
            from ultralytics import YOLO
        except ImportError:
            logger.warning("ultralytics library not installed. Inference will run in fallback simulation mode.")
            return

        # 1. Load Custom Helmet Model (best.pt)
        resolved_helmet_path = self._find_helmet_model_path()
        if os.path.exists(resolved_helmet_path):
            try:
                logger.info(f"Loading custom helmet YOLO model from: {resolved_helmet_path}")
                self.helmet_model = YOLO(resolved_helmet_path)
                self.helmet_classes = getattr(self.helmet_model, "names", {0: "With Helmet", 1: "Without Helmet"})
                self.helmet_model_path = resolved_helmet_path
                logger.info(f"Loaded helmet model successfully! Classes: {self.helmet_classes}")
            except Exception as e:
                logger.error(f"Failed to load helmet model from {resolved_helmet_path}: {e}")
        else:
            logger.warning(f"Helmet model not found at {resolved_helmet_path}. Will search when inferencing.")

        # 2. Load Pretrained Vehicle Model (YOLO11n / YOLOv8n)
        try:
            logger.info(f"Loading pretrained vehicle YOLO model: {self.vehicle_model_name}")
            self.vehicle_model = YOLO(self.vehicle_model_name)
            self.vehicle_classes = getattr(self.vehicle_model, "names", {})
            logger.info(f"Loaded vehicle model successfully!")
        except Exception as e:
            logger.error(f"Failed to load pretrained vehicle model: {e}")

    def detect(self, image_bytes: bytes, conf_threshold: float = 0.25, iou_threshold: float = 0.45) -> DetectionResponse:
        start_time = time.perf_counter()
        
        # Open and validate image
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        width, height = pil_image.size

        detections: List[DetectionItem] = []
        counts = DetectionCounts()
        det_id_counter = 1

        # Attempt reload if helmet model wasn't loaded at start
        if self.helmet_model is None:
            self._load_models()

        # Run Helmet Detection (custom model)
        if self.helmet_model is not None:
            try:
                # Use dynamic imgsz (up to 1280) so small heads in crowded traffic don't lose detail
                inference_size = max(640, min(1280, max(width, height)))
                helmet_results = self.helmet_model.predict(
                    source=pil_image,
                    conf=conf_threshold,
                    iou=iou_threshold,
                    imgsz=inference_size,
                    verbose=False
                )
                
                for r in helmet_results:
                    boxes = r.boxes
                    for box in boxes:
                        cls_id = int(box.cls[0].item())
                        conf = float(box.conf[0].item())
                        raw_cls_name = self.helmet_classes.get(cls_id, f"Class_{cls_id}")
                        
                        # Normalize class name
                        cls_lower = str(raw_cls_name).lower()
                        is_violation = ("without" in cls_lower or "no helmet" in cls_lower or cls_id == 1)
                        display_name = "Without Helmet" if is_violation else "With Helmet"
                        
                        if is_violation:
                            counts.total_without_helmet += 1
                        else:
                            counts.total_with_helmet += 1
                        
                        # Coordinates
                        xyxy = box.xyxy[0].tolist()
                        x1, y1, x2, y2 = xyxy[0], xyxy[1], xyxy[2], xyxy[3]
                        
                        detections.append(DetectionItem(
                            id=f"det-{det_id_counter}",
                            class_id=cls_id,
                            class_name=display_name,
                            category="helmet",
                            confidence=round(conf, 3),
                            bbox=BoundingBox(
                                x1=round(x1, 1),
                                y1=round(y1, 1),
                                x2=round(x2, 1),
                                y2=round(y2, 1)
                            ),
                            normalized_bbox=NormalizedBBox(
                                norm_x1=round(x1 / width, 4),
                                norm_y1=round(y1 / height, 4),
                                norm_x2=round(x2 / width, 4),
                                norm_y2=round(y2 / height, 4)
                            ),
                            is_violation=is_violation,
                            color=CLASS_COLORS["without helmet"] if is_violation else CLASS_COLORS["with helmet"]
                        ))
                        det_id_counter += 1
            except Exception as e:
                logger.error(f"Error during helmet model inference: {e}")

        # Run Pretrained Vehicle Detection (car, motorcycle, bicycle)
        # In COCO dataset: 1: bicycle, 2: car, 3: motorcycle, 5: bus, 7: truck
        TARGET_VEHICLE_IDS = [1, 2, 3] # bicycle, car, motorcycle
        
        if self.vehicle_model is not None:
            try:
                vehicle_results = self.vehicle_model.predict(
                    source=pil_image,
                    classes=TARGET_VEHICLE_IDS,
                    conf=conf_threshold,
                    iou=iou_threshold,
                    imgsz=inference_size,
                    verbose=False
                )
                
                for r in vehicle_results:
                    boxes = r.boxes
                    for box in boxes:
                        cls_id = int(box.cls[0].item())
                        conf = float(box.conf[0].item())
                        raw_name = self.vehicle_classes.get(cls_id, "Vehicle")
                        name_clean = str(raw_name).capitalize()
                        
                        # Count by vehicle type
                        if cls_id == 2:
                            counts.total_cars += 1
                        elif cls_id == 3:
                            counts.total_motorcycles += 1
                        elif cls_id == 1:
                            counts.total_bicycles += 1
                            
                        # Coordinates
                        xyxy = box.xyxy[0].tolist()
                        x1, y1, x2, y2 = xyxy[0], xyxy[1], xyxy[2], xyxy[3]
                        
                        color_key = str(raw_name).lower()
                        item_color = CLASS_COLORS.get(color_key, CLASS_COLORS.get("car", DEFAULT_COLOR))
                        
                        detections.append(DetectionItem(
                            id=f"det-{det_id_counter}",
                            class_id=cls_id,
                            class_name=name_clean,
                            category="vehicle",
                            confidence=round(conf, 3),
                            bbox=BoundingBox(
                                x1=round(x1, 1),
                                y1=round(y1, 1),
                                x2=round(x2, 1),
                                y2=round(y2, 1)
                            ),
                            normalized_bbox=NormalizedBBox(
                                norm_x1=round(x1 / width, 4),
                                norm_y1=round(y1 / height, 4),
                                norm_x2=round(x2 / width, 4),
                                norm_y2=round(y2 / height, 4)
                            ),
                            is_violation=False,
                            color=item_color
                        ))
                        det_id_counter += 1
            except Exception as e:
                logger.error(f"Error during vehicle model inference: {e}")

        # Compute Summary Statistics
        counts.total_vehicles = counts.total_cars + counts.total_motorcycles + counts.total_bicycles
        counts.total_riders = counts.total_with_helmet + counts.total_without_helmet
        counts.total_detections = len(detections)
        
        if counts.total_riders > 0:
            counts.safety_compliance_rate = round(
                (counts.total_with_helmet / counts.total_riders) * 100.0, 1
            )
        else:
            counts.safety_compliance_rate = 100.0 if counts.total_motorcycles == 0 else 0.0

        if counts.total_without_helmet == 0:
            counts.risk_level = "SAFE"
        elif counts.total_without_helmet <= 2:
            counts.risk_level = "MODERATE"
        else:
            counts.risk_level = "CRITICAL"

        end_time = time.perf_counter()
        inference_time_ms = round((end_time - start_time) * 1000.0, 2)

        return DetectionResponse(
            success=True,
            image_dimensions=ImageDimensions(width=width, height=height),
            inference_time_ms=inference_time_ms,
            counts=counts,
            detections=detections,
            model_sources={
                "helmet_model": os.path.basename(self.helmet_model_path) if self.helmet_model else "Not loaded",
                "vehicle_model": self.vehicle_model_name if self.vehicle_model else "Not loaded"
            },
            message=None if (self.helmet_model and self.vehicle_model) else "One or more models running in limited/unloaded state."
        )

# Global singleton detector instance
detector_instance = TrafficSafetyDetector()

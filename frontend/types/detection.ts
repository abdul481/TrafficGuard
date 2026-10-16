export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface NormalizedBBox {
  norm_x1: number;
  norm_y1: number;
  norm_x2: number;
  norm_y2: number;
}

export interface DetectionItem {
  id: string;
  class_id: number;
  class_name: string;
  category: 'helmet' | 'vehicle';
  confidence: number;
  bbox: BoundingBox;
  normalized_bbox: NormalizedBBox;
  is_violation: boolean;
  color: string;
}

export interface DetectionCounts {
  total_with_helmet: number;
  total_without_helmet: number;
  total_cars: number;
  total_motorcycles: number;
  total_bicycles: number;
  total_vehicles: number;
  total_riders: number;
  total_detections: number;
  safety_compliance_rate: number;
  risk_level: 'SAFE' | 'MODERATE' | 'CRITICAL';
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface DetectionResponse {
  success: boolean;
  image_dimensions: ImageDimensions;
  inference_time_ms: number;
  counts: DetectionCounts;
  detections: DetectionItem[];
  model_sources: {
    helmet_model: string;
    vehicle_model: string;
  };
  message?: string;
  is_simulated?: boolean;
}

export type FilterCategory = 'all' | 'helmet' | 'vehicle' | 'violation';

export interface DisplayOptions {
  confidenceThreshold: number;
  filterCategory: FilterCategory;
  showLabels: boolean;
  showConfidence: boolean;
  highlightViolations: boolean;
}

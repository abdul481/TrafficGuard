import { DetectionResponse } from '@/types/detection';

export const SAMPLE_DETECTIONS_1: DetectionResponse = {
  success: true,
  image_dimensions: { width: 1280, height: 720 },
  inference_time_ms: 28.4,
  counts: {
    total_with_helmet: 2,
    total_without_helmet: 1,
    total_cars: 3,
    total_motorcycles: 2,
    total_bicycles: 1,
    total_vehicles: 6,
    total_riders: 3,
    total_detections: 9,
    safety_compliance_rate: 66.7,
    risk_level: 'MODERATE'
  },
  detections: [
    {
      id: 'det-1',
      class_id: 0,
      class_name: 'With Helmet',
      category: 'helmet',
      confidence: 0.942,
      bbox: { x1: 280, y1: 180, x2: 360, y2: 275 },
      normalized_bbox: { norm_x1: 0.2187, norm_y1: 0.25, norm_x2: 0.2812, norm_y2: 0.3819 },
      is_violation: false,
      color: '#10B981'
    },
    {
      id: 'det-2',
      class_id: 1,
      class_name: 'Without Helmet',
      category: 'helmet',
      confidence: 0.915,
      bbox: { x1: 520, y1: 165, x2: 595, y2: 260 },
      normalized_bbox: { norm_x1: 0.4062, norm_y1: 0.2292, norm_x2: 0.4648, norm_y2: 0.3611 },
      is_violation: true,
      color: '#EF4444'
    },
    {
      id: 'det-3',
      class_id: 0,
      class_name: 'With Helmet',
      category: 'helmet',
      confidence: 0.887,
      bbox: { x1: 910, y1: 220, x2: 970, y2: 295 },
      normalized_bbox: { norm_x1: 0.7109, norm_y1: 0.3055, norm_x2: 0.7578, norm_y2: 0.4097 },
      is_violation: false,
      color: '#10B981'
    },
    {
      id: 'det-4',
      class_id: 3,
      class_name: 'Motorcycle',
      category: 'vehicle',
      confidence: 0.965,
      bbox: { x1: 240, y1: 230, x2: 410, y2: 540 },
      normalized_bbox: { norm_x1: 0.1875, norm_y1: 0.3194, norm_x2: 0.3203, norm_y2: 0.75 },
      is_violation: false,
      color: '#8B5CF6'
    },
    {
      id: 'det-5',
      class_id: 3,
      class_name: 'Motorcycle',
      category: 'vehicle',
      confidence: 0.938,
      bbox: { x1: 480, y1: 225, x2: 640, y2: 550 },
      normalized_bbox: { norm_x1: 0.375, norm_y1: 0.3125, norm_x2: 0.5, norm_y2: 0.7638 },
      is_violation: false,
      color: '#8B5CF6'
    },
    {
      id: 'det-6',
      class_id: 2,
      class_name: 'Car',
      category: 'vehicle',
      confidence: 0.952,
      bbox: { x1: 50, y1: 280, x2: 260, y2: 480 },
      normalized_bbox: { norm_x1: 0.039, norm_y1: 0.3888, norm_x2: 0.2031, norm_y2: 0.6666 },
      is_violation: false,
      color: '#38BDF8'
    },
    {
      id: 'det-7',
      class_id: 2,
      class_name: 'Car',
      category: 'vehicle',
      confidence: 0.923,
      bbox: { x1: 670, y1: 260, x2: 920, y2: 490 },
      normalized_bbox: { norm_x1: 0.5234, norm_y1: 0.3611, norm_x2: 0.7187, norm_y2: 0.6805 },
      is_violation: false,
      color: '#38BDF8'
    },
    {
      id: 'det-8',
      class_id: 2,
      class_name: 'Car',
      category: 'vehicle',
      confidence: 0.891,
      bbox: { x1: 940, y1: 290, x2: 1220, y2: 520 },
      normalized_bbox: { norm_x1: 0.7343, norm_y1: 0.4027, norm_x2: 0.9531, norm_y2: 0.7222 },
      is_violation: false,
      color: '#38BDF8'
    },
    {
      id: 'det-9',
      class_id: 1,
      class_name: 'Bicycle',
      category: 'vehicle',
      confidence: 0.876,
      bbox: { x1: 880, y1: 270, x2: 990, y2: 510 },
      normalized_bbox: { norm_x1: 0.6875, norm_y1: 0.375, norm_x2: 0.7734, norm_y2: 0.7083 },
      is_violation: false,
      color: '#F59E0B'
    }
  ],
  model_sources: {
    helmet_model: 'best.pt (Simulated Fallback)',
    vehicle_model: 'yolo11n.pt (Pretrained)'
  },
  is_simulated: true,
  message: 'Running in demonstration mode. Connect backend at NEXT_PUBLIC_API_URL for live inference.'
};

export function generateSimulationForImage(width: number, height: number): DetectionResponse {
  // Generates randomized realistic boxes based on image dimensions
  const hasViolation = Math.random() > 0.4;
  const helmetCount = Math.floor(Math.random() * 3) + 1;
  const noHelmetCount = hasViolation ? Math.floor(Math.random() * 2) + 1 : 0;
  const carCount = Math.floor(Math.random() * 3) + 1;
  const motoCount = helmetCount + noHelmetCount;
  const bicycleCount = Math.random() > 0.5 ? 1 : 0;

  const detections = [];
  let idCount = 1;

  for (let i = 0; i < helmetCount; i++) {
    const nx1 = 0.15 + (i * 0.25) + Math.random() * 0.05;
    const ny1 = 0.2 + Math.random() * 0.1;
    const nw = 0.08 + Math.random() * 0.03;
    const nh = 0.12 + Math.random() * 0.04;
    detections.push({
      id: `det-${idCount++}`,
      class_id: 0,
      class_name: 'With Helmet',
      category: 'helmet' as const,
      confidence: Number((0.85 + Math.random() * 0.12).toFixed(3)),
      bbox: {
        x1: Math.round(nx1 * width),
        y1: Math.round(ny1 * height),
        x2: Math.round((nx1 + nw) * width),
        y2: Math.round((ny1 + nh) * height)
      },
      normalized_bbox: {
        norm_x1: Number(nx1.toFixed(4)),
        norm_y1: Number(ny1.toFixed(4)),
        norm_x2: Number((nx1 + nw).toFixed(4)),
        norm_y2: Number((ny1 + nh).toFixed(4))
      },
      is_violation: false,
      color: '#10B981'
    });
  }

  for (let i = 0; i < noHelmetCount; i++) {
    const nx1 = 0.55 + (i * 0.2) + Math.random() * 0.05;
    const ny1 = 0.22 + Math.random() * 0.08;
    const nw = 0.08 + Math.random() * 0.03;
    const nh = 0.12 + Math.random() * 0.04;
    detections.push({
      id: `det-${idCount++}`,
      class_id: 1,
      class_name: 'Without Helmet',
      category: 'helmet' as const,
      confidence: Number((0.82 + Math.random() * 0.14).toFixed(3)),
      bbox: {
        x1: Math.round(nx1 * width),
        y1: Math.round(ny1 * height),
        x2: Math.round((nx1 + nw) * width),
        y2: Math.round((ny1 + nh) * height)
      },
      normalized_bbox: {
        norm_x1: Number(nx1.toFixed(4)),
        norm_y1: Number(ny1.toFixed(4)),
        norm_x2: Number((nx1 + nw).toFixed(4)),
        norm_y2: Number((ny1 + nh).toFixed(4))
      },
      is_violation: true,
      color: '#EF4444'
    });
  }

  for (let i = 0; i < motoCount; i++) {
    const nx1 = 0.12 + (i * 0.28);
    const ny1 = 0.35;
    const nw = 0.18;
    const nh = 0.42;
    detections.push({
      id: `det-${idCount++}`,
      class_id: 3,
      class_name: 'Motorcycle',
      category: 'vehicle' as const,
      confidence: Number((0.89 + Math.random() * 0.08).toFixed(3)),
      bbox: {
        x1: Math.round(nx1 * width),
        y1: Math.round(ny1 * height),
        x2: Math.round((nx1 + nw) * width),
        y2: Math.round((ny1 + nh) * height)
      },
      normalized_bbox: {
        norm_x1: Number(nx1.toFixed(4)),
        norm_y1: Number(ny1.toFixed(4)),
        norm_x2: Number((nx1 + nw).toFixed(4)),
        norm_y2: Number((ny1 + nh).toFixed(4))
      },
      is_violation: false,
      color: '#8B5CF6'
    });
  }

  for (let i = 0; i < carCount; i++) {
    const nx1 = 0.65 + (i * 0.15);
    const ny1 = 0.38;
    const nw = 0.25;
    const nh = 0.35;
    detections.push({
      id: `det-${idCount++}`,
      class_id: 2,
      class_name: 'Car',
      category: 'vehicle' as const,
      confidence: Number((0.91 + Math.random() * 0.07).toFixed(3)),
      bbox: {
        x1: Math.round(nx1 * width),
        y1: Math.round(ny1 * height),
        x2: Math.round((nx1 + nw) * width),
        y2: Math.round((ny1 + nh) * height)
      },
      normalized_bbox: {
        norm_x1: Number(nx1.toFixed(4)),
        norm_y1: Number(ny1.toFixed(4)),
        norm_x2: Number((nx1 + nw).toFixed(4)),
        norm_y2: Number((ny1 + nh).toFixed(4))
      },
      is_violation: false,
      color: '#38BDF8'
    });
  }

  const totalRiders = helmetCount + noHelmetCount;
  const compliance = totalRiders > 0 ? (helmetCount / totalRiders) * 100 : 100;

  return {
    success: true,
    image_dimensions: { width, height },
    inference_time_ms: Number((22 + Math.random() * 12).toFixed(1)),
    counts: {
      total_with_helmet: helmetCount,
      total_without_helmet: noHelmetCount,
      total_cars: carCount,
      total_motorcycles: motoCount,
      total_bicycles: bicycleCount,
      total_vehicles: carCount + motoCount + bicycleCount,
      total_riders: totalRiders,
      total_detections: detections.length,
      safety_compliance_rate: Number(compliance.toFixed(1)),
      risk_level: noHelmetCount === 0 ? 'SAFE' : noHelmetCount <= 2 ? 'MODERATE' : 'CRITICAL'
    },
    detections,
    model_sources: {
      helmet_model: 'best.pt (Simulated Fallback)',
      vehicle_model: 'yolo11n.pt (Pretrained)'
    },
    is_simulated: true,
    message: 'Simulated preview mode. FastAPI backend is not connected yet.'
  };
}

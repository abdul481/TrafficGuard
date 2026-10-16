import { DetectionResponse } from '@/types/detection';
import { generateSimulationForImage } from './mockData';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface BackendHealth {
  isOnline: boolean;
  cudaAvailable?: boolean;
  helmetModelLoaded?: boolean;
  vehicleModelLoaded?: boolean;
  helmetModelPath?: string;
  vehicleModelName?: string;
  apiUrl: string;
}

export async function checkBackendHealth(): Promise<BackendHealth> {
  const cleanUrl = API_BASE_URL.replace(/\/+$/, '');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${cleanUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        isOnline: true,
        cudaAvailable: data.cuda_available,
        helmetModelLoaded: data.helmet_model_loaded,
        vehicleModelLoaded: data.vehicle_model_loaded,
        helmetModelPath: data.helmet_model_path,
        vehicleModelName: data.vehicle_model_name,
        apiUrl: cleanUrl
      };
    }
    return { isOnline: false, apiUrl: cleanUrl };
  } catch (error) {
    return { isOnline: false, apiUrl: cleanUrl };
  }
}

export async function runTrafficDetection(
  imageFile: File,
  confidence: number = 0.25,
  iou: number = 0.45,
  forceSimulation: boolean = false
): Promise<DetectionResponse> {
  if (forceSimulation) {
    return getSimulatedFallback(imageFile);
  }

  const cleanUrl = API_BASE_URL.replace(/\/+$/, '');
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const queryParams = new URLSearchParams({
      confidence: confidence.toString(),
      iou: iou.toString()
    });

    const res = await fetch(`${cleanUrl}/api/detect?${queryParams}`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.detail || `Inference error: Server returned ${res.status}`);
    }

    const data: DetectionResponse = await res.json();
    return {
      ...data,
      is_simulated: false
    };
  } catch (err: any) {
    console.warn(`[API] Backend unavailable at ${cleanUrl}. Falling back to client-side demonstration:`, err.message);
    const simulated = await getSimulatedFallback(imageFile);
    return simulated;
  }
}

async function getSimulatedFallback(file: File): Promise<DetectionResponse> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const width = img.naturalWidth || 1280;
      const height = img.naturalHeight || 720;
      URL.revokeObjectURL(objectUrl);
      setTimeout(() => {
        resolve(generateSimulationForImage(width, height));
      }, 450); // Small realistic delay
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(generateSimulationForImage(1280, 720));
    };
    img.src = objectUrl;
  });
}

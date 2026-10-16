'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import DetectionViewer from '@/components/DetectionViewer';
import ImageUploader from '@/components/ImageUploader';
import ControlsBar from '@/components/ControlsBar';
import DetectionsList from '@/components/DetectionsList';
import DeploymentModal from '@/components/DeploymentModal';

import {
  DetectionResponse,
  DisplayOptions
} from '@/types/detection';
import {
  checkBackendHealth,
  runTrafficDetection,
  BackendHealth
} from '@/lib/api';
import { SAMPLE_DETECTIONS_1 } from '@/lib/mockData';

export default function Home() {
  // App State
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('/samples/sample1.svg');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [detectionData, setDetectionData] = useState<DetectionResponse>(SAMPLE_DETECTIONS_1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // Inspector & Hover Synchronization State
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);
  const [hoveredDetectionId, setHoveredDetectionId] = useState<string | null>(null);

  // Display & Filter Options
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    confidenceThreshold: 0.40,
    filterCategory: 'all',
    showLabels: true,
    showConfidence: true,
    highlightViolations: true
  });

  // Backend Health State
  const [backendHealth, setBackendHealth] = useState<BackendHealth>({
    isOnline: false,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  });
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);

  // Health check on mount
  const refreshHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    const health = await checkBackendHealth();
    setBackendHealth(health);
    setIsCheckingHealth(false);
  }, []);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  // Handle uploaded file
  const handleImageSelected = async (file: File, previewUrl: string) => {
    setCurrentFile(file);
    setCurrentImageUrl(previewUrl);
    setSelectedDetectionId(null);
    setIsAnalyzing(true);

    try {
      const response = await runTrafficDetection(
        file,
        displayOptions.confidenceThreshold,
        0.45,
        !backendHealth.isOnline // If backend is offline, gracefully simulate
      );
      setDetectionData(response);
    } catch (err) {
      console.error('Detection failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle preset sample selection
  const handleSampleSelected = async (samplePath: string, name: string) => {
    setCurrentImageUrl(samplePath);
    setSelectedDetectionId(null);
    setIsAnalyzing(true);

    try {
      // Fetch sample as blob to test real pipeline
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], `${name.toLowerCase().replace(/\s+/g, '_')}.svg`, { type: 'image/svg+xml' });
      setCurrentFile(file);

      if (samplePath === '/samples/sample1.svg') {
        // Instant sample 1 data
        setTimeout(() => {
          setDetectionData(SAMPLE_DETECTIONS_1);
          setIsAnalyzing(false);
        }, 300);
      } else {
        const response = await runTrafficDetection(file, displayOptions.confidenceThreshold, 0.45, true);
        setDetectionData(response);
        setIsAnalyzing(false);
      }
    } catch (err) {
      console.error('Error loading sample:', err);
      setIsAnalyzing(false);
    }
  };

  const handleUpdateOptions = (updated: Partial<DisplayOptions>) => {
    setDisplayOptions((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      {/* 1. Header with Status & Navigation */}
      <Header
        backendHealth={backendHealth}
        isCheckingHealth={isCheckingHealth}
        onRefreshHealth={refreshHealth}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Container */}
      <main style={{
        flex: 1,
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Notice Banner if in Demo/Simulated Mode */}
        {detectionData.is_simulated && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '0.78rem',
            color: '#fbbf24',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>⚡</span>
              <span>
                <strong>Demonstration Mode:</strong> Backend at <code>{backendHealth.apiUrl}</code> is offline. Displaying client-simulated detections so you can test the UI on Vercel immediately.
              </span>
            </div>
            <button
              onClick={() => setIsDeployModalOpen(true)}
              style={{
                color: '#38bdf8',
                fontWeight: 700,
                textDecoration: 'underline',
                fontSize: '0.75rem'
              }}
            >
              How to Deploy Backend →
            </button>
          </div>
        )}

        {/* 2. Top Metric Cards */}
        <StatsCards
          counts={detectionData.counts}
          inferenceTimeMs={detectionData.inference_time_ms}
          imageDimensions={detectionData.image_dimensions}
        />

        {/* 3. Image Uploader & Demo Selector */}
        <ImageUploader
          onImageSelected={handleImageSelected}
          onSampleSelected={handleSampleSelected}
          isAnalyzing={isAnalyzing}
        />

        {/* 4. Controls & Filters Bar */}
        <ControlsBar
          options={displayOptions}
          onChangeOptions={handleUpdateOptions}
          fullResponse={detectionData}
        />

        {/* 5. Main Visual Section: Detection Viewer & Results Breakdown */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
          gap: '1.25rem',
          alignItems: 'start'
        }}>
          {/* Visual Canvas with Responsive Bounding Boxes */}
          <DetectionViewer
            imageUrl={currentImageUrl}
            detections={detectionData.detections}
            displayOptions={displayOptions}
            selectedId={selectedDetectionId}
            onSelectDetection={setSelectedDetectionId}
            hoveredId={hoveredDetectionId}
            onHoverDetection={setHoveredDetectionId}
            isAnalyzing={isAnalyzing}
            imageDimensions={detectionData.image_dimensions}
          />

          {/* Detections List & Table */}
          <DetectionsList
            detections={detectionData.detections}
            displayOptions={displayOptions}
            selectedId={selectedDetectionId}
            onSelectDetection={setSelectedDetectionId}
            hoveredId={hoveredDetectionId}
            onHoverDetection={setHoveredDetectionId}
          />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 14, 0.9)',
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        maxWidth: '1440px',
        width: '100%',
        margin: '2rem auto 0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>TrafficGuard AI</span>
          <span>•</span>
          <span>Dual YOLO Engine (Helmet <code>best.pt</code> + COCO Vehicles)</span>
        </div>
        <div>
          <span>Ready for GitHub & Vercel Deployment</span>
        </div>
      </footer>

      {/* Deployment Modal */}
      <DeploymentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Maximize2,
  AlertTriangle,
  CheckCircle,
  Car,
  Bike,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { DetectionItem, DisplayOptions } from '@/types/detection';

interface DetectionViewerProps {
  imageUrl: string;
  detections: DetectionItem[];
  displayOptions: DisplayOptions;
  selectedId: string | null;
  onSelectDetection: (id: string | null) => void;
  hoveredId: string | null;
  onHoverDetection: (id: string | null) => void;
  isAnalyzing: boolean;
  imageDimensions: { width: number; height: number };
}

export default function DetectionViewer({
  imageUrl,
  detections,
  displayOptions,
  selectedId,
  onSelectDetection,
  hoveredId,
  onHoverDetection,
  isAnalyzing,
  imageDimensions
}: DetectionViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter detections according to user options
  const filteredDetections = detections.filter((det) => {
    if (det.confidence < displayOptions.confidenceThreshold) return false;
    if (displayOptions.filterCategory === 'helmet' && det.category !== 'helmet') return false;
    if (displayOptions.filterCategory === 'vehicle' && det.category !== 'vehicle') return false;
    if (displayOptions.filterCategory === 'violation' && !det.is_violation) return false;
    return true;
  });

  // Export annotated image using HTML5 Canvas
  const handleDownloadAnnotatedImage = async () => {
    if (!imgRef.current) return;
    setIsExporting(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || imageDimensions.width || 1280;
      canvas.height = img.naturalHeight || imageDimensions.height || 720;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw bounding boxes
      filteredDetections.forEach((det) => {
        const x = det.normalized_bbox.norm_x1 * canvas.width;
        const y = det.normalized_bbox.norm_y1 * canvas.height;
        const w = (det.normalized_bbox.norm_x2 - det.normalized_bbox.norm_x1) * canvas.width;
        const h = (det.normalized_bbox.norm_y2 - det.normalized_bbox.norm_y1) * canvas.height;

        // Box border
        ctx.strokeStyle = det.color;
        ctx.lineWidth = det.is_violation ? 4 : 3;
        ctx.strokeRect(x, y, w, h);

        // Box tint
        ctx.fillStyle = `${det.color}22`;
        ctx.fillRect(x, y, w, h);

        // Label pill
        if (displayOptions.showLabels) {
          const text = `${det.class_name}${displayOptions.showConfidence ? ` ${(det.confidence * 100).toFixed(0)}%` : ''}`;
          ctx.font = 'bold 15px sans-serif';
          const textWidth = ctx.measureText(text).width;
          const labelHeight = 26;

          ctx.fillStyle = det.color;
          ctx.fillRect(x, Math.max(0, y - labelHeight), textWidth + 18, labelHeight);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x + 9, Math.max(18, y - 8));
        }
      });

      // Watermark / Brand stamp
      ctx.fillStyle = 'rgba(7, 9, 14, 0.85)';
      ctx.fillRect(16, canvas.height - 40, 240, 30);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('TrafficGuard AI • YOLO Detection', 26, canvas.height - 20);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `traffic-ai-annotated-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export annotated image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Viewer Action Bar */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        background: 'rgba(15, 23, 42, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Layers size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
            Live Inference Canvas
          </span>
          <span style={{
            fontSize: '0.72rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)'
          }}>
            {filteredDetections.length} visible
          </span>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleDownloadAnnotatedImage}
            disabled={isExporting || !imageUrl}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              opacity: isExporting ? 0.6 : 1
            }}
          >
            <Download size={13} />
            <span>{isExporting ? 'Exporting...' : 'Export Annotated'}</span>
          </button>
        </div>
      </div>

      {/* Main Image & Annotation Container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '380px',
          maxHeight: '680px',
          background: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          userSelect: 'none'
        }}
      >
        {/* Scanner line when analyzing */}
        {isAnalyzing && <div className="scanner-line" />}

        {/* The Base Image */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Traffic Scene"
          style={{
            maxWidth: '100%',
            maxHeight: '680px',
            objectFit: 'contain',
            display: 'block'
          }}
        />

        {/* Bounding Boxes Layer */}
        {imageUrl && (
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
          }}>
            {filteredDetections.map((det) => {
              const isSelected = selectedId === det.id;
              const isHovered = hoveredId === det.id;
              const isFocused = isSelected || isHovered;

              const leftPct = det.normalized_bbox.norm_x1 * 100;
              const topPct = det.normalized_bbox.norm_y1 * 100;
              const widthPct = (det.normalized_bbox.norm_x2 - det.normalized_bbox.norm_x1) * 100;
              const heightPct = (det.normalized_bbox.norm_y2 - det.normalized_bbox.norm_y1) * 100;

              return (
                <div
                  key={det.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDetection(isSelected ? null : det.id);
                  }}
                  onMouseEnter={() => onHoverDetection(det.id)}
                  onMouseLeave={() => onHoverDetection(null)}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                    border: `${isFocused ? '3px' : '2px'} ${det.is_violation ? 'dashed' : 'solid'} ${det.color}`,
                    backgroundColor: isFocused
                      ? `${det.color}35`
                      : det.is_violation
                        ? 'rgba(239, 68, 68, 0.18)'
                        : `${det.color}15`,
                    boxShadow: isFocused
                      ? `0 0 16px ${det.color}`
                      : det.is_violation
                        ? '0 0 10px rgba(239, 68, 68, 0.35)'
                        : 'none',
                    zIndex: isFocused ? 25 : det.is_violation ? 20 : 10,
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    transition: 'all 0.15s ease-out'
                  }}
                >
                  {/* Corner Accent Ticks */}
                  <div style={{ position: 'absolute', top: -1, left: -1, width: 8, height: 8, borderTop: `2px solid ${det.color}`, borderLeft: `2px solid ${det.color}` }} />
                  <div style={{ position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderTop: `2px solid ${det.color}`, borderRight: `2px solid ${det.color}` }} />
                  <div style={{ position: 'absolute', bottom: -1, left: -1, width: 8, height: 8, borderBottom: `2px solid ${det.color}`, borderLeft: `2px solid ${det.color}` }} />
                  <div style={{ position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, borderBottom: `2px solid ${det.color}`, borderRight: `2px solid ${det.color}` }} />

                  {/* Floating Label */}
                  {displayOptions.showLabels && (
                    <div style={{
                      position: 'absolute',
                      top: topPct > 8 ? '-24px' : '0px',
                      left: 0,
                      transform: topPct > 8 ? 'none' : 'translateY(100%)',
                      background: det.color,
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                      pointerEvents: 'none'
                    }}>
                      {det.is_violation ? (
                        <AlertTriangle size={11} strokeWidth={2.5} />
                      ) : det.category === 'helmet' ? (
                        <CheckCircle size={11} strokeWidth={2.5} />
                      ) : det.class_name.toLowerCase() === 'motorcycle' ? (
                        <Bike size={11} strokeWidth={2.5} />
                      ) : (
                        <Car size={11} strokeWidth={2.5} />
                      )}
                      <span>{det.class_name}</span>
                      {displayOptions.showConfidence && (
                        <span style={{ opacity: 0.9, fontWeight: 500 }}>
                          {(det.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Box Inspector Pill */}
      {selectedId && (() => {
        const item = detections.find((d) => d.id === selectedId);
        if (!item) return null;
        return (
          <div style={{
            padding: '0.65rem 1.25rem',
            background: 'rgba(15, 23, 42, 0.9)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: item.color,
                display: 'inline-block'
              }} />
              <strong style={{ color: '#f8fafc' }}>{item.class_name}</strong>
              <span style={{ color: 'var(--text-muted)' }}>ID: {item.id}</span>
              <span style={{
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                background: `${item.color}25`,
                color: item.color,
                fontWeight: 600
              }}>
                {(item.confidence * 100).toFixed(1)}% Confidence
              </span>
              {item.is_violation && (
                <span style={{
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  background: 'rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  fontWeight: 700
                }}>
                  CRITICAL INFRACTION
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>BBox: [{item.bbox.x1}, {item.bbox.y1}, {item.bbox.x2}, {item.bbox.y2}] px</span>
              <button
                onClick={() => onSelectDetection(null)}
                style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600 }}
              >
                Clear Selection
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

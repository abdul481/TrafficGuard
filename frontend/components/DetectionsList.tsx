'use client';

import React from 'react';
import {
  ListFilter,
  CheckCircle2,
  AlertOctagon,
  Car,
  Bike,
  Shield,
  Search
} from 'lucide-react';
import { DetectionItem, DisplayOptions } from '@/types/detection';

interface DetectionsListProps {
  detections: DetectionItem[];
  displayOptions: DisplayOptions;
  selectedId: string | null;
  onSelectDetection: (id: string | null) => void;
  hoveredId: string | null;
  onHoverDetection: (id: string | null) => void;
}

export default function DetectionsList({
  detections,
  displayOptions,
  selectedId,
  onSelectDetection,
  hoveredId,
  onHoverDetection
}: DetectionsListProps) {
  const filteredDetections = detections.filter((det) => {
    if (det.confidence < displayOptions.confidenceThreshold) return false;
    if (displayOptions.filterCategory === 'helmet' && det.category !== 'helmet') return false;
    if (displayOptions.filterCategory === 'vehicle' && det.category !== 'vehicle') return false;
    if (displayOptions.filterCategory === 'violation' && !det.is_violation) return false;
    return true;
  });

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Table Header / Toolbar */}
      <div style={{
        padding: '0.9rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ListFilter size={16} color="#38bdf8" />
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            Detection Breakdown
          </h3>
          <span style={{
            fontSize: '0.72rem',
            padding: '0.1rem 0.5rem',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            fontWeight: 600
          }}>
            {filteredDetections.length} objects
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto', maxHeight: '340px', overflowY: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.78rem'
        }}>
          <thead>
            <tr style={{
              background: 'rgba(7, 9, 14, 0.6)',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <th style={{ padding: '0.65rem 1rem' }}>ID</th>
              <th style={{ padding: '0.65rem 1rem' }}>Class / Target</th>
              <th style={{ padding: '0.65rem 1rem' }}>Category</th>
              <th style={{ padding: '0.65rem 1rem' }}>Confidence</th>
              <th style={{ padding: '0.65rem 1rem' }}>Safety Status</th>
              <th style={{ padding: '0.65rem 1rem' }}>Bounding Box [X1, Y1, X2, Y2]</th>
            </tr>
          </thead>
          <tbody>
            {filteredDetections.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  No detections match current filter or confidence threshold.
                </td>
              </tr>
            ) : (
              filteredDetections.map((det) => {
                const isSelected = selectedId === det.id;
                const isHovered = hoveredId === det.id;
                const isFocused = isSelected || isHovered;

                return (
                  <tr
                    key={det.id}
                    onClick={() => onSelectDetection(isSelected ? null : det.id)}
                    onMouseEnter={() => onHoverDetection(det.id)}
                    onMouseLeave={() => onHoverDetection(null)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isFocused
                        ? `${det.color}15`
                        : det.is_violation
                          ? 'rgba(239, 68, 68, 0.05)'
                          : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* ID */}
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {det.id}
                    </td>

                    {/* Class */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          background: det.color,
                          display: 'inline-block'
                        }} />
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                          {det.class_name}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        background: det.category === 'helmet' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                        color: det.category === 'helmet' ? '#34d399' : '#7dd3fc',
                        textTransform: 'capitalize'
                      }}>
                        {det.category}
                      </span>
                    </td>

                    {/* Confidence Meter */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '45px',
                          height: '5px',
                          borderRadius: '9999px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${det.confidence * 100}%`,
                            height: '100%',
                            background: det.color
                          }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#f8fafc' }}>
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Safety Status */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {det.is_violation ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontWeight: 700 }}>
                          <AlertOctagon size={13} />
                          <span>VIOLATION</span>
                        </div>
                      ) : det.category === 'helmet' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 600 }}>
                          <CheckCircle2 size={13} />
                          <span>Protected</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Standard</span>
                      )}
                    </td>

                    {/* Bounding Box Coordinates */}
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      [{det.bbox.x1}, {det.bbox.y1}, {det.bbox.x2}, {det.bbox.y2}]
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

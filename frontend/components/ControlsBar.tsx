'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Check,
  Copy,
  Download,
  AlertTriangle,
  Car,
  Shield,
  Layers
} from 'lucide-react';
import { DisplayOptions, FilterCategory, DetectionResponse } from '@/types/detection';

interface ControlsBarProps {
  options: DisplayOptions;
  onChangeOptions: (updated: Partial<DisplayOptions>) => void;
  fullResponse: DetectionResponse | null;
}

export default function ControlsBar({
  options,
  onChangeOptions,
  fullResponse
}: ControlsBarProps) {
  const [copiedJson, setCopiedJson] = useState(false);

  const handleCopyJson = () => {
    if (!fullResponse) return;
    navigator.clipboard.writeText(JSON.stringify(fullResponse, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!fullResponse) return;
    const blob = new Blob([JSON.stringify(fullResponse, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-ai-predictions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories: { key: FilterCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'all', label: 'All Objects', icon: <Layers size={13} />, color: '#f8fafc' },
    { key: 'helmet', label: 'Helmets', icon: <Shield size={13} />, color: '#10b981' },
    { key: 'vehicle', label: 'Vehicles', icon: <Car size={13} />, color: '#38bdf8' },
    { key: 'violation', label: 'Violations Only', icon: <AlertTriangle size={13} />, color: '#ef4444' }
  ];

  return (
    <div className="glass-panel" style={{
      padding: '0.9rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      width: '100%'
    }}>
      {/* Category Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
          FILTER:
        </span>
        {categories.map((cat) => {
          const isActive = options.filterCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onChangeOptions({ filterCategory: cat.key })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: isActive ? `${cat.color}25` : 'var(--bg-surface)',
                border: `1px solid ${isActive ? cat.color : 'var(--border-subtle)'}`,
                color: isActive ? '#f8fafc' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ color: cat.color }}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Confidence Threshold Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '220px' }}>
        <SlidersHorizontal size={14} color="#38bdf8" />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <span>Min Confidence</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>
              {(options.confidenceThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.95"
            step="0.05"
            value={options.confidenceThreshold}
            onChange={(e) => onChangeOptions({ confidenceThreshold: parseFloat(e.target.value) })}
            style={{
              width: '100%',
              accentColor: '#38bdf8',
              cursor: 'pointer',
              marginTop: '0.25rem'
            }}
          />
        </div>
      </div>

      {/* Toggles and JSON Export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Toggle Labels */}
        <button
          onClick={() => onChangeOptions({ showLabels: !options.showLabels })}
          style={{
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: options.showLabels ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface)',
            border: `1px solid ${options.showLabels ? 'rgba(56, 189, 248, 0.35)' : 'var(--border-subtle)'}`,
            color: options.showLabels ? '#38bdf8' : 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 600
          }}
        >
          Labels: {options.showLabels ? 'ON' : 'OFF'}
        </button>

        {/* Toggle Confidence */}
        <button
          onClick={() => onChangeOptions({ showConfidence: !options.showConfidence })}
          style={{
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: options.showConfidence ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-surface)',
            border: `1px solid ${options.showConfidence ? 'rgba(139, 92, 246, 0.35)' : 'var(--border-subtle)'}`,
            color: options.showConfidence ? '#c084fc' : 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 600
          }}
        >
          Scores: {options.showConfidence ? 'ON' : 'OFF'}
        </button>

        {/* Copy JSON */}
        <button
          onClick={handleCopyJson}
          title="Copy raw predictions JSON"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: copiedJson ? '#10b981' : 'var(--text-secondary)',
            fontSize: '0.72rem',
            fontWeight: 600
          }}
        >
          {copiedJson ? <Check size={12} /> : <Copy size={12} />}
          <span>{copiedJson ? 'Copied' : 'JSON'}</span>
        </button>

        {/* Download JSON */}
        <button
          onClick={handleDownloadJson}
          title="Download raw predictions file"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.72rem',
            fontWeight: 600
          }}
        >
          <Download size={12} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}

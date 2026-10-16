'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  onSampleSelected: (samplePath: string, name: string) => void;
  isAnalyzing: boolean;
}

export default function ImageUploader({
  onImageSelected,
  onSampleSelected,
  isAnalyzing
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('Image file is too large (max 20MB).');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onImageSelected(file, previewUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', width: '100%' }}>
      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragOver ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)'}`,
          borderRadius: '16px',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          background: isDragOver ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 23, 42, 0.4)',
          transition: 'all 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.85rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
        }}>
          <UploadCloud size={28} color="#38bdf8" />
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
          {isAnalyzing ? 'Analyzing Traffic Scene...' : 'Drop traffic image here or click to browse'}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: 0 }}>
          Upload high-resolution camera feeds, street photos, or road footage frames (JPG, PNG, WebP up to 20MB).
        </p>

        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginTop: '0.75rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            fontSize: '0.75rem'
          }}>
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Preset Demo Samples */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          marginBottom: '0.65rem'
        }}>
          <Sparkles size={14} color="#f59e0b" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Demo Presets:
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.65rem'
        }}>
          {/* Preset 1 */}
          <button
            onClick={() => onSampleSelected('/samples/sample1.svg', 'Urban Intersection & Riders')}
            disabled={isAnalyzing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface-hover)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img src="/samples/sample1.svg" alt="Preset 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                Urban Riders & Street
              </div>
              <div style={{ fontSize: '0.68rem', color: '#10b981' }}>
                Helmets + 1 Violation + 3 Cars
              </div>
            </div>
          </button>

          {/* Preset 2 */}
          <button
            onClick={() => onSampleSelected('/samples/sample2.svg', 'Highway Flow & Vehicles')}
            disabled={isAnalyzing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface-hover)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img src="/samples/sample2.svg" alt="Preset 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                Expressway Traffic
              </div>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8' }}>
                High-Speed Vehicles & Rider
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

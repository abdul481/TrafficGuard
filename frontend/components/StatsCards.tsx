'use client';

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Car,
  Bike,
  Activity,
  Zap,
  Gauge
} from 'lucide-react';
import { DetectionCounts } from '@/types/detection';

interface StatsCardsProps {
  counts: DetectionCounts;
  inferenceTimeMs: number;
  imageDimensions: { width: number; height: number };
}

export default function StatsCards({ counts, inferenceTimeMs, imageDimensions }: StatsCardsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'SAFE':
        return '#10B981';
      case 'MODERATE':
        return '#F59E0B';
      case 'CRITICAL':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '1rem',
      width: '100%'
    }}>
      {/* 1. With Helmet Card */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--accent-emerald)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            With Helmet
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={18} color="#10B981" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
            {counts.total_with_helmet}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}>
            Compliant
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>
          Riders adhering to safety regulations
        </p>
      </div>

      {/* 2. Without Helmet (Violations) Card */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--accent-crimson)',
        boxShadow: counts.total_without_helmet > 0 ? 'var(--shadow-glow-crimson)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            No Helmet (Violations)
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: counts.total_without_helmet > 0 ? 'pulseGlow 2s infinite ease-in-out' : 'none'
          }}>
            <ShieldAlert size={18} color="#EF4444" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, color: counts.total_without_helmet > 0 ? '#ef4444' : '#f8fafc', lineHeight: 1 }}>
            {counts.total_without_helmet}
          </span>
          {counts.total_without_helmet > 0 && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.25)',
              color: '#f87171'
            }}>
              ALERT
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>
          Direct safety infraction flagged
        </p>
      </div>

      {/* 3. Vehicles Overview Card */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderLeft: '4px solid var(--accent-blue)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Vehicles Detected
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car size={18} color="#38BDF8" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
            {counts.total_vehicles}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total vehicles
          </span>
        </div>
        {/* Breakdown pills */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.55rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.68rem',
            padding: '0.15rem 0.4rem',
            borderRadius: '6px',
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#7dd3fc'
          }}>
            🚗 {counts.total_cars} Cars
          </span>
          <span style={{
            fontSize: '0.68rem',
            padding: '0.15rem 0.4rem',
            borderRadius: '6px',
            background: 'rgba(139, 92, 246, 0.12)',
            color: '#c084fc'
          }}>
            🏍️ {counts.total_motorcycles} Motos
          </span>
          <span style={{
            fontSize: '0.68rem',
            padding: '0.15rem 0.4rem',
            borderRadius: '6px',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#fcd34d'
          }}>
            🚲 {counts.total_bicycles} Bikes
          </span>
        </div>
      </div>

      {/* 4. Compliance & Risk Card */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderLeft: `4px solid ${getRiskColor(counts.risk_level)}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Safety Compliance
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Gauge size={18} color={getRiskColor(counts.risk_level)} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
            {counts.safety_compliance_rate}%
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.15rem 0.45rem',
            borderRadius: '6px',
            color: getRiskColor(counts.risk_level),
            background: `${getRiskColor(counts.risk_level)}20`
          }}>
            {counts.risk_level}
          </span>
        </div>
        {/* Compliance mini progress bar */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '9999px',
          marginTop: '0.65rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${counts.safety_compliance_rate}%`,
            height: '100%',
            background: getRiskColor(counts.risk_level),
            borderRadius: '9999px',
            transition: 'width 0.6s ease'
          }} />
        </div>
      </div>

      {/* 5. Latency & Tech Specs Card */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderLeft: '4px solid var(--accent-violet)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Inference Latency
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={18} color="#8B5CF6" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
            {inferenceTimeMs}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ms</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>
          {imageDimensions.width} × {imageDimensions.height} px • Dual YOLO
        </p>
      </div>
    </div>
  );
}

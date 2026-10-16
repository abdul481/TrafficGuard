'use client';

import React from 'react';
import { ShieldCheck, Cpu, Radio, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import { BackendHealth } from '@/lib/api';

interface HeaderProps {
  backendHealth: BackendHealth;
  isCheckingHealth: boolean;
  onRefreshHealth: () => void;
  onOpenDeployModal: () => void;
}

export default function Header({
  backendHealth,
  isCheckingHealth,
  onRefreshHealth,
  onOpenDeployModal
}: HeaderProps) {
  return (
    <header style={{
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.82)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.9rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10B981, #06B6D4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
        }}>
          <ShieldCheck size={24} color="#ffffff" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #ffffff 40%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              TrafficGuard AI
            </h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              YOLO DUAL-ENGINE
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Real-time Helmet Compliance & Road Vehicle Intelligence
          </p>
        </div>
      </div>

      {/* Model Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        flexWrap: 'wrap'
      }}>
        {/* Custom Model Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.7rem',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontSize: '0.72rem',
          color: '#34d399'
        }}>
          <Cpu size={13} />
          <span style={{ fontWeight: 600 }}>Helmet Model:</span>
          <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
            best.pt
          </code>
        </div>

        {/* Pretrained Model Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.7rem',
          borderRadius: '9999px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          fontSize: '0.72rem',
          color: '#c084fc'
        }}>
          <Cpu size={13} />
          <span style={{ fontWeight: 600 }}>Vehicles:</span>
          <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
            COCO Pretrained
          </code>
        </div>
      </div>

      {/* Backend Status & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Health pill */}
        <div
          title={backendHealth.isOnline ? `Connected to ${backendHealth.apiUrl}` : `Backend offline at ${backendHealth.apiUrl}. Running in Demo/Simulation mode.`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            background: backendHealth.isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${backendHealth.isOnline ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: backendHealth.isOnline ? '#34d399' : '#fbbf24'
          }}
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: backendHealth.isOnline ? '#10B981' : '#F59E0B',
            boxShadow: backendHealth.isOnline ? '0 0 8px #10B981' : '0 0 8px #F59E0B',
            display: 'inline-block'
          }} />
          <span>{backendHealth.isOnline ? 'FastAPI Online' : 'Simulation Mode'}</span>

          <button
            onClick={onRefreshHealth}
            disabled={isCheckingHealth}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'inherit',
              padding: '2px',
              borderRadius: '4px',
              opacity: isCheckingHealth ? 0.4 : 0.8
            }}
            title="Refresh backend connection"
          >
            <RefreshCw size={12} className={isCheckingHealth ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Deploy Guide Button */}
        <button
          onClick={onOpenDeployModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '10px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
        >
          <BookOpen size={14} color="#38bdf8" />
          <span>Deploy Instructions</span>
        </button>
      </div>
    </header>
  );
}

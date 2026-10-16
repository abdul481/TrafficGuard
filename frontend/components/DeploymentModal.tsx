'use client';

import React, { useState } from 'react';
import {
  X,
  Globe,
  Server,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  Code2,
  Cpu
} from 'lucide-react';

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeploymentModal({ isOpen, onClose }: DeploymentModalProps) {
  const [activeTab, setActiveTab] = useState<'github' | 'vercel' | 'backend' | 'env'>('vercel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.2rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={18} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Deployment & GitHub Setup Guide
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Step-by-step instructions to upload to GitHub, deploy to Vercel, and run FastAPI backend.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(7, 9, 14, 0.5)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'github', label: '1. Push to GitHub', icon: <GithubIcon size={14} /> },
            { id: 'vercel', label: '2. Deploy on Vercel', icon: <Globe size={14} /> },
            { id: 'backend', label: '3. Host FastAPI Backend', icon: <Server size={14} /> },
            { id: 'env', label: '4. Environment Variables', icon: <Code2 size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                border: `1px solid ${activeTab === tab.id ? '#38bdf8' : 'transparent'}`,
                color: activeTab === tab.id ? '#38bdf8' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, fontSize: '0.85rem', lineHeight: 1.6 }}>
          {/* TAB 1: GITHUB */}
          {activeTab === 'github' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                How to Push Your Project to GitHub
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Your project is organized cleanly with <code>frontend/</code> and <code>backend/</code>. Follow these commands in PowerShell or Terminal from the project root:
              </p>

              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <pre style={{
                  background: '#020617',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: '#38bdf8',
                  overflowX: 'auto'
                }}>
{`# 1. Open your project folder in terminal
cd "c:\\Users\\Abdul Rehman\\Desktop\\ai ahghaa"

# 2. Initialize git repository
git init

# 3. Add all files (frontend, backend, models)
git add .

# 4. Commit files
git commit -m "Initial commit: Traffic Safety AI Next.js frontend + FastAPI backend"

# 5. Link your GitHub repo and push (replace YOUR_USERNAME and YOUR_REPO)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main`}
                </pre>
                <button
                  onClick={() => copyCode(`git init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git\ngit push -u origin main`, 'git-commands')}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#f8fafc',
                    fontSize: '0.7rem'
                  }}
                >
                  {copiedKey === 'git-commands' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div style={{
                padding: '0.85rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.78rem'
              }}>
                <strong>Tip for best.pt file:</strong> Your trained <code>best.pt</code> is ~5.2 MB, which is well under GitHub's 100 MB per-file limit, so it can be pushed directly without needing Git LFS!
              </div>
            </div>
          )}

          {/* TAB 2: VERCEL */}
          {activeTab === 'vercel' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                How to Deploy Next.js to Vercel (Step-by-Step)
              </h3>
              <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li>
                  Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>vercel.com/dashboard</a> and click <strong>"Add New..." → "Project"</strong>.
                </li>
                <li>
                  Import your GitHub repository containing this codebase.
                </li>
                <li>
                  In the <strong>"Project Configuration"</strong> screen:
                  <div style={{
                    margin: '0.5rem 0',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: '#020617',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem'
                  }}>
                    <div>• <strong>Framework Preset:</strong> Next.js (Auto-detected)</div>
                    <div>• <strong>Root Directory:</strong> Click <em>Edit</em> and select <code>frontend</code></div>
                    <div>• <strong>Build Command:</strong> <code>npm run build</code> (default)</div>
                    <div>• <strong>Output Directory:</strong> <code>.next</code> (default)</div>
                  </div>
                </li>
                <li>
                  Under <strong>"Environment Variables"</strong>, add:
                  <div style={{
                    margin: '0.5rem 0',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: '#020617',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: '#10b981'
                  }}>
                    Key: NEXT_PUBLIC_API_URL<br />
                    Value: https://your-fastapi-backend.onrender.com
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    (If your backend is not deployed yet, leave it empty or default to http://localhost:8000; the frontend will smoothly operate in interactive demo mode on Vercel!)
                  </span>
                </li>
                <li>
                  Click <strong>Deploy</strong>! In about 45 seconds, your website will be live at <code>https://your-project.vercel.app</code>.
                </li>
              </ol>
            </div>
          )}

          {/* TAB 3: BACKEND */}
          {activeTab === 'backend' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                How to Host the FastAPI Python Backend
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Because the backend runs PyTorch and loads <code>best.pt</code>, deploy it to a Python container host:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {/* Option 1: Render */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <strong style={{ color: '#38bdf8' }}>Option A: Render.com (Recommended Free Tier)</strong>
                  <ol style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    <li>Sign up at <a href="https://render.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>render.com</a></li>
                    <li>Click <strong>New +</strong> → <strong>Web Service</strong></li>
                    <li>Connect your GitHub repo</li>
                    <li>Root Directory: <code>backend</code></li>
                    <li>Runtime: <strong>Python 3</strong> or <strong>Docker</strong> (using the included <code>Dockerfile</code>)</li>
                    <li>Start Command: <code>uvicorn main:app --host 0.0.0.0 --port $PORT</code></li>
                  </ol>
                </div>

                {/* Option 2: Railway */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <strong style={{ color: '#a855f7' }}>Option B: Railway.app / Hugging Face Spaces</strong>
                  <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    Deploy as a Docker container using our included production <code>Dockerfile</code>. It automatically sets up OpenCV, PyTorch, Uvicorn, and loads <code>best.pt</code>!
                  </p>
                </div>
              </div>

              {/* Local testing command */}
              <h4 style={{ fontSize: '0.85rem', color: '#f8fafc', marginBottom: '0.4rem' }}>
                Running Backend Locally:
              </h4>
              <pre style={{
                background: '#020617',
                padding: '0.75rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#34d399'
              }}>
{`cd backend
py -m pip install -r requirements.txt
py run.py`}
              </pre>
            </div>
          )}

          {/* TAB 4: ENV */}
          {activeTab === 'env' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Connecting Frontend to Backend Environment Variables
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                The Next.js frontend uses <code>NEXT_PUBLIC_API_URL</code> to know where to send image upload requests for inference.
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#020617', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem' }}>Environment</th>
                    <th style={{ padding: '0.65rem' }}>Variable Name</th>
                    <th style={{ padding: '0.65rem' }}>Value Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem', color: '#38bdf8' }}>Local Development</td>
                    <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>NEXT_PUBLIC_API_URL</td>
                    <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>http://localhost:8000</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem', color: '#10b981' }}>Production (Vercel)</td>
                    <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>NEXT_PUBLIC_API_URL</td>
                    <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>https://your-backend.onrender.com</td>
                  </tr>
                </tbody>
              </table>

              <div style={{
                marginTop: '1.25rem',
                padding: '0.85rem',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#7dd3fc',
                fontSize: '0.78rem'
              }}>
                <strong>CORS Handled Automatically:</strong> The FastAPI backend in <code>backend/main.py</code> is already configured with <code>allow_origins=["*"]</code>, so your Vercel URL will never suffer from cross-origin blocking!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.9rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(15, 23, 42, 0.7)'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.45rem 1.25rem',
              borderRadius: '8px',
              background: '#38bdf8',
              color: '#020617',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export const metadata: Metadata = {
  title: 'TrafficGuard AI — Real-time Helmet & Vehicle Detection Platform',
  description: 'Modern AI-powered road safety inspection web application powered by YOLO helmet detection (best.pt) and vehicle recognition (cars, motorcycles, bicycles).',
  keywords: ['traffic safety', 'YOLO', 'helmet detection', 'motorcycle safety', 'vehicle recognition', 'computer vision', 'Next.js', 'FastAPI'],
  authors: [{ name: 'TrafficGuard AI' }],
  openGraph: {
    title: 'TrafficGuard AI — Traffic Safety Detection',
    description: 'Real-time Helmet Compliance & Road Vehicle Intelligence with YOLO AI.',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}

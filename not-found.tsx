"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const BARS = [4, 7, 5, 9, 6, 8, 4, 7, 5, 6, 9, 5, 7, 4, 8];

export default function NotFound() {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bars = barsRef.current?.querySelectorAll<HTMLElement>(".bar");
    if (!bars) return;

    bars.forEach((bar, i) => {
      const animate = () => {
        const height = 20 + Math.random() * 60;
        const duration = 300 + Math.random() * 400;
        bar.style.transition = `height ${duration}ms ease-in-out`;
        bar.style.height = `${height}%`;
        setTimeout(animate, duration + Math.random() * 200);
      };
      setTimeout(animate, i * 80);
    });
  }, []);

  return (
    <div className="not-found-page">
      <div className="content">
        <div className="visualizer" ref={barsRef} aria-hidden="true">
          {BARS.map((h, i) => (
            <div
              key={i}
              className="bar"
              style={{ height: `${h * 10}%`, animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        <div className="error-code">404</div>
        <h1 className="title">Cette piste est introuvable</h1>
        <p className="subtitle">
          La page que tu cherches a peut-être été supprimée ou n&apos;existe pas.
        </p>

        <div className="actions">
          <Link href="/dashboard" className="btn-primary">
            Retour à l&apos;accueil
          </Link>
          <Link href="/search" className="btn-secondary">
            Rechercher de la musique
          </Link>
        </div>
      </div>

      <style>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          padding: 2rem;
        }

        .content {
          text-align: center;
          max-width: 480px;
          width: 100%;
        }

        .visualizer {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 5px;
          height: 80px;
          margin-bottom: 2.5rem;
        }

        .bar {
          width: 6px;
          border-radius: 3px 3px 0 0;
          background: linear-gradient(to top, #a855f7, #ec4899);
          opacity: 0.5;
          min-height: 8px;
        }

        .error-code {
          font-size: clamp(6rem, 20vw, 9rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          user-select: none;
        }

        .title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0 0 0.75rem;
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 2.5rem;
        }

        .actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          padding: 0.65rem 1.5rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
        }

        .btn-primary:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 0.65rem 1.5rem;
          border-radius: 999px;
          background: transparent;
          border: 1px solid #334155;
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: border-color 0.15s, color 0.15s, transform 0.15s;
        }

        .btn-secondary:hover {
          border-color: #64748b;
          color: #f1f5f9;
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .actions {
            flex-direction: column;
            align-items: center;
          }
          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

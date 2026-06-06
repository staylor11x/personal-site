'use client';

import React from 'react';

export default function AnimatedArtwork() {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <style>{`
          @keyframes flow {
            from { stroke-dashoffset: 200; }
            to   { stroke-dashoffset: 0; }
          }
          @keyframes orbit {
            from { stroke-dashoffset: 238.8; }
            to   { stroke-dashoffset: 0; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50%      { opacity: 0.9; }
          }
          .bm { stroke: #f0f; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none; }
          .bg { stroke: #0f0; stroke-width: 1.5; stroke-linecap: round; fill: none; }
          .bc { stroke: #0ff; stroke-width: 1.5; stroke-linecap: round; fill: none; }
          .sq { stroke: #f0f; stroke-width: 1.5; stroke-dasharray: 4 4; fill: none; }
          @media (prefers-reduced-motion: reduce) {
            line, path, circle, rect {
              animation: none !important;
            }
          }
        `}</style>
        <pattern id="dotPattern" x="6" y="6" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1.5" fill="#f0f" opacity="0.35" />
        </pattern>
      </defs>

      <rect width="1000" height="1000" fill="#0a0f1f" />

      {/* Base lines */}
      <g opacity="0.45">
        <line x1="-10" y1="160" x2="830" y2="160" className="bm" />
        <line x1="336" y1="0" x2="336" y2="250" className="bg" />
        <line x1="708" y1="0" x2="708" y2="220" className="bm" />
        <circle cx="708" cy="258" r="38" className="bm" />
        <line x1="-10" y1="340" x2="790" y2="340" className="bg" />
        <line x1="207" y1="160" x2="207" y2="500" className="bm" />
        <line x1="207" y1="468" x2="1000" y2="468" className="bm" />
        <path d="M -10,547 L 245,547 L 245,630" className="bm" />
        <line x1="494" y1="385" x2="494" y2="880" className="bc" />
        <line x1="325" y1="710" x2="1000" y2="710" className="bc" />
        <line x1="731" y1="385" x2="731" y2="1000" className="bm" />
        <line x1="-10" y1="925" x2="422" y2="925" className="bm" />
      </g>

      {/* Square */}
      <rect x="165" y="630" width="160" height="160" fill="url(#dotPattern)" />
      <rect x="165" y="630" width="160" height="160" className="sq" style={{ animation: 'pulse 3s infinite ease-in-out' }} />

      {/* Flowing magenta lines */}
      <g stroke="#f0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="60 140" style={{ filter: 'drop-shadow(0 0 3px #f0f)' }}>
        <line x1="-10" y1="160" x2="830" y2="160" style={{ animation: 'flow 3s infinite linear' }} />
        <line x1="708" y1="0" x2="708" y2="220" style={{ animation: 'flow 5s infinite linear' }} />
        <line x1="207" y1="160" x2="207" y2="500" style={{ animation: 'flow 5s infinite linear' }} />
        <line x1="207" y1="468" x2="1000" y2="468" style={{ animation: 'flow 3s infinite linear' }} />
        <path d="M -10,547 L 245,547 L 245,630" style={{ animation: 'flow 5s infinite linear' }} />
        <line x1="731" y1="385" x2="731" y2="1000" style={{ animation: 'flow 7s infinite linear' }} />
        <line x1="-10" y1="925" x2="422" y2="925" style={{ animation: 'flow 5s infinite linear' }} />
      </g>

      {/* Flowing green lines */}
      <g stroke="#0f0" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="60 140" style={{ filter: 'drop-shadow(0 0 3px #0f0)' }}>
        <line x1="336" y1="0" x2="336" y2="250" style={{ animation: 'flow 5s infinite linear' }} />
        <line x1="-10" y1="340" x2="790" y2="340" style={{ animation: 'flow 7s infinite linear' }} />
      </g>

      {/* Flowing cyan lines */}
      <g stroke="#0ff" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="60 140" style={{ filter: 'drop-shadow(0 0 3px #0ff)' }}>
        <line x1="494" y1="385" x2="494" y2="880" style={{ animation: 'flow 5s infinite linear' }} />
        <line x1="325" y1="710" x2="1000" y2="710" style={{ animation: 'flow 3s infinite linear' }} />
      </g>

      {/* Circle with orbiting dot */}
      <circle cx="708" cy="258" r="38" stroke="#f0f" strokeWidth="2.5" fill="none" strokeDasharray="60 178.8" style={{ filter: 'drop-shadow(0 0 3px #f0f)', animation: 'orbit 4s infinite linear' }} />
    </svg>
  );
}

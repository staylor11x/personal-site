'use client';

import React, { useEffect, useRef } from 'react';

export default function AnimatedArtwork() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Add animation styles to document if not exists
    if (!document.getElementById('animated-artwork-styles')) {
      const style = document.createElement('style');
      style.id = 'animated-artwork-styles';
      style.innerHTML = `
        @keyframes drawLine {
          0% {
            stroke-dashoffset: var(--dash-length);
            opacity: 0.2;
          }
          30% {
            opacity: 0.7;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          70% {
            opacity: 0.7;
          }
          100% {
            stroke-dashoffset: calc(var(--dash-length) * -1);
            opacity: 0.2;
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            filter: drop-shadow(0 0 1px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 6px currentColor);
          }
        }

        @keyframes flowCircle {
          0%, 100% {
            filter: drop-shadow(0 0 2px currentColor);
            opacity: 0.6;
          }
          50% {
            filter: drop-shadow(0 0 8px currentColor);
            opacity: 1;
          }
        }

        .animated-line {
          --dash-length: 500;
          animation: drawLine 4s infinite ease-in-out;
        }

        .animated-line-fast {
          --dash-length: 400;
          animation: drawLine 3s infinite ease-in-out;
        }

        .animated-line-slow {
          --dash-length: 600;
          animation: drawLine 5s infinite ease-in-out;
        }

        .dotted-rect {
          animation: glowPulse 2.5s infinite ease-in-out;
          opacity: 0.6;
        }

        .circle-glow {
          animation: flowCircle 2.5s infinite ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 912 1020"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <style>{`
          .line-cyan {
            stroke: #0ff;
            stroke-width: 2;
            stroke-linecap: round;
            fill: none;
          }
          .line-magenta {
            stroke: #f0f;
            stroke-width: 2;
            stroke-linecap: round;
            fill: none;
          }
          .line-green {
            stroke: #0f0;
            stroke-width: 2;
            stroke-linecap: round;
            fill: none;
          }
        `}</style>
      </defs>

      {/* Background */}
      <rect width="912" height="1020" fill="#0a0f1f" />

      {/* Animated lines with staggered animation timings */}
      
      {/* Top horizontal line */}
      <line x1="0" y1="120" x2="912" y2="120" className="line-magenta animated-line" />
      
      {/* Horizontal line middle */}
      <line x1="0" y1="375" x2="912" y2="375" className="line-cyan animated-line-slow" />

      {/* Left vertical lines */}
      <line x1="160" y1="120" x2="160" y2="540" className="line-magenta animated-line-fast" />
      <line x1="230" y1="120" x2="230" y2="370" className="line-magenta animated-line" />
      <line x1="0" y1="425" x2="195" y2="425" className="line-magenta animated-line-fast" />

      {/* Center vertical lines */}
      <line x1="270" y1="0" x2="270" y2="195" className="line-green animated-line" />
      <line x1="380" y1="300" x2="380" y2="675" className="line-cyan animated-line-fast" />

      {/* Right area - vertical lines */}
      <line x1="545" y1="120" x2="545" y2="850" className="line-magenta animated-line-slow" />
      <line x1="800" y1="290" x2="800" y2="850" className="line-cyan animated-line" />

      {/* Right horizontal lines */}
      <line x1="545" y1="175" x2="912" y2="175" className="line-magenta animated-line" />
      <line x1="225" y1="540" x2="912" y2="540" className="line-magenta animated-line" />
      <line x1="355" y1="790" x2="912" y2="790" className="line-cyan animated-line-fast" />

      {/* Top right circle - with glow animation */}
      <circle
        cx="775"
        cy="230"
        r="45"
        fill="none"
        className="line-magenta circle-glow"
        style={{
          stroke: '#f0f',
          strokeWidth: '2',
        }}
      />

      {/* Dotted rectangle (lower left) */}
      <rect
        x="180"
        y="685"
        width="175"
        height="125"
        fill="none"
        className="line-magenta dotted-rect"
        style={{
          strokeDasharray: '5,5',
          stroke: '#f0f',
          strokeWidth: '2',
        }}
      />

      {/* Inner fill pattern for rectangle */}
      <defs>
        <pattern id="dotPattern" x="8" y="8" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="2" fill="#f0f" opacity="0.4" />
        </pattern>
      </defs>
      <rect
        x="180"
        y="685"
        width="175"
        height="125"
        fill="url(#dotPattern)"
        opacity="0.5"
      />
    </svg>
  );
}

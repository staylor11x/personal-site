'use client';

import React from 'react';
import AnimatedArtwork from './AnimatedArtwork';

class SVGErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function SynthwaveHeroImage() {
  return (
    <div className="relative h-full min-h-56 w-full overflow-hidden">
      <SVGErrorBoundary
        fallback={
          <img
            src="/images/site-pic.png"
            alt="Swirly plant abstract art"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        }
      >
        <div className="absolute inset-0">
          <AnimatedArtwork />
        </div>
      </SVGErrorBoundary>
      <noscript>
        <img
          src="/images/site-pic.png"
          alt="Swirly plant abstract art"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </noscript>
    </div>
  );
}

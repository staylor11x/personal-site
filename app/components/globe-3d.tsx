"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";
import type { Marker } from "../../lib/markers";

type Globe3DProps = {
  markers: Marker[];
  activeIndex: number | null;
  journeyWithArcs: number | null;
  onMarkerClick: (index: number) => void;
  reducedMotion: boolean;
};

type PathData = {
  coords: { lat: number; lng: number; alt: number }[];
};

function interpolatePoints(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  steps: number,
  altitude: number
): { lat: number; lng: number; alt: number }[] {
  const points: { lat: number; lng: number; alt: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = lat1 + (lat2 - lat1) * t;
    const lng = lng1 + (lng2 - lng1) * t;
    points.push({ lat, lng, alt: altitude });
  }
  return points;
}

export default function Globe3D({ markers, activeIndex, journeyWithArcs, onMarkerClick, reducedMotion }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | null>(null) as React.MutableRefObject<GlobeMethods | undefined>;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = !reducedMotion && !hasInteracted;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
  }, [reducedMotion, hasInteracted]);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointOfView({ lat: 52, lng: -5, altitude: 2 }, 0);
  }, []);

  useEffect(() => {
    if (!globeRef.current || journeyWithArcs === null) return;
    const journeyMarkers = markers.filter((m) => m.journeyIndices.includes(journeyWithArcs));
    if (journeyMarkers.length === 0) return;

    const lats = journeyMarkers.map((m) => m.lat);
    const lngs = journeyMarkers.map((m) => m.lng);
    const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

    const latSpread = Math.max(...lats) - Math.min(...lats);
    const lngSpread = Math.max(...lngs) - Math.min(...lngs);
    const maxDelta = Math.max(
      latSpread,
      lngSpread * Math.cos((centerLat * Math.PI) / 180)
    );
    const altitude = Math.max(0.5, Math.min(3, maxDelta * 0.05 + 0.3));

    globeRef.current.pointOfView({ lat: centerLat, lng: centerLng, altitude }, 1000);
  }, [markers, journeyWithArcs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;
    const onInteraction = () => setHasInteracted(true);
    el.addEventListener("pointerdown", onInteraction, { once: true });
    return () => el.removeEventListener("pointerdown", onInteraction);
  }, [reducedMotion]);

  const handlePointClick = useCallback(
    (point: object) => {
      const m = point as Marker;
      if (m.journeyIndices[0] >= 0) onMarkerClick(m.journeyIndices[0]);
    },
    [onMarkerClick]
  );

  const handleGlobeClick = useCallback(() => {
    onMarkerClick(-1);
  }, [onMarkerClick]);

  const pointColor = useCallback(
    (point: object) => {
      const m = point as Marker;
      return activeIndex !== null && m.journeyIndices.includes(activeIndex) ? "#ff2e8a" : "#39ff14";
    },
    [activeIndex]
  );

  const paths = useMemo(() => {
    if (journeyWithArcs === null) return [];
    const journeyMarkers = markers.filter((m) => m.journeyIndices.includes(journeyWithArcs));
    if (journeyMarkers.length < 2) return [];
    const result: PathData[] = [];
    for (let i = 0; i < journeyMarkers.length - 1; i++) {
      const a = journeyMarkers[i];
      const b = journeyMarkers[i + 1];
      result.push({
        coords: interpolatePoints(a.lat, a.lng, b.lat, b.lng, 20, 0.002),
      });
    }
    return result;
  }, [markers, journeyWithArcs]);

  return (
    <div ref={containerRef} className="h-full w-full">
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          globeImageUrl="/images/globe-surface.jpg"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#00f0ff"
          atmosphereAltitude={0.15}
          pointsData={markers}
          pointLat="lat"
          pointLng="lng"
          pointColor={pointColor}
          pointAltitude={0.01}
          pointRadius={0.25}
          onPointClick={handlePointClick}
          onGlobeClick={handleGlobeClick}
          pathsData={paths}
          pathPoints="coords"
          pathPointLat="lat"
          pathPointLng="lng"
          pathPointAlt="alt"
          pathColor={() => "#ff2e8a"}
          pathStroke={2.0}
          pathResolution={1}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </div>
  );
}

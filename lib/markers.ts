import type { TravelContent } from "./content";

export type Marker = {
  name: string;
  lat: number;
  lng: number;
  journeyIndices: number[];
};

const MERGE_THRESHOLD_DEG = 0.5;

function closeEnough(a: Marker, b: Marker): boolean {
  return Math.abs(a.lat - b.lat) < MERGE_THRESHOLD_DEG
    && Math.abs(a.lng - b.lng) < MERGE_THRESHOLD_DEG;
}

export function getMarkers(travel: TravelContent): Marker[] {
  const raw: Marker[] = [];
  travel.journeys.forEach((j, idx) => {
    if (j.locations && j.locations.length > 0) {
      j.locations.forEach((l) => {
        raw.push({ name: l.name, lat: l.lat, lng: l.lng, journeyIndices: [idx] });
      });
    } else {
      raw.push({ name: j.destination, lat: j.lat, lng: j.lng, journeyIndices: [idx] });
    }
  });

  const merged: Marker[] = [];
  for (const m of raw) {
    const existing = merged.find((e) => closeEnough(e, m));
    if (existing) {
      for (const idx of m.journeyIndices) {
        if (!existing.journeyIndices.includes(idx)) {
          existing.journeyIndices.push(idx);
        }
      }
      if (!existing.name.includes(m.name)) {
        existing.name = `${existing.name} / ${m.name}`;
      }
    } else {
      merged.push({ ...m, journeyIndices: [...m.journeyIndices] });
    }
  }
  return merged;
}

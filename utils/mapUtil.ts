import { FullCoord, LocationCoord } from '../types/locationCoord';
import * as Location from 'expo-location';
import { FirePrediction, FirePredictionResponse } from '../apis/types/fire';

const EARTH_RADIUS_M = 6378137;

type HullPoint = {
  x: number;
  y: number;
  coord: FullCoord;
};

export function coordsToFullCoords(coords: LocationCoord[]): FullCoord[] {
  return coords.map(coord => ({
    latitude: coord.lat,
    longitude: coord.lon,
  }));
}

function latLonToXY(lat: number, lon: number, refLat: number) {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const refLatRad = (refLat * Math.PI) / 180;

  const x = EARTH_RADIUS_M * lonRad * Math.cos(refLatRad);
  const y = EARTH_RADIUS_M * latRad;
  return { x, y };
}

export function makeConvexHullLatLng(points: FullCoord[], refLat: number): FullCoord[] {
  if (points.length <= 2) return points;

  const pts: HullPoint[] = points.map(p => {
    const { x, y } = latLonToXY(p.latitude, p.longitude, refLat);
    return { x, y, coord: p };
  });

  const sorted = [...pts].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));

  const cross = (o: HullPoint, a: HullPoint, b: HullPoint) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower: HullPoint[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: HullPoint[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();

  const hull = lower.concat(upper);
  return hull.map(p => p.coord);
}

export function createCirclePolygon(
  center: FullCoord,
  radiusMeters: number,
  segments: number = 36,
): FullCoord[] {
  const { latitude, longitude } = center;
  const latRad = (latitude * Math.PI) / 180;
  const lngRad = (longitude * Math.PI) / 180;

  const coords: FullCoord[] = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (2 * Math.PI * i) / segments;

    const dx = radiusMeters * Math.cos(angle);
    const dy = radiusMeters * Math.sin(angle);

    const dLat = dy / EARTH_RADIUS_M;
    const dLng = dx / (EARTH_RADIUS_M * Math.cos(latRad));

    const lat = latRad + dLat;
    const lng = lngRad + dLng;

    coords.push({
      latitude: (lat * 180) / Math.PI,
      longitude: (lng * 180) / Math.PI,
    });
  }

  return coords;
}

export function getBearing(source: Location.LocationObject, dest: FullCoord) {
  const lat1 = source.coords.latitude;
  const lon1 = source.coords.longitude;
  const lat2 = dest.latitude;
  const lon2 = dest.longitude;

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  return bearing;
}

const EARTH_METERS_PER_DEG = 111320;

function latLonToLocalMeters(lat: number, lon: number, originLat: number, originLon: number) {
  const mPerDegLat = EARTH_METERS_PER_DEG;
  const mPerDegLon = EARTH_METERS_PER_DEG * Math.cos((originLat * Math.PI) / 180);

  const x = (lon - originLon) * mPerDegLon;
  const y = (lat - originLat) * mPerDegLat;

  return { x, y, mPerDegLat, mPerDegLon };
}

function localMetersToLatLon(
  x: number,
  y: number,
  originLat: number,
  originLon: number,
  mPerDegLat: number,
  mPerDegLon: number,
) {
  const lat = originLat + y / mPerDegLat;
  const lon = originLon + x / mPerDegLon;
  return { lat, lon };
}

const CELL_SIZE_M = 375;
const HALF_CELL = CELL_SIZE_M / 2;

type XYPoint = { x: number; y: number };

export function getCellCornersXY(center: XYPoint): XYPoint[] {
  const { x, y } = center;
  return [
    { x: x - HALF_CELL, y: y - HALF_CELL }, // bottom-left
    { x: x + HALF_CELL, y: y - HALF_CELL }, // bottom-right
    { x: x + HALF_CELL, y: y + HALF_CELL }, // top-right
    { x: x - HALF_CELL, y: y + HALF_CELL }, // top-left
  ];
}

function cross(o: XYPoint, a: XYPoint, b: XYPoint): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function convexHull(points: XYPoint[]): XYPoint[] {
  if (points.length <= 1) return points;

  const uniq = Array.from(
    new Map(points.map(p => [`${p.x.toFixed(6)}_${p.y.toFixed(6)}`, p])).values(),
  );

  uniq.sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));

  const lower: XYPoint[] = [];
  for (const p of uniq) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: XYPoint[] = [];
  for (let i = uniq.length - 1; i >= 0; i--) {
    const p = uniq[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  upper.pop();
  lower.pop();

  return lower.concat(upper);
}

type LatLng = { latitude: number; longitude: number };

export function buildPolygonForStep(
  step: FirePrediction,
  originLat: number,
  originLon: number,
): LatLng[] {
  if (!step.predicted_cells.length) return [];

  const centersXY: XYPoint[] = [];
  let mPerDegLat = EARTH_METERS_PER_DEG;
  let mPerDegLon = EARTH_METERS_PER_DEG * Math.cos((originLat * Math.PI) / 180);

  for (const cell of step.predicted_cells) {
    const res = latLonToLocalMeters(cell.lat, cell.lon, originLat, originLon);
    centersXY.push({ x: res.x, y: res.y });
    mPerDegLat = res.mPerDegLat;
    mPerDegLon = res.mPerDegLon;
  }

  const allCorners: XYPoint[] = [];
  for (const c of centersXY) {
    const corners = getCellCornersXY(c);
    allCorners.push(...corners);
  }

  const hull = convexHull(allCorners);

  const coords: LatLng[] = hull.map(p => {
    const { lat, lon } = localMetersToLatLon(
      p.x,
      p.y,
      originLat,
      originLon,
      mPerDegLat,
      mPerDegLon,
    );
    return { latitude: lat, longitude: lon };
  });

  return coords;
}

type LatLon = { lat: number; lon: number };

const EARTH_METERS_PER_DEG_LAT = 111320;
export function buildSquarePolygonForCell(center: LatLon, sideMeters = 375): LatLng[] {
  const half = sideMeters / 2;

  const latRad = (center.lat * Math.PI) / 180;

  const mPerDegLat = EARTH_METERS_PER_DEG_LAT;
  const mPerDegLon = EARTH_METERS_PER_DEG_LAT * Math.cos(latRad);

  const dLatDeg = half / mPerDegLat;
  const dLonDeg = half / mPerDegLon;

  const north = center.lat + dLatDeg;
  const south = center.lat - dLatDeg;
  const east = center.lon + dLonDeg;
  const west = center.lon - dLonDeg;

  return [
    { latitude: south, longitude: west }, // bottom-left
    { latitude: south, longitude: east }, // bottom-right
    { latitude: north, longitude: east }, // top-right
    { latitude: north, longitude: west }, // top-left
  ];
}

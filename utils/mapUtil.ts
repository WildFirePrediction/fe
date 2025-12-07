import { FullCoord, LocationCoord } from '../types/locationCoord';
import * as Location from 'expo-location';

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

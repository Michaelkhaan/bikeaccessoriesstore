import { defaultPlaces, type Place } from "../data/places";

const STORAGE_KEY = "bikeaccessories.places.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadPlaces(): Place[] {
  if (!isBrowser()) return defaultPlaces;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPlaces;
    const parsed = JSON.parse(raw) as Place[];
    if (!Array.isArray(parsed)) return defaultPlaces;
    return parsed.length > 0 ? parsed : defaultPlaces;
  } catch {
    return defaultPlaces;
  }
}

export function savePlaces(places: Place[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  } catch {
    // ignore write errors
  }
}

// Compute the next available slot in a 2-column grid pattern like Place A, B, C, D
// Places are arranged in a 2-column grid: left column at x=0.15, right column at x=0.55
export function computeNextAutoPlace(places: Place[]): Omit<Place, "id" | "label"> {
  const cols = 2; // 2 columns like Place A-B (left) and Place C-D (right)
  const cellWidth = 0.35; // same width as Place A-D
  const cellHeight = 0.35; // same height as Place A-D
  const leftColX = 0.15; // x position for left column (Place A, C)
  const rightColX = 0.55; // x position for right column (Place B, D)
  const rowStartY = 0.15; // starting y position for first row
  const rowGap = 0.05; // gap between rows (0.15 + 0.35 = 0.5, then 0.55 - 0.5 = 0.05)

  // Count only places that follow the grid pattern (0.35x0.35 size and at grid x positions)
  // This excludes places like checkout and display that don't follow the grid
  const gridPlaces = places.filter((place) => {
    const isGridSize = Math.abs(place.width - cellWidth) < 0.01 && Math.abs(place.height - cellHeight) < 0.01;
    const isGridX = Math.abs(place.x - leftColX) < 0.01 || Math.abs(place.x - rightColX) < 0.01;
    return isGridSize && isGridX;
  });

  // Calculate the next position in the grid
  const index = gridPlaces.length;
  const col = index % cols;
  const row = Math.floor(index / cols);

  // Determine x position based on column
  const x = col === 0 ? leftColX : rightColX;
  
  // Calculate y position: start at rowStartY, then add row * (cellHeight + rowGap)
  const y = rowStartY + row * (cellHeight + rowGap);

  // Clamp to fit within the map bounds
  const clampedX = Math.max(0, Math.min(1 - cellWidth, x));
  const clampedY = Math.max(0, Math.min(1 - cellHeight, y));

  return {
    x: clampedX,
    y: clampedY,
    width: cellWidth,
    height: cellHeight,
  };
}

export function addPlace(places: Place[], place: Omit<Place, "id">): Place[] {
  const id = place.label.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  const newPlace: Place = { ...place, id };
  const updated = [...places, newPlace];
  savePlaces(updated);
  return updated;
}

export function updatePlace(places: Place[], id: string, updates: Partial<Place>): Place[] {
  const updated = places.map((p) => (p.id === id ? { ...p, ...updates } : p));
  savePlaces(updated);
  return updated;
}

export function deletePlace(places: Place[], id: string): Place[] {
  const updated = places.filter((p) => p.id !== id);
  savePlaces(updated);
  return updated;
}

// Add a place with automatically computed position/size after the previous place
export function addPlaceAuto(places: Place[], label: string): Place[] {
  const id = label.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  const next = computeNextAutoPlace(places);
  const newPlace: Place = { id, label, ...next };
  const updated = [...places, newPlace];
  savePlaces(updated);
  return updated;
}



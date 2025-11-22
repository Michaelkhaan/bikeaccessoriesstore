/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import type { InventoryItem } from "../data/inventory";
import type { Place } from "../data/places";
import { defaultPlaces } from "../data/places";
import { loadPlaces } from "../lib/places-storage";

type Location = {
  x: number;
  y: number;
  zone: string;
};

type Props = {
  location: Location;
  onChange: (location: Location) => void;
  existingItems?: InventoryItem[];
};

export default function LocationPicker({ location, onChange, existingItems = [] }: Props) {
  const [places, setPlaces] = useState<Place[]>(defaultPlaces);

  useEffect(() => {
    setPlaces(loadPlaces());
  }, []);

  const handlePlaceClick = (placeLabel: string) => {
    // Find the place and center coordinates within it
    const selectedPlace = places.find((p) => p.label === placeLabel);
    if (selectedPlace) {
      onChange({
        ...location,
        zone: placeLabel,
        x: selectedPlace.x + selectedPlace.width / 2,
        y: selectedPlace.y + selectedPlace.height / 2,
      });
    }
  };

  // Group existing items by place
  const itemsByPlace: Record<string, InventoryItem[]> = {};
  existingItems.forEach((item) => {
    const place = item.location.zone;
    if (!itemsByPlace[place]) {
      itemsByPlace[place] = [];
    }
    itemsByPlace[place].push(item);
  });

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Select Place for Product
        </label>
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
          Click on a place on the map or select from dropdown to assign this product to a location.
        </p>
      </div>

      {/* Visual map with clickable places */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 ring-1 ring-black/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 dark:ring-white/10">
        {/* Store background grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-2 p-4 opacity-20">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="rounded border border-dashed border-zinc-300 dark:border-zinc-700" />
          ))}
        </div>

        {/* Entrance label */}
        <div className="pointer-events-none absolute left-6 top-6 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-black/5 dark:bg-zinc-800/95 dark:text-zinc-200 dark:ring-white/10">
          🚪 Entrance
        </div>

        {/* Render clickable places */}
        {places.map((place) => {
          const placeItems = itemsByPlace[place.label] || [];
          const isSelected = location.zone === place.label;
          return (
            <button
              key={place.id}
              type="button"
              onClick={() => handlePlaceClick(place.label)}
              className={`absolute rounded-lg border-2 bg-white/70 backdrop-blur-sm transition-all hover:bg-white/90 ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-500/30 dark:border-blue-400"
                  : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
              } dark:bg-zinc-800/50 dark:hover:bg-zinc-800/70`}
              style={{
                left: `${place.x * 100}%`,
                top: `${place.y * 100}%`,
                width: `${place.width * 100}%`,
                height: `${place.height * 100}%`,
              }}
            >
              {/* Place label */}
              <div
                className={`absolute -top-3 left-3 rounded-md px-2 py-1 text-xs font-bold ${
                  isSelected
                    ? "bg-blue-600 text-white dark:bg-blue-400 dark:text-black"
                    : "bg-zinc-900 text-white dark:bg-white dark:text-black"
                }`}
              >
                {place.label}
              </div>

              {/* Show count of existing items */}
              {placeItems.length > 0 && (
                <div className="absolute bottom-2 right-2 rounded-full bg-zinc-900/80 px-2 py-1 text-[10px] font-medium text-white dark:bg-white/80 dark:text-black">
                  {placeItems.length} item{placeItems.length !== 1 ? "s" : ""}
                </div>
              )}

              {placeItems.length === 0 && (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-zinc-400 dark:text-zinc-600">Empty</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Dropdown selector */}
      <div>
        <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Place/Zone</label>
        <select
          value={location.zone}
          onChange={(e) => {
            const selectedPlace = places.find((p) => p.label === e.target.value);
            if (selectedPlace) {
              onChange({
                ...location,
                zone: selectedPlace.label,
                x: selectedPlace.x + selectedPlace.width / 2,
                y: selectedPlace.y + selectedPlace.height / 2,
              });
            }
          }}
          className="w-full rounded-lg border border-black/5 bg-zinc-50 px-3 py-2 text-sm outline-none focus:bg-white dark:border-white/10 dark:bg-zinc-800"
        >
          {places.map((place) => (
            <option key={place.id} value={place.label}>
              {place.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


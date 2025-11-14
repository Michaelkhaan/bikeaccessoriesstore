"use client";

import { useState } from "react";
import type { Place } from "../data/places";

type PlaceFormData = {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  autoPlace?: boolean;
};

type Props = {
  place?: Place;
  onSubmit: (data: PlaceFormData) => void;
  onCancel?: () => void;
};

export default function PlaceForm({ place, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<PlaceFormData>({
    label: place?.label || "",
    x: place?.x || 0.2,
    y: place?.y || 0.2,
    width: place?.width || 0.3,
    height: place?.height || 0.3,
    autoPlace: !place, // default to auto for new places
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      alert("Please enter a place name");
      return;
    }
    if (!formData.autoPlace) {
      if (formData.width <= 0 || formData.height <= 0) {
        alert("Width and height must be greater than 0");
        return;
      }
      if (formData.x + formData.width > 1 || formData.y + formData.height > 1) {
        alert("Place exceeds map boundaries. Adjust position or size.");
        return;
      }
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {place ? "Edit Place" : "Add New Place"}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Define a place on the store map where products can be placed.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Place Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="e.g., Place E, Storage Area"
          required
          className="w-full rounded-lg border border-black/5 bg-zinc-50 px-4 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-black/5 bg-zinc-50 p-3 text-sm dark:border-white/10 dark:bg-zinc-800">
        <div>
          <div className="font-medium text-zinc-900 dark:text-zinc-50">Auto place</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Automatically position after the previous place</div>
        </div>
        <button
          type="button"
          onClick={() => setFormData((s) => ({ ...s, autoPlace: !s.autoPlace }))}
          className={`rounded-full px-3 py-1 text-xs font-medium ${formData.autoPlace ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "bg-white text-zinc-700 ring-1 ring-black/5 dark:bg-zinc-700 dark:text-zinc-200 dark:ring-white/10"}`}
        >
          {formData.autoPlace ? "On" : "Off"}
        </button>
      </div>

      <div className={`grid grid-cols-2 gap-4 ${formData.autoPlace ? "opacity-50 pointer-events-none select-none" : ""}`}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-50">X Position</label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={formData.x}
            onChange={(e) => setFormData({ ...formData, x: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-black/5 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-zinc-800"
          />
          <p className="mt-1 text-xs text-zinc-500">0 = left edge, 1 = right edge</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Y Position</label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={formData.y}
            onChange={(e) => setFormData({ ...formData, y: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-black/5 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-zinc-800"
          />
          <p className="mt-1 text-xs text-zinc-500">0 = top edge, 1 = bottom edge</p>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-4 ${formData.autoPlace ? "opacity-50 pointer-events-none select-none" : ""}`}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Width</label>
          <input
            type="number"
            min="0.1"
            max="1"
            step="0.01"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0.3 })}
            className="w-full rounded-lg border border-black/5 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-zinc-800"
          />
          <p className="mt-1 text-xs text-zinc-500">Width as fraction of map (0.1 - 1.0)</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Height</label>
          <input
            type="number"
            min="0.1"
            max="1"
            step="0.01"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0.3 })}
            className="w-full rounded-lg border border-black/5 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-zinc-800"
          />
          <p className="mt-1 text-xs text-zinc-500">Height as fraction of map (0.1 - 1.0)</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-black/5 pt-4 dark:border-white/10">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          {place ? "Update Place" : "Add Place"}
        </button>
      </div>
    </form>
  );
}



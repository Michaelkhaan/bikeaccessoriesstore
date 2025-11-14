/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import type { Place } from "../data/places";
import { defaultPlaces } from "../data/places";
import { addPlace, addPlaceAuto, deletePlace, loadPlaces, updatePlace } from "../lib/places-storage";
import PlaceForm from "./PlaceForm";

export default function PlacesManager() {
  const [places, setPlaces] = useState<Place[]>(defaultPlaces);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    setPlaces(loadPlaces());
  }, []);

  const handleAdd = (data: { label: string; x: number; y: number; width: number; height: number; autoPlace?: boolean }) => {
    setPlaces((prev) => {
      if (data.autoPlace) {
        return addPlaceAuto(prev, data.label);
      }
      return addPlace(prev, { label: data.label, x: data.x, y: data.y, width: data.width, height: data.height });
    });
    setIsAdding(false);
  };

  const handleUpdate = (id: string, data: Partial<Place>) => {
    setPlaces((prev) => updatePlace(prev, id, data));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setPlaces((prev) => deletePlace(prev, id));
    setConfirmDelete(null);
  };

  const editingPlace = editingId ? places.find((p) => p.id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Manage Places</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Add, edit, or delete places on your store map. Products will be organized by these places.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
          >
            + Add Place
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div>
          <PlaceForm
            place={editingPlace || undefined}
            onSubmit={(data) => {
              if (editingId && editingPlace) {
                handleUpdate(editingId, data);
              } else {
                handleAdd(data);
              }
            }}
            onCancel={() => {
              setIsAdding(false);
              setEditingId(null);
            }}
          />
        </div>
      )}

      {/* Places List */}
      {!isAdding && !editingId && (
        <div className="space-y-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {places.length} place{places.length !== 1 ? "s" : ""} configured
          </div>

          {places.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">No places yet. Add your first place!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="group relative rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{place.label}</h3>
                  </div>

                  <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span>Position:</span>
                      <span className="font-medium">
                        ({place.x.toFixed(2)}, {place.y.toFixed(2)})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Size:</span>
                      <span className="font-medium">
                        {place.width.toFixed(2)} × {place.height.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(place.id)}
                      className="flex-1 rounded-lg border border-black/5 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(place.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </div>

                  {confirmDelete === place.id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                      <div className="mx-4 rounded-xl border border-black/5 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-zinc-800">
                        <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          Delete &quot;{place.label}&quot;?
                        </p>
                        <p className="mb-3 text-xs text-zinc-600 dark:text-zinc-400">
                          Products in this place will need to be reassigned.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-lg border border-black/5 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-700 dark:text-zinc-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(place.id)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}



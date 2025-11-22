/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navigation from "../../components/Navigation";
import type { InventoryItem } from "../../data/inventory";
import { initialInventory } from "../../data/inventory";
import { loadInventory } from "../../lib/storage";
import Image from "next/image";

export default function MapPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [query, setQuery] = useState<string>("");
  const [zones, setZones] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setItems(loadInventory());
  }, []);

  const allZones = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.location.zone)));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const matchesQuery = !q || i.name.toLowerCase().includes(q);
      const matchesZone = zones.length === 0 || zones.includes(i.location.zone);
      return matchesQuery && matchesZone;
    });
  }, [items, query, zones]);

  // Calculate pagination for product list
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, zones]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">In‑Store Placement</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Search and locate any item in the store layout.</p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-black/5 px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-black/5 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a product name..."
                className="mt-1 w-full rounded-xl border border-black/5 bg-zinc-50 px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 dark:border-white/10 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
              />
            </div>
            <div className="mt-4">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Places</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {allZones.map((z) => {
                  const active = zones.includes(z);
                  return (
                    <button
                      key={z}
                      onClick={() =>
                        setZones((prev) => (prev.includes(z) ? prev.filter((x) => x !== z) : [...prev, z]))
                      }
                      className={`rounded-full px-3 py-1 text-xs ring-1 ${
                        active
                          ? "bg-zinc-900 text-white ring-black/10 dark:bg-white dark:text-black dark:ring-white/10"
                          : "text-zinc-700 ring-black/10 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/10"
                      }`}
                    >
                      {z}
                    </button>
                  );
                })}
                {allZones.length === 0 && (
                  <div className="text-xs text-zinc-500">No zones</div>
                )}
              </div>
            </div>

            <div className="mt-5 border-t border-black/5 pt-4 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
              {filtered.length} items
            </div>

            <ul className="mt-2 max-h-[50vh] space-y-2 overflow-auto pr-1">
              {filtered.map((it) => {
                const active = selectedId === it.id;
                return (
                  <li key={it.id}>
                    <button
                      onClick={() => setSelectedId(it.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${
                        active
                          ? "border-blue-600/30 bg-blue-50 text-blue-900 dark:border-blue-400/30 dark:bg-blue-950/40 dark:text-blue-100"
                          : "border-black/5 text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      <span className="truncate">{it.name}</span>
                      <span className="ml-2 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">{it.location.zone}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Map + selection details */}
          <section className="space-y-4">

            {selectedId && (
              <div className="rounded-2xl border border-black/5 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                {(() => {
                  const it = items.find((i) => i.id === selectedId);
                  if (!it) return null;
                  return (
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{it.name}</div>
                        <div className="text-zinc-500 dark:text-zinc-400">Place: {it.location.zone}</div>
                      </div>
                      <div className="text-right text-zinc-600 dark:text-zinc-300">
                        <div>Stock: {it.stock}</div>
                        <div>Sold: {it.sold}</div>
                        <div>Price: ${it.price.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* In-Store Products List */}
            <div className="rounded-2xl border border-black/5 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">In-Store Products</h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Showing products with image, name, and location
                  </p>
                </div>
                {totalPages > 1 && (
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Page {currentPage} of {totalPages} ({filtered.length} total)
                  </div>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-xl border border-black/5 bg-zinc-50 p-12 text-center dark:border-white/10 dark:bg-zinc-800">
                  <p className="text-zinc-600 dark:text-zinc-400">No products found matching your filters.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {paginatedItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`group cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
                          selectedId === item.id
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-950/40"
                            : "border-black/5 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-800 dark:hover:border-zinc-600"
                        }`}
                      >
                        {/* Product Image */}
                        <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Product Name */}
                        <h3
                          className={`mb-1 truncate text-sm font-semibold ${
                            selectedId === item.id
                              ? "text-blue-900 dark:text-blue-100"
                              : "text-zinc-900 dark:text-zinc-50"
                          }`}
                        >
                          {item.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">📍</span>
                          <span
                            className={`text-xs font-medium ${
                              selectedId === item.id
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {item.location.zone}
                          </span>
                        </div>

                        {/* Stock indicator */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">Stock:</span>
                          <span
                            className={`text-xs font-semibold ${
                              item.stock > 10
                                ? "text-green-600 dark:text-green-400"
                                : item.stock > 5
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {item.stock}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-black/5 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                                : "border border-black/5 text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-black/5 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mx-auto mt-16 max-w-7xl border-t border-black/5 px-4 py-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Bike Accessories — Quality bike accessories for every rider.
      </footer>
    </div>
  );
}



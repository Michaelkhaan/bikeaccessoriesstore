/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import ProductForm from "../../components/ProductForm";
import type { InventoryItem } from "../../data/inventory";
import { initialInventory } from "../../data/inventory";
import { addProduct, deleteProduct, loadInventory, updateProduct } from "../../lib/storage";

export default function AdminPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setItems(loadInventory());
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds or when items change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, currentPage, totalPages]);

  const handleAdd = (data: Parameters<typeof addProduct>[1]) => {
    setItems((prev) => addProduct(prev, data));
    setIsAdding(false);
    setCurrentPage(1); // Reset to first page after adding
  };

  const handleUpdate = (id: string, data: Partial<InventoryItem>) => {
    setItems((prev) => updateProduct(prev, id, data));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => {
      const updated = deleteProduct(prev, id);
      // Reset page if current page becomes empty after deletion
      const newTotalPages = Math.ceil(updated.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      return updated;
    });
    setConfirmDelete(null);
  };

  const editingProduct = editingId ? items.find((item) => item.id === editingId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Panel</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your products, prices, images, and store locations.
          </p>
        </div>

        {/* Products Section */}
        <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Products Management</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Add, edit, or delete products in your store.
                </p>
              </div>
              {!isAdding && !editingId && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              )}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
              <div className="mb-8">
                <ProductForm
                  product={editingProduct || undefined}
                  existingItems={items}
                  onSubmit={(data) => {
                    if (editingId && editingProduct) {
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

            {/* Products List */}
            {!isAdding && !editingId && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Products ({items.length})</h2>
                  {totalPages > 1 && (
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Page {currentPage} of {totalPages}
                    </div>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="rounded-2xl border border-black/5 p-12 text-center dark:border-white/10">
                    <svg className="mx-auto mb-4 h-12 w-12 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-zinc-600 dark:text-zinc-400">No products yet. Add your first product!</p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {paginatedItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-2xl border border-black/5 p-5 shadow-sm transition hover:shadow-md dark:border-white/10"
                      >
                        <div className="flex flex-col gap-4">
                          {/* Image */}
                          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
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
                              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="space-y-2">
                            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                              {item.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                ${item.price.toFixed(2)}
                              </div>
                              <div className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {item.location.zone}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                              <span>Stock: {item.stock}</span>
                              <span>Sold: {item.sold}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => setEditingId(item.id)}
                              className="flex-1 rounded-lg border border-black/5 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setConfirmDelete(item.id)}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {confirmDelete === item.id && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <div className="mx-4 rounded-xl border border-black/5 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-zinc-800">
                              <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Delete &quot;{item.name}&quot;?
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="rounded-lg border border-black/5 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-700 dark:text-zinc-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
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
                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
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
                                  : "border border-black/5 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
        </div>
      </main>

      <footer className="mx-auto mt-16 max-w-7xl border-t border-black/5 px-4 py-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Bike Accessories — Quality bike accessories for every rider.
      </footer>
    </div>
  );
}


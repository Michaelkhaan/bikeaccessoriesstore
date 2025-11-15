"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navigation from "../../../components/Navigation";
import type { InventoryItem } from "../../../data/inventory";
import { initialInventory } from "../../../data/inventory";
import { loadInventory } from "../../../lib/storage";
import { addToCart } from "../../../lib/cart-storage";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const items = loadInventory();
    const found = items.find((i) => i.id === params.id);
    if (found) {
      setItem(found);
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!item || item.stock === 0) return;
    
    setIsAdding(true);
    addToCart(
      {
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        location: item.location,
      },
      quantity
    );
    
    setIsAdding(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/products" className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400">
            Back to Products
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500">No Image Available</div>
            )}
            {item.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full bg-red-500 px-4 py-2 text-lg font-semibold text-white">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{item.name}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">${item.price.toFixed(2)}</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {item.location.zone}
                </span>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Stock Available</span>
                <span
                  className={`text-lg font-semibold ${
                    item.stock > 10
                      ? "text-green-600 dark:text-green-400"
                      : item.stock > 5
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.stock} units
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Sold</span>
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{item.sold} units</span>
              </div>
            </div>

            {item.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={item.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1 && val <= item.stock) {
                          setQuantity(val);
                        }
                      }}
                      className="w-16 bg-transparent text-center text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(item.stock, q + 1))}
                      className="px-3 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || addedToCart}
                  className="w-full rounded-xl bg-zinc-900 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
                >
                  {isAdding ? "Adding..." : addedToCart ? "✓ Added to Cart!" : `Add to Cart - $${(item.price * quantity).toFixed(2)}`}
                </button>
              </div>
            )}

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Product Information</h2>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p>High-quality bike accessory designed for durability and performance.</p>
                <p>Perfect for cycling enthusiasts looking for reliable equipment.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto mt-16 max-w-7xl border-t border-black/5 px-4 py-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Bike Accessories — Quality bike accessories for every rider.
      </footer>
    </div>
  );
}


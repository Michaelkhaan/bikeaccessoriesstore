/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DashboardStats from "../components/DashboardStats";
import InventoryCard from "../components/InventoryCard";
import ThemeToggle from "../components/ThemeToggle";
import { initialInventory, type InventoryItem } from "../data/inventory";
import { loadInventory, restock, sellOne } from "../lib/storage";

export default function Home() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setItems(loadInventory());
  }, []);

  const headerRevenue = useMemo(
    () => items.reduce((s, i) => s + i.sold * i.price, 0),
    [items]
  );

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-zinc-900 p-1.5 text-white dark:bg-zinc-800">
              <Image src="/logo.svg" alt="Bike Accessories Logo" width={24} height={24} className="h-full w-full" />
            </div>
            <div className="text-sm font-semibold">Bike Accessories</div>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              Dashboard
            </Link>
            <Link href="/map" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              Store Map
            </Link>
            <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              Admin
            </Link>
            <ThemeToggle />
            <div className="ml-2 rounded-full bg-zinc-900 px-3 py-1 text-xs text-white dark:bg-white dark:text-black">
              Rev ${headerRevenue.toFixed(2)}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <section className="mb-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Store Dashboard</h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Track inventory, sales, and revenue in real time.</p>
            </div>
            <Link
              href="/map"
              className="rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              View Store Map
            </Link>
          </div>
        </section>

        <DashboardStats items={items} />

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Products</h2>
            {totalPages > 1 && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Page {currentPage} of {totalPages} ({items.length} total)
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedItems.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onSell={(id) => setItems((prev) => sellOne(prev, id))}
                onRestock={(id, qty) => setItems((prev) => restock(prev, id, qty))}
              />
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
        </section>
      </main>

      <footer className="mx-auto mt-10 max-w-6xl border-t border-black/5 px-5 py-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        © {new Date().getFullYear()} Bike Accessories — Simple modern store dashboard.
      </footer>
    </div>
  );
}

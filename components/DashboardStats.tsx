"use client";

import { calculateTotals, type InventoryItem } from "../data/inventory";

type Props = {
  items: InventoryItem[];
};

export default function DashboardStats({ items }: Props) {
  const totals = calculateTotals(items);

  const cards = [
    { label: "Products", value: totals.totalProducts.toLocaleString(), sub: "Variants tracked" },
    { label: "In Stock", value: totals.totalUnitsInStock.toLocaleString(), sub: "Units available" },
    { label: "Sold", value: totals.totalUnitsSold.toLocaleString(), sub: "Units sold" },
    { label: "Revenue", value: `$${totals.revenue.toFixed(2)}`, sub: "All-time" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="text-sm text-zinc-500 dark:text-zinc-400">{c.label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{c.value}</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{c.sub}</div>
        </div>
      ))}
    </section>
  );
}



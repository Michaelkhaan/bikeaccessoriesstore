"use client";

import Image from "next/image";
import { useState } from "react";
import type { InventoryItem } from "../data/inventory";

type Props = {
  item: InventoryItem;
  onSell: (id: string) => void;
  onRestock: (id: string, qty: number) => void;
};

export default function InventoryCard({ item, onSell, onRestock }: Props) {
  const [qty, setQty] = useState<string>("5");
  const canSell = item.stock > 0;

  return (
    <div className="group relative rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
      <div className="">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-black/5 dark:bg-zinc-800 dark:ring-white/10">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-contain p-3" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">IMG</div>
          )}
        </div>
        <div className="flex-1 mt-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{item.name}</h3>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {item.location.zone}
            </span>
          </div>
          <div className="mt-1 grid grid-cols-3 gap-3 text-sm text-zinc-600 dark:text-zinc-300">
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Price</div>
              <div className="font-medium">${item.price.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">In Stock</div>
              <div className="font-medium">{item.stock}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Sold</div>
              <div className="font-medium">{item.sold}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => onSell(item.id)}
              disabled={!canSell}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black cursor-pointer"
            >
              Sell 1
            </button>
            <div className="inline-flex items-center gap-2 rounded-xl border border-black/5 bg-zinc-50 px-2 py-1 text-xs dark:border-white/10 dark:bg-zinc-800">
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-14 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                min={1}
              />
              <button
                onClick={() => onRestock(item.id, parseInt(qty, 10))}
                className="rounded-lg bg-white px-2 py-1 font-medium text-white hover:text-black cursor-pointer ring-1 ring-black/5 hover:bg-zinc-100 dark:bg-zinc-700 dark:ring-white/10"
              >
                Restock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



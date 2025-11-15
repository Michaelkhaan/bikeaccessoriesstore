"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navigation from "../../../components/Navigation";
import type { Order } from "../../../data/cart";
import { getOrderById } from "../../../lib/cart-storage";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
      <Navigation />

      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        {order ? (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Order Confirmed!</h1>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>

            <div className="mb-8 rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <div className="mb-4 border-b border-black/5 pb-4 dark:border-white/10">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Order Number</div>
                <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{order.id}</div>
              </div>
              <div className="mb-4 border-b border-black/5 pb-4 dark:border-white/10">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Amount</div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">${order.total.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Status</div>
                <div className="mt-1">
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="rounded-xl border border-black/5 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Order Not Found</h1>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
              We couldn't find your order. Please contact support if you believe this is an error.
            </p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
            >
              Back to Home
            </Link>
          </>
        )}
      </main>

      <footer className="mx-auto mt-16 max-w-7xl border-t border-black/5 px-4 py-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Bike Accessories — Quality bike accessories for every rider.
      </footer>
    </div>
  );
}


/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { loadInventory } from "../lib/storage";
import { calculateRevenue } from "../data/inventory";

export default function Navigation() {
  const pathname = usePathname();
  const [revenue, setRevenue] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const items = loadInventory();
    setRevenue(calculateRevenue(items));
    
    // Load cart count
    const cart = localStorage.getItem("bikeaccessories.cart");
    if (cart) {
      try {
        const cartItems = JSON.parse(cart);
        const count = Array.isArray(cartItems) 
          ? cartItems.reduce((sum: number, item: { quantity: number }) => sum + (item.quantity || 0), 0)
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    }
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/map", label: "Store Map" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-zinc-900 p-1.5 text-white dark:bg-zinc-800">
            <Image src="/logo.svg" alt="Bike Accessories Logo" width={24} height={24} className="h-full w-full" />
          </div>
          <div className="text-sm font-semibold sm:text-base">Bike Accessories</div>
        </Link>
        
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* <Link
            href="/cart"
            className="relative rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Shopping cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link> */}
          
          {/* {pathname === "/" && (
            <div className="hidden rounded-full bg-zinc-900 px-3 py-1 text-xs text-white dark:bg-white dark:text-black sm:block">
              Rev ${revenue.toFixed(2)}
            </div>
          )} */}
          
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <MobileMenu navLinks={navLinks} isActive={isActive} cartCount={cartCount} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ navLinks, isActive, cartCount }: { navLinks: Array<{ href: string; label: string }>; isActive: (path: string) => boolean; cartCount: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
        aria-label="Menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b border-black/5 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/95 md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cart
                {cartCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link> */}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}


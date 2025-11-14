import { initialInventory, type InventoryItem } from "../data/inventory";

const STORAGE_KEY = "bikeaccessories.inventory.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadInventory(): InventoryItem[] {
  if (!isBrowser()) return initialInventory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialInventory;
    const parsed = JSON.parse(raw) as InventoryItem[];
    if (!Array.isArray(parsed)) return initialInventory;
    return parsed;
  } catch {
    return initialInventory;
  }
}

export function saveInventory(items: InventoryItem[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors
  }
}

export function sellOne(items: InventoryItem[], id: string): InventoryItem[] {
  const updated = items.map((it) =>
    it.id === id && it.stock > 0
      ? { ...it, stock: it.stock - 1, sold: it.sold + 1 }
      : it
  );
  saveInventory(updated);
  return updated;
}

export function restock(items: InventoryItem[], id: string, qty: number): InventoryItem[] {
  const normalizedQty = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 0;
  if (normalizedQty === 0) return items;
  const updated = items.map((it) => (it.id === id ? { ...it, stock: it.stock + normalizedQty } : it));
  saveInventory(updated);
  return updated;
}

export function addProduct(items: InventoryItem[], product: Omit<InventoryItem, "id" | "stock" | "sold">): InventoryItem[] {
  const id = product.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  const newProduct: InventoryItem = {
    ...product,
    id,
    stock: 0,
    sold: 0,
  };
  const updated = [...items, newProduct];
  saveInventory(updated);
  return updated;
}

export function updateProduct(items: InventoryItem[], id: string, updates: Partial<InventoryItem>): InventoryItem[] {
  const updated = items.map((it) => (it.id === id ? { ...it, ...updates } : it));
  saveInventory(updated);
  return updated;
}

export function deleteProduct(items: InventoryItem[], id: string): InventoryItem[] {
  const updated = items.filter((it) => it.id !== id);
  saveInventory(updated);
  return updated;
}



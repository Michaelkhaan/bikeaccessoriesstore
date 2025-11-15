import type { CartItem, Order } from "../data/cart";

const CART_STORAGE_KEY = "bikeaccessories.cart";
const ORDERS_STORAGE_KEY = "bikeaccessories.orders";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

// Cart functions
export function loadCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  } catch {
    // ignore write errors
  }
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity: number = 1): CartItem[] {
  const cart = loadCart();
  const existingIndex = cart.findIndex((i) => i.productId === item.productId);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = loadCart();
  const updated = cart.filter((item) => item.productId !== productId);
  saveCart(updated);
  return updated;
}

export function updateCartItemQuantity(productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(productId);
  }
  const cart = loadCart();
  const updated = cart.map((item) =>
    item.productId === productId ? { ...item, quantity } : item
  );
  saveCart(updated);
  return updated;
}

export function clearCart(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

// Order functions
export function loadOrders(): Order[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore write errors
  }
}

export function createOrder(cartItems: CartItem[], customerInfo: Order["customerInfo"]): Order {
  const orders = loadOrders();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const order: Order = {
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    items: cartItems,
    total,
    customerInfo,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.push(order);
  saveOrders(orders);
  clearCart();
  
  return order;
}

export function getOrderById(id: string): Order | null {
  const orders = loadOrders();
  return orders.find((o) => o.id === id) || null;
}


export type InventoryItem = {
  id: string;
  name: string;
  price: number; // price per unit
  stock: number; // current stock on hand
  sold: number; // total units sold
  image?: string;
  location: {
    // normalized coordinates on the store map [0..1]
    x: number;
    y: number;
    zone: string;
  };
};

export const initialInventory: InventoryItem[] = [
  {
    id: "helmet-pro",
    name: "Helmet Pro",
    price: 79.99,
    stock: 24,
    sold: 12,
    image: "/vercel.svg",
    location: { x: 0.325, y: 0.325, zone: "Place A" },
  },
  {
    id: "led-light",
    name: "LED Bike Light",
    price: 24.5,
    stock: 40,
    sold: 35,
    image: "/next.svg",
    location: { x: 0.725, y: 0.325, zone: "Place B" },
  },
  {
    id: "u-lock",
    name: "U-Lock Security",
    price: 39.0,
    stock: 18,
    sold: 5,
    image: "/globe.svg",
    location: { x: 0.325, y: 0.725, zone: "Place C" },
  },
  {
    id: "water-bottle",
    name: "Insulated Bottle",
    price: 14.99,
    stock: 60,
    sold: 47,
    image: "/window.svg",
    location: { x: 0.85, y: 0.85, zone: "Checkout" },
  },
];

export function calculateRevenue(items: InventoryItem[]): number {
  return items.reduce((sum, item) => sum + item.sold * item.price, 0);
}

export function calculateTotals(items: InventoryItem[]): {
  totalProducts: number;
  totalUnitsInStock: number;
  totalUnitsSold: number;
  revenue: number;
} {
  const totalProducts = items.length;
  const totalUnitsInStock = items.reduce((s, i) => s + i.stock, 0);
  const totalUnitsSold = items.reduce((s, i) => s + i.sold, 0);
  const revenue = calculateRevenue(items);
  return { totalProducts, totalUnitsInStock, totalUnitsSold, revenue };
}



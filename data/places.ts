export type Place = {
  id: string;
  label: string;
  x: number; // normalized position [0-1]
  y: number; // normalized position [0-1]
  width: number; // normalized width [0-1]
  height: number; // normalized height [0-1]
};

export const defaultPlaces: Place[] = [
  { id: "place-a", label: "Place A", x: 0.15, y: 0.15, width: 0.35, height: 0.35 },
  { id: "place-b", label: "Place B", x: 0.55, y: 0.15, width: 0.35, height: 0.35 },
  { id: "place-c", label: "Place C", x: 0.15, y: 0.55, width: 0.35, height: 0.35 },
  { id: "place-d", label: "Place D", x: 0.55, y: 0.55, width: 0.35, height: 0.35 },
  { id: "checkout", label: "Checkout", x: 0.75, y: 0.75, width: 0.2, height: 0.2 },
  { id: "display", label: "Display", x: 0.05, y: 0.75, width: 0.2, height: 0.2 },
];




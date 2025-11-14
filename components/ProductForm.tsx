"use client";

import Image from "next/image";
import { useState } from "react";
import type { InventoryItem } from "../data/inventory";

type ProductFormData = {
  name: string;
  price: number;
  image: string;
  location: {
    x: number;
    y: number;
    zone: string;
  };
};

type Props = {
  product?: InventoryItem;
  existingItems?: InventoryItem[];
  onSubmit: (data: ProductFormData) => void;
  onCancel?: () => void;
};

export default function ProductForm({ product, existingItems = [], onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    price: product?.price || 0,
    image: product?.image || "",
    location: product?.location || { x: 0.5, y: 0.5, zone: "Aisle A" },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(formData.image || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price <= 0) {
      alert("Please fill in all required fields (name and price must be > 0)");
      return;
    }
    onSubmit(formData);
  };

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-black/5 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Fill in the product details below.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Image Section - Left */}
        <div className="lg:col-span-1">
          <label className="mb-3 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Product Image
          </label>
          
          {/* Image Preview/Upload Area */}
          <div className="space-y-3">
            {imagePreview ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-dashed border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800">
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  onError={() => setImagePreview(null)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: "" });
                  }}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-colors hover:bg-red-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-dashed border-black/20 bg-zinc-50 dark:border-white/20 dark:bg-zinc-800">
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <svg className="mb-3 h-12 w-12 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">No image selected</p>
                </div>
              </div>
            )}

            {/* Upload Options */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-black/5 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Image
                </label>
              </div>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleImageChange(e.target.value)}
                placeholder="Or paste image URL"
                className="w-full rounded-lg border border-black/5 bg-zinc-50 px-3 py-2 text-xs outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* Form Fields - Right */}
        <div className="lg:col-span-2 space-y-5">
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Helmet Pro, LED Bike Light"
              required
              className="w-full rounded-xl border border-black/5 bg-zinc-50 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500 dark:text-zinc-400">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
                className="w-full rounded-xl border border-black/5 bg-zinc-50 pl-8 pr-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location.zone}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { 
                  ...formData.location, 
                  zone: e.target.value 
                } 
              })}
              placeholder="e.g., Place A, Place B, Checkout"
              required
              className="w-full rounded-xl border border-black/5 bg-zinc-50 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-black/5 pt-6 dark:border-white/10">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-black/5 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          {product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}


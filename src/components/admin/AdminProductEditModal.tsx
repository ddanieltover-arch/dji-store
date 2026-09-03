import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Product, ProductVariant } from '../../types';

const CATEGORIES: Product['category'][] = [
  'camera-drones',
  'handheld',
  'professional',
  'accessories',
  'power-care',
  'power',
  'refurbished'
];

const SERIES: Product['series'][] = [
  'Mavic',
  'Air',
  'Mini',
  'Flip',
  'Avata',
  'Neo',
  'Inspire',
  'Osmo',
  'Pocket',
  'Action',
  'Osmo360',
  'Mobile',
  'Ronin',
  'Mic',
  'Power',
  'Education',
  'Refurbished',
  'Accessories'
];

interface AdminProductEditModalProps {
  product: Product;
  onClose: () => void;
  onSave: (productId: string, updates: Partial<Product>) => void;
}

export const AdminProductEditModal: React.FC<AdminProductEditModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState({
    modelName: product.modelName,
    sku: product.sku,
    slug: product.slug,
    series: product.series,
    category: product.category,
    categoryLabel: product.categoryLabel,
    tagline: product.tagline,
    description: product.description,
    basePriceEur: product.basePriceEur,
    compareAtPriceEur: product.compareAtPriceEur ?? '',
    badgeLabel: product.badgeLabel ?? '',
    weightGrams: product.weightGrams,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isFeatured: Boolean(product.isFeatured),
    isBestSeller: Boolean(product.isBestSeller),
    isNew: Boolean(product.isNew),
    heroImage: product.images.hero,
    cutoutImage: product.images.cutout
  });

  const [variants, setVariants] = useState<ProductVariant[]>(
    product.variants.map((v) => ({ ...v, includedItems: [...v.includedItems] }))
  );

  useEffect(() => {
    setForm({
      modelName: product.modelName,
      sku: product.sku,
      slug: product.slug,
      series: product.series,
      category: product.category,
      categoryLabel: product.categoryLabel,
      tagline: product.tagline,
      description: product.description,
      basePriceEur: product.basePriceEur,
      compareAtPriceEur: product.compareAtPriceEur ?? '',
      badgeLabel: product.badgeLabel ?? '',
      weightGrams: product.weightGrams,
      rating: product.rating,
      reviewCount: product.reviewCount,
      isFeatured: Boolean(product.isFeatured),
      isBestSeller: Boolean(product.isBestSeller),
      isNew: Boolean(product.isNew),
      heroImage: product.images.hero,
      cutoutImage: product.images.cutout
    });
    setVariants(product.variants.map((v) => ({ ...v, includedItems: [...v.includedItems] })));
  }, [product]);

  const updateVariant = (index: number, patch: Partial<ProductVariant>) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const compareAt =
      form.compareAtPriceEur === '' ? undefined : Number(form.compareAtPriceEur);

    onSave(product.id, {
      modelName: form.modelName.trim(),
      sku: form.sku.trim(),
      slug: form.slug.trim(),
      series: form.series,
      category: form.category,
      categoryLabel: form.categoryLabel.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      basePriceEur: Number(form.basePriceEur) || 0,
      compareAtPriceEur: Number.isFinite(compareAt) ? compareAt : undefined,
      badgeLabel: form.badgeLabel.trim() || undefined,
      weightGrams: Number(form.weightGrams) || 0,
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0,
      isFeatured: form.isFeatured,
      isBestSeller: form.isBestSeller,
      isNew: form.isNew,
      images: {
        ...product.images,
        hero: form.heroImage.trim(),
        cutout: form.cutoutImage.trim(),
        gallery: product.images.gallery?.length
          ? product.images.gallery
          : [form.heroImage.trim()].filter(Boolean)
      },
      variants: variants.map((v) => ({
        ...v,
        sku: v.sku.trim(),
        comboName: v.comboName.trim(),
        tagline: v.tagline?.trim() || undefined,
        priceEur: Number(v.priceEur) || 0,
        stockQuantity: Number(v.stockQuantity) || 0,
        inStock: Number(v.stockQuantity) > 0,
        weightGrams: Number(v.weightGrams) || 0
      }))
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-200">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Edit product</h3>
            <p className="text-xs text-gray-500 font-mono">{product.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600 font-medium">Model name</span>
              <input
                required
                value={form.modelName}
                onChange={(e) => setForm((f) => ({ ...f, modelName: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 font-medium">SKU</span>
              <input
                required
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-mono"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 font-medium">Slug</span>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-mono"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 font-medium">Series</span>
              <select
                value={form.series}
                onChange={(e) => setForm((f) => ({ ...f, series: e.target.value as Product['series'] }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              >
                {SERIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 font-medium">Category</span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as Product['category'] }))
                }
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600 font-medium">Category label</span>
              <input
                value={form.categoryLabel}
                onChange={(e) => setForm((f) => ({ ...f, categoryLabel: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600 font-medium">Tagline</span>
              <input
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600 font-medium">Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 font-medium">Base price (EUR)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.basePriceEur}
                onChange={(e) => setForm((f) => ({ ...f, basePriceEur: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 font-medium">Compare-at price (EUR)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.compareAtPriceEur}
                onChange={(e) => setForm((f) => ({ ...f, compareAtPriceEur: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 font-medium">Badge</span>
              <input
                value={form.badgeLabel}
                onChange={(e) => setForm((f) => ({ ...f, badgeLabel: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 font-medium">Weight (g)</span>
              <input
                type="number"
                min="0"
                value={form.weightGrams}
                onChange={(e) => setForm((f) => ({ ...f, weightGrams: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600 font-medium">Hero image URL</span>
              <input
                value={form.heroImage}
                onChange={(e) => setForm((f) => ({ ...f, heroImage: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600 font-medium">Cutout image URL</span>
              <input
                value={form.cutoutImage}
                onChange={(e) => setForm((f) => ({ ...f, cutoutImage: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {(
              [
                ['isFeatured', 'Featured'],
                ['isBestSeller', 'Best seller'],
                ['isNew', 'New']
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="inline-flex items-center gap-2 font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                />
                {label}
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900">Variants / packages</h4>
            {variants.map((variant, index) => (
              <div key={variant.id} className="rounded-2xl border border-gray-200 p-4 space-y-3 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs">
                    <span className="text-gray-500 font-medium">Combo name</span>
                    <input
                      value={variant.comboName}
                      onChange={(e) => updateVariant(index, { comboName: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="text-gray-500 font-medium">SKU</span>
                    <input
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, { sku: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm font-mono"
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="text-gray-500 font-medium">Price (EUR)</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.priceEur}
                      onChange={(e) => updateVariant(index, { priceEur: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="text-gray-500 font-medium">Stock qty</span>
                    <input
                      type="number"
                      min="0"
                      value={variant.stockQuantity}
                      onChange={(e) =>
                        updateVariant(index, { stockQuantity: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#E30613] text-white hover:bg-[#c5050f]"
            >
              Save product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

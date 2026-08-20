import React from 'react';
import { DJI_PRODUCTS } from '../../data/products';
import { useStore } from '../../context/StoreContext';
import {
  buildCompatibilityMatrix,
  buildUpgradePaths,
  enrichProductContent,
  generateProductFaqs,
  recommendAccessories
} from '../../lib/pim/wave3Intelligence';

export const Wave3PdpModules: React.FC<{ productId: string }> = ({ productId }) => {
  const { navigateToPdp } = useStore();
  const product = DJI_PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;
  const copy = enrichProductContent(product);
  const faqs = generateProductFaqs(product);
  const compat = buildCompatibilityMatrix(DJI_PRODUCTS).find((c) => c.productId === productId);
  const path = buildUpgradePaths(DJI_PRODUCTS).find((u) => u.productId === productId);
  const recs = recommendAccessories(DJI_PRODUCTS).filter((r) => r.productId === productId).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold text-[#E30613] uppercase tracking-wider">Product Intelligence</p>
        <h2 className="text-2xl font-black text-gray-900 mt-1">{copy.headline}</h2>
        <p className="text-sm text-gray-600 mt-2">{copy.summary}</p>
      </div>

      {path && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h3 className="font-black text-gray-900 mb-3">Upgrade path</h3>
          <div className="flex flex-wrap gap-2">
            {path.spine.map((s) => (
              <button
                key={s.productId}
                type="button"
                onClick={() => navigateToPdp(s.productId)}
                className={`px-3 py-2 rounded-xl text-xs font-bold ${
                  s.productId === productId ? 'bg-[#1D1D1F] text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {s.tier}
              </button>
            ))}
          </div>
        </div>
      )}

      {compat && compat.labels.length > 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h3 className="font-black text-gray-900 mb-3">Compatible with</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
            {compat.labels.slice(0, 8).map((label) => (
              <li key={label}>• {label}</li>
            ))}
          </ul>
        </div>
      )}

      {recs.length > 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h3 className="font-black text-gray-900 mb-3">Accessory recommendations</h3>
          <ul className="space-y-1 text-sm">
            {recs.map((r) => {
              const acc = DJI_PRODUCTS.find((p) => p.id === r.accessoryId);
              return (
                <li key={`${r.accessoryId}-${r.bucket}`} className="flex justify-between">
                  <span>
                    {acc?.modelName} · {r.bucket}
                  </span>
                  <span className="text-gray-400">{Math.round(r.confidence * 100)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <h3 className="font-black text-gray-900 mb-3">FAQs</h3>
        <dl className="space-y-4">
          {faqs.map((f) => (
            <div key={f.topic}>
              <dt className="font-bold text-gray-900">{f.question}</dt>
              <dd className="text-sm text-gray-600 mt-1">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

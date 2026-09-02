import React from 'react';
import {
  Scale,
  X,
  Plus,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DJI_PRODUCTS } from '../data/products';
import { formatPrice } from '../data/currency';
import { productListingImage } from '../lib/pim/productListingImage';
import { generateComparison } from '../lib/pim/wave3Intelligence';

export const ComparePage: React.FC = () => {
  const {
    compareList,
    toggleCompare,
    clearCompare,
    addToCart,
    navigateToPdp,
    setViewMode,
    currency
  } = useStore();

  const comparedProducts = DJI_PRODUCTS.filter((p) => compareList.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-bold text-[#E30613] uppercase tracking-wider block">
            Specification Head-to-Head
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Compare DJI Flight Systems
          </h1>
        </div>

        {comparedProducts.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear All Models
          </button>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No products selected for comparison</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click the scale icon <Scale className="w-3.5 h-3.5 inline text-gray-400" /> on any product card in the catalog to add up to 4 models.
          </p>
          <button
            onClick={() => setViewMode('plp')}
            className="px-6 py-2.5 rounded-xl bg-[#1D1D1F] text-white font-bold text-xs hover:bg-black"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {comparedProducts.length === 2 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs">
              <div className="font-black text-gray-900 mb-2">
                {generateComparison(comparedProducts[0], comparedProducts[1]).title}
              </div>
              {generateComparison(comparedProducts[0], comparedProducts[1]).rows.map((row) => (
                <p key={row.category} className="text-gray-600">
                  {row.category}: {row.left} vs {row.right}
                  {row.winner !== 'tie' ? ` · edge ${row.winner}` : ''}
                </p>
              ))}
            </div>
          )}
        <div className="overflow-x-auto bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 w-48 font-bold text-gray-400 uppercase text-[10px]">
                  Aircraft Model
                </th>
                {comparedProducts.map((product) => (
                  <th key={product.id} className="p-4 min-w-[220px] align-top">
                    <div className="relative space-y-2">
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={productListingImage(product)}
                        alt={product.modelName}
                        className="h-28 w-auto object-contain mx-auto"
                      />
                      <h4 className="font-extrabold text-sm text-gray-900 text-center">
                        {product.modelName}
                      </h4>
                      <div className="text-center font-black text-sm text-gray-900">
                        {formatPrice(product.basePriceEur, currency)}
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => addToCart(product, product.variants[0], 1)}
                          className="flex-1 py-1.5 rounded-lg bg-[#E30613] text-white font-bold text-[11px] hover:bg-[#c20510]"
                        >
                          Add to Bag
                        </button>
                        <button
                          onClick={() => navigateToPdp(product.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-800 font-bold text-[11px] hover:bg-gray-200"
                        >
                          PDP
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* EASA Class */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/50">EASA European Class</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-extrabold text-emerald-700">
                    {p.easaClass || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Takeoff Weight */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Takeoff Weight</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-gray-800">
                    {p.weightGrams} grams
                  </td>
                ))}
              </tr>

              {/* Max Flight Time */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Max Flight Time</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-gray-800">
                    {p.flightTimeMinutes ? `${p.flightTimeMinutes} Minutes` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Primary Camera Sensor */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Camera Sensor</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-gray-800">
                    {p.features[0]?.title || 'Multi-Sensor'}
                  </td>
                ))}
              </tr>

              {/* Max Video Resolution */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Video Resolution</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-gray-800">
                    {p.specifications[0]?.attributes.find((a) => a.name.includes('Video'))?.value || '4K HDR'}
                  </td>
                ))}
              </tr>

              {/* Transmission System */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Video Transmission</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-gray-800">
                    DJI O4 (20km HD Low Latency)
                  </td>
                ))}
              </tr>

              {/* EU Warranty */}
              <tr>
                <td className="p-4 font-bold text-gray-700 bg-gray-50/50">European Warranty</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 24 Months Official
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
};

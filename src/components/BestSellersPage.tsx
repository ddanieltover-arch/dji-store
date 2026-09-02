import React, { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { DJI_PRODUCTS } from '../data/products';
import { formatPrice } from '../data/currency';
import { productListingImage } from '../lib/pim/productListingImage';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

type BestTab = 'bestsellers' | 'accessories';

export const BestSellersPage: React.FC = () => {
  const { navigateToPdp, navigateToPlp, addToCart, currency } = useStore();
  const [tab, setTab] = useState<BestTab>('bestsellers');

  const bestSellers = useMemo(
    () => DJI_PRODUCTS.filter((p) => p.isBestSeller || p.isFeatured),
    []
  );
  const accessories = useMemo(
    () =>
      DJI_PRODUCTS.filter(
        (p) => p.category === 'accessories' || p.category === 'power-care' || p.category === 'power'
      ),
    []
  );

  const buyNow = (product: Product) => {
    const variant = product.variants[0];
    if (variant) addToCart(product, variant, 1);
  };

  return (
    <div className="bg-white min-h-full pb-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <p className="text-sm font-medium text-gray-500 mb-2">Top Picks!</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F]">
          Explore our top-selling gear and upgrade your setup.
        </h1>
        <div className="mt-8 flex gap-8 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setTab('bestsellers')}
            className={`pb-3 text-sm ${
              tab === 'bestsellers'
                ? 'font-semibold text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Best Sellers
          </button>
          <button
            type="button"
            onClick={() => setTab('accessories')}
            className={`pb-3 text-sm ${
              tab === 'accessories'
                ? 'font-semibold text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Essential Accessories
          </button>
        </div>
      </section>

      {tab === 'bestsellers' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Best Sellers</h2>
            <p className="text-sm text-gray-500 mb-10">
              Check out the best-selling products of 2026 and gear up for the new season.
            </p>
          </div>
          {bestSellers.map((product, index) => (
            <article
              key={product.id}
              className={`flex flex-col lg:flex-row gap-8 lg:gap-14 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => navigateToPdp(product.id)}
                className="bg-[#F5F5F7] rounded-2xl aspect-[4/3] flex items-center justify-center px-10 w-full lg:w-1/2"
              >
                <img
                  src={productListingImage(product)}
                  alt={product.modelName}
                  className="max-h-[78%] max-w-[80%] object-contain"
                />
              </button>
                <div className="space-y-4 max-w-lg lg:w-1/2">
                <p className="text-sm text-gray-500">{product.tagline}</p>
                <h3 className="text-2xl font-semibold tracking-tight">{product.modelName}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{product.description}</p>
                <p className="text-lg font-medium">{formatPrice(product.basePriceEur, currency)}</p>
                {product.compareAtPriceEur && product.compareAtPriceEur > product.basePriceEur ? (
                  <p className="text-sm text-gray-400 line-through -mt-3">
                    {formatPrice(product.compareAtPriceEur, currency)}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => buyNow(product)}
                  className="inline-flex items-center justify-center min-h-11 px-8 rounded-full bg-[#1D1D1F] text-white text-sm font-medium hover:bg-black"
                >
                  Buy Now
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {tab === 'accessories' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <h2 className="text-2xl font-semibold mb-2">Essential Accessories</h2>
          <p className="text-sm text-gray-500 mb-8">Everything you need to get more out of your gear.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {accessories.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => navigateToPdp(product.id)}
                className="text-left group"
              >
                <div className="bg-[#F5F5F7] rounded-xl aspect-square flex items-center justify-center mb-3 px-6">
                  <img
                    src={productListingImage(product)}
                    alt=""
                    className="max-h-[75%] max-w-[80%] object-contain group-hover:scale-[1.03] transition-transform"
                  />
                </div>
                <p className="text-sm font-medium line-clamp-2">{product.modelName}</p>
                <p className="text-sm text-gray-500 mt-1">{formatPrice(product.basePriceEur, currency)}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigateToPlp('accessories')}
            className="mt-10 inline-flex items-center gap-1 text-sm font-medium text-[#0070d5] hover:underline"
          >
            View All Accessories <ChevronRight className="h-4 w-4" />
          </button>
        </section>
      )}
    </div>
  );
};

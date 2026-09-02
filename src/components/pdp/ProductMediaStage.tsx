import React, { useState, useCallback } from 'react';
import { Images, Play } from 'lucide-react';
import type { Product } from '../../types';
import { resolveMediaUrl } from '../../lib/pim/resolveMediaUrl';

type MediaTab = 'photos' | 'intro';

interface ProductMediaStageProps {
  product: Product;
  galleryImages: string[];
  badges?: React.ReactNode;
}

export const ProductMediaStage: React.FC<ProductMediaStageProps> = ({
  product,
  galleryImages,
  badges
}) => {
  const hasIntro = Boolean(product.media?.intro?.videoUrl);

  const [activeTab, setActiveTab] = useState<MediaTab>('photos');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(() => new Set());

  const fallbackImage = `/products/${product.id}-cutout.png`;

  const displayUrl = useCallback(
    (rawUrl?: string) => {
      const resolved = resolveMediaUrl(rawUrl) ?? rawUrl ?? fallbackImage;
      return brokenUrls.has(resolved) ? fallbackImage : resolved;
    },
    [brokenUrls, fallbackImage]
  );

  const handleImageError = useCallback((url: string) => {
    setBrokenUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  const tabButtonClass = (tab: MediaTab) => {
    const active = activeTab === tab;
    return active
      ? 'inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 text-gray-900 text-xs font-bold'
      : 'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors';
  };

  return (
    <div className="space-y-4">
      <div className="relative w-fit max-w-full mx-auto rounded-3xl bg-white border border-gray-200/90 shadow-sm overflow-hidden">
        {badges && <div className="absolute top-4 left-4 flex items-center gap-2 z-10">{badges}</div>}

        <div className="flex items-center justify-center bg-white">
          {activeTab === 'photos' && (
            <img
              src={displayUrl(galleryImages[selectedImageIndex] || product.images.hero)}
              alt={product.modelName}
              className="block w-auto h-auto max-w-full max-h-[min(520px,70vh)] object-contain"
              onError={(e) => handleImageError(e.currentTarget.src)}
            />
          )}

          {activeTab === 'intro' && hasIntro && (
            <video
              key={product.media!.intro!.videoUrl}
              src={product.media!.intro!.videoUrl}
              poster={product.media!.intro!.posterUrl || product.images.hero}
              controls
              playsInline
              className="block w-auto h-auto max-w-full max-h-[min(520px,70vh)] bg-black object-contain"
            />
          )}
        </div>

        {hasIntro && (
          <div className="border-t border-gray-900/10 bg-white w-full">
            <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setActiveTab('photos')} className={tabButtonClass('photos')}>
                <Images className="w-3.5 h-3.5" />
                Photos
              </button>
              <button type="button" onClick={() => setActiveTab('intro')} className={tabButtonClass('intro')}>
                <Play className="w-3.5 h-3.5" />
                Intro
              </button>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'photos' && galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImageIndex(idx)}
              className={`w-20 h-20 rounded-2xl bg-white border-2 overflow-hidden shrink-0 transition-all p-1 ${
                selectedImageIndex === idx
                  ? 'border-[#E30613] shadow-md ring-2 ring-red-100'
                  : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={displayUrl(img)}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => handleImageError(e.currentTarget.src)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

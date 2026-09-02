import { DJI_PRODUCTS } from '../src/data/products';

const p = DJI_PRODUCTS.find((x) => x.slug === 'dji-mavic-3-pro');
if (!p) {
  console.log('not found');
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      variants: p.variants.map((v) => ({ name: v.comboName, price: v.priceEur })),
      galleryCount: p.images.gallery.length,
      gallerySample: p.images.gallery.slice(0, 3),
      hasPlaceholderGallery: p.images.gallery.some((g) => g.includes('gallery-2') || g.includes('cutout'))
    },
    null,
    2
  )
);

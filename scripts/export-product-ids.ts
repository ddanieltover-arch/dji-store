import { writeFileSync } from 'node:fs';
import { DJI_PRODUCTS } from '../src/data/products';

writeFileSync(
  '.tmp/product-ids.json',
  JSON.stringify(DJI_PRODUCTS.map((p) => p.id), null, 2)
);
console.log(`Exported ${DJI_PRODUCTS.length} product ids`);

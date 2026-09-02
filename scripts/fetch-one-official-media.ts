import { readFileSync, writeFileSync } from 'node:fs';
import { fetchOfficialStoreMedia } from '../src/lib/pim/fetchOfficialStoreMedia';

const slug = process.argv[2] || 'dji-mavic-3-pro';
const cachePath = 'src/data/officialStoreMediaCache.json';
const cache = JSON.parse(readFileSync(cachePath, 'utf8'));
const entry = await fetchOfficialStoreMedia(slug);
cache[slug] = entry;
writeFileSync(cachePath, JSON.stringify(cache, null, 2));
console.log(slug, 'carousel frames:', entry.carouselGallery?.length ?? 0);

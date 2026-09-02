import { readFileSync, writeFileSync } from 'node:fs';

const missing = JSON.parse(readFileSync('.tmp/wave6-sellable-missing.json', 'utf8')).missing as string[];

const header = `/** Auto-generated from store.dji.com Wave 6 category crawl — do not edit by hand. */
export const WAVE6_SELLABLE_SLUGS: string[] = `;

const body = JSON.stringify(missing, null, 2);
const footer = ';\nexport const WAVE6_SELLABLE_SLUG_COUNT = WAVE6_SELLABLE_SLUGS.length;\n';

writeFileSync('src/data/wave6CategoryManifest.ts', header + body + footer);
console.log(`Wrote ${missing.length} slugs to src/data/wave6CategoryManifest.ts`);

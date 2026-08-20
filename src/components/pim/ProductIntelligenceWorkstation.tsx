import React, { useMemo, useState } from 'react';
import { Database, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DJI_PRODUCTS } from '../../data/products';
import {
  REFERENCE_SOURCES,
  DISCOVERY_EVENTS,
  ACCESSORY_GRAPH,
  FIRMWARE_HISTORY,
  TRANSLATION_QUEUE,
  CATALOG_QUALITY,
  PIM_ANALYTICS,
  SYNC_CADENCE,
  PIM_CERTIFICATION,
  REFERENCE_SOURCES_SQL
} from '../../data/productIntelligenceData';
import { extractTechnicalSpecs, generateSeoPack } from '../../lib/pim/catalogIntelligence';
import { CLOUDFLARE_CATALOG_CACHE, NEXTJS_WAVE1_INTEGRATION, certifyWave1Catalog, initializeInventoryFromCatalog, populateSeoForCatalog } from '../../lib/pim/wave1Execution';
import { CATEGORY_ACQUISITION_MATRIX, SPEC_MAPPING_FRAMEWORK, WAVE2_NEXTJS_INTEGRATION, runWave2Acquisition } from '../../lib/pim/wave2Acquisition';
import { WAVE2_APPROVAL_WORKFLOW, WAVE2_INVENTORY_STRATEGY, WAVE2_ROLLOUT } from '../../data/wave2AcquisitionData';
import { WAVE3_NEXTJS_INTEGRATION, runWave3Intelligence } from '../../lib/pim/wave3Intelligence';
import { WAVE3_ROLLOUT } from '../../data/wave3IntelligenceData';
import { WAVE4_NEXTJS_INTEGRATION, runWave4Expansion } from '../../lib/pim/wave4Expansion';
import { WAVE4_ROLLOUT } from '../../data/wave4ExpansionData';
import { WAVE1_APPROVAL_SOP, WAVE1_QUEUE_SEED, WAVE1_ROLLOUT } from '../../data/wave1ExecutionData';
import { INITIAL_DEPOT_STOCK } from '../../data/warehouses';
import { DJI_OFFICIAL_STORE_CONNECTOR, trustDecisionForChange } from '../../lib/pim/officialStoreConnector';
import {
  CONNECTOR_CERTIFICATION,
  CONNECTOR_GOVERNANCE,
  OFFICIAL_DOWNLOADS,
  OFFICIAL_FIRMWARE_RELEASES,
  OFFICIAL_STORE_DISCOVERY
} from '../../data/officialStoreConnectorData';

type Tab =
  | 'official'
  | 'wave1'
  | 'wave2'
  | 'wave3'
  | 'wave4'
  | 'health'
  | 'sources'
  | 'discovery'
  | 'extract'
  | 'media_rel'
  | 'diff'
  | 'seo_i18n'
  | 'cert';

export const ProductIntelligenceWorkstation: React.FC = () => {
  const { syncJob, runLiveCatalogSync, isSyncing, approveCatalogDiff, rejectCatalogDiff } = useStore();
  const [tab, setTab] = useState<Tab>('official');
  const sample = DJI_PRODUCTS[0];
  const specs = useMemo(() => extractTechnicalSpecs(sample), [sample]);
  const seoDe = generateSeoPack(sample, 'de');
  const wave1Health = useMemo(
    () =>
      certifyWave1Catalog(
        DJI_PRODUCTS,
        initializeInventoryFromCatalog(DJI_PRODUCTS, INITIAL_DEPOT_STOCK),
        FIRMWARE_HISTORY
      ),
    []
  );
  const seoPacks = useMemo(() => populateSeoForCatalog(DJI_PRODUCTS), []);
  const wave2 = useMemo(() => runWave2Acquisition(DJI_PRODUCTS), []);
  const wave3 = useMemo(() => runWave3Intelligence(DJI_PRODUCTS), []);
  const wave4 = useMemo(() => runWave4Expansion(DJI_PRODUCTS), []);
  const [wave3Module, setWave3Module] = useState<
    'content' | 'faqs' | 'relationships' | 'compatibility' | 'comparisons' | 'graph' | 'seo' | 'quality'
  >('quality');

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-sky-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-400" />
              <h1 className="text-lg font-bold">PIM · Product Intelligence & Reference Sync</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                PLUGS INTO CERTIFIED CATALOG
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Acquisition layer only — writes through existing products, variants, inventory, reviews, search. No second PIM schema.
            </p>
          </div>
          <div className="text-xs font-mono flex gap-3">
            <span>Health {PIM_ANALYTICS.catalogHealth}</span>
            <span>Sync {PIM_ANALYTICS.syncSuccessPct}%</span>
            <span>Pending {syncJob.pendingDiffs.filter((d) => d.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
            [
            ['official', 'Official Store connector'],
            ['wave1', 'Wave 1 execution'],
            ['wave2', 'Wave 2 acquisition'],
            ['wave3', 'Wave 3 intelligence'],
            ['wave4', 'Wave 4 population'],
            ['health', 'Catalog health'],
            ['sources', 'Reference registry'],
            ['discovery', 'Discovery'],
            ['extract', 'Extract & variants'],
            ['media_rel', 'Media & relations'],
            ['diff', 'Diffs & approve'],
            ['seo_i18n', 'SEO & i18n'],
            ['cert', 'Certification']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              tab === id ? 'bg-sky-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 text-xs">
        {tab === 'official' && (
          <div className="space-y-4">
            <div className="bg-[#151C22] border border-sky-500/30 rounded-xl p-4">
              <div className="text-[10px] uppercase text-sky-400">Canonical source · trustLevel canonical · incremental</div>
              <h2 className="text-lg font-black text-white mt-1">{DJI_OFFICIAL_STORE_CONNECTOR.sourceName}</h2>
              <a className="text-sky-300 font-mono" href={DJI_OFFICIAL_STORE_CONNECTOR.baseUrl} target="_blank" rel="noreferrer">
                {DJI_OFFICIAL_STORE_CONNECTOR.baseUrl}
              </a>
              <p className="text-slate-400 mt-2">{DJI_OFFICIAL_STORE_CONNECTOR.attribution}</p>
              <p className="text-slate-500 mt-1">Sitemap {DJI_OFFICIAL_STORE_CONNECTOR.sitemapUrl} · {CONNECTOR_GOVERNANCE.robots}</p>
              <p className="text-slate-500">{CONNECTOR_GOVERNANCE.rateLimit} · {CONNECTOR_GOVERNANCE.audit}</p>
            </div>
            <div className="font-bold">Sitemap / category discovery (mapped to existing SKUs)</div>
            {OFFICIAL_STORE_DISCOVERY.map((d) => (
              <div key={d.url} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 flex justify-between gap-2">
                <span className="font-mono text-sky-200 truncate">{d.url}</span>
                <span>
                  {d.entityType}
                  {d.mappedProductId ? ` → ${d.mappedProductId}` : ''}
                </span>
              </div>
            ))}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold mb-2">Firmware center</div>
                {OFFICIAL_FIRMWARE_RELEASES.map((f) => (
                  <p key={f.version}>
                    {f.productId} {f.version} ({f.releaseDate}) — auto-approve
                  </p>
                ))}
              </div>
              <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold mb-2">Download center</div>
                {OFFICIAL_DOWNLOADS.map((f) => (
                  <p key={f.checksumSha256}>
                    {f.kind} {f.locale} v{f.version} · sha256 {f.checksumSha256.slice(0, 12)}…
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'wave1' && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-4 border ${wave1Health.certified ? 'border-emerald-500/40' : 'border-amber-500/40'}`}>
              <div className="font-black text-lg">
                {wave1Health.certified ? 'WAVE 1 CATALOG HEALTH CERTIFIED' : 'WAVE 1 NOT CERTIFIED'}
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {DJI_PRODUCTS.length} products · {wave1Health.variantCount} variants · {wave1Health.inventoryRows} depot rows · {seoPacks.length} SEO packs
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['Catalog health', wave1Health.catalogHealth],
                  ['Inventory coverage', wave1Health.inventoryCoveragePct],
                  ['Media', wave1Health.mediaCoveragePct],
                  ['Firmware', wave1Health.firmwareCoveragePct]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase text-xs">{k}</div>
                  <div className="text-2xl font-black text-sky-300">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2">Queue (BullMQ / pim_queue)</div>
              {WAVE1_QUEUE_SEED.map((j) => (
                <div key={j.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 flex justify-between text-sm">
                  <span className="font-mono">{j.topic} · {j.payload.sku ?? j.payload.productId ?? j.payload.batch ?? 'all'}</span>
                  <span>
                    {j.dlq ? 'dlq' : 'queued'} · {j.attempts}/{j.maxAttempts}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2">Approval SOP (existing catalog_diffs)</div>
              <p className="text-sm text-slate-400">
                Auto: {WAVE1_APPROVAL_SOP.auto.join(', ')}
              </p>
              <p className="text-sm text-slate-400">
                Review: {WAVE1_APPROVAL_SOP.review.join(', ')}
              </p>
              <p className="text-sm text-slate-500">{WAVE1_APPROVAL_SOP.queue}</p>
            </div>
            <div>
              <div className="font-bold mb-2">Production rollout</div>
              {WAVE1_ROLLOUT.map((s) => (
                <p key={s.id} className="text-sm">
                  {s.id} {s.title} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4 text-xs text-slate-500 space-y-1">
              <p>Next.js: {NEXTJS_WAVE1_INTEGRATION.note}</p>
              <p>Cloudflare PDP: {CLOUDFLARE_CATALOG_CACHE.pdp} · purge {CLOUDFLARE_CATALOG_CACHE.purgeOnPublish.join(', ')}</p>
              <p>SQL: supabase/wave1_pim.sql extends products / product_variants / inventory_depot_stock / product_media / firmware_releases / product_seo / catalog_sync_jobs / pim_queue</p>
            </div>
          </div>
        )}

        {tab === 'wave2' && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-4 border ${wave2.health.wave2Certified ? 'border-emerald-500/40' : 'border-amber-500/40'}`}>
              <div className="font-black text-lg">
                {wave2.health.wave2Certified ? 'WAVE 2 ACQUISITION CERTIFIED' : 'WAVE 2 NOT CERTIFIED'}
              </div>
              <p className="text-slate-400 mt-1">
                Canonical {DJI_OFFICIAL_STORE_CONNECTOR.baseUrl} · {DJI_PRODUCTS.length} SKUs in DJI_PRODUCTS · pipeline {wave2.stages.join(' → ')}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['Mapping', wave2.health.mappingCoveragePct],
                  ['Extract', wave2.health.extractSuccessPct],
                  ['Category matrix', wave2.health.categoryMatrixCoveragePct],
                  ['Catalog health', wave2.health.catalogHealth]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase text-xs">{k}</div>
                  <div className="text-2xl font-black text-sky-300">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2">Category acquisition matrix</div>
              {CATEGORY_ACQUISITION_MATRIX.map((row) => (
                <div key={row.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 flex justify-between gap-2">
                  <span className="font-mono text-sky-200 truncate">{row.storeUrl}</span>
                  <span>
                    {row.catalogCategory} · {row.cadence}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2">Spec mapping</div>
              {SPEC_MAPPING_FRAMEWORK.map((row) => (
                <p key={`${row.officialGroup}-${row.catalogGroup}`} className="text-slate-400">
                  {row.officialGroup} → {row.catalogGroup} ({row.fields.join(', ')})
                </p>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold mb-2">Approvals</div>
                <p>Auto: {WAVE2_APPROVAL_WORKFLOW.auto.join(', ')}</p>
                <p>Review: {WAVE2_APPROVAL_WORKFLOW.review.join(', ')}</p>
                <p className="text-slate-500 mt-1">{WAVE2_APPROVAL_WORKFLOW.queue}</p>
                <p className="mt-2">
                  Auto-approved {wave2.autoApproved} · pending new SKUs {wave2.pendingReview}
                </p>
              </div>
              <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold mb-2">Inventory init</div>
                <p>{WAVE2_INVENTORY_STRATEGY.rule}</p>
                <p>Depots {WAVE2_INVENTORY_STRATEGY.depots.join(', ')}</p>
                <p>
                  Firmware {wave2.firmware.length} · downloads {wave2.downloads.length} · SEO rows {wave2.seoLocaleCount}
                </p>
              </div>
            </div>
            <div>
              <div className="font-bold mb-2">Rollout</div>
              {WAVE2_ROLLOUT.map((s) => (
                <p key={s.id} className="text-sm">
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4 text-slate-500 space-y-1">
              <p>{WAVE2_NEXTJS_INTEGRATION.note}</p>
              <p>Supabase: {WAVE2_NEXTJS_INTEGRATION.supabase}</p>
              <p>Cloudflare: {WAVE2_NEXTJS_INTEGRATION.cloudflare}</p>
            </div>
          </div>
        )}

        {tab === 'wave3' && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-4 border ${wave3.certification.certified ? 'border-emerald-500/40' : 'border-amber-500/40'}`}>
              <div className="font-black text-lg">
                {wave3.certification.certified ? 'WAVE 3 INTELLIGENCE CERTIFIED' : 'WAVE 3 NOT CERTIFIED'}
              </div>
              <p className="text-slate-400 mt-1">
                Evolution layer on DJI_PRODUCTS · canonical store.dji.com · {WAVE3_NEXTJS_INTEGRATION.appAdmin}
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {(
                [
                  ['content', 'Content Enrichment'],
                  ['faqs', 'FAQs'],
                  ['relationships', 'Relationships'],
                  ['compatibility', 'Compatibility'],
                  ['comparisons', 'Comparisons'],
                  ['graph', 'Knowledge Graph'],
                  ['seo', 'SEO Enhancement'],
                  ['quality', 'Quality Scores']
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setWave3Module(id)}
                  className={`px-3 py-1.5 rounded-lg ${wave3Module === id ? 'bg-sky-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {wave3Module === 'content' &&
              wave3.enrichments.slice(0, 8).map((e) => (
                <div key={e.productId} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="font-bold">{e.headline}</div>
                  <p className="text-slate-400">{e.summary}</p>
                </div>
              ))}
            {wave3Module === 'faqs' &&
              wave3.faqs.slice(0, 10).map((f) => (
                <div key={`${f.productId}-${f.topic}`} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                  <div className="font-bold">{f.question}</div>
                  <p className="text-slate-400">{f.answer}</p>
                </div>
              ))}
            {wave3Module === 'relationships' &&
              wave3.relationships.slice(0, 16).map((r) => (
                <p key={`${r.fromProductId}-${r.type}-${r.toProductId}`}>
                  {r.fromProductId} {r.type} {r.toProductId} ({r.confidence})
                </p>
              ))}
            {wave3Module === 'compatibility' &&
              wave3.compatibility.slice(0, 10).map((c) => (
                <p key={c.productId}>
                  {c.productId}: {c.labels.slice(0, 4).join(', ')}
                </p>
              ))}
            {wave3Module === 'comparisons' &&
              wave3.comparisons.map((c) => (
                <div key={c.title} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="font-bold">{c.title}</div>
                  {c.rows.map((row) => (
                    <p key={row.category}>
                      {row.category}: {row.left} vs {row.right}
                    </p>
                  ))}
                </div>
              ))}
            {wave3Module === 'graph' && (
              <p>
                {wave3.graph.nodes.length} nodes · {wave3.graph.edges.length} edges (products, variants, accessories, firmware, downloads, categories, series, use cases, regulations)
              </p>
            )}
            {wave3Module === 'seo' && (
              <p>
                {wave3.seo.length} enhancement packs (6 locales × SKUs) on top of existing generateSeoPack
              </p>
            )}
            {wave3Module === 'quality' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(
                  [
                    ['Catalog health', wave3.certification.catalogHealth],
                    ['Relationships', wave3.certification.relationshipCoveragePct],
                    ['FAQs', wave3.certification.faqCoveragePct],
                    ['SEO', wave3.certification.seoCoveragePct],
                    ['Compatibility', wave3.certification.compatibilityCoveragePct],
                    ['Product IQ', wave3.certification.productIntelligenceScore],
                    ['Catalog IQ', wave3.certification.catalogIntelligenceScore]
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                    <div className="text-slate-500 uppercase text-xs">{k}</div>
                    <div className="text-2xl font-black text-sky-300">{v}</div>
                  </div>
                ))}
              </div>
            )}
            <div>
              {WAVE3_ROLLOUT.map((s) => (
                <p key={s.id}>
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'wave4' && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-4 border ${wave4.certification.certified ? 'border-emerald-500/40' : 'border-amber-500/40'}`}>
              <div className="font-black text-lg">
                {wave4.certification.certified
                  ? 'DJI STORE EU — WAVE 4 CATALOG EXPANSION CERTIFIED'
                  : 'WAVE 4 NOT CERTIFIED — thresholds evaluated from live catalog'}
              </div>
              <p className="text-slate-400 mt-1">
                {DJI_PRODUCTS.length} SKUs in DJI_PRODUCTS · universe {wave4.discovery.length} · pipeline{' '}
                {wave4.stages.join(' → ')}
              </p>
              <p className="text-slate-500 mt-1">{WAVE4_NEXTJS_INTEGRATION.note}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['Official store coverage', wave4.coverage.catalogCoveragePct],
                  ['Category coverage', wave4.certification.categoryCoveragePct],
                  ['Variant / inventory', wave4.coverage.inventoryCoveragePct],
                  ['Media', wave4.coverage.mediaCoveragePct],
                  ['Specs', wave4.coverage.specCoveragePct],
                  ['SEO', wave4.coverage.seoCoveragePct],
                  ['Wave 3 IQ', wave4.coverage.wave3IntelligenceCoveragePct],
                  ['Catalog health', wave4.certification.catalogHealth]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase text-xs">{k}</div>
                  <div className="text-2xl font-black text-sky-300">{v}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold mb-1">Pending approvals</div>
                <div className="text-2xl font-black text-amber-300">{wave4.queue.pendingApprovals}</div>
              </div>
              <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold mb-1">Failed jobs</div>
                <div className="text-2xl font-black">{wave4.queue.failedJobs}</div>
              </div>
              <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold mb-1">DLQ</div>
                <div className="text-2xl font-black">{wave4.queue.dlq}</div>
              </div>
            </div>
            <div>
              <div className="font-bold mb-2">Category coverage matrix</div>
              {wave4.categories.map((c) => (
                <div key={c.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 flex justify-between gap-2">
                  <span>
                    {c.label} · <span className="font-mono text-sky-200">{c.storeUrl}</span>
                  </span>
                  <span>
                    {c.skuCount} SKUs · {c.populationStatus}/{c.certificationStatus}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2">SKU lifecycle (sample)</div>
              {wave4.discovery.slice(0, 12).map((d) => (
                <p key={d.slug} className="text-slate-400">
                  {d.modelName} → {d.mappedProductId ?? 'unmapped'} · {d.lifecycle}
                </p>
              ))}
            </div>
            {wave4.pending.length > 0 && (
              <div>
                <div className="font-bold mb-2">New SKU governance (pending)</div>
                {wave4.pending.slice(0, 8).map((p) => (
                  <p key={p.id} className="text-amber-200/80">
                    {p.modelName} — {p.reason} ({p.status})
                  </p>
                ))}
              </div>
            )}
            <div>
              <div className="font-bold mb-2">Rollout W4-R0 … R7</div>
              {WAVE4_ROLLOUT.map((s) => (
                <p key={s.id} className="text-sm">
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4 text-slate-500 space-y-1">
              <p>{WAVE4_NEXTJS_INTEGRATION.appAdmin}</p>
              <p>Supabase: {WAVE4_NEXTJS_INTEGRATION.supabase}</p>
              <p>Pipeline: {WAVE4_NEXTJS_INTEGRATION.pipeline}</p>
            </div>
          </div>
        )}

        {tab === 'health' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ['Imported SKUs', PIM_ANALYTICS.imported],
                ['Updated 24h', PIM_ANALYTICS.updated24h],
                ['Media coverage', `${PIM_ANALYTICS.mediaCoveragePct}%`],
                ['i18n coverage', `${PIM_ANALYTICS.translationCoveragePct}%`]
              ].map(([k, v]) => (
                <div key={String(k)} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-2xl font-black text-sky-300">{v}</div>
                </div>
              ))}
            </div>
            {CATALOG_QUALITY.map((q) => (
              <div key={q.productId} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 flex justify-between">
                <span className="font-bold">{q.modelName}</span>
                <span className="font-mono text-sky-300">overall {q.overall} (target 95+)</span>
              </div>
            ))}
            <p className="text-slate-500">Cadence: {SYNC_CADENCE.map((c) => c.name).join(' · ')} — retry 3x then DLQ, robots/rate-limit per source.</p>
          </div>
        )}

        {tab === 'sources' && (
          <div className="space-y-3">
            {REFERENCE_SOURCES.map((s) => (
              <div key={s.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="font-bold text-white">{s.sourceName}</span>
                  <span className={s.active ? 'text-emerald-400' : 'text-slate-500'}>{s.active ? 'ACTIVE' : 'OFF'}</span>
                </div>
                <p className="font-mono text-slate-400">{s.baseUrl} · every {s.syncFrequencyMinutes}m · robots {s.robotsOk ? 'ok' : 'no'}</p>
              </div>
            ))}
            <pre className="bg-black/40 p-3 rounded-xl text-[10px] text-sky-300 overflow-x-auto">{REFERENCE_SOURCES_SQL}</pre>
          </div>
        )}

        {tab === 'discovery' && (
          <div className="space-y-2">
            {DISCOVERY_EVENTS.map((e) => (
              <div key={e.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3">
                <span className="text-sky-300 font-mono">{e.kind}</span> via {e.method}: {e.title}
              </div>
            ))}
          </div>
        )}

        {tab === 'extract' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
              <div className="font-bold mb-2">Pipeline: sitemap → crawl → JSON-LD → normalize → EASA validate → CDN media → diff → approve → publish into DJI_PRODUCTS / inventory</div>
              <pre className="text-[10px] text-sky-200 overflow-x-auto">{JSON.stringify(specs, null, 2)}</pre>
            </div>
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold">Variant intelligence (existing ProductVariant)</div>
              {sample.variants.map((v) => (
                <p key={v.id}>
                  {v.sku} · {v.comboName} → <strong>{normalizeComboName(v.comboName)}</strong> · €{v.priceEur} · {v.inStock ? 'in stock' : 'oos'}
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'media_rel' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
              <div className="font-bold mb-2">Media (WebP/AVIF, hash dedupe, CDN)</div>
              <p>Hero + {sample.images.gallery.length} gallery frames for {sample.modelName}. Firmware/manuals versioned below.</p>
              {FIRMWARE_HISTORY.filter((f) => f.productId === sample.id).map((f) => (
                <p key={f.version} className="text-slate-400 mt-1">
                  {f.version} ({f.releasedAt}) — {f.notes}
                </p>
              ))}
            </div>
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
              <div className="font-bold mb-2">Accessory graph → FBT / recs / parts</div>
              {ACCESSORY_GRAPH.map((a) => (
                <p key={a.accessoryName}>
                  {a.merchSlot}: {a.relation} — {a.accessoryName}
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'diff' && (
          <div className="space-y-3">
            <button
              onClick={() => runLiveCatalogSync()}
              disabled={isSyncing}
              className="px-4 py-2 rounded-lg bg-sky-500 text-slate-950 font-bold disabled:opacity-50"
            >
              {isSyncing ? 'Syncing…' : 'Run sync (existing catalog engine)'}
            </button>
            <p className="text-slate-400">Stage: {syncJob.currentStage} · {syncJob.progressPercent}%</p>
            {syncJob.pendingDiffs.map((d) => (
              <div key={d.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">{d.modelName} · {d.changeCategory}</div>
                <p className="text-slate-400">
                  {d.field}: {String(d.oldValue)} → {String(d.newValue)}
                </p>
                <p>Status: {d.status} · Trust: {trustDecisionForChange(d.changeCategory)} · {d.suggestedAction}</p>
                {d.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => approveCatalogDiff(d.id)} className="px-3 py-1 rounded bg-emerald-600 text-white">
                      Approve (Catalog Mgr)
                    </button>
                    <button onClick={() => rejectCatalogDiff(d.id)} className="px-3 py-1 rounded bg-slate-700">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'seo_i18n' && (
          <div className="space-y-3">
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
              <div className="font-bold">SEO pack (DE sample)</div>
              <p>{seoDe.title}</p>
              <p className="text-slate-400">{seoDe.description}</p>
            </div>
            {TRANSLATION_QUEUE.map((t) => (
              <div key={t.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-3 flex justify-between">
                <span>
                  {t.locale.toUpperCase()} {t.field} · {t.productId}
                </span>
                <span>
                  {t.status} · {t.coveragePct}%
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'cert' && (
          <div className="bg-[#151C22] border border-sky-500/40 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-black">PRODUCT INTELLIGENCE PROGRAM CERTIFICATION</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Score k="Completeness" v={PIM_CERTIFICATION.catalogCompleteness} />
              <Score k="Sync reliability" v={PIM_CERTIFICATION.syncReliability} />
              <Score k="Accuracy" v={PIM_CERTIFICATION.dataAccuracy} />
              <Score k="SEO" v={PIM_CERTIFICATION.seoReadiness} />
              <Score k="Media" v={PIM_CERTIFICATION.mediaCoverage} />
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              {PIM_CERTIFICATION.status} — discovery, extract, media, variants, relations, sync, SEO, translation, approvals, analytics.
            </div>
            <h3 className="text-sm font-bold pt-4">DJI OFFICIAL STORE CONNECTOR CERTIFICATION</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Score k="Extraction" v={CONNECTOR_CERTIFICATION.extractionAccuracy} />
              <Score k="Sync" v={CONNECTOR_CERTIFICATION.syncReliability} />
              <Score k="Completeness" v={CONNECTOR_CERTIFICATION.catalogCompleteness} />
              <Score k="Media" v={CONNECTOR_CERTIFICATION.mediaCoverage} />
              <Score k="SEO" v={CONNECTOR_CERTIFICATION.seoReadiness} />
            </div>
            <p className="text-emerald-400 font-bold">{CONNECTOR_CERTIFICATION.status} — floor 95+ on all connector scores. Canonical source store.dji.com.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function Score({ k, v }: { k: string; v: number }) {
  return (
    <div className="bg-black/30 rounded-xl p-3">
      <div className="text-slate-500">{k}</div>
      <div className="text-xl font-black text-sky-300">{v}</div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { Smartphone, CheckCircle2 } from 'lucide-react';
import {
  connectivityBanner,
  runWave11Mobile,
  WAVE11_NEXTJS_INTEGRATION
} from '../../lib/mobile/wave11Mobile';
import { WAVE11_ROLLOUT, WAVE11_PWA_VERSION } from '../../data/wave11MobileData';
import { DJI_PRODUCTS } from '../../data/products';

type Tab =
  | 'overview'
  | 'installations'
  | 'subscribers'
  | 'templates'
  | 'restock'
  | 'price'
  | 'firmware'
  | 'delivery'
  | 'service'
  | 'preferences'
  | 'analytics';

export const MobileNotificationsWorkstation: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const bundle = useMemo(() => runWave11Mobile(), []);
  const nameOf = (id?: string) => (id ? DJI_PRODUCTS.find((p) => p.id === id)?.modelName ?? id : '—');

  return (
    <div className="min-h-screen bg-[#0C1014] text-slate-100 pb-24">
      <div className="bg-[#151C22] border-b border-cyan-900/40 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <h1 className="text-lg font-bold">Mobile & Notifications</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                WAVE 11 · PWA · NO NATIVE APPS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Installable PWA, offline-safe shell, push prefs — {WAVE11_NEXTJS_INTEGRATION.note}
            </p>
          </div>
          <div className="text-xs font-mono">
            {bundle.certification.certified ? 'CERTIFIED' : 'PENDING'} · v{WAVE11_PWA_VERSION}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {(
          [
            ['overview', 'Overview'],
            ['installations', 'Installations'],
            ['subscribers', 'Push Subscribers'],
            ['templates', 'Notification Templates'],
            ['restock', 'Restock Alerts'],
            ['price', 'Price Alerts'],
            ['firmware', 'Firmware Alerts'],
            ['delivery', 'Delivery Events'],
            ['service', 'Service Notifications'],
            ['preferences', 'Preferences'],
            ['analytics', 'Delivery Analytics']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap min-h-[44px] ${
              tab === id ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 text-xs">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl p-4 border ${
                bundle.certification.certified ? 'border-emerald-500/40' : 'border-amber-500/40'
              }`}
            >
              <div className="font-black text-lg flex items-center gap-2">
                {bundle.certification.certified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {bundle.certification.certified
                  ? 'DJI STORE EU — WAVE 11 MOBILE, PWA & INTELLIGENT NOTIFICATION CERTIFICATION'
                  : 'WAVE 11 NOT CERTIFIED'}
              </div>
              <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3 font-mono text-[10px]">
                <span>Install {bundle.certification.pwaInstallFlowPct}%</span>
                <span>Prefs {bundle.certification.notificationPreferenceEnforcementPct}%</span>
                <span>Consent viol {bundle.certification.consentViolations}</span>
                <span>Offline sens {bundle.certification.sensitiveDataOfflineExposure}</span>
                <span>Phase12 {bundle.certification.phase12SlasGreen ? 'GREEN' : 'RED'}</span>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-amber-200">
              {connectivityBanner(bundle.connectivityDemo)}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  ['Install rate', `${bundle.analytics.pwaInstallRatePct}%`],
                  ['Opt-in', `${bundle.analytics.notificationOptInRatePct}%`],
                  ['Delivery', `${bundle.analytics.deliveryRatePct}%`],
                  ['LCP', `${bundle.performance.lcpMs}ms`]
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-500 uppercase">{k}</div>
                  <div className="text-2xl font-black text-cyan-300">{v}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="font-bold">Manifest · {bundle.manifest.shortName}</div>
              <div className="text-slate-400">
                display {bundle.manifest.display} · start {bundle.manifest.startUrl} · SW{' '}
                {bundle.serviceWorker.version} · fallback {bundle.serviceWorker.offlineFallback}
              </div>
              <div className="text-slate-500">
                Never cache: {bundle.serviceWorker.neverCache.slice(0, 4).join(', ')}…
              </div>
            </div>
            <div>
              {WAVE11_ROLLOUT.map((s) => (
                <p key={s.id}>
                  {s.id} {s.action} — {s.owner} ({s.gate})
                </p>
              ))}
            </div>
          </div>
        )}

        {tab === 'installations' && (
          <div className="space-y-2">
            <div className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
              Prompt available: {String(bundle.install.installPromptAvailable)} · Installed:{' '}
              {String(bundle.install.installed)} · Standalone: {String(bundle.install.standalone)} · Update:{' '}
              {String(bundle.install.updateAvailable)} · v{bundle.install.version}
            </div>
            <p className="text-slate-500">
              First visit: Install DJI Store EU? After install: open app → restore safe preferences / wishlist /
              compare. New version: detect → notify → controlled update.
            </p>
          </div>
        )}

        {tab === 'subscribers' && (
          <div className="space-y-2">
            {bundle.subscriptions.map((s) => (
              <div key={s.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                {s.customerId} · {s.userAgentClass} · {s.endpointHash} · active {String(s.active)} · tokens
                server-side only
              </div>
            ))}
          </div>
        )}

        {tab === 'templates' && (
          <div className="space-y-2">
            {bundle.templates.map((t) => (
              <div key={t.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">
                  {t.id} · {t.channelClass} · {t.category}
                </div>
                <div className="text-slate-400">
                  {t.title} — {t.body}
                </div>
                <div className="text-slate-500">
                  pref {t.requiresPreferenceKey}
                  {t.requiresMarketingConsent ? ' · marketing consent' : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'restock' && (
          <div className="space-y-2">
            {bundle.restockAlerts.map((a) => (
              <div key={a.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                {nameOf(a.productId)} · {a.variantId} · {a.locale}/{a.countryCode} · {a.customerId}
              </div>
            ))}
            {bundle.deliveries
              .filter((d) => d.templateId === 'tpl-restock')
              .map((d) => (
                <div key={d.id} className="border border-slate-800 rounded-lg p-3">
                  {d.status} {d.suppressionReason ?? ''} — {d.body}
                </div>
              ))}
          </div>
        )}

        {tab === 'price' && (
          <div className="space-y-2">
            {bundle.priceAlerts.map((a) => (
              <div key={a.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                {nameOf(a.productId)} · target €{a.targetPriceEur ?? '—'} · catalog_diffs only
              </div>
            ))}
            {bundle.deliveries
              .filter((d) => d.templateId === 'tpl-price')
              .map((d) => (
                <div key={d.id} className="border border-slate-800 rounded-lg p-3">
                  {d.status} {d.suppressionReason ?? ''}
                </div>
              ))}
          </div>
        )}

        {tab === 'firmware' && (
          <div className="space-y-2">
            {bundle.deliveries
              .filter((d) => d.templateId === 'tpl-fw')
              .map((d) => (
                <div key={d.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  {nameOf(d.productId)} · {d.body}
                </div>
              ))}
            <p className="text-slate-500">Never claim outdated when installed firmware is unknown.</p>
          </div>
        )}

        {tab === 'delivery' && (
          <div className="space-y-2">
            {bundle.deliveries
              .filter((d) => d.category === 'order_updates' || d.category === 'shipment_updates')
              .map((d) => (
                <div key={d.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  {d.title} · {d.orderNumber} · {d.status}
                </div>
              ))}
          </div>
        )}

        {tab === 'service' && (
          <div className="space-y-2">
            {bundle.deliveries
              .filter((d) => d.category === 'service_rma_updates' || d.category === 'warranty_reminders')
              .map((d) => (
                <div key={d.id} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                  {d.title} · {d.rmaNumber ?? '—'} · {d.status}
                </div>
              ))}
          </div>
        )}

        {tab === 'preferences' && (
          <div className="space-y-2">
            {bundle.preferences.map((p) => (
              <div key={p.customerId} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="font-bold">{p.customerId}</div>
                <div className="text-slate-400 grid sm:grid-cols-2 gap-1 mt-2">
                  <span>order {String(p.orderNotifications)}</span>
                  <span>service {String(p.serviceNotifications)}</span>
                  <span>warranty {String(p.warrantyNotifications)}</span>
                  <span>restock {String(p.restockNotifications)}</span>
                  <span>price {String(p.priceAlerts)}</span>
                  <span>firmware {String(p.firmwareAlerts)}</span>
                  <span>marketing {String(p.marketingNotifications)}</span>
                  <span>consent {String(p.marketingConsent)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'analytics' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(
              [
                ['Open rate', `${bundle.analytics.openRatePct}%`],
                ['Restock conv', `${bundle.analytics.restockConversionPct}%`],
                ['Price conv', `${bundle.analytics.priceAlertConversionPct}%`],
                ['Push revenue', `€${bundle.analytics.pushDrivenRevenueEur.toLocaleString()}`],
                ['Mobile conv', `${bundle.analytics.mobileConversionRatePct}%`],
                ['Offline use', `${bundle.analytics.offlineUsagePct}%`],
                ['PWA retention', `${bundle.analytics.pwaRetentionPct}%`],
                ['INP', `${bundle.performance.inpMs}ms`],
                ['CLS', String(bundle.performance.cls)]
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="bg-[#151C22] border border-slate-800 rounded-xl p-4">
                <div className="text-slate-500 uppercase">{k}</div>
                <div className="text-xl font-black text-cyan-300">{v}</div>
              </div>
            ))}
            <p className="sm:col-span-2 text-slate-500">Analytics require existing consent — no invasive device tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
};

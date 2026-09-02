import React, { useMemo, useState } from 'react';
import { runWave9Service, evaluateWarranty, maskSerial } from '../../lib/service/wave9Service';
import { DJI_PRODUCTS } from '../../data/products';

type Section =
  | 'products'
  | 'warranty'
  | 'care'
  | 'tickets'
  | 'rma'
  | 'history'
  | 'firmware'
  | 'documents';

export const ServiceAccountPortal: React.FC = () => {
  const [section, setSection] = useState<Section>('products');
  const bundle = useMemo(() => runWave9Service(), []);
  const nameOf = (id: string) => DJI_PRODUCTS.find((p) => p.id === id)?.modelName ?? id;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
          /account/service · Wave 9
        </span>
        <h3 className="text-xl font-black text-gray-900 mt-2">My Products & Support</h3>
        <p className="text-xs text-gray-500 mt-1">
          Ownership, warranty, Care, tickets, and RMA — linked to your CRM profile and DJI_PRODUCTS.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {(
          [
            ['products', 'My Products'],
            ['warranty', 'Warranty'],
            ['care', 'DJI Care'],
            ['tickets', 'Support Tickets'],
            ['rma', 'Repairs & RMA'],
            ['history', 'Service History'],
            ['firmware', 'Firmware'],
            ['documents', 'Documents']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap border ${
              section === id
                ? 'bg-gray-900 text-white border-gray-900 font-bold'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {section === 'products' && (
        <div className="space-y-3">
          {bundle.ownership.map((o) => (
            <div key={o.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
              <div className="font-bold text-gray-900">{nameOf(o.productId)}</div>
              <div className="text-gray-500">
                S/N {maskSerial(o.serialNumber)} · Order {o.orderId} · {o.status}
                {o.organizationId ? ` · Fleet ${o.organizationId}` : ''}
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-500">
            Register: Account → My Products → Serial → Order verification → Ownership → Warranty activated.
          </p>
        </div>
      )}

      {section === 'warranty' && (
        <div className="space-y-3">
          {bundle.ownership.map((o) => {
            const e = evaluateWarranty(o);
            return (
              <div key={o.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
                <div className="font-bold">{nameOf(o.productId)}</div>
                <div className="text-gray-500">
                  {e.status} · {e.daysRemaining}d remaining · {e.eligible ? 'eligible' : 'not eligible'}
                </div>
                <p className="text-gray-600 mt-1">{e.reason}</p>
              </div>
            );
          })}
        </div>
      )}

      {section === 'care' && (
        <div className="space-y-3">
          {bundle.careViews
            .filter((c) => c.plan.id !== 'none')
            .map((c) => (
              <div key={c.plan.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
                <div className="font-bold">{c.coverageType}</div>
                <div className="text-gray-500">
                  {c.plan.coverageStartDate} → {c.plan.coverageExpiryDate} · {c.remainingClaims} claims ·{' '}
                  {c.renewalStatus}
                </div>
                <p className="text-gray-600 mt-1">{c.reason}</p>
              </div>
            ))}
        </div>
      )}

      {section === 'tickets' && (
        <div className="space-y-3">
          {bundle.tickets.map((t) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
              <div className="font-bold">
                {t.ticketNumber} · {t.status}
              </div>
              <div className="text-gray-500">{t.subject}</div>
            </div>
          ))}
        </div>
      )}

      {section === 'rma' && (
        <div className="space-y-3">
          {bundle.repairCases.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
              <div className="font-bold">
                {c.caseNumber} · {c.status}
              </div>
              <div className="text-gray-500">
                {nameOf(c.productId)} · {c.serialNumber} · {c.category}
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'history' && (
        <p className="text-sm text-gray-600">
          Service history aggregates tickets and RMA events for your customer ID — no duplicate CRM.
        </p>
      )}

      {section === 'firmware' && (
        <div className="space-y-3">
          {bundle.firmware.map((f) => (
            <div key={f.productId} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
              <div className="font-bold">{nameOf(f.productId)}</div>
              <div className="text-gray-500">
                Installed: {f.installedVersion} · Latest known: {f.latestKnownVersion ?? '—'}
              </div>
              <p className="text-gray-600 mt-1">{f.reason}</p>
            </div>
          ))}
        </div>
      )}

      {section === 'documents' && (
        <div className="space-y-3">
          {bundle.attachments.map((a) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
              <div className="font-bold">{a.fileName}</div>
              <div className="text-gray-500">
                Private · scan {a.virusScanStatus} · retention {a.retentionUntil} · signed until{' '}
                {a.signedUrlExpiresAt.slice(0, 16)}
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-500">
            Upload receipts, photos, videos, serial labels — private storage with audit logging.
          </p>
        </div>
      )}
    </div>
  );
};

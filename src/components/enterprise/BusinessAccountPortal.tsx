import React, { useMemo, useState } from 'react';
import { runWave8Enterprise, validateVies } from '../../lib/enterprise/wave8Enterprise';
import { DJI_PRODUCTS } from '../../data/products';

type Section =
  | 'overview'
  | 'orders'
  | 'quotes'
  | 'contracts'
  | 'purchase_orders'
  | 'invoices'
  | 'shipments'
  | 'products'
  | 'users'
  | 'approvals';

export const BusinessAccountPortal: React.FC = () => {
  const [section, setSection] = useState<Section>('overview');
  const bundle = useMemo(() => runWave8Enterprise(), []);
  const org = bundle.organizations[0];
  const vies = validateVies(org.vatId, org.billingCountry);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold uppercase">
          /account/business · Wave 8
        </span>
        <h3 className="text-xl font-black text-gray-900 mt-2">{org.companyName}</h3>
        <p className="text-xs text-gray-500 mt-1">
          Linked CRM {org.crmCustomerId} · VAT {org.vatId} ({vies.status}) ·{' '}
          {vies.reverseChargeEligible ? 'reverse-charge eligible' : 'standard VAT'} · never assume exemption
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {(
          [
            ['overview', 'Overview'],
            ['orders', 'Orders'],
            ['quotes', 'Quotes'],
            ['contracts', 'Contracts'],
            ['purchase_orders', 'Purchase Orders'],
            ['invoices', 'Invoices'],
            ['shipments', 'Shipments'],
            ['products', 'Products'],
            ['users', 'Users'],
            ['approvals', 'Approvals']
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

      {section === 'overview' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {(
            [
              ['Quotes', bundle.quotes.length],
              ['POs', bundle.purchaseOrders.length],
              ['Documents', bundle.documents.length],
              ['Locations', org.shippingLocations.length]
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="text-gray-400 uppercase font-bold text-[10px]">{k}</div>
              <div className="text-2xl font-black text-gray-900">{v}</div>
            </div>
          ))}
        </div>
      )}

      {section === 'orders' && (
        <p className="text-sm text-gray-600">Enterprise orders surface from the existing OMS — no duplicate order ledger.</p>
      )}

      {section === 'quotes' && (
        <div className="space-y-3">
          {bundle.quotes
            .filter((q) => q.organizationId === org.id)
            .map((q) => (
              <div key={q.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
                <div className="font-bold text-gray-900">{q.quoteNumber}</div>
                <div className="text-gray-500">
                  {q.workflowStatus} · €{q.totalEur.toLocaleString()} · until {q.validUntil.slice(0, 10)}
                </div>
              </div>
            ))}
        </div>
      )}

      {section === 'contracts' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
          <div className="font-bold">{org.legalEntity}</div>
          <div className="text-gray-500">
            Pricing {org.pricingTier} · contract −{org.contractDiscountPct}% · reg {org.registrationNumber}
          </div>
        </div>
      )}

      {section === 'purchase_orders' && (
        <div className="space-y-2">
          {bundle.purchaseOrders.map((po) => (
            <div key={po.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
              <div className="font-bold">{po.customerPoNumber}</div>
              <div className="text-gray-500">{po.status}</div>
            </div>
          ))}
        </div>
      )}

      {section === 'invoices' && (
        <div className="space-y-2">
          {bundle.documents
            .filter((d) => d.type === 'proforma' || d.type === 'vat_invoice')
            .map((d) => (
              <div key={d.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-xs">
                {d.title}
              </div>
            ))}
          {!bundle.documents.some((d) => d.type === 'proforma' || d.type === 'vat_invoice') && (
            <p className="text-sm text-gray-500">Pro-forma / VAT invoices use the existing document architecture.</p>
          )}
        </div>
      )}

      {section === 'shipments' && (
        <ul className="text-xs space-y-2">
          {org.shippingLocations.map((l) => (
            <li key={l.id} className="bg-white border border-gray-200 rounded-2xl p-4">
              {l.label} — {l.city}, {l.countryCode} · depot {l.preferredDepotCode}
            </li>
          ))}
        </ul>
      )}

      {section === 'products' && (
        <p className="text-sm text-gray-600">
          Catalog resolves to DJI_PRODUCTS only ({DJI_PRODUCTS.length} SKUs). Fleet recommendations use Wave 3
          compatibility.
        </p>
      )}

      {section === 'users' && (
        <div className="text-xs space-y-1">
          {bundle.memberships
            .filter((m) => m.organizationId === org.id)
            .map((m) => (
              <div key={m.userId} className="bg-white border border-gray-200 rounded-xl px-4 py-2">
                {m.userId} · {m.role}
              </div>
            ))}
        </div>
      )}

      {section === 'approvals' && (
        <div className="space-y-2 text-xs">
          {bundle.quotes
            .filter((q) => q.organizationId === org.id)
            .flatMap((q) =>
              q.approvals.map((a) => (
                <div key={`${q.id}-${a.role}`} className="bg-white border border-gray-200 rounded-xl px-4 py-2">
                  {q.quoteNumber} · {a.role} · {a.status}
                </div>
              ))
            )}
        </div>
      )}
    </div>
  );
};

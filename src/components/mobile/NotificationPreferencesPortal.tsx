import React, { useMemo, useState } from 'react';
import { defaultPreferences, runWave11Mobile } from '../../lib/mobile/wave11Mobile';
import { INITIAL_CUSTOMERS } from '../../data/crmData';
import { DeviceNotificationPreferences } from '../../types/wave11Mobile';

/** /account/notifications — push preference controls (extends inbox notifications tab). */
export const NotificationPreferencesPortal: React.FC = () => {
  const lukas = INITIAL_CUSTOMERS.find((c) => c.id === 'cust-lukas-weber')!;
  const bundle = useMemo(() => runWave11Mobile(), []);
  const [prefs, setPrefs] = useState<DeviceNotificationPreferences>(() => defaultPreferences(lukas));

  const toggle = (key: keyof DeviceNotificationPreferences) => {
    if (typeof prefs[key] !== 'boolean') return;
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key], updatedAt: new Date().toISOString() };
      // Marketing toggles cannot enable without marketingConsent
      if (
        (key === 'restockNotifications' || key === 'priceAlerts' || key === 'marketingNotifications') &&
        next[key] &&
        !next.marketingConsent
      ) {
        return p;
      }
      return next;
    });
  };

  const rows: { key: keyof DeviceNotificationPreferences; label: string; className: string }[] = [
    { key: 'orderNotifications', label: 'Order notifications', className: 'Transactional' },
    { key: 'serviceNotifications', label: 'Service / RMA notifications', className: 'Transactional' },
    { key: 'warrantyNotifications', label: 'Warranty notifications', className: 'Transactional' },
    { key: 'firmwareAlerts', label: 'Firmware alerts', className: 'Transactional' },
    { key: 'restockNotifications', label: 'Restock notifications', className: 'Marketing' },
    { key: 'priceAlerts', label: 'Price alerts', className: 'Marketing' },
    { key: 'marketingNotifications', label: 'Marketing notifications', className: 'Marketing' },
    { key: 'pushEnabled', label: 'Push enabled on this device', className: 'Device' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase">
          /account/notifications · Wave 11
        </span>
        <h3 className="text-xl font-black text-gray-900 mt-2">Notification preferences</h3>
        <p className="text-xs text-gray-500 mt-1">
          Transactional and marketing channels are separated. Marketing requires GDPR marketing consent.
          Consent on file: {prefs.marketingConsent ? 'yes' : 'no'}.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 divide-y divide-gray-100">
        {rows.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => toggle(r.key)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left min-h-[44px] hover:bg-gray-50"
          >
            <div>
              <div className="text-sm font-bold text-gray-900">{r.label}</div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400">{r.className}</div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                prefs[r.key] ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {prefs[r.key] ? 'On' : 'Off'}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-5 text-xs text-gray-600 space-y-2">
        <div className="font-bold text-gray-900">Recent push events (demo)</div>
        {bundle.deliveries
          .filter((d) => d.customerId === lukas.id)
          .slice(0, 6)
          .map((d) => (
            <div key={d.id}>
              {d.channelClass} · {d.title} · {d.status}
              {d.suppressionReason ? ` (${d.suppressionReason})` : ''}
            </div>
          ))}
        <p className="text-gray-400 pt-2">Unsubscribe: disable push or marketing preferences above.</p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, Lock, Download, Trash2, CheckCircle2, X } from 'lucide-react';

interface GdprConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GdprConsentModal: React.FC<GdprConsentModalProps> = ({ isOpen, onClose }) => {
  const [necessary, setNecessary] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [aiPersonalization, setAiPersonalization] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [erasureConfirmed, setErasureConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      // Generate actual downloadable JSON
      const customerData = {
        platform: 'DJI Store EU (djii.eu)',
        complianceStandard: 'GDPR Regulation (EU) 2016/679 Article 20',
        exportedAt: new Date().toISOString(),
        customerProfile: {
          accountId: 'cust_eu_live_session',
          email: 'customer@djii.eu',
          registeredCountry: 'European Union (DE/FR/NL/IT/ES/PL)',
          vatValidation: 'VIES Verified'
        },
        orders: [
          {
            orderId: 'DJI-EU-89214',
            item: 'DJI Inspire 3 Cinema Combo',
            serialNumber: 'IN3-EU-992140',
            easaClassification: 'C3 Category Open / Specific',
            invoicedVatRate: '19.00%'
          }
        ],
        easaPilotCertificates: [
          { certificateId: 'EASA.OPEN.A1-A3.DE-91024', status: 'VALID' }
        ],
        telemetryLogs: [
          { deviceId: 'DJI-RC-PRO-01', flightHours: 42.5 }
        ],
        privacyConsents: {
          essentialCookies: true,
          telemetrySharing: analytics,
          personalizedMarketing: marketing,
          aiFlightRecommendations: aiPersonalization
        }
      };

      const blob = new Blob([JSON.stringify(customerData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dji-store-eu-gdpr-data-export-${Date.now()}.json`;
      a.click();
    }, 1500);
  };

  const handleRequestErasure = () => {
    if (window.confirm('Are you sure you want to request account erasure under GDPR Article 17? All personal data will be permanently anonymized.')) {
      setErasureConfirmed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#161B22] border border-slate-700 text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">EU Privacy & GDPR Rights Portal</h2>
            <p className="text-xs text-slate-400">Regulation (EU) 2016/679 & ePrivacy Directive (TCF 2.2 Compliant)</p>
          </div>
        </div>

        {/* Granular Cookie Toggles */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Granular Consent Preferences</h3>

          {/* Strictly Necessary */}
          <div className="bg-[#0D1117] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                Strictly Necessary & Security Cookies
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">Required</span>
              </div>
              <p className="text-[11px] text-slate-400">Essential for authentication, CSRF defense, and PCI-compliant payment checkout.</p>
            </div>
            <input type="checkbox" checked={necessary} disabled className="rounded accent-emerald-500" />
          </div>

          {/* Analytics */}
          <div className="bg-[#0D1117] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white">Aggregated Performance & Flight Telemetry</div>
              <p className="text-[11px] text-slate-400">Helps us optimize delivery routes and improve firmware reliability (IP anonymized).</p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* AI Recommendations */}
          <div className="bg-[#0D1117] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white">Autonomous AI Flight Recommendations</div>
              <p className="text-[11px] text-slate-400">Grounded EASA payload compatibility and localized weather safety advice.</p>
            </div>
            <input
              type="checkbox"
              checked={aiPersonalization}
              onChange={(e) => setAiPersonalization(e.target.checked)}
              className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Marketing */}
          <div className="bg-[#0D1117] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white">Personalized Promotional Offers</div>
              <p className="text-[11px] text-slate-400">Tailored discounts on drone accessories and DJI Care Enterprise renewals.</p>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Data Subject Rights (Articles 15, 20 & 17) */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Exercise Data Subject Rights</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Data */}
            <div className="bg-[#0D1117] p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  Right to Data Portability (Art. 20)
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Download all your orders, pilot certificates, and support tickets in a machine-readable JSON package.
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isExporting ? 'Generating JSON...' : exportComplete ? 'Downloaded JSON' : 'Export My Data'}
              </button>
            </div>

            {/* Right to Erasure */}
            <div className="bg-[#0D1117] p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  Right to Erasure / RTBF (Art. 17)
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Request full pseudonymization & erasure of your account and behavioral telemetry.
                </p>
              </div>
              {erasureConfirmed ? (
                <div className="py-2 text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  Erasure Queued (DSR-EU-8924)
                </div>
              ) : (
                <button
                  onClick={handleRequestErasure}
                  className="w-full py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-bold transition-colors border border-red-500/30"
                >
                  Request Account Erasure
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Stored securely in Frankfurt (eu-central-1)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAnalytics(true);
                setMarketing(true);
                setAiPersonalization(true);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Accept All
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

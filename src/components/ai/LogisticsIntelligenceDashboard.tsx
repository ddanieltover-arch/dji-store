import React, { useState } from 'react';
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  INITIAL_COURIER_PERFORMANCE,
  INITIAL_LOGISTICS_BOTTLENECKS
} from '../../data/aiOperationsData';
import { LogisticsBottleneckAlert } from '../../types/aiOperations';

export const LogisticsIntelligenceDashboard: React.FC = () => {
  const { addToast } = useStore();

  const [couriers, setCouriers] = useState(INITIAL_COURIER_PERFORMANCE);
  const [bottlenecks, setBottlenecks] = useState<LogisticsBottleneckAlert[]>(
    INITIAL_LOGISTICS_BOTTLENECKS
  );

  const handleResolveBottleneck = (bottleneckId: string) => {
    setBottlenecks((prev) =>
      prev.map((b) => (b.id === bottleneckId ? { ...b, status: 'resolved' as const } : b))
    );
    addToast({
      type: 'success',
      title: 'Logistics Route Optimized',
      message: `Direct air-freight dispatch activated for Northern Italy corridor.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-sky-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Mercury Logistics & Courier Sentinel
              </span>
              <span className="text-xs text-zinc-400 font-mono">524 Active European Shipments</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Pan-European Courier SLA Intelligence & Route Optimization
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Continuous live tracking of DHL Express, DPD, and UPS Saver transit times, customs clearance velocity, and automated flight corridor rerouting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              98.2% On-Time SLA
            </span>
          </div>
        </div>
      </div>

      {/* COURIER PERFORMANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {couriers.map((c) => (
          <div
            key={c.courierCode}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-zinc-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono">
                  {c.courierName}
                </span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {c.onTimeDeliveryRatePct}% SLA
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase">Active In-Transit</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {c.activeShipmentsCount} Parcels
                  </div>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase">Avg Transit Time</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5">
                    {c.avgTransitHours} hrs
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-400 space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span>Customs Clearance:</span>
                  <strong className="text-zinc-200">{c.customsClearanceAvgHours}h avg</strong>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span>Delayed Shipments:</span>
                  <strong className={c.activeDelayedCount > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                    {c.activeDelayedCount} active
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
              Hotspots: {c.incidentHotspots.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* BOTTLENECK SURVEILLANCE & REROUTING TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              European Transit Bottlenecks & Anomaly Sentinel
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identified highway and border delays with automated AI mitigation suggestions
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
            1 Active Incident
          </span>
        </div>

        <div className="space-y-4">
          {bottlenecks.map((b) => (
            <div
              key={b.id}
              className="p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400">{b.id}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        b.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    Corridor: {b.route}
                  </h4>
                </div>

                <div className="text-right text-xs font-mono">
                  <div className="text-amber-400 font-bold">
                    +{b.delayHoursAvg}h Delay Impact
                  </div>
                  <div className="text-zinc-500 text-[10px]">
                    {b.affectedShipmentCount} Shipments Affected
                  </div>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs space-y-1.5">
                <div className="text-zinc-300">
                  ⚠️ <strong>Root Cause:</strong> {b.rootCause}
                </div>
                <div className="text-emerald-400">
                  💡 <strong>Autonomous Mitigation:</strong> {b.suggestedMitigation}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                <span className="text-zinc-500 font-mono">
                  Reroute Depot: {b.rerouteWarehouse}
                </span>

                {b.status === 'resolved' ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Corridor Cleared & Rerouted
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolveBottleneck(b.id)}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5" /> Execute Autonomous Reroute
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

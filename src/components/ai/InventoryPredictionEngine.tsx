import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Truck,
  ArrowRight,
  ShieldAlert,
  Send,
  Check,
  FileText,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  INITIAL_INVENTORY_DEPOT_RISKS,
  INITIAL_DEPOT_REBALANCING_PLANS,
  INITIAL_AUTONOMOUS_PURCHASE_ORDERS
} from '../../data/aiOperationsData';
import { formatPrice } from '../../data/currency';
import {
  InventoryDepotRisk,
  DepotRebalancingPlan,
  AutonomousPurchaseOrder
} from '../../types/aiOperations';

export const InventoryPredictionEngine: React.FC = () => {
  const { currency, addToast } = useStore();

  const [risks, setRisks] = useState<InventoryDepotRisk[]>(INITIAL_INVENTORY_DEPOT_RISKS);
  const [rebalancingPlans, setRebalancingPlans] = useState<DepotRebalancingPlan[]>(
    INITIAL_DEPOT_REBALANCING_PLANS
  );
  const [purchaseOrders, setPurchaseOrders] = useState<AutonomousPurchaseOrder[]>(
    INITIAL_AUTONOMOUS_PURCHASE_ORDERS
  );

  const handleApproveRebalance = (planId: string) => {
    setRebalancingPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: 'approved' as const } : p))
    );
    addToast({
      type: 'success',
      title: 'Inter-Depot Rebalancing Approved',
      message: `Dispatched DHL Freight transfer for ${planId}.`
    });
  };

  const handleApprovePO = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === poId ? { ...po, approvalStatus: 'approved' as const } : po
      )
    );
    addToast({
      type: 'success',
      title: 'Autonomous Purchase Order Approved',
      message: `PO ${poId} dispatched to DJI Logistics Europe via EDI link.`
    });
  };

  const handleAutoDispatchRisk = (sku: string) => {
    setRisks((prev) =>
      prev.map((r) =>
        r.sku === sku ? { ...r, actionStatus: 'auto_dispatched' as const } : r
      )
    );
    addToast({
      type: 'info',
      title: 'Replenishment Dispatched',
      message: `Emergency express replenishment triggered for ${sku}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5" />
                Vulcan Autonomous WMS & Supply Chain Replenisher
              </span>
              <span className="text-xs text-zinc-400 font-mono">5 European Hubs Online</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Inventory Depletion Prediction & Autonomous Rebalancing
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Algorithmic runway prediction computing daily burn rates, lead times, and cross-border transit costs to eliminate European drone stockouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Stockout Risk: 0.04%
            </span>
          </div>
        </div>
      </div>

      {/* DEPOT STOCK DEPLETION RADAR */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Depot-Level Stockout & Depletion Runway Matrix
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Real-time calculations of days remaining before depot exhaustion
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">Refreshed every 5m</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                <th className="pb-3 font-semibold">SKU / Model</th>
                <th className="pb-3 font-semibold">Depot Node</th>
                <th className="pb-3 font-semibold">Current Stock</th>
                <th className="pb-3 font-semibold">Daily Velocity</th>
                <th className="pb-3 font-semibold">Runway (Days)</th>
                <th className="pb-3 font-semibold">Risk Level</th>
                <th className="pb-3 font-semibold">Recommended PO</th>
                <th className="pb-3 font-semibold text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {risks.map((risk, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-zinc-200">{risk.productName}</div>
                    <div className="text-[10px] text-zinc-500">{risk.sku}</div>
                  </td>
                  <td className="py-3 text-zinc-300">
                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-200 font-bold mr-1.5">
                      {risk.depotCode}
                    </span>
                    <span className="text-[11px] text-zinc-400">{risk.depotCity}</span>
                  </td>
                  <td className="py-3 text-zinc-200 font-bold">{risk.currentStock} units</td>
                  <td className="py-3 text-zinc-400">{risk.dailyBurnRate} / day</td>
                  <td className="py-3">
                    <span
                      className={`font-black text-sm ${
                        risk.predictedDaysUntilStockout < 3
                          ? 'text-rose-400'
                          : risk.predictedDaysUntilStockout < 7
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {risk.predictedDaysUntilStockout} days
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        risk.riskLevel === 'critical_stockout'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : risk.riskLevel === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : risk.riskLevel === 'overstock'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {risk.riskLevel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-zinc-300">
                    {risk.recommendedOrderQuantity > 0
                      ? `+${risk.recommendedOrderQuantity} units`
                      : 'None required'}
                  </td>
                  <td className="py-3 text-right">
                    {risk.actionStatus === 'auto_dispatched' ? (
                      <span className="text-emerald-400 font-bold flex items-center justify-end gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                      </span>
                    ) : risk.actionStatus === 'resolved' ? (
                      <span className="text-zinc-500 text-[11px]">Balanced</span>
                    ) : (
                      <button
                        onClick={() => handleAutoDispatchRisk(risk.sku)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-bold transition-colors"
                      >
                        Auto-Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MID ROW: INTER-DEPOT REBALANCING & AUTONOMOUS PURCHASE ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INTER-DEPOT REBALANCING MATRIX */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              Inter-Depot Rebalancing Transfer Plans
            </h3>
            <span className="text-xs text-blue-400 font-mono">Zero-Stockout Guard</span>
          </div>

          <div className="space-y-3">
            {rebalancingPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">{plan.id}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      plan.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-300 font-mono">
                  <span>{plan.sourceDepot}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                  <span className="font-bold text-white">{plan.targetDepot}</span>
                </div>

                <div className="text-xs text-zinc-300">
                  Transfer: <strong className="text-white">{plan.transferQuantity}x {plan.productName}</strong>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">{plan.reason}</p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                  <span className="text-zinc-500 font-mono">
                    Transit: {plan.transitDays}d • Est Cost: {formatPrice(plan.estimatedCostEur, currency)}
                  </span>

                  {plan.status === 'recommended' ? (
                    <button
                      onClick={() => handleApproveRebalance(plan.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Transfer
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Transit Dispatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AUTONOMOUS PURCHASE ORDERS QUEUE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Autonomous Purchase Orders (EDI / Supplier Queue)
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Rotterdam Bonded</span>
          </div>

          <div className="space-y-3">
            {purchaseOrders.map((po) => (
              <div
                key={po.id}
                className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-400">{po.id}</span>
                    <div className="text-xs text-zinc-300 font-medium mt-0.5">
                      Destination: {po.targetWarehouse}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white font-mono">
                      {formatPrice(po.totalAmountEur, currency)}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Delivery: {po.projectedDeliveryDate}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 text-xs space-y-1">
                  {po.skuList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-zinc-300 font-mono">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="text-zinc-400">{formatPrice(item.totalCostEur, currency)}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-zinc-400">{po.createdReason}</p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                  <span className="text-zinc-500 font-mono">Created: {po.createdAt}</span>

                  {po.approvalStatus === 'requires_ceo_approval' ? (
                    <button
                      onClick={() => handleApprovePO(po.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Authorize PO (CEO Signature)
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PO Dispatched to Supplier
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

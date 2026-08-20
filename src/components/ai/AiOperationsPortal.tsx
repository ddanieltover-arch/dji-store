import React, { useState } from 'react';
import {
  Crown,
  TrendingUp,
  Boxes,
  Sparkles,
  DollarSign,
  Users,
  MessageSquare,
  Bot,
  Truck,
  Search,
  ShieldAlert,
  Cpu,
  Layers,
  ArrowRight,
  Activity,
  Globe2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { ExecutiveCommandCenter } from './ExecutiveCommandCenter';
import { PredictiveRevenueForecasting } from './PredictiveRevenueForecasting';
import { InventoryPredictionEngine } from './InventoryPredictionEngine';
import { AutonomousMerchandising } from './AutonomousMerchandising';
import { PricingIntelligenceSystem } from './PricingIntelligenceSystem';
import { CustomerIntelligenceEngine } from './CustomerIntelligenceEngine';
import { ReviewSentimentAnalytics } from './ReviewSentimentAnalytics';
import { AutonomousSupportAgents } from './AutonomousSupportAgents';
import { LogisticsIntelligenceDashboard } from './LogisticsIntelligenceDashboard';
import { SearchIntelligenceConsole } from './SearchIntelligenceConsole';
import { FraudDetectionIntelligence } from './FraudDetectionIntelligence';
import { MultiAgentOrchestrator } from './MultiAgentOrchestrator';

export type AiOperationsSubView =
  | 'executive_command'
  | 'revenue_forecast'
  | 'inventory_prediction'
  | 'merchandising'
  | 'pricing_intelligence'
  | 'customer_intelligence'
  | 'review_sentiment'
  | 'support_agents'
  | 'logistics_intelligence'
  | 'search_intelligence'
  | 'fraud_detection'
  | 'agent_orchestrator';

export const AiOperationsPortal: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<AiOperationsSubView>('executive_command');

  const navigationItems = [
    {
      id: 'executive_command',
      label: 'Executive Command Center',
      category: 'Strategic',
      icon: Crown,
      badge: 'Live CEO View'
    },
    {
      id: 'revenue_forecast',
      label: 'Revenue Forecasting',
      category: 'Strategic',
      icon: TrendingUp,
      badge: 'ARIMA-LSTM'
    },
    {
      id: 'agent_orchestrator',
      label: 'Multi-Agent Mesh',
      category: 'Autonomous Agents',
      icon: Cpu,
      badge: 'LangGraph'
    },
    {
      id: 'inventory_prediction',
      label: 'Inventory & WMS Radar',
      category: 'Operations',
      icon: Boxes,
      badge: '5 EU Hubs'
    },
    {
      id: 'merchandising',
      label: 'Autonomous Merchandising',
      category: 'Commercial',
      icon: Sparkles,
      badge: 'Dynamic Rank'
    },
    {
      id: 'pricing_intelligence',
      label: 'Dynamic Pricing Radar',
      category: 'Commercial',
      icon: DollarSign,
      badge: 'Elasticity'
    },
    {
      id: 'customer_intelligence',
      label: 'Customer & Churn Engine',
      category: 'Intelligence',
      icon: Users,
      badge: '45k Pilots'
    },
    {
      id: 'review_sentiment',
      label: 'Review NLP & Defects',
      category: 'Intelligence',
      icon: MessageSquare,
      badge: '+78.4 NPS'
    },
    {
      id: 'support_agents',
      label: 'Grounded Support RAG',
      category: 'Autonomous Agents',
      icon: Bot,
      badge: '6 EU Langs'
    },
    {
      id: 'logistics_intelligence',
      label: 'Logistics & Courier SLA',
      category: 'Operations',
      icon: Truck,
      badge: '98.2% SLA'
    },
    {
      id: 'search_intelligence',
      label: 'Search Omnibar Intel',
      category: 'Intelligence',
      icon: Search,
      badge: 'Vector Embed'
    },
    {
      id: 'fraud_detection',
      label: 'Anti-Fraud & Risk Sentinel',
      category: 'Security',
      icon: ShieldAlert,
      badge: '0.01% Chg'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Navigation Header */}
      <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Phase 10 — Autonomous Commerce Operations & BI Ecosystem
            </span>
            <span className="text-xs font-mono text-zinc-500">v10.4 Production Node</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            DJI Store EU <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-sky-400">Autonomous Operations Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl">
            Enterprise command center powering multi-agent reasoning, predictive demand curves, autonomous inter-depot inventory balancing, and competitor price elasticity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-xs font-mono">
              <div className="text-zinc-400 text-[10px] uppercase">Telemetry Status</div>
              <div className="text-white font-bold">7 Agents Autonomous</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsystem Navigation Pills */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-max">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubView(item.id as AiOperationsSubView)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-950/50'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    isActive
                      ? 'bg-purple-800 text-purple-100'
                      : 'bg-zinc-950 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SUBSYSTEM VIEWPORT */}
      <div className="transition-all duration-300">
        {activeSubView === 'executive_command' && <ExecutiveCommandCenter />}
        {activeSubView === 'revenue_forecast' && <PredictiveRevenueForecasting />}
        {activeSubView === 'agent_orchestrator' && <MultiAgentOrchestrator />}
        {activeSubView === 'inventory_prediction' && <InventoryPredictionEngine />}
        {activeSubView === 'merchandising' && <AutonomousMerchandising />}
        {activeSubView === 'pricing_intelligence' && <PricingIntelligenceSystem />}
        {activeSubView === 'customer_intelligence' && <CustomerIntelligenceEngine />}
        {activeSubView === 'review_sentiment' && <ReviewSentimentAnalytics />}
        {activeSubView === 'support_agents' && <AutonomousSupportAgents />}
        {activeSubView === 'logistics_intelligence' && <LogisticsIntelligenceDashboard />}
        {activeSubView === 'search_intelligence' && <SearchIntelligenceConsole />}
        {activeSubView === 'fraud_detection' && <FraudDetectionIntelligence />}
      </div>
    </div>
  );
};

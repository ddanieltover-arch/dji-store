import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Bot,
  Zap,
  TrendingUp,
  Boxes,
  Truck,
  ShieldAlert,
  Crown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  Layers,
  Terminal
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  INITIAL_COMMERCE_AGENTS,
  INITIAL_AGENT_TRACES
} from '../../data/aiOperationsData';
import { CommerceAgentDefinition, AgentLogTrace } from '../../types/aiOperations';

export const MultiAgentOrchestrator: React.FC = () => {
  const { addToast } = useStore();

  const [agents, setAgents] = useState<CommerceAgentDefinition[]>(INITIAL_COMMERCE_AGENTS);
  const [traces, setTraces] = useState<AgentLogTrace[]>(INITIAL_AGENT_TRACES);
  const [selectedAgent, setSelectedAgent] = useState<CommerceAgentDefinition>(INITIAL_COMMERCE_AGENTS[0]);

  const handleSimulateAgentPulse = () => {
    const newTrace: AgentLogTrace = {
      id: `TRC-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      agentRole: selectedAgent.role,
      agentName: selectedAgent.name,
      action: 'Autonomous Reasoning Cycle Executed',
      reasoning: `Synchronized telemetry with Pan-European ClickHouse data warehouse. Verified 0 anomalies on ${selectedAgent.callsign}.`,
      confidenceScore: 0.99,
      status: 'completed',
      impactSummary: 'Routine 15-minute operational loop finished'
    };

    setTraces([newTrace, ...traces.slice(0, 8)]);
    addToast({
      type: 'info',
      title: `${selectedAgent.callsign} Cycled`,
      message: 'Autonomous reasoning step logged to LangGraph trace bus.'
    });
  };

  const getAgentIcon = (role: string) => {
    switch (role) {
      case 'executive_insights':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'pricing_strategist':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'inventory_replenisher':
        return <Boxes className="w-5 h-5 text-amber-300" />;
      case 'merchandising_optimizer':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'logistics_sentinel':
        return <Truck className="w-5 h-5 text-sky-400" />;
      case 'customer_support_copilot':
        return <Bot className="w-5 h-5 text-blue-400" />;
      case 'fraud_risk_analyst':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default:
        return <Cpu className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950/40 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                LangGraph Multi-Agent Commerce Orchestration
              </span>
              <span className="text-xs text-zinc-400 font-mono">7 Specialized Autonomous Agents</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Autonomous Operations Mesh & Real-Time Agent Memory
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Coordinated distributed agent network reasoning over supply chain, dynamic pricing, courier tracking, fraud mitigation, and customer lifetime value.
            </p>
          </div>

          <button
            onClick={handleSimulateAgentPulse}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            Trigger Agent Cycle
          </button>
        </div>
      </div>

      {/* 7 AGENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <button
            key={agent.role}
            onClick={() => setSelectedAgent(agent)}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
              selectedAgent.role === agent.role
                ? 'bg-zinc-800/90 border-purple-500/80 shadow-lg ring-1 ring-purple-500/50'
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  {getAgentIcon(agent.role)}
                </div>
                <span className="text-[10px] font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded text-purple-300 border border-zinc-800">
                  {agent.callsign}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white leading-snug">{agent.name}</h4>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  {agent.autonomyLevel.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {agent.description}
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>{agent.tasksCompleted24h} Tasks/24h</span>
              <span className="text-emerald-400 font-bold">{agent.successRatePct}% Success</span>
            </div>
          </button>
        ))}
      </div>

      {/* SELECTED AGENT DETAILS & REASONING TRACE LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Agent Focus Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              {getAgentIcon(selectedAgent.role)}
            </div>
            <div>
              <span className="text-[10px] font-mono text-purple-400 font-bold">
                {selectedAgent.callsign}
              </span>
              <h3 className="text-base font-bold text-white">{selectedAgent.name}</h3>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5 text-xs">
            <div className="text-[10px] font-bold text-zinc-500 uppercase font-mono">
              Current Active Goal:
            </div>
            <p className="text-zinc-200 leading-relaxed font-sans">{selectedAgent.currentGoal}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">Avg Latency</span>
              <strong className="text-purple-300 block mt-0.5">{selectedAgent.avgLatencyMs} ms</strong>
            </div>
            <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">Success Rate</span>
              <strong className="text-emerald-400 block mt-0.5">{selectedAgent.successRatePct}%</strong>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">{selectedAgent.description}</p>
        </div>

        {/* Right: Live Reasoning Traces Stream */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              LangGraph Chain-of-Thought & Reasoning Execution Traces
            </h3>
            <span className="text-xs font-mono text-zinc-400">Stream: ws://dji.eu/agent-mesh</span>
          </div>

          <div className="divide-y divide-zinc-800/80 space-y-3 overflow-y-auto max-h-[380px] pr-2">
            {traces.map((trace) => (
              <div key={trace.id} className="pt-3 pb-2 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-300">{trace.id}</span>
                    <span className="font-bold text-white">{trace.agentName}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">({trace.action})</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{trace.timestamp}</span>
                </div>

                <div className="p-3 bg-zinc-950/90 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300 leading-relaxed">
                  <div className="text-purple-400 font-bold mb-1">
                    🧠 Agent Reasoning & Decision Trace:
                  </div>
                  {trace.reasoning}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-semibold">{trace.impactSummary}</span>
                  <span className="text-zinc-500">
                    Confidence: {(trace.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

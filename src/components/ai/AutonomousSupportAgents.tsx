import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  ShieldCheck,
  Globe2,
  RefreshCw,
  Zap,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentName?: string;
  text: string;
  timestamp: string;
  groundedSources?: string[];
  suggestedActions?: string[];
}

const SAMPLE_PRESETS = [
  {
    agentRole: 'EASA Compliance Specialist',
    prompt: 'Can I fly the DJI Mavic 4 Pro in European A1 subcategory with C1 class marking?',
    response:
      'Yes! The DJI Mavic 4 Pro features an official EASA Class C1 label under EU Regulation 2019/947. You may operate in the Open Category A1 subcategory after completing the online A1/A3 pilot certificate (e.g., via LBA Germany or DGAC France) and entering your Operator ID into the Direct Remote ID menu in DJI Fly.',
    sources: ['EASA EU Regulation 2019/947 Annex 1', 'DJI Mavic 4 Pro EU Declaration of Conformity'],
    actions: ['Download EASA C1 Certificate PDF', 'View LBA Germany Registration Link']
  },
  {
    agentRole: 'Logistics & Tracking Agent',
    prompt: 'Where is my order #DJI-EU-948120 being shipped from to Munich?',
    response:
      'Order #DJI-EU-948120 was packed at our Frankfurt Central Logistics Hub (FRA-01) and is currently in transit via DHL Express tracking #DHL-EU-8849102. Estimated delivery in Munich is tomorrow before 12:00 CET.',
    sources: ['Frankfurt WMS Depot FRA-01 Telemetry', 'DHL Express Webhook Event 99482'],
    actions: ['Track Live DHL GPS Route', 'Change Delivery Window']
  },
  {
    agentRole: 'Product & Battery Guru',
    prompt: 'Does the Osmo Pocket 3 support live streaming over RTMP to YouTube?',
    response:
      'Yes! The Osmo Pocket 3 supports RTMP livestreaming in up to 1080p 30fps. You can configure the stream URL directly inside the DJI Mimo app when connected to 5GHz Wi-Fi.',
    sources: ['DJI Osmo Pocket 3 Technical Specification Manual v1.4'],
    actions: ['View DJI Mimo App RTMP Guide', 'Compare Pocket 3 with Action 4']
  }
];

export const AutonomousSupportAgents: React.FC = () => {
  const { addToast } = useStore();

  const [activePersona, setActivePersona] = useState('EASA Compliance Specialist');
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'DE' | 'FR' | 'ES' | 'IT' | 'NL'>('EN');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'agent',
      agentName: 'Skylark AI Flight & Support Copilot',
      text: 'Hello Pilot! I am Skylark, your autonomous DJI Store EU copilot. I am grounded in official EASA flight regulations, live DHL European logistics feeds, and factory technical manuals. How can I assist your mission today?',
      timestamp: '14:30 CET',
      groundedSources: ['DJI European Knowledge Graph v5.2', 'EASA Part-UAS Regulations']
    }
  ]);

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      // Find preset or generate contextual response
      const matched = SAMPLE_PRESETS.find(
        (p) => p.prompt.toLowerCase() === textToSend.toLowerCase()
      );

      const agentReply: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentName: activePersona,
        text: matched
          ? matched.response
          : `Grounded RAG Response [${selectedLanguage}]: Regarding "${textToSend}", our European customer operations network confirms official 2-year warranty coverage, 24h DHL Express dispatch from Frankfurt, and full compliance with EU Regulation 2019/947.`,
        timestamp: 'Just now',
        groundedSources: matched
          ? matched.sources
          : ['DJI Central European Service Manual DE34988', 'Frankfurt WMS API'],
        suggestedActions: matched ? matched.actions : ['Download EU Certificate', 'Contact Human Specialist']
      };

      setMessages((prev) => [...prev, agentReply]);
      setIsTyping(false);
    }, 800);
  };

  const handleEscalateToHuman = () => {
    addToast({
      type: 'info',
      title: 'Escalated to Human Key Account Manager',
      message: 'Support ticket transferred to our Frankfurt operations team (avg wait: 2 mins).'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                Skylark Autonomous Support & RAG Copilot
              </span>
              <span className="text-xs text-zinc-400 font-mono">Response SLA &lt; 850ms</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Grounded Multilingual Customer Support & Regulation Agents
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
              Multi-agent conversational copilot grounded in live order databases, DHL telemetry, EASA flight rules, and DJI Care warranty claim protocols across 6 European languages.
            </p>
          </div>

          {/* Language selector */}
          <div className="bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 flex items-center shrink-0">
            {(['EN', 'DE', 'FR', 'ES', 'IT', 'NL'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  selectedLanguage === lang
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AGENT PERSONA SELECTOR & LIVE CHAT CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Agent Persona Menu & RAG Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-zinc-200 uppercase font-mono tracking-wider">
              Agent Persona Specialization
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Select specific RAG grounding vector database
            </p>
          </div>

          <div className="space-y-2">
            {[
              { role: 'EASA Compliance Specialist', desc: 'Class C0/C1/C2 regulations, pilot certificates, Remote ID' },
              { role: 'Logistics & Tracking Agent', desc: 'DHL Express telemetry, warehouse dispatch status, customs' },
              { role: 'Product & Battery Guru', desc: 'Hardware specs, camera optics, firmware update logs' },
              { role: 'DJI Care & Warranty Claims', desc: 'RMA replacement vouchers, statutory 2-year warranty' }
            ].map((persona) => (
              <button
                key={persona.role}
                onClick={() => setActivePersona(persona.role)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  activePersona === persona.role
                    ? 'bg-blue-950/50 border-blue-500/50 text-white shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-bold text-zinc-100">{persona.role}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{persona.desc}</div>
              </button>
            ))}
          </div>

          {/* Grounding Safety Guardrails Box */}
          <div className="p-3.5 bg-zinc-950/90 rounded-xl border border-zinc-800 space-y-2 text-xs">
            <div className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safety & Hallucination Guardrails
            </div>
            <ul className="space-y-1 text-[11px] text-zinc-400">
              <li>• Zero Hallucination check against official EU CE docs</li>
              <li>• Automated PII anonymization on customer data</li>
              <li>• Direct Human Escalation fallback trigger</li>
            </ul>
          </div>

          <button
            onClick={handleEscalateToHuman}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2 border border-zinc-700"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
            Test Escalation to Human Desk
          </button>
        </div>

        {/* RIGHT: Live Interactive Chat Simulator */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between h-[580px]">
          {/* Chat Messages Stream */}
          <div className="overflow-y-auto space-y-4 pr-2 flex-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-4 rounded-2xl space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-tl-xs'
                  }`}
                >
                  {msg.agentName && (
                    <div className="flex items-center justify-between text-[10px] text-blue-400 font-mono">
                      <span>{msg.agentName}</span>
                      <span className="text-zinc-500">{msg.timestamp}</span>
                    </div>
                  )}

                  <p className="leading-relaxed text-xs">{msg.text}</p>

                  {/* Grounding Citations */}
                  {msg.groundedSources && msg.groundedSources.length > 0 && (
                    <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 space-y-1 font-mono">
                      <div className="font-semibold text-zinc-400">Grounded Knowledge Sources:</div>
                      {msg.groundedSources.map((src, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1 text-zinc-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{src}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick action buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <span
                          key={aIdx}
                          className="text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-blue-300 font-mono"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Skylark Agent synthesizing grounded response...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
              <span className="text-zinc-500 font-mono shrink-0">Test Presets:</span>
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePersona(preset.agentRole);
                    handleSendMessage(preset.prompt);
                  }}
                  className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 shrink-0 transition-colors"
                >
                  {preset.prompt.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Ask ${activePersona} in ${selectedLanguage}...`}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-blue-500 font-sans"
              />
              <button
                onClick={() => handleSendMessage()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

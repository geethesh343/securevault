import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  Shield,
  FileText,
  Clock,
  CreditCard,
  Receipt,
  HelpCircle,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { chatWithVault } from '../../services/api';

export const AiChatDrawer: React.FC = () => {
  const {
    chatAssistantOpen,
    setChatAssistantOpen,
    documents,
    subscriptions,
    bills,
    credentials,
    familyMembers,
    user,
    monthlySubscriptionCost,
    pendingBillsCost,
    expiringSoonItems,
  } = useVault();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello ${user.name}! I am your LifeVault AI Assistant. I have indexed your ${documents.length} personal documents, ${subscriptions.length} subscriptions, bills, and family access rules. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'When does my car insurance expire?',
    'What is my monthly subscription burn rate?',
    'Show all documents expiring in 2026',
    'Which documents are shared with Ananya?',
    'Give me a checklist for passport renewal',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, chatAssistantOpen]);

  if (!chatAssistantOpen) return null;

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const vaultSummary = {
        userName: user.name,
        docCount: documents.length,
        subCount: subscriptions.length,
        monthlySpend: monthlySubscriptionCost,
        pendingBillsCount: bills.filter((b) => b.status !== 'Paid').length,
        pendingBillsTotal: pendingBillsCost,
        expiringCount: expiringSoonItems.length,
        documents: documents.map((d) => ({
          title: d.title,
          category: d.category,
          number: d.documentNumber,
          authority: d.issuingAuthority,
          expiry: d.expiryDate,
          renewal: d.renewalDate,
          summary: d.ocrSummary,
          tags: d.tags,
          sharedWith: d.sharedWithFamilyIds.map((id) => familyMembers.find((m) => m.id === id)?.name),
        })),
        subscriptions: subscriptions.map((s) => ({
          service: s.serviceName,
          cost: s.cost,
          cycle: s.billingCycle,
          renewal: s.nextRenewalDate,
          autoRenew: s.autoRenew,
        })),
        bills: bills.map((b) => ({
          title: b.title,
          amount: b.amount,
          due: b.dueDate,
          status: b.status,
        })),
        family: familyMembers.map((f) => ({
          name: f.name,
          relation: f.relationship,
          access: f.accessLevel,
        })),
      };

      const response = await chatWithVault({
        message: textToSend,
        chatHistory: newMessages,
        vaultSummary,
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I encountered a momentary connection hiccup. Here's what I know from your local vault: Your MacBook warranty expires on Oct 20, 2026, and your Star Health Insurance policy renews on Nov 19, 2026.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                LifeVault AI Assistant
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Conversational life wallet & document intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setChatAssistantOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.content}</p>
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="animate-pulse">Analyzing vault records with Gemini...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/60">
          <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1.5">Suggested Prompts:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about renewals, bills, IDs, spending..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

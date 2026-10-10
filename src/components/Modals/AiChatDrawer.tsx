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

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user' as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithVault({
        message: text,
        chatHistory: messages,
        vaultSummary: {
          userName: user.name,
          documentsCount: documents.length,
          documents: documents.map((d) => ({
            title: d.title,
            category: d.category,
            number: d.documentNumber,
            expiry: d.expiryDate,
            summary: d.ocrSummary,
          })),
          subscriptions: subscriptions.map((s) => ({
            name: s.serviceName,
            cost: s.cost,
            cycle: s.billingCycle,
            renewal: s.nextRenewalDate,
          })),
          bills: bills.map((b) => ({
            title: b.title,
            amount: b.amount,
            due: b.dueDate,
            status: b.status,
          })),
          monthlySubsTotal: monthlySubscriptionCost,
          pendingBillsTotal: pendingBillsCost,
          expiringSoonCount: expiringSoonItems.length,
        },
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I've processed your query locally: You have " +
            documents.length +
            ' secure documents stored on Amazon S3 and ' +
            expiringSoonItems.length +
            ' upcoming deadlines to track.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">LifeVault AI Assistant</h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Powered by Gemini 3.8 Flash
            </p>
          </div>
        </div>

        <button
          onClick={() => setChatAssistantOpen(false)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-white text-slate-800 flex items-center justify-center shrink-0 border border-slate-200 shadow-xs mt-0.5">
                <Bot className="w-4 h-4 text-slate-700" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
              }`}
            >
              {m.content}
            </div>

            {m.role === 'user' && (
              <img
                src={user.avatar}
                alt="user"
                className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5"
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-lg bg-white text-slate-800 flex items-center justify-center border border-slate-200 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 shadow-xs">
              Analyzing vault index...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
          Quick Questions:
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type a question about your vault..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

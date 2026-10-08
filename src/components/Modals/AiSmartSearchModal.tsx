import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Sparkles,
  FileText,
  CreditCard,
  Receipt,
  KeyRound,
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { performSmartSearch, SmartSearchResponse } from '../../services/api';

export const AiSmartSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    documents,
    subscriptions,
    bills,
    credentials,
    setPreviewDoc,
    setActiveTab,
  } = useVault();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SmartSearchResponse | null>(null);

  const sampleQueries = [
    'When does my car insurance expire?',
    'What is my Aadhaar card number?',
    'How much do I spend on subscriptions each month?',
    'Show electricity bill due date',
    'AppleCare warranty status',
  ];

  const handleExecuteSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const response = await performSmartSearch({
        query: searchQuery,
        vaultData: { documents, subscriptions, bills, credentials },
      });
      setSearchResponse(response);
    } catch (err: any) {
      console.error(err);
      // Graceful local search fallback
      const q = searchQuery.toLowerCase();
      const matchedDocs = documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.documentNumber?.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
      const matchedSubs = subscriptions.filter(
        (s) => s.serviceName.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
      const matchedBills = bills.filter(
        (b) => b.title.toLowerCase().includes(q) || b.biller.toLowerCase().includes(q)
      );
      const matchedCreds = credentials.filter(
        (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );

      setSearchResponse({
        success: true,
        answer: `Found ${matchedDocs.length + matchedSubs.length + matchedBills.length + matchedCreds.length} records matching "${searchQuery}".`,
        matches: {
          documents: matchedDocs.map((d) => d.id),
          subscriptions: matchedSubs.map((s) => s.id),
          bills: matchedBills.map((b) => b.id),
          credentials: matchedCreds.map((c) => c.id),
        },
        source: 'local',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecuteSearch(query);
    }
  };

  const handleClose = () => {
    setSearchModalOpen(false);
    setQuery('');
    setSearchResponse(null);
  };

  // Find matched objects
  const matchedDocs = documents.filter((d) => searchResponse?.matches?.documents?.includes(d.id));
  const matchedSubs = subscriptions.filter((s) => searchResponse?.matches?.subscriptions?.includes(s.id));
  const matchedBills = bills.filter((b) => searchResponse?.matches?.bills?.includes(b.id));
  const matchedCreds = credentials.filter((c) => searchResponse?.matches?.credentials?.includes(c.id));

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 backdrop-blur-md p-4 pt-16 sm:pt-24 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or search your vault in natural language..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => handleExecuteSearch(query)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
            >
              Search
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion Chips */}
        {!searchResponse && (
          <div className="p-4 bg-slate-900/60 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI Semantic Search Ideas
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuery(q);
                    handleExecuteSearch(q);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white text-left transition flex items-center gap-1.5 group"
                >
                  <span>{q}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition" />
                </button>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-slate-400">
              Tip: LifeVault AI searches across OCR extracted text, policy documents, subscriptions, and recurring bills.
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {searchResponse && (
          <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* AI Direct Answer card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-slate-900 border border-blue-500/30 shadow-md">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-blue-200">AI Direct Synthesis</span>
                {searchResponse.source === 'gemini' && (
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                    Gemini 3.8 Flash
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {searchResponse.answer}
              </p>
              {searchResponse.relevanceReason && (
                <p className="text-[11px] text-slate-400 mt-2 italic font-sans border-t border-blue-500/10 pt-1.5">
                  Relevance: {searchResponse.relevanceReason}
                </p>
              )}
            </div>

            {/* Matched Documents */}
            {matchedDocs.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Matched Documents ({matchedDocs.length})
                </p>
                <div className="space-y-1.5">
                  {matchedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setPreviewDoc(doc);
                        handleClose();
                      }}
                      className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-blue-300 transition">
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>{doc.category}</span>
                            {doc.documentNumber && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-slate-300">{doc.documentNumber}</span>
                              </>
                            )}
                            {doc.expiryDate && (
                              <>
                                <span>•</span>
                                <span>Expires: {doc.expiryDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        View <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Subscriptions */}
            {matchedSubs.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Matched Subscriptions ({matchedSubs.length})
                </p>
                <div className="space-y-1.5">
                  {matchedSubs.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setActiveTab('subscriptions');
                        handleClose();
                      }}
                      className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: sub.color }}
                        >
                          {sub.serviceName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-emerald-300 transition">
                            {sub.serviceName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            ${sub.cost.toFixed(2)} / {sub.billingCycle} • Next renewal: {sub.nextRenewalDate}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-200">
                        ${sub.cost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Bills */}
            {matchedBills.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-amber-400" /> Matched Bills ({matchedBills.length})
                </p>
                <div className="space-y-1.5">
                  {matchedBills.map((bill) => (
                    <div
                      key={bill.id}
                      onClick={() => {
                        setActiveTab('bills');
                        handleClose();
                      }}
                      className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition">
                          {bill.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Due: {bill.dueDate} • Status: <span className={bill.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}>{bill.status}</span>
                        </p>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-200">
                        ${bill.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Credentials */}
            {matchedCreds.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-violet-400" /> Matched Credentials ({matchedCreds.length})
                </p>
                <div className="space-y-1.5">
                  {matchedCreds.map((cred) => (
                    <div
                      key={cred.id}
                      onClick={() => {
                        setActiveTab('passwords');
                        handleClose();
                      }}
                      className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-violet-300 transition">
                          {cred.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">User: {cred.username}</p>
                      </div>
                      <span className="text-xs text-violet-400 flex items-center gap-1">
                        Go to Password Vault →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchedDocs.length === 0 &&
              matchedSubs.length === 0 &&
              matchedBills.length === 0 &&
              matchedCreds.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No direct records matched, but you can ask questions directly with the AI assistant.
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

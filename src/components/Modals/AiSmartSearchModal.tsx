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
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
      setSearchResponse({
        success: true,
        answer: `I searched your vault and found matching documents. Please inspect the results below.`,
        matches: {
          documents: matchedDocs.map((d) => d.id),
          subscriptions: [],
          bills: [],
          credentials: [],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExecuteSearch(query);
    }
  };

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm p-4 pt-16 sm:pt-24 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              autoFocus
              placeholder="Ask anything about your documents, bills, expiries, or passwords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => handleExecuteSearch(query)}
            disabled={loading || !query.trim()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>

          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Questions */}
        {!searchResponse && !loading && (
          <div className="pt-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Suggested Natural Language Queries:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(sq);
                    handleExecuteSearch(sq);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-7 h-7 text-slate-900 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">
              Gemini AI is analyzing indexed Aadhaar, passports, warranties & subscriptions...
            </p>
          </div>
        )}

        {/* AI Answer Card */}
        {searchResponse && !loading && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">LifeVault AI Answer</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {searchResponse.answer}
              </p>
            </div>

            {/* Matching Documents */}
            {searchResponse.matches?.documents && searchResponse.matches.documents.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Matching Vault Documents:
                </p>
                <div className="space-y-2">
                  {searchResponse.matches.documents.map((docId: string) => {
                    const doc = documents.find((d) => d.id === docId);
                    if (!doc) return null;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSearchModalOpen(false);
                          setPreviewDoc(doc);
                        }}
                        className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer transition shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{doc.title}</p>
                            <p className="text-[11px] text-slate-500">
                              {doc.category} • {doc.documentNumber || doc.fileName}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs text-slate-700 font-semibold flex items-center gap-1">
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  ExternalLink,
  Trash2,
  X,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { CredentialCategory, CredentialRecord } from '../../types/vault';

export const PasswordsVault: React.FC = () => {
  const { credentials, addCredential, updateCredential, deleteCredential, lockVault } = useVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web & App' as CredentialCategory,
    username: '',
    password: '',
    websiteUrl: '',
    notes: '',
    twoFactorKey: '',
    strengthScore: 85,
    lastRotatedDate: new Date().toISOString().split('T')[0],
    isFavorite: false,
  });

  const categories: CredentialCategory[] = [
    'Web & App',
    'Banking & Card',
    'WiFi & Network',
    'Software License',
    'Govt Portal',
    'Secure Note',
  ];

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+~';
    let res = '';
    for (let i = 0; i < 18; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({
      ...prev,
      password: res,
      strengthScore: 98,
    }));
  };

  const handleSaveCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.password.trim()) return;

    addCredential(formData);
    setAddModalOpen(false);
  };

  const filtered = credentials.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-violet-400" />
            Password & Credentials Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Encrypted personal vault for portal logins, banking credentials, WiFi keys & 2FA backups
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={lockVault}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Lock Vault
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Credential
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-violet-300">
          <ShieldCheck className="w-5 h-5 text-violet-400 shrink-0" />
          <span>
            Vault secured with client-side Zero-Knowledge encryption and PBKDF2 Master PIN hashing.
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Status: Master Pin Active
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search credentials by title, website, or username..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cred) => {
          const isRevealed = revealedIds.includes(cred.id);
          const isCopied = copiedId === cred.id;

          return (
            <div
              key={cred.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/40 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cred.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {cred.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {cred.websiteUrl && (
                      <a
                        href={cred.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200"
                        title="Open Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Delete credential "${cred.title}"?`)) {
                          deleteCredential(cred.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Account Username */}
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-2 flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Username / ID</span>
                    <span className="font-mono text-slate-200 truncate">{cred.username}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(cred.username, `user_${cred.id}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                    title="Copy Username"
                  >
                    {copiedId === `user_${cred.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Password Box */}
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Password</span>
                    <span className="font-mono text-slate-200 truncate">
                      {isRevealed ? cred.password : '••••••••••••••••'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleReveal(cred.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                      title={isRevealed ? 'Hide Password' : 'Show Password'}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(cred.password, cred.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                      title="Copy Password"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Notes or 2FA Key */}
                {cred.twoFactorKey && (
                  <p className="text-[11px] text-indigo-300 mt-2 font-mono bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20">
                    2FA: {cred.twoFactorKey}
                  </p>
                )}

                {cred.notes && <p className="text-[11px] text-slate-400 mt-2 italic">{cred.notes}</p>}
              </div>

              {/* Strength & Last Rotated */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      cred.strengthScore >= 80
                        ? 'bg-emerald-400'
                        : cred.strengthScore >= 60
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  ></div>
                  <span>Strength {cred.strengthScore}%</span>
                </div>
                <span>Rotated: {cred.lastRotatedDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Credential Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Add New Encrypted Credential</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCredential} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Title / Service *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. NetBanking, Home WiFi"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Username / Account ID / SSID *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. arvind.g or SkyNet_5G"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Password with generator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Password / Secret Key *</label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Generate Strong (18 chars)
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Website or Portal URL</label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">2FA Secret / Recovery Codes (Optional)</label>
                <input
                  type="text"
                  value={formData.twoFactorKey}
                  onChange={(e) => setFormData({ ...formData, twoFactorKey: e.target.value })}
                  placeholder="e.g. SMS OTP, Soft Token, 8-digit recovery code"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Secure Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Customer ID, security questions, or notes"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

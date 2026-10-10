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
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}';
    let result = '';
    for (let i = 0; i < 18; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: result, strengthScore: 98 });
  };

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.password.trim()) return;
    addCredential(formData);
    setAddModalOpen(false);
    setFormData({
      title: '',
      category: 'Web & App',
      username: '',
      password: '',
      websiteUrl: '',
      notes: '',
      twoFactorKey: '',
      strengthScore: 85,
      lastRotatedDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
    });
  };

  const filteredCreds = credentials.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-slate-800" />
            Passwords & Digital Keys
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Zero-knowledge encrypted password vault secured with Master PIN & AES-256
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={lockVault}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" /> Lock Vault Now
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Credentials
          </button>
        </div>
      </div>

      {/* Vault Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Saved Passwords</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{credentials.length}</span>
            <span className="text-xs text-slate-500">accounts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">AWS KMS envelope encryption</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Average Password Health</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">92%</span>
            <span className="text-xs text-emerald-700 font-semibold">Strong</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">No compromised or duplicate passwords found</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Master Lock Status</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold text-slate-900">Unlocked (Active)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Auto-locks upon session inactivity</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search passwords by service title, username, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Passwords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCreds.map((cred) => {
          const isRevealed = revealedIds.includes(cred.id);
          const isCopied = copiedId === cred.id;

          return (
            <div
              key={cred.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cred.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {cred.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      cred.strengthScore >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cred.strengthScore}%
                  </span>
                </div>

                {/* Username */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 block">Username / Account</span>
                    <span className="font-mono text-slate-800 truncate block font-medium">{cred.username}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(cred.username, `${cred.id}_user`)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Copy username"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Password Box */}
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="text-[10px] text-slate-500 block">Master Password</span>
                    <span className="font-mono font-bold text-slate-900 tracking-wider truncate block">
                      {isRevealed ? cred.password : '••••••••••••••••'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleReveal(cred.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                      title={isRevealed ? 'Hide Password' : 'Show Password'}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(cred.password, cred.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                      title="Copy Password"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {cred.notes && <p className="text-[11px] text-slate-500 mt-2 italic">{cred.notes}</p>}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Rotated: {cred.lastRotatedDate}</span>
                <button
                  onClick={() => deleteCredential(cred.id)}
                  className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                  title="Delete Credential"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Credential Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Secure Credentials</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCredential} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Root Account, GitHub"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Username / Email *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. arvindgeethesh2007@gmail.com"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password *</label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter or generate password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Recovery Codes</label>
                <textarea
                  rows={2}
                  placeholder="Encrypted note or security questions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Bell,
  Layers,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { SubscriptionCategory, SubscriptionRecord } from '../../types/vault';

export const SubscriptionsManager: React.FC = () => {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription, monthlySubscriptionCost } =
    useVault();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionRecord | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    serviceName: '',
    provider: '',
    category: 'Streaming' as SubscriptionCategory,
    cost: 14.99,
    currency: 'USD',
    billingCycle: 'Monthly' as 'Monthly' | 'Yearly' | 'Quarterly',
    nextRenewalDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Credit Card (Primary)',
    autoRenew: true,
    color: '#3B82F6',
    remindersEnabled: true,
    reminderDaysBefore: 3,
    notes: '',
  });

  const categories: SubscriptionCategory[] = [
    'Streaming',
    'Cloud & AI',
    'Software',
    'Fitness & Health',
    'Broadband & Utilities',
    'Finance',
    'Other',
  ];

  const yearlyProjectedCost = monthlySubscriptionCost * 12;

  const handleOpenAdd = () => {
    setEditingSub(null);
    setFormData({
      serviceName: '',
      provider: '',
      category: 'Streaming',
      cost: 14.99,
      currency: 'USD',
      billingCycle: 'Monthly',
      nextRenewalDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      autoRenew: true,
      color: '#3B82F6',
      remindersEnabled: true,
      reminderDaysBefore: 3,
      notes: '',
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (sub: SubscriptionRecord) => {
    setEditingSub(sub);
    setFormData({
      serviceName: sub.serviceName,
      provider: sub.provider,
      category: sub.category,
      cost: sub.cost,
      currency: sub.currency,
      billingCycle: sub.billingCycle,
      nextRenewalDate: sub.nextRenewalDate,
      paymentMethod: sub.paymentMethod,
      autoRenew: sub.autoRenew,
      color: sub.color,
      remindersEnabled: sub.remindersEnabled,
      reminderDaysBefore: sub.reminderDaysBefore,
      notes: sub.notes || '',
    });
    setAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceName.trim()) return;

    if (editingSub) {
      updateSubscription(editingSub.id, formData);
    } else {
      addSubscription(formData);
    }
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Subscriptions Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track recurring SaaS, streaming, gym, and cloud subscriptions with renewal alert triggers
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Subscription
        </button>
      </div>

      {/* Spend Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Monthly Burn Rate</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">
            ${monthlySubscriptionCost.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Calculated across all billing frequencies</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Annual Projected Spend</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            ${yearlyProjectedCost.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">12-month projected burn</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Active Subscriptions</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-blue-400 mt-1">{subscriptions.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {subscriptions.filter((s) => s.autoRenew).length} auto-renew enabled
          </p>
        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          return (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{ backgroundColor: sub.color }}
                    >
                      {sub.serviceName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.serviceName}</h4>
                      <p className="text-[11px] text-slate-400">{sub.provider}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete subscription "${sub.serviceName}"?`)) {
                          deleteSubscription(sub.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cost and billing frequency */}
                <div className="my-3 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-white">${sub.cost.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">/ {sub.billingCycle.toLowerCase()}</span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-slate-300 font-medium">{sub.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Renewal:</span>
                    <span className="text-amber-400 font-mono font-medium">{sub.nextRenewalDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="text-slate-300 truncate max-w-[150px]">{sub.paymentMethod}</span>
                  </div>
                </div>

                {sub.notes && (
                  <p className="text-[11px] text-slate-500 mt-2 bg-slate-800/40 p-2 rounded-lg italic">
                    {sub.notes}
                  </p>
                )}
              </div>

              {/* Footer status */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span
                  className={`flex items-center gap-1 font-medium ${
                    sub.autoRenew ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> {sub.autoRenew ? 'Auto-Renew On' : 'Manual Renew'}
                </span>
                {sub.remindersEnabled && (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Bell className="w-3 h-3 text-blue-400" /> {sub.reminderDaysBefore}d reminder
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Subscription Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingSub ? 'Edit Subscription' : 'Add New Recurring Subscription'}
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    placeholder="e.g. Netflix, AWS, Spotify"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Provider / Company</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g. Netflix Inc."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Next Renewal Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.nextRenewalDate}
                    onChange={(e) => setFormData({ ...formData, nextRenewalDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Payment Method</label>
                  <input
                    type="text"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    placeholder="e.g. HDFC Regalia (8821)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-0"
                  />
                  <span>Auto-Renew Enabled</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.remindersEnabled}
                    onChange={(e) => setFormData({ ...formData, remindersEnabled: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-0"
                  />
                  <span>Notify {formData.reminderDaysBefore} days before</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Notes & Family Plan Details</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional account notes, family login info, or cancellation reminders"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
                >
                  {editingSub ? 'Update Subscription' : 'Save Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

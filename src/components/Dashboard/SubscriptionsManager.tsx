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
    color: '#0f172a',
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
      paymentMethod: 'Credit Card (Primary)',
      autoRenew: true,
      color: '#0f172a',
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
      color: sub.color || '#0f172a',
      remindersEnabled: sub.remindersEnabled,
      reminderDaysBefore: sub.reminderDaysBefore,
      notes: sub.notes || '',
    });
    setAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-slate-800" />
            Recurring Subscriptions
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Track active memberships, renewal cycles, and automated calendar notifications
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Subscription
        </button>
      </div>

      {/* Burn Rate Stat Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Monthly Burn Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              ${monthlySubscriptionCost.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">/ month</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{subscriptions.length} active digital services</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Annual Run-Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              ${yearlyProjectedCost.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">/ year</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Projected total annualized cost</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Renewal Alerts</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">
              {subscriptions.filter((s) => s.remindersEnabled).length}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Automated Google Calendar push notifications enabled</p>
        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const daysLeft = Math.ceil(
            (new Date(sub.nextRenewalDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
          );

          return (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                      {sub.serviceName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{sub.serviceName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {sub.provider} • {sub.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black font-mono text-slate-900">
                      ${sub.cost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">/{sub.billingCycle.toLowerCase()}</span>
                  </div>
                </div>

                {/* Next Renewal Pill */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Renewal Date
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-medium text-slate-900">{sub.nextRenewalDate}</span>
                    <span
                      className={`block text-[10px] font-bold ${
                        daysLeft <= 7 ? 'text-rose-600' : 'text-slate-500'
                      }`}
                    >
                      {daysLeft > 0 ? `in ${daysLeft} days` : 'Due today'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[180px]">{sub.paymentMethod}</span>
                  {sub.autoRenew ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Renew
                    </span>
                  ) : (
                    <span className="text-slate-400">Manual</span>
                  )}
                </div>

                {sub.notes && <p className="text-[11px] text-slate-500 mt-2 italic">{sub.notes}</p>}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-slate-400" /> {sub.reminderDaysBefore}d reminder
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                    title="Edit Subscription"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    title="Delete Subscription"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Subscription Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSub ? 'Edit Subscription' : 'Add New Recurring Subscription'}
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Netflix, ChatGPT Plus"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Provider Company</label>
                  <input
                    type="text"
                    placeholder="e.g. OpenAI Inc."
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Cost *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Next Renewal Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.nextRenewalDate}
                    onChange={(e) => setFormData({ ...formData, nextRenewalDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
                  <input
                    type="text"
                    placeholder="e.g. Visa ending 4021"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes, member access, or account details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <span>Auto-Renew Enabled</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.remindersEnabled}
                    onChange={(e) => setFormData({ ...formData, remindersEnabled: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <span>Push Reminders</span>
                </label>
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
                  {editingSub ? 'Save Changes' : 'Create Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

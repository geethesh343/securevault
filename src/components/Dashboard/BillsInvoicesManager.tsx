import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Trash2,
  FileText,
  DollarSign,
  X,
  Building,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { BillCategory, BillRecord } from '../../types/vault';

export const BillsInvoicesManager: React.FC = () => {
  const { bills, addBill, updateBill, deleteBill, markBillAsPaid, pendingBillsCost, setPreviewDoc, documents } =
    useVault();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    biller: '',
    category: 'Electricity' as BillCategory,
    amount: 50.0,
    currency: 'USD',
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
    status: 'Pending' as 'Pending' | 'Paid' | 'Overdue',
    recurring: true,
    notes: '',
  });

  const categories: BillCategory[] = [
    'Electricity',
    'Water & Gas',
    'Internet & Mobile',
    'Rent & Housing',
    'Credit Card',
    'Insurance Premium',
    'Medical Bill',
    'Other',
  ];

  const filteredBills = bills.filter((b) => {
    if (activeTab === 'pending') return b.status !== 'Paid';
    if (activeTab === 'paid') return b.status === 'Paid';
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Title', 'Biller', 'Category', 'Amount', 'Currency', 'Due Date', 'Status', 'Paid At'];
    const rows = bills.map((b) => [
      b.id,
      `"${b.title}"`,
      `"${b.biller}"`,
      b.category,
      b.amount,
      b.currency,
      b.dueDate,
      b.status,
      b.paidAt || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `LifeVault_Bills_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addBill(formData);
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-teal-400" />
            Bills & Invoices Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track utility payments, rent, broadband invoices & avoid missed penalty deadlines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Bill / Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Outstanding Bills</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-1">
            ${pendingBillsCost.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {bills.filter((b) => b.status !== 'Paid').length} bills awaiting clearance
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Cleared Payments</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">
            {bills.filter((b) => b.status === 'Paid').length} Paid
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Totaling $
            {bills
              .filter((b) => b.status === 'Paid')
              .reduce((sum, b) => sum + b.amount, 0)
              .toFixed(2)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Receipt Documents Synced</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-blue-400 mt-1">
            {bills.filter((b) => b.receiptDocId).length} Attached
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Stored securely on Amazon S3</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition font-medium ${
            activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Records ({bills.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-lg transition font-medium ${
            activeTab === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending / Due ({bills.filter((b) => b.status !== 'Paid').length})
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`px-3 py-1.5 rounded-lg transition font-medium ${
            activeTab === 'paid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Paid History ({bills.filter((b) => b.status === 'Paid').length})
        </button>
      </div>

      {/* Bills Table / Cards */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800">
        {filteredBills.map((bill) => {
          const isPaid = bill.status === 'Paid';
          const attachedDoc = bill.receiptDocId ? documents.find((d) => d.id === bill.receiptDocId) : null;

          return (
            <div
              key={bill.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isPaid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{bill.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {bill.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Biller: <span className="text-slate-300 font-medium">{bill.biller}</span> • Due Date:{' '}
                    <span className={isPaid ? 'text-slate-400' : 'text-amber-400 font-mono font-medium'}>
                      {bill.dueDate}
                    </span>
                  </p>
                  {bill.notes && <p className="text-[11px] text-slate-500 mt-1 italic">{bill.notes}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-white">${bill.amount.toFixed(2)}</span>
                  <div className="text-[10px] text-slate-400">
                    Status:{' '}
                    <span className={isPaid ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                      {bill.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {attachedDoc && (
                    <button
                      onClick={() => setPreviewDoc(attachedDoc)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition"
                      title="View Attached Invoice PDF"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}

                  {!isPaid ? (
                    <button
                      onClick={() => markBillAsPaid(bill.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Delete bill record "${bill.title}"?`)) {
                        deleteBill(bill.id);
                      }
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Bill Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Record Bill or Invoice</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBill} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Bill Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Electricity Bill (Oct 2026), Apartment Maintenance"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Biller / Authority *</label>
                  <input
                    type="text"
                    required
                    value={formData.biller}
                    onChange={(e) => setFormData({ ...formData, biller: e.target.value })}
                    placeholder="e.g. BESCOM, ACT Fiber, HOA"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  <label className="text-[11px] font-semibold text-slate-300">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Payment Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Notes & Payment Reference</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes, consumer number, transaction reference"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md transition"
                >
                  Save Bill Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

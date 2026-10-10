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
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LifeVault_Bills_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addBill(formData);
    setAddModalOpen(false);
    setFormData({
      title: '',
      biller: '',
      category: 'Electricity',
      amount: 50.0,
      currency: 'USD',
      dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      recurring: true,
      notes: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-slate-800" />
            Bills & Invoice Tracking
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Monitor utility bills, payments, settlement history, and linked Amazon S3 PDF proofs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Bill / Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Pending Payable Total</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-amber-700 font-mono">
              ${pendingBillsCost.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">
              ({bills.filter((b) => b.status !== 'Paid').length} invoices)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Electricity, internet, maintenance & medical</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Settled This Month</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">
              ${bills
                .filter((b) => b.status === 'Paid')
                .reduce((acc, curr) => acc + curr.amount, 0)
                .toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {bills.filter((b) => b.status === 'Paid').length} paid receipts verified
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Next Upcoming Due</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold text-slate-900 truncate">
              {bills.find((b) => b.status !== 'Paid')?.title || 'All Clear'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {bills.find((b) => b.status !== 'Paid')?.dueDate
              ? `Due on ${bills.find((b) => b.status !== 'Paid')?.dueDate}`
              : 'No pending dues'}
          </p>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Bills ({bills.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'pending'
              ? 'bg-amber-100 text-amber-900 font-bold border border-amber-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Pending / Due ({bills.filter((b) => b.status !== 'Paid').length})
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'paid'
              ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Settled / Paid ({bills.filter((b) => b.status === 'Paid').length})
        </button>
      </div>

      {/* Bills List Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredBills.map((bill) => {
            const isPaid = bill.status === 'Paid';
            const isOverdue = bill.status === 'Overdue';

            return (
              <div
                key={bill.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-700'
                        : isOverdue
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <Receipt className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{bill.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {bill.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Biller: <span className="text-slate-700 font-medium">{bill.biller}</span>
                      {bill.notes && <span> • {bill.notes}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-base font-extrabold font-mono text-slate-900">
                      ${bill.amount.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Due: <span className="font-mono">{bill.dueDate}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Pill */}
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : isOverdue
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {bill.status}
                    </span>

                    {/* Quick Action: Mark Paid or Pay Now */}
                    {!isPaid ? (
                      <button
                        onClick={() => markBillAsPaid(bill.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                        Paid on {bill.paidAt || '2026-10-02'}
                      </span>
                    )}

                    {/* Linked Doc Preview button */}
                    {bill.receiptDocId && (
                      <button
                        onClick={() => {
                          const doc = documents.find((d) => d.id === bill.receiptDocId);
                          if (doc) setPreviewDoc(doc);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="View S3 Linked Invoice Document"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Bill Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Bill or Invoice</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Bill Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October Electricity Bill"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Biller / Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BESCOM / Airtel"
                    value={formData.biller}
                    onChange={(e) => setFormData({ ...formData, biller: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Account #</label>
                <textarea
                  rows={2}
                  placeholder="Consumer ID, meter number, or transaction ref..."
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
                  Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

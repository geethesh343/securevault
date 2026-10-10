import React, { useState } from 'react';
import {
  ClockAlert,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  RefreshCw,
  FolderLock,
  CreditCard,
  Receipt,
  ArrowRight,
  Bell,
  Clock,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const ExpiryRenewalsTracker: React.FC = () => {
  const {
    expiringSoonItems,
    documents,
    subscriptions,
    bills,
    updateDocument,
    updateSubscription,
    setPreviewDoc,
  } = useVault();

  const [filterType, setFilterType] = useState<'all' | 'document' | 'subscription' | 'bill'>('all');
  const [renewedSuccessId, setRenewedSuccessId] = useState<string | null>(null);

  const filteredItems = expiringSoonItems.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    return true;
  });

  const criticalItems = filteredItems.filter((i) => i.daysRemaining <= 15);
  const upcomingItems = filteredItems.filter((i) => i.daysRemaining > 15 && i.daysRemaining <= 45);
  const futureItems = filteredItems.filter((i) => i.daysRemaining > 45);

  const handleDownloadCalendarIcs = (item: (typeof expiringSoonItems)[0]) => {
    const startDate = item.date.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LifeVault AI//Life Management Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Renewal Due: ${item.title}`,
      `DESCRIPTION:LifeVault AI reminder: ${item.category} expiry/renewal due on ${item.date}.`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${startDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Renewal_${item.title.replace(/\s+/g, '_')}_${item.date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickRenew1Year = (item: (typeof expiringSoonItems)[0]) => {
    const nextYear = new Date(new Date(item.date).setFullYear(new Date(item.date).getFullYear() + 1))
      .toISOString()
      .split('T')[0];

    if (item.type === 'document') {
      updateDocument(item.id, { expiryDate: nextYear });
    } else if (item.type === 'subscription') {
      updateSubscription(item.id, { nextRenewalDate: nextYear });
    }

    setRenewedSuccessId(item.id);
    setTimeout(() => setRenewedSuccessId(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ClockAlert className="w-6 h-6 text-slate-800" />
            Expiry & Renewal Reminders
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Unified timeline tracking warranties, passport validity, vehicle insurance, and billing deadlines
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick filter tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            {(['all', 'document', 'subscription', 'bill'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  filterType === type
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? 'All Items' : `${type}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Critical (&lt; 15 Days)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-700 font-mono">{criticalItems.length}</span>
            <span className="text-xs text-rose-600 font-medium">Urgent action required</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Car insurance, power utilities & warranties</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Upcoming (15-45 Days)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-800 font-mono">{upcomingItems.length}</span>
            <span className="text-xs text-amber-700 font-medium">Plan renewals</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Recurring cloud and subscription renewals</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Future Horizon (&gt; 45 Days)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{futureItems.length}</span>
            <span className="text-xs text-emerald-700 font-medium">On track</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Passports, term insurances & fixed deposits</p>
        </div>
      </div>

      {/* Renewed Success Banner */}
      {renewedSuccessId && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Record renewed successfully! Validity extended by +1 year and synchronized to encrypted store.</span>
        </div>
      )}

      {/* Timeline Section */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isUrgent = item.daysRemaining <= 15;
          const isWarning = item.daysRemaining > 15 && item.daysRemaining <= 45;

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
                isUrgent
                  ? 'bg-white border-rose-200 hover:border-rose-300'
                  : isWarning
                  ? 'bg-white border-amber-200 hover:border-amber-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isUrgent
                      ? 'bg-rose-50 text-rose-700'
                      : isWarning
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.type === 'document' ? (
                    <FolderLock className="w-5 h-5" />
                  ) : item.type === 'subscription' ? (
                    <CreditCard className="w-5 h-5" />
                  ) : (
                    <Receipt className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold uppercase">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Category: <span className="text-slate-800 font-medium">{item.category}</span>
                    {item.amount && <span> • Value: ${item.amount.toFixed(2)}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase font-mono ${
                      isUrgent
                        ? 'bg-rose-100 text-rose-800'
                        : isWarning
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.daysRemaining} days left
                  </span>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">Due Date: {item.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Google Calendar export .ics */}
                  <button
                    onClick={() => handleDownloadCalendarIcs(item)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                    title="Export to Google Calendar (.ics)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add to Calendar</span>
                  </button>

                  {/* Extend / Renew */}
                  {item.type !== 'bill' && (
                    <button
                      onClick={() => handleQuickRenew1Year(item)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                      title="Extend validity by 1 year"
                    >
                      Renew +1 Yr
                    </button>
                  )}

                  {/* Inspect Document */}
                  {item.type === 'document' && (
                    <button
                      onClick={() => {
                        const doc = documents.find((d) => d.id === item.id);
                        if (doc) setPreviewDoc(doc);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Inspect Document"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

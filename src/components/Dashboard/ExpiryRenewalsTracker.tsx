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
    link.download = `LifeVault_${item.title.replace(/\s+/g, '_')}_reminder.ics`;
    link.click();
  };

  const handleMarkRenewed = (item: (typeof expiringSoonItems)[0]) => {
    const current = new Date(item.date);
    const nextYear = new Date(current);
    nextYear.setFullYear(current.getFullYear() + 1);
    const nextDateStr = nextYear.toISOString().split('T')[0];

    if (item.type === 'document') {
      updateDocument(item.id, { expiryDate: nextDateStr });
    } else if (item.type === 'subscription') {
      updateSubscription(item.id, { nextRenewalDate: nextDateStr });
    }

    setRenewedSuccessId(item.id);
    setTimeout(() => setRenewedSuccessId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ClockAlert className="w-6 h-6 text-amber-400" />
            Expiry & Renewal Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated alerts for passport renewal, health insurance policies, warranties & recurring billing
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({expiringSoonItems.length})
          </button>
          <button
            onClick={() => setFilterType('document')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filterType === 'document' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setFilterType('subscription')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filterType === 'subscription' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setFilterType('bill')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filterType === 'bill' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bills
          </button>
        </div>
      </div>

      {/* Critical Section */}
      {criticalItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Critical: Expiring Within 15 Days ({criticalItems.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                      <ClockAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-rose-300 font-mono">
                        Expires in {item.daysRemaining} days • {item.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 uppercase">
                    Urgent
                  </span>
                </div>

                <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDownloadCalendarIcs(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-400" /> Add to Calendar (.ics)
                  </button>

                  <button
                    onClick={() => handleMarkRenewed(item)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    {renewedSuccessId === item.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Renewed!
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" /> Renewed +1 Year
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section (16 to 45 days) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Upcoming: Expiring in 16 to 45 Days ({upcomingItems.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{item.category}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-semibold">
                  {item.daysRemaining} days left
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Due: {item.date}</span>
                {item.amount && <span className="font-mono text-slate-200">${item.amount.toFixed(2)}</span>}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleDownloadCalendarIcs(item)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" /> Sync (.ics)
                </button>
                <button
                  onClick={() => handleMarkRenewed(item)}
                  className="text-xs text-slate-300 hover:text-white font-medium"
                >
                  Mark Renewed
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Section (> 45 days) */}
      {futureItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Future Renewals & Validities ({futureItems.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-400">
                    {item.date} • <span className="text-emerald-400">{item.daysRemaining} days</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadCalendarIcs(item)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Add to Calendar"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

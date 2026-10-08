import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ClockAlert,
  CreditCard,
  Receipt,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers,
  PieChart,
  BarChart3,
  Sliders,
  DollarSign,
  Zap,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const FinancialTaskHealthReport: React.FC = () => {
  const { healthMetrics, subscriptions, bills, expiringSoonItems, setActiveTab } = useVault();
  const [activeView, setActiveView] = useState<'overview' | 'allocation' | 'renewals' | 'ai_plan'>('overview');
  const [timeHorizon, setTimeHorizon] = useState<'30d' | '90d' | '1yr'>('30d');

  const {
    overallScore,
    grade,
    financialScore,
    taskScore,
    complianceScore,
    totalMonthlyCommitment,
    projectedAnnualCommitment,
    pendingBillsTotal,
    overdueBillsCount,
    upcomingRenewals30dCount,
    trends,
    breakdown,
    recommendations,
  } = healthMetrics;

  // Multiplier for time horizon preview
  const horizonMultiplier = timeHorizon === '30d' ? 1 : timeHorizon === '90d' ? 3 : 12;
  const displayedCommitment = totalMonthlyCommitment * horizonMultiplier;

  // SVG circular gauge calculation
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6 backdrop-blur-xl">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Row: Circular Health Gauge & Time Horizon */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-5">
          {/* Animated Circular SVG Progress Meter */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="transition-all duration-1000 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#healthGradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono text-white tracking-tighter leading-none">
                {overallScore}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                INDEX
              </span>
            </div>

            {/* Letter Grade Pill */}
            <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30">
              {grade}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Financial & Task Health Report
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Optimal Balance
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Synthesized telemetry monitoring upcoming bill clearances, recurring subscription loads, and warranty/document
              validities with predictive trend forecasts.
            </p>
          </div>
        </div>

        {/* Pillar Sub-Scores & Horizon Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* 3 Pillars Score Bars */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/80 shadow-inner">
            <div className="px-2 text-center">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">Financial</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{financialScore}%</span>
              <div className="w-12 mx-auto bg-slate-800 h-1 rounded-full mt-1">
                <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${financialScore}%` }}></div>
              </div>
            </div>
            <div className="px-2 text-center border-x border-slate-800">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">Task Cadence</span>
              <span className="text-sm font-bold font-mono text-blue-400">{taskScore}%</span>
              <div className="w-12 mx-auto bg-slate-800 h-1 rounded-full mt-1">
                <div className="bg-blue-400 h-1 rounded-full" style={{ width: `${taskScore}%` }}></div>
              </div>
            </div>
            <div className="px-2 text-center">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">S3 Compliance</span>
              <span className="text-sm font-bold font-mono text-indigo-400">{complianceScore}%</span>
              <div className="w-12 mx-auto bg-slate-800 h-1 rounded-full mt-1">
                <div className="bg-indigo-400 h-1 rounded-full" style={{ width: `${complianceScore}%` }}></div>
              </div>
            </div>
          </div>

          {/* Time Horizon Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-medium self-end sm:self-center">
            <button
              onClick={() => setTimeHorizon('30d')}
              className={`px-2.5 py-1 rounded-lg transition ${
                timeHorizon === '30d' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeHorizon('90d')}
              className={`px-2.5 py-1 rounded-lg transition ${
                timeHorizon === '90d' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setTimeHorizon('1yr')}
              className={`px-2.5 py-1 rounded-lg transition ${
                timeHorizon === '1yr' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual
            </button>
          </div>
        </div>
      </div>

      {/* 4 Interactive Trend Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Cashflow Burn */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/40 transition group shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeHorizon === '30d' ? 'Monthly' : timeHorizon === '90d' ? 'Quarterly' : 'Annual'} Commitment</span>
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full font-mono">
              <ArrowUpRight className="w-3 h-3" /> +{trends.monthlyBurnTrendPercent}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-white tracking-tight">
              ${displayedCommitment.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Bills (${(pendingBillsTotal * horizonMultiplier).toFixed(2)}) + Subs
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Forecast Status:</span>
            <span className="text-emerald-400 font-semibold font-mono">Runway Stable</span>
          </div>
        </div>

        {/* Tile 2: On-Time Settlement Rate */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-emerald-500/40 transition group shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>On-Time Settlement</span>
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-mono">
              <TrendingUp className="w-3 h-3" /> +{trends.onTimePaymentDelta}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
              {trends.onTimePaymentRate}%
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {overdueBillsCount === 0 ? 'Zero overdue liabilities' : `${overdueBillsCount} overdue payments`}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Settled Invoices:</span>
            <span className="text-slate-200 font-semibold font-mono">
              {bills.filter((b) => b.status === 'Paid').length} / {bills.length}
            </span>
          </div>
        </div>

        {/* Tile 3: Task & Expiry Readiness */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-blue-500/40 transition group shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <ClockAlert className="w-3.5 h-3.5 text-blue-400" />
              <span>Expiry Velocity</span>
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full font-mono">
              <TrendingUp className="w-3 h-3" /> +{trends.taskCompletionDelta}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-blue-400 tracking-tight">
              {trends.taskCompletionRate}%
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {upcomingRenewals30dCount} renewals scheduled within 30d
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Critical (&lt;15d):</span>
            <span className="text-rose-400 font-semibold font-mono">
              {expiringSoonItems.filter((i) => i.daysRemaining <= 15).length} urgent
            </span>
          </div>
        </div>

        {/* Tile 4: Subscription Efficiency */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-indigo-500/40 transition group shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
              <span>Subscription Efficiency</span>
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full font-mono">
              <Zap className="w-3 h-3" /> {trends.subscriptionEfficiency}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-indigo-300 tracking-tight">
              {subscriptions.length} Plans
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ${(subscriptions.reduce((s, sub) => s + (sub.billingCycle === 'Monthly' ? sub.cost : sub.cost / 12), 0)).toFixed(2)}/mo recurring burn
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Potential Savings:</span>
            <span className="text-emerald-400 font-semibold font-mono">~$110/yr</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveView('overview')}
          className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
            activeView === 'overview'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Overview Matrix
        </button>
        <button
          onClick={() => setActiveView('allocation')}
          className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
            activeView === 'allocation'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" /> Cashflow Allocation
        </button>
        <button
          onClick={() => setActiveView('renewals')}
          className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
            activeView === 'renewals'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Renewal Deadlines ({upcomingRenewals30dCount})
        </button>
        <button
          onClick={() => setActiveView('ai_plan')}
          className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
            activeView === 'ai_plan'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Action Plan ({recommendations.length})
        </button>
      </div>

      {/* Dynamic Sub-Views */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Dual Allocation Bar Card */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Commitment Distribution
              </span>
              <span className="text-xs font-mono text-slate-300">
                ${totalMonthlyCommitment.toFixed(2)}/mo
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    Pending Due Bills ({bills.filter((b) => b.status !== 'Paid').length})
                  </span>
                  <span className="font-mono font-semibold">${pendingBillsTotal.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (pendingBillsTotal / (totalMonthlyCommitment || 1)) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    Recurring Subscriptions ({subscriptions.length})
                  </span>
                  <span className="font-mono font-semibold">
                    ${subscriptions
                      .reduce((sum, s) => sum + (s.billingCycle === 'Monthly' ? s.cost : s.cost / 12), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (subscriptions.reduce(
                          (sum, s) => sum + (s.billingCycle === 'Monthly' ? s.cost : s.cost / 12),
                          0
                        ) /
                          (totalMonthlyCommitment || 1)) *
                          100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Payment Buffer:</span>
              <span className="text-emerald-400 font-semibold">
                No liquidity risk detected across accounts
              </span>
            </div>
          </div>

          {/* AI Strategic Action Plan Mini */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Strategic Action Recommendations
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Auto-Tuned
              </span>
            </div>

            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => setActiveTab(rec.actionTarget)}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/30 transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white group-hover:text-blue-300 transition truncate">
                        {rec.title}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                        {rec.trendTag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{rec.impact}</p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition"
                  >
                    {rec.actionLabel} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Cashflow Allocation Breakdown */}
      {activeView === 'allocation' && (
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Category Expense Analysis & Commitment
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              Total Managed: ${displayedCommitment.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{sub.serviceName}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${sub.cost.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{sub.category}</span>
                  <span className="font-mono text-slate-300">{sub.billingCycle}</span>
                </div>
              </div>
            ))}
            {bills.filter((b) => b.status !== 'Paid').map((bill) => (
              <div key={bill.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{bill.title}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    ${bill.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{bill.biller}</span>
                  <span className="font-mono text-amber-400">Due: {bill.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Renewal Deadlines Timeline */}
      {activeView === 'renewals' && (
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
            Imminent Renewal & Expiration Timeline
          </h4>

          <div className="divide-y divide-slate-800">
            {expiringSoonItems.slice(0, 6).map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      item.daysRemaining <= 15 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    <ClockAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.category} • Due: {item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      item.daysRemaining <= 15 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.daysRemaining} days left
                  </span>
                  <button
                    onClick={() => setActiveTab(item.type === 'document' ? 'documents' : item.type === 'subscription' ? 'subscriptions' : 'bills')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 4: Full AI Action Plan */}
      {activeView === 'ai_plan' && (
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
            AI Optimization Roadmap
          </h4>
          <div className="space-y-2.5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setActiveTab(rec.actionTarget)}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{rec.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {rec.trendTag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{rec.impact}</p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition"
                >
                  {rec.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

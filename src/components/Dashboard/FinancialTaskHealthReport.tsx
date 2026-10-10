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

  // Breakdown numbers based on subscriptions and bills
  const streamingCost = subscriptions
    .filter((s) => s.category === 'Streaming')
    .reduce((sum, s) => sum + s.cost, 0);
  const cloudAiCost = subscriptions
    .filter((s) => s.category === 'Cloud & AI' || s.category === 'Software')
    .reduce((sum, s) => sum + s.cost, 0);
  const otherSubsCost = subscriptions
    .filter((s) => s.category !== 'Streaming' && s.category !== 'Cloud & AI' && s.category !== 'Software')
    .reduce((sum, s) => sum + s.cost, 0);

  const utilitiesCost = bills
    .filter((b) => b.category === 'Electricity' || b.category === 'Water & Gas' || b.category === 'Internet & Mobile')
    .reduce((sum, b) => sum + b.amount, 0);
  const otherBillsCost = bills
    .filter((b) => b.category !== 'Electricity' && b.category !== 'Water & Gas' && b.category !== 'Internet & Mobile')
    .reduce((sum, b) => sum + b.amount, 0);

  // SVG circular gauge calculation
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Background ambient gentle glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-slate-100 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Row: Circular Health Gauge & Time Horizon */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-5">
          {/* Animated Circular SVG Progress Meter */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-200"
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
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono text-slate-900 tracking-tighter leading-none">
                {overallScore}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                INDEX
              </span>
            </div>

            {/* Letter Grade Pill */}
            <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-black shadow-sm">
              {grade}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Financial & Task Health Report
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Optimal Balance
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Cross-functional audit synthesizing recurring subscriptions, pending utilities, document renewals, and family access compliance.
            </p>
          </div>
        </div>

        {/* Time Horizon Switcher & Sub-view Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            {(['30d', '90d', '1yr'] as const).map((hz) => (
              <button
                key={hz}
                onClick={() => setTimeHorizon(hz)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  timeHorizon === hz
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {hz === '30d' ? '30 Days' : hz === '90d' ? 'Quarterly' : 'Annual'}
              </button>
            ))}
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            {[
              { id: 'overview', label: 'Summary', icon: BarChart3 },
              { id: 'allocation', label: 'Cashflow', icon: PieChart },
              { id: 'renewals', label: 'Deadlines', icon: ClockAlert },
              { id: 'ai_plan', label: 'AI Plan', icon: Sparkles },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeView === v.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Interactive Trend Indicator Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trend 1: Monthly Cashflow Burn */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Commitment ({timeHorizon})</span>
            <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              ${displayedCommitment.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" /> +{trends.monthlyBurnTrendPercent}%
            </span>
            <span className="text-slate-500">vs prev 30-day baseline</span>
          </div>
        </div>

        {/* Trend 2: Bills Settlement Velocity */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Settlement Velocity</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {trends.onTimePaymentRate}%
            </span>
            <span className="text-xs text-emerald-700 font-semibold">On-time</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3" /> +{trends.onTimePaymentDelta}%
            </span>
            <span className="text-slate-500">{overdueBillsCount} overdue of {bills.length} total</span>
          </div>
        </div>

        {/* Trend 3: Task & Expiry Urgency Index */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Task Velocity</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <ClockAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {trends.taskCompletionRate}%
            </span>
            <span className="text-xs text-slate-600 font-semibold">ready</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="text-amber-800 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
              {upcomingRenewals30dCount} due in 30d
            </span>
            <span className="text-slate-500">Zero expired items</span>
          </div>
        </div>

        {/* Trend 4: Subscription Efficiency Ratio */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Sub Efficiency</span>
            <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {trends.subscriptionEfficiency}%
            </span>
            <span className="text-xs text-slate-600 font-semibold">Utilized</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="text-slate-700 font-bold bg-slate-200 px-1.5 py-0.5 rounded">
              {subscriptions.length} active
            </span>
            <span className="text-slate-500">All reviewed</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: Overview Summary (Default) */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Sub-Score Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Financial Health Score */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-700" /> Financial Health
                </span>
                <span className="font-mono font-bold text-slate-900">{financialScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-700"
                  style={{ width: `${financialScore}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Based on monthly subscription burn & bill status</p>
            </div>

            {/* Task Velocity Score */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <ClockAlert className="w-3.5 h-3.5 text-amber-600" /> Renewal Readiness
                </span>
                <span className="font-mono font-bold text-slate-900">{taskScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${taskScore}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Tracks upcoming passports, insurance & utility expiries</p>
            </div>

            {/* Vault Compliance Score */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> S3 Vault Compliance
                </span>
                <span className="font-mono font-bold text-slate-900">{complianceScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${complianceScore}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">AES-256 encrypted storage, verified Aadhaar & KYC</p>
            </div>
          </div>

          {/* Quick Action Matrix Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0 border border-slate-200">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Urgent Task & Settlement Hub
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {overdueBillsCount > 0 ? `${overdueBillsCount} overdue bill requires immediate clearance` : 'All bills currently on track.'}{' '}
                  {upcomingRenewals30dCount} documents expire within 30 days.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('bills')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
              >
                Pay Due Bills
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                Manage Subs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Cashflow Allocation Breakdown */}
      {activeView === 'allocation' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recurring Subscriptions by Category */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-700" /> Recurring Subscriptions Breakdown
                </h4>
                <span className="text-xs font-mono font-bold text-slate-800">
                  ${(streamingCost + cloudAiCost + otherSubsCost).toFixed(2)}/mo
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Streaming (Netflix, Spotify, Prime)</span>
                    <span className="font-mono font-semibold">${streamingCost.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${(streamingCost / (totalMonthlyCommitment || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Cloud & AI (Claude Pro, Google One, AWS)</span>
                    <span className="font-mono font-semibold">${cloudAiCost.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${(cloudAiCost / (totalMonthlyCommitment || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Health & Utilities (Cult.fit, Broadband)</span>
                    <span className="font-mono font-semibold">${otherSubsCost.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${(otherSubsCost / (totalMonthlyCommitment || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices & Utilities Pending Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-700" /> Monthly Utilities & Invoices
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  ${(utilitiesCost + otherBillsCost).toFixed(2)}/mo
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Electricity & Water (BESCOM, BWSSB)</span>
                    <span className="font-mono font-semibold">${utilitiesCost.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(utilitiesCost / (totalMonthlyCommitment || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Insurance Premiums & Other Invoices</span>
                    <span className="font-mono font-semibold">${otherBillsCost.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full"
                      style={{ width: `${(otherBillsCost / (totalMonthlyCommitment || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 mt-2">
                  <span className="font-semibold text-slate-900">Annual Run-Rate:</span> Projected at{' '}
                  <span className="font-mono font-bold text-slate-900">${projectedAnnualCommitment.toFixed(2)}</span> / year with current baseline.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Renewal Deadlines Matrix */}
      {activeView === 'renewals' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ClockAlert className="w-4 h-4 text-rose-600" /> Priority Renewal Deadlines (&lt; 90 Days)
            </h4>
            <span className="text-xs text-slate-500">{expiringSoonItems.length} monitored deadlines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiringSoonItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex items-start gap-3"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.daysRemaining <= 15
                      ? 'bg-rose-100 text-rose-700'
                      : item.daysRemaining <= 30
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <ClockAlert className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-900 truncate">{item.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 font-mono ${
                        item.daysRemaining <= 15
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.daysRemaining}d left
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.category} • Due: {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: Personalized AI Optimization Plan */}
      {activeView === 'ai_plan' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI Optimization Recommendations
            </h4>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {recommendations.length} actionable suggestions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                    {rec.trendTag}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {rec.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900">{rec.title}</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.impact}</p>
                <button
                  onClick={() => {
                    setActiveTab(rec.actionTarget);
                  }}
                  className="w-full mt-2 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold transition flex items-center justify-center gap-1 shadow-xs"
                >
                  {rec.actionLabel} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Sparkles,
  FolderLock,
  ClockAlert,
  CreditCard,
  Receipt,
  FileText,
  ArrowRight,
  TrendingUp,
  Activity,
  Users,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code2,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { INITIAL_USER } from '../../data/initialData';
import { runVaultAudit, AuditResponse } from '../../services/api';
import { FinancialTaskHealthReport } from './FinancialTaskHealthReport';

export const OverviewTab: React.FC = () => {
  const {
    user,
    documents,
    subscriptions,
    bills,
    credentials,
    familyMembers,
    expiringSoonItems,
    monthlySubscriptionCost,
    pendingBillsCost,
    setUploadModalOpen,
    setSearchModalOpen,
    setPreviewDoc,
    setActiveTab,
    setGoogleAuthModalOpen,
    loginAsGoogleMember,
    switchBackToOwner,
  } = useVault();

  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);

  const handleRunAudit = async () => {
    setAuditLoading(true);
    try {
      const result = await runVaultAudit({
        documents,
        subscriptions,
        bills,
        credentials,
        familyMembers,
      });
      setAuditData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Active Family Member Session Notification banner */}
      {user.role === 'family_member' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="font-semibold">
              Currently Logged in as: {user.name} ({user.relationship || 'Family Member'})
            </span>
            <span className="text-amber-700 hidden sm:inline">• Access Level: {user.accessLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGoogleAuthModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-medium hover:bg-amber-100 transition shadow-xs"
            >
              Switch Account
            </button>
            <button
              onClick={switchBackToOwner}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition shadow-xs"
            >
              Switch to Owner
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AWS Cloud Infrastructure • S3 Bucket & RDS PostgreSQL Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12] flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Welcome to LifeVault</span>
              <span className="inline-flex items-center text-slate-900 font-extrabold">
                AI
              </span>
              <span className="text-lg sm:text-2xl font-normal text-slate-500 border-l border-slate-300 pl-3 ml-0.5 hidden sm:inline font-sans">
                {user.name}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Your centralized personal digital wallet for Aadhaar, passports, insurance policies, warranties, recurring
              subscriptions, and controlled family access with Google Authentication.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setGoogleAuthModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold transition flex items-center gap-2 shadow-xs group"
              title="Sign in with Google as any family member"
            >
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <span>Google Login</span>
            </button>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Upload Document
            </button>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-medium transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> AI Smart Search
            </button>
          </div>
        </div>

        {/* Google Authentication for Every Member Bar */}
        {/* Google Authentication & Java Backend Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 shadow-xs border border-slate-200">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <span className="font-semibold text-slate-900">Google Authentication (2FA Enforced):</span>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">Signed in as {user.email}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Account Owner Button */}
            <button
              onClick={switchBackToOwner}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                user.email === INITIAL_USER.email
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={`Logged in as ${INITIAL_USER.name} (Account Owner)`}
            >
              <img src={INITIAL_USER.avatar} alt={INITIAL_USER.name} className="w-4 h-4 rounded-full object-cover" />
              <span>Arvind (Owner)</span>
              {user.email === INITIAL_USER.email && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>

            {/* Family Members Buttons */}
            {familyMembers.map((m) => {
              const active = user.email === m.email;
              return (
                <button
                  key={m.id}
                  onClick={() =>
                    loginAsGoogleMember({
                      id: m.id,
                      name: m.name,
                      email: m.email,
                      avatar: m.avatarUrl,
                      relationship: m.relationship,
                      memberId: m.id,
                      accessLevel: m.accessLevel,
                      role: 'family_member',
                    })
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                    active
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={`Sign in with Google as ${m.name} (${m.relationship})`}
                >
                  <img src={m.avatarUrl} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{m.name.split(' ')[0]} ({m.relationship})</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                </button>
              );
            })}

            {/* Other Google Mail Sign-In Modal */}
            <button
              onClick={() => setGoogleAuthModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold border border-sky-200 transition flex items-center gap-1.5 shadow-xs"
              title="Sign in with your Google Mail address"
            >
              <Plus className="w-3.5 h-3.5 text-sky-600" />
              <span>Sign In Any Google Mail</span>
            </button>

            {/* Java Backend Explorer */}
            <button
              onClick={() => setActiveTab('java_backend')}
              className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-semibold border border-orange-200 transition flex items-center gap-1.5 shadow-xs"
              title="Explore Complete Java 21 & Spring Boot Backend Source Files"
            >
              <Code2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Java Backend (.java)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Financial & Task Health Report */}
      <FinancialTaskHealthReport />

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div
          onClick={() => setActiveTab('documents')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">Stored Documents</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition">
              <FolderLock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">{documents.length}</span>
            <span className="text-[11px] text-emerald-700 font-semibold">All Verified</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Aadhaar, Passport, Insurance, Degrees</p>
        </div>

        {/* Expiring Soon */}
        <div
          onClick={() => setActiveTab('expiries')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">Expiring in 90 Days</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition">
              <ClockAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-rose-700 font-mono">
              {expiringSoonItems.length}
            </span>
            <span className="text-[11px] text-rose-700 font-semibold">Action Needed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Warranties, policies & utility renewals</p>
        </div>

        {/* Monthly Subscriptions */}
        <div
          onClick={() => setActiveTab('subscriptions')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">Monthly Subscriptions</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
              ${monthlySubscriptionCost.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500">/ mo</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{subscriptions.length} active recurring services</p>
        </div>

        {/* Pending Bills */}
        <div
          onClick={() => setActiveTab('bills')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">Pending Bills & Invoices</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-700 font-mono">
              ${pendingBillsCost.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500">
              ({bills.filter((b) => b.status !== 'Paid').length} due)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Electricity, broadband & maintenance</p>
        </div>
      </div>

      {/* Urgent Expiry & Renewal Alerts Carousel */}
      {expiringSoonItems.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Upcoming Deadlines & Expiry Tracking
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('expiries')}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 transition"
            >
              All Deadlines <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {expiringSoonItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'document') {
                    const doc = documents.find((d) => d.id === item.id);
                    if (doc) setPreviewDoc(doc);
                  } else if (item.type === 'subscription') {
                    setActiveTab('subscriptions');
                  } else {
                    setActiveTab('bills');
                  }
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  item.daysRemaining <= 15
                    ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
                    : 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.daysRemaining <= 15
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
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
                      {item.daysRemaining} days left
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.type.toUpperCase()} • Due: {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Grid: Recent Documents & AI Security Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Documents */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Documents in Encrypted Vault</h3>
              <p className="text-xs text-slate-500">Stored on Amazon S3 with AES-256 server-side encryption</p>
            </div>
            <button
              onClick={() => setActiveTab('documents')}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 transition"
            >
              View All ({documents.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {documents.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                onClick={() => setPreviewDoc(doc)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-slate-700 transition truncate">
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="text-slate-700 font-medium">{doc.category}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-600">{doc.documentNumber || doc.fileName}</span>
                      {doc.sharedWithFamilyIds.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Shared ({doc.sharedWithFamilyIds.length})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-500">{doc.fileSize}</span>
                  <span className="text-xs text-slate-700 opacity-0 group-hover:opacity-100 transition font-medium">
                    Inspect →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Vault Health & Quick Actions */}
        <div className="space-y-4">
          {/* AI Security & Health Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Vault Health Audit</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700">92 / 100</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini AI continually checks your personal wallet for impending expiries, unlinked insurance policies,
              and subscription optimization opportunities.
            </p>

            <button
              onClick={handleRunAudit}
              disabled={auditLoading}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {auditLoading ? 'Analyzing Vault...' : 'Run Live Security Audit'}
            </button>

            {auditData?.data && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[11px] text-emerald-700 font-semibold">{auditData.data.summary}</p>
                {auditData.data.recommendations?.map((rec: any, idx: number) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-700 border border-slate-100">
                    <p className="font-semibold text-slate-900">{rec.title}</p>
                    <p className="text-slate-500 mt-0.5">{rec.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controlled Family Access Quick Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Controlled Family Access</h3>
              </div>
              <button
                onClick={() => setActiveTab('family')}
                className="text-xs text-slate-700 hover:text-slate-900 font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {familyMembers.map((fam) => (
                <div key={fam.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img src={fam.avatarUrl} alt={fam.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{fam.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {fam.relationship} • {fam.accessLevel}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {fam.accessibleDocumentIds.length} docs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  ClockAlert,
  CreditCard,
  Receipt,
  KeyRound,
  Users,
  Server,
  Sparkles,
  HardDrive,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    documents,
    subscriptions,
    bills,
    credentials,
    familyMembers,
    expiringSoonItems,
    user,
    setChatAssistantOpen,
  } = useVault();

  const pendingBillsCount = bills.filter((b) => b.status !== 'Paid').length;
  const criticalExpiriesCount = expiringSoonItems.filter((i) => i.daysRemaining <= 30).length;

  const navItems = [
    {
      id: 'overview',
      label: 'Overview & Analytics',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-blue-400',
    },
    {
      id: 'documents',
      label: 'Document Vault',
      icon: FolderLock,
      badge: documents.length.toString(),
      color: 'text-indigo-400',
    },
    {
      id: 'expiries',
      label: 'Expiry & Renewals',
      icon: ClockAlert,
      badge: criticalExpiriesCount > 0 ? `${criticalExpiriesCount} urgent` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      color: 'text-amber-400',
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: CreditCard,
      badge: subscriptions.length.toString(),
      color: 'text-emerald-400',
    },
    {
      id: 'bills',
      label: 'Bills & Invoices',
      icon: Receipt,
      badge: pendingBillsCount > 0 ? `${pendingBillsCount} due` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      color: 'text-teal-400',
    },
    {
      id: 'passwords',
      label: 'Passwords & Vault',
      icon: KeyRound,
      badge: credentials.length.toString(),
      color: 'text-violet-400',
    },
    {
      id: 'family',
      label: 'Family Access',
      icon: Users,
      badge: `${familyMembers.length} active`,
      color: 'text-pink-400',
    },
    {
      id: 'cloud',
      label: 'Cloud & AWS Infra',
      icon: Server,
      badge: 'EC2 / S3',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      color: 'text-cyan-400',
    },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Navigation items */}
      <div className="p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Personal Life Vault
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600/15 text-white font-semibold border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : item.color}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    item.badgeColor || 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Assistant Banner Card */}
        <div className="pt-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/20 shadow-md">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-indigo-200">LifeVault AI Core</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Auto-extracts Aadhaar, bills, and warranties using Gemini 3.8 Flash OCR.
            </p>
            <button
              onClick={() => setChatAssistantOpen(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              Ask AI Assistant <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer: S3 Storage & Encryption Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" /> S3 Vault Capacity
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {((user.storageUsedMb / user.storageLimitMb) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(user.storageUsedMb / user.storageLimitMb) * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span className="font-mono">{user.storageUsedMb.toFixed(1)} MB / 5.0 GB</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> AES-256
          </span>
        </div>
      </div>
    </aside>
  );
};

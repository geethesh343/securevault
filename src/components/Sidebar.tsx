import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  ClockAlert,
  CreditCard,
  Receipt,
  KeyRound,
  Users,
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
      color: 'text-slate-700',
    },
    {
      id: 'documents',
      label: 'Document Vault',
      icon: FolderLock,
      badge: documents.length.toString(),
      color: 'text-slate-700',
    },
    {
      id: 'expiries',
      label: 'Expiry & Renewals',
      icon: ClockAlert,
      badge: criticalExpiriesCount > 0 ? `${criticalExpiriesCount} urgent` : null,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
      color: 'text-rose-600',
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: CreditCard,
      badge: subscriptions.length.toString(),
      color: 'text-slate-700',
    },
    {
      id: 'bills',
      label: 'Bills & Invoices',
      icon: Receipt,
      badge: pendingBillsCount > 0 ? `${pendingBillsCount} due` : null,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
      color: 'text-amber-600',
    },
    {
      id: 'passwords',
      label: 'Passwords & Vault',
      icon: KeyRound,
      badge: credentials.length.toString(),
      color: 'text-slate-700',
    },
    {
      id: 'family',
      label: 'Family Access',
      icon: Users,
      badge: `${familyMembers.length} active`,
      color: 'text-slate-700',
    },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 shadow-xs ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Navigation items */}
      <div className="p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? 'bg-slate-800 text-slate-200'
                      : item.badgeColor || 'bg-slate-100 text-slate-600 border border-slate-200'
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
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-900">LifeVault AI Core</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
              Auto-extracts Aadhaar, bills, and warranties using Gemini 3.8 Flash OCR.
            </p>
            <button
              onClick={() => setChatAssistantOpen(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              Ask AI Assistant <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer: S3 Storage & Encryption Status */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
            <HardDrive className="w-3.5 h-3.5 text-slate-600" /> S3 Vault Capacity
          </span>
          <span className="text-[10px] font-mono text-slate-600 font-semibold">
            {((user.storageUsedMb / user.storageLimitMb) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
          <div
            className="bg-slate-900 h-full rounded-full transition-all duration-500"
            style={{ width: `${(user.storageUsedMb / user.storageLimitMb) * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span className="font-mono">{user.storageUsedMb.toFixed(1)} MB / 5.0 GB</span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> AES-256
          </span>
        </div>
      </div>
    </aside>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Search,
  Sparkles,
  Cloud,
  Bell,
  Plus,
  Lock,
  LogOut,
  ChevronDown,
  ExternalLink,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const Navbar: React.FC = () => {
  const {
    user,
    notifications,
    unreadCount,
    markNotificationRead,
    clearAllNotifications,
    setSearchModalOpen,
    setChatAssistantOpen,
    setCloudArchitectureOpen,
    setUploadModalOpen,
    setGoogleAuthModalOpen,
    lockVault,
    setActiveTab,
  } = useVault();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchModalOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Cloud Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">LifeVault</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Personal Cloud Digital Wallet</p>
            </div>
          </div>

          {/* Cloud Badge */}
          <button
            onClick={() => setCloudArchitectureOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition"
            title="Inspect AWS S3, RDS & EC2 Infrastructure"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-emerald-400">AWS ap-south-1</span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-slate-400">S3 & RDS Encrypted</span>
          </button>
        </div>

        {/* Global Smart Search Bar */}
        <div className="flex-1 max-w-md mx-2">
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-sm text-slate-400 transition shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition" />
              <span className="truncate text-xs sm:text-sm">Search documents, expiries, bills, IDs...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask AI Vault Assistant */}
          <button
            onClick={() => setChatAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Ask Vault AI</span>
          </button>

          {/* Quick Upload Button */}
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Upload & Scan</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 text-slate-300 transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">Notifications & Reminders</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-slate-400 hover:text-slate-200 transition"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto my-2 space-y-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No notifications at the moment
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition flex items-start gap-3 ${
                          n.read ? 'hover:bg-slate-800/40 opacity-75' : 'bg-slate-800/60 hover:bg-slate-800'
                        }`}
                      >
                        <div className="mt-0.5">
                          {n.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                          {n.type === 'warning' && <Clock className="w-4 h-4 text-amber-400" />}
                          {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {n.type === 'info' && <Bell className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block font-mono">{n.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      setActiveTab('expiries');
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition"
                  >
                    View All Expiries & Renewal Calendar →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Google Member Login Switcher Button */}
          <button
            onClick={() => setGoogleAuthModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 text-slate-200 text-xs font-medium transition shadow-sm group hover:border-slate-500"
            title="Google Login for Family Members"
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xs shrink-0">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <span className="hidden md:inline font-semibold text-slate-300 group-hover:text-white">
              {user.role === 'family_member' ? user.name.split(' ')[0] : 'Google Login'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono hidden lg:inline">
              {user.role === 'family_member' ? user.relationship || 'Member' : 'Owner'}
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 transition"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-600"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <img
                        src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                        alt="Google"
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-emerald-400 font-medium">Google OAuth Verified</span>
                    </div>
                    {user.relationship && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-medium">
                        {user.relationship}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate font-mono">{user.email}</p>
                </div>

                {/* S3 Storage Progress */}
                <div className="px-3 py-2.5 my-1 bg-slate-800/50 rounded-xl">
                  <div className="flex justify-between items-center text-[11px] text-slate-300 mb-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <HardDrive className="w-3 h-3" /> AWS S3 Storage
                    </span>
                    <span className="font-mono">{user.storageUsedMb.toFixed(1)} MB / 5 GB</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${(user.storageUsedMb / user.storageLimitMb) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setGoogleAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-blue-300 hover:bg-slate-800 transition font-medium"
                  >
                    <img
                      src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    Switch Member (Google Login)
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setCloudArchitectureOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
                  >
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    Cloud Architecture & Logs
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActiveTab('family');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
                  >
                    <Shield className="w-4 h-4 text-indigo-400" />
                    Family Access Control
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      lockVault();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-950/40 transition"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    Lock Digital Vault (PIN: 1234)
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setGoogleAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Switch / Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

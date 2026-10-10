import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Search,
  Sparkles,
  Cloud,
  Plus,
  Lock,
  LogOut,
  ChevronDown,
  HardDrive,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const Navbar: React.FC = () => {
  const {
    user,
    setSearchModalOpen,
    setChatAssistantOpen,
    setCloudArchitectureOpen,
    setUploadModalOpen,
    setGoogleAuthModalOpen,
    lockVault,
    setActiveTab,
  } = useVault();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Cloud Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">LifeVault</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-300">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Personal Cloud Digital Wallet</p>
            </div>
          </div>
        </div>

        {/* Global Smart Search Bar */}
        <div className="flex-1 max-w-md mx-2">
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 text-sm text-slate-500 transition shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
              <span className="truncate text-xs sm:text-sm">Search documents, expiries, bills, IDs...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask AI Vault Assistant */}
          <button
            onClick={() => setChatAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Ask Vault AI</span>
          </button>

          {/* Quick Upload Button */}
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Upload & Scan</span>
          </button>

          {/* Google Member Login Switcher Button */}
          <button
            onClick={() => setGoogleAuthModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium transition shadow-xs group"
            title={`Google Login: ${user.email} (2FA Enforced)`}
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xs shrink-0 border border-slate-200">
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
            <span className="hidden md:inline font-semibold text-slate-800">
              {user.email ? user.email.split('@')[0] : 'Sign In with Google'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold hidden lg:inline border border-emerald-200">
              2FA Active
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <img
                        src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                        alt="Google"
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-emerald-700 font-medium">Google OAuth Verified</span>
                    </div>
                    {user.relationship && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                        {user.relationship}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate font-mono">{user.email}</p>
                </div>

                {/* S3 Storage Progress */}
                <div className="px-3 py-2.5 my-1 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-[11px] text-slate-700 mb-1">
                    <span className="flex items-center gap-1 text-slate-500">
                      <HardDrive className="w-3 h-3 text-slate-600" /> AWS S3 Storage
                    </span>
                    <span className="font-mono text-slate-600">{user.storageUsedMb.toFixed(1)} MB / 5 GB</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full"
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-800 hover:bg-slate-50 transition font-medium"
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Cloud className="w-4 h-4 text-slate-600" />
                    Cloud Architecture & Logs
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActiveTab('family');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Shield className="w-4 h-4 text-slate-600" />
                    Family Access Control
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      lockVault();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-700 hover:bg-amber-50 transition"
                  >
                    <Lock className="w-4 h-4 text-amber-600" />
                    Lock Digital Vault (PIN: 1234)
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setGoogleAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
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

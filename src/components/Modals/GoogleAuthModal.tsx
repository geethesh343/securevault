import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  UserPlus,
  ArrowRight,
  LogOut,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { INITIAL_USER } from '../../data/initialData';

export const GoogleAuthModal: React.FC = () => {
  const {
    googleAuthModalOpen,
    setGoogleAuthModalOpen,
    user,
    familyMembers,
    loginAsGoogleMember,
    loginWithGoogle,
  } = useVault();

  const [customLoginMode, setCustomLoginMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRelation, setCustomRelation] = useState('Family Member');

  if (!googleAuthModalOpen) return null;

  const handleClose = () => {
    setGoogleAuthModalOpen(false);
    setCustomLoginMode(false);
  };

  const handleSelectAccount = (account: {
    id?: string;
    name: string;
    email: string;
    avatar: string;
    relationship?: string;
    memberId?: string;
    accessLevel?: 'Owner' | 'View Only' | 'Download' | 'Full Access';
    role?: 'owner' | 'family_member';
  }) => {
    loginAsGoogleMember(account);
    handleClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    loginAsGoogleMember({
      name: customName,
      email: customEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      relationship: customRelation,
      accessLevel: 'Full Access',
      role: 'family_member',
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Google Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
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
            <div>
              <h3 className="text-base font-bold text-white">Sign in with Google</h3>
              <p className="text-xs text-slate-400">Choose a family member profile to login</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Selector List */}
        {!customLoginMode ? (
          <div className="py-4 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Select Authorized Google Account:
            </p>

            {/* Account 1: Owner (Arvind) */}
            <div
              onClick={() =>
                handleSelectAccount({
                  id: INITIAL_USER.id,
                  name: INITIAL_USER.name,
                  email: INITIAL_USER.email,
                  avatar: INITIAL_USER.avatar,
                  role: 'owner',
                  accessLevel: 'Owner',
                })
              }
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                user.email === INITIAL_USER.email
                  ? 'bg-blue-600/15 border-blue-500 text-white'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={INITIAL_USER.avatar}
                  alt={INITIAL_USER.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white">{INITIAL_USER.name}</p>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                      Account Owner
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{INITIAL_USER.email}</p>
                </div>
              </div>
              {user.email === INITIAL_USER.email && (
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {/* Family Members list */}
            {familyMembers.map((member) => {
              const isCurrent = user.email === member.email;
              return (
                <div
                  key={member.id}
                  onClick={() =>
                    handleSelectAccount({
                      id: member.id,
                      name: member.name,
                      email: member.email,
                      avatar: member.avatarUrl,
                      relationship: member.relationship,
                      memberId: member.id,
                      accessLevel: member.accessLevel,
                      role: 'family_member',
                    })
                  }
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-pink-600/15 border-pink-500 text-white'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-600"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">{member.name}</p>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-medium">
                          {member.relationship}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{member.email}</p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              );
            })}

            {/* Option to login with another custom Google Account */}
            <button
              onClick={() => setCustomLoginMode(true)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 text-xs font-medium transition flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>Use another Google account...</span>
            </button>
          </div>
        ) : (
          /* Custom Google Account Login Form */
          <form onSubmit={handleCustomSubmit} className="py-4 space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Member Full Name *</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Google Email Address *</label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="e.g. priya.sharma@gmail.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Relationship to Primary Vault</label>
              <select
                value={customRelation}
                onChange={(e) => setCustomRelation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other Family Member</option>
              </select>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setCustomLoginMode(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Back to List
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
              >
                Sign In with Google
              </button>
            </div>
          </form>
        )}

        {/* Security Disclaimers */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 leading-relaxed">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Google OAuth 2.0 Secure Handshake</span>
          </div>
          <p>
            Logging in as a family member will grant access only to documents explicitly shared with that member.
          </p>
        </div>
      </div>
    </div>
  );
};

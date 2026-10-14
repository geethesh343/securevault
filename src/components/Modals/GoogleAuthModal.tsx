import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  UserPlus,
  ArrowRight,
  Sparkles,
  Lock,
  KeyRound,
  Mail,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  LogOut,
  User,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { INITIAL_USER } from '../../data/initialData';

export const GoogleAuthModal: React.FC = () => {
  const {
    googleAuthModalOpen,
    setGoogleAuthModalOpen,
    user,
    firebaseUser,
    familyMembers,
    loginWithEmail,
    registerWithEmail,
    loginWithGooglePopup,
    loginAsGoogleMember,
    logout,
  } = useVault();

  // Mode: 'email_login' | 'email_register' | 'quick_accounts' | 'security_info'
  const [mode, setMode] = useState<'email_login' | 'email_register' | 'quick_accounts' | 'security_info'>('email_login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!googleAuthModalOpen) return null;

  const handleClose = () => {
    setGoogleAuthModalOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'email_register') {
        await registerWithEmail(email, password, displayName || undefined);
        setSuccessMessage('Account registered and signed in successfully!');
      } else {
        await loginWithEmail(email, password);
        setSuccessMessage('Welcome back! Successfully authenticated with Firebase.');
      }
      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let friendly = err.message || 'Authentication failed';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendly = 'Incorrect email or password. Please verify and try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendly = 'An account with this email already exists. Please switch to Sign In.';
      } else if (err.code === 'auth/weak-password') {
        friendly = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/user-not-found') {
        friendly = 'No account found with this email. Please register first.';
      }
      setErrorMessage(friendly);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGooglePopupLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await loginWithGooglePopup();
      setSuccessMessage('Signed in with Google successfully!');
      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err: any) {
      console.error('Google popup sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Google Sign-In was cancelled or failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Firebase Cloud Authentication
              </h3>
              <p className="text-xs text-slate-500">
                Secure Zero-Trust Identity • Email, Password & Google OAuth
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Auth Status Banner */}
        {firebaseUser ? (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-emerald-950">Active Session: {firebaseUser.email}</span>
            </div>
            <button
              onClick={async () => {
                await logout();
                handleClose();
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-semibold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition flex items-center gap-1 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Sign in to access your personal vault documents and real-time Firestore data.</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mt-4 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('email_login');
              setErrorMessage('');
            }}
            className={`pb-2.5 px-3 border-b-2 transition ${
              mode === 'email_login'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('email_register');
              setErrorMessage('');
            }}
            className={`pb-2.5 px-3 border-b-2 transition ${
              mode === 'email_register'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setMode('quick_accounts');
              setErrorMessage('');
            }}
            className={`pb-2.5 px-3 border-b-2 transition ${
              mode === 'quick_accounts'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Demo Accounts
          </button>
          <button
            onClick={() => {
              setMode('security_info');
              setErrorMessage('');
            }}
            className={`pb-2.5 px-3 border-b-2 transition ${
              mode === 'security_info'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Security Specs
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Email Login or Register Form */}
        {(mode === 'email_login' || mode === 'email_register') && (
          <div className="pt-4 space-y-4">
            {/* Google Sign-in One-Click button */}
            <button
              type="button"
              onClick={handleGooglePopupLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs flex items-center justify-center gap-2.5 transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google Account (Popup)</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                Or with Email & Password
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {mode === 'email_register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Arvind Geethesh"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with Firebase...</span>
                  </>
                ) : mode === 'email_register' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Register & Create Cloud Vault</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to LifeVault</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Demo Accounts Tab */}
        {mode === 'quick_accounts' && (
          <div className="pt-4 space-y-3">
            <p className="text-xs text-slate-500">
              Select a pre-configured role to simulate multi-user role-based access for academic evaluation:
            </p>

            <button
              onClick={() => {
                loginAsGoogleMember({
                  name: INITIAL_USER.name,
                  email: INITIAL_USER.email,
                  avatar: INITIAL_USER.avatar,
                  role: 'owner',
                  accessLevel: 'Owner',
                });
                handleClose();
              }}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 text-left transition flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <img src={INITIAL_USER.avatar} alt="Owner" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{INITIAL_USER.name} (Account Owner)</p>
                  <p className="text-[11px] text-slate-500">{INITIAL_USER.email}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[10px] font-semibold">
                Owner
              </span>
            </button>

            {familyMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  loginAsGoogleMember({
                    id: m.id,
                    name: m.name,
                    email: m.email,
                    avatar: m.avatarUrl,
                    relationship: m.relationship,
                    memberId: m.id,
                    accessLevel: m.accessLevel,
                    role: 'family_member',
                  });
                  handleClose();
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 text-left transition flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={m.avatarUrl} alt={m.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{m.name} ({m.relationship})</p>
                    <p className="text-[11px] text-slate-500">{m.email}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-[10px] font-semibold">
                  {m.accessLevel}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Security Specs Tab */}
        {mode === 'security_info' && (
          <div className="pt-4 space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Cloud Firestore Isolation</span>
              <p>
                All vault documents, subscriptions, bills, and credentials reside under user-scoped paths:
                <code className="block mt-1 font-mono text-[11px] bg-white p-1 rounded-md border border-slate-200 text-slate-800">
                  /users/{'{userId}'}/documents/{'{documentId}'}
                </code>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Cloud Storage Rules</span>
              <p>
                PDFs and images uploaded to Cloud Storage reside in private buckets:
                <code className="block mt-1 font-mono text-[11px] bg-white p-1 rounded-md border border-slate-200 text-slate-800">
                  /users/{'{userId}'}/documents/{'{fileId}'}
                </code>
                Enforced by Storage Rules: <code className="text-emerald-700 font-semibold">request.auth.uid == userId</code>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Gemini 3.8 Flash Privacy</span>
              <p>
                Calls are proxied via server-side Express endpoints (<code className="font-mono">/api/ai/*</code>). API keys are never exposed in browser JavaScript or client bundles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldAlert, KeyRound, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const VaultLockOverlay: React.FC = () => {
  const { isLocked, unlockVault, loginWithGoogle, user } = useVault();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (unlockVault(pin)) {
      setError(false);
      setPin('');
    } else {
      setError(true);
    }
  };

  const handleQuickUnlock = () => {
    unlockVault('1234');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 mb-6 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">LifeVault AI is Locked</h2>
        <p className="text-sm text-slate-600 mb-6">
          Your personal documents, passwords, and sensitive records are encrypted. Enter your 4-digit Master PIN or authenticate with Google.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="flex justify-center gap-3 my-4">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-12 h-14 rounded-2xl border flex items-center justify-center text-2xl font-mono ${
                  pin[idx]
                    ? 'border-slate-900 bg-slate-100 text-slate-900 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {pin[idx] ? '•' : ''}
              </div>
            ))}
          </div>

          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              setError(false);
              setPin(e.target.value.replace(/\D/g, ''));
            }}
            placeholder="Type 4 digits (Demo PIN: 1234)"
            className="w-full text-center tracking-widest text-base py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white"
          />

          {error && (
            <p className="text-xs text-rose-600 font-semibold animate-shake">
              Incorrect Master PIN. Use demo PIN 1234.
            </p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> Unlock Digital Vault
            </button>

            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Quick Test Unlock (Demo: 1234)
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={() => unlockVault('1234')}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <span>Biometric Unlock via Google Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">LifeVault AI is Locked</h2>
        <p className="text-sm text-slate-400 mb-6">
          Your personal documents, passwords, and sensitive records are encrypted. Enter your 4-digit Master PIN or authenticate with Google.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="flex justify-center gap-3 my-4">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-12 h-14 rounded-xl border flex items-center justify-center text-2xl font-mono ${
                  pin[idx]
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                    : 'border-slate-700 bg-slate-800/50 text-slate-500'
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
            placeholder="Enter 4-digit PIN (Demo: 1234)"
            className="w-full bg-slate-800/80 border border-slate-700 text-center text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          {error && (
            <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Incorrect PIN. Try default PIN "1234"
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              disabled={pin.length < 4}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <KeyRound className="w-4 h-4" /> Unlock Vault
            </button>
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition"
            >
              Demo PIN (1234)
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium transition flex items-center justify-center gap-2"
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              alt="Google"
              className="w-4 h-4"
            />
            Continue as {user.name} ({user.email})
          </button>
        </div>
      </div>
    </div>
  );
};

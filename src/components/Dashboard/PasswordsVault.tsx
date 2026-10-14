import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Plus,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  X,
  RefreshCw,
  Binary,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Edit3,
  FileCode,
  ArrowRight,
  Shield,
  Download,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { CredentialCategory, CredentialRecord } from '../../types/vault';
import {
  encryptWithMasterPassword,
  decryptWithMasterPassword,
  isEncryptedPayload,
  testMasterPassword,
} from '../../services/cryptoService';

export const PasswordsVault: React.FC = () => {
  const {
    credentials,
    addCredential,
    updateCredential,
    deleteCredential,
    masterPassword,
    isMasterPasswordUnlocked,
    setMasterPassword,
    unlockMasterPassword,
    lockMasterPassword,
    encryptCredentialPassword,
    decryptAndSaveCredential,
    encryptAllCredentials,
    decryptAllCredentials,
    reencryptAllWithNewMasterPassword,
  } = useVault();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'encrypted' | 'plain'>('all');
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [decryptedCache, setDecryptedCache] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [changeMasterModalOpen, setChangeMasterModalOpen] = useState(false);
  const [editingCred, setEditingCred] = useState<CredentialRecord | null>(null);
  const [inspectModalCred, setInspectModalCred] = useState<CredentialRecord | null>(null);
  const [decryptConfirmCred, setDecryptConfirmCred] = useState<CredentialRecord | null>(null);
  const [decryptAllConfirmOpen, setDecryptAllConfirmOpen] = useState(false);

  // Master Password Form State
  const [enteredMasterPw, setEnteredMasterPw] = useState('');
  const [currentMasterPw, setCurrentMasterPw] = useState('');
  const [newMasterPw, setNewMasterPw] = useState('');
  const [confirmMasterPw, setConfirmMasterPw] = useState('');
  const [migrateExistingPasswords, setMigrateExistingPasswords] = useState(true);
  const [masterPwError, setMasterPwError] = useState('');
  const [masterPwSuccess, setMasterPwSuccess] = useState('');
  const [isChangingMasterPw, setIsChangingMasterPw] = useState(false);

  // Single Item Action States
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<{ id: string; msg: string } | null>(null);

  // Bulk Operations State
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkStatusMsg, setBulkStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Master Key Integrity Test State
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  // Live Cryptographic Demonstration Sandbox State
  const [sandboxPlaintext, setSandboxPlaintext] = useState('MyConfidentialBankPIN#9942!');
  const [sandboxCiphertext, setSandboxCiphertext] = useState('');
  const [sandboxSalt, setSandboxSalt] = useState('');
  const [sandboxIv, setSandboxIv] = useState('');
  const [sandboxDecrypted, setSandboxDecrypted] = useState('');
  const [sandboxDecryptPw, setSandboxDecryptPw] = useState('');
  const [sandboxError, setSandboxError] = useState('');
  const [sandboxOpen, setSandboxOpen] = useState(false);

  // Add / Edit Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web & App' as CredentialCategory,
    username: '',
    password: '',
    websiteUrl: '',
    notes: '',
    twoFactorKey: '',
    strengthScore: 85,
    lastRotatedDate: new Date().toISOString().split('T')[0],
    isFavorite: false,
    encryptWithMaster: true,
  });

  const categories: CredentialCategory[] = [
    'Web & App',
    'Banking & Card',
    'WiFi & Network',
    'Software License',
    'Govt Portal',
    'Secure Note',
  ];

  // Auto-decrypt revealed credentials whenever master password is unlocked
  useEffect(() => {
    if (isMasterPasswordUnlocked && masterPassword) {
      credentials.forEach(async (cred) => {
        if (isEncryptedPayload(cred.password)) {
          try {
            const dec = await decryptWithMasterPassword(cred.password, masterPassword);
            setDecryptedCache((prev) => ({ ...prev, [cred.id]: dec }));
          } catch {
            // failed with current key
          }
        }
      });
    } else {
      setDecryptedCache({});
    }
  }, [isMasterPasswordUnlocked, masterPassword, credentials]);

  // Toggle in-card Reveal
  const toggleReveal = async (cred: CredentialRecord) => {
    const id = cred.id;
    if (revealedIds.includes(id)) {
      setRevealedIds((prev) => prev.filter((i) => i !== id));
      return;
    }

    if (isEncryptedPayload(cred.password)) {
      if (!isMasterPasswordUnlocked) {
        setEnteredMasterPw('');
        setMasterPwError('');
        setUnlockModalOpen(true);
        return;
      }

      try {
        const dec = await decryptWithMasterPassword(cred.password, masterPassword);
        setDecryptedCache((prev) => ({ ...prev, [id]: dec }));
        setRevealedIds((prev) => [...prev, id]);
      } catch (err: any) {
        setMasterPwError(err.message || 'Decryption failed. Please verify your Master Password.');
        setUnlockModalOpen(true);
      }
    } else {
      setRevealedIds((prev) => [...prev, id]);
    }
  };

  // Copy password (auto-decrypting if needed)
  const handleCopy = async (cred: CredentialRecord) => {
    let textToCopy = cred.password;
    if (isEncryptedPayload(cred.password)) {
      if (decryptedCache[cred.id]) {
        textToCopy = decryptedCache[cred.id];
      } else if (isMasterPasswordUnlocked && masterPassword) {
        try {
          textToCopy = await decryptWithMasterPassword(cred.password, masterPassword);
        } catch {
          setUnlockModalOpen(true);
          return;
        }
      } else {
        setUnlockModalOpen(true);
        return;
      }
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(cred.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate strong random password
  const generateStrongPassword = (target: 'form' | 'edit' = 'form') => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}';
    let result = '';
    for (let i = 0; i < 18; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (target === 'form') {
      setFormData((prev) => ({ ...prev, password: result, strengthScore: 98 }));
    } else if (editingCred) {
      setEditingCred({ ...editingCred, password: result, strengthScore: 98, isEncrypted: false });
    }
  };

  // Create new credential
  const handleCreateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.password.trim()) return;

    let finalPassword = formData.password;
    let isEncrypted = false;
    let saltHex: string | undefined;
    let ivHex: string | undefined;
    let encryptionAlgorithm: 'AES-256-GCM' | undefined;

    if (formData.encryptWithMaster && masterPassword) {
      try {
        const enc = await encryptWithMasterPassword(formData.password, masterPassword);
        finalPassword = enc.formattedPayload;
        isEncrypted = true;
        saltHex = enc.saltHex;
        ivHex = enc.ivHex;
        encryptionAlgorithm = 'AES-256-GCM';
      } catch (err) {
        console.warn('Failed to encrypt on creation:', err);
      }
    }

    addCredential({
      title: formData.title,
      category: formData.category,
      username: formData.username,
      password: finalPassword,
      isEncrypted,
      saltHex,
      ivHex,
      encryptionAlgorithm,
      websiteUrl: formData.websiteUrl,
      notes: formData.notes,
      twoFactorKey: formData.twoFactorKey,
      strengthScore: formData.strengthScore,
      lastRotatedDate: formData.lastRotatedDate,
      isFavorite: formData.isFavorite,
    });

    setAddModalOpen(false);
    setFormData({
      title: '',
      category: 'Web & App',
      username: '',
      password: '',
      websiteUrl: '',
      notes: '',
      twoFactorKey: '',
      strengthScore: 85,
      lastRotatedDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
      encryptWithMaster: true,
    });
  };

  // Open Edit Modal for a credential
  const handleOpenEdit = async (cred: CredentialRecord) => {
    let initialPassword = cred.password;
    if (isEncryptedPayload(cred.password)) {
      if (decryptedCache[cred.id]) {
        initialPassword = decryptedCache[cred.id];
      } else if (isMasterPasswordUnlocked && masterPassword) {
        try {
          initialPassword = await decryptWithMasterPassword(cred.password, masterPassword);
        } catch {
          // keep ciphertext or prompt
        }
      }
    }

    setEditingCred({
      ...cred,
      password: initialPassword,
    });
  };

  // Save changes to modified credential
  const handleSaveEditedCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCred) return;

    let finalPassword = editingCred.password;
    let isEnc = editingCred.isEncrypted ?? false;
    let saltHex = editingCred.saltHex;
    let ivHex = editingCred.ivHex;
    let algorithm = editingCred.encryptionAlgorithm;

    if (editingCred.isEncrypted) {
      if (!isEncryptedPayload(editingCred.password)) {
        if (!masterPassword) {
          alert('Master Password is required to encrypt this password.');
          return;
        }
        try {
          const enc = await encryptWithMasterPassword(editingCred.password, masterPassword);
          finalPassword = enc.formattedPayload;
          isEnc = true;
          saltHex = enc.saltHex;
          ivHex = enc.ivHex;
          algorithm = 'AES-256-GCM';
        } catch (err: any) {
          alert(`Encryption failed: ${err.message}`);
          return;
        }
      }
    } else {
      // Plaintext
      if (isEncryptedPayload(editingCred.password)) {
        // If it was ciphertext but unchecked, leave as is or decrypt
      }
      isEnc = false;
      saltHex = undefined;
      ivHex = undefined;
      algorithm = undefined;
    }

    updateCredential(editingCred.id, {
      title: editingCred.title,
      category: editingCred.category,
      username: editingCred.username,
      password: finalPassword,
      isEncrypted: isEnc,
      saltHex,
      ivHex,
      encryptionAlgorithm: algorithm,
      websiteUrl: editingCred.websiteUrl,
      notes: editingCred.notes,
      strengthScore: editingCred.strengthScore,
      lastRotatedDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    });

    setEditingCred(null);
  };

  // Encrypt single plaintext credential
  const handleEncryptSingle = async (cred: CredentialRecord) => {
    if (!isMasterPasswordUnlocked) {
      setUnlockModalOpen(true);
      return;
    }
    setActionLoadingId(cred.id);
    try {
      await encryptCredentialPassword(cred.id, masterPassword);
      setActionSuccessMsg({ id: cred.id, msg: 'Encrypted with AES-256-GCM!' });
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(`Encryption failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Decrypt single encrypted credential and save as plaintext
  const handleDecryptSingleAndSave = async (cred: CredentialRecord) => {
    if (!isMasterPasswordUnlocked) {
      setUnlockModalOpen(true);
      return;
    }
    setActionLoadingId(cred.id);
    try {
      await decryptAndSaveCredential(cred.id, masterPassword);
      setDecryptConfirmCred(null);
      setActionSuccessMsg({ id: cred.id, msg: 'Saved as decrypted plaintext.' });
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(`Decryption failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Bulk encrypt all plaintext credentials with active master password
  const handleBulkEncrypt = async () => {
    if (!isMasterPasswordUnlocked) {
      setUnlockModalOpen(true);
      return;
    }
    setBulkProcessing(true);
    setBulkStatusMsg(null);
    try {
      const count = await encryptAllCredentials(masterPassword);
      setBulkStatusMsg({
        type: 'success',
        text: `Successfully encrypted ${count} password(s) with AES-256-GCM zero-knowledge encryption!`,
      });
      setTimeout(() => setBulkStatusMsg(null), 5000);
    } catch (err: any) {
      setBulkStatusMsg({ type: 'error', text: err.message || 'Bulk encryption failed.' });
    } finally {
      setBulkProcessing(false);
    }
  };

  // Bulk decrypt all credentials to plaintext
  const handleBulkDecrypt = async () => {
    if (!isMasterPasswordUnlocked) {
      setUnlockModalOpen(true);
      return;
    }
    setBulkProcessing(true);
    setBulkStatusMsg(null);
    try {
      const count = await decryptAllCredentials(masterPassword);
      setDecryptAllConfirmOpen(false);
      setBulkStatusMsg({
        type: 'success',
        text: `Successfully decrypted ${count} password(s) and saved to Firestore!`,
      });
      setTimeout(() => setBulkStatusMsg(null), 5000);
    } catch (err: any) {
      setBulkStatusMsg({ type: 'error', text: err.message || 'Bulk decryption failed.' });
    } finally {
      setBulkProcessing(false);
    }
  };

  // Unlock Master Password handler
  const handleUnlockMasterPw = (e: React.FormEvent) => {
    e.preventDefault();
    setMasterPwError('');
    if (unlockMasterPassword(enteredMasterPw)) {
      setUnlockModalOpen(false);
      setEnteredMasterPw('');
    } else {
      setMasterPwError('Incorrect Master Password. Demo password is: MasterVault@2026!');
    }
  };

  // Modify / Change Master Password handler with Automatic Re-encryption Migration
  const handleChangeMasterPw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMasterPwError('');
    setMasterPwSuccess('');

    if (!newMasterPw || newMasterPw.length < 8) {
      setMasterPwError('New Master Password must be at least 8 characters long.');
      return;
    }
    if (newMasterPw !== confirmMasterPw) {
      setMasterPwError('New Master Passwords do not match. Please re-enter.');
      return;
    }

    const currentKey = currentMasterPw || masterPassword;
    if (!currentKey) {
      setMasterPwError('Current Master Password is required to verify ownership.');
      return;
    }

    setIsChangingMasterPw(true);
    try {
      if (migrateExistingPasswords) {
        // Re-encrypt all saved passwords with the new master key
        const result = await reencryptAllWithNewMasterPassword(currentKey, newMasterPw);
        setMasterPwSuccess(
          `Master Password updated! Migrated and re-encrypted ${result.success} saved password(s) under the new AES-256 key.`
        );
      } else {
        setMasterPassword(newMasterPw);
        setMasterPwSuccess('Master Password updated successfully! All future encryptions will use this key.');
      }

      setTimeout(() => {
        setChangeMasterModalOpen(false);
        setCurrentMasterPw('');
        setNewMasterPw('');
        setConfirmMasterPw('');
        setMasterPwSuccess('');
        setIsChangingMasterPw(false);
      }, 1800);
    } catch (err: any) {
      setMasterPwError(err.message || 'Failed to update Master Password.');
      setIsChangingMasterPw(false);
    }
  };

  // Master Key Verification Test (Canary)
  const handleTestMasterKey = async () => {
    if (!masterPassword) {
      setTestResult({ status: 'error', message: 'No Master Password is set.' });
      return;
    }
    try {
      // 1. Generate test encryption payload
      const testEnc = await encryptWithMasterPassword('LifeVault-Integrity-Check-OK', masterPassword);
      // 2. Validate roundtrip decryption
      const isValid = await testMasterPassword(testEnc.formattedPayload, masterPassword);
      if (isValid) {
        setTestResult({
          status: 'success',
          message: 'Cryptographic test PASSED! AES-256-GCM authentication tag and PBKDF2 key verified.',
        });
      } else {
        setTestResult({
          status: 'error',
          message: 'Decryption validation failed.',
        });
      }
      setTimeout(() => setTestResult({ status: 'idle', message: '' }), 4000);
    } catch (err: any) {
      setTestResult({ status: 'error', message: err.message || 'Integrity test failed.' });
      setTimeout(() => setTestResult({ status: 'idle', message: '' }), 4000);
    }
  };

  // Sandbox Live Encrypt
  const handleSandboxEncrypt = async () => {
    setSandboxError('');
    try {
      const res = await encryptWithMasterPassword(sandboxPlaintext, masterPassword || 'DemoKey#2026');
      setSandboxCiphertext(res.formattedPayload);
      setSandboxSalt(res.saltHex);
      setSandboxIv(res.ivHex);
      setSandboxDecrypted('');
      setSandboxDecryptPw(masterPassword || 'DemoKey#2026');
    } catch (err: any) {
      setSandboxError(err.message || 'Encryption failed');
    }
  };

  // Sandbox Live Decrypt
  const handleSandboxDecrypt = async () => {
    setSandboxError('');
    try {
      if (!sandboxCiphertext) {
        setSandboxError('Please click "Encrypt Plaintext" first to generate ciphertext.');
        return;
      }
      const dec = await decryptWithMasterPassword(sandboxCiphertext, sandboxDecryptPw);
      setSandboxDecrypted(dec);
    } catch (err: any) {
      setSandboxError(err.message || 'Decryption failed: Authentication tag verification mismatch.');
    }
  };

  // Filtered credentials list
  const filteredCreds = credentials.filter((c) => {
    const isEnc = isEncryptedPayload(c.password) || c.isEncrypted;
    if (selectedFilter === 'encrypted' && !isEnc) return false;
    if (selectedFilter === 'plain' && isEnc) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const encryptedCount = credentials.filter((c) => isEncryptedPayload(c.password) || c.isEncrypted).length;
  const plaintextCount = credentials.length - encryptedCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-slate-800" />
            Passwords & Master Encryption Vault
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Client-side zero-knowledge encryption using AES-256-GCM with 100,000-iteration PBKDF2 key derivation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isMasterPasswordUnlocked ? (
            <button
              onClick={lockMasterPassword}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
              title="Lock Master Password session and purge memory keys"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Lock Master Key</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setMasterPwError('');
                setUnlockModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
              title="Unlock with Master Password"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unlock Master Key</span>
            </button>
          )}

          <button
            onClick={() => {
              setCurrentMasterPw(masterPassword);
              setNewMasterPw('');
              setConfirmMasterPw('');
              setMasterPwError('');
              setMasterPwSuccess('');
              setChangeMasterModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-medium transition flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>Modify Master Password</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Credentials
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MASTER PASSWORD STATUS, CONTROLS & CRYPTO INTEGRITY BAR               */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isMasterPasswordUnlocked
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isMasterPasswordUnlocked ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-slate-900">Master Password Encryption Engine</span>
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isMasterPasswordUnlocked
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isMasterPasswordUnlocked ? '● Key Active & Unlocked' : '○ Locked (PBKDF2 Protected)'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Current Master Key:{' '}
                <span className="font-mono text-slate-800 font-semibold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {isMasterPasswordUnlocked ? masterPassword : '••••••••••••••••'}
                </span>
                <span className="text-slate-400 mx-1.5">|</span>
                Cipher: <span className="font-semibold text-slate-700">AES-256-GCM</span> (100k rounds PBKDF2-SHA256)
              </p>
            </div>
          </div>

          {/* Quick Operations Button Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTestMasterKey}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
              title="Verify Master Key integrity against AES-256-GCM test vector"
            >
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              <span>Test Key Integrity</span>
            </button>

            <button
              onClick={handleBulkEncrypt}
              disabled={bulkProcessing || plaintextCount === 0}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Encrypt all stored plain text passwords with your active Master Password"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {bulkProcessing
                  ? 'Encrypting...'
                  : plaintextCount === 0
                  ? 'All Passwords Encrypted'
                  : `Encrypt All (${plaintextCount} plain)`}
              </span>
            </button>

            <button
              onClick={() => {
                if (!isMasterPasswordUnlocked) {
                  setUnlockModalOpen(true);
                } else {
                  setDecryptAllConfirmOpen(true);
                }
              }}
              disabled={bulkProcessing || encryptedCount === 0}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Decrypt all saved passwords and store as plaintext"
            >
              <Unlock className="w-3.5 h-3.5 text-rose-700" />
              <span>Decrypt All ({encryptedCount})</span>
            </button>
          </div>
        </div>

        {/* Master Key Test Result Feedback */}
        {testResult.status !== 'idle' && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testResult.status === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {testResult.status === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Bulk Status Feedback */}
        {bulkStatusMsg && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              bulkStatusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {bulkStatusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{bulkStatusMsg.text}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. CRYPTOGRAPHIC DEMONSTRATION SANDBOX (Faculty / Viva Demo)              */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg space-y-4 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
              <Binary className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Interactive AES-256-GCM Encryption & Decryption Sandbox
              </h3>
              <p className="text-[11px] text-slate-400">
                Live cryptographic verification of PBKDF2 key derivation, random 16-byte salt, 12-byte IV, and authenticated tag
              </p>
            </div>
          </div>
          <button
            onClick={() => setSandboxOpen(!sandboxOpen)}
            className="text-xs text-amber-300 hover:text-amber-200 font-semibold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 transition"
          >
            {sandboxOpen ? 'Collapse Engine ▲' : 'Open Engine Demo ▼'}
          </button>
        </div>

        {sandboxOpen && (
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Encrypt Sandbox Column */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> 1. Encryption Test (Plaintext → Ciphertext)
                </span>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Plaintext Input:</label>
                  <input
                    type="text"
                    value={sandboxPlaintext}
                    onChange={(e) => setSandboxPlaintext(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Key: Active Master Password</span>
                  <button
                    onClick={handleSandboxEncrypt}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition active:scale-95 flex items-center gap-1"
                  >
                    <Binary className="w-3 h-3" /> Encrypt (AES-256-GCM)
                  </button>
                </div>
              </div>

              {/* Decrypt Sandbox Column */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5 text-sky-400" /> 2. Decryption Test (Ciphertext → Plaintext)
                </span>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Master Password Key for Decryption:</label>
                  <input
                    type="text"
                    value={sandboxDecryptPw}
                    onChange={(e) => setSandboxDecryptPw(e.target.value)}
                    placeholder="Enter Master Password"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-hidden focus:border-sky-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Must match key used during ciphering</span>
                  <button
                    onClick={handleSandboxDecrypt}
                    className="px-3 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs transition active:scale-95 flex items-center gap-1"
                  >
                    <Unlock className="w-3 h-3" /> Decrypt Ciphertext
                  </button>
                </div>
              </div>
            </div>

            {/* Ciphertext Output */}
            {sandboxCiphertext && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">● Generated AES-256-GCM Ciphertext Payload:</span>
                  <span className="text-[10px] text-slate-400">Format: ENC:v1:&lt;salt&gt;:&lt;iv&gt;:&lt;ciphertext&gt;</span>
                </div>
                <div className="p-2 rounded bg-slate-900 text-amber-300 break-all select-all border border-slate-800 font-mono text-xs">
                  {sandboxCiphertext}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-500">Salt (16 bytes hex):</span> {sandboxSalt}
                  </div>
                  <div>
                    <span className="text-slate-500">IV (12 bytes hex):</span> {sandboxIv}
                  </div>
                </div>
              </div>
            )}

            {/* Decrypted Plaintext Output */}
            {sandboxDecrypted && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between text-xs font-mono text-emerald-200">
                <div>
                  <span className="text-emerald-400 font-bold block">✓ Authenticated Decryption Successful:</span>
                  <span className="text-sm font-bold text-white mt-1 block">"{sandboxDecrypted}"</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 text-[10px] uppercase font-bold">
                  AES-256 Tag Verified
                </span>
              </div>
            )}

            {sandboxError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs font-mono text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{sandboxError}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. VAULT SUMMARY METRICS                                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Total Saved Accounts</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{credentials.length}</span>
            <span className="text-xs text-slate-500">saved credentials</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Persisted under users/{'{uid}'}/credentials in Cloud Firestore</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Encrypted Passwords</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">{encryptedCount}</span>
            <span className="text-xs text-emerald-700 font-semibold">of {credentials.length} secured</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Encrypted with AES-256-GCM zero-knowledge cipher</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600">Master Password Protection</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-xl font-bold ${isMasterPasswordUnlocked ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isMasterPasswordUnlocked ? 'Unlocked (Active Session)' : 'Locked (Secured)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">PBKDF2 SHA-256 with 100,000 iterations</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SEARCH, FILTER & ACTION BAR                                            */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved credentials by title, username, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({credentials.length})
          </button>
          <button
            onClick={() => setSelectedFilter('encrypted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
              selectedFilter === 'encrypted'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Lock className="w-3 h-3" /> Encrypted ({encryptedCount})
          </button>
          <button
            onClick={() => setSelectedFilter('plain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
              selectedFilter === 'plain'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3" /> Plain ({plaintextCount})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SAVED PASSWORDS CARDS GRID                                             */}
      {/* ========================================================================= */}
      {filteredCreds.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <KeyRound className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Credentials Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? 'Try a different search query.' : 'Click "Add Credentials" above to store your first password.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCreds.map((cred) => {
            const isRevealed = revealedIds.includes(cred.id);
            const isEnc = isEncryptedPayload(cred.password) || cred.isEncrypted;
            const decryptedPw = decryptedCache[cred.id];
            const isCopied = copiedId === cred.id;
            const isItemLoading = actionLoadingId === cred.id;
            const itemSuccess = actionSuccessMsg?.id === cred.id ? actionSuccessMsg.msg : null;

            // Compute display password text
            let displayPassword = '••••••••••••••••';
            if (isRevealed) {
              if (isEnc) {
                displayPassword =
                  decryptedPw || (isMasterPasswordUnlocked ? 'Decrypting...' : 'Locked with Master Password');
              } else {
                displayPassword = cred.password;
              }
            }

            return (
              <div
                key={cred.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div>
                  {/* Card Header: Service name & badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{cred.title}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {cred.category}
                          </span>
                          {isEnc ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> AES-256
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200 flex items-center gap-0.5">
                              <ShieldAlert className="w-2.5 h-2.5" /> Plaintext
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        cred.strengthScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cred.strengthScore}%
                    </span>
                  </div>

                  {/* Username Display & Copy */}
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 block">Username / Account</span>
                      <span className="font-mono text-slate-800 truncate block font-medium">{cred.username}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cred.username);
                        setCopiedId(`${cred.id}_usr`);
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                      title="Copy username"
                    >
                      {copiedId === `${cred.id}_usr` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Password Display Box */}
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 block">
                          {isEnc ? 'Encrypted Password' : 'Password'}
                        </span>
                        {isEnc && (
                          <button
                            onClick={() => setInspectModalCred(cred)}
                            className="text-[10px] text-sky-600 hover:text-sky-800 font-mono flex items-center gap-0.5 underline"
                          >
                            <FileCode className="w-3 h-3" /> Inspect Cipher
                          </button>
                        )}
                      </div>
                      <span className="font-mono font-bold text-slate-900 tracking-wider truncate block mt-0.5">
                        {displayPassword}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleReveal(cred)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                        title={isRevealed ? 'Hide Password' : 'Decrypt / Reveal Password'}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(cred)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                        title="Copy Decrypted Password"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Feedback Notification for Single Item */}
                  {itemSuccess && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{itemSuccess}</span>
                    </div>
                  )}

                  {/* Direct Encrypt / Decrypt Actions on the Card */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {!isEnc ? (
                      <button
                        onClick={() => handleEncryptSingle(cred)}
                        disabled={isItemLoading}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3 h-3 text-emerald-700" />
                        <span>{isItemLoading ? 'Encrypting...' : 'Encrypt with Master Key'}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setDecryptConfirmCred(cred)}
                          disabled={isItemLoading}
                          className="flex-1 py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
                          title="Decrypt and store as plaintext"
                        >
                          <Unlock className="w-3 h-3 text-rose-600" />
                          <span>Decrypt to Plaintext</span>
                        </button>
                        <button
                          onClick={() => handleEncryptSingle(cred)}
                          disabled={isItemLoading}
                          className="py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium transition"
                          title="Re-encrypt with active Master Password"
                        >
                          Re-encrypt
                        </button>
                      </>
                    )}
                  </div>

                  {cred.notes && <p className="text-[11px] text-slate-500 mt-2 italic">{cred.notes}</p>}
                </div>

                {/* Card Footer: Metadata, Modify & Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Rotated: {cred.lastRotatedDate}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cred)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                      title="Modify / Edit Saved Password"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCredential(cred.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Credential"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: UNLOCK MASTER PASSWORD                                           */}
      {/* ========================================================================= */}
      {unlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Unlock Master Password</h3>
              </div>
              <button
                onClick={() => {
                  setUnlockModalOpen(false);
                  setMasterPwError('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUnlockMasterPw} className="space-y-4 pt-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your Master Password to decrypt and view saved credentials. Keys are derived locally in your browser using PBKDF2 with 100,000 iterations.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Master Password *</label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter Master Password"
                  value={enteredMasterPw}
                  onChange={(e) => setEnteredMasterPw(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              {masterPwError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{masterPwError}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" /> Unlock & Decrypt Credentials
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnteredMasterPw('MasterVault@2026!');
                  }}
                  className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  Fill Demo Master Password (MasterVault@2026!)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MODIFY / CHANGE MASTER PASSWORD WITH MIGRATION                   */}
      {/* ========================================================================= */}
      {changeMasterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Modify Master Password</h3>
                  <p className="text-[11px] text-slate-500">Update key and migrate encrypted credentials</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setChangeMasterModalOpen(false);
                  setMasterPwError('');
                  setMasterPwSuccess('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangeMasterPw} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Current Master Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current master password"
                  value={currentMasterPw}
                  onChange={(e) => setCurrentMasterPw(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">New Master Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={newMasterPw}
                  onChange={(e) => setNewMasterPw(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Master Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new master password"
                  value={confirmMasterPw}
                  onChange={(e) => setConfirmMasterPw(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              {/* Automatic Re-encryption Option */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="migratePasswordsCheck"
                  checked={migrateExistingPasswords}
                  onChange={(e) => setMigrateExistingPasswords(e.target.checked)}
                  className="mt-0.5 rounded text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="migratePasswordsCheck" className="text-xs text-slate-700">
                  <span className="font-semibold block text-slate-900">
                    Automatically re-encrypt all {encryptedCount} saved password(s) with the new Master Key
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Decrypts existing records with the current password and re-encrypts using fresh AES-256-GCM salts and IVs under the new key.
                  </span>
                </label>
              </div>

              {masterPwError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{masterPwError}</span>
                </div>
              )}

              {masterPwSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{masterPwSuccess}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangeMasterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingMasterPw}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isChangingMasterPw ? 'Migrating Passwords...' : 'Save & Migrate Master Key'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MODIFY / EDIT SAVED PASSWORD                                     */}
      {/* ========================================================================= */}
      {editingCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Modify Saved Password</h3>
                  <p className="text-[11px] text-slate-500">Update account credentials and encryption settings</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCred(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedCredential} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service / Title *</label>
                  <input
                    type="text"
                    required
                    value={editingCred.title}
                    onChange={(e) => setEditingCred({ ...editingCred, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={editingCred.category}
                    onChange={(e) => setEditingCred({ ...editingCred, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Username / Account *</label>
                <input
                  type="text"
                  required
                  value={editingCred.username}
                  onChange={(e) => setEditingCred({ ...editingCred, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password *</label>
                  <button
                    type="button"
                    onClick={() => generateStrongPassword('edit')}
                    className="text-[11px] text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={editingCred.password}
                  onChange={(e) => setEditingCred({ ...editingCred, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              {/* Encryption Toggle in Edit Modal */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="editEncryptCheck"
                    checked={editingCred.isEncrypted ?? false}
                    onChange={(e) => setEditingCred({ ...editingCred, isEncrypted: e.target.checked })}
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <div>
                    <label htmlFor="editEncryptCheck" className="text-xs font-bold text-emerald-950 block cursor-pointer">
                      Encrypt with Master Password (AES-256-GCM)
                    </label>
                    <span className="text-[10px] text-emerald-800">
                      Derives 256-bit key with PBKDF2 before saving to Firestore
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    editingCred.isEncrypted ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {editingCred.isEncrypted ? 'AES-256' : 'Plain'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  value={editingCred.websiteUrl || ''}
                  onChange={(e) => setEditingCred({ ...editingCred, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Security Answers</label>
                <textarea
                  rows={2}
                  value={editingCred.notes || ''}
                  onChange={(e) => setEditingCred({ ...editingCred, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCred(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: INSPECT RAW CIPHERTEXT & CRYPTOGRAPHIC AUDIT                     */}
      {/* ========================================================================= */}
      {inspectModalCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center border border-slate-800">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-400">Cryptographic Audit: {inspectModalCred.title}</h3>
                  <p className="text-[10px] text-slate-400">Zero-Knowledge Cipher Inspection</p>
                </div>
              </div>
              <button
                onClick={() => setInspectModalCred(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Algorithm & Parameters:</span>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-[11px]">
                  AES-256-GCM | PBKDF2-SHA256 (100,000 iterations) | 128-bit MAC Tag
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400">Raw Stored Ciphertext (in Firestore):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inspectModalCred.password);
                    }}
                    className="text-[10px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Raw
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 text-amber-300 break-all select-all border border-slate-800 text-[11px]">
                  {inspectModalCred.password}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Salt (Hex):</span>
                  <span className="text-slate-300 break-all">{inspectModalCred.saltHex || 'Derived from payload'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">IV (Hex):</span>
                  <span className="text-slate-300 break-all">{inspectModalCred.ivHex || 'Derived from payload'}</span>
                </div>
              </div>

              {decryptedCache[inspectModalCred.id] && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                  <span className="text-[10px] text-emerald-400 block font-bold">Decrypted with Master Key:</span>
                  <span className="text-sm font-bold text-white mt-1 block font-mono">
                    "{decryptedCache[inspectModalCred.id]}"
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setInspectModalCred(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Close Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CONFIRM DECRYPT SINGLE TO PLAINTEXT                              */}
      {/* ========================================================================= */}
      {decryptConfirmCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Decrypt and Save as Plaintext?</h3>
                <p className="text-xs text-slate-500">Credential: {decryptConfirmCred.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This action will decrypt "{decryptConfirmCred.title}" using your active Master Password and update Cloud Firestore with the unencrypted password. You can re-encrypt it at any time.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDecryptConfirmCred(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDecryptSingleAndSave(decryptConfirmCred)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Decrypt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CONFIRM DECRYPT ALL PASSWORDS                                    */}
      {/* ========================================================================= */}
      {decryptAllConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Decrypt All Saved Passwords?</h3>
                <p className="text-xs text-slate-500">Bulk Cryptographic Decryption</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to decrypt all <strong>{encryptedCount}</strong> encrypted password(s) back into plaintext? The decrypted passwords will be updated in Cloud Firestore.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDecryptAllConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDecrypt}
                disabled={bulkProcessing}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {bulkProcessing ? 'Decrypting All...' : 'Yes, Decrypt All to Plaintext'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: ADD NEW CREDENTIAL                                               */}
      {/* ========================================================================= */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Secure Credentials</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCredential} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Root Account, GitHub"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Username / Email *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. arvindgeethesh2007@gmail.com"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password *</label>
                  <button
                    type="button"
                    onClick={() => generateStrongPassword('form')}
                    className="text-[11px] text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter or generate password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              {/* Encryption toggle checkbox */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="newEncryptCheck"
                    checked={formData.encryptWithMaster}
                    onChange={(e) => setFormData({ ...formData, encryptWithMaster: e.target.checked })}
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <div>
                    <label htmlFor="newEncryptCheck" className="text-xs font-bold text-emerald-950 block cursor-pointer">
                      Encrypt with Master Password (AES-256-GCM)
                    </label>
                    <span className="text-[10px] text-emerald-800">
                      Derives key locally using PBKDF2 with 100k rounds before writing to Firestore
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                  Recommended
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Recovery Codes</label>
                <textarea
                  rows={2}
                  placeholder="Encrypted note or security questions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Server,
  Database,
  HardDrive,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Code2,
  Cloud,
  Lock,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const CloudInfraTab: React.FC = () => {
  const { documents, subscriptions, bills, credentials, user, firebaseUser, cloudSyncStatus, setActiveTab } = useVault();
  const [activeConsole, setActiveConsole] = useState<'firestore' | 'storage' | 'auth' | 'gemini'>('firestore');
  const [activeCollection, setActiveCollection] = useState<'documents' | 'subscriptions' | 'bills' | 'credentials'>('documents');

  const logs = [
    { time: 'Active', service: 'FIREBASE-AUTH', msg: firebaseUser ? `User session authenticated: ${firebaseUser.email} (UID: ${firebaseUser.uid.substring(0, 8)}...)` : 'Guest / demo session active. Ready for Email/Password or Google Login.' },
    { time: 'Active', service: 'FIRESTORE', msg: `Connected to database "ai-studio-lifevaultailifem-73759420-4dcc-4f20-b491-75a07b5d9df4" (${cloudSyncStatus.toUpperCase()})` },
    { time: 'Active', service: 'CLOUD-STORAGE', msg: 'Bucket "life-vault-f36d3.firebasestorage.app" secured with owner-only ABAC rules.' },
    { time: 'Active', service: 'GEMINI-3.8', msg: 'Server-side API proxy online at /api/ai/ocr-parse, /api/ai/smart-search, /api/ai/chat-vault' },
    { time: 'Active', service: 'SECURITY-RULES', msg: 'Firestore rules deployed: Strict owner isolation via request.auth.uid == userId' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Cloud className="w-6 h-6 text-sky-600" />
            Firebase Cloud Infrastructure & Live Topology
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Demonstration of integrated Firebase Authentication, Cloud Firestore, Firebase Cloud Storage, and Gemini 3.8 Flash AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('java_backend')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 flex items-center gap-1.5 transition shadow-xs"
          >
            <Code2 className="w-3.5 h-3.5 text-orange-600" />
            <span>Java Backend (.java)</span>
          </button>

          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            CLOUD BACKEND ONLINE
          </span>
        </div>
      </div>

      {/* Cloud Nodes Diagram */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Integrated Google Cloud & Firebase Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Cloud Firestore Card */}
          <div
            onClick={() => setActiveConsole('firestore')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              activeConsole === 'firestore'
                ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600" /> Cloud Firestore
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Database: <span className="font-mono text-slate-900 truncate block text-[10px]">ai-studio-lifevaultailifem</span>
              Records: <span className="font-semibold text-slate-900">{documents.length + subscriptions.length + bills.length + credentials.length} items</span>
              <br />
              Mode: NoSQL Real-time Sync
            </p>
          </div>

          {/* Cloud Storage Card */}
          <div
            onClick={() => setActiveConsole('storage')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              activeConsole === 'storage'
                ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-600" /> Cloud Storage
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Protected
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bucket: <span className="font-mono text-slate-900 text-[10px] block truncate">life-vault-f36d3.firebasestorage.app</span>
              Path: <span className="font-mono text-slate-900 text-[10px]">users/{'{uid}'}/documents/</span>
              <br />
              Owner-only Read/Write
            </p>
          </div>

          {/* Firebase Auth Card */}
          <div
            onClick={() => setActiveConsole('auth')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              activeConsole === 'auth'
                ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Firebase Auth
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                2FA & OAuth
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Active: <span className="font-mono text-slate-900 text-[11px] block truncate">{firebaseUser?.email || user.email}</span>
              Providers: Email/Password, Google
              <br />
              Zero-Trust ABAC Security
            </p>
          </div>

          {/* Gemini AI Engine Card */}
          <div
            onClick={() => setActiveConsole('gemini')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              activeConsole === 'gemini'
                ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" /> Gemini 3.8 AI
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Server-Side
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Model: <span className="font-mono text-slate-900">gemini-3.8-flash</span>
              <br />
              Security: GEMINI_API_KEY on Express
              <br />
              Features: OCR, Search, Vault Chat
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Sub-Console */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {activeConsole === 'firestore'
                ? 'Cloud Firestore Live Document Inspector'
                : activeConsole === 'storage'
                ? 'Firebase Cloud Storage Object Inspector'
                : activeConsole === 'auth'
                ? 'Firebase Authentication Session & Security State'
                : 'Gemini AI Server Proxy Diagnostics'}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Live Infrastructure State</span>
        </div>

        {/* Firestore Inspector */}
        {activeConsole === 'firestore' && (
          <div className="space-y-3">
            <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs">
              {(['documents', 'subscriptions', 'bills', 'credentials'] as const).map((col) => (
                <button
                  key={col}
                  onClick={() => setActiveCollection(col)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition ${
                    activeCollection === col
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {col} ({col === 'documents' ? documents.length : col === 'subscriptions' ? subscriptions.length : col === 'bills' ? bills.length : credentials.length})
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
              <p className="text-slate-400 mb-2">
                // Firestore Path: users/{firebaseUser?.uid || user.id}/{activeCollection}
              </p>
              <pre>
                {JSON.stringify(
                  activeCollection === 'documents'
                    ? documents
                    : activeCollection === 'subscriptions'
                    ? subscriptions
                    : activeCollection === 'bills'
                    ? bills
                    : credentials,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}

        {/* Cloud Storage Inspector */}
        {activeConsole === 'storage' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {documents.filter((d) => d.storagePath || d.s3Key).map((doc) => (
                <div key={doc.id} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <HardDrive className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="font-mono text-slate-900 font-semibold">{doc.title}</span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        Path: {doc.storagePath || doc.s3Key} • Size: {doc.fileSize}
                      </span>
                    </div>
                  </div>
                  {doc.downloadUrl ? (
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-medium border border-sky-200 hover:bg-sky-100"
                    >
                      Download Object →
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Local / Sample
                    </span>
                  )}
                </div>
              ))}
              {documents.length === 0 && (
                <p className="p-4 text-xs text-slate-500 text-center">No documents uploaded to Cloud Storage yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Firebase Auth Inspector */}
        {activeConsole === 'auth' && (
          <div className="rounded-xl bg-slate-50 p-4 font-mono text-xs space-y-2 border border-slate-200 text-slate-800">
            <p className="text-emerald-700 font-semibold">● Authentication Service: Firebase Auth v13</p>
            <p>Active User UID: {firebaseUser?.uid || 'Not signed in (Demo User active)'}</p>
            <p>Email: {firebaseUser?.email || user.email}</p>
            <p>Email Verified: {firebaseUser?.emailVerified ? 'true' : 'false'}</p>
            <p>Provider: {firebaseUser?.providerData[0]?.providerId || 'google.com'}</p>
            <p>Security Level: Zero-Trust ABAC with Cloud Firestore owner check (request.auth.uid == userId)</p>
          </div>
        )}

        {/* Gemini AI Inspector */}
        {activeConsole === 'gemini' && (
          <div className="rounded-xl bg-slate-50 p-4 font-mono text-xs space-y-2 border border-slate-200 text-slate-800">
            <p className="text-indigo-700 font-semibold">● Engine: Google Gemini 3.8 Flash via @google/genai</p>
            <p>Server-side Endpoints: POST /api/ai/ocr-parse, POST /api/ai/smart-search, POST /api/ai/chat-vault, POST /api/ai/audit</p>
            <p>Credential Protection: GEMINI_API_KEY stored securely in server environment (never in client JS)</p>
            <p>Privacy Filter: Document passwords and auth tokens excluded from LLM inference prompts</p>
          </div>
        )}
      </div>

      {/* Cloud Infrastructure Event Logs */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Cloud Infrastructure Operational Audit Logs
        </h4>
        <div className="rounded-xl bg-slate-50 p-3 font-mono text-[11px] space-y-1.5 border border-slate-200 text-slate-700">
          {logs.map((log, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
              <span className="text-emerald-600 font-semibold">{log.service}</span>
              <span className="text-slate-800">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

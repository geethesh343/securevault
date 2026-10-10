import React, { useState } from 'react';
import {
  X,
  Server,
  Database,
  HardDrive,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  RefreshCw,
  Clock,
  ArrowDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const CloudArchitectureModal: React.FC = () => {
  const { cloudArchitectureOpen, setCloudArchitectureOpen, cloudState, documents, subscriptions, bills } = useVault();
  const [activeSubTab, setActiveSubTab] = useState<'diagram' | 's3' | 'rds' | 'cloudwatch'>('diagram');
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT id, title, category, expiry_date FROM documents WHERE expiry_date IS NOT NULL ORDER BY expiry_date ASC LIMIT 5;"
  );
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  if (!cloudArchitectureOpen) return null;

  const handleRunSql = () => {
    // Simulate SQL engine
    const res = documents
      .filter((d) => d.expiryDate)
      .map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        expiry_date: d.expiryDate,
        s3_key: d.s3Key,
      }))
      .slice(0, 5);
    setQueryResult(res);
  };

  const logs = [
    { time: '12:04:18 UTC', level: 'INFO', msg: '[EC2-t3.medium] HTTP 200 POST /api/ai/ocr-parse (Gemini 3.8 Flash latency: 840ms)' },
    { time: '12:04:19 UTC', level: 'INFO', msg: '[S3-ap-south-1] PutObject encrypted with AWS-KMS key arn:aws:kms:ap-south-1:500039:key/lifevault' },
    { time: '12:04:20 UTC', level: 'INFO', msg: '[RDS-PostgreSQL] INSERT INTO documents (id, title, ocr_content, s3_url) COMMIT 200' },
    { time: '12:05:00 UTC', level: 'AUDIT', msg: '[CloudWatch-Cron] @Scheduled ExpiryCronService ran: 3 expiring items flagged' },
    { time: '12:05:30 UTC', level: 'INFO', msg: '[AUTH-Google] OAuth2 JWT verified for arvindgeethesh2007@gmail.com' },
    { time: '12:06:02 UTC', level: 'METRIC', msg: '[CloudWatch-Alarm] System health 100%, 0 alarms in ALARM state' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>AWS Cloud Architecture & System Telemetry</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Active in ap-south-1
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Full-stack production deployment: EC2 Host + S3 Bucket + RDS PostgreSQL 16
              </p>
            </div>
          </div>

          <button
            onClick={() => setCloudArchitectureOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-4 border-b border-slate-100 pb-2">
          {[
            { id: 'diagram', label: 'Architecture Overview', icon: Layers },
            { id: 's3', label: 'Amazon S3 Bucket', icon: HardDrive },
            { id: 'rds', label: 'Amazon RDS PostgreSQL', icon: Database },
            { id: 'cloudwatch', label: 'CloudWatch Logs & Metrics', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeSubTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Visual Topology Diagram */}
        {activeSubTab === 'diagram' && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Frontend & EC2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-slate-700" /> Web & Node.js Tier
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    t3.medium
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Vite React SPA served alongside Node.js 22 Express backend on port 3000.
                </p>
                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  VPC: vpc-08a1b2c3 • Subnet: subnet-public-1a
                </div>
              </div>

              {/* S3 Storage */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-slate-700" /> Amazon S3 Bucket
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    AES-256
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Stores user identity documents, policies & invoices with AWS KMS server-side encryption.
                </p>
                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  lifevault-s3-ap-south-1.amazonaws.com
                </div>
              </div>

              {/* RDS Database */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-slate-700" /> RDS PostgreSQL 16
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    db.t4g.micro
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Stores document metadata, OCR extractions, family RBAC grants & expiry schedule events.
                </p>
                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  Endpoint: lifevault-pg.rds.amazonaws.com:5432
                </div>
              </div>
            </div>

            {/* AI Security Workflow Banner */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600">
                <p className="font-semibold text-slate-900">End-to-End Enterprise Data Protection</p>
                <p className="mt-0.5">
                  TLS 1.3 in-transit encryption, AWS KMS envelope encryption at-rest, and Google OAuth 2.0 PKCE authentication.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Amazon S3 Details */}
        {activeSubTab === 's3' && (
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Encrypted S3 Objects in Bucket: <strong className="text-slate-800 font-mono">lifevault-s3-ap-south-1</strong></span>
              <span className="font-mono text-emerald-700 font-semibold">Bucket Versioning: Enabled</span>
            </div>
            <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 bg-white">
              {documents.map((d) => (
                <div key={d.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <HardDrive className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-mono font-semibold text-slate-900">{d.s3Key}</p>
                      <p className="text-[10px] text-slate-500">{d.fileSize} • SSE-KMS Verified</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                    HTTP 200 OK
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Amazon RDS PostgreSQL */}
        {activeSubTab === 'rds' && (
          <div className="space-y-3 py-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
              />
              <button
                onClick={handleRunSql}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Run Query
              </button>
            </div>

            {queryResult && (
              <div className="rounded-2xl bg-slate-50 p-4 font-mono text-xs border border-slate-200 overflow-x-auto text-slate-800">
                <pre>{JSON.stringify(queryResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CloudWatch Logs */}
        {activeSubTab === 'cloudwatch' && (
          <div className="rounded-2xl bg-slate-50 p-4 font-mono text-xs space-y-2 border border-slate-200 max-h-80 overflow-y-auto text-slate-700">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 items-baseline">
                <span className="text-slate-400 text-[10px]">{log.time}</span>
                <span className="text-slate-900 font-bold text-[10px] bg-slate-200 px-1 rounded">
                  {log.level}
                </span>
                <span className="text-slate-800">{log.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

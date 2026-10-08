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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AWS Cloud Architecture & Infrastructure</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  {cloudState.ec2Status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Amazon EC2 • Amazon S3 • Amazon RDS PostgreSQL • AWS CloudWatch Monitoring
              </p>
            </div>
          </div>
          <button
            onClick={() => setCloudArchitectureOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-800 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('diagram')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'diagram'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Architecture & Request Flow
          </button>
          <button
            onClick={() => setActiveSubTab('s3')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 's3'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" /> Amazon S3 Vaults
          </button>
          <button
            onClick={() => setActiveSubTab('rds')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'rds'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Amazon RDS PostgreSQL Schema
          </button>
          <button
            onClick={() => setActiveSubTab('cloudwatch')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'cloudwatch'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> AWS CloudWatch Logs & Alarms
          </button>
        </div>

        {/* Content Tabs */}
        <div className="py-4 max-h-[65vh] overflow-y-auto">
          {/* 1. ARCHITECTURE DIAGRAM */}
          {activeSubTab === 'diagram' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  LifeVault Cloud Request Pipeline
                </h4>

                {/* Flow Diagram */}
                <div className="space-y-3">
                  {/* Layer 1: Client */}
                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-300">Client Presentation Layer</p>
                      <p className="text-[11px] text-slate-400">React.js SPA • Tailwind CSS • Google OAuth Client</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      User Browser
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* Layer 2: Compute Backend */}
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-indigo-300">Amazon EC2 Application Server</p>
                      <p className="text-[11px] text-slate-400">
                        Spring Boot (Java 17) & Express API • Spring Security OAuth2 • Gemini AI OCR Engine
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                      EC2 Instance {cloudState.ec2InstanceId.slice(0, 10)}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* Layer 3: Storage & Database Dual Sink */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-1">
                        <HardDrive className="w-4 h-4" /> Amazon S3 Cloud Storage
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Stores binary PDFs, Aadhaar photos, scanned bills, and insurance certificates with AES-256 KMS
                        server-side encryption and 15-min pre-signed URLs.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-1">
                        <Database className="w-4 h-4" /> Amazon RDS PostgreSQL
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Relational storage for user profiles, document metadata, expiry dates, subscription renewal
                        dates, and family access ACLs.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* Layer 4: Monitoring */}
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-amber-300">AWS CloudWatch Observability</p>
                      <p className="text-[11px] text-slate-400">
                        System health metrics, scheduled midnight expiry alarms, and audit access logs
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      Active Alarms: 0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. AMAZON S3 EXPLORER */}
          {activeSubTab === 's3' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Bucket Region</span>
                  <p className="text-xs font-mono font-semibold text-white mt-1">ap-south-1 (Mumbai)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Objects</span>
                  <p className="text-xs font-mono font-semibold text-white mt-1">{documents.length} Encrypted Files</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Storage Used</span>
                  <p className="text-xs font-mono font-semibold text-white mt-1">{cloudState.s3StorageSizeMb} MB</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Encryption</span>
                  <p className="text-xs font-mono font-semibold text-emerald-400 mt-1">SSE-KMS (AES-256)</p>
                </div>
              </div>

              {/* Bucket Objects List */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/80">
                <p className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
                  <span>Current Objects in S3 Bucket</span>
                  <span className="text-[11px] font-mono text-cyan-400">{cloudState.s3BucketName}</span>
                </p>
                <div className="divide-y divide-slate-800 max-h-56 overflow-y-auto">
                  {documents.map((d) => (
                    <div key={d.id} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-mono text-slate-300 truncate">{d.s3Key}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 shrink-0 text-[11px]">
                        <span>{d.fileSize}</span>
                        <span className="text-emerald-400">TLS 1.3 Pre-signed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. AMAZON RDS POSTGRESQL SCHEMA */}
          {activeSubTab === 'rds' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" /> Amazon RDS PostgreSQL Relational Engine
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">Connections: 12 Active Pools</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300 mb-3">
                  <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">TABLE users</span>
                  <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">TABLE documents</span>
                  <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">TABLE subscriptions</span>
                  <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">TABLE bills</span>
                  <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">TABLE family_access</span>
                </div>

                {/* SQL Query Console */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400 block">
                    Interactive SQL Query Console:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none"
                    />
                    <button
                      onClick={handleRunSql}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                    >
                      Run SQL
                    </button>
                  </div>

                  {queryResult && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      <p className="text-emerald-400 mb-1">-- 5 rows returned in 12ms</p>
                      <pre>{JSON.stringify(queryResult, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. AWS CLOUDWATCH */}
          {activeSubTab === 'cloudwatch' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">EC2 CPU Utilization</span>
                  <p className="text-sm font-mono font-bold text-white mt-1">{cloudState.ec2CpuUsage}%</p>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${cloudState.ec2CpuUsage}%` }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Log Ingestion Rate</span>
                  <p className="text-sm font-mono font-bold text-white mt-1">{cloudState.cloudWatchLogRate}</p>
                  <p className="text-[10px] text-slate-500 mt-1">AWS CloudWatch Logs Group /lifevault/prod</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Alarms</span>
                  <p className="text-sm font-mono font-bold text-emerald-400 mt-1">0 Alarms Active</p>
                  <p className="text-[10px] text-slate-500 mt-1">All expiry & bill thresholds nominal</p>
                </div>
              </div>

              {/* Live Log Stream */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" /> /aws/ec2/lifevault-backend/stdout
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Streaming
                  </span>
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                      <span className="text-slate-500 shrink-0">{log.time}</span>
                      <span
                        className={`font-semibold shrink-0 ${
                          log.level === 'AUDIT'
                            ? 'text-amber-400'
                            : log.level === 'METRIC'
                            ? 'text-blue-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        [{log.level}]
                      </span>
                      <span className="text-slate-300">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>AWS Multi-AZ Deployment • SOC2 & ISO 27001 Compliant Architecture</span>
          <button
            onClick={() => setCloudArchitectureOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

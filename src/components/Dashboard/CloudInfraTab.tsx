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
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const CloudInfraTab: React.FC = () => {
  const { cloudState, documents, subscriptions, bills } = useVault();
  const [activeConsole, setActiveConsole] = useState<'s3' | 'rds' | 'cloudwatch' | 'ec2'>('ec2');
  const [sqlQuery, setSqlQuery] = useState("SELECT id, title, category, expiry_date FROM documents LIMIT 5;");
  const [queryOutput, setQueryOutput] = useState<any[] | null>(null);

  const handleRunSql = () => {
    setQueryOutput(
      documents.slice(0, 5).map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        s3_key: d.s3Key,
        expiry_date: d.expiryDate || 'NULL (Lifetime)',
      }))
    );
  };

  const logs = [
    { time: '12:08:12 UTC', service: 'EC2-HOST', msg: 'Express 4.21 listening on port 3000 (0.0.0.0)' },
    { time: '12:08:15 UTC', service: 'AUTH-SVC', msg: 'Google OAuth2 Token validated via Google APIs' },
    { time: '12:08:19 UTC', service: 'GEMINI-AI', msg: 'Gemini 3.8 Flash OCR response generated (HTTP 200)' },
    { time: '12:08:22 UTC', service: 'S3-STORAGE', msg: 'KMS Encrypted PutObject: 8 objects healthy in ap-south-1' },
    { time: '12:08:25 UTC', service: 'RDS-POSTGRES', msg: 'Connection pool idle: 12 active / 100 max connections' },
    { time: '12:08:30 UTC', service: 'CLOUDWATCH', msg: 'Alarm state OK: Expiry notification threshold evaluated' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Server className="w-6 h-6 text-cyan-400" />
            AWS Cloud Architecture & Health
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Live operational status of Amazon EC2, Amazon S3, Amazon RDS PostgreSQL, and AWS CloudWatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All 4 Services Healthy
          </span>
        </div>
      </div>

      {/* 4 Cloud Nodes Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* EC2 */}
        <div
          onClick={() => setActiveConsole('ec2')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            activeConsole === 'ec2'
              ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase">Amazon EC2</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold font-mono text-white">t3.medium</p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">{cloudState.ec2InstanceId}</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">CPU Usage</span>
            <span className="font-mono text-emerald-400 font-semibold">{cloudState.ec2CpuUsage}%</span>
          </div>
        </div>

        {/* S3 */}
        <div
          onClick={() => setActiveConsole('s3')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            activeConsole === 's3'
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase">Amazon S3</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold font-mono text-white">{cloudState.s3StorageSizeMb} MB</p>
          <p className="text-[11px] text-slate-400 mt-1">{documents.length} Encrypted Objects</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Security</span>
            <span className="font-mono text-emerald-400 font-semibold">SSE-KMS</span>
          </div>
        </div>

        {/* RDS */}
        <div
          onClick={() => setActiveConsole('rds')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            activeConsole === 'rds'
              ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase">Amazon RDS</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold font-mono text-white">PostgreSQL 16</p>
          <p className="text-[11px] text-slate-400 mt-1">Multi-AZ Deployment</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Pool Connections</span>
            <span className="font-mono text-cyan-400 font-semibold">{cloudState.rdsConnections} active</span>
          </div>
        </div>

        {/* CloudWatch */}
        <div
          onClick={() => setActiveConsole('cloudwatch')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            activeConsole === 'cloudwatch'
              ? 'bg-amber-950/40 border-amber-500/60 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase">AWS CloudWatch</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold font-mono text-emerald-400">0 Alarms</p>
          <p className="text-[11px] text-slate-400 mt-1">Status: OK</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Log Ingestion</span>
            <span className="font-mono text-amber-400 font-semibold">{cloudState.cloudWatchLogRate}</span>
          </div>
        </div>
      </div>

      {/* Selected Console Deep Dive */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        {activeConsole === 'ec2' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Amazon EC2 Compute Environment</h3>
                <p className="text-xs text-slate-400">
                  Virtual server hosting Spring Boot / Express application core & Gemini AI model connector
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400">Uptime: {cloudState.ec2Uptime}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                <span className="text-slate-500 block text-[10px]">Architecture</span>
                <span className="text-white font-bold">Linux x86_64 (Ubuntu 24.04 LTS)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                <span className="text-slate-500 block text-[10px]">Cloud Region</span>
                <span className="text-white font-bold">{cloudState.ec2Region}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                <span className="text-slate-500 block text-[10px]">Security Group</span>
                <span className="text-white font-bold">sg-lifevault-prod (Port 3000, 443)</span>
              </div>
            </div>
          </div>
        )}

        {activeConsole === 's3' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Amazon S3 Encrypted Object Store</h3>
                <p className="text-xs text-slate-400">
                  Pre-signed URLs with TLS 1.3 time-limited tokens ensuring private access
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400">KMS Key: arn:aws:kms:lifevault</span>
            </div>

            <div className="divide-y divide-slate-800 max-h-60 overflow-y-auto">
              {documents.map((d) => (
                <div key={d.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-4">
                    <span className="text-cyan-400">s3://lifevault-digital-assets-prod/</span>
                    <span className="text-white">{d.s3Key}</span>
                  </div>
                  <span className="text-slate-400 shrink-0">{d.fileSize}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeConsole === 'rds' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Amazon RDS PostgreSQL SQL Query Console</h3>
                <p className="text-xs text-slate-400">
                  Structured tables for users, documents, subscriptions, and family ACL permissions
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-400">Engine: PostgreSQL 16.3</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
              />
              <button
                onClick={handleRunSql}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                Execute
              </button>
            </div>

            {queryOutput && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                <pre>{JSON.stringify(queryOutput, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {activeConsole === 'cloudwatch' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">AWS CloudWatch Live Log Ingestion</h3>
                <p className="text-xs text-slate-400">
                  Real-time monitoring stream of backend transactions and expiry cron jobs
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400">Alarm Status: Nominal</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-60 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px]">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-cyan-400">[{log.service}]</span>
                  <span className="text-slate-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

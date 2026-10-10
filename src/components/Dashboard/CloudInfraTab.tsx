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
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const CloudInfraTab: React.FC = () => {
  const { cloudState, documents, subscriptions, bills, setActiveTab } = useVault();
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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Server className="w-6 h-6 text-slate-800" />
            AWS Cloud Architecture & Health
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Live operational status of Amazon EC2, Amazon S3, Amazon RDS PostgreSQL, and AWS CloudWatch
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
            ALL AWS SERVICES HEALTHY
          </span>
        </div>
      </div>

      {/* Cloud Nodes Diagram */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Cloud Infrastructure Topology (ap-south-1 Mumbai)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* EC2 Card */}
          <div
            onClick={() => setActiveConsole('ec2')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              activeConsole === 'ec2'
                ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-700" /> Amazon EC2 Host
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Running
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instance: <span className="font-mono text-slate-900">t3.medium</span>
              <br />
              Public IP: <span className="font-mono text-slate-900">13.233.109.42</span>
              <br />
              Node.js v22 & Express Server (Port 3000)
            </p>
          </div>

          {/* S3 Card */}
          <div
            onClick={() => setActiveConsole('s3')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              activeConsole === 's3'
                ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-slate-700" /> Amazon S3 Bucket
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bucket: <span className="font-mono text-slate-900">lifevault-s3-ap-south-1</span>
              <br />
              KMS Key: <span className="font-mono text-slate-900">arn:aws:kms:lifevault</span>
              <br />
              Versioning & Server-Side Encryption (AES-256)
            </p>
          </div>

          {/* RDS Card */}
          <div
            onClick={() => setActiveConsole('rds')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              activeConsole === 'rds'
                ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-700" /> Amazon RDS PostgreSQL
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Available
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engine: <span className="font-mono text-slate-900">PostgreSQL 16.2</span>
              <br />
              Multi-AZ Replication Enabled
              <br />
              Automated daily snapshots at 02:00 UTC
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
              {activeConsole === 'rds'
                ? 'RDS PostgreSQL Query Sandbox'
                : activeConsole === 's3'
                ? 'Amazon S3 Object Explorer'
                : activeConsole === 'ec2'
                ? 'EC2 Host Runtime Diagnostics'
                : 'AWS CloudWatch Stream'}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Live Connection</span>
        </div>

        {/* If RDS Console */}
        {activeConsole === 'rds' && (
          <div className="space-y-3">
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
                Execute SQL
              </button>
            </div>

            {queryOutput && (
              <div className="rounded-xl bg-slate-50 p-3 font-mono text-[11px] border border-slate-200 overflow-x-auto text-slate-800">
                <pre>{JSON.stringify(queryOutput, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* If S3 Console */}
        {activeConsole === 's3' && (
          <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {documents.slice(0, 6).map((doc) => (
              <div key={doc.id} className="p-3 bg-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="font-mono text-slate-900 font-semibold">{doc.s3Key}</span>
                    <span className="block text-[10px] text-slate-500 font-mono">
                      SSE-KMS • Size: {doc.fileSize}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  HTTP 200 OK
                </span>
              </div>
            ))}
          </div>
        )}

        {/* If EC2 Console */}
        {activeConsole === 'ec2' && (
          <div className="rounded-xl bg-slate-50 p-4 font-mono text-xs space-y-2 border border-slate-200 text-slate-800">
            <p className="text-emerald-700 font-semibold">● Instance State: running (2/2 status checks passed)</p>
            <p>CPU Utilization: 14.2% across 2 vCPUs</p>
            <p>Memory Usage: 1.1 GB / 4.0 GB (28%)</p>
            <p>Network In/Out: 42.1 MB / 18.6 MB</p>
            <p>EBS Root Volume: /dev/xvda (20 GB gp3 SSD, 82% free)</p>
            <p>OS: Amazon Linux 2023 with Systemd Supervisor</p>
          </div>
        )}

        {/* If CloudWatch */}
        {activeConsole === 'cloudwatch' && (
          <div className="rounded-xl bg-slate-50 p-3 font-mono text-[11px] space-y-1.5 border border-slate-200 text-slate-700">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-slate-400">{log.time}</span>
                <span className="text-slate-900 font-semibold">{log.service}</span>
                <span>{log.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

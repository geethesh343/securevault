import React, { useState } from 'react';
import {
  X,
  FileText,
  Star,
  Share2,
  Download,
  Trash2,
  HardDrive,
  ShieldCheck,
  Calendar,
  Building,
  Tag,
  Copy,
  Check,
  Users,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { DocumentRecord } from '../../types/vault';

interface DocumentViewerModalProps {
  document: DocumentRecord | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document: doc, onClose }) => {
  const { toggleFavoriteDoc, deleteDocument, toggleFamilyDocShare, familyMembers } = useVault();
  const [copiedId, setCopiedId] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!doc) return null;

  const handleCopyDocNumber = () => {
    if (doc.documentNumber) {
      navigator.clipboard.writeText(doc.documentNumber);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleDownload = () => {
    // Generate text/pdf simulation download
    const blob = new Blob(
      [
        `LifeVault AI - Secure Encrypted Document Export\n`,
        `====================================================\n`,
        `Title: ${doc.title}\n`,
        `Category: ${doc.category}\n`,
        `Document Number: ${doc.documentNumber || 'N/A'}\n`,
        `Authority: ${doc.issuingAuthority || 'N/A'}\n`,
        `Issue Date: ${doc.issueDate || 'N/A'}\n`,
        `Expiry Date: ${doc.expiryDate || 'Lifetime'}\n`,
        `Amazon S3 URI: s3://${doc.s3Key}\n`,
        `Encryption: SSE-KMS (AES-256)\n\n`,
        `OCR Content Summary:\n${doc.ocrSummary}\n\n`,
        `Tags: ${doc.tags.join(', ')}\n`,
        `Exported at: ${new Date().toISOString()}\n`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${doc.fileName.replace(/\.pdf$/, '')}_LifeVault_Export.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to permanently delete "${doc.title}" from your cloud vault?`)) {
      deleteDocument(doc.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden my-6">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{doc.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  {doc.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {doc.verifiedStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {doc.fileName} • {doc.fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavoriteDoc(doc.id)}
              className={`p-2 rounded-lg transition ${
                doc.isFavorite ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={doc.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
            >
              <Star className="w-4 h-4" fill={doc.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Amazon S3 Cloud Storage Details banner */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <HardDrive className="w-3.5 h-3.5" /> Amazon S3 Cloud Object Storage
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SSE-KMS Encrypted
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              <div className="truncate">
                <span className="text-slate-500">S3 Key:</span> {doc.s3Key}
              </div>
              <div>
                <span className="text-slate-500">Storage Class:</span> S3 Standard (ap-south-1)
              </div>
            </div>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doc.documentNumber && (
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Document / Policy Number
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-white">{doc.documentNumber}</span>
                  <button
                    onClick={handleCopyDocNumber}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition"
                    title="Copy Document Number"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {doc.issuingAuthority && (
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Issuing Authority
                </span>
                <span className="text-xs text-white flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> {doc.issuingAuthority}
                </span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Issue Date
              </span>
              <span className="text-xs text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {doc.issueDate || 'Not specified'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Expiry & Validity
              </span>
              <span
                className={`text-xs font-medium flex items-center gap-1.5 ${
                  doc.expiryDate ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> {doc.expiryDate || 'Lifetime / No Expiry'}
              </span>
            </div>
          </div>

          {/* OCR Content Text */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>AI OCR Extracted Summary</span>
              <span className="text-[10px] text-blue-400 font-mono">Gemini Vision OCR</span>
            </span>
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-xs text-slate-300 leading-relaxed font-sans">
              {doc.ocrSummary}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-300 block">Search & Category Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 opacity-60" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Controlled Family Access */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Granular Family Access
            </span>
            <p className="text-[11px] text-slate-400">
              Grant or revoke access to this specific document for family members without sharing your entire vault.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {familyMembers.map((fam) => {
                const isShared = doc.sharedWithFamilyIds.includes(fam.id);
                return (
                  <button
                    key={fam.id}
                    onClick={() => toggleFamilyDocShare(doc.id, fam.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs border transition flex items-center gap-2 ${
                      isShared
                        ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-300 font-medium'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <img src={fam.avatarUrl} alt={fam.name} className="w-4 h-4 rounded-full" />
                    <span>{fam.name}</span>
                    <span className="text-[10px] opacity-70">({isShared ? 'Shared' : 'No access'})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-500/20 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Exported!
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Export Record
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

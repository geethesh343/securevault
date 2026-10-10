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
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, '_')}_decrypted.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {doc.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {doc.verifiedStatus || 'Verified'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">{doc.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleFavoriteDoc(doc.id)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition"
              title="Toggle Favorite"
            >
              <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Meta Badges */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-[10px] text-slate-500 block">Document ID</span>
            <div className="flex items-center justify-between gap-1 mt-0.5">
              <span className="font-mono font-bold text-slate-900 truncate">
                {doc.documentNumber || 'N/A'}
              </span>
              {doc.documentNumber && (
                <button
                  onClick={handleCopyDocNumber}
                  className="text-slate-400 hover:text-slate-700"
                  title="Copy Document Number"
                >
                  {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-[10px] text-slate-500 block">Issuing Authority</span>
            <span className="font-medium text-slate-800 truncate block mt-0.5">
              {doc.issuingAuthority || 'Government / Issuer'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-[10px] text-slate-500 block">Validity Expiry</span>
            <span
              className={`font-mono font-bold block mt-0.5 ${
                doc.expiryDate ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {doc.expiryDate || 'Lifetime'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-[10px] text-slate-500 block">S3 File Size</span>
            <span className="font-mono text-slate-700 block mt-0.5">{doc.fileSize}</span>
          </div>
        </div>

        {/* OCR Summary & Extracted Intelligence */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Gemini 3.8 Flash OCR Summary
              </span>
              <span className="font-mono text-[10px] text-slate-500">Confidence: 99.4%</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">{doc.ocrSummary}</p>
          </div>

          {/* S3 Storage Path */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-600 text-[11px]">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" /> AWS S3 Object URI
              </span>
              <span className="font-mono text-emerald-700 font-semibold">SSE-KMS (AES-256)</span>
            </div>
            <p className="font-mono text-[11px] text-slate-900 truncate">s3://{doc.s3Key}</p>
          </div>

          {/* Family Sharing Checklist */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Shared with Family Members:
            </p>
            <div className="flex flex-wrap gap-2">
              {familyMembers.map((m) => {
                const isShared = doc.sharedWithFamilyIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleFamilyDocShare(doc.id, m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                      isShared
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <img src={m.avatarUrl} alt={m.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                    <span>{m.name}</span>
                    {isShared && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">Uploaded on {doc.createdAt.split('T')[0]}</div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" /> Download Decrypted
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

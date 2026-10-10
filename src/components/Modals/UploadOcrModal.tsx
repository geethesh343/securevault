import React, { useState } from 'react';
import {
  X,
  Upload,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Tag,
  Calendar,
  Building,
  Shield,
  Loader2,
  HardDrive,
  Eye,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { parseDocumentOcr } from '../../services/api';
import { DocumentCategory } from '../../types/vault';

export const UploadOcrModal: React.FC = () => {
  const { uploadModalOpen, setUploadModalOpen, addDocument, familyMembers } = useVault();

  const [step, setStep] = useState<'upload' | 'extracting' | 'review'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [samplePreset, setSamplePreset] = useState<string>('');
  const [extractedData, setExtractedData] = useState({
    title: '',
    category: 'Identity' as DocumentCategory,
    documentNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    renewalDate: '',
    amount: undefined as number | undefined,
    ocrSummary: '',
    tags: [] as string[],
    newTagInput: '',
  });
  const [selectedFamilyIds, setSelectedFamilyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!uploadModalOpen) return null;

  const handleClose = () => {
    setUploadModalOpen(false);
    setStep('upload');
    setSelectedFile(null);
    setSamplePreset('');
    setErrorMsg(null);
  };

  const sampleTemplates = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card (India)',
      desc: '12-digit UIDAI biometric card',
      category: 'Identity' as DocumentCategory,
    },
    {
      id: 'passport',
      name: 'International Passport',
      desc: 'Machine-readable travel document',
      category: 'Identity' as DocumentCategory,
    },
    {
      id: 'car_insurance',
      name: 'Car / Motor Insurance',
      desc: 'Comprehensive policy with renewal date',
      category: 'Insurance' as DocumentCategory,
    },
    {
      id: 'utility_bill',
      name: 'Utility / Electricity Bill',
      desc: 'Monthly bill statement with due date',
      category: 'Bills' as DocumentCategory,
    },
  ];

  const handleProcessPreset = async (presetId: string) => {
    setSamplePreset(presetId);
    setStep('extracting');
    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await parseDocumentOcr({
        fileName: `${presetId}.pdf`,
        sampleType: presetId,
      });

      const d = result.data;
      if (d) {
        setExtractedData({
          title: d.title,
          category: (d.category as DocumentCategory) || 'Identity',
          documentNumber: d.documentNumber || '',
          issuingAuthority: d.issuingAuthority || '',
          issueDate: d.issueDate || '',
          expiryDate: d.expiryDate || '',
          renewalDate: d.renewalDate || '',
          amount: d.amount,
          ocrSummary: d.ocrSummary || '',
          tags: d.tags || [],
          newTagInput: '',
        });
      }
      setStep('review');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process document with Gemini OCR');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToS3Vault = () => {
    if (!extractedData.title.trim()) return;

    addDocument({
      title: extractedData.title,
      category: extractedData.category,
      fileName: `${extractedData.title.replace(/\s+/g, '_')}.pdf`,
      fileType: 'application/pdf',
      fileSize: '1.8 MB',
      documentNumber: extractedData.documentNumber,
      issuingAuthority: extractedData.issuingAuthority,
      issueDate: extractedData.issueDate,
      expiryDate: extractedData.expiryDate,
      renewalDate: extractedData.renewalDate,
      ocrSummary: extractedData.ocrSummary,
      tags: extractedData.tags,
      sharedWithFamilyIds: selectedFamilyIds,
      isFavorite: false,
      amount: extractedData.amount,
      verifiedStatus: 'Verified',
    });

    handleClose();
  };

  const addTag = () => {
    if (extractedData.newTagInput.trim()) {
      setExtractedData({
        ...extractedData,
        tags: [...extractedData.tags, extractedData.newTagInput.trim()],
        newTagInput: '',
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setExtractedData({
      ...extractedData,
      tags: extractedData.tags.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Upload & AI OCR Auto-Extraction
              </h3>
              <p className="text-xs text-slate-500">
                Powered by Gemini 3.8 Flash • AES-256 S3 Storage
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Upload / Choose Preset */}
        {step === 'upload' && (
          <div className="space-y-6 pt-5">
            {/* Dropzone mock */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-white hover:border-slate-400 transition cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-white text-slate-700 mx-auto flex items-center justify-center shadow-xs border border-slate-200 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Drag & drop document PDF or Image</p>
              <p className="text-xs text-slate-500 mt-1">
                Supports Aadhaar, Passports, Driving Licenses, Policies, Warranties, Bills
              </p>
              <button
                type="button"
                onClick={() => handleProcessPreset('aadhaar')}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
              >
                Browse File
              </button>
            </div>

            {/* Quick Demo Templates */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Or test with sample verified government documents & utilities:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sampleTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleProcessPreset(tmpl.id)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 text-left transition group shadow-xs hover:border-slate-300 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-slate-700">
                        {tmpl.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tmpl.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Extracting animation */}
        {step === 'extracting' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-900 mx-auto flex items-center justify-center animate-spin border border-slate-200">
              <Loader2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Analyzing Document with Gemini 3.8 Flash...</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Extracting legal entity, document ID numbers, expiry validity, and generating structured metadata.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Edit Extracted Fields */}
        {step === 'review' && (
          <div className="space-y-4 pt-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>AI OCR Extraction Complete. Verify extracted metadata before committing to Amazon S3.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={extractedData.title}
                  onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={extractedData.category}
                  onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                >
                  <option value="Identity">Identity</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Education">Education</option>
                  <option value="Warranties">Warranties</option>
                  <option value="Bills">Bills</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Medical">Medical</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Document Number / ID</label>
                <input
                  type="text"
                  value={extractedData.documentNumber}
                  onChange={(e) => setExtractedData({ ...extractedData, documentNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  value={extractedData.issuingAuthority}
                  onChange={(e) => setExtractedData({ ...extractedData, issuingAuthority: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={extractedData.expiryDate}
                  onChange={(e) => setExtractedData({ ...extractedData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={extractedData.issueDate}
                  onChange={(e) => setExtractedData({ ...extractedData, issueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">AI OCR Summary</label>
                <textarea
                  rows={2}
                  value={extractedData.ocrSummary}
                  onChange={(e) => setExtractedData({ ...extractedData, ocrSummary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                ></textarea>
              </div>

              {/* Family sharing access */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Grant Family Access (Controlled RBAC)
                </label>
                <div className="flex flex-wrap gap-2">
                  {familyMembers.map((m) => {
                    const isSelected = selectedFamilyIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedFamilyIds(
                            isSelected ? selectedFamilyIds.filter((id) => id !== m.id) : [...selectedFamilyIds, m.id]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <img src={m.avatarUrl} alt={m.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                        <span>{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveToS3Vault}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2"
              >
                <HardDrive className="w-4 h-4" /> Save to AWS S3 Encrypted Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

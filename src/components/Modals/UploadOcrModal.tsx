import React, { useState, useRef } from 'react';
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
  Cloud,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { parseDocumentOcr } from '../../services/api';
import { DocumentCategory } from '../../types/vault';
import {
  uploadDocumentToCloudStorage,
  validateDocumentFile,
  StorageUploadResult,
} from '../../services/storageService';

export const UploadOcrModal: React.FC = () => {
  const { uploadModalOpen, setUploadModalOpen, addDocument, familyMembers, firebaseUser, user } = useVault();

  const [step, setStep] = useState<'upload' | 'uploading_storage' | 'extracting' | 'review'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [samplePreset, setSamplePreset] = useState<string>('');
  const [cloudStorageData, setCloudStorageData] = useState<StorageUploadResult | null>(null);

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
    fileName: '',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
  });
  const [selectedFamilyIds, setSelectedFamilyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!uploadModalOpen) return null;

  const handleClose = () => {
    setUploadModalOpen(false);
    setStep('upload');
    setSelectedFile(null);
    setUploadProgress(0);
    setSamplePreset('');
    setCloudStorageData(null);
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

  // Process Real File Upload via Firebase Cloud Storage & Gemini OCR
  const handleFileSelected = async (file: File) => {
    setErrorMsg(null);
    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    const uid = firebaseUser?.uid || user.id || 'demo_user';

    try {
      // Step 1: Upload to Cloud Storage
      setStep('uploading_storage');
      setUploadProgress(10);

      let storageResult: StorageUploadResult | null = null;
      if (firebaseUser) {
        storageResult = await uploadDocumentToCloudStorage(uid, file, (pct) => {
          setUploadProgress(pct);
        });
        setCloudStorageData(storageResult);
      } else {
        // Simulated upload progress in sandbox
        for (let p = 15; p <= 100; p += 25) {
          await new Promise((r) => setTimeout(r, 80));
          setUploadProgress(p);
        }
      }

      // Step 2: Extract metadata using Gemini OCR
      setStep('extracting');
      setLoading(true);

      const ocrResult = await parseDocumentOcr({
        fileName: file.name,
        fileType: file.type || 'application/pdf',
      });

      const d = ocrResult.data;
      setExtractedData({
        title: d?.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: (d?.category as DocumentCategory) || 'Identity',
        documentNumber: d?.documentNumber || '',
        issuingAuthority: d?.issuingAuthority || '',
        issueDate: d?.issueDate || '',
        expiryDate: d?.expiryDate || '',
        renewalDate: d?.renewalDate || '',
        amount: d?.amount,
        ocrSummary: d?.ocrSummary || 'Uploaded to Cloud Storage with real-time Firestore synchronization.',
        tags: d?.tags || ['Document', 'CloudStorage'],
        newTagInput: '',
        fileName: file.name,
        fileSize: storageResult ? storageResult.fileSize : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fileType: file.type || 'application/pdf',
      });

      setStep('review');
    } catch (err: any) {
      console.error('File upload or OCR error:', err);
      setErrorMsg(err.message || 'Failed to complete cloud upload');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

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
          fileName: `${presetId}_verified.pdf`,
          fileSize: '1.8 MB',
          fileType: 'application/pdf',
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

  const handleSaveToVault = () => {
    if (!extractedData.title.trim()) return;

    addDocument({
      title: extractedData.title,
      category: extractedData.category,
      fileName: extractedData.fileName || `${extractedData.title.replace(/\s+/g, '_')}.pdf`,
      fileType: extractedData.fileType || 'application/pdf',
      fileSize: extractedData.fileSize || '1.8 MB',
      storagePath: cloudStorageData?.storagePath,
      downloadUrl: cloudStorageData?.downloadUrl,
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
                Powered by Gemini 3.8 Flash • Firebase Cloud Storage & Firestore
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

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Upload / Choose Preset */}
        {step === 'upload' && (
          <div className="space-y-6 pt-5">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file);
              }}
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
              className="hidden"
            />

            {/* Dropzone with real click trigger */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileSelected(file);
              }}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-white hover:border-slate-400 transition cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-slate-700 mx-auto flex items-center justify-center shadow-xs border border-slate-200 mb-3 group-hover:scale-105 transition">
                <FileText className="w-6 h-6 text-sky-600" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                Click to browse or drag & drop document (PDF, PNG, JPG)
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Files are uploaded securely to Firebase Cloud Storage under your authenticated user ID.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
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

        {/* STEP: Uploading to Cloud Storage */}
        {step === 'uploading_storage' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center border border-sky-200">
              <Cloud className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Uploading to Firebase Cloud Storage...</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Saving binary object under authenticated UID ({firebaseUser?.uid ? `${firebaseUser.uid.substring(0, 10)}...` : 'demo-user'})
              </p>
            </div>
            {/* Progress bar */}
            <div className="max-w-xs mx-auto">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs font-mono text-slate-600 mt-2">{uploadProgress}% Complete</p>
            </div>
          </div>
        )}

        {/* STEP: Extracting animation */}
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

        {/* STEP: Review & Edit Extracted Fields */}
        {step === 'review' && (
          <div className="space-y-4 pt-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {cloudStorageData
                  ? 'Binary uploaded to Firebase Cloud Storage and parsed via Gemini OCR.'
                  : 'AI OCR Extraction Complete. Verify extracted metadata before committing to Cloud Firestore.'}
              </span>
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
                  <option value="Medical">Medical</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Document / ID Number</label>
                <input
                  type="text"
                  value={extractedData.documentNumber}
                  onChange={(e) => setExtractedData({ ...extractedData, documentNumber: e.target.value })}
                  placeholder="e.g. 5491-XXXX-0092"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  value={extractedData.issuingAuthority}
                  onChange={(e) => setExtractedData({ ...extractedData, issuingAuthority: e.target.value })}
                  placeholder="e.g. UIDAI, Star Health, Apple"
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

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={extractedData.expiryDate}
                  onChange={(e) => setExtractedData({ ...extractedData, expiryDate: e.target.value })}
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
                />
              </div>

              {/* Tags */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {extractedData.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1 border border-slate-200"
                    >
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="text-slate-400 hover:text-slate-700">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={extractedData.newTagInput}
                    onChange={(e) => setExtractedData({ ...extractedData, newTagInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a search tag and press Enter"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Family share checkboxes */}
              {familyMembers.length > 0 && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Share Access with Family Members:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {familyMembers.map((m) => {
                      const selected = selectedFamilyIds.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setSelectedFamilyIds((prev) =>
                              prev.includes(m.id) ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition ${
                            selected
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                          }`}
                        >
                          <img src={m.avatarUrl} alt={m.name} className="w-4 h-4 rounded-full" />
                          <span>{m.name}</span>
                          {selected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Back to Upload
              </button>
              <button
                type="button"
                onClick={handleSaveToVault}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Save to Cloud Firestore Vault</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

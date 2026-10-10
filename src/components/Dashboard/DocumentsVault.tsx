import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  Filter,
  FileText,
  Star,
  Users,
  Clock,
  ShieldCheck,
  Calendar,
  LayoutGrid,
  List,
  ExternalLink,
  Download,
  Trash2,
  Share2,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { DocumentCategory, DocumentRecord } from '../../types/vault';

export const DocumentsVault: React.FC = () => {
  const {
    documents,
    accessibleDocuments,
    user,
    setUploadModalOpen,
    setPreviewDoc,
    toggleFavoriteDoc,
    deleteDocument,
    familyMembers,
  } = useVault();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'All',
    'Identity',
    'Insurance',
    'Education',
    'Warranties',
    'Bills',
    'Vehicle',
    'Medical',
    'General',
  ];

  const sourceDocs = user.role === 'family_member' ? accessibleDocuments : documents;

  const filteredDocs = sourceDocs.filter((doc) => {
    if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
    if (onlyFavorites && !doc.isFavorite) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchNumber = doc.documentNumber?.toLowerCase().includes(q);
      const matchTags = doc.tags.some((t) => t.toLowerCase().includes(q));
      const matchOcr = doc.ocrSummary.toLowerCase().includes(q);
      return matchTitle || matchNumber || matchTags || matchOcr;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderLock className="w-6 h-6 text-slate-800" />
            Document Vault
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {sourceDocs.length} encrypted documents backed by Amazon S3 (AES-256) & Gemini OCR
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, Aadhaar/Passport number, OCR summary, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Favorites filter toggle */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                onlyFavorites
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>Starred</span>
            </button>

            {/* View Mode */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No documents found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or upload a new identity document or bill.
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            Upload Now
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredDocs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {doc.category}
                      </span>
                      <h4
                        onClick={() => setPreviewDoc(doc)}
                        className="text-xs font-bold text-slate-900 truncate hover:text-slate-600 cursor-pointer transition"
                      >
                        {doc.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavoriteDoc(doc.id)}
                    className="p-1 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-amber-500"
                  >
                    <Star
                      className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                    />
                  </button>
                </div>

                {/* Identification details */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 space-y-1.5 border border-slate-100">
                  {doc.documentNumber && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Doc #</span>
                      <span className="font-mono font-semibold text-slate-800">{doc.documentNumber}</span>
                    </div>
                  )}
                  {doc.issuingAuthority && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Authority</span>
                      <span className="text-slate-700 truncate max-w-[170px] text-right font-medium">
                        {doc.issuingAuthority}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Expiry</span>
                    <span
                      className={`font-mono font-semibold ${
                        doc.expiryDate ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {doc.expiryDate || 'Lifetime Valid'}
                    </span>
                  </div>
                </div>

                {/* OCR Summary Snippet */}
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {doc.ocrSummary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {doc.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="text-[10px] text-slate-400 px-1 py-0.5">+{doc.tags.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>S3 KMS</span>
                  {doc.sharedWithFamilyIds.length > 0 && (
                    <span className="flex items-center gap-1 text-slate-600 ml-1.5 font-medium">
                      <Users className="w-3 h-3" /> {doc.sharedWithFamilyIds.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition"
                  >
                    View
                  </button>
                  {user.role === 'owner' && (
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredDocs.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition cursor-pointer"
                onClick={() => setPreviewDoc(doc)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{doc.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {doc.category}
                      </span>
                      {doc.isFavorite && <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {doc.documentNumber || doc.fileName} • {doc.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="text-right hidden md:block">
                    <p className="text-slate-500 text-[10px]">Expiry</p>
                    <p className="font-mono font-medium text-slate-800">{doc.expiryDate || 'Lifetime'}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDoc(doc);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

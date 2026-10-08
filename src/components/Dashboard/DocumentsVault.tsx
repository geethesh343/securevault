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
  MoreVertical,
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
      const matchNum = doc.documentNumber?.toLowerCase().includes(q);
      const matchAuth = doc.issuingAuthority?.toLowerCase().includes(q);
      const matchTags = doc.tags.some((t) => t.toLowerCase().includes(q));
      const matchSummary = doc.ocrSummary.toLowerCase().includes(q);
      if (!matchTitle && !matchNum && !matchAuth && !matchTags && !matchSummary) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FolderLock className="w-6 h-6 text-indigo-400" />
            Document Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Aadhaar, Passport, PAN, Insurance, Degrees & Warranties secured with AWS S3 encryption
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Upload & AI OCR Scan
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, Aadhaar/Passport number, issuing authority, tags..."
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick toggle filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                onlyFavorites
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" fill={onlyFavorites ? 'currentColor' : 'none'} />
              <span>Favorites</span>
            </button>

            {/* View Mode switcher */}
            <div className="flex rounded-xl bg-slate-800 border border-slate-700 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'grid' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'list' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-medium ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid / List */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-white">No documents found matching filters</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your category filter, or upload a new identity document or policy certificate.
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
          >
            Upload Document Now
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const hasExpiry = Boolean(doc.expiryDate);
            const isShared = doc.sharedWithFamilyIds.length > 0;

            return (
              <div
                key={doc.id}
                onClick={() => setPreviewDoc(doc)}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer group flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div>
                  {/* Top card row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                          {doc.category}
                        </span>
                        <p className="text-[11px] font-mono text-slate-400 mt-1">{doc.fileSize}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteDoc(doc.id);
                      }}
                      className={`p-1.5 rounded-lg transition ${
                        doc.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Star className="w-4 h-4" fill={doc.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Title & Document Number */}
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition line-clamp-1 mb-1">
                    {doc.title}
                  </h4>

                  {doc.documentNumber && (
                    <p className="text-xs font-mono font-semibold text-slate-300 mb-2">
                      #{doc.documentNumber}
                    </p>
                  )}

                  {doc.issuingAuthority && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                      Issued by: <span className="text-slate-300">{doc.issuingAuthority}</span>
                    </p>
                  )}

                  {/* OCR Summary snippet */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-4 bg-slate-800/40 p-2 rounded-xl">
                    {doc.ocrSummary}
                  </p>
                </div>

                {/* Card Footer: Expiry & Family status */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {hasExpiry ? (
                      <span className="text-amber-400 font-medium">Exp: {doc.expiryDate}</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">Lifetime Validity</span>
                    )}
                  </div>

                  {isShared && (
                    <span className="text-[10px] text-pink-400 flex items-center gap-1 font-medium bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                      <Users className="w-3 h-3" /> Shared ({doc.sharedWithFamilyIds.length})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setPreviewDoc(doc)}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition truncate">
                      {doc.title}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                      {doc.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    {doc.documentNumber && <span className="font-mono text-slate-300">{doc.documentNumber}</span>}
                    {doc.issuingAuthority && <span>• {doc.issuingAuthority}</span>}
                    <span>• {doc.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs">
                <span className="text-slate-400 font-mono">
                  {doc.expiryDate ? `Exp: ${doc.expiryDate}` : 'Lifetime'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteDoc(doc.id);
                  }}
                  className={`p-1.5 rounded-lg transition ${
                    doc.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Star className="w-4 h-4" fill={doc.isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Trash2,
  Edit2,
  FileText,
  X,
  ExternalLink,
  ShieldCheck,
  Eye,
  Download,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { FamilyMember } from '../../types/vault';

export const FamilyAccessManager: React.FC = () => {
  const {
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    documents,
    setGoogleAuthModalOpen,
    loginAsGoogleMember,
    user,
  } = useVault();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [managingMember, setManagingMember] = useState<FamilyMember | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Spouse' as FamilyMember['relationship'],
    email: '',
    phone: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    accessLevel: 'View Only' as FamilyMember['accessLevel'],
    accessibleDocumentIds: [] as string[],
    status: 'Active' as 'Active' | 'Pending Invitation',
  });

  const relationships: FamilyMember['relationship'][] = [
    'Spouse',
    'Parent',
    'Child',
    'Sibling',
    'Guardian',
    'Other',
  ];

  const handleOpenInvite = () => {
    setFormData({
      name: '',
      relationship: 'Spouse',
      email: '',
      phone: '',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      accessLevel: 'View Only',
      accessibleDocumentIds: [],
      status: 'Active',
    });
    setInviteModalOpen(true);
  };

  const handleSaveInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    addFamilyMember(formData);
    setInviteModalOpen(false);
  };

  const handleToggleDocPermission = (docId: string) => {
    if (!managingMember) return;
    const exists = managingMember.accessibleDocumentIds.includes(docId);
    const updatedIds = exists
      ? managingMember.accessibleDocumentIds.filter((id) => id !== docId)
      : [...managingMember.accessibleDocumentIds, docId];

    updateFamilyMember(managingMember.id, { accessibleDocumentIds: updatedIds });
    setManagingMember({ ...managingMember, accessibleDocumentIds: updatedIds });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-pink-400" />
            Controlled Family Access
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Safely share selected identity, medical, and house documents with family members without exposing your full wallet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGoogleAuthModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-2"
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              alt="Google"
              className="w-3.5 h-3.5"
            />
            <span>Google Login Switcher</span>
          </button>
          <button
            onClick={handleOpenInvite}
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-lg shadow-pink-600/20 transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Family Member
          </button>
        </div>
      </div>

      {/* Security explanation banner */}
      <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink-500/20 flex items-start gap-3 text-xs text-pink-300">
        <ShieldCheck className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-white mb-0.5">Role-Based Access Control (RBAC) Enabled</p>
          <p className="text-slate-300 leading-relaxed">
            Family members receive authenticated, limited access strictly to documents you explicitly grant.
            Financial cards, private passwords, and unshared records remain 100% private.
          </p>
        </div>
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map((member) => {
          return (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{member.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-pink-300 border border-slate-700">
                          {member.relationship}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">{member.status}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove family access for "${member.name}"?`)) {
                        deleteFamilyMember(member.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                    title="Remove Access"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-slate-400 mb-3 font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Accessible Documents Summary */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Granted Documents:</span>
                    <span className="font-mono font-semibold text-white">
                      {member.accessibleDocumentIds.length} of {documents.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {member.accessibleDocumentIds.map((docId) => {
                      const doc = documents.find((d) => d.id === docId);
                      return doc ? (
                        <span
                          key={docId}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 truncate max-w-[140px]"
                        >
                          {doc.title}
                        </span>
                      ) : null;
                    })}
                    {member.accessibleDocumentIds.length === 0 && (
                      <span className="text-[11px] text-slate-500 italic">No documents shared yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <button
                  onClick={() =>
                    loginAsGoogleMember({
                      id: member.id,
                      name: member.name,
                      email: member.email,
                      avatar: member.avatarUrl,
                      relationship: member.relationship,
                      memberId: member.id,
                      accessLevel: member.accessLevel,
                      role: 'family_member',
                    })
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-blue-300 font-medium transition flex items-center justify-center gap-1.5"
                >
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                    alt="Google"
                    className="w-3.5 h-3.5"
                  />
                  <span>Sign In as {member.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => setManagingMember(member)}
                  className="px-3 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 text-xs font-medium border border-pink-500/30 transition text-center"
                >
                  Permissions ({member.accessibleDocumentIds.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Invite Family Member</h3>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvite} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Relationship *</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {relationships.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Email Address (Google Login) *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. family.member@gmail.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98860 12345"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Permission Level</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="View Only">View Only (No Download)</option>
                    <option value="Download">View & Download</option>
                    <option value="Full Access">Full Access (Shared Items)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md transition"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Granular Permissions Modal */}
      {managingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Manage Access for {managingMember.name} ({managingMember.relationship})
                </h3>
                <p className="text-xs text-slate-400">
                  Select which documents this family member can view in their digital wallet
                </p>
              </div>
              <button
                onClick={() => setManagingMember(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {documents.map((doc) => {
                const isChecked = managingMember.accessibleDocumentIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleToggleDocPermission(doc.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-pink-950/20 border-pink-500/50 text-white'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className={`w-4 h-4 ${isChecked ? 'text-pink-400' : 'text-slate-500'}`} />
                      <div>
                        <p className="text-xs font-semibold text-white">{doc.title}</p>
                        <p className="text-[10px] text-slate-400">{doc.category} • {doc.documentNumber || 'No ID'}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isChecked ? 'bg-pink-600 border-pink-500 text-white' : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setManagingMember(null)}
                className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md transition"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

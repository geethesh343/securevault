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

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    addFamilyMember(formData);
    setInviteModalOpen(false);
  };

  const handleToggleDocAccess = (member: FamilyMember, docId: string) => {
    const updatedIds = member.accessibleDocumentIds.includes(docId)
      ? member.accessibleDocumentIds.filter((id) => id !== docId)
      : [...member.accessibleDocumentIds, docId];

    updateFamilyMember(member.id, { accessibleDocumentIds: updatedIds });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-slate-800" />
            Controlled Family Access
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Grant granular document permissions and Google single-sign-on access to trusted family members
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setGoogleAuthModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold shadow-xs transition flex items-center gap-2"
          >
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <span>Switch Google Login</span>
          </button>

          <button
            onClick={handleOpenInvite}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Invite Member
          </button>
        </div>
      </div>

      {/* Security Architecture Notice */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600">
          <p className="font-semibold text-slate-900">Zero-Trust Role-Based Access Control (RBAC)</p>
          <p className="mt-0.5">
            Family members can only view documents explicitly shared with them. Passwords and master vault credentials
            remain strictly hidden unless full admin rights are granted by the account owner.
          </p>
        </div>
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map((member) => {
          const isCurrentlyLoggedIn = user.email === member.email;

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 shadow-xs ${
                isCurrentlyLoggedIn
                  ? 'bg-slate-50 border-slate-400 ring-2 ring-slate-900'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                        {isCurrentlyLoggedIn && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {member.relationship} • {member.accessLevel}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      member.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px]">{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Document Access Metric */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Accessible Documents</span>
                  <span className="font-mono font-bold text-slate-900">
                    {member.accessibleDocumentIds.length} of {documents.length}
                  </span>
                </div>

                {/* Google Sign-in fast switcher for this member */}
                <div className="mt-3">
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
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-xs ${
                      isCurrentlyLoggedIn
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 bg-white rounded-full p-0.5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{isCurrentlyLoggedIn ? 'Currently Logged In' : `Sign In as ${member.name.split(' ')[0]}`}</span>
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setManagingMember(member)}
                  className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> Manage Document Permissions
                </button>

                {user.role === 'owner' && (
                  <button
                    onClick={() => deleteFamilyMember(member.id)}
                    className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    title="Revoke member access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Permissions Management Drawer/Modal */}
      {managingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Document Access for {managingMember.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Select which AES-256 encrypted documents this member can view or download
                </p>
              </div>
              <button
                onClick={() => setManagingMember(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto my-4 space-y-1">
              {documents.map((doc) => {
                const hasAccess = managingMember.accessibleDocumentIds.includes(doc.id);

                return (
                  <div
                    key={doc.id}
                    onClick={() => handleToggleDocAccess(managingMember, doc.id)}
                    className="p-3 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{doc.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {doc.category} • {doc.documentNumber || doc.fileName}
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={hasAccess}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-slate-900 w-4 h-4"
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {managingMember.accessibleDocumentIds.length} documents granted
              </span>
              <button
                onClick={() => setManagingMember(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Invite Family Member</h3>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Geethesh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Relationship</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  >
                    {relationships.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Access Level</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                  >
                    <option value="View Only">View Only</option>
                    <option value="Download">Download Allowed</option>
                    <option value="Full Access">Full Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Google Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { VaultProvider, useVault } from './context/VaultContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/Dashboard/OverviewTab';
import { DocumentsVault } from './components/Dashboard/DocumentsVault';
import { ExpiryRenewalsTracker } from './components/Dashboard/ExpiryRenewalsTracker';
import { SubscriptionsManager } from './components/Dashboard/SubscriptionsManager';
import { BillsInvoicesManager } from './components/Dashboard/BillsInvoicesManager';
import { PasswordsVault } from './components/Dashboard/PasswordsVault';
import { FamilyAccessManager } from './components/Dashboard/FamilyAccessManager';
import { CloudInfraTab } from './components/Dashboard/CloudInfraTab';

import { UploadOcrModal } from './components/Modals/UploadOcrModal';
import { AiSmartSearchModal } from './components/Modals/AiSmartSearchModal';
import { AiChatDrawer } from './components/Modals/AiChatDrawer';
import { CloudArchitectureModal } from './components/Modals/CloudArchitectureModal';
import { DocumentViewerModal } from './components/Modals/DocumentViewerModal';
import { VaultLockOverlay } from './components/Modals/VaultLockOverlay';
import { GoogleAuthModal } from './components/Modals/GoogleAuthModal';

import { Menu, Sparkles, Plus } from 'lucide-react';

const VaultDashboardContent: React.FC = () => {
  const {
    activeTab,
    previewDoc,
    setPreviewDoc,
    setChatAssistantOpen,
    setUploadModalOpen,
  } = useVault();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main workspace with Sidebar & Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

        {/* Mobile menu backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          ></div>
        )}

        {/* Dynamic Main Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2 text-xs font-semibold"
            >
              <Menu className="w-4 h-4" /> Menu & Navigation
            </button>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="p-2 rounded-xl bg-blue-600 text-white flex items-center gap-1.5 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" /> Upload
            </button>
          </div>

          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'documents' && <DocumentsVault />}
          {activeTab === 'expiries' && <ExpiryRenewalsTracker />}
          {activeTab === 'subscriptions' && <SubscriptionsManager />}
          {activeTab === 'bills' && <BillsInvoicesManager />}
          {activeTab === 'passwords' && <PasswordsVault />}
          {activeTab === 'family' && <FamilyAccessManager />}
          {activeTab === 'cloud' && <CloudInfraTab />}
        </main>
      </div>

      {/* Floating Action Button for AI Assistant on mobile */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <button
          onClick={() => setChatAssistantOpen(true)}
          className="w-13 h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center transition active:scale-95 border border-indigo-400/30"
          title="Ask LifeVault AI"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>

      {/* Global Modals & Overlays */}
      <UploadOcrModal />
      <AiSmartSearchModal />
      <AiChatDrawer />
      <CloudArchitectureModal />
      <DocumentViewerModal document={previewDoc} onClose={() => setPreviewDoc(null)} />
      <VaultLockOverlay />
      <GoogleAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <VaultProvider>
      <VaultDashboardContent />
    </VaultProvider>
  );
}

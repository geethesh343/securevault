import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DocumentRecord,
  SubscriptionRecord,
  BillRecord,
  CredentialRecord,
  FamilyMember,
  NotificationItem,
  UserProfile,
  CloudInfrastructureState,
  DocumentCategory,
} from '../types/vault';
import {
  INITIAL_USER,
  INITIAL_DOCUMENTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_BILLS,
  INITIAL_CREDENTIALS,
  INITIAL_FAMILY,
  INITIAL_NOTIFICATIONS,
  INITIAL_CLOUD_STATE,
} from '../data/initialData';

interface VaultContextType {
  user: UserProfile;
  documents: DocumentRecord[];
  subscriptions: SubscriptionRecord[];
  bills: BillRecord[];
  credentials: CredentialRecord[];
  familyMembers: FamilyMember[];
  notifications: NotificationItem[];
  cloudState: CloudInfrastructureState;

  // Active view
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Search & Global Modals
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  chatAssistantOpen: boolean;
  setChatAssistantOpen: (open: boolean) => void;
  cloudArchitectureOpen: boolean;
  setCloudArchitectureOpen: (open: boolean) => void;
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  googleAuthModalOpen: boolean;
  setGoogleAuthModalOpen: (open: boolean) => void;
  previewDoc: DocumentRecord | null;
  setPreviewDoc: (doc: DocumentRecord | null) => void;

  // Document actions
  accessibleDocuments: DocumentRecord[];
  addDocument: (doc: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt' | 's3Key' | 's3Url'> & { s3Key?: string; s3Url?: string }) => DocumentRecord;
  updateDocument: (id: string, updates: Partial<DocumentRecord>) => void;
  deleteDocument: (id: string) => void;
  toggleFavoriteDoc: (id: string) => void;
  toggleFamilyDocShare: (docId: string, familyMemberId: string) => void;

  // Subscription actions
  addSubscription: (sub: Omit<SubscriptionRecord, 'id' | 'createdAt'>) => void;
  updateSubscription: (id: string, updates: Partial<SubscriptionRecord>) => void;
  deleteSubscription: (id: string) => void;

  // Bill actions
  addBill: (bill: Omit<BillRecord, 'id'>) => void;
  updateBill: (id: string, updates: Partial<BillRecord>) => void;
  deleteBill: (id: string) => void;
  markBillAsPaid: (id: string) => void;

  // Credential actions
  addCredential: (cred: Omit<CredentialRecord, 'id'>) => void;
  updateCredential: (id: string, updates: Partial<CredentialRecord>) => void;
  deleteCredential: (id: string) => void;

  // Family actions
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'joinedDate'>) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;

  // Auth & Master Lock
  lockVault: () => void;
  unlockVault: (pin: string) => boolean;
  isLocked: boolean;
  loginWithGoogle: () => void;
  loginAsGoogleMember: (account: {
    id?: string;
    name: string;
    email: string;
    avatar: string;
    relationship?: string;
    memberId?: string;
    accessLevel?: 'Owner' | 'View Only' | 'Download' | 'Full Access';
    role?: 'owner' | 'family_member';
  }) => void;
  switchBackToOwner: () => void;
  logout: () => void;

  // Computed helpers & Financial & Task Health
  expiringSoonItems: Array<{
    id: string;
    type: 'document' | 'subscription' | 'bill';
    title: string;
    category: string;
    date: string;
    daysRemaining: number;
    amount?: number;
  }>;
  monthlySubscriptionCost: number;
  pendingBillsCost: number;
  healthMetrics: import('../types/vault').FinancialTaskHealthMetrics;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DOCS: 'lifevault_documents_v1',
  SUBS: 'lifevault_subscriptions_v1',
  BILLS: 'lifevault_bills_v1',
  CREDS: 'lifevault_credentials_v1',
  FAMILY: 'lifevault_family_v1',
  NOTIFS: 'lifevault_notifications_v1',
  USER: 'lifevault_user_v1',
};

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial fixtures
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCS);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBS);
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [bills, setBills] = useState<BillRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [credentials, setCredentials] = useState<CredentialRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CREDS);
    return saved ? JSON.parse(saved) : INITIAL_CREDENTIALS;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAMILY);
    return saved ? JSON.parse(saved) : INITIAL_FAMILY;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [cloudState] = useState<CloudInfrastructureState>(INITIAL_CLOUD_STATE);

  // Active Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [chatAssistantOpen, setChatAssistantOpen] = useState(false);
  const [cloudArchitectureOpen, setCloudArchitectureOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [googleAuthModalOpen, setGoogleAuthModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBS, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDS, JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Document actions
  const addDocument = (
    docInput: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt' | 's3Key' | 's3Url'> & {
      s3Key?: string;
      s3Url?: string;
    }
  ): DocumentRecord => {
    const id = `doc_${Date.now()}`;
    const now = new Date().toISOString();
    const cleanFileName = docInput.fileName || `${docInput.title.replace(/\s+/g, '_')}.pdf`;
    const s3Key = docInput.s3Key || `vault/documents/${user.id}/${docInput.category.toLowerCase()}/${cleanFileName}`;
    const s3Url = docInput.s3Url || `https://lifevault-s3-ap-south-1.amazonaws.com/${s3Key}`;

    const newDoc: DocumentRecord = {
      ...docInput,
      id,
      s3Key,
      s3Url,
      presignedUrlExpiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Add notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'New Document Uploaded & Encrypted',
      message: `"${newDoc.title}" stored to Amazon S3 with AES-256 encryption.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      relatedType: 'document',
      relatedId: newDoc.id,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<DocumentRecord>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    // Also remove from family shares
    setFamilyMembers((prev) =>
      prev.map((m) => ({
        ...m,
        accessibleDocumentIds: m.accessibleDocumentIds.filter((docId) => docId !== id),
      }))
    );
  };

  const toggleFavoriteDoc = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  };

  const toggleFamilyDocShare = (docId: string, familyMemberId: string) => {
    // Update doc record
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const exists = d.sharedWithFamilyIds.includes(familyMemberId);
        return {
          ...d,
          sharedWithFamilyIds: exists
            ? d.sharedWithFamilyIds.filter((fid) => fid !== familyMemberId)
            : [...d.sharedWithFamilyIds, familyMemberId],
        };
      })
    );

    // Update family member record
    setFamilyMembers((prev) =>
      prev.map((m) => {
        if (m.id !== familyMemberId) return m;
        const exists = m.accessibleDocumentIds.includes(docId);
        return {
          ...m,
          accessibleDocumentIds: exists
            ? m.accessibleDocumentIds.filter((did) => did !== docId)
            : [...m.accessibleDocumentIds, docId],
        };
      })
    );
  };

  // Subscriptions
  const addSubscription = (subInput: Omit<SubscriptionRecord, 'id' | 'createdAt'>) => {
    const newSub: SubscriptionRecord = {
      ...subInput,
      id: `sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  const updateSubscription = (id: string, updates: Partial<SubscriptionRecord>) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  // Bills
  const addBill = (billInput: Omit<BillRecord, 'id'>) => {
    const newBill: BillRecord = {
      ...billInput,
      id: `bill_${Date.now()}`,
    };
    setBills((prev) => [newBill, ...prev]);
  };

  const updateBill = (id: string, updates: Partial<BillRecord>) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  const markBillAsPaid = (id: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'Paid', paidAt: new Date().toISOString() } : b
      )
    );
  };

  // Credentials
  const addCredential = (credInput: Omit<CredentialRecord, 'id'>) => {
    const newCred: CredentialRecord = {
      ...credInput,
      id: `cred_${Date.now()}`,
    };
    setCredentials((prev) => [newCred, ...prev]);
  };

  const updateCredential = (id: string, updates: Partial<CredentialRecord>) => {
    setCredentials((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCredential = (id: string) => {
    setCredentials((prev) => prev.filter((c) => c.id !== id));
  };

  // Family
  const addFamilyMember = (memberInput: Omit<FamilyMember, 'id' | 'joinedDate'>) => {
    const newMember: FamilyMember = {
      ...memberInput,
      id: `fam_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setFamilyMembers((prev) => [...prev, newMember]);
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    // Remove from doc shares
    setDocuments((prev) =>
      prev.map((d) => ({
        ...d,
        sharedWithFamilyIds: d.sharedWithFamilyIds.filter((fid) => fid !== id),
      }))
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Vault Lock & Auth
  const lockVault = () => {
    setIsLocked(true);
  };

  const unlockVault = (pin: string) => {
    // Default demo PIN: "1234"
    if (pin === '1234' || pin.length === 4) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    setUser({
      ...INITIAL_USER,
      isMasterUnlocked: true,
      role: 'owner',
      accessLevel: 'Owner',
    });
    setIsLocked(false);
  };

  const loginAsGoogleMember = (account: {
    id?: string;
    name: string;
    email: string;
    avatar: string;
    relationship?: string;
    memberId?: string;
    accessLevel?: 'Owner' | 'View Only' | 'Download' | 'Full Access';
    role?: 'owner' | 'family_member';
  }) => {
    const isOwner = account.role === 'owner' || account.email === INITIAL_USER.email;
    setUser({
      id: account.id || `usr_${Date.now()}`,
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      googleSubId: `google-oauth2|${Date.now()}`,
      isMasterUnlocked: true,
      storageUsedMb: isOwner ? user.storageUsedMb : 124.0,
      storageLimitMb: user.storageLimitMb,
      currencyPreference: 'USD',
      role: isOwner ? 'owner' : 'family_member',
      memberId: account.memberId,
      relationship: account.relationship,
      accessLevel: account.accessLevel || (isOwner ? 'Owner' : 'Full Access'),
    });
    setIsLocked(false);

    // Notify switch
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Signed in as ${account.name}`,
      message: `Google OAuth session established. Active role: ${account.relationship || 'Account Owner'} (${account.accessLevel || 'Owner'}).`,
      type: 'info',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const switchBackToOwner = () => {
    loginWithGoogle();
  };

  const logout = () => {
    setIsLocked(true);
  };

  // Accessible documents for the currently logged-in account
  const accessibleDocuments = React.useMemo(() => {
    if (user.role === 'owner' || !user.memberId) {
      return documents;
    }
    // Family member view: documents explicitly shared with this family member
    return documents.filter((d) => d.sharedWithFamilyIds.includes(user.memberId || ''));
  }, [documents, user]);

  // Calculate expiring items
  const now = new Date();
  const expiringSoonItems = React.useMemo(() => {
    const list: Array<{
      id: string;
      type: 'document' | 'subscription' | 'bill';
      title: string;
      category: string;
      date: string;
      daysRemaining: number;
      amount?: number;
    }> = [];

    // Documents with expiryDate
    documents.forEach((d) => {
      if (d.expiryDate) {
        const exp = new Date(d.expiryDate);
        const diffTime = exp.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 90) {
          list.push({
            id: d.id,
            type: 'document',
            title: d.title,
            category: d.category,
            date: d.expiryDate,
            daysRemaining: diffDays,
            amount: d.amount,
          });
        }
      }
    });

    // Subscriptions with nextRenewalDate
    subscriptions.forEach((s) => {
      if (s.nextRenewalDate) {
        const ren = new Date(s.nextRenewalDate);
        const diffTime = ren.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 45) {
          list.push({
            id: s.id,
            type: 'subscription',
            title: s.serviceName,
            category: s.category,
            date: s.nextRenewalDate,
            daysRemaining: diffDays,
            amount: s.cost,
          });
        }
      }
    });

    // Bills with dueDate
    bills.forEach((b) => {
      if (b.status !== 'Paid' && b.dueDate) {
        const due = new Date(b.dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        list.push({
          id: b.id,
          type: 'bill',
          title: b.title,
          category: b.category,
          date: b.dueDate,
          daysRemaining: diffDays,
          amount: b.amount,
        });
      }
    });

    return list.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [documents, subscriptions, bills]);

  const monthlySubscriptionCost = React.useMemo(() => {
    return subscriptions.reduce((sum, s) => {
      if (s.billingCycle === 'Monthly') return sum + s.cost;
      if (s.billingCycle === 'Yearly') return sum + s.cost / 12;
      if (s.billingCycle === 'Quarterly') return sum + s.cost / 3;
      return sum + s.cost;
    }, 0);
  }, [subscriptions]);

  const pendingBillsCost = React.useMemo(() => {
    return bills.filter((b) => b.status !== 'Paid').reduce((sum, b) => sum + b.amount, 0);
  }, [bills]);

  // Compute Comprehensive Financial & Task Health Metrics
  const healthMetrics = React.useMemo<import('../types/vault').FinancialTaskHealthMetrics>(() => {
    const totalMonthlyCommitment = monthlySubscriptionCost + pendingBillsCost;
    const projectedAnnualCommitment = monthlySubscriptionCost * 12 + pendingBillsCost * 12;

    const overdueBills = bills.filter((b) => {
      if (b.status === 'Paid') return false;
      const due = new Date(b.dueDate);
      return due.getTime() < now.getTime();
    });

    const upcomingRenewals30d = expiringSoonItems.filter((i) => i.daysRemaining <= 30);
    const criticalRenewals15d = expiringSoonItems.filter((i) => i.daysRemaining <= 15);

    // Financial health score
    const totalBills = bills.length || 1;
    const paidBills = bills.filter((b) => b.status === 'Paid').length;
    const paidRatio = paidBills / totalBills;
    let finScore = Math.round(75 + paidRatio * 20 - overdueBills.length * 15);
    finScore = Math.max(35, Math.min(98, finScore));

    // Task health score
    let taskScore = 96 - criticalRenewals15d.length * 9 - upcomingRenewals30d.length * 3;
    taskScore = Math.max(40, Math.min(99, taskScore));

    // Compliance score (documents verified & up to date)
    const totalDocs = documents.length || 1;
    const verifiedDocs = documents.filter((d) => d.verifiedStatus === 'Verified').length;
    const complianceScore = Math.round((verifiedDocs / totalDocs) * 100);

    const overallScore = Math.round(finScore * 0.45 + taskScore * 0.35 + complianceScore * 0.20);
    let grade = 'A';
    if (overallScore >= 92) grade = 'A+';
    else if (overallScore >= 87) grade = 'A';
    else if (overallScore >= 80) grade = 'A-';
    else if (overallScore >= 74) grade = 'B+';
    else if (overallScore >= 65) grade = 'B';
    else grade = 'C';

    const recommendations = [];

    if (criticalRenewals15d.length > 0) {
      const topCritical = criticalRenewals15d[0];
      recommendations.push({
        id: 'rec_urgent_renewal',
        type: 'urgent_task' as const,
        title: `${topCritical.title} expires in ${topCritical.daysRemaining} days`,
        impact: `Action required to avoid lapse or penalty on ${topCritical.category}`,
        trendTag: 'Critical Expiry',
        actionLabel: 'Resolve Expiry',
        actionTarget: 'expiries',
      });
    }

    const pendingBillsList = bills.filter((b) => b.status !== 'Paid');
    if (pendingBillsList.length > 0) {
      const earliestBill = [...pendingBillsList].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0];
      recommendations.push({
        id: 'rec_bill_due',
        type: 'saving' as const,
        title: `${earliestBill.title} due on ${earliestBill.dueDate} ($${earliestBill.amount.toFixed(2)})`,
        impact: 'Maintain 95% on-time payment record without late surcharges',
        trendTag: '+4.2% On-time Rate',
        actionLabel: 'Review Bill',
        actionTarget: 'bills',
      });
    }

    if (subscriptions.length >= 3) {
      recommendations.push({
        id: 'rec_sub_opt',
        type: 'optimization' as const,
        title: `Optimize ${subscriptions.length} subscriptions ($${monthlySubscriptionCost.toFixed(2)}/mo burn)`,
        impact: 'Potential $85 - $130 annual savings via annual tier discounts or family bundles',
        trendTag: 'Spend Optimization',
        actionLabel: 'Review Subscriptions',
        actionTarget: 'subscriptions',
      });
    }

    return {
      overallScore,
      grade,
      financialScore: finScore,
      taskScore,
      complianceScore,
      totalMonthlyCommitment,
      projectedAnnualCommitment,
      pendingBillsTotal: pendingBillsCost,
      overdueBillsCount: overdueBills.length,
      upcomingRenewals30dCount: upcomingRenewals30d.length,
      trends: {
        monthlyBurnTrendPercent: 3.8,
        monthlyBurnTrendDirection: 'up' as const,
        onTimePaymentRate: Math.round(paidRatio * 100),
        onTimePaymentDelta: 4.8,
        taskCompletionRate: taskScore,
        taskCompletionDelta: 6.2,
        subscriptionEfficiency: 88,
        subscriptionEfficiencyTrend: 'up' as const,
      },
      breakdown: {
        billsHealth: overdueBills.length > 0 ? 'Needs Attention' : paidRatio > 0.6 ? 'Excellent' : 'Good',
        subscriptionsHealth: monthlySubscriptionCost > 150 ? 'Heavy Burn' : monthlySubscriptionCost > 70 ? 'Moderate' : 'Optimized',
        expiryTaskHealth: criticalRenewals15d.length > 0 ? 'Critical' : upcomingRenewals30d.length > 0 ? 'Attention Required' : 'Proactive',
      },
      recommendations,
    };
  }, [monthlySubscriptionCost, pendingBillsCost, bills, expiringSoonItems, documents]);

  return (
    <VaultContext.Provider
      value={{
        user,
        documents,
        subscriptions,
        bills,
        credentials,
        familyMembers,
        notifications,
        cloudState,
        activeTab,
        setActiveTab,
        searchModalOpen,
        setSearchModalOpen,
        chatAssistantOpen,
        setChatAssistantOpen,
        cloudArchitectureOpen,
        setCloudArchitectureOpen,
        uploadModalOpen,
        setUploadModalOpen,
        googleAuthModalOpen,
        setGoogleAuthModalOpen,
        previewDoc,
        setPreviewDoc,
        accessibleDocuments,
        addDocument,
        updateDocument,
        deleteDocument,
        toggleFavoriteDoc,
        toggleFamilyDocShare,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        addBill,
        updateBill,
        deleteBill,
        markBillAsPaid,
        addCredential,
        updateCredential,
        deleteCredential,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        markNotificationRead,
        clearAllNotifications,
        unreadCount,
        lockVault,
        unlockVault,
        isLocked,
        loginWithGoogle,
        loginAsGoogleMember,
        switchBackToOwner,
        logout,
        expiringSoonItems,
        monthlySubscriptionCost,
        pendingBillsCost,
        healthMetrics,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};

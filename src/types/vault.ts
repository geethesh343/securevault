export type DocumentCategory =
  | 'Identity'
  | 'Insurance'
  | 'Education'
  | 'Warranties'
  | 'Bills'
  | 'Medical'
  | 'Vehicle'
  | 'General';

export interface DocumentRecord {
  id: string;
  title: string;
  category: DocumentCategory;
  fileName: string;
  fileType: string;
  fileSize: string; // e.g., '1.8 MB'
  s3Key: string;
  s3Url: string;
  presignedUrlExpiresAt?: string;
  documentNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  renewalDate?: string;
  amount?: number;
  ocrSummary: string;
  tags: string[];
  sharedWithFamilyIds: string[]; // family member IDs
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  verifiedStatus: 'Verified' | 'Pending' | 'Needs Review';
}

export type SubscriptionCategory =
  | 'Streaming'
  | 'Cloud & AI'
  | 'Software'
  | 'Fitness & Health'
  | 'Broadband & Utilities'
  | 'Finance'
  | 'Other';

export interface SubscriptionRecord {
  id: string;
  serviceName: string;
  provider: string;
  category: SubscriptionCategory;
  cost: number;
  currency: string;
  billingCycle: 'Monthly' | 'Yearly' | 'Quarterly';
  nextRenewalDate: string;
  paymentMethod: string;
  autoRenew: boolean;
  color: string;
  remindersEnabled: boolean;
  reminderDaysBefore: number;
  notes?: string;
  createdAt: string;
}

export type BillCategory =
  | 'Electricity'
  | 'Water & Gas'
  | 'Internet & Mobile'
  | 'Rent & Housing'
  | 'Credit Card'
  | 'Insurance Premium'
  | 'Medical Bill'
  | 'Other';

export interface BillRecord {
  id: string;
  title: string;
  biller: string;
  category: BillCategory;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  recurring: boolean;
  receiptDocId?: string;
  paidAt?: string;
  notes?: string;
}

export type CredentialCategory =
  | 'Web & App'
  | 'Banking & Card'
  | 'WiFi & Network'
  | 'Software License'
  | 'Govt Portal'
  | 'Secure Note';

export interface CredentialRecord {
  id: string;
  title: string;
  category: CredentialCategory;
  username: string;
  password: string;
  websiteUrl?: string;
  notes?: string;
  twoFactorKey?: string;
  strengthScore: number; // 0-100
  lastRotatedDate: string;
  isFavorite: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Guardian' | 'Other';
  email: string;
  avatarUrl: string;
  accessLevel: 'View Only' | 'Download' | 'Full Access';
  accessibleDocumentIds: string[];
  status: 'Active' | 'Pending Invitation';
  joinedDate: string;
  phone?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  relatedType?: 'document' | 'subscription' | 'bill' | 'family';
  relatedId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  googleSubId: string;
  isMasterUnlocked: boolean;
  storageUsedMb: number;
  storageLimitMb: number;
  currencyPreference: string;
  role: 'owner' | 'family_member';
  memberId?: string;
  relationship?: string;
  accessLevel?: 'Owner' | 'View Only' | 'Download' | 'Full Access';
}

export interface FinancialTaskHealthMetrics {
  overallScore: number; // 0 - 100
  grade: string; // e.g. "A", "B+"
  financialScore: number;
  taskScore: number;
  complianceScore: number;
  totalMonthlyCommitment: number;
  projectedAnnualCommitment: number;
  pendingBillsTotal: number;
  overdueBillsCount: number;
  upcomingRenewals30dCount: number;
  trends: {
    monthlyBurnTrendPercent: number; // e.g. +3.8%
    monthlyBurnTrendDirection: 'up' | 'down' | 'stable';
    onTimePaymentRate: number; // e.g. 94%
    onTimePaymentDelta: number; // e.g. +4%
    taskCompletionRate: number; // e.g. 89%
    taskCompletionDelta: number; // e.g. +7%
    subscriptionEfficiency: number; // e.g. 86%
    subscriptionEfficiencyTrend: 'up' | 'down' | 'stable';
  };
  breakdown: {
    billsHealth: 'Excellent' | 'Good' | 'Needs Attention';
    subscriptionsHealth: 'Optimized' | 'Moderate' | 'Heavy Burn';
    expiryTaskHealth: 'Proactive' | 'Attention Required' | 'Critical';
  };
  recommendations: Array<{
    id: string;
    type: 'saving' | 'urgent_task' | 'optimization' | 'security';
    title: string;
    impact: string;
    trendTag: string;
    actionLabel: string;
    actionTarget: string;
  }>;
}

export interface CloudInfrastructureState {
  ec2Status: 'Healthy' | 'Degraded';
  ec2CpuUsage: number;
  ec2InstanceId: string;
  ec2Region: string;
  ec2Uptime: string;
  s3BucketName: string;
  s3TotalObjects: number;
  s3StorageSizeMb: number;
  s3Encryption: string;
  s3Versioning: boolean;
  rdsEngine: string;
  rdsConnections: number;
  rdsStatus: 'Available' | 'Backing Up';
  rdsTablesCount: number;
  cloudWatchActiveAlarms: number;
  cloudWatchLogRate: string;
  cloudWatchLastEvent: string;
}

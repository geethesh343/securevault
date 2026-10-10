export interface OcrParseResponse {
  success: boolean;
  data?: {
    title: string;
    category: string;
    documentNumber?: string;
    issuingAuthority?: string;
    issueDate?: string;
    expiryDate?: string;
    renewalDate?: string;
    amount?: number;
    ocrSummary: string;
    tags: string[];
    suggestedReminderDays?: number;
  };
  source?: string;
  error?: string;
}

export interface SmartSearchResponse {
  success: boolean;
  answer: string;
  relevanceReason?: string;
  matches: {
    documents: string[];
    subscriptions: string[];
    bills: string[];
    credentials: string[];
  };
  source?: string;
  error?: string;
}

export interface ChatVaultResponse {
  reply: string;
  suggestedActions?: string[];
  error?: string;
}

export interface AuditResponse {
  success: boolean;
  data?: {
    healthScore: number;
    summary: string;
    recommendations: Array<{
      type: 'critical' | 'warning' | 'tip' | 'success';
      title: string;
      description: string;
      actionLabel?: string;
    }>;
  };
}

export async function parseDocumentOcr(payload: {
  fileName: string;
  fileType?: string;
  textContent?: string;
  sampleType?: string;
}): Promise<OcrParseResponse> {
  const res = await fetch('/api/ai/ocr-parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to parse OCR: ${res.statusText}`);
  }
  return res.json();
}

export async function performSmartSearch(payload: {
  query: string;
  vaultData: any;
}): Promise<SmartSearchResponse> {
  const res = await fetch('/api/ai/smart-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Smart Search failed: ${res.statusText}`);
  }
  return res.json();
}

export async function chatWithVault(payload: {
  message: string;
  chatHistory: Array<{ role: string; content: string }>;
  vaultSummary: any;
}): Promise<ChatVaultResponse> {
  const res = await fetch('/api/ai/chat-vault', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Chat assistant failed: ${res.statusText}`);
  }
  return res.json();
}

export async function runVaultAudit(vaultData: any): Promise<AuditResponse> {
  const res = await fetch('/api/ai/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vaultData }),
  });
  if (!res.ok) {
    throw new Error(`Audit failed: ${res.statusText}`);
  }
  return res.json();
}

export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  session: {
    token: string;
    tokenType: string;
    algorithm: string;
    issuedAt: string;
    expiresAt: string;
    encryption: string;
    securityLevel: string;
    verifiedEmail: boolean;
  };
  user: {
    name: string;
    email: string;
    googleSubId: string;
    avatar: string;
    role: 'owner' | 'family_member';
    accessLevel: 'Owner' | 'View Only' | 'Download' | 'Full Access';
    authProvider: 'google' | 'google_workspace';
  };
}

export async function verifyGoogleAuth(payload: {
  email: string;
  name?: string;
  idToken?: string;
  twoFactorCode?: string;
  role?: string;
}): Promise<GoogleAuthResponse> {
  const res = await fetch('/api/auth/google/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Authentication failed: ${res.statusText}`);
  }
  return res.json();
}

export async function verify2FACode(payload: {
  code: string;
  email: string;
}): Promise<{ success: boolean; message: string; securityLevel: string }> {
  const res = await fetch('/api/auth/2fa/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `2FA verification failed: ${res.statusText}`);
  }
  return res.json();
}


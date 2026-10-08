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

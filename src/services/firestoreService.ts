import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  DocumentRecord,
  SubscriptionRecord,
  BillRecord,
  CredentialRecord,
  UserProfile,
} from '../types/vault';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ---------------------------------------------------------------------------
// User Profile Operations (/users/{userId})
// ---------------------------------------------------------------------------

export async function upsertUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userPath = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        id: uid,
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userPath = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }
}

// ---------------------------------------------------------------------------
// Documents Operations (/users/{userId}/documents/{documentId})
// ---------------------------------------------------------------------------

export function subscribeToDocuments(
  uid: string,
  onData: (docs: DocumentRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/documents`;
  const colRef = collection(db, 'users', uid, 'documents');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: DocumentRecord[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as DocumentRecord);
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

export async function addDocumentRecord(uid: string, record: DocumentRecord): Promise<void> {
  const path = `users/${uid}/documents/${record.id}`;
  try {
    const docRef = doc(db, 'users', uid, 'documents', record.id);
    await setDoc(docRef, {
      ...record,
      ownerId: uid,
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateDocumentRecord(
  uid: string,
  docId: string,
  updates: Partial<DocumentRecord>
): Promise<void> {
  const path = `users/${uid}/documents/${docId}`;
  try {
    const docRef = doc(db, 'users', uid, 'documents', docId);
    await updateDoc(docRef, {
      ...updates,
      ownerId: uid,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteDocumentRecord(uid: string, docId: string): Promise<void> {
  const path = `users/${uid}/documents/${docId}`;
  try {
    const docRef = doc(db, 'users', uid, 'documents', docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------------------------------------------------------------------
// Subscriptions Operations (/users/{userId}/subscriptions/{subId})
// ---------------------------------------------------------------------------

export function subscribeToSubscriptions(
  uid: string,
  onData: (subs: SubscriptionRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/subscriptions`;
  const colRef = collection(db, 'users', uid, 'subscriptions');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: SubscriptionRecord[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as SubscriptionRecord);
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

export async function addSubscriptionRecord(uid: string, record: SubscriptionRecord): Promise<void> {
  const path = `users/${uid}/subscriptions/${record.id}`;
  try {
    const docRef = doc(db, 'users', uid, 'subscriptions', record.id);
    await setDoc(docRef, {
      ...record,
      ownerId: uid,
      createdAt: record.createdAt || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateSubscriptionRecord(
  uid: string,
  subId: string,
  updates: Partial<SubscriptionRecord>
): Promise<void> {
  const path = `users/${uid}/subscriptions/${subId}`;
  try {
    const docRef = doc(db, 'users', uid, 'subscriptions', subId);
    await updateDoc(docRef, {
      ...updates,
      ownerId: uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteSubscriptionRecord(uid: string, subId: string): Promise<void> {
  const path = `users/${uid}/subscriptions/${subId}`;
  try {
    const docRef = doc(db, 'users', uid, 'subscriptions', subId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------------------------------------------------------------------
// Bills Operations (/users/{userId}/bills/{billId})
// ---------------------------------------------------------------------------

export function subscribeToBills(
  uid: string,
  onData: (bills: BillRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/bills`;
  const colRef = collection(db, 'users', uid, 'bills');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: BillRecord[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as BillRecord);
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

export async function addBillRecord(uid: string, record: BillRecord): Promise<void> {
  const path = `users/${uid}/bills/${record.id}`;
  try {
    const docRef = doc(db, 'users', uid, 'bills', record.id);
    await setDoc(docRef, {
      ...record,
      ownerId: uid,
      createdAt: record.createdAt || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBillRecord(
  uid: string,
  billId: string,
  updates: Partial<BillRecord>
): Promise<void> {
  const path = `users/${uid}/bills/${billId}`;
  try {
    const docRef = doc(db, 'users', uid, 'bills', billId);
    await updateDoc(docRef, {
      ...updates,
      ownerId: uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteBillRecord(uid: string, billId: string): Promise<void> {
  const path = `users/${uid}/bills/${billId}`;
  try {
    const docRef = doc(db, 'users', uid, 'bills', billId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------------------------------------------------------------------
// Credentials Operations (/users/{userId}/credentials/{credId})
// ---------------------------------------------------------------------------

export function subscribeToCredentials(
  uid: string,
  onData: (creds: CredentialRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/credentials`;
  const colRef = collection(db, 'users', uid, 'credentials');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: CredentialRecord[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as CredentialRecord);
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

export async function addCredentialRecord(uid: string, record: CredentialRecord): Promise<void> {
  const path = `users/${uid}/credentials/${record.id}`;
  try {
    const docRef = doc(db, 'users', uid, 'credentials', record.id);
    await setDoc(docRef, {
      ...record,
      ownerId: uid,
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCredentialRecord(
  uid: string,
  credId: string,
  updates: Partial<CredentialRecord>
): Promise<void> {
  const path = `users/${uid}/credentials/${credId}`;
  try {
    const docRef = doc(db, 'users', uid, 'credentials', credId);
    await updateDoc(docRef, {
      ...updates,
      ownerId: uid,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCredentialRecord(uid: string, credId: string): Promise<void> {
  const path = `users/${uid}/credentials/${credId}`;
  try {
    const docRef = doc(db, 'users', uid, 'credentials', credId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

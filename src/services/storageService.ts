import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface StorageUploadResult {
  storagePath: string;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  sizeBytes: number;
}

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB limit

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'text/plain',
];

export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is 15MB.`,
    };
  }

  // Allow standard PDFs, images, or files with matching extensions
  const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type);
  const ext = file.name.split('.').pop()?.toLowerCase();
  const isAllowedExt = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'txt'].includes(ext || '');

  if (!isAllowedMime && !isAllowedExt) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload a PDF, PNG, JPG, or WEBP document.',
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function uploadDocumentToCloudStorage(
  uid: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<StorageUploadResult> {
  const validation = validateDocumentFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `users/${uid}/documents/${timestamp}_${cleanName}`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
      customMetadata: {
        originalName: file.name,
        uploadedBy: uid,
      },
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(new Error(`Storage upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            storagePath,
            downloadUrl,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            fileType: file.type || 'application/pdf',
            sizeBytes: file.size,
          });
        } catch (err: any) {
          reject(new Error(`Failed to retrieve download URL: ${err.message}`));
        }
      }
    );
  });
}

export async function deleteDocumentFromCloudStorage(storagePath: string): Promise<void> {
  if (!storagePath) return;
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error: any) {
    console.warn(`Storage file delete notice for ${storagePath}:`, error?.message);
  }
}

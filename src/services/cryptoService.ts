// Client-Side Zero-Knowledge Cryptographic Service using Web Crypto API (AES-256-GCM + PBKDF2)

export interface EncryptionResult {
  formattedPayload: string; // "ENC:v1:<saltHex>:<ivHex>:<ciphertextHex>"
  algorithm: 'AES-256-GCM';
  saltHex: string;
  ivHex: string;
  ciphertextHex: string;
  derivedKeyBits: 256;
  iterations: number;
}

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH_BITS = 256;

// Convert Uint8Array to hex string
export function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string to Uint8Array
export function hexToBuffer(hex: string): Uint8Array {
  const cleanHex = hex.trim();
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Check if a string is an encrypted vault payload
export function isEncryptedPayload(text: string): boolean {
  return typeof text === 'string' && text.startsWith('ENC:v1:');
}

// Derive AES-GCM-256 CryptoKey from Master Password using PBKDF2-SHA-256
async function deriveEncryptionKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(masterPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH_BITS },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a plaintext password or note using AES-256-GCM with a random salt & IV.
 */
export async function encryptWithMasterPassword(
  plaintext: string,
  masterPassword: string
): Promise<EncryptionResult> {
  if (!plaintext) {
    throw new Error('Plaintext cannot be empty for encryption.');
  }
  if (!masterPassword) {
    throw new Error('Master password is required to derive the encryption key.');
  }

  // 1. Generate 16-byte random salt for PBKDF2
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  // 2. Generate 12-byte random Initialization Vector (IV) for AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 3. Derive 256-bit AES-GCM key
  const key = await deriveEncryptionKey(masterPassword, salt);

  // 4. Encrypt the UTF-8 plaintext
  const enc = new TextEncoder();
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
    },
    key,
    enc.encode(plaintext)
  );

  const ciphertextArray = new Uint8Array(ciphertextBuffer);
  const saltHex = bufferToHex(salt);
  const ivHex = bufferToHex(iv);
  const ciphertextHex = bufferToHex(ciphertextArray);

  const formattedPayload = `ENC:v1:${saltHex}:${ivHex}:${ciphertextHex}`;

  return {
    formattedPayload,
    algorithm: 'AES-256-GCM',
    saltHex,
    ivHex,
    ciphertextHex,
    derivedKeyBits: KEY_LENGTH_BITS,
    iterations: PBKDF2_ITERATIONS,
  };
}

/**
 * Decrypt an AES-256-GCM payload using the Master Password.
 */
export async function decryptWithMasterPassword(
  encryptedPayload: string,
  masterPassword: string
): Promise<string> {
  if (!encryptedPayload) {
    return '';
  }

  // If not encrypted, return as is (for backwards compatibility)
  if (!isEncryptedPayload(encryptedPayload)) {
    return encryptedPayload;
  }

  if (!masterPassword) {
    throw new Error('Master password is required to decrypt this record.');
  }

  const parts = encryptedPayload.split(':');
  if (parts.length !== 5 || parts[0] !== 'ENC' || parts[1] !== 'v1') {
    throw new Error('Malformed encrypted ciphertext payload structure.');
  }

  const saltHex = parts[2];
  const ivHex = parts[3];
  const ciphertextHex = parts[4];

  try {
    const salt = hexToBuffer(saltHex);
    const iv = hexToBuffer(ivHex);
    const ciphertext = hexToBuffer(ciphertextHex);

    // Derive key
    const key = await deriveEncryptionKey(masterPassword, salt);

    // Decrypt AES-GCM
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      ciphertext as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Decryption failed: Incorrect master password or tampered ciphertext.');
  }
}

/**
 * Verify if a master password correctly decrypts a sample verification hash.
 */
export async function testMasterPassword(
  testPayload: string,
  masterPassword: string
): Promise<boolean> {
  try {
    const result = await decryptWithMasterPassword(testPayload, masterPassword);
    return result.length > 0;
  } catch {
    return false;
  }
}

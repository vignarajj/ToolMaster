import { encodeBase64, decodeBase64 } from './crypto-utils';

// Caesar Cipher
export function caesarCipher(text: string, shift: number, decrypt: boolean = false): string {
  const actualShift = decrypt ? -shift : shift;
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Handle uppercase letters
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + actualShift + 26) % 26) + 65);
    }
    
    // Handle lowercase letters
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + actualShift + 26) % 26) + 97);
    }
    
    // Leave other characters unchanged
    return char;
  }).join('');
}

// AES Encryption/Decryption (using Web Crypto API)
export async function generateAESKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  const exported = await crypto.subtle.exportKey('raw', key);
  const keyBytes = new Uint8Array(exported);
  return encodeBase64(String.fromCharCode.apply(null, Array.from(keyBytes)));
}

export async function importAESKey(keyBase64: string): Promise<CryptoKey> {
  try {
    const keyData = decodeBase64(keyBase64);
    const keyBytes = new Uint8Array(keyData.split('').map(c => c.charCodeAt(0)));
    
    return await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    throw new Error('Invalid AES key format');
  }
}

export async function aesEncrypt(plaintext: string, keyBase64: string): Promise<string> {
  try {
    const key = await importAESKey(keyBase64);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
    
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return encodeBase64(String.fromCharCode.apply(null, Array.from(combined)));
  } catch (error) {
    throw new Error('AES encryption failed');
  }
}

export async function aesDecrypt(ciphertext: string, keyBase64: string): Promise<string> {
  try {
    const key = await importAESKey(keyBase64);
    const combined = decodeBase64(ciphertext);
    const combinedBytes = new Uint8Array(combined.split('').map(c => c.charCodeAt(0)));
    
    // Extract IV and encrypted data
    const iv = combinedBytes.slice(0, 12);
    const encrypted = combinedBytes.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('AES decryption failed - invalid ciphertext or key');
  }
}

// RSA Key Generation and Encryption/Decryption
export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export async function generateRSAKeys(): Promise<RSAKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKeyExported = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKeyExported = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const publicBytes = new Uint8Array(publicKeyExported);
  const privateBytes = new Uint8Array(privateKeyExported);
  
  return {
    publicKey: encodeBase64(String.fromCharCode.apply(null, Array.from(publicBytes))),
    privateKey: encodeBase64(String.fromCharCode.apply(null, Array.from(privateBytes))),
  };
}

export async function importRSAPublicKey(publicKeyBase64: string): Promise<CryptoKey> {
  try {
    const keyData = decodeBase64(publicKeyBase64);
    const keyBytes = new Uint8Array(keyData.split('').map(c => c.charCodeAt(0)));
    
    return await crypto.subtle.importKey(
      'spki',
      keyBytes,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );
  } catch (error) {
    throw new Error('Invalid RSA public key format');
  }
}

export async function importRSAPrivateKey(privateKeyBase64: string): Promise<CryptoKey> {
  try {
    const keyData = decodeBase64(privateKeyBase64);
    const keyBytes = new Uint8Array(keyData.split('').map(c => c.charCodeAt(0)));
    
    return await crypto.subtle.importKey(
      'pkcs8',
      keyBytes,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    );
  } catch (error) {
    throw new Error('Invalid RSA private key format');
  }
}

export async function rsaEncrypt(plaintext: string, publicKeyBase64: string): Promise<string> {
  try {
    const publicKey = await importRSAPublicKey(publicKeyBase64);
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      data
    );
    
    const encryptedBytes = new Uint8Array(encrypted);
    return encodeBase64(String.fromCharCode.apply(null, Array.from(encryptedBytes)));
  } catch (error) {
    throw new Error('RSA encryption failed');
  }
}

export async function rsaDecrypt(ciphertext: string, privateKeyBase64: string): Promise<string> {
  try {
    const privateKey = await importRSAPrivateKey(privateKeyBase64);
    const encryptedBytes = new Uint8Array(decodeBase64(ciphertext).split('').map(c => c.charCodeAt(0)));
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedBytes
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('RSA decryption failed - invalid ciphertext or private key');
  }
}

// SHA-256 Hashing
export async function sha256Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  
  // Convert to hex string
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Utility function to generate random base64 key for demo purposes
export function generateRandomBase64Key(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return encodeBase64(String.fromCharCode.apply(null, Array.from(array)));
}

import { logger, errorToLogContext } from '../lib/logger';

export interface EncryptionKey {
  publicKey: string;
  privateKey: string;
  algorithm: 'RSA-OAEP' | 'AES-GCM';
  keySize: number;
}

export interface EncryptedData {
  data: string;
  iv: string;
  key: string;
  algorithm: string;
  timestamp: number;
}

export class EncryptionService {
  private keyCache: Map<string, CryptoKey> = new Map();
  private isSupported: boolean;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  private checkSupport(): boolean {
    return typeof window !== 'undefined' && 
           'crypto' in window && 
           'subtle' in window.crypto;
  }

  async generateKeyPair(algorithm: 'RSA-OAEP' = 'RSA-OAEP'): Promise<EncryptionKey> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: algorithm,
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      return {
        publicKey: this.arrayBufferToBase64(publicKey),
        privateKey: this.arrayBufferToBase64(privateKey),
        algorithm,
        keySize: 2048,
      };
    } catch (error) {
      logger.error('Key generation failed:', errorToLogContext(error));
      throw error;
    }
  }

  async generateAESKey(): Promise<CryptoKey> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      return await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      logger.error('AES key generation failed:', errorToLogContext(error));
      throw error;
    }
  }

  async encryptData(data: string, key: CryptoKey): Promise<EncryptedData> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);

      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encodedData.buffer
      );

      return {
        data: this.arrayBufferToBase64(encryptedData),
        iv: this.arrayBufferToBase64(iv.buffer),
        key: await this.exportKey(key),
        algorithm: 'AES-GCM',
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error('Encryption failed:', errorToLogContext(error));
      throw error;
    }
  }

  async decryptData(encryptedData: EncryptedData, key: CryptoKey): Promise<string> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const iv = this.base64ToArrayBuffer(encryptedData.iv);
      const data = this.base64ToArrayBuffer(encryptedData.data);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        data
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      logger.error('Decryption failed:', errorToLogContext(error));
      throw error;
    }
  }

  async encryptWithRSA(data: string, publicKey: string): Promise<string> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const key = await this.importRSAPublicKey(publicKey);
      const encodedData = new TextEncoder().encode(data);

      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        key,
        encodedData
      );

      return this.arrayBufferToBase64(encryptedData);
    } catch (error) {
      logger.error('RSA encryption failed:', errorToLogContext(error));
      throw error;
    }
  }

  async decryptWithRSA(encryptedData: string, privateKey: string): Promise<string> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const key = await this.importRSAPrivateKey(privateKey);
      const data = this.base64ToArrayBuffer(encryptedData);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        key,
        data
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      logger.error('RSA decryption failed:', errorToLogContext(error));
      throw error;
    }
  }

  async hashData(data: string, algorithm: 'SHA-256' | 'SHA-512' = 'SHA-256'): Promise<string> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const encodedData = new TextEncoder().encode(data);
      const hashBuffer = await window.crypto.subtle.digest(algorithm, encodedData);
      return this.arrayBufferToBase64(hashBuffer);
    } catch (error) {
      logger.error('Hashing failed:', errorToLogContext(error));
      throw error;
    }
  }

  async signData(data: string, privateKey: string): Promise<string> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const key = await this.importRSAPrivateKey(privateKey);
      const encodedData = new TextEncoder().encode(data);

      const signature = await window.crypto.subtle.sign(
        {
          name: 'RSA-PSS',
          saltLength: 32,
        },
        key,
        encodedData
      );

      return this.arrayBufferToBase64(signature);
    } catch (error) {
      logger.error('Signing failed:', errorToLogContext(error));
      throw error;
    }
  }

  async verifySignature(data: string, signature: string, publicKey: string): Promise<boolean> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const key = await this.importRSAPublicKey(publicKey);
      const encodedData = new TextEncoder().encode(data);
      const signatureBuffer = this.base64ToArrayBuffer(signature);

      return await window.crypto.subtle.verify(
        {
          name: 'RSA-PSS',
          saltLength: 32,
        },
        key,
        signatureBuffer,
        encodedData
      );
    } catch (error) {
      logger.error('Signature verification failed:', errorToLogContext(error));
      return false;
    }
  }

  async deriveKey(password: string, salt: string): Promise<CryptoKey> {
    if (!this.isSupported) {
      throw new Error('Web Crypto API not supported');
    }

    try {
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      const saltBuffer = this.base64ToArrayBuffer(salt);

      return await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        {
          name: 'AES-GCM',
          length: 256,
        },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      logger.error('Key derivation failed:', errorToLogContext(error));
      throw error;
    }
  }

  generateSalt(): string {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    return this.arrayBufferToBase64(salt.buffer);
  }

  async exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return this.arrayBufferToBase64(exported);
  }

  async importKey(keyData: string): Promise<CryptoKey> {
    const keyBuffer = this.base64ToArrayBuffer(keyData);
    return await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async importRSAPublicKey(publicKey: string): Promise<CryptoKey> {
    const keyBuffer = this.base64ToArrayBuffer(publicKey);
    return await window.crypto.subtle.importKey(
      'spki',
      keyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );
  }

  private async importRSAPrivateKey(privateKey: string): Promise<CryptoKey> {
    const keyBuffer = this.base64ToArrayBuffer(privateKey);
    return await window.crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['decrypt', 'sign']
    );
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < (bytes.byteLength ?? 0); i++) {
      binary += String.fromCharCode(bytes[i] ?? 0);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  isEncryptionSupported(): boolean {
    return this.isSupported;
  }

  async encryptFile(file: File, key: CryptoKey): Promise<EncryptedData> {
    const arrayBuffer = await file.arrayBuffer();
    const data = this.arrayBufferToBase64(arrayBuffer);
    return this.encryptData(data, key);
  }

  async decryptFile(encryptedData: EncryptedData, key: CryptoKey): Promise<Blob> {
    const decryptedData = await this.decryptData(encryptedData, key);
    const arrayBuffer = this.base64ToArrayBuffer(decryptedData);
    return new Blob([arrayBuffer]);
  }

  async encryptObject(obj: Record<string, unknown>, key: CryptoKey): Promise<EncryptedData> {
    const jsonString = JSON.stringify(obj);
    return this.encryptData(jsonString, key);
  }

  async decryptObject<T>(encryptedData: EncryptedData, key: CryptoKey): Promise<T> {
    const decryptedData = await this.decryptData(encryptedData, key);
    return JSON.parse(decryptedData);
  }
}

// Singleton instance
export const encryptionService = new EncryptionService();

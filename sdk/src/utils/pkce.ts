import { webcrypto } from 'crypto';

export function generateCodeVerifier(): string {
  const randomBytes = new Uint8Array(32);
  webcrypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(b => String.fromCharCode(b))
    .join('')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await webcrypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Base64url encode the hash
  return btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateState(): string {
  return crypto.randomUUID();
}

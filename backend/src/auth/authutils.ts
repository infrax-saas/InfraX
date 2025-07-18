import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { sign, verify } from 'jsonwebtoken';

interface GoogleIdTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  nonce?: string;
}

interface Jwk {
  kid: string;
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
}

let cachedJwks: { keys: Jwk[] } | null = null;
const JWKS_CACHE_EXPIRY = 3600 * 1000;
let lastJwksFetch = 0;

async function getGoogleJwks(): Promise<Jwk[]> {
  if (cachedJwks && Date.now() - lastJwksFetch < JWKS_CACHE_EXPIRY) {
    return cachedJwks.keys;
  }

  const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
  if (!response.ok) {
    throw new Error(`Failed to fetch Google JWKS: ${response.statusText}`);
  }
  cachedJwks = await response.json();
  lastJwksFetch = Date.now();
  if (cachedJwks == null) return [];
  return cachedJwks.keys;
}

export async function verifyGoogleIdToken(
  idToken: string,
  googleClientId: string,
  expectedNonce?: string
): Promise<GoogleIdTokenPayload> {

  const decodedTokenHeader = jwt.decode(idToken, { complete: true })?.header;
  if (!decodedTokenHeader || !decodedTokenHeader.kid) {
    throw new Error('Invalid ID Token header or missing kid.');
  }

  const jwks = await getGoogleJwks();
  const signingKey = jwks.find(key => key.kid === decodedTokenHeader.kid);

  if (!signingKey) {
    throw new Error('No matching signing key found for ID Token.');
  }

  const publicKey = jwkToPem(signingKey);

  return new Promise((resolve, reject) => {
    jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'], // Google uses RS256 for ID tokens
      audience: googleClientId,
      issuer: 'https://accounts.google.com', // Standard Google ID token issuer
      nonce: expectedNonce, // If you implement nonce
    }, (err, decoded) => {
      if (err) {
        return reject(new Error(`ID Token verification failed: ${err.message}`));
      }
      resolve(decoded as GoogleIdTokenPayload);
    });
  });

}

const INFRAX_JWT_SECRET = process.env.INFRAX_JWT_SECRET ?? "secret";

interface InfrAxJwtPayload {
  userId: string;
  email: string;
}

export function generateInfraXJwt(payload: InfrAxJwtPayload): string {
  return sign(payload, INFRAX_JWT_SECRET, { expiresIn: '1h' }); // Short-lived for access
}

export function verifyInfraXJwt(token: string): InfrAxJwtPayload {
  try {
    return verify(token, INFRAX_JWT_SECRET) as InfrAxJwtPayload;
  } catch (error: any) {
    throw new Error(`Invalid InfrAx session token: ${error.message}`);
  }
}

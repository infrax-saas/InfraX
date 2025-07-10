import crypto from 'crypto';
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m"; // or 5m/1h/1d depending on your use case

export function createAccessToken(payload: object): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): { valid: boolean; payload?: any; error?: any } {
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET as string);
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error };
  }
}


export function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex'); // 128-character token
}

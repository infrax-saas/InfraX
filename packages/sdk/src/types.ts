export interface User {
  id: string;
  email: string;
  username: string;
  image?: string;
  googleId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SDKConfig {
  apiKey: string;
  baseURL?: string;
  redirectUri?: string;
  scopes?: string[];
}

export interface GoogleAuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}


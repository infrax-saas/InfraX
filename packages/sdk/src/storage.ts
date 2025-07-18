export class TokenStorage {
  private static ACCESS_TOKEN_KEY = 'auth_access_token';
  private static REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private static USER_KEY = 'auth_user';
  private static EXPIRES_AT_KEY = 'auth_expires_at';

  static setTokens(tokens: { accessToken: string; refreshToken: string; expiresIn: number }): void {
    const expiresAt = Date.now() + (tokens.expiresIn * 1000);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
      localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static getExpiresAt(): number | null {
    if (typeof window !== 'undefined') {
      const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
      return expiresAt ? parseInt(expiresAt) : null;
    }
    return null;
  }

  static setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  static getUser(): any | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  static clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.EXPIRES_AT_KEY);
    }
  }

  static isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  }
}


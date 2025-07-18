import { generateCodeVerifier, generateCodeChallenge, generateState } from './utils/pkce';

interface InfraXAuthConfig {
  appId: string;
  infrAxBaseUrl: string;
  redirectUri: string;
  googleClientId: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  profilePictureUrl?: string;
}

class InfraXAuthClient {
  private config: InfraXAuthConfig;
  private infrAxSessionToken: string | null = null;

  constructor(config: InfraXAuthConfig) {
    this.config = config;
  }

  private setSessionStorage(key: string, value: string) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(`infraX_auth_${key}`, value);
    }
  }

  private getSessionStorage(key: string): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem(`infraX_auth_${key}`);
    }
    return null;
  }

  private removeSessionStorage(key: string) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(`infraX_auth_${key}`);
    }
  }

  public async loginWithGoogle(): Promise<void> {
    const { googleClientId, redirectUri, infrAxBaseUrl, appId } = this.config;

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateState();

    this.setSessionStorage('code_verifier', codeVerifier);
    this.setSessionStorage('state', state);

    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: `${infrAxBaseUrl}/auth/google/callback`,
      response_type: 'code',
      scope: 'openid profile email',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
    });

    if (typeof window !== 'undefined') {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } else {
      throw new Error("Cannot initiate Google login in a non-browser environment.");
    }
  }

  public async handleRedirectCallback(): Promise<User> {
    if (typeof window === 'undefined') {
      throw new Error("Cannot handle redirect callback in a non-browser environment.");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      this.clearSessionStorage();
      throw new Error(`Google OAuth Error: ${error}`);
    }

    if (!code || !state) {
      this.clearSessionStorage();
      throw new Error('Missing code or state in OAuth callback.');
    }

    const storedState = this.getSessionStorage('state');
    if (state !== storedState) {
      this.clearSessionStorage();
      throw new Error('CSRF attack detected: State mismatch.');
    }

    const codeVerifier = this.getSessionStorage('code_verifier');
    if (!codeVerifier) {
      this.clearSessionStorage();
      throw new Error('PKCE error: Missing code_verifier.');
    }

    try {
      const response = await fetch(`${this.config.infrAxBaseUrl}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-InfrAx-App-Id': this.config.appId,
        },
        body: JSON.stringify({
          code: code,
          codeVerifier: codeVerifier,
          redirectUri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`InfrAx Auth Error: ${errorData.message || 'Failed to authenticate with InfrAx server'}`);
      }

      const data = await response.json();
      this.infrAxSessionToken = data.infrAxSessionToken;
      this.removeSessionStorage('code_verifier');
      this.removeSessionStorage('state');

      return data.user as User;
    } catch (error) {
      console.error('Error during InfrAx callback handling:', error);
      this.clearSessionStorage();
      throw error;
    }
  }

  public async logout(): Promise<void> {
    this.infrAxSessionToken = null;
    this.clearSessionStorage();

    try {
      await fetch(`${this.config.infrAxBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.infrAxSessionToken}`,
        },
      });
    } catch (error) {
      console.error('Error notifying InfrAx server for logout:', error);
    }
  }

  public isAuthenticated(): boolean {
    return !!this.infrAxSessionToken;
  }

  public getSessionToken(): string | null {
    return this.infrAxSessionToken;
  }

  public async getUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }
    try {
      const response = await fetch(`${this.config.infrAxBaseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.infrAxSessionToken}`, // Assuming Bearer token for your APIs
        },
      });
      if (!response.ok) {
        // If 401, session might be expired, log out
        if (response.status === 401) {
          console.warn('InfrAx session expired, logging out.');
          await this.logout();
        }
        return null;
      }
      const userData = await response.json();
      return userData as User;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  private clearSessionStorage() {
    this.removeSessionStorage('code_verifier');
    this.removeSessionStorage('state');
  }
}

export { InfraXAuthClient, InfrAxAuthConfig, User };

export interface InfraXAuthClientOptions {
  googleClientId: string;
  githubClientId: string;
  redirectUri: string;
  backendBaseUrl: string;
  appId: string;
}

export class InfraXAuthClient {
  private googleClientId: string;
  private githubClientId: string;
  private redirectUri: string;
  private backendBaseUrl: string;
  private appId: string;

  constructor(options: InfraXAuthClientOptions) {
    this.googleClientId = options.googleClientId;
    this.githubClientId = options.githubClientId;
    this.redirectUri = options.redirectUri;
    this.backendBaseUrl = options.backendBaseUrl;
    this.appId = options.appId;
  }

  async registerUser(username: string, password: string, email: string) {
    const response = await fetch(`${this.backendBaseUrl}/api/v1/provider/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
        email,
        saasId: this.appId
      }),
    });
    const data = response.json();
    return data;
  }

  async signinUser(email: string, password: string) {
    const response = await fetch(`${this.backendBaseUrl}/api/v1/provider/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        password,
        email,
        saasId: this.appId
      }),
    });
    const data = response.json();
    return data;
  }

  async loginWithGitHub() {
    const state = this.generateRandomString(32);
    localStorage.setItem("infrax_state", state);

    const params = new URLSearchParams({
      client_id: this.githubClientId,
      redirect_uri: this.redirectUri,
      scope: "read:user user:email",
      state,
      allow_signup: "true",
    });

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    window.location.href = githubAuthUrl;
  }


  async handleGitHubRedirect() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const returnedState = url.searchParams.get("state");

    const savedState = localStorage.getItem("infrax_state");
    localStorage.removeItem("infrax_state");

    if (!code || !returnedState || !savedState) {
      throw new Error("Missing OAuth data in redirect.");
    }

    if (returnedState !== savedState) {
      throw new Error("Invalid state parameter.");
    }

    const response = await fetch(`${this.backendBaseUrl}/api/v1/provider/auth/github/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code,
        redirectUri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with backend.");
    }

    const data = await response.json();
    return data;
  }



  async loginWithGoogle() {
    const codeVerifier = this.generateRandomString(64);
    const state = this.generateRandomString(32);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    localStorage.setItem("infrax_code_verifier", codeVerifier);
    localStorage.setItem("infrax_state", state);

    const params = new URLSearchParams({
      client_id: this.googleClientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = googleAuthUrl;
  }

  async handleGoogleRedirect() {

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const returnedState = url.searchParams.get("state");

    const savedState = localStorage.getItem("infrax_state");
    const codeVerifier = localStorage.getItem("infrax_code_verifier");

    localStorage.removeItem("infrax_state");
    localStorage.removeItem("infrax_code_verifier");

    if (!code || !returnedState || !savedState || !codeVerifier) {
      throw new Error("Missing OAuth data in redirect.");
    }

    if (returnedState !== savedState) {
      throw new Error("Invalid state parameter.");
    }

    const response = await fetch(`${this.backendBaseUrl}/api/v1/provider/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code,
        codeVerifier,
        redirectUri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with backend.");
    }

    const data = await response.json();
    return data;
  }

  async getUser(): Promise<{
    id: string;
    email: string;
    username: string;
    image?: string;
  } | null> {
    try {
      const res = await fetch(`${this.backendBaseUrl}/api/v1/provider/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) throw Error("user not found");
      return await res.json();
    } catch (err) {
      console.error("getUser failed:", err);
      return null;
    }
  }


  private generateRandomString(length: number): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    let result = "";
    const cryptoObj = window.crypto || (window as any).msCrypto;
    const randomValues = new Uint32Array(length);
    cryptoObj.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    return result;
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return this.base64UrlEncode(new Uint8Array(digest));
  }

  private base64UrlEncode(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}


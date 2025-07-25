import { InfraXAuthClient } from "@repo/sdk";

export const infrax = new InfraXAuthClient({
  googleClientId: '109828676709-j49jrou39a5v57vue6bnn1ou2c3gd7af.apps.googleusercontent.com',
  githubClientId: '',
  backendBaseUrl: 'http://localhost:3001',
  redirectUri: 'http://localhost:5173/auth/callback',
  appId: '535cf6a46f6b9d1559060e1517b1bb5f0c8d9cab925cbc999fe22c47731c2faa'
})

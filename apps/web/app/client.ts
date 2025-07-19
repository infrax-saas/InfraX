import { InfraXAuthClient, User } from "@repo/sdk";

export const client = new InfraXAuthClient({
  googleClientId: "181396111505-jskgtqmbkjklrms5upcermme5vidubks.apps.googleusercontent.com",
  redirectUri: "http://localhost:3000/auth/google/callback", // this page should run `handleGoogleRedirect`
  backendBaseUrl: "http://localhost:3001",
});

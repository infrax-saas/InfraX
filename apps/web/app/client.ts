import { InfraXAuthClient, User } from "@repo/sdk";

export const client = new InfraXAuthClient({
  googleClientId: "",
  redirectUri: "http://localhost:3000/auth/google/callback", // this page should run `handleGoogleRedirect`
  backendBaseUrl: "http://localhost:3001",
  githubClientId: ""
});

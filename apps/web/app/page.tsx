'use client'
import { InfraXAuthClient, User } from "@repo/sdk";
import { useEffect, useState } from "react";


const authClient = new InfraXAuthClient({
  googleClientId: "181396111505-jskgtqmbkjklrms5upcermme5vidubks.apps.googleusercontent.com",
  redirectUri: "http://localhost:3000/auth/google/callback", // this page should run `handleGoogleRedirect`
  backendBaseUrl: "http://localhost:3001",
});
export default function Home() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await authClient.loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google login.");
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }
  return (
    <div>
      <h1>InfrAx Auth SDK Example</h1>
      {user ? (
        <div>
          <p>Welcome, {user.username || user.email}!</p>
          {user.image && <img src={user.image} alt="Profile" width="50" />}
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      )}
    </div>
  );
}

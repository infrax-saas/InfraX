'use client'
import { User } from "@repo/sdk";
import { useState } from "react";
import { client } from "./client";

export default function Home() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await client.loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google login.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      await client.loginWithGitHub();
    } catch (err) {
      console.log(err);
    }
  }

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
          <button onClick={handleGithubLogin} >login with github</button>
        </div>
      )}
    </div>
  );
}

'use client'

import { InfraXAuthClient, User } from "@repo/sdk";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const client = new InfraXAuthClient({
  googleClientId: "181396111505-jskgtqmbkjklrms5upcermme5vidubks.apps.googleusercontent.com",
  redirectUri: "http://localhost:3000/auth/google/callback",
  backendBaseUrl: "http://localhost:3001",
});

export default function GoogleCallbackPage() {
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log("insdei useEffect");
    const h = async () => {
      try {
      const user = await client.handleGoogleRedirect();
      console.log(user);
      } catch (error) {
        setError(error);
      }
    }
    h();
  }, []);

  if (error) return <div style={{ color: 'red' }}>Error: {JSON.stringify(error)}</div>;

  return <div>Handling Google login callback...</div>;
}


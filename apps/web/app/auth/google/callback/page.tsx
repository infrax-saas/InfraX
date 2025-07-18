'use client'

import { InfraXAuthClient, User } from "@repo/sdk";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { client } from "../../../client";

export default function GoogleCallbackPage() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("insdei useEffect");
    const h = async () => {
      try {
        const user = await client.handleGoogleRedirect();
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    }
    h();
  }, []);

  const getUser = async () => {
    try {
      const user = await client.getUser();
      console.log(user);
      user && setUser(user);
    } catch (err) {
      console.log(err);
    }
  }

  if (error) return <div style={{ color: 'red' }}>Error: {JSON.stringify(error)}</div>;

  return <div>Handling Google login callback...
    <button onClick={() => getUser()} >Get user</button>
    {
    }
  </div>;
}


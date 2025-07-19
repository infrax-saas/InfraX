'use client';
import { useState } from "react";
import { client } from "../client.ts"

export default function Dashboard() {

  const [user, setUser] = useState();
  const click = async () => {
    console.log("here");
    try {
      const user = await client.getUser();
      setUser(user);
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <button onClick={() => click()} >click</button>

        hello
    </div>
  )
}

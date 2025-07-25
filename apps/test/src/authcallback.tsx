import { useEffect, useRef } from "react";
import { infrax } from "./client";
import { useNavigate } from "react-router-dom";

export const AuthCallBack = () => {
  const hasRunRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (code && state) {
      console.log("calling redirect fxn");
      infrax
        .handleGoogleRedirect()
        .then((res) => console.log("Auth success", res))
        .catch((err) => console.error("Auth failed", err))
        .finally(() => {
          navigate("/");
        })
    } else {
      console.log("Missing code or state, skipping redirect handler.");
    }
  }, []);


  return <div>signing in...</div>;
};


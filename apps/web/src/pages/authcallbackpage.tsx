import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("Token from URL:", token);

    if (token) {
      localStorage.setItem("token-infrax-appuser", token);
      navigate("/dashboard")
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging in...</p>;
}


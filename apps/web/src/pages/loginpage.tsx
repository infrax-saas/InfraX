import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3001/api/v1/auth/google";
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Sign in with Google
    </button>
  );
};

export default function LoginPage() {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token-infrax-appuser');
    if (token) {
      navigate("/dashboard");
    }

  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Login</h1>
      <GoogleLoginButton />
    </div>
  );
}


import { useEffect, useState } from "react";
import { infrax } from "./client"

export const HomePage = () => {

  const [user, setUser] = useState<any>(null);
  const [login, setLogin] = useState<boolean>(false);

  const handleLogin = async () => {
    await infrax.loginWithGoogle();
  }

  const logout = async () => {
    await infrax.logout();
    setUser(null)
    setLogin(false);
  }

  const getUser = async () => {
    const user = await infrax.getUser();
    if (user === null) {
      setLogin(false);
      return;
    }
    setUser(user);
    setLogin(true);
    console.log(user);
  }

  useEffect(() => {
    getUser();
  }, [login]);

  return (
    <div>

      {login ? <button onClick={logout} >Logout</button> : <button onClick={handleLogin} >Login with google</button>}
      {user && JSON.stringify(user)}

    </div>

  )
}

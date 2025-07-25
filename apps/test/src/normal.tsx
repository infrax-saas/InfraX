import { infrax } from "./client"

export const Normal = () => {

  const signup = async () => {
    try {
      await infrax.registerUser('krish12', 'password', '18.krish.rathor@gmail.com');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <button onClick={signup} >singup</button>
    </div>
  )
}

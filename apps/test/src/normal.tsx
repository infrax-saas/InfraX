import { infrax } from "./client"

export const Normal = () => {

  const signup = async () => {
    try {
      await infrax.registerUser('krish12', 'password', 'krish.18.rahtor@nsut.ac.in');
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

import { useDispatch } from "react-redux"

import classes from './Login.module.css'
import { loginAction } from "../store/login"

function Login() {
  const dispatch = useDispatch()

  const loginHandler = (event) => {
    event.preventDefault()

    dispatch(loginAction.login())
  }

  return (
    <form onSubmit={loginHandler}>
      <div>
        <label htmlFor='id'>id</label>
        <input type='id'></input>
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input type='password'></input>
      </div>
      <button>Login</button>
    </form>
  )
}

export default Login
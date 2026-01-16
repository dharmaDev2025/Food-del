import React, { useState, useContext } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext)

  // ✅ use only "login" and "signup"
  const [currState, setCurrState] = useState("login")

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()

    let newUrl = url
    if (currState === "login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl, data)

    if (response.data.success) {
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token)
      setShowLogin(false)
    } else {
      alert(response.data.message)
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>

        {/* TITLE */}
        <div className="login-popup-title">
          <h2>{currState === "login" ? "Login" : "Sign Up"}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        {/* INPUTS */}
        <div className="login-popup-inputs">

          {/* Name only for signup */}
          {currState === "signup" && (
            <input
              type='text'
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              placeholder='Your name'
              required
            />
          )}

          <input
            type='email'
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            placeholder='Your email'
            required
          />

          <input
            type='password'
            name='password'
            onChange={onChangeHandler}
            value={data.password}
            placeholder='Password'
            required
          />
        </div>

        {/* BUTTON */}
        <button type='submit'>
          {currState === "signup" ? "Create account" : "Login"}
        </button>

        {/* TERMS */}
        <div className="login-popup-condition">
          <input type='checkbox' required />
          <p>
            By continuing, I agree to the terms of use & privacy policy.
          </p>
        </div>

        {/* TOGGLE */}
        {currState === "login" ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrState("signup")}> Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={() => setCurrState("login")}> Login here</span>
          </p>
        )}

      </form>
    </div>
  )
}

export default LoginPopup

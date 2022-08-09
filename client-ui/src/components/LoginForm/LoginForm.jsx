import * as React from "react";
import "./LoginForm.css";
import axios from "axios";
import * as config from "../../config";
import { useState } from "react";
import login from "./loginPicture.png";
import RegisterForm from "../RegisterForm/RegisterForm";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LoginForm({
  user,
  handleLogin,
  isFetching,
  setIsFetching,
}) {
  const username = React.createRef();
  const password = React.createRef();
  const navigate = useNavigate();

  const usernameSign = React.createRef();
  const passwordSign = React.createRef();

  const navigateToUserProfile = () => {
    navigate("../../userProfile");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const handleSubmitSignUp = (event) => {
    event.preventDefault();

    const register = async () => {
      try {
        console.log(`${config.API_BASE_URL}/register`);
        const res = await axios.post(`${config.API_BASE_URL}/register`, {
          username: usernameSign.current.value,
          password: passwordSign.current.value,
        });
        handleLogin(res.data);
      } catch (err) {
        alert("Sign up failed: " + err.response.data.loginMessage);
      }
    };
    register();
  };

  const handleSubmitLogin = (event) => {
    event.preventDefault();

    const login = async () => {
      setIsFetching(true);

      try {
        const res = await axios.post(`${config.API_BASE_URL}/login`, {
          username: username.current.value,
          password: password.current.value,
        });
        handleLogin(res.data);
      } catch (err) {
        console.log(err);
        alert("Sign in failed: " + err.response.data.error);
      }
    };
    login();
    setIsFetching(false);
  };

  function handleTheSubmit() {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }

  return (
    <>
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <input ref={usernameSign} placeholder="Username"></input>
            <input
              type="password"
              ref={passwordSign}
              placeholder="Password"
            ></input>
            <button
              className="buttons"
              onClick={(event) => {
                handleSubmitSignUp(event);
                navigateToUserProfile();
              }}
            >
              {" "}
              Sign Up
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <input ref={username} placeholder="Username"></input>
            <input
              type="password"
              ref={password}
              placeholder="Password"
            ></input>
            <button
              onClick={(event) => {
                handleSubmitLogin(event);
                navigateToHome();
              }}
              className="buttons"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Already have an account?</h1>
              <button
                onClick={handleTheSubmit}
                className="user buttons ghost"
                id="signIn"
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Don't have an account yet?</h1>
              <p>Enter your personal details and start your journey with us!</p>
              <button
                onClick={handleTheSubmit}
                className="user buttons ghost"
                id="signUp"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

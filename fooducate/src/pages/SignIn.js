
import '../App.css';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";



function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="App">
        <div className="logo">
          <h1>Fooducate</h1>
        </div>
        <hr />
        <div className="info">
          <div className="loginContainer">
            <div className='userAndPassContainer'>
              <h1>Member Login</h1>
              <h2>Email:</h2>
              <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}></input>
              <h2>Password:</h2>
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <div className='buttonContainer'>
              <button onClick={() => logInWithEmailAndPassword(email, password)}>Login</button>
              <Link to="/register"><button>Sign Up</button></Link>
            </div>
            <Link to="/reset">Forgot Password</Link>
            <div>
            Don't have an account? <Link to="/register">Register</Link> now.
            </div>
          </div>
        </div>
      </div>
  );
}

export default SignIn
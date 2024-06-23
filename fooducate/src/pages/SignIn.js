import React, { useState } from 'react';
import '../App.css';
import { auth, signInWithEmailAndPassword } from '../firebase/firebase';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = () => {
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert(`Logged in as ${user.email}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Login failed: ${errorMessage}`);
      });
  };

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
              <h2>Username:</h2>
              <input type='text' value={username} onChange={handleUsernameChange}></input>
              <h2>Password:</h2>
              <input type='password' value={password} onChange={handlePasswordChange}></input>
            </div>
            <div className='buttonContainer'>
              <button onClick={handleLoginClick}>Login</button>
              <button>Sign Up</button>
            </div>
            <a href='#'>Forgot Password</a>
          </div>
        </div>
      </div>
  );
}

export default SignIn
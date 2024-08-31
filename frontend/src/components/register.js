import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import '../styles/register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/api/google-signin', {
        token: credentialResponse.credential,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup', {
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="375475746648-ftjp4e7hq9r31hu54bq29rt7diun3uua.apps.googleusercontent.com">
      <div className="container">
        <div className="form-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Sign Up</button>
          </form>
          <div className="divider">or</div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Login Failed')}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Register;
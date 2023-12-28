import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async () => {
    // if ( !email || !password) {
    //   setError({
    //     email: !email ? 'Email is required' : '',
    //     password: !password ? 'Password is required' : '',
    //   });
    //   return;
    // }

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
         email,
        password });

  
     
      const token = response.data.token;
  
      // Storing the token in local storage 
      localStorage.setItem('token', token);
      localStorage.setItem('username', response.data.user.username);

  
      // Navigate to the chat screen
      navigate('/message');
    } catch (error) {
      if (error.response) {
     

        if (error.response.status === 500) {
          setError('Error during login');
        } else if (error.response.status === 404) {
          setError('User not found');
        } else if (error.response.status === 401) {
          setError('Incorrect password');
        } else {
          setError('An unexpected error occurred.');
        }
      } else if (error.request) {
        setError('No response received from the server.');
      } else {
        
        setError('An error occurred while processing the request.');
      }
      console.error('Login error:', error);
    }
  };
  return(
    <div className="form-container login-container">
      <h2>Login</h2>
      {/* Login form */}
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="error">{error.email}</span>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="error">{error.password}</span>
        </div>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
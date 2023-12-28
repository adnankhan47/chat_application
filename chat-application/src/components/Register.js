import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  const handleRegister = async () => {
    // Validate  all fields
    if (!username || !email || !password) {
      setError({
        username: !username ? 'Username is required' : '',
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : '',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
      });

      // storing the a token  that backend returns  after registeration
      const token = response.data.token;

      localStorage.setItem('token', token);

      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return(
    <div className="form-container register-container">
      <h2>Register</h2>
      {/* Registration form */}
      <form>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className="error">{error.username}</span>
        </div>
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
        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
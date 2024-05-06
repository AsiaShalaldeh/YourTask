import React, { useState } from 'react';
import axios from 'axios';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Make a POST request to register a new user
      const response = await axios.post('http://127.0.0.1:8000/register/', {
        username,
        email,
        password,
      });
      
      console.log('Registration successful:', response.data);
      // later: redirect the user to another page after successful registration
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error('Registration error:', error.response.data.error);
        setError(error.response.data.error);
      } else {
        console.error('Network error:', error.message);
        setError('A network error occurred. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default RegistrationForm;

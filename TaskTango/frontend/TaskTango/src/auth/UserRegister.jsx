import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Alert } from '@mui/material';
import './RegistrationPage.css';

const UserRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = (event) => {
    event.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if any field is empty
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    // Reset error and set success
    setError('');
    setSuccess(true);
    console.log('User registered:', username, email);
  };

  return (
    <Container component="main" maxWidth="xs" className="main-container">
      <Typography component="h1" variant="h5">
        Create an Account
      </Typography>
      
      {/* Display success message if registration is successful */}
      {success && <Alert severity="success" sx={{ mt: 2 }}>Registration successful!</Alert>}
      
      {/* Display error message if there is an issue */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleRegister} className="form-container">
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default UserRegister;

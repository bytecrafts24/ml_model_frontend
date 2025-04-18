import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import GoogleLoginButton from './loginComponent';
import { login } from '../api/user-ws';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ open, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      // Check for credentials from environment variables
      const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        // Create a mock token for the admin user
        const mockToken = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('user', JSON.stringify({
          email: adminEmail,
          role: 'admin',
          name: 'ByteCrafts Admin'
        }));
        
        // Close modal
        handleClose();
        navigate('/'); // Navigate to home
        return;
      }

      // If not using env credentials, proceed with API login
      const response = await login({ email, password });
      console.log('Login successful:', response);
      
      // Store token
      localStorage.setItem('authToken', response.token || response.authToken);
      
      // Close modal
      handleClose();
      
      // Redirect to home
      navigate('/');
      
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
            or
          </Typography>
          <GoogleLoginButton disabled={loading} />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleLogin} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
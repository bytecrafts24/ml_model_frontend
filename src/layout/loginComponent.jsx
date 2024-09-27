import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Use named import

const GoogleLoginButton = () => {
  const handleLoginSuccess = (credentialResponse) => {
    console.log('Credential Response:', credentialResponse);
    if (credentialResponse && credentialResponse.credential) {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token); // Decode JWT to get user info
      console.log('Decoded User Info:', decoded);
    } else {
      console.log('No credential received');
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginFailure}
    />
  );
};

export default GoogleLoginButton;

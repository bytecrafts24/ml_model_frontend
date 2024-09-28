// import React, { useEffect } from 'react';
// import { GoogleLogin } from '@react-oauth/google';
// import {jwtDecode} from 'jwt-decode';

// const GoogleLoginButton = () => {
//   const handleLoginSuccess = (credentialResponse) => {
//     console.log('Credential Response:', credentialResponse);
//     if (credentialResponse && credentialResponse.credential) {
//       const token = credentialResponse.credential;
//       const decoded = jwtDecode(token);
//       console.log('Decoded User Info:', decoded);

//       // Store the token in session storage or local storage
//       sessionStorage.setItem('google_token', token);
//     } else {
//       console.log('No credential received');
//     }
//   };

//   const handleLoginFailure = (error) => {
//     console.error('Login failed:', error);
//   };

//   // Logout the user fully when window is closed or refreshed
//   useEffect(() => {
//     const handleLogoutOnClose = () => {
//       if (window.gapi && window.gapi.auth2) {
//         const auth2 = window.gapi.auth2.getAuthInstance();
//         if (auth2) {
//           auth2.signOut().then(() => {
//             console.log('User signed out.');
//             window.localStorage.clear();  // Clear all local storage
//             window.location.reload();  // Optionally, reload the page to ensure a clean state
//           });
//         }
//       }
//     };
    
//     window.addEventListener('beforeunload', handleLogoutOnClose);

//     return () => {
//       window.removeEventListener('beforeunload', handleLogoutOnClose);
//     };
//   }, []);

//   return (
//     <GoogleLogin
//       onSuccess={handleLoginSuccess}
//       onError={handleLoginFailure}
//     />
//   );
// };

// export default GoogleLoginButton;
import React, { useEffect, useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

const GoogleLoginButton = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    console.log('Credential Response:', credentialResponse);
    if (credentialResponse && credentialResponse.credential) {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);
      console.log('Decoded User Info:', decoded);

      // Store the token in session storage
      sessionStorage.setItem('google_token', token);
      setUser(decoded); // Set the user info
    } else {
      console.log('No credential received');
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  const handleLogout = () => {
    googleLogout(); // Logs out of the session
    sessionStorage.removeItem('google_token'); // Clear the session storage
    setUser(null); // Clear the user state
    console.log('User logged out');
  };

  useEffect(() => {
    const token = sessionStorage.getItem('google_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  return (
    <div>
      {!user ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      ) : (
        <div>
          <h3>Welcome, {user.name}</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;

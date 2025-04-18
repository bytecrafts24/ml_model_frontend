import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginWith2FA } from '../../api/user-ws';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check for hard-coded credentials from environment variables
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
        navigate('/'); // Navigate to home instead of profile
        return;
      }
      
      // If not using env credentials, proceed with API login
      const credentials = { email, password };
      const response = await login(credentials);
      
      if (response.user.twoFactorEnabled) {
        setIs2FARequired(true);
      } else {
        localStorage.setItem('authToken', response.user.authToken);
        navigate('/'); // Navigate to home instead of profile
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = { email, password, otp };
      const response = await loginWith2FA(credentials);
      
      localStorage.setItem('authToken', response.user.authToken);
      navigate('/'); // Navigate to home instead of profile
    } catch (error) {
      setError(error.message || 'Invalid OTP');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-700">ByteCrafts</h1>
        <p className="mt-2 text-gray-600">All-in-one tool suite for your digital needs</p>
      </div>
      
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          {is2FARequired ? '2FA Verification' : 'Sign In to Continue'}
        </h2>
        
        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {!is2FARequired ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="youremail@example.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>
            
            
          </>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
      
      <div className="mt-8 text-center text-gray-600">
        <p>© {new Date().getFullYear()} ByteCrafts. All rights reserved.</p>
        <p className="mt-1 text-sm">A secure platform with multiple tools for your needs.</p>
      </div>
    </div>
  );
};
export default Login;
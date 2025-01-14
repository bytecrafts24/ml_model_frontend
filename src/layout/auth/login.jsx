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
      const credentials = { email, password };
      const response = await login(credentials);
      
      if (response.user.twoFactorEnabled) {
        setIs2FARequired(true);
      } else {
        localStorage.setItem('authToken', response.user.authToken);
        navigate('/profile');
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
      navigate('/profile');
    } catch (error) {
      setError(error.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {is2FARequired ? '2FA Verification' : 'Login'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!is2FARequired ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Login;
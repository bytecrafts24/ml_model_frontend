import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, setup2FA, verify2FA, enable2FA, disable2FA } from '../../api/user-ws.js';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Check for admin user first (our hardcoded credentials)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === 'bytecrafts24@gmail.com') {
          setUser(parsedUser);
          return;
        }
      }
      
      // If not admin, get profile from API
      const response = await getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Profile fetch error:', error);
      navigate('/login');
    }
  };

  const handleSetup2FA = async () => {
    try {
      // Don't allow 2FA setup for hardcoded admin
      if (user && user.email === 'bytecrafts24@gmail.com') {
        setError('2FA is not available for admin account');
        return;
      }
      
      const response = await setup2FA();
      setQrCode(response.qrCode);
    } catch (error) {
      setError(error.message || 'Failed to setup 2FA');
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    try {
      await verify2FA(otp);
      await enable2FA();
      fetchProfile();
      setQrCode('');
      setOtp('');
    } catch (error) {
      setError(error.message || 'Invalid OTP');
    }
  };

  const handleDisable2FA = async () => {
    try {
      await disable2FA();
      fetchProfile();
    } catch (error) {
      setError(error.message || 'Failed to disable 2FA');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-100">
      <div className="max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Profile</h2>
          
          {error && (
            <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}

          {user && (
            <div className="space-y-4">
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Role: {user.role}</p>
              <p className="text-gray-600">2FA: {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
              
              {!user.twoFactorEnabled ? (
                <button
                  onClick={handleSetup2FA}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Setup 2FA
                </button>
              ) : (
                <button
                  onClick={handleDisable2FA}
                  className="w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Disable 2FA
                </button>
              )}
            </div>
          )}

          {qrCode && (
            <div className="mt-6 space-y-4">
              <img src={qrCode} alt="2FA QR Code" className="mx-auto" />
              <form onSubmit={handleVerify2FA}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Verify OTP
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
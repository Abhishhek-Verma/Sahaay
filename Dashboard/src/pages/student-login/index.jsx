import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import AuthIllustration from './components/AuthIllustration';
import FloatingLeaves from './components/FloatingLeaves';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);

        switch (data.user.role) {
          case 'admin': navigate('/admin-analytics-dashboard'); break;
          case 'counselor': navigate('/counselor-dashboard'); break;
          case 'student': navigate('/student-dashboard'); break;
          default: setError('Unknown user role');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Header isAuthenticated={false} />
      <FloatingLeaves />
      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="hidden lg:block">
            <AuthIllustration />
          </div>
          <div className="max-w-md w-full lg:ml-auto mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome to Sahaay</h1>
              <p className="text-gray-600 mb-6 text-center">Sign in to continue</p>
              
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username or Email</label>
                  <Input type="text" placeholder="Enter username or email" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <Input type="password" placeholder="Enter password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="w-full" />
                </div>
                <Button type="submit" className={`w-full text-white ${!formData.username || !formData.password ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`} disabled={loading || !formData.username || !formData.password}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-4 flex items-center justify-between text-sm">
                <button onClick={() => setShowResetModal(true)} className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Forgot Password?
                </button>
                <button onClick={() => navigate('/register')} className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Register here
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowResetModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              &times;
            </button>
            <div className="text-center">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Reset Your Password</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please contact the admin to reset your password.
              </p>
              <a
                href="mailto:sahaay.support@gmail.com?subject=Password Reset Request&body=Hi Admin,%0A%0AI would like to request a password reset for my account.%0A%0AMy username: %0A%0AThank you."
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                ✉️ sahaay.support@gmail.com
              </a>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                For your privacy and security, password resets are handled manually by the admin.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLogin;

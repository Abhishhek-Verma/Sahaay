import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account? <button onClick={() => navigate('/register')} className="text-indigo-600 hover:text-indigo-700 font-medium">Register here</button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLogin;

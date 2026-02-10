import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FloatingLeaves from '../student-login/components/FloatingLeaves';
import AuthIllustration from '../student-login/components/AuthIllustration';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        
        // Redirect based on role
        switch (data.user.role) {
          case 'admin':
            navigate('/admin-analytics-dashboard');
            break;
          case 'counselor':
            navigate('/counselor-dashboard');
            break;
          case 'student':
            navigate('/student-dashboard');
            break;
          default:
            setError('Unknown user role');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
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
          {/* Illustration Panel */}
          <div className="hidden lg:block">
            <AuthIllustration />
          </div>

          {/* Admin Login Form */}
          <div className="max-w-md w-full lg:ml-auto">
            <div className="glass-card rounded-2xl p-8 shadow-prominent">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                  <span className="text-3xl">👔</span>
                </div>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Admin Login
                </h2>
                <p className="text-sm text-muted-foreground">
                  Secure access for authorized administrators only
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="w-full"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full"
                    autoComplete="current-password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !formData.username || !formData.password}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? 'Signing in...' : 'Sign In as Admin'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  🔒 This is a secure admin portal. Unauthorized access is prohibited.
                </p>
              </div>
            </div>

            {/* Role Navigation */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Not an administrator?
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => navigate('/student-login')}
                  className="text-sm text-primary hover:underline"
                >
                  Student Login
                </button>
                <span className="text-muted-foreground">•</span>
                <button
                  onClick={() => navigate('/counselor-login')}
                  className="text-sm text-primary hover:underline"
                >
                  Counselor Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;

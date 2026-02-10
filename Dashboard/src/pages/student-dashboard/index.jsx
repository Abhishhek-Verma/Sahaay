import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import Header from '../../components/ui/Header';
import WelcomeSection from './components/WelcomeSection';
import QuickActionsGrid from './components/QuickActionsGrid';
import ProgressOverview from './components/ProgressOverview';
import RecentActivity from './components/RecentActivity';
import UpcomingAppointments from './components/UpcomingAppointments';
import ResourceHub from './components/ResourceHub';
import PeerSupportPreview from './components/PeerSupportPreview';
import MotivationTicker from './components/MotivationTicker';
import StudentProfile from './components/StudentProfile';
import StudentSettings from './components/StudentSettings';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState('neutral');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data from API
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, redirecting to student login');
        navigate('/student-login');
        return;
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('Token invalid or unauthorized, redirecting to login');
          localStorage.removeItem('token');
          navigate('/student-login');
          return;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.user) {
        // Ensure we have a student
        if (data.user.role !== 'student') {
          navigate('/student-login');
          return;
        }
        setUserData({
          name: data.user.name,
          email: data.user.email,
          studentId: data.user.studentId || `STU${Date.now()}`,
          currentMood: currentMood,
          joinDate: new Date(data.user.createdAt),
          lastLogin: new Date(),
          role: data.user.role
        });
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        setError('Unable to connect to server. Please check if the backend is running.');
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Student Dashboard - Sahaay';
    window.scrollTo(0, 0);
  }, []);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  // Update user mood in userData when currentMood changes
  useEffect(() => {
    if (userData) {
      setUserData(prev => prev ? ({
        ...prev,
        currentMood: currentMood
      }) : prev);
    }
  }, [currentMood]);

  const handleMoodUpdate = (newMood) => {
    setCurrentMood(newMood);
  };

  const section = new URLSearchParams(location.search).get('section');

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="student" isAuthenticated={true} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {section === 'profile' && (
            <>
              <div className="mb-6">
                <button onClick={() => navigate('/student-dashboard')} className="text-sm text-primary hover:underline">← Back to Dashboard</button>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                  <p className="text-destructive font-medium">Failed to load profile</p>
                  <p className="text-muted-foreground text-sm mt-1">{error}</p>
                  <button 
                    onClick={fetchUserProfile} 
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <StudentProfile user={userData} />
              )}
            </>
          )}

          {section === 'settings' && (
            <>
              <div className="mb-6">
                <button onClick={() => navigate('/student-dashboard')} className="text-sm text-primary hover:underline">← Back to Dashboard</button>
              </div>
              <StudentSettings />
            </>
          )}

          {!section && (
            <>
              {isLoading ? (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-6 animate-pulse">
                    <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                  <p className="text-destructive font-medium">Failed to load dashboard</p>
                  <p className="text-muted-foreground text-sm mt-1">{error}</p>
                  <button 
                    onClick={fetchUserProfile} 
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Retry
                  </button>
                </div>
              ) : userData && (
                <>
                  <div className="mb-8">
                    <WelcomeSection
                      userName={userData?.name}
                      currentMood={currentMood}
                      onMoodUpdate={handleMoodUpdate}
                    />
                  </div>

                  <div className="mb-8">
                    <MotivationTicker />
                  </div>

                  <div className="mb-8">
                    <QuickActionsGrid />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 space-y-8">
                      <ProgressOverview />
                      <RecentActivity />
                    </div>
                    <div className="lg:col-span-1">
                      <UpcomingAppointments />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <ResourceHub />
                    <PeerSupportPreview />
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-red-600"
                          >
                            <path
                              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-heading font-semibold text-red-900">
                            Need Immediate Support?
                          </h3>
                          <p className="text-red-700">
                            If you're feeling overwhelmed, our crisis support is available 24/7
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open('tel:988', '_self')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Call 988
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

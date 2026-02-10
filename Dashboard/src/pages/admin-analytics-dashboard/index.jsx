import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import Header from '../../components/ui/Header';
import MetricsCard from './components/MetricsCard';
import StressHeatmap from './components/StressHeatmap';
import TrendChart from './components/TrendChart';
import PolicyRecommendations from './components/PolicyRecommendations';
import CounselorWorkload from './components/CounselorWorkload';
import ExportPanel from './components/ExportPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({ autoRefresh: false, granularity: 'weekly', anonymize: true });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data from API
  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, redirecting to admin login');
        navigate('/admin-login');
        return;
      }

      const response = await fetch(`${API_URL}/auth/admin-analytics`, {
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
          navigate('/admin-login');
          return;
        }
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.analytics);
      } else {
        throw new Error(data.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        setError('Unable to connect to server. Please check if the backend is running.');
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchAnalyticsData();
  }, [navigate]);

  // Transform analytics data to keyMetrics format
  const keyMetrics = analyticsData ? [
    {
      title: 'Total Active Students',
      value: analyticsData.totalStudents?.toString() || '0',
      change: analyticsData.recentRegistrations > 0 ? `+${analyticsData.recentRegistrations}` : '0',
      changeType: analyticsData.recentRegistrations > 0 ? 'positive' : 'neutral',
      icon: 'Users',
      description: 'Students currently enrolled in mental health programs'
    },
    {
      title: 'Total Counselors',
      value: analyticsData.totalCounselors?.toString() || '0',
      change: `${analyticsData.activeCounselors} active`,
      changeType: 'neutral',
      icon: 'UserCheck',
      description: 'Professional counselors available for consultations'
    },
    {
      title: 'Counselor Utilization',
      value: analyticsData.counselorUtilization || '0%',
      change: analyticsData.activeCounselors === analyticsData.totalCounselors ? 'All active' : `${analyticsData.activeCounselors}/${analyticsData.totalCounselors}`,
      changeType: parseFloat(analyticsData.counselorUtilization) > 80 ? 'positive' : 'neutral',
      icon: 'Activity',
      description: 'Average counselor capacity utilization rate'
    },
    {
      title: 'Average Counselor Rating',
      value: analyticsData.avgRating ? `${analyticsData.avgRating}/5` : 'N/A',
      change: analyticsData.avgRating > 4 ? 'Excellent' : analyticsData.avgRating > 3 ? 'Good' : 'Fair',
      changeType: analyticsData.avgRating > 4 ? 'positive' : analyticsData.avgRating > 3 ? 'neutral' : 'negative',
      icon: 'Star',
      description: 'Average rating across all counselors'
    },
    {
      title: 'Total Sessions',
      value: analyticsData.totalSessions?.toString() || '0',
      change: 'All time',
      changeType: 'neutral',
      icon: 'Calendar',
      description: 'Total counseling sessions conducted'
    },
    {
      title: 'Active Counselors',
      value: analyticsData.activeCounselors?.toString() || '0',
      change: 'Last 30 days',
      changeType: 'positive',
      icon: 'Shield',
      description: 'Counselors active in the last 30 days'
    }
  ] : [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' },
    { id: 'counselors', label: 'Counselors', icon: 'Users' },
    { id: 'policies', label: 'Policies', icon: 'Lightbulb' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  const formatTime = (date) => {
    return date
      ? date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      : 'Invalid Date';
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchAnalyticsData();
      setCurrentTime(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveConfig = () => {
    setShowConfig(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="admin" isAuthenticated={true} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive mental health insights and institutional analytics
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: {formatTime(currentTime)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  size="sm"
                  onClick={handleRefresh}
                  loading={isRefreshing}
                  aria-label="Refresh Data"
                >
                  Refresh Data
                </Button>
                <Button
                  variant="outline"
                  iconName="Settings"
                  size="sm"
                  onClick={() => setShowConfig(true)}
                  aria-label="Configure Settings"
                >
                  Configure
                </Button>
                <Button variant="default" iconName="AlertTriangle" size="sm" aria-label="View Crisis Alerts">
                  Crisis Alerts (3)
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap gentle-transition ${activeTab === tab?.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    aria-label={`Navigate to ${tab?.label}`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-card rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  ))
                ) : error ? (
                  <div className="col-span-full bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                    <p className="text-destructive font-medium">Failed to load analytics data</p>
                    <p className="text-muted-foreground text-sm mt-1">{error}</p>
                    <Button onClick={fetchAnalyticsData} className="mt-3" variant="outline">
                      Retry
                    </Button>
                  </div>
                ) : (
                  keyMetrics?.map((metric, index) => (
                    <MetricsCard
                      key={index}
                      title={metric?.title}
                      value={metric?.value}
                      change={metric?.change}
                      changeType={metric?.changeType}
                      icon={metric?.icon}
                      description={metric?.description}
                    />
                  ))
                )}
              </div>

              {/* Main Analytics */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="xl:col-span-2">
                  <StressHeatmap />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-8">
              <TrendChart />
            </div>
          )}

          {activeTab === 'counselors' && (
            <div className="space-y-8">
              <CounselorWorkload />
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-8">
              <PolicyRecommendations />
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-8">
              <ExportPanel />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAnalyticsDashboard;

import React, { useState, useEffect } from 'react';
import { API_URL } from '../../utils/api';
import Header from '../../components/ui/Header';
import TodaySchedule from './components/TodaySchedule';
import CaseloadOverview from './components/CaseloadOverview';
import CalendarWidget from './components/CalendarWidget';
import StudentProgress from './components/StudentProgress';
import SessionNotes from './components/SessionNotes';
import ResourceManager from './components/ResourceManager';
import RiskAlerts from './components/RiskAlerts';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useLocation, useNavigate } from 'react-router-dom';

const CounselorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSession, setNewSession] = useState({ student: '', date: '', time: '', type: 'individual', notes: '' });
  const [showBio, setShowBio] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bio, setBio] = useState({ name: '', title: '', phone: '', email: '', expertise: '', officeHours: '', bio: '', degree: '', experience: 0, rating: 0, totalSessions: 0, profileImage: '' });
  const [prefs, setPrefs] = useState({ notifyEmail: true, notifySMS: false, timezone: 'America/New_York', availability: 'standard' });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const dashboardTabs = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'schedule', name: 'Schedule', icon: 'Calendar' },
    { id: 'progress', name: 'Progress', icon: 'BarChart3' },
    { id: 'notes', name: 'Notes', icon: 'FileText' },
    { id: 'resources', name: 'Resources', icon: 'FolderOpen' },
    { id: 'alerts', name: 'Alerts', icon: 'AlertTriangle' }
  ];

  const quickStats = {
    todayAppointments: 4,
    totalStudents: bio.totalSessions || 0,
    highRiskAlerts: 3,
    pendingNotes: 2
  };

  // Fetch counselor profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/counselor-login');
          return;
        }

        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success && data.user) {
          const user = data.user;
          setBio({
            name: user.name || '',
            title: user.title || 'Licensed Counselor',
            phone: user.phone || '',
            email: user.email || '',
            expertise: Array.isArray(user.specialization) ? user.specialization.join(', ') : '',
            officeHours: user.officeHours || '',
            bio: user.bio || '',
            degree: user.degree || '',
            experience: user.experience || 0,
            rating: user.rating || 0,
            totalSessions: user.totalSessions || 0,
            profileImage: user.profileImage || ''
          });
        } else {
          console.error('Failed to fetch profile:', data.message);
          navigate('/counselor-login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/counselor-login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    setShowBio(section === 'bio');
    setShowSettings(section === 'settings');
  }, [location.search]);

  const closeSection = () => {
    navigate('/counselor-dashboard', { replace: true });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-lg text-center">
                <Icon name="Calendar" className="text-primary mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {quickStats?.todayAppointments}
                </div>
                <div className="text-sm text-muted-foreground">Today's Sessions</div>
              </div>
              
              <div className="glass-card p-4 rounded-lg text-center">
                <Icon name="Users" className="text-success mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {quickStats?.totalStudents}
                </div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              
              <div className="glass-card p-4 rounded-lg text-center">
                <Icon name="AlertTriangle" className="text-error mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {quickStats?.highRiskAlerts}
                </div>
                <div className="text-sm text-muted-foreground">High Risk Alerts</div>
              </div>
              
              <div className="glass-card p-4 rounded-lg text-center">
                <Icon name="FileText" className="text-warning mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {quickStats?.pendingNotes}
                </div>
                <div className="text-sm text-muted-foreground">Pending Notes</div>
              </div>
            </div>
            {/* Main Overview Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <TodaySchedule />
              </div>
              <div>
                <CaseloadOverview />
              </div>
            </div>
          </div>
        );
      
      case 'schedule':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CalendarWidget />
            <TodaySchedule />
          </div>
        );
      
      case 'progress':
        return <StudentProgress />;
      
      case 'notes':
        return <SessionNotes />;
      
      case 'resources':
        return <ResourceManager />;
      
      case 'alerts':
        return <RiskAlerts />;
      
      default:
        return (
          <div className="text-center py-12">
            <Icon name="AlertCircle" className="text-muted-foreground mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Content not found
            </h3>
            <p className="text-muted-foreground">
              The requested tab content could not be loaded.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="counselor" isAuthenticated={true} />
      <main className="pt-16">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Dashboard Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                    {bio.name ? `Welcome, ${bio.name}` : 'Counselor Dashboard'}
                  </h1>
                  <p className="text-muted-foreground">
                    {bio.title} - Here's your mental health practice overview for today.
                  </p>
                </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Bell"
                  iconPosition="left"
                  className="relative"
                  onClick={() => setShowNotifications(true)}
                >
                  Notifications
                  {quickStats?.highRiskAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {quickStats?.highRiskAlerts}
                    </span>
                  )}
                </Button>
                
                <Button
                  variant="secondary"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setShowNewSession(true)}
                >
                  New Session
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {dashboardTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap gentle-transition ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon 
                      name={tab?.icon} 
                      size={16} 
                      className={activeTab === tab?.id ? 'text-primary' : 'text-muted-foreground'} 
                    />
                    <span>{tab?.name}</span>
                    {tab?.id === 'alerts' && quickStats?.highRiskAlerts > 0 && (
                      <span className="bg-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {quickStats?.highRiskAlerts}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>
        </div>
        )}
      </main>
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button
          variant="secondary"
          size="icon"
          iconName="Plus"
          className="rounded-full shadow-prominent w-14 h-14"
          onClick={() => setShowNewSession(true)}
        />
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-lg animate-growth">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Bell" className="text-primary" size={20} />
                <h3 className="text-lg font-heading font-semibold text-foreground">Notifications</h3>
              </div>
              <Button variant="ghost" size="icon" iconName="X" onClick={() => setShowNotifications(false)} />
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded border border-border bg-background/60 flex items-start gap-3">
                <Icon name="AlertTriangle" className="text-error mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-foreground">3 high-risk alerts require attention.</p>
                  <p className="text-xs text-muted-foreground">Review the Risk Alert System for immediate actions.</p>
                </div>
              </div>
              <div className="p-3 rounded border border-border bg-background/60 flex items-start gap-3">
                <Icon name="Calendar" className="text-primary mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-foreground">Two sessions start within the next hour.</p>
                  <p className="text-xs text-muted-foreground">Check your schedule to prepare resources.</p>
                </div>
              </div>
              <div className="p-3 rounded border border-border bg-background/60 flex items-start gap-3">
                <Icon name="FileText" className="text-warning mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-foreground">You have 2 pending session notes.</p>
                  <p className="text-xs text-muted-foreground">Complete documentation to keep records up to date.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="secondary" onClick={() => setShowNotifications(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Session Modal */}
      {showNewSession && (
        <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-lg animate-growth">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Plus" className="text-primary" size={20} />
                <h3 className="text-lg font-heading font-semibold text-foreground">Create New Session</h3>
              </div>
              <Button variant="ghost" size="icon" iconName="X" onClick={() => setShowNewSession(false)} />
            </div>
            <div className="space-y-3">
              <Input label="Student Name" placeholder="Enter student name" value={newSession.student} onChange={(e)=>setNewSession(s=>({...s, student:e.target.value}))} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Date" type="date" value={newSession.date} onChange={(e)=>setNewSession(s=>({...s, date:e.target.value}))} />
                <Input label="Time" type="time" value={newSession.time} onChange={(e)=>setNewSession(s=>({...s, time:e.target.value}))} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Session Type</label>
                <div className="flex gap-2 flex-wrap">
                  {['individual','group','assessment'].map(t => (
                    <button key={t} onClick={()=>setNewSession(s=>({...s, type:t}))} type="button" className={`px-3 py-1 rounded border text-sm ${newSession.type===t? 'border-primary text-primary bg-primary/5':'border-border'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
                  ))}
                </div>
              </div>
              <textarea className="w-full h-28 p-3 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Notes (optional)" value={newSession.notes} onChange={(e)=>setNewSession(s=>({...s, notes:e.target.value}))} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={()=>setShowNewSession(false)}>Cancel</Button>
              <Button variant="default" iconName="Save" iconPosition="left" onClick={()=>{setShowNewSession(false);}}>
                Create Session
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Bio Panel */}
      {showBio && (
        <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-2xl w-full p-6 rounded-lg animate-growth my-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="UserCircle" size={20} className="text-primary" />
                <h3 className="text-lg font-heading font-semibold text-foreground">Professional Profile</h3>
              </div>
              <Button variant="ghost" size="icon" iconName="X" onClick={closeSection} />
            </div>
            
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src={bio.profileImage || 'https://ui-avatars.com/api/?name=Counselor&background=4F46E5&color=fff&size=200'} 
                  alt={bio.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2">
                  <Icon name="Camera" size={16} />
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-2xl font-bold text-primary">{bio.rating.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="text-2xl font-bold text-success">{bio.totalSessions}</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div className="text-2xl font-bold text-warning">{bio.experience}+</div>
                <div className="text-xs text-muted-foreground">Years Exp</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Full Name" value={bio.name} onChange={(e)=>setBio(b=>({...b,name:e.target.value}))} />
                <Input label="Professional Title" value={bio.title} onChange={(e)=>setBio(b=>({...b,title:e.target.value}))} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Phone" value={bio.phone} onChange={(e)=>setBio(b=>({...b,phone:e.target.value}))} />
                <Input label="Email" type="email" value={bio.email} onChange={(e)=>setBio(b=>({...b,email:e.target.value}))} />
              </div>

              <Input label="Education & Degree" value={bio.degree} onChange={(e)=>setBio(b=>({...b,degree:e.target.value}))} />
              <Input label="Areas of Expertise" value={bio.expertise} onChange={(e)=>setBio(b=>({...b,expertise:e.target.value}))} />
              <Input label="Office Hours" value={bio.officeHours} onChange={(e)=>setBio(b=>({...b,officeHours:e.target.value}))} />
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Professional Bio</label>
                <textarea 
                  className="w-full h-28 p-3 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="Write a brief professional biography..." 
                  value={bio.bio} 
                  onChange={(e)=>setBio(b=>({...b,bio:e.target.value}))} 
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeSection}>Close</Button>
              <Button variant="default" iconName="Save" iconPosition="left" onClick={closeSection}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-lg animate-growth">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Settings" size={20} className="text-primary" />
                <h3 className="text-lg font-heading font-semibold text-foreground">Settings</h3>
              </div>
              <Button variant="ghost" size="icon" iconName="X" onClick={closeSection} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Email notifications</p>
                  <p className="text-xs text-muted-foreground">Session reminders and alerts</p>
                </div>
                <input type="checkbox" className="rounded border-border" checked={prefs.notifyEmail} onChange={(e)=>setPrefs(p=>({...p, notifyEmail:e.target.checked}))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">SMS notifications</p>
                  <p className="text-xs text-muted-foreground">Time-sensitive alerts</p>
                </div>
                <input type="checkbox" className="rounded border-border" checked={prefs.notifySMS} onChange={(e)=>setPrefs(p=>({...p, notifySMS:e.target.checked}))} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Timezone</p>
                <select value={prefs.timezone} onChange={(e)=>setPrefs(p=>({...p, timezone:e.target.value}))} className="w-full h-10 border border-border rounded-md bg-background text-foreground px-3">
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Chicago">America/Chicago</option>
                  <option value="America/Denver">America/Denver</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                </select>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Availability</p>
                <div className="flex gap-2 flex-wrap">
                  {['standard','extended','custom'].map(a => (
                    <button key={a} type="button" onClick={()=>setPrefs(p=>({...p, availability:a}))} className={`px-3 py-1 rounded border text-sm ${prefs.availability===a? 'border-primary text-primary bg-primary/5':'border-border'}`}>{a.charAt(0).toUpperCase()+a.slice(1)}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={closeSection}>Close</Button>
              <Button variant="default" iconName="Save" iconPosition="left" onClick={closeSection}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FloatingLeaves from '../student-login/components/FloatingLeaves';

const SelectRole = () => {
  const navigate = useNavigate();

  const roles = [
    {
      value: 'student',
      label: 'Student',
      description: 'Access mental health support, AI chatbot, and wellness resources',
      icon: '🎓',
      color: 'from-blue-500 to-cyan-500',
      path: '/student-login'
    },
    {
      value: 'counselor',
      label: 'Counselor',
      description: 'Manage student appointments, sessions, and provide guidance',
      icon: '👨‍⚕️',
      color: 'from-green-500 to-emerald-500',
      path: '/counselor-login'
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'View platform analytics, manage users, and oversee operations',
      icon: '👔',
      color: 'from-purple-500 to-pink-500',
      path: '/admin-login'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <Header isAuthenticated={false} />
      <FloatingLeaves />
      
      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Welcome to Sahaay
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select your role to continue to the appropriate login portal
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {roles.map((role) => (
              <div
                key={role.value}
                onClick={() => navigate(role.path)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="glass-card rounded-2xl p-8 h-full shadow-prominent hover:shadow-2xl transition-all">
                  {/* Gradient Header */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <span className="text-4xl">{role.icon}</span>
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-3">
                    {role.label}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Arrow Indicator */}
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    <span>Continue as {role.label}</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectRole;

import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { ProtectedRoute, RoleBasedRedirect } from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import AIChatbotSupport from './pages/ai-chatbot-support';
import CounselorDashboard from './pages/counselor-dashboard';
import StudentLogin from './pages/student-login';
import AppointmentBooking from './pages/appointment-booking';
import AdminAnalyticsDashboard from './pages/admin-analytics-dashboard';
import StudentDashboard from './pages/student-dashboard';
import AdminLogin from './pages/admin-login';
import CounselorLogin from './pages/counselor-login';
import RegisterPage from './pages/register';
import CounselorSessions from './pages/counselor-sessions';
import CounselorSchedule from './pages/counselor-schedule';
import SelfAssessmentPage from './pages/self-assessment';
import JournalPage from './pages/journal';
import ForumIndex from './pages/peer-support-forum';
import NewPost from './pages/peer-support-forum/NewPost';
import PostDetail from './pages/peer-support-forum/PostDetail';
import SelectRole from './pages/select-role';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<SelectRole />} />
        <Route path="/select-role" element={<SelectRole />} />
        
        {/* Auth routes */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/counselor-login" element={<CounselorLogin />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Role-based redirect */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <RoleBasedRedirect />
          </ProtectedRoute>
        } />

        {/* Student routes */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/ai-chatbot-support" element={
          <ProtectedRoute allowedRoles={['student']}>
            <AIChatbotSupport />
          </ProtectedRoute>
        } />
        <Route path="/appointment-booking" element={
          <ProtectedRoute allowedRoles={['student']}>
            <AppointmentBooking />
          </ProtectedRoute>
        } />
        <Route path="/self-assessment" element={
          <ProtectedRoute allowedRoles={['student']}>
            <SelfAssessmentPage />
          </ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute allowedRoles={['student']}>
            <JournalPage />
          </ProtectedRoute>
        } />
        <Route path="/peer-support-forum" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ForumIndex />
          </ProtectedRoute>
        } />
        <Route path="/peer-support-forum/new-post" element={
          <ProtectedRoute allowedRoles={['student']}>
            <NewPost />
          </ProtectedRoute>
        } />
        <Route path="/peer-support-forum/post/:id" element={
          <ProtectedRoute allowedRoles={['student']}>
            <PostDetail />
          </ProtectedRoute>
        } />

        {/* Counselor routes */}
        <Route path="/counselor-dashboard" element={
          <ProtectedRoute allowedRoles={['counselor']}>
            <CounselorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/counselor-sessions" element={
          <ProtectedRoute allowedRoles={['counselor']}>
            <CounselorSessions />
          </ProtectedRoute>
        } />
        <Route path="/counselor-schedule" element={
          <ProtectedRoute allowedRoles={['counselor']}>
            <CounselorSchedule />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin-analytics-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalyticsDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

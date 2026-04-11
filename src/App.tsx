import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { ToastProvider } from './components/ui-custom/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const LandingPage = lazy(() => import('./pages/Public/LandingPage'));
const About = lazy(() => import('./pages/Public/About'));
const Platform = lazy(() => import('./pages/Public/Platform'));
const Solutions = lazy(() => import('./pages/Public/Solutions'));
const Contact = lazy(() => import('./pages/Public/Contact'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const DiscoverEvents = lazy(() => import('./pages/student/BrowseEvents'));
const EventDetail = lazy(() => import('./pages/student/EventDetail'));
const MyRegistrations = lazy(() => import('./pages/student/MyRegistrations'));

// Organizer Pages
const OrganizerDashboard = lazy(() => import('./pages/organizer/OrganizerDashboard'));
const ManageEvents = lazy(() => import('./pages/organizer/MyEvents'));
const CreateEvent = lazy(() => import('./pages/organizer/CreateEvent'));
const OrganizerVenues = lazy(() => import('./pages/organizer/VenuesView'));
const OrganizerAnalytics = lazy(() => import('./pages/organizer/OrganizerAnalytics'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ApprovalQueue = lazy(() => import('./pages/admin/ApprovalQueue'));
const VenueManagement = lazy(() => import('./pages/admin/VenueManagement'));
const AllEvents = lazy(() => import('./pages/admin/AllEvents'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));

// Shared
const Analytics = lazy(() => import('./pages/Analytics/Dashboard'));
const Profile = lazy(() => import('./pages/Shared/Profile'));
const EventRegistrations = lazy(() => import('./pages/Shared/EventRegistrations'));
const AuthLayout = lazy(() => import('./components/auth/AuthLayout'));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <ToastProvider>
          <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ width: 32, height: 32, border: '2px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          }>
            <Routes>
            {/* Public Routes with Persistent Layout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected Routes with MainLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Student Routes */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/discover" element={<DiscoverEvents />} />
                <Route path="/student/event/:eventId" element={<EventDetail />} />
                <Route path="/student/registrations" element={<MyRegistrations />} />
                <Route path="/student/profile" element={<Profile />} />

                {/* Organizer Routes */}
                <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                <Route path="/organizer/events" element={<ManageEvents />} />
                <Route path="/organizer/create-event" element={<CreateEvent />} />
                <Route path="/organizer/edit-event/:eventId" element={<CreateEvent />} />
                <Route path="/organizer/venues" element={<OrganizerVenues />} />
                <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
                <Route path="/organizer/event/:eventId/registrations" element={<EventRegistrations />} />
                <Route path="/organizer/profile" element={<Profile />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/approvals" element={<ApprovalQueue />} />
                <Route path="/admin/events" element={<AllEvents />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/venues" element={<VenueManagement />} />
                <Route path="/admin/event/:eventId/registrations" element={<EventRegistrations />} />
                <Route path="/admin/profile" element={<Profile />} />

                {/* Shared */}
                <Route path="/analytics" element={<Analytics />} />
              </Route>
            </Route>

            {/* Public Entry & Institutional Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Redirects */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
        </ToastProvider>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

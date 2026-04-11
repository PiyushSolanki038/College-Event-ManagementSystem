import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardTopBar from './DashboardTopBar';
import VerificationBanner from '@/components/ui-custom/VerificationBanner';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/student/') ||
                      location.pathname.includes('/organizer/') ||
                      location.pathname.includes('/admin/') ||
                      location.pathname === '/analytics';

  if (!isDashboard) {
    return (
      <div>
        <VerificationBanner />
        <Navbar />
        <main style={{ paddingTop: 80, maxWidth: 1200, margin: '0 auto', padding: '80px 24px 48px' }}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <VerificationBanner />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <DashboardTopBar />
          <main style={{
            flex: 1,
            backgroundColor: '#f8fafc',
            padding: 24,
            overflowY: 'auto',
          }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/student/dashboard': 'Dashboard',
  '/student/discover': 'Browse Events',
  '/student/registrations': 'My Registrations',
  '/student/profile': 'Profile',
  '/organizer/dashboard': 'Dashboard',
  '/organizer/events': 'My Events',
  '/organizer/create-event': 'Create Event',
  '/organizer/venues': 'Venues',
  '/organizer/analytics': 'Analytics',
  '/organizer/profile': 'Profile',
  '/admin/dashboard': 'Dashboard',
  '/admin/approvals': 'Approval Queue',
  '/admin/events': 'All Events',
  '/admin/users': 'Users',
  '/admin/venues': 'Venues',
  '/admin/profile': 'Profile',
  '/analytics': 'Analytics',
};

const DashboardTopBar: React.FC = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div style={{
      height: 72,
      backgroundColor: 'rgba(248, 249, 255, 0.8)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <h1 style={{ 
        fontSize: 24, 
        fontWeight: 800, 
        color: 'var(--on-surface)', 
        margin: 0,
        fontFamily: 'Manrope, sans-serif',
        letterSpacing: '-0.02em'
      }}>
        {title}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          style={{
            width: 40,
            height: 40,
            backgroundColor: 'var(--surface)',
            border: 'none',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
          aria-label="Search"
        >
          <Search size={18} strokeWidth={1.5} color="var(--on-surface-variant)" />
        </button>
        <button
          style={{
            width: 40,
            height: 40,
            backgroundColor: 'var(--surface)',
            border: 'none',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={1.5} color="var(--on-surface-variant)" />
        </button>
        <div style={{ width: 1, height: 24, backgroundColor: 'var(--outline-variant)', margin: '0 4px' }} />
        <button
          style={{
            height: 40,
            padding: '0 12px',
            backgroundColor: 'var(--surface)',
            border: 'none',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: 'var(--surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={14} color="var(--primary)" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>Account</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardTopBar;


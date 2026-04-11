import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  ClipboardList,
  User,
  LogOut,
  Calendar,
  PlusCircle,
  MapPin,
  BarChart3,
  ShieldCheck,
  List,
  Users,
  Box,
  Library,
  Compass,
  Layout,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const studentNav = [
  { label: 'Platform', items: [
    { icon: Layout, path: '/student/dashboard', label: 'Dashboard' },
    { icon: Compass, path: '/student/discover', label: 'Discovery' },
    { icon: Library, path: '/student/registrations', label: 'Itinerary' },
  ]},
  { label: 'Identity', items: [
    { icon: User, path: '/student/profile', label: 'Academic Profile' },
  ]},
];

const organizerNav = [
  { label: 'Management', items: [
    { icon: Layout, path: '/organizer/dashboard', label: 'Dashboard' },
    { icon: Calendar, path: '/organizer/events', label: 'My Exhibitions' },
    { icon: PlusCircle, path: '/organizer/create-event', label: 'Create Entry' },
    { icon: MapPin, path: '/organizer/venues', label: 'Campus Spaces' },
    { icon: BarChart3, path: '/organizer/analytics', label: 'Performance' },
  ]},
  { label: 'Identity', items: [
    { icon: User, path: '/organizer/profile', label: 'Profile' },
  ]},
];

const adminNav = [
  { label: 'Governance', items: [
    { icon: Layout, path: '/admin/dashboard', label: 'Overview' },
    { icon: ShieldCheck, path: '/admin/approvals', label: 'Moderation', badge: true },
    { icon: List, path: '/admin/events', label: 'Global Records' },
    { icon: Users, path: '/admin/users', label: 'Directory' },
    { icon: MapPin, path: '/admin/venues', label: 'Facilities' },
    { icon: BarChart3, path: '/analytics', label: 'System Metrics' },
  ]},
  { label: 'Identity', items: [
    { icon: User, path: '/admin/profile', label: 'Profile' },
  ]},
];

const roleLabel: Record<string, string> = {
  student: 'Student Authority',
  organizer: 'Curator Authority',
  admin: 'Administrator',
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navSections = user?.role === 'admin' ? adminNav : user?.role === 'organizer' ? organizerNav : studentNav;

  const getInitials = (name?: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 260,
        backgroundColor: '#0F1115',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        overflow: 'hidden',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Premium Obsidian Brand Section */}
      <div style={{
        padding: '40px 24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <div style={{
          width: 36,
          height: 36,
          backgroundColor: 'var(--primary)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(0, 106, 97, 0.25)',
          position: 'relative'
        }}>
          <Box size={20} color="white" strokeWidth={2.5} />
          <div style={{
            position: 'absolute',
            inset: -4,
            border: '1px solid var(--primary)',
            borderRadius: 14,
            opacity: 0.3
          }} />
        </div>
        <div>
          <div style={{ 
            fontSize: 18, 
            fontWeight: 800, 
            color: '#FFFFFF', 
            fontFamily: 'Manrope, sans-serif',
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}>
            COLLEGE EVENT
          </div>
          <div style={{ 
            fontSize: 9, 
            fontWeight: 800,
            color: 'rgba(255,255,255,0.4)', 
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginTop: 6
          }}>
            MANAGEMENT SYSTEM
          </div>
        </div>
      </div>

      {/* Modern Navigation Menu */}
      <div style={{ 
        flex: 1, 
        padding: '0 16px',
        overflowY: 'auto', 
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        marginTop: 12
      }} className="sidebar-scroll">
        {navSections.map((section) => (
          <div key={section.label}>
            <div style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.3)',
              padding: '0 12px 16px',
            }}>
              {section.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 14,
                      fontSize: 14,
                      fontWeight: 600,
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                      }
                    }}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        left: -16,
                        height: 20,
                        width: 4,
                        backgroundColor: 'var(--primary)',
                        borderRadius: '0 4px 4px 0',
                        boxShadow: '0 0 12px var(--primary)'
                      }} />
                    )}

                    {'badge' in item && item.badge && !isActive && (
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        boxShadow: '0 0 8px #ef4444'
                      }} />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Premium Profile Section */}
      <div style={{
        marginTop: 'auto',
        padding: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: 14, 
              fontWeight: 700, 
              color: '#FFFFFF', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {user?.name || 'Academic User'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, textTransform: 'uppercase' }}>
              {user?.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 10px',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.6)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar { display: none; }
        .sidebar-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </aside>
  );
};

export default Sidebar;

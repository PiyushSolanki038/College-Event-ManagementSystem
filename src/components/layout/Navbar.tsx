import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Calendar, Search, LayoutDashboard, User, BarChart3, ShieldCheck, ClipboardList, MapPin, Users, List } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    student: [
      { to: '/student/dashboard', icon: LayoutDashboard, label: 'Portfolio' },
      { to: '/student/discover', icon: Search, label: 'Discovery' },
      { to: '/student/registrations', icon: ClipboardList, label: 'Registry' },
      { to: '/student/profile', icon: ShieldCheck, label: 'Credentials' },
    ],
    organizer: [
      { to: '/organizer/dashboard', icon: LayoutDashboard, label: 'Operations' },
      { to: '/organizer/events', icon: Calendar, label: 'Managed Events' },
      { to: '/organizer/venues', icon: MapPin, label: 'Venues' },
      { to: '/organizer/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/organizer/profile', icon: ShieldCheck, label: 'Identity' },
    ],
    admin: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Governance' },
      { to: '/admin/approvals', icon: ShieldCheck, label: 'Audit Queue' },
      { to: '/admin/events', icon: List, label: 'All Artifacts' },
      { to: '/admin/users', icon: Users, label: 'User Registry' },
      { to: '/admin/venues', icon: MapPin, label: 'Venue Hub' },
      { to: '/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/admin/profile', icon: ShieldCheck, label: 'Governance Identity' },
    ],
  };

  const currentNavItems = user ? navItems[user.role] : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-[#eff4ff] h-20 flex items-center transition-all duration-500 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-12 lg:gap-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#006a61] rounded-[0.85rem] shadow-xl shadow-[#006a61]/10 relative overflow-hidden flex items-center justify-center transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110">
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-soft"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-[900] tracking-[-0.03em] text-[#00345e] font-['Manrope',sans-serif]">
                  COLLEGE EVENT <span className="text-[#006a61]">/ 2026</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#8f9eb4]">Management System</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {currentNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-[9px] font-black uppercase tracking-[0.25em] transition-all relative py-1.5 ${
                      isActive
                        ? 'text-[#00345e] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[3px] after:bg-[#006a61] after:rounded-full after:animate-fade-in'
                        : 'text-[#8f9eb4] hover:text-[#006a61]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-[#001D19] uppercase tracking-widest">{user?.name}</span>
                <div className="flex items-center gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-[#006D5B] animate-pulse"></div>
                   <span className="text-[8px] font-bold text-[#006D5B] uppercase tracking-[0.2em]">{user?.role} Portal</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#F9F9F7] flex items-center justify-center border border-slate-100 overflow-hidden shadow-sm shadow-black/[0.02]">
                <User className="w-5 h-5 text-[#001D19]" />
              </div>
            </div>
            
            <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>
            
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all duration-300 shadow-sm shadow-black/[0.01] group"
              title="Terminate Session"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

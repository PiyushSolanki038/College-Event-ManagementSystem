import React from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-black/[0.03] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#006D5B] rounded-xl shadow-lg shadow-[#006D5B]/20 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="text-sm font-[900] tracking-[-0.03em] text-[#001D19]">College Event Management System<span className="text-[#006D5B]">.</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {[
            { name: 'About', path: '/about' },
            { name: 'Platform', path: '/platform' },
            { name: 'Solutions', path: '/solutions' },
            { name: 'Contact', path: '/contact' }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#006D5B] transition-all duration-300 relative group/link"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#006D5B] transition-all duration-300 group-hover/link:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-950">
            Log In
          </Link>
          <Link to="/register" className="bg-[#006D5B] text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#006D5B]/10 hover:shadow-[#006D5B]/20 transition-all hover:scale-105 active:scale-95">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'About', path: '/about' },
  { name: 'Platform', path: '/platform' },
  { name: 'Solutions', path: '/solutions' },
  { name: 'Contact', path: '/contact' }
];

const PublicNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on route change, and lock body scroll while it's open.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'bg-white/80 backdrop-blur-xl border-b border-black/[0.05] shadow-[0_1px_20px_rgba(0,29,25,0.04)]'
          : 'bg-white/60 backdrop-blur-lg border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 bg-[#006D5B] rounded-xl shadow-lg shadow-[#006D5B]/20 relative overflow-hidden flex items-center justify-center group-hover:rounded-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="text-sm font-[900] tracking-[-0.03em] text-[#001D19] leading-tight">
            <span className="sm:hidden">CEMS<span className="text-[#006D5B]">.</span></span>
            <span className="hidden sm:inline">College Event Management System<span className="text-[#006D5B]">.</span></span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group/link ${
                  active ? 'text-[#006D5B]' : 'text-slate-400 hover:text-[#006D5B]'
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#006D5B] transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover/link:w-full'
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-950 transition-colors">
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-[#006D5B] text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#006D5B]/10 hover:shadow-[#006D5B]/20 transition-all hover:scale-105 active:scale-95"
          >
            Register
          </Link>
        </div>

        {/* Mobile toggle (covers everything below the lg breakpoint) */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:border-[#006D5B] hover:text-[#006D5B] transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-black/[0.05]"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {NAV_LINKS.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-sm font-[900] uppercase tracking-[0.15em] transition-colors ${
                      active ? 'text-[#006D5B]' : 'text-slate-700 hover:text-[#006D5B]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-4">
                <Link
                  to="/login"
                  className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 py-3 rounded-full border border-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-center bg-[#006D5B] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#006D5B]/10"
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PublicNavbar;

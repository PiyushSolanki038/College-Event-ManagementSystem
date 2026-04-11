import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, Zap, Sparkles, Globe, Fingerprint } from 'lucide-react';

const carouselContent = [
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    bigWord: 'ACCELERATE',
    tagline: 'NEXT-GEN COORDINATION',
    headline: 'Experience the fastest event management ecosystem.',
    id: 'AUTH-K-1024'
  },
  {
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
    bigWord: 'UNIFY',
    tagline: 'ELITE ENGAGEMENT',
    headline: 'One portal for all your student lifecycle milestones.',
    id: 'AUTH-K-2048'
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
    bigWord: 'MASTERY',
    tagline: 'INSTITUTIONAL PRIDE',
    headline: 'Achieve excellence with data-driven archives.',
    id: 'AUTH-K-4096'
  }
];

const springConfig = {
  type: "spring" as const,
  stiffness: 80,
  damping: 20,
  mass: 1.2
};

const AuthLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselContent.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const getRouteData = () => {
    switch (location.pathname) {
      case '/register':
        return {
          title: 'Join the ecosystem',
          subHeader: (
            <span className="text-slate-400">
              Already verified? <Link to="/login" className="text-orange-500 font-[900] hover:underline transition-all underline-offset-4 decoration-2">Sign In</Link>
            </span>
          )
        };
      case '/forgot-password':
        return {
          title: 'Access recovery',
          subHeader: (
            <span className="text-slate-400">
              Back to authorization? <Link to="/login" className="text-orange-500 font-[900] hover:underline transition-all underline-offset-4 decoration-2">Sign In</Link>
            </span>
          )
        };
      default:
        return {
          title: 'Authorization',
          subHeader: (
            <span className="text-slate-400">
              New to Finexy? <Link to="/register" className="text-orange-500 font-[900] hover:underline transition-all underline-offset-4 decoration-2">Create Account</Link>
            </span>
          )
        };
    }
  };

  const { title, subHeader } = getRouteData();

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4] flex items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 🎭 Dynamic Atmosphere */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/5 to-transparent pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-slate-200/50 to-transparent pointer-events-none"></div>
      
      {/* 🧾 Texture Base */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02] bg-noise scale-150 contrast-125"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white w-full max-w-[1024px] min-h-[600px] rounded-[2.5rem] shadow-heavy overflow-hidden flex flex-col md:flex-row relative z-10 border border-white"
      >
        
        {/* Left Side: Cinematic Perspective (Persistent) */}
        <div className="md:w-[50%] relative overflow-hidden bg-black group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={carouselContent[activeIndex].image} 
                alt="" 
                className="w-full h-full object-cover grayscale-[30%] brightness-[0.8]"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 z-20 p-10 lg:p-14 flex flex-col justify-between">
            {/* Top Branding - Finexy Aesthetic */}
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-[1.2rem] border border-white/20 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-500 shadow-xl shadow-black/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-[900] text-xl tracking-tight leading-none mb-1">COLLEGE EVENT</span>
                  <span className="text-white/40 text-[9px] font-black tracking-[0.2em] uppercase">Management System</span>
                </div>
              </Link>
            </div>

            {/* Middle: Elite Layered Typography */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={activeIndex} className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -50, filter: "blur(20px)" }}
                    animate={{ opacity: 0.08, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 50, filter: "blur(20px)" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute -top-16 -left-8 text-[10rem] font-[900] text-white pointer-events-none select-none tracking-tighter opacity-10 font-['Manrope',sans-serif]"
                  >
                    {carouselContent[activeIndex].bigWord}
                  </motion.div>

                  <div className="relative z-10 pt-8">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springConfig, delay: 0.2 }}
                      className="flex items-center gap-4 mb-8"
                    >
                      <div className="h-[2px] w-12 bg-orange-500"></div>
                      <span className="text-orange-400 text-[11px] font-black uppercase tracking-[0.4em]">
                        {carouselContent[activeIndex].tagline}
                      </span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springConfig, delay: 0.4 }}
                      className="text-3xl lg:text-4xl font-[900] text-white leading-tight tracking-tight max-w-[380px] font-['Manrope',sans-serif]"
                    >
                      {carouselContent[activeIndex].headline}
                    </motion.h2>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ delay: 0.8 }}
                      className="mt-12 flex items-center gap-2.5"
                    >
                       <Globe className="w-3.5 h-3.5 text-white" />
                       <span className="text-[10px] text-white font-black tracking-widest uppercase">{carouselContent[activeIndex].id}</span>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-4">
              {carouselContent.map((_, i) => (
                <button 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-700 cursor-pointer ${i === activeIndex ? 'w-16 bg-orange-500' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent z-10"></div>
        </div>

        {/* Right Side: Identity Panel */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
          <div className="max-w-[420px] w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 0.1, 0.3, 1] }}
              >
                <div className="mb-8">
                  <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all font-bold text-xs shadow-sm w-fit active:scale-95">
                    <ArrowLeft className="w-4 h-4" />
                    Return to Platform
                  </Link>
                </div>
                
                <div className="mb-10">
                  <h1 className="text-3xl lg:text-4xl font-[900] text-black tracking-tight mb-3 leading-none font-['Manrope',sans-serif]">{title}</h1>
                  <div className="text-slate-400 text-[14px] font-bold">{subHeader}</div>
                </div>
                
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-10 left-12 right-12 flex justify-between items-center opacity-30 pointer-events-none hidden lg:flex">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Registry Secure</span>
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">© 2026 College Event Systems Inc.</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default AuthLayout;

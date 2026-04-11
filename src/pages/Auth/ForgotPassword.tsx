import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, CheckCircle2, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process request');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {!submitted ? (
        <>
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <p className="text-[14px] font-[900] text-slate-500 leading-relaxed text-center font-['Manrope',sans-serif]">
              Enter your registered email address. We'll send you a temporary password to regain access.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group text-left">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                <Mail className={`w-4 h-4 transition-colors duration-300 ${email ? 'text-orange-500' : 'text-slate-300 group-focus-within:text-orange-500'}`} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="peer w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-[14px] font-bold focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none placeholder-transparent text-black transition-all shadow-sm"
                placeholder="Email"
              />
              <label className="absolute left-11 top-4 text-slate-400 text-[13px] font-bold pointer-events-none transition-all peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[10px] peer-focus:font-black peer-focus:bg-white peer-focus:px-2 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
                Recovery Email
              </label>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-[12px] font-bold text-red-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-black text-white font-[900] rounded-2xl hover:bg-orange-500 transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-3 text-[12px] uppercase tracking-[0.2em] group/btn overflow-hidden relative"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin opacity-60" />
                  <span>Processing…</span>
                </>
              ) : (
                <>
                  Send Recovery Password
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Authorization
            </Link>
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] text-center space-y-8 border border-slate-50 shadow-heavy"
        >
          <div className="w-20 h-20 bg-orange-50 rounded-[1.5rem] flex items-center justify-center mx-auto relative group">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-orange-500/10 rounded-[1.5rem] blur-xl"
            />
            <CheckCircle2 className="w-10 h-10 text-orange-500 relative z-10" />
          </div>
          <div className="space-y-4">
             <h3 className="text-2xl font-[900] text-black tracking-tight font-['Manrope',sans-serif]">Check Your Inbox</h3>
             <p className="text-[14px] font-bold text-slate-500 leading-relaxed max-w-[320px] mx-auto">
               We've sent a <span className="text-orange-500">temporary password</span> to <span className="text-orange-500 font-black">{email}</span>. Use it to log in, then change your password.
             </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full py-4 bg-black text-white font-[900] rounded-2xl hover:bg-orange-500 transition-all text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 no-underline"
            >
              Go to Login
              <ChevronRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-orange-500 transition-colors"
            >
              Didn't receive it? Try again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ForgotPassword;

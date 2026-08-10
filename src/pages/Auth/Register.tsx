import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, LockKeyhole, Eye, EyeOff, User, CheckCircle2, ChevronRight, X } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth, type UserRole } from '../../context/AuthContext';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Social Auth State
  const [socialModal, setSocialModal] = useState<'google' | 'apple' | null>(null);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialError, setSocialError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(email, `${firstName} ${lastName}`, role, password);
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error('Registration failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async () => {
    if (!socialEmail.trim() || !socialEmail.includes('@')) {
      setSocialError('Please enter a valid email address.');
      return;
    }
    if (!socialName.trim()) {
      setSocialError('Please enter your full name.');
      return;
    }
    setSocialLoading(true);
    setSocialError('');
    const provider = socialModal;
    const generatedPassword = `${provider}_auth_${socialEmail.split('@')[0]}`;

    try {
      // Try register first
      await register(socialEmail, socialName, role, generatedPassword);
      setSocialModal(null);
      navigate(`/${role}/dashboard`);
    } catch {
      // If registration fails (email exists), try login
      try {
        await login(socialEmail, generatedPassword, role);
        setSocialModal(null);
        navigate(`/${role}/dashboard`);
      } catch (loginErr: any) {
        setSocialError(loginErr?.message || `${provider === 'google' ? 'Google' : 'Apple'} sign-up failed. This email may already be registered with a different method.`);
      }
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 🎭 Role Controller */}
      <div className="relative flex p-1 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
        <motion.div
          layoutId="role-bg-reg"
          className="absolute inset-y-1 rounded-lg bg-orange-500 shadow-lg shadow-orange-500/20 z-0"
          animate={{
            left: role === 'student' ? '4px' : 'calc(50% + 1px)',
            width: 'calc(50% - 6px)'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {(['student', 'organizer'] as UserRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`relative z-10 flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
              role === r ? 'text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {/* 👤 Name Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative text-left group">
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="peer w-full px-3.5 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none placeholder-transparent text-black transition-all shadow-sm"
                placeholder="First name"
              />
              <label className="absolute left-3.5 top-3 text-slate-400 text-[12px] font-bold pointer-events-none transition-all peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-[9px] peer-focus:font-black peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5">
                First Name
              </label>
            </div>
            <div className="flex-1 relative text-left group">
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="peer w-full px-3.5 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none placeholder-transparent text-black transition-all shadow-sm"
                placeholder="Last name"
              />
              <label className="absolute left-3.5 top-3 text-slate-400 text-[12px] font-bold pointer-events-none transition-all peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-[9px] peer-focus:font-black peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5">
                Last Name
              </label>
            </div>
          </div>

          {/* 📧 Credential: Email */}
          <div className="relative group text-left">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
              <Mail className={`w-3.5 h-3.5 transition-colors duration-300 ${email ? 'text-orange-500' : 'text-slate-300 group-focus-within:text-orange-500'}`} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full pl-10 pr-9 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none placeholder-transparent text-black transition-all shadow-sm"
              placeholder="Email"
            />
            <label className="absolute left-10 top-3 text-slate-400 text-[12px] font-bold pointer-events-none transition-all peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-[9px] peer-focus:font-black peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5">
              Institutional Email
            </label>
            <AnimatePresence>
               {email.includes('@') && email.includes('.') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* 🔑 Credential: Password */}
          <div className="relative group text-left">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
              <LockKeyhole className={`w-3.5 h-3.5 transition-colors duration-300 ${password ? 'text-orange-500' : 'text-slate-300 group-focus-within:text-orange-500'}`} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full pl-10 pr-11 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none placeholder-transparent text-black transition-all shadow-sm"
              placeholder="Password"
            />
            <label className="absolute left-10 top-3 text-slate-400 text-[12px] font-bold pointer-events-none transition-all peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-[9px] peer-focus:font-black peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5">
              Security Key
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-500 transition-colors"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 📜 Legal Consent */}
        <div className="flex items-start gap-2.5 py-1 px-1">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 w-3.5 h-3.5 rounded-md border-slate-200 text-orange-500 focus:ring-orange-500/20 cursor-pointer accent-orange-500"
          />
          <label htmlFor="terms" className="text-[10px] font-bold text-slate-400 leading-relaxed cursor-pointer select-none">
            I confirm alignment with the <span className="text-orange-500 font-black">Digital Terms</span> and <span className="text-orange-500 font-black">Governance Policy</span>.
          </label>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-black text-white font-[900] rounded-xl hover:bg-orange-500 transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-2.5 text-[11px] uppercase tracking-[0.2em] group/btn overflow-hidden relative"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin opacity-60" />
              <span>Creating Account…</span>
            </>
          ) : (
            <>
              Establish Identity
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </>
          )}
        </motion.button>
      </form>

      {/* 🌐 Social Foundation */}
      <div className="pt-2">
        <div className="text-center relative mb-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-50"></div></div>
          <span className="relative bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Global Foundation</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { setSocialModal('google'); setSocialEmail(''); setSocialName(''); setSocialError(''); }}
            className="flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98] shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-3.5 h-3.5" alt="Google" />
            Google
          </button>
          <button
            type="button"
            onClick={() => { setSocialModal('apple'); setSocialEmail(''); setSocialName(''); setSocialError(''); }}
            className="flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98] shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96.95-2.06 1.95-3.32 1.95s-1.63-.78-3.08-.78c-1.44 0-1.85.75-3.08.78-1.24.03-2.5-.96-3.48-1.95C2.08 18.28 1 15.17 1 12.19c0-3.1 1.98-4.73 3.91-4.73 1.02 0 1.98.54 2.61.54s1.61-.63 2.92-.63c1.02 0 2.45.45 3.32 1.44-2.14 1.25-1.78 4.07.61 5.09-1.32 1.93-2.57 3.55-3.55 4.54l6.23 1.84zM12.03 7.25c-.07-2.34 1.92-4.32 4.31-4.25.07 2.34-1.92 4.32-4.31 4.25z"/></svg>
            Apple
          </button>
        </div>
      </div>

      {/* Social Auth Modal */}
      <AnimatePresence>
        {socialModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSocialModal(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                position: 'relative', backgroundColor: 'white', borderRadius: 28, width: '100%', maxWidth: 420,
                padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
              }}
            >
              <button
                onClick={() => setSocialModal(null)}
                style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                {socialModal === 'google' ? (
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style={{ width: 40, height: 40, margin: '0 auto 16px auto' }} alt="Google" />
                ) : (
                  <div style={{ width: 40, height: 40, margin: '0 auto 16px auto', backgroundColor: '#0f172a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.96.95-2.06 1.95-3.32 1.95s-1.63-.78-3.08-.78c-1.44 0-1.85.75-3.08.78-1.24.03-2.5-.96-3.48-1.95C2.08 18.28 1 15.17 1 12.19c0-3.1 1.98-4.73 3.91-4.73 1.02 0 1.98.54 2.61.54s1.61-.63 2.92-.63c1.02 0 2.45.45 3.32 1.44-2.14 1.25-1.78 4.07.61 5.09-1.32 1.93-2.57 3.55-3.55 4.54l6.23 1.84zM12.03 7.25c-.07-2.34 1.92-4.32 4.31-4.25.07 2.34-1.92 4.32-4.31 4.25z"/></svg>
                  </div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Sign up with {socialModal === 'google' ? 'Google' : 'Apple'}
                </h3>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8, fontWeight: 500 }}>
                  Enter your {socialModal === 'google' ? 'Google' : 'Apple ID'} email to register as <strong style={{ color: '#f97316' }}>{role}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={socialName}
                    onChange={e => setSocialName(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>
                    {socialModal === 'google' ? 'Google Email' : 'Apple ID Email'}
                  </label>
                  <input
                    type="email"
                    placeholder={socialModal === 'google' ? 'you@gmail.com' : 'you@icloud.com'}
                    value={socialEmail}
                    onChange={e => setSocialEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSocialAuth()}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, fontWeight: 600 }}
                  />
                </div>

                {socialError && (
                  <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', fontSize: 12, color: '#dc2626', fontWeight: 700 }}>
                    {socialError}
                  </div>
                )}

                <button
                  onClick={handleSocialAuth}
                  disabled={socialLoading}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                    backgroundColor: socialModal === 'google' ? '#4285f4' : '#0f172a',
                    color: 'white', fontWeight: 900, fontSize: 13, cursor: socialLoading ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    letterSpacing: '0.05em', textTransform: 'uppercase', opacity: socialLoading ? 0.7 : 1,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)', transition: 'all 0.2s'
                  }}
                >
                  {socialLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
                  ) : (
                    <>Continue with {socialModal === 'google' ? 'Google' : 'Apple'}</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;

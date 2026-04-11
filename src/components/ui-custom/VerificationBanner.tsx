import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, X, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function VerificationBanner() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Don't show if user is verified, not logged in, or dismissed
  if (!user || (user as any).emailVerified || (dismissed && !showSuccess) || (verified && !showSuccess)) return null;

  const handleSendOtp = async () => {
    setSending(true);
    setOtpError('');
    try {
      const token = localStorage.getItem('college_auth_token');
      const response = await fetch('http://localhost:5000/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setOtpSent(true);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to send verification code');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }
    setVerifying(true);
    setOtpError('');
    try {
      const token = localStorage.getItem('college_auth_token');
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update local user state
      const storedUser = JSON.parse(localStorage.getItem('college_user') || '{}');
      storedUser.emailVerified = true;
      localStorage.setItem('college_user', JSON.stringify(storedUser));

      setVerified(true);
      setShowModal(false);
      setShowSuccess(true);

      // Auto-close success modal and reload after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 3000);
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      {/* Banner */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          position: 'relative',
          zIndex: 50,
          boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)'
        }}
      >
        <ShieldAlert size={18} color="white" />
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'white' }}>
          Your email is not verified.
        </p>
        <button
          onClick={() => { setShowModal(true); if (!otpSent) handleSendOtp(); }}
          style={{
            padding: '6px 20px', borderRadius: 10, border: '2px solid white',
            backgroundColor: 'transparent', color: 'white', fontWeight: 900,
            fontSize: 11, cursor: 'pointer', textTransform: 'uppercase',
            letterSpacing: '0.05em', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { (e.target as any).style.backgroundColor = 'white'; (e.target as any).style.color = '#dc2626'; }}
          onMouseLeave={e => { (e.target as any).style.backgroundColor = 'transparent'; (e.target as any).style.color = 'white'; }}
        >
          Verify Now
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer', padding: 4
          }}
        >
          <X size={16} />
        </button>
      </motion.div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
          >
            <div
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                position: 'relative', backgroundColor: 'white', borderRadius: 28, width: '100%', maxWidth: 420,
                padding: 40, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
              }}
            >
              {/* Close */}
              <button
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', right: 20, top: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 22,
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}>
                  <ShieldCheck size={36} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Verify Your Email
                </h3>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 10, fontWeight: 500, lineHeight: 1.5 }}>
                  {otpSent
                    ? <>We sent a 6-digit code to <strong style={{ color: '#f97316' }}>{user.email}</strong></>
                    : 'Click below to receive a verification code on your registered email.'
                  }
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {!otpSent ? (
                  // Send OTP Button
                  <button
                    onClick={handleSendOtp}
                    disabled={sending}
                    style={{
                      width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: 'white', fontWeight: 900, fontSize: 13, cursor: sending ? 'wait' : 'pointer',
                      opacity: sending ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 10, letterSpacing: '0.03em', textTransform: 'uppercase',
                      boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)', transition: 'all 0.2s'
                    }}
                  >
                    {sending ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending Code...</>
                    ) : (
                      <><Mail size={16} /> Send Verification Code</>
                    )}
                  </button>
                ) : (
                  // OTP Input + Verify
                  <>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>
                        Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="_ _ _ _ _ _"
                        value={otp}
                        onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleVerify()}
                        autoFocus
                        style={{
                          width: '100%', padding: '20px 16px', borderRadius: 16,
                          border: `2px solid ${otpError ? '#ef4444' : '#e2e8f0'}`,
                          outline: 'none', fontSize: 32, fontWeight: 900, textAlign: 'center',
                          letterSpacing: '0.4em', fontFamily: 'monospace', color: '#0f172a',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={e => { if (!otpError) e.target.style.borderColor = '#2563eb'; }}
                        onBlur={e => { if (!otpError) e.target.style.borderColor = '#e2e8f0'; }}
                      />
                    </div>

                    {otpError && (
                      <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', fontSize: 12, color: '#dc2626', fontWeight: 700 }}>
                        {otpError}
                      </div>
                    )}

                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      style={{
                        width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                        backgroundColor: '#0f172a', color: 'white', fontWeight: 900, fontSize: 13,
                        cursor: verifying ? 'wait' : 'pointer', opacity: verifying ? 0.7 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)', transition: 'all 0.2s'
                      }}
                    >
                      {verifying ? (
                        <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                      ) : (
                        <><ShieldCheck size={16} /> Verify Account</>
                      )}
                    </button>

                    <button
                      onClick={() => { handleSendOtp(); setOtp(''); }}
                      disabled={sending}
                      style={{
                        border: 'none', background: 'none', fontSize: 11, color: '#94a3b8',
                        fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                        textAlign: 'center'
                      }}
                    >
                      {sending ? 'Sending...' : "Didn't receive it? Resend Code"}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
          >
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }} />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                position: 'relative', backgroundColor: 'white', borderRadius: 32, width: '100%', maxWidth: 400,
                padding: 48, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center'
              }}
            >
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                style={{
                  width: 88, height: 88, borderRadius: 26,
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 28px', boxShadow: '0 12px 32px rgba(34, 197, 94, 0.3)'
                }}
              >
                <ShieldCheck size={44} color="white" strokeWidth={2.5} />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.02em' }}
              >
                You're Verified! 🎉
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ fontSize: 14, color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.6 }}
              >
                Your email has been successfully verified. You now have full access to all features.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ marginTop: 28 }}
              >
                <button
                  onClick={() => { setShowSuccess(false); window.location.reload(); }}
                  style={{
                    padding: '14px 40px', borderRadius: 16, border: 'none',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white', fontWeight: 900, fontSize: 13, cursor: 'pointer',
                    letterSpacing: '0.03em', textTransform: 'uppercase',
                    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.25)', transition: 'all 0.2s'
                  }}
                >
                  Continue
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

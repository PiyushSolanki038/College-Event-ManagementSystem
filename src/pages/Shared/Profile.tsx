import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, Pencil, Check, X, 
  MapPin, Calendar, Award, BookOpen, Hash, 
  Camera, LogOut, Book, Sparkles, GraduationCap, 
  Briefcase, Fingerprint, Trophy, Zap,
  Settings, Building2, Users, TrendingUp,
  ShieldCheck, Star, Info, Heart, CheckCircle2, Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';
import Input from '@/components/ui-custom/Input';

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { registrations, events, categories, venues, users } = useEventContext();
  const { showToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    enrollmentNo: user?.enrollmentNo || '',
    department: user?.department || '',
    bio: user?.role === 'admin'
      ? 'Universal system principal coordinating institutional governance, infrastructure, and cross-departmental auditing.'
      : user?.role === 'organizer' 
      ? 'Institutional curator dedicated to establishing high-impact academic exhibition environments.'
      : 'Dedicated student pursuing excellence in institutional engagement and academic growth.',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        enrollmentNo: user.enrollmentNo || '',
        department: user.department || '',
        bio: formData.bio || (user.role === 'admin'
          ? 'Universal system principal coordinating institutional governance, infrastructure, and cross-departmental auditing.'
          : user.role === 'organizer' 
          ? 'Institutional curator dedicated to establishing high-impact academic exhibition environments.'
          : 'Dedicated student pursuing excellence in institutional engagement and academic growth.'),
      });
    }
  }, [user]);

  const stats = useMemo(() => {
    if (!user) return null;
    
    if (user.role === 'admin') {
      const pendingExhibits = events.filter(e => e.status === 'pending').length;
      return {
        label: 'System Oversight',
        count: events.length,
        secondaryLabel: 'Registry Depth',
        secondaryCount: users.length,
        ratingLabel: 'Governance Velocity',
        ratingValue: events.length > 0 ? (((events.length - pendingExhibits) / events.length) * 100).toFixed(0) + '%' : '100%',
        recentActivity: events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
      };
    } else if (user.role === 'organizer') {
      const managed = events.filter(e => String(e.organizerId) === String(user.id));
      const totalRegs = managed.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
      const approvedCount = managed.filter(e => e.status === 'approved').length;
      return {
        label: 'Managed Exhibitions',
        count: managed.length,
        secondaryLabel: 'Impact Reach',
        secondaryCount: totalRegs,
        ratingLabel: 'Vetting Success',
        ratingValue: managed.length > 0 ? (approvedCount / managed.length * 100).toFixed(0) + '%' : '100%',
        recentActivity: managed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
      };
    } else {
      const myRegs = registrations.filter(r => r.userId === user.id);
      const attendedEvents = events.filter(e => myRegs.some(r => r.eventId === e.id));
      return {
        label: 'Events Attended',
        count: myRegs.length,
        secondaryLabel: 'Scholar XP',
        secondaryCount: myRegs.length * 150 + 500,
        ratingLabel: 'Registry Level',
        ratingValue: 'Lvl ' + (Math.floor((myRegs.length * 150 + 500) / 1000) + 1),
        recentActivity: attendedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
      };
    }
  }, [user, events, registrations, users]);

  if (!user || !stats) return null;

  const handleSave = async () => {
    try {
      showToast('info', 'Synchronizing identity updates...');
      await updateProfile({
        name: formData.name,
        enrollmentNo: formData.enrollmentNo,
        department: formData.department
      });
      showToast('success', 'Institutional identity successfully modified.');
      setIsEditing(false);
    } catch (error) {
      showToast('danger', 'Handshake failed. Registry connection interrupted.');
    }
  };

  const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 100px 20px' }}
    >
      {/* High-Contrast Identity Hero */}
      <div style={{
        position: 'relative',
        height: 320,
        borderRadius: 40,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        overflow: 'hidden',
        marginBottom: 80,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Animated Background Gradients */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' }} 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)' }} 
        />
        
        <div style={{ position: 'absolute', inset: 0, padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Badge variant="info" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: 20, fontWeight: 700 }}>
                {user.role === 'admin' ? <Shield size={12} style={{ marginRight: 8 }} /> : user.role === 'organizer' ? <Briefcase size={12} style={{ marginRight: 8 }} /> : <GraduationCap size={12} style={{ marginRight: 8 }} />}
                Verified {user.role.toUpperCase()}
              </Badge>
              {user.role === 'admin' && (
                <Badge variant="danger" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: 20, fontWeight: 700 }}>
                  <ShieldCheck size={12} style={{ marginRight: 8 }} /> System Principal
                </Badge>
              )}
              {user.role === 'organizer' && (
                <Badge variant="success" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: 20, fontWeight: 700 }}>
                  <ShieldCheck size={12} style={{ marginRight: 8 }} /> Institution Certified
                </Badge>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {isEditing ? (
                <>
                  <Button variant="ghost" onClick={() => setIsEditing(false)} style={{ color: 'white' }}>Cancel</Button>
                  <Button onClick={handleSave} variant="primary" style={{ backgroundColor: '#2563eb', border: 'none' }}>Approve Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(12px)' }}>
                  <Pencil size={14} /> Update Persona
                </Button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {/* Massive Identity Avatar */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{ position: 'relative' }}
            >
              <div style={{
                width: 160, height: 160, borderRadius: 48, backgroundColor: 'white',
                padding: 6, boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)'
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: 42,
                  background: `linear-gradient(135deg, ${user.role === 'admin' ? '#ef4444' : (user.role === 'organizer' ? '#2563eb' : '#6366f1')} 0%, #1e1b4b 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 56, fontWeight: 900, color: 'white', letterSpacing: -2
                }}>
                  {initials}
                </div>
              </div>
              <button style={{
                position: 'absolute', bottom: -8, right: -8, width: 48, height: 48,
                borderRadius: 18, border: '6px solid #0f172a', backgroundColor: '#3b82f6',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 10px 15px rgba(0,0,0,0.2)'
              }}>
                <Camera size={22} />
              </button>
            </motion.div> 

            <div style={{ color: 'white' }}>
              <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0, letterSpacing: -1.5, display: 'flex', alignItems: 'center', gap: 12 }}>
                {formData.name}
                <CheckCircle2 size={24} color="#3b82f6" />
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: '#94a3b8' }}>
                  <Mail size={16} /> {user.email}
                </div>
                <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: '#94a3b8' }}>
                  <Fingerprint size={16} /> Registry ID: {String(user.id).padStart(4, '0')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Orchestration Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 40 }}>
        
        {/* Sidebar Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Institutional KPI Card */}
          <div style={{
            background: 'white', border: '1px solid #f1f5f9', borderRadius: 32, padding: 32,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: user.role === 'organizer' ? '#eff6ff' : '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.role === 'organizer' ? <Star size={28} color="#2563eb" /> : <Trophy size={28} color="#7c3aed" />}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stats.ratingLabel}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{stats.ratingValue}</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{stats.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{stats.count}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{stats.secondaryLabel}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: user.role === 'organizer' ? '#2563eb' : '#7c3aed', marginTop: 4 }}>{stats.secondaryCount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Quick Registry Details */}
          <div style={{
            background: '#f8fafc', borderRadius: 32, padding: 32,
            border: '1px solid #f1f5f9'
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>System Attributes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <Shield size={18} color="#64748b" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Access Clearance</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Standard {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Permissions</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <Calendar size={18} color="#64748b" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Registry Stability</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Account Active</div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={logout}
              style={{
                width: '100%', marginTop: 32, padding: '16px', borderRadius: 18,
                border: '1px solid #fee2e2', backgroundColor: 'white', color: '#dc2626',
                fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 10, transition: 'all 0.2s', fontSize: 13
              }}
            >
              <LogOut size={16} /> Deactivate Current Session
            </button>
          </div>
        </div>

        {/* Primary Data Suite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Professional Credentials */}
          <div style={{
            background: 'white', borderRadius: 40, padding: 48,
            border: '1px solid #f1f5f9', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={24} color="#2563eb" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>Institutional Identification</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 16 }}>Registry Enrollment No.</label>
                {isEditing ? (
                  <Input 
                    placeholder="Enter official ID..." 
                    value={formData.enrollmentNo}
                    onChange={e => setFormData({...formData, enrollmentNo: e.target.value})}
                  />
                ) : (
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', backgroundColor: '#f8fafc', padding: '16px 24px', borderRadius: 20, border: '1px solid #f1f5f9', display: 'inline-block' }}>
                    {user.enrollmentNo || 'AWAITING_REGISTRATION'}
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 16 }}>Academic Domain</label>
                {isEditing ? (
                  <select
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '2px solid #f1f5f9', fontSize: 15, fontWeight: 600, outline: 'none', backgroundColor: '#f8fafc', height: 48 }}
                  >
                    <option value="">Select Domain</option>
                    <option value="Computer Science">Computer Science & Eng.</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics & Commun.</option>
                    <option value="Management">Institutional Management</option>
                    <option value="Governance">Institutional Governance</option>
                    <option value="Infrastructure">Infrastructure Management</option>
                  </select>
                ) : (
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', backgroundColor: '#f8fafc', padding: '16px 24px', borderRadius: 20, border: '1px solid #f1f5f9', display: 'inline-block' }}>
                    {user.department || 'DOMAIN_UNSPECIFIED'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 16 }}>Mission Abstract (Bio)</label>
              {isEditing ? (
                <textarea 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  style={{ width: '100%', padding: '24px', borderRadius: 24, border: '2px solid #f1f5f9', fontSize: 15, fontWeight: 500, outline: 'none', backgroundColor: '#f8fafc', minHeight: 140, resize: 'none', lineHeight: 1.7 }}
                  placeholder="Detail your curatorial objectives..."
                />
              ) : (
                <div style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, padding: '32px', backgroundColor: '#f8fafc', borderRadius: 24, border: '1px solid #f1f5f9', position: 'relative' }}>
                  <Sparkles size={24} color="#3b82f6" style={{ position: 'absolute', top: 20, right: 20, opacity: 0.1 }} />
                  {formData.bio}
                </div>
              )}
            </div>
          </div>

          {/* Institutional Portfolio / Activity Ledger */}
          <div style={{
            background: 'white', borderRadius: 40, padding: 48,
            border: '1px solid #f1f5f9', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={24} color="#f97316" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>Impact Ledger</h3>
              </div>
              <Badge variant="info" style={{ fontWeight: 800, padding: '6px 16px' }}>{stats.count} Recognized Records</Badge>
            </div>

            {stats.recentActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', border: '2px dashed #f1f5f9', borderRadius: 32 }}>
                <Building2 size={56} color="#f1f5f9" style={{ marginBottom: 20 }} />
                <div style={{ fontSize: 16, fontWeight: 800, color: '#94a3b8' }}>Portfolio currently empty.</div>
                <p style={{ fontSize: 14, color: '#cbd5e1', marginTop: 8 }}>Initiate an exhibition lifecycle to populate your impact ledger.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {stats.recentActivity.map((event, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 24, padding: 24,
                      borderRadius: 24, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)', flexShrink: 0 }}>
                      <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{event.title}</div>
                      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <MapPin size={14} color="#2563eb" /> {venues.find(v => v.id === event.venueId)?.name || 'Institutional Plaza'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <Badge variant={event.status as any} style={{ marginTop: 6 }}>{event.status}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 32, padding: '16px 24px', backgroundColor: '#eff6ff', borderRadius: 20, border: '1px solid #dbeafe' }}>
              <Info size={16} color="#3b82f6" />
              <p style={{ fontSize: 13, color: '#1e40af', fontWeight: 600, margin: 0 }}>
                This impact ledger summarizes your verified contributions to the institutional engagement ecosystem.
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Profile;

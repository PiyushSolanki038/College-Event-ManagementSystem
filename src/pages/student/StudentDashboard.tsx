import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, ArrowRight, CheckCircle2, 
  TrendingUp, Download, ExternalLink, ShieldCheck, 
  Bell, Search, User, Filter, GraduationCap, Briefcase, 
  Trophy, BookOpen, Fingerprint, Zap, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { events, registrations, venues, categories } = useEventContext();
  const navigate = useNavigate();

  if (!user) return null;

  const now = new Date().toISOString().split('T')[0];
  
  const myRegs = useMemo(() => {
    return registrations.filter(r => r.userId === user.id);
  }, [registrations, user.id]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => myRegs.some(r => r.eventId === e.id))
      .filter(e => e.date >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, myRegs, now]);

  const recommendedEvents = useMemo(() => {
    return events
      .filter(e => !myRegs.some(r => r.eventId === e.id) && e.status === 'approved')
      .slice(0, 4);
  }, [events, myRegs]);

  const nextEvent = upcomingEvents[0];
  const nextEventVenue = nextEvent ? venues.find(v => v.id === nextEvent.venueId) : null;

  return (
    <div style={{ padding: '0 40px 80px 40px' }}>
      {/* Premium Welcome Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, marginTop: 40 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 16 }}>
            Hello, {user.name.split(' ')[0]} <motion.span animate={{ rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }}>👋</motion.span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', marginTop: 8, fontWeight: 500 }}>
            Here is your institutional engagement pulse for the 2026 Academic Season.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ width: 44, height: 44, borderRadius: 14, border: '1px solid #f1f5f9', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
            <Search size={18} />
          </button>
          <button style={{ width: 44, height: 44, borderRadius: 14, border: '1px solid #f1f5f9', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', position: 'relative' }}>
            <Bell size={18} />
            <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', border: '2px solid white' }} />
          </button>
        </div>
      </div>

      {/* Hero Analytics & Featured Block */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginBottom: 48 }}>
        {/* Next Engagement Feature */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'relative', borderRadius: 32, padding: 40, overflow: 'hidden',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: 'white'
          }}
        >
          <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' }} />
          
          <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Badge variant="info" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', backdropFilter: 'blur(10px)', marginBottom: 24, padding: '6px 16px' }}>
                Next Engagement
              </Badge>
              {nextEvent ? (
                <>
                  <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0', maxWidth: '80%' }}>{nextEvent.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: 0.8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                      <Calendar size={16} /> {new Date(nextEvent.date).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                      <Clock size={16} /> {nextEvent.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                      <MapPin size={16} /> {nextEventVenue?.name || 'Academic Center'}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding: '20px 0' }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0, opacity: 0.6 }}>No Scheduled Events</h3>
                  <p style={{ fontSize: 14, opacity: 0.6, marginTop: 8 }}>Your itinerary is currently clear.</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
              {nextEvent && (
                <Button onClick={() => navigate(`/student/event/${nextEvent.id}`)} style={{ backgroundColor: 'white', color: '#1e1b4b', border: 'none', fontWeight: 700 }}>
                  View Check-in Pass
                </Button>
              )}
              <Button 
                onClick={() => navigate('/student/discover')} 
                variant="outline" 
                style={{ border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
              >
                Explore All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24 }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #f1f5f9', borderRadius: 28, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={28} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Credits Earned</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{myRegs.length * 10} Unlocks</div>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #f1f5f9', borderRadius: 28, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={28} color="#f97316" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Participation Rate</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>92.4%</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 40 }}>
        {/* Recommended Stream */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Recommended for You</h3>
            <button onClick={() => navigate('/student/discover')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              Browse Gallery <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {recommendedEvents.map(event => (
              <motion.div 
                key={event.id}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/student/event/${event.id}`)}
                style={{ 
                  backgroundColor: 'white', borderRadius: 24, overflow: 'hidden', border: '1px solid #f1f5f9', 
                  cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ height: 160, position: 'relative' }}>
                  <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Badge variant="info" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#0f172a', backdropFilter: 'blur(4px)' }}>
                      {categories.find(c => c.id === event.categoryId)?.name || 'Event'}
                    </Badge>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>{event.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Institutional Record Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ 
            backgroundColor: '#f8fafc', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9'
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={16} /> Registry Profile
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <Fingerprint size={18} color="#64748b" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Enrollment No</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{user.enrollmentNo || 'PENDING'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <BookOpen size={18} color="#64748b" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Academy</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{user.department || 'GENERAL'}</div>
                </div>
              </div>
            </div>
            
            <Button 
              block 
              variant="primary" 
              onClick={() => navigate('/profile')} 
              style={{ marginTop: 24, borderRadius: 14, fontSize: 13, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
            >
              Verify Identity <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
            </Button>
          </div>

          {/* Quick Schedule Recap */}
          <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 24 }}>Recap Schedule</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {upcomingEvents.slice(0, 3).map(event => (
                <div key={event.id} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#2563eb', width: 40 }}>{new Date(event.date).getDate()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{event.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

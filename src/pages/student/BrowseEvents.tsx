import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';
import Modal from '@/components/ui-custom/Modal';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, Search, Sparkles, 
  Share2, ArrowRight, Filter, Target, CreditCard,
  Layers, ChevronRight, LayoutGrid, List,
  User, Mail, Phone, Award
} from 'lucide-react';
import TicketModal from '@/components/ui-custom/TicketModal';
import { formatDate } from '@/utils/helpers';

export default function BrowseEvents() {
  const { user } = useAuth();
  const { events, registrations, venues, categories: systemCategories, registerForEvent } = useEventContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Ticket Modal State
  const [ticketModal, setTicketModal] = useState<{ isOpen: boolean; event: any; registration: any; venue: any }>({
    isOpen: false,
    event: null,
    registration: null,
    venue: null
  });

  // Registration Form Modal State
  const [showRegForm, setShowRegForm] = useState(false);
  const [regEventId, setRegEventId] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({
    attendeeName: user?.name || '',
    attendeeGender: 'Female',
    attendeeContact: '',
    attendeeEmail: user?.email || ''
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certEventId, setCertEventId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState({ certificateName: user?.name || '', contactNumber: '', contactEmail: user?.email || '' });
  const [certErrors, setCertErrors] = useState<Record<string, string>>({});
  const [certLoading, setCertLoading] = useState(false);

  if (!user) return null;

  const myRegEventIds = registrations.map(r => r.eventId);

  const filtered = useMemo(() => {
    return events
      .filter(e => e.status === 'approved')
      .filter(e => {
        const matchesSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
        const matchesCat = selectedCategory === 'all' || e.categoryId === parseInt(selectedCategory);
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, search, selectedCategory]);

  const featuredEvent = useMemo(() => {
    return filtered.length > 0 ? filtered[0] : null;
  }, [filtered]);

  const handleShare = async (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/student/event/${event.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this institutional exhibition: ${event.title}`,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('success', 'Registry link copied for external distribution');
  };

  const openRegForm = (eventId: string) => {
    setRegEventId(eventId);
    setRegForm({
      attendeeName: user?.name || '',
      attendeeGender: 'Female',
      attendeeContact: '',
      attendeeEmail: user?.email || ''
    });
    setRegErrors({});
    setShowRegForm(true);
  };

  const validateRegForm = () => {
    const errs: Record<string, string> = {};
    if (!regForm.attendeeName.trim()) errs.attendeeName = 'Name is required';
    if (!regForm.attendeeEmail.trim()) errs.attendeeEmail = 'Email is required';
    if (!regForm.attendeeContact.trim()) errs.attendeeContact = 'Contact number is required';
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validateRegForm() || !regEventId) return;
    try {
      setShowRegForm(false);
      showToast('info', 'Secure registry handshake initiated...');
      const registration = await registerForEvent(regEventId, user.id, regForm);
      const rawEvent = events.find(ev => ev.id === regEventId);
      const venue = venues.find(v => v.id === rawEvent?.venueId);
      const category = systemCategories.find(c => c.id === rawEvent?.categoryId);
      
      setTicketModal({
        isOpen: true,
        event: { ...rawEvent, category },
        registration: { ...registration, ...regForm },
        venue
      });
    } catch (err) {
      // Error handled in context
    }
  };

  const categories = [{ id: 'all', name: 'All Disciplines' }, ...systemCategories];

  return (
    <div style={{ padding: '0 40px 80px 40px' }}>
      {/* Featured Exhibition Hero */}
      <AnimatePresence mode="wait">
        {featuredEvent && !search && selectedCategory === 'all' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ position: 'relative', height: 440, borderRadius: 40, overflow: 'hidden', marginBottom: 64, marginTop: 24 }}
          >
            <img src={featuredEvent.bannerImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 100%)' }} />
            
            <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ maxWidth: '60%' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <Badge variant="info" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.2)', padding: '6px 14px' }}>Featured Exhibition</Badge>
                  <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                    <Sparkles size={14} color="#fbbf24" /> 500+ Registered
                  </div>
                </div>
                <h1 style={{ fontSize: 44, fontWeight: 900, color: 'white', margin: '0 0 16px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{featuredEvent.title}</h1>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', margin: '0 0 24px 0', fontWeight: 500, lineHeight: 1.6 }}>{featuredEvent.description.substring(0, 160)}...</p>
                <div style={{ display: 'flex', gap: 24, color: 'white', opacity: 0.9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}><Calendar size={18} /> {formatDate(featuredEvent.date)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}><MapPin size={18} /> {venues.find(v => v.id === featuredEvent.venueId)?.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <button 
                  onClick={e => handleShare(e, featuredEvent)}
                  style={{ width: 56, height: 56, borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Share2 size={22} />
                </button>
                <Button onClick={() => navigate(`/student/event/${featuredEvent.id}`)} style={{ padding: '16px 32px', borderRadius: 20, fontSize: 15 }}>
                  Reserve Official Slot <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery Hub Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Discovery <span style={{ color: '#2563eb' }}>Hub</span>
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', marginTop: 8, fontWeight: 500 }}>{filtered.length} verified institutional events currently open for registration.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setViewMode('grid')} style={{ width: 44, height: 44, borderRadius: 12, border: 'none', backgroundColor: viewMode === 'grid' ? '#0f172a' : '#f1f5f9', color: viewMode === 'grid' ? 'white' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LayoutGrid size={18}/></button>
          <button onClick={() => setViewMode('list')} style={{ width: 44, height: 44, borderRadius: 12, border: 'none', backgroundColor: viewMode === 'list' ? '#0f172a' : '#f1f5f9', color: viewMode === 'list' ? 'white' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><List size={18}/></button>
        </div>
      </div>

      {/* Advanced Filter Suite */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48, backgroundColor: 'white', padding: 32, borderRadius: 32, border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              style={{
                flexShrink: 0, padding: '10px 24px', borderRadius: 14, border: '1px solid', 
                backgroundColor: selectedCategory === cat.id.toString() ? '#2563eb' : 'white',
                borderColor: selectedCategory === cat.id.toString() ? '#2563eb' : '#e2e8f0',
                color: selectedCategory === cat.id.toString() ? 'white' : '#475569',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              placeholder="Search by topic, faculty, or keyword..." 
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 52px', border: '1px solid #e2e8f0', borderRadius: 16, fontSize: 14, outline: 'none', color: '#1e293b' }}
            />
          </div>
          <Button variant="outline" style={{ borderRadius: 16, padding: '0 24px' }}>
            <Filter size={16} /> Advanced Filter
          </Button>
        </div>
      </div>

      {/* Result Stream */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '120px 0', backgroundColor: '#f8fafc', borderRadius: 40 }}>
          <Calendar size={64} strokeWidth={1} color="#cbd5e1" style={{ marginBottom: 24 }} />
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>No exhibitions found</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Try reframing your search criteria.</p>
        </div>
      ) : (
        <div style={{ 
          display: viewMode === 'grid' ? 'grid' : 'flex',
          flexDirection: viewMode === 'list' ? 'column' : undefined,
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(360px, 1fr))' : undefined, 
          gap: 32 
        }}>
          {filtered.map(event => {
            const venue = venues.find(v => v.id === event.venueId);
            const isRegistered = myRegEventIds.includes(event.id);
            const isFull = event.registeredCount >= event.maxCapacity;

            return (
              <motion.div 
                layout key={event.id} onClick={() => navigate(`/student/event/${event.id}`)}
                style={{ backgroundColor: 'white', borderRadius: 32, border: '1px solid #f1f5f9', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: viewMode === 'list' ? 'row' : 'column' }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)' }}
              >
                <div style={{ width: viewMode === 'list' ? 280 : '100%', height: viewMode === 'list' ? 180 : 200, position: 'relative' }}>
                  <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                    <button 
                      onClick={e => handleShare(e, event)}
                      style={{ width: 32, height: 32, borderRadius: 10, border: 'none', backgroundColor: 'rgba(255,255,255,0.9)', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                    >
                      <Share2 size={16} />
                    </button>
                    <Badge variant={isRegistered ? 'approved' : isFull ? 'danger' : 'info'}>
                      {isRegistered ? 'Registered' : isFull ? 'Capacity Reached' : 'Open'}
                    </Badge>
                  </div>
                </div>

                <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {systemCategories.find(c => c.id === event.categoryId)?.name || 'General Admission'}
                    </div>
                    {event.price && event.price > 0 && (
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CreditCard size={14} /> ${event.price}
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', lineHeight: 1.4, letterSpacing: '-0.01em' }}>{event.title}</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 500 }}><Calendar size={14}/> {formatDate(event.date)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 500 }}><Clock size={14}/> {event.time}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 500 }}><MapPin size={14}/> {venue?.name.substring(0, 18)}...</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 500 }}><Target size={14}/> {event.targetAudience}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Sparkles size={14} color="#7c3aed" />
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed' }}>+50 XP</span>
                    </div>
                    {!isRegistered && !isFull && (
                      <Button size="sm" onClick={e => { e.stopPropagation(); openRegForm(event.id); }} style={{ borderRadius: 12, padding: '8px 20px' }}>
                        Register Official Entry
                      </Button>
                    )}
                    {isRegistered && (event as any).certificateEnabled && (
                      <Button size="sm" onClick={e => { e.stopPropagation(); setCertEventId(event.id); setCertForm({ certificateName: user?.name || '', contactNumber: '', contactEmail: user?.email || '' }); setCertErrors({}); setShowCertModal(true); }} style={{ borderRadius: 12, padding: '8px 20px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe' }}>
                        <Award size={14} /> Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Registration Details Modal */}
      <Modal isOpen={showRegForm} onClose={() => setShowRegForm(false)} title="Complete Registration">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12, padding: 16, backgroundColor: '#eff6ff', borderRadius: 16, border: '1px solid #dbeafe' }}>
            <User size={18} color="#2563eb" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#1e40af', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
              Please fill in your details to complete the registration. These details will appear on your event ticket.
            </p>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={regForm.attendeeName} onChange={e => setRegForm(p => ({ ...p, attendeeName: e.target.value }))} placeholder="Enter your full name" style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${regErrors.attendeeName ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            {regErrors.attendeeName && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {regErrors.attendeeName}</p>}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Gender *</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Female', 'Male', 'Other'].map(g => (
                <button key={g} onClick={() => setRegForm(p => ({ ...p, attendeeGender: g }))} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid', borderColor: regForm.attendeeGender === g ? '#2563eb' : '#e2e8f0', backgroundColor: regForm.attendeeGender === g ? '#eff6ff' : 'white', color: regForm.attendeeGender === g ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Contact Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="tel" value={regForm.attendeeContact} onChange={e => setRegForm(p => ({ ...p, attendeeContact: e.target.value }))} placeholder="Enter your phone number" style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${regErrors.attendeeContact ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            {regErrors.attendeeContact && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {regErrors.attendeeContact}</p>}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" value={regForm.attendeeEmail} onChange={e => setRegForm(p => ({ ...p, attendeeEmail: e.target.value }))} placeholder="Enter your email address" style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${regErrors.attendeeEmail ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            {regErrors.attendeeEmail && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {regErrors.attendeeEmail}</p>}
          </div>

          <button onClick={handleRegister} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.25)', transition: 'all 0.2s' }}>
            Confirm & Register
          </button>
        </div>
      </Modal>

      <TicketModal 
        isOpen={ticketModal.isOpen}
        onClose={() => setTicketModal(prev => ({ ...prev, isOpen: false }))}
        event={ticketModal.event}
        registration={ticketModal.registration}
        venue={ticketModal.venue}
        user={user}
        showToast={showToast}
      />

      {/* Certificate Modal */}
      <Modal isOpen={showCertModal} onClose={() => setShowCertModal(false)} title="Generate Participation Certificate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12, padding: 16, backgroundColor: '#eff6ff', borderRadius: 16, border: '1px solid #dbeafe' }}>
            <Award size={20} color="#2563eb" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#1e40af', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
              Enter the name for your certificate. Contact details are shared with the organizer.
            </p>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Name on Certificate *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={certForm.certificateName} onChange={e => setCertForm(p => ({ ...p, certificateName: e.target.value }))} placeholder="Your full name" style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${certErrors.certificateName ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            {certErrors.certificateName && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {certErrors.certificateName}</p>}
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Contact Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="tel" value={certForm.contactNumber} onChange={e => setCertForm(p => ({ ...p, contactNumber: e.target.value }))} placeholder="Your contact number" style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${certErrors.contactNumber ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            {certErrors.contactNumber && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {certErrors.contactNumber}</p>}
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" value={certForm.contactEmail} onChange={e => setCertForm(p => ({ ...p, contactEmail: e.target.value }))} placeholder="Your email" style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${certErrors.contactEmail ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            {certErrors.contactEmail && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {certErrors.contactEmail}</p>}
          </div>
          <button
            onClick={async () => {
              const errs: Record<string, string> = {};
              if (!certForm.certificateName.trim()) errs.certificateName = 'Name is required';
              if (!certForm.contactEmail.trim()) errs.contactEmail = 'Email is required';
              if (!certForm.contactNumber.trim()) errs.contactNumber = 'Contact is required';
              setCertErrors(errs);
              if (Object.keys(errs).length > 0) return;
              setCertLoading(true);
              try {
                const token = localStorage.getItem('college_auth_token');
                const response = await fetch('http://localhost:5000/api/certificates/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({ eventId: certEventId, ...certForm })
                });
                if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const ev = events.find(e => e.id === certEventId);
                a.href = url; a.download = `Certificate-${(ev?.title || 'Event').replace(/\s+/g, '_')}.pdf`; a.click();
                URL.revokeObjectURL(url);
                setShowCertModal(false);
                showToast('success', 'Certificate downloaded!');
              } catch (error: any) {
                showToast('danger', error.message || 'Certificate generation failed');
              } finally { setCertLoading(false); }
            }}
            disabled={certLoading}
            style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 800, fontSize: 15, cursor: certLoading ? 'wait' : 'pointer', opacity: certLoading ? 0.7 : 1, boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <Award size={18} /> {certLoading ? 'Generating...' : 'Download Certificate'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

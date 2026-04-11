import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/ui-custom/Button';
import Card from '@/components/ui-custom/Card';
import Badge from '@/components/ui-custom/Badge';
import Modal from '@/components/ui-custom/Modal';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Sparkles, Building2, User, Mail, Phone, Award, MessageCircle } from 'lucide-react';
import TicketModal from '@/components/ui-custom/TicketModal';
import EmailModal from '@/components/ui-custom/EmailModal';
import { formatDate } from '@/utils/helpers';

export default function EventDetail() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { events, registrations, venues, users, categories: systemCategories, registerForEvent, unregisterFromEvent } = useEventContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Ticket Modal State
  const [ticketModal, setTicketModal] = useState<{ isOpen: boolean; event: any; registration: any; venue: any }>({
    isOpen: false,
    event: null,
    registration: null,
    venue: null
  });

  // Registration Form Modal State
  const [showRegForm, setShowRegForm] = useState(false);
  const [regForm, setRegForm] = useState({
    attendeeName: user?.name || '',
    attendeeGender: 'Female',
    attendeeContact: '',
    attendeeEmail: user?.email || ''
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({
    certificateName: user?.name || '',
    contactNumber: '',
    contactEmail: user?.email || ''
  });
  const [certErrors, setCertErrors] = useState<Record<string, string>>({});
  const [certLoading, setCertLoading] = useState(false);

  // Email Modal State
  const [emailModal, setEmailModal] = useState({
    isOpen: false,
    recipientName: '',
    recipientEmail: '',
    targetId: ''
  });

  const event = events.find(e => e.id === eventId);
  const isAccessible = event && (event.status === 'approved' || user.role !== 'student');

  if (!event || !user || !isAccessible) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0' }}>
      <Calendar size={64} strokeWidth={1} color="var(--outline-variant)" />
      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', marginTop: 24 }}>Official Registry Entry Not Found</p>
      <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 8, textAlign: 'center', maxWidth: 400 }}>
        The exhibition you are looking for may be under institutional review or has been archived.
      </p>
      <button onClick={() => navigate('/student/discover')} style={{ marginTop: 24, fontSize: 14, color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <ArrowLeft size={16} /> Return to Discovery
      </button>
    </div>
  );

  const venue = venues.find(v => v.id === event.venueId);
  const organizer = users.find(u => u.id === event.organizerId);
  const userRegistration = registrations.find(r => r.userId === user.id && r.eventId === event.id);
  const isRegistered = !!userRegistration;
  const seatsLeft = event.maxCapacity - event.registeredCount;
  const isFull = seatsLeft <= 0;
  const fillPercent = (event.registeredCount / event.maxCapacity) * 100;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join me at this exhibition: ${event.title}`,
          url: shareUrl,
        });
      } catch (err) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('success', 'Event link copied to clipboard');
  };

  const openRegForm = () => {
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
    if (!validateRegForm()) return;
    try {
      if (!event || !user) return;
      setShowRegForm(false);
      showToast('info', 'Processing institutional registration...');
      const registration = await registerForEvent(event.id, user.id, regForm);
      const category = systemCategories.find(c => c.id === event.categoryId);
      
      setTicketModal({
        isOpen: true,
        event: { ...event, category },
        registration: { ...registration, ...regForm },
        venue
      });
    } catch (err) {
      // Error handled in context
    }
  };

  const handleUnregister = () => {
    if (userRegistration) {
      unregisterFromEvent(userRegistration.id);
      showToast('danger', 'Registration Cancelled');
    }
  };

  const openCertModal = () => {
    setCertForm({
      certificateName: user?.name || '',
      contactNumber: '',
      contactEmail: user?.email || ''
    });
    setCertErrors({});
    setShowCertModal(true);
  };

  const handleGenerateCertificate = async () => {
    const errs: Record<string, string> = {};
    if (!certForm.certificateName.trim()) errs.certificateName = 'Name is required';
    if (!certForm.contactEmail.trim()) errs.contactEmail = 'Email is required';
    if (!certForm.contactNumber.trim()) errs.contactNumber = 'Contact is required';
    setCertErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setCertLoading(true);
    try {
      const token = localStorage.getItem('college_auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/certificates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: event.id,
          certificateName: certForm.certificateName,
          contactNumber: certForm.contactNumber,
          contactEmail: certForm.contactEmail
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Certificate generation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate-${event.title.replace(/\s+/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setShowCertModal(false);
      showToast('success', 'Certificate downloaded successfully!');
    } catch (error: any) {
      showToast('danger', error.message || 'Certificate generation failed');
    } finally {
      setCertLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      {/* Editorial Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, marginTop: 16 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600,
            color: 'var(--on-surface-variant)', background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', borderRadius: 12, backgroundColor: 'var(--surface-low)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-high)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--surface-low)'}
        >
          <ArrowLeft size={16} strokeWidth={2} /> Back to Gallery
        </button>
        <button 
          onClick={handleShare}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600,
            color: 'var(--primary)', background: 'none', border: '1px solid var(--primary)', cursor: 'pointer',
            padding: '8px 16px', borderRadius: 12, transition: 'all 0.2s ease'
          }}
        >
          <Share2 size={16} /> Share Exhibition
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: 48, alignItems: 'start' }}>
        {/* Main Editorial Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* Magazine Cover Hero */}
          <div style={{ position: 'relative' }}>
            {event.bannerImage ? (
              <div style={{ borderRadius: 32, overflow: 'hidden', height: 400, boxShadow: 'var(--shadow-ambient)' }}>
                <img src={event.bannerImage} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ borderRadius: 32, backgroundColor: 'var(--surface-low)', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={80} strokeWidth={0.5} color="var(--outline-variant)" />
              </div>
            )}
            
            {/* Overlapping Info Chip */}
            <div style={{ 
              position: 'absolute', 
              bottom: -24, 
              left: 40, 
              padding: '16px 32px', 
              backgroundColor: 'var(--surface)', 
              borderRadius: 20, 
              boxShadow: '0 10px 25px rgba(0, 52, 94, 0.1)',
              display: 'flex',
              gap: 24,
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>{formatDate(event.date)}</span>
              </div>
              <div style={{ width: 1, height: 24, backgroundColor: 'var(--outline-variant)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>{event.time}</span>
              </div>
              <div style={{ width: 1, height: 24, backgroundColor: 'var(--outline-variant)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Credits</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>+50 XP</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 24 }}>
              <Badge variant={isRegistered ? 'approved' : (event.status === 'pending' ? 'warning' : 'info')}>
                {isRegistered ? 'Successfully Registered' : (event.status === 'pending' ? 'Pending Institutional Review' : 'Registration Open')}
              </Badge>
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, color: 'var(--on-surface)', margin: '0 0 32px 0', lineHeight: 1.1, fontFamily: 'Manrope, sans-serif' }}>
              {event.title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <section>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Abstract</h3>
                <div style={{ fontSize: 17, color: 'var(--on-surface)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif' }}>
                  {event.description}
                </div>
              </section>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
                <Card variant="flat">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', margin: 0 }}>VENUE</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', margin: 0 }}>{venue?.name || 'Main Hall'}</p>
                    </div>
                  </div>
                </Card>
                <Card variant="flat">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', margin: 0 }}>PARTICIPANTS</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', margin: 0 }}>{event.registeredCount}/{event.maxCapacity} Enrolled</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'sticky', top: 120 }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0', fontFamily: 'Manrope, sans-serif' }}>Admission</h4>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', margin: 0 }}>This is a curated event for students. Entry is complimentary upon registration.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Availability</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: isFull ? 'var(--error)' : 'var(--primary)' }}>
                    {isFull ? 'At Capacity' : `${seatsLeft} Seats Left`}
                  </span>
                </div>
                
                {/* Slim Premium Progress Bar */}
                <div style={{ height: 4, backgroundColor: 'var(--surface-low)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    width: `${fillPercent}%`,
                    height: '100%',
                    backgroundColor: fillPercent > 80 ? '#ef4444' : 'var(--primary)',
                    borderRadius: 2,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                {isRegistered ? (
                  <Button variant="danger" onClick={handleUnregister} style={{ width: '100%', padding: '16px', borderRadius: 16 }}>
                    Cancel Registration
                  </Button>
                ) : isFull ? (
                  <Button variant="secondary" disabled style={{ width: '100%', padding: '16px', borderRadius: 16, opacity: 0.5 }}>
                    Registration Unavailable
                  </Button>
                ) : (
                  <Button onClick={openRegForm} style={{ width: '100%', padding: '16px', borderRadius: 16 }}>
                    Confirm Attendance
                  </Button>
                )}
              </div>
              
              {/* Certificate Button */}
              {isRegistered && (event as any).certificateEnabled && (
                <Button onClick={openCertModal} variant="secondary" style={{ width: '100%', padding: '16px', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', fontWeight: 800 }}>
                  <Award size={18} /> Generate Certificate
                </Button>
              )}

              {/* Contact Curator Button */}
              {user.role === 'student' && (
                <button
                  onClick={() => setEmailModal({
                    isOpen: true,
                    recipientName: organizer?.name || 'Curator',
                    recipientEmail: organizer?.email || '',
                    targetId: organizer?.id || ''
                  })}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 16, border: '1px solid #e2e8f0',
                    backgroundColor: 'white', color: '#475569', fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <MessageCircle size={18} /> Contact Curator
                </button>
              )}

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Sparkles size={12} /> Verification required at entry
                </p>
              </div>
            </div>
          </Card>

          <div style={{ padding: '0 16px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Location</h4>
            {venue ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 14, color: 'var(--on-surface)', fontWeight: 600, margin: 0 }}>{venue.name}</p>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', margin: 0 }}>{venue.location}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {venue.facilities.map(f => (
                    <span key={f} style={{ fontSize: 11, fontWeight: 600, color: 'var(--on-surface-variant)', backgroundColor: 'var(--surface-low)', padding: '4px 10px', borderRadius: 8 }}>{f}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Location details will be shared via email.</p>
            )}
          </div>
        </div>
      </div>

      {/* Registration Details Modal */}
      <Modal isOpen={showRegForm} onClose={() => setShowRegForm(false)} title="Complete Registration">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12, padding: 16, backgroundColor: '#eff6ff', borderRadius: 16, border: '1px solid #dbeafe' }}>
            <User size={18} color="#2563eb" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#1e40af', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
              Please fill in your details to complete registration for <strong>"{event.title}"</strong>. These details will appear on your event ticket.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={regForm.attendeeName}
                onChange={e => setRegForm(p => ({ ...p, attendeeName: e.target.value }))}
                placeholder="Enter your full name"
                style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${regErrors.attendeeName ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }}
              />
            </div>
            {regErrors.attendeeName && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {regErrors.attendeeName}</p>}
          </div>

          {/* Gender */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Gender *</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Female', 'Male', 'Other'].map(g => (
                <button
                  key={g}
                  onClick={() => setRegForm(p => ({ ...p, attendeeGender: g }))}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: '1px solid',
                    borderColor: regForm.attendeeGender === g ? '#2563eb' : '#e2e8f0',
                    backgroundColor: regForm.attendeeGender === g ? '#eff6ff' : 'white',
                    color: regForm.attendeeGender === g ? '#2563eb' : '#64748b',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Contact Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                value={regForm.attendeeContact}
                onChange={e => setRegForm(p => ({ ...p, attendeeContact: e.target.value }))}
                placeholder="Enter your phone number"
                style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${regErrors.attendeeContact ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }}
              />
            </div>
            {regErrors.attendeeContact && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {regErrors.attendeeContact}</p>}
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={regForm.attendeeEmail}
                onChange={e => setRegForm(p => ({ ...p, attendeeEmail: e.target.value }))}
                placeholder="Enter your email address"
                style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${regErrors.attendeeEmail ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }}
              />
            </div>
            {regErrors.attendeeEmail && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {regErrors.attendeeEmail}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleRegister}
            style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              backgroundColor: '#2563eb', color: 'white', fontWeight: 800, fontSize: 15,
              cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.2s'
            }}
          >
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

      {/* Certificate Generation Modal */}
      <Modal isOpen={showCertModal} onClose={() => setShowCertModal(false)} title="Generate Participation Certificate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12, padding: 16, backgroundColor: '#eff6ff', borderRadius: 16, border: '1px solid #dbeafe' }}>
            <Award size={20} color="#2563eb" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#1e40af', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
              Enter the name you want on your certificate for <strong>"{event.title}"</strong>. Your contact details are shared with the organizer for verification.
            </p>
          </div>

          {/* Name for Certificate */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Name on Certificate *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={certForm.certificateName}
                onChange={e => setCertForm(p => ({ ...p, certificateName: e.target.value }))}
                placeholder="Your full name as it should appear"
                style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${certErrors.certificateName ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }}
              />
            </div>
            {certErrors.certificateName && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {certErrors.certificateName}</p>}
          </div>

          {/* Contact Number */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Contact Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                value={certForm.contactNumber}
                onChange={e => setCertForm(p => ({ ...p, contactNumber: e.target.value }))}
                placeholder="Your contact number"
                style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${certErrors.contactNumber ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }}
              />
            </div>
            {certErrors.contactNumber && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {certErrors.contactNumber}</p>}
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={certForm.contactEmail}
                onChange={e => setCertForm(p => ({ ...p, contactEmail: e.target.value }))}
                placeholder="Your email address"
                style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 14, border: `1px solid ${certErrors.contactEmail ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontSize: 14, fontWeight: 500 }}
              />
            </div>
            {certErrors.contactEmail && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 700 }}>* {certErrors.contactEmail}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleGenerateCertificate}
            disabled={certLoading}
            style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              backgroundColor: '#2563eb', color: 'white', fontWeight: 800, fontSize: 15,
              cursor: certLoading ? 'wait' : 'pointer', opacity: certLoading ? 0.7 : 1,
              boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
            }}
          >
            <Award size={18} />
            {certLoading ? 'Generating...' : 'Download Certificate'}
          </button>
        </div>
      </Modal>

      {/* Institutional Communication Modal */}
      <EmailModal 
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal(prev => ({ ...prev, isOpen: false }))}
        recipientName={emailModal.recipientName}
        recipientEmail={emailModal.recipientEmail}
        targetId={emailModal.targetId}
        type="direct"
      />
    </div>
  );
}

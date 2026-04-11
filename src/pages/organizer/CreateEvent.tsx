import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Input from '@/components/ui-custom/Input';
import Select from '@/components/ui-custom/Select';
import Button from '@/components/ui-custom/Button';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { 
  FileText, MapPin, Users, Calendar, Clock, Plus, 
  ArrowLeft, Save, Send, Image as ImageIcon, 
  X, CheckCircle2, ShieldAlert, Zap, Layers, Globe, User,
  Mail, Phone, ExternalLink, CreditCard, Target, Info,
  BookOpen, ShieldCheck, FileCheck
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function CreateEvent() {
  const { eventId } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const { events, venues, categories, addEvent, updateEvent } = useEventContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isEditMode = !!eventId;

  // Advanced Form State - mirroring real-world university submission forms
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    date: '',
    time: '',
    maxCapacity: '',
    venueId: '',
    bannerImage: null as string | null,
    // Real-Life Professional Fields
    price: '0',
    targetAudience: 'Students',
    contactEmail: user?.email || '',
    contactPhone: '',
    websiteUrl: '',
    certificateEnabled: false,
    termsAgreed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill logic for Edit Mode
  useEffect(() => {
    if (isEditMode && events.length > 0) {
      const existing = events.find(e => e.id === eventId);
      if (existing) {
        setFormData({
          title: existing.title,
          description: existing.description,
          categoryId: existing.categoryId,
          date: existing.date,
          time: existing.time,
          maxCapacity: existing.maxCapacity.toString(),
          venueId: existing.venueId,
          bannerImage: existing.bannerImage || null,
          price: (existing as any).price?.toString() || '0',
          targetAudience: (existing as any).targetAudience || 'Students',
          contactEmail: (existing as any).contactEmail || user?.email || '',
          contactPhone: (existing as any).contactPhone || '',
          websiteUrl: (existing as any).websiteUrl || '',
          certificateEnabled: (existing as any).certificateEnabled || false,
          termsAgreed: true // Assume true if already created
        });
      }
    }
  }, [isEditMode, eventId, events, user]);

  // Handle passed state (e.g. from VenuesView or Duplicate)
  useEffect(() => {
    if (!isEditMode && state?.venueId) {
      setFormData(prev => ({ ...prev, venueId: state.venueId.toString() }));
      const venue = venues.find(v => v.id.toString() === state.venueId.toString());
      if (venue) {
        setFormData(prev => ({ ...prev, maxCapacity: venue.capacity.toString() }));
      }
    }
    // Handle duplicate event
    if (!isEditMode && state?.duplicate) {
      const dup = state.duplicate;
      setFormData(prev => ({
        ...prev,
        title: dup.title + ' (Copy)',
        description: dup.description || '',
        categoryId: dup.categoryId?.toString() || prev.categoryId,
        time: dup.time || '',
        maxCapacity: dup.maxCapacity?.toString() || '',
        venueId: dup.venueId?.toString() || prev.venueId,
        bannerImage: dup.bannerImage || null,
        price: (dup as any).price?.toString() || '0',
        targetAudience: (dup as any).targetAudience || 'Students',
        contactEmail: (dup as any).contactEmail || user?.email || '',
        contactPhone: (dup as any).contactPhone || '',
        websiteUrl: (dup as any).websiteUrl || '',
        termsAgreed: false
      }));
    }
  }, [state, isEditMode, venues]);

  useEffect(() => {
    if (!isEditMode) {
      if (categories.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: categories[0].id.toString() }));
      }
      if (venues.length > 0 && !formData.venueId && !state?.venueId) {
        setFormData(prev => ({ ...prev, venueId: venues[0].id.toString() }));
      }
    }
  }, [categories, venues, isEditMode, state]);

  if (!user) return null;

  const currentVenue = venues.find(v => v.id.toString() === formData.venueId);

  // Date conflict detection
  const dateConflict = useMemo(() => {
    if (!formData.date || !formData.venueId) return null;
    const conflicting = events.find(e => {
      if (isEditMode && e.id === eventId) return false;
      return e.venueId.toString() === formData.venueId && e.date.split('T')[0] === formData.date && e.status !== 'rejected';
    });
    return conflicting || null;
  }, [formData.date, formData.venueId, events, isEditMode, eventId]);

  const descCharCount = formData.description.length;
  const descMaxChars = 2000;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Official Designation is mandatory';
    if (!formData.description.trim()) errs.description = 'Manuscript/Abstract is mandatory';
    if (!formData.date) errs.date = 'Registry date is mandatory';
    if (!formData.time) errs.time = 'Launch time is mandatory';
    if (!formData.contactEmail.trim()) errs.contactEmail = 'Official contact email is mandatory';
    if (!formData.termsAgreed) errs.terms = 'Certification of institutional standards is mandatory';
    
    if (currentVenue && parseInt(formData.maxCapacity) > currentVenue.capacity) {
      errs.maxCapacity = `Exceeds Facility threshold of ${currentVenue.capacity}`;
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (status: 'draft' | 'pending') => {
    if (!validate()) {
      showToast('danger', 'Exhibition standards not met. Please verify all highlighted fields.');
      return;
    }
    
    setIsSubmitting(true);
    showToast('info', isEditMode ? 'Updating institutional record...' : 'Synchronizing with institutional records...');
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        date: formData.date,
        time: formData.time,
        venueId: parseInt(formData.venueId),
        maxCapacity: parseInt(formData.maxCapacity) || 0,
        price: parseFloat(formData.price) || 0,
        bannerImage: formData.bannerImage || undefined,
        status: status,
        // High-fidelity fields (these will be stored in JSON/Metadata or extended columns)
        targetAudience: formData.targetAudience,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        websiteUrl: formData.websiteUrl,
        certificateEnabled: formData.certificateEnabled,
      };

      if (isEditMode && eventId) {
        await updateEvent(eventId, payload as any);
        showToast('success', 'Exhibition record successfully modified and synchronized.');
      } else {
        await addEvent({
          ...payload,
          organizerId: user.id,
        } as any);
        showToast('success', status === 'draft' ? 'Archive updated with internal draft' : 'Entry submitted for moderator approval queue');
      }
      
      navigate('/organizer/events');
    } catch (err) {
      showToast('danger', 'Registry connection interrupted. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '0 40px 80px 40px' }}>
      {/* Institutional Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, marginTop: 40 }}>
        <div>
          <button 
            onClick={() => navigate('/organizer/events')} 
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 12, padding: 0 }}
          >
            <ArrowLeft size={16} /> Back to Repository
          </button>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
            {isEditMode ? 'Manage' : 'New'} <span style={{ color: '#2563eb' }}>Exhibition {isEditMode ? 'Assets' : 'Submission'}</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', marginTop: 8, fontWeight: 500 }}>
            {isEditMode ? 'Synchronize existing records with institutional updates.' : 'Establish a formal engagement record for the academic ecosystem.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSubmitting}>
            <Save size={18} /> {isEditMode ? 'Save Changes' : 'Archive Draft'}
          </Button>
          <Button onClick={() => handleSave('pending')} disabled={isSubmitting} variant="primary" style={{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
            <Send size={18} /> {isEditMode ? 'Update & Submit' : 'Submit for Moderation'}
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Section: Core Identity */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', borderRadius: 32, padding: 40, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={22} color="#2563eb" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Exhibition Specifications</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Manuscript and demographic parameters.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Input 
                label="Official Designation" 
                placeholder="The formal title of this exhibition..." 
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                error={errors.title}
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Abstract Manuscript</label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: descCharCount > descMaxChars ? '#dc2626' : '#94a3b8' }}>{descCharCount} / {descMaxChars}</span>
                </div>
                <textarea 
                  style={{ width: '100%', height: 160, borderRadius: 16, border: `1px solid ${errors.description ? '#ef4444' : '#e2e8f0'}`, padding: 20, fontSize: 14, fontWeight: 500, outline: 'none', backgroundColor: '#f8fafc', transition: 'all 0.2s', resize: 'none' }}
                  placeholder="Detail the objectives and pedagogical impact..."
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={descMaxChars}
                />
                <div style={{ height: 3, backgroundColor: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (descCharCount / descMaxChars) * 100)}%`, height: '100%', backgroundColor: descCharCount > descMaxChars * 0.9 ? '#f59e0b' : '#2563eb', transition: 'width 0.3s' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <Select label="Domain" options={categories.map(c => ({ value: c.id.toString(), label: c.name }))} value={formData.categoryId} onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))} />
                <Select label="Target Demographic" options={[{ value: 'Students', label: 'Students Only' }, { value: 'Faculty', label: 'Faculty & Staff' }, { value: 'General Public', label: 'General Public' }, { value: 'External Partners', label: 'Institutional Partners' }]} value={formData.targetAudience} onChange={e => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))} />
              </div>
            </div>
          </motion.div>

          {/* Section: Spatial & Temporal Logistics */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ backgroundColor: 'white', borderRadius: 32, padding: 40, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={22} color="#16a34a" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Spatial Logistics</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Venue verification and scheduling.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <Input label="Registry Date" type="date" value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} error={errors.date} />
              <Input label="Launch Ceremony" type="time" value={formData.time} onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))} error={errors.time} />
              <div style={{ gridColumn: 'span 2' }}>
                <Select label="Institutional Venue" options={venues.map(v => ({ value: v.id.toString(), label: `${v.name} (Max Threshold: ${v.capacity})` }))} value={formData.venueId} onChange={e => setFormData(prev => ({ ...prev, venueId: e.target.value }))} />
              </div>
              <Input label="Audience Partition (Max)" type="number" placeholder={currentVenue ? `Facility Limit: ${currentVenue.capacity}` : "Density threshold"} value={formData.maxCapacity} onChange={e => setFormData(prev => ({ ...prev, maxCapacity: e.target.value }))} error={errors.maxCapacity} />
              <Input label="Admission Fee ($)" type="number" step="0.01" icon={<CreditCard size={14}/>} value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} />
            </div>

            {/* Date Conflict Warning */}
            {dateConflict && (
              <div style={{ display: 'flex', gap: 12, padding: 16, backgroundColor: '#fffbeb', borderRadius: 16, border: '1px solid #fef3c7', marginTop: 20 }}>
                <ShieldAlert size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Scheduling Conflict Detected</div>
                  <p style={{ fontSize: 12, color: '#b45309', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                    The event <strong>"{dateConflict.title}"</strong> is already scheduled at this venue on {formatDate(dateConflict.date)}. You may still proceed, but consider selecting a different date or venue.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Section: Communications */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ backgroundColor: 'white', borderRadius: 32, padding: 40, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={22} color="#f97316" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Communications Suite</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Official contact and digital presence.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <Input label="Registry Contact Email" type="email" icon={<Mail size={14}/>} value={formData.contactEmail} onChange={e => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))} error={errors.contactEmail} />
              <Input label="Emergency Contact Phone" type="tel" icon={<Phone size={14}/>} value={formData.contactPhone} onChange={e => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))} />
              <div style={{ gridColumn: 'span 2' }}>
                <Input label="Exhibition Micro-site URL" placeholder="https://exhibition.university.edu/..." icon={<Globe size={14}/>} value={formData.websiteUrl} onChange={e => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))} />
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'sticky', top: 120 }}>
          {/* Visual Asset Card */}
          <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9' }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: 20 }}>Visual Asset</h4>
            {!formData.bannerImage ? (
              <label style={{ height: 160, borderRadius: 24, border: '2px dashed #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFormData(prev => ({ ...prev, bannerImage: reader.result as string }));
                    reader.readAsDataURL(file);
                  }
                }} style={{ display: 'none' }} />
                <ImageIcon size={24} color="#94a3b8" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginTop: 8 }}>Add Banner Asset</span>
              </label>
            ) : (
              <div style={{ position: 'relative', height: 160, borderRadius: 24, overflow: 'hidden' }}>
                <img src={formData.bannerImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => setFormData(prev => ({ ...prev, bannerImage: null }))} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer' }}><X size={14}/></button>
              </div>
            )}
          </div>

          {/* Institutional Governance Card */}
          <div style={{ backgroundColor: '#0f172a', borderRadius: 32, padding: 32, color: 'white' }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={18} color="#22c55e" /> Governance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Admin-Only Visibility', icon: Zap, color: '#fbbf24' },
                { label: 'Audience Safety Protocols', icon: Target, color: '#f87171' },
                { label: 'Verified Scheduling', icon: FileCheck, color: '#60a5fa' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                  <item.icon size={14} color={item.color} /> {item.label}
                </div>
              ))}
            </div>
            <label style={{ display: 'flex', gap: 12, cursor: 'pointer', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, border: errors.terms ? '1px solid #ef4444' : '1px solid transparent', transition: 'all 0.2s' }}>
              <input type="checkbox" checked={formData.termsAgreed} onChange={e => setFormData(prev => ({ ...prev, termsAgreed: e.target.checked }))} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500, lineHeight: 1.4 }}>I certify that this exhibition adheres to all institutional governance, audience safety, and pedagogical standards.</span>
            </label>
            {errors.terms && <p style={{ fontSize: 10, color: '#ef4444', marginTop: 8, fontWeight: 700 }}>* Certification is required for submission.</p>}
          </div>

          {/* Certificate Toggle Card */}
          <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: formData.certificateEnabled ? '#eff6ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  <BookOpen size={22} color={formData.certificateEnabled ? '#2563eb' : '#94a3b8'} />
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Certificate</h4>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 600 }}>Student participation proof</p>
                </div>
              </div>
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, certificateEnabled: !prev.certificateEnabled }))}
                style={{
                  width: 52, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                  backgroundColor: formData.certificateEnabled ? '#2563eb' : '#e2e8f0',
                  position: 'relative', transition: 'background-color 0.3s', flexShrink: 0
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 11, backgroundColor: 'white',
                  position: 'absolute', top: 3,
                  left: formData.certificateEnabled ? 27 : 3,
                  transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }} />
              </button>
            </div>
            <div style={{
              padding: 16, borderRadius: 16,
              backgroundColor: formData.certificateEnabled ? '#f0fdf4' : '#f8fafc',
              border: `1px solid ${formData.certificateEnabled ? '#bbf7d0' : '#f1f5f9'}`,
              transition: 'all 0.3s'
            }}>
              <p style={{
                fontSize: 12, margin: 0, lineHeight: 1.5, fontWeight: 600,
                color: formData.certificateEnabled ? '#166534' : '#94a3b8'
              }}>
                {formData.certificateEnabled
                  ? '✓ Students can generate participation certificates after registering. Their name, contact & email will be collected.'
                  : 'Toggle ON to allow students to generate participation certificates for this event.'}
              </p>
            </div>
          </div>

          {/* Institutional Note */}
          <div style={{ display: 'flex', gap: 12, padding: '0 8px' }}>
            <Info size={14} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Submitted exhibitions are hidden from the student repository until formally vetted and approved by Administrative Moderation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

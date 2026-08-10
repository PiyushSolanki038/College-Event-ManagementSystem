import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import {
  sendWelcomeEmail, sendRegistrationEmail, sendTicketEmail,
  sendCertificateEmail, sendEventCancelledEmail,
  sendEventSubmittedEmail, sendEventApprovedEmail, sendEventRejectedEmail,
  sendNewRegistrationToOrganizer, sendCertificateToOrganizer,
  sendNewEventToAdmin, sendNewUserToAdmin,
  sendPasswordResetEmail, sendSignupOtpEmail,
  sendContactConfirmationEmail, sendContactInquiryToAdmin,
  sendCustomDirectEmail, sendBroadcastEmail
} from './mailer';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set. Refusing to start with an insecure default.');
  process.exit(1);
}

app.use(helmet());

const allowedOrigins = [process.env.FRONTEND_URL, 'https://college-event-management-system-pul.vercel.app', 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Rate Limiters (brute-force / abuse protection) ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' }
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many verification requests. Please try again later.' }
});

// --- Authentication Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Auth token missing' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- Health Check / Root ---
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'College Event Management API is running', timestamp: new Date().toISOString() });
});

// --- Connectivity Diagnostics ---
app.get('/api/ping', (req, res) => {
  console.log('📡 Institutional API: Ping Received');
  res.json({ message: 'Institutional API Connectivity Confirmed', timestamp: new Date().toISOString() });
});

// --- Communication Suite (Elevated for Priority) ---

// Send direct email to any user (Admin/Organizer only)
app.post('/api/communicate/direct', authenticateToken, async (req, res) => {
  console.log('✉️ [API] Direct Message Request Received');
  const { targetUserId, subject, message } = req.body;
  const senderProfileId = (req as any).user.id; // From JWT

  if (!targetUserId || !subject || !message) {
    return res.status(400).json({ message: 'Missing required communication parameters' });
  }

  try {
    const sender = await prisma.profile.findUnique({ where: { id: senderProfileId } });
    if (!sender || (sender.role !== 'admin' && sender.role !== 'organizer')) {
      console.warn('🚫 [API] Unauthorized direct mail attempt by Profile ID:', senderProfileId);
      return res.status(403).json({ message: 'Unauthorized communication privilege' });
    }

    const target = await prisma.profile.findUnique({ 
      where: { id: parseInt(targetUserId) },
      include: { user: true }
    });

    if (!target || !target.user) return res.status(404).json({ message: 'Recipient not found in master registry' });

    console.log(`📧 [API] Dispatching mail to: ${target.user.email}`);
    await sendCustomDirectEmail(target.user.email, {
      recipientName: target.name || 'Student',
      subject,
      message,
      senderRole: sender.role.toUpperCase()
    });

    res.json({ message: `Message successfully dispatched to ${target.name || target.email}` });
  } catch (error: any) {
    console.error('❌ [API] Direct mail error:', error.message);
    res.status(500).json({ message: 'Failed to dispatch institutional message' });
  }
});

// Broadcast announcement to all registrants of an event
app.post('/api/communicate/broadcast', authenticateToken, async (req, res) => {
  console.log('📢 [API] Broadcast Request Received');
  const { eventId, subject, message } = req.body;
  const senderProfileId = (req as any).user.id;

  if (!eventId || !subject || !message) {
    return res.status(400).json({ message: 'Missing broadcast parameters' });
  }

  const parsedEventId = parseInt(eventId);
  if (isNaN(parsedEventId)) {
    return res.status(400).json({ message: 'Invalid Event ID provided' });
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: parsedEventId } });
    if (!event) return res.status(404).json({ message: 'Exhibition record not found' });

    const sender = await prisma.profile.findUnique({ where: { id: senderProfileId } });
    if (!sender || (sender.role !== 'admin' && (sender.role === 'organizer' && event.organizerId !== senderProfileId))) {
      console.warn('🚫 [API] Unauthorized broadcast attempt by Profile ID:', senderProfileId);
      return res.status(403).json({ message: 'Unauthorized broadcast privilege' });
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId: parsedEventId },
      include: { 
        user: { 
          include: { 
            user: true 
          } 
        } 
      }
    });

    if (registrations.length === 0) {
      return res.status(400).json({ message: 'No registered principals found for this exhibition' });
    }

    console.log(`🛰️ [API] Executing broadcast to ${registrations.length} recipients...`);
    let successCount = 0;
    // Send emails
    for (const reg of registrations) {
      const recipientEmail = reg.user?.user?.email;
      const recipientName = reg.user?.name || 'Student';
      
      if (recipientEmail) {
        try {
          await sendBroadcastEmail(recipientEmail, {
            recipientName,
            eventTitle: event.title,
            subject,
            message
          });
          successCount++;
        } catch (mailErr) {
          console.error(`⚠️ [API] Failed to send broadcast to ${recipientEmail}:`, mailErr);
        }
      }
    }

    res.json({ message: `Broadcast successfully dispatched to ${successCount} recipients` });
  } catch (error: any) {
    console.error('❌ [API] Broadcast error:', error.message);
    res.status(500).json({ message: `Failed to execute institutional broadcast: ${error.message}` });
  }
});

// --- Auth Endpoints ---
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { email, name, role, password } = req.body;

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  // Only students may self-register; organizer/admin accounts must be provisioned by an admin.
  if (role && role !== 'student') {
    return res.status(403).json({ message: 'Only student accounts can be self-registered' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            name,
            role: 'student',
            status: 'active'
          }
        }
      },
      include: { profile: true }
    });

    const token = jwt.sign({
      id: user.profile?.id,
      email: user.email,
      role: user.profile?.role
    }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: {
        id: user.profile?.id,
        name: user.profile?.name,
        email: user.email,
        role: user.profile?.role,
        status: user.profile?.status,
        emailVerified: user.profile?.emailVerified || false
      }
    });

    // EMAIL #5: Welcome Email to new user
    sendWelcomeEmail(user.email, { name: user.profile?.name || name, role: user.profile?.role || role });

    // EMAIL #12: Notify admin about new user
    const admins = await prisma.profile.findMany({ where: { role: 'admin' }, include: { user: true } });
    for (const admin of admins) {
      sendNewUserToAdmin(admin.user.email, { userName: name, userEmail: email, userRole: role });
    }

  } catch (error) {
    console.error('Registration failed:', error);
    res.status(400).json({ message: 'Registration failed. Email might already be registered.' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, role: requestedRole, password } = req.body;

  if (!email || !password || !requestedRole) {
    return res.status(400).json({ message: 'Email, password and role are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 1. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Strict Role Validation
    if (user.profile?.role !== requestedRole) {
      return res.status(401).json({
        message: `Access denied. Your account is registered as ${user.profile?.role.toUpperCase()}, but you selected ${requestedRole.toUpperCase()}.`
      });
    }

    const token = jwt.sign({
      id: user.profile?.id, 
      email: user.email, 
      role: user.profile?.role 
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token, 
      user: {
        id: user.profile?.id,
        name: user.profile?.name,
        email: user.email,
        role: user.profile?.role,
        status: user.profile?.status,
        emailVerified: user.profile?.emailVerified || false,
        enrollmentNo: user.profile?.enrollmentNo,
        department: user.profile?.department
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Update profile
app.patch('/api/auth/profile', authenticateToken, async (req: any, res) => {
  try {
    const { name, enrollmentNo, department } = req.body;
    const profileId = Number(req.user?.id);

    console.log('🔄 Profile Update Request:', { profileId, name, enrollmentNo, department });

    if (!profileId) {
      return res.status(400).json({ message: 'Identity context missing' });
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        name,
        enrollmentNo,
        department
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    console.log('✅ Profile Updated Successfully');

    res.json({
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.user.email,
      role: updatedProfile.role,
      status: updatedProfile.status,
      emailVerified: (updatedProfile as any).emailVerified || false,
      enrollmentNo: updatedProfile.enrollmentNo,
      department: updatedProfile.department
    });
  } catch (error: any) {
    console.error('❌ Update profile error:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// --- Forgot Password ---
app.post('/api/auth/forgot-password', otpLimiter, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      // Don't reveal that the email doesn't exist (security)
      return res.json({ message: 'If this email is registered, a reset link has been sent.' });
    }

    // Generate a random temporary password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let tempPassword = '';
    for (let i = 0; i < 10; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    // Send email with temp password
    await sendPasswordResetEmail(email, {
      name: user.profile?.name || email.split('@')[0],
      tempPassword
    });

    console.log(`🔐 Password reset for ${email}`);
    res.json({ message: 'If this email is registered, a reset link has been sent.' });
  } catch (error: any) {
    console.error('❌ Forgot password error:', error.message);
    res.status(500).json({ message: 'Failed to process request' });
  }
});

// --- Public Contact Form ---
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 1. Send confirmation to user
    await sendContactConfirmationEmail(email, { name, subject });

    // 2. Notify all admins or the default admin email
    const admins = await prisma.profile.findMany({ where: { role: 'admin' }, include: { user: true } });
    const adminEmails = admins.length > 0 ? admins.map(a => a.user.email) : [process.env.SMTP_EMAIL || ''];
    
    for (const adminEmail of adminEmails) {
      if (adminEmail) {
        await sendContactInquiryToAdmin(adminEmail, { name, email, subject, message });
      }
    }

    res.json({ message: 'Your message has been received. We will get back to you soon.' });
  } catch (error: any) {
    console.error('❌ Contact form error:', error.message);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

// --- Email Verification (Post-Registration OTP) ---
const verifyOtpStore = new Map<string, { otp: string; expires: number }>();

app.post('/api/auth/send-verification', authenticateToken, otpLimiter, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true }
    });
    // Find the User by profile id
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
      include: { user: true }
    });
    if (!profile) return res.status(404).json({ message: 'User not found' });
    if (profile.emailVerified) return res.json({ message: 'Email is already verified.' });

    const email = profile.user.email;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    verifyOtpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000
    });

    await sendSignupOtpEmail(email, { name: profile.name, otp });

    console.log(`📧 Verification OTP sent to ${email}`);
    res.json({ message: 'Verification code sent to your email.' });
  } catch (error: any) {
    console.error('❌ Send verification error:', error.message);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
});

app.post('/api/auth/verify-email', authenticateToken, async (req: any, res) => {
  const { otp } = req.body;
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
      include: { user: true }
    });
    if (!profile) return res.status(404).json({ message: 'User not found' });

    const email = profile.user.email;
    const stored = verifyOtpStore.get(email);

    if (!stored) return res.status(400).json({ message: 'No verification code found. Please request a new one.' });
    if (Date.now() > stored.expires) {
      verifyOtpStore.delete(email);
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }
    if (stored.otp !== otp) return res.status(400).json({ message: 'Invalid verification code.' });

    // Mark email as verified
    await prisma.profile.update({
      where: { id: req.user.id },
      data: { emailVerified: true }
    });

    verifyOtpStore.delete(email);

    console.log(`✅ Email verified for ${email}`);
    res.json({ message: 'Email verified successfully!', emailVerified: true });
  } catch (error: any) {
    console.error('❌ Verify email error:', error.message);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// --- Venue Endpoints ---
app.get('/api/venues', async (req, res) => {
  const venues = await prisma.venue.findMany();
  res.json(venues);
});

// --- Category Endpoints ---
app.get('/api/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// --- Venue Management ---
app.post('/api/venues', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') return res.status(403).json({ message: 'Unauthorized' });
    const { name, location, capacity, facilities } = req.body;
    try {
        const venue = await prisma.venue.create({
            data: { 
                name, 
                location, 
                capacity: parseInt(capacity), 
                facilities: Array.isArray(facilities) ? facilities.join(',') : facilities 
            }
        });
        res.json(venue);
    } catch (error) {
        res.status(400).json({ message: 'Venue creation failed' });
    }
});

app.patch('/api/venues/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') return res.status(403).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const { name, location, capacity, facilities } = req.body;
    try {
        const venue = await prisma.venue.update({
            where: { id: parseInt(id) },
            data: { 
                name, 
                location, 
                capacity: capacity ? parseInt(capacity) : undefined, 
                facilities: Array.isArray(facilities) ? facilities.join(',') : facilities 
            }
        });
        res.json(venue);
    } catch (error) {
        res.status(400).json({ message: 'Venue update failed' });
    }
});

app.delete('/api/venues/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') return res.status(403).json({ message: 'Unauthorized' });
    const { id } = req.params;
    try {
        await prisma.venue.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Venue deleted' });
    } catch (error: any) {
        if (error.code === 'P2003') {
          return res.status(409).json({ message: 'This venue is still referenced by existing events and cannot be deleted' });
        }
        res.status(400).json({ message: 'Venue deletion failed' });
    }
});

// --- Event Endpoints ---
app.get('/api/events', async (req, res) => {
  const events = await prisma.event.findMany({
    include: {
      venue: true,
      category: true,
      organizer: true
    }
  });
  res.json(events.map(e => ({
      ...e,
      venueId: e.venueId.toString(), 
      categoryId: e.categoryId.toString(),
      organizerId: e.organizerId.toString(),
      registeredCount: e.registeredCount,
      certificateEnabled: e.certificateEnabled || false
  })));
});

app.post('/api/events', authenticateToken, async (req: any, res) => {
  const eventData = req.body;
  
  // Basic Validation
  if (!eventData.title || !eventData.date || !eventData.venueId || !eventData.categoryId) {
    return res.status(400).json({ message: 'Missing required fields: title, date, venueId, and categoryId are mandatory.' });
  }

  const venueId = parseInt(eventData.venueId);
  const categoryId = parseInt(eventData.categoryId);

  if (isNaN(venueId) || isNaN(categoryId)) {
    return res.status(400).json({ message: 'Invalid venueId or categoryId. They must be numeric.' });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description || '',
        date: new Date(eventData.date),
        time: eventData.time || '00:00',
        venueId,
        categoryId,
        organizerId: req.user.id,
        maxCapacity: parseInt(eventData.maxCapacity) || 0,
        status: eventData.status || 'pending',
        bannerImage: eventData.bannerImage,
        certificateEnabled: eventData.certificateEnabled === true || eventData.certificateEnabled === 'true'
      }
    });
    res.status(201).json(event);

    // EMAIL #6: Event Submitted - notify organizer
    if (event.status === 'pending') {
      const organizer = await prisma.profile.findUnique({ where: { id: req.user.id }, include: { user: true } });
      const venue = await prisma.venue.findUnique({ where: { id: venueId } });
      if (organizer) {
        sendEventSubmittedEmail(organizer.user.email, {
          organizerName: organizer.name, eventTitle: event.title,
          date: new Date(event.date).toDateString(), venue: venue?.name || 'TBD'
        });
      }
      // EMAIL #11: Notify admin about new pending event
      const admins = await prisma.profile.findMany({ where: { role: 'admin' }, include: { user: true } });
      for (const admin of admins) {
        sendNewEventToAdmin(admin.user.email, {
          eventTitle: event.title, organizerName: organizer?.name || 'Unknown',
          organizerEmail: organizer?.user.email || '', date: new Date(event.date).toDateString(),
          venue: venue?.name || 'TBD'
        });
      }
    }

  } catch (error) {
    console.error('--- Event Creation Failure ---');
    console.error(error);
    console.error('----------------------------');
    res.status(400).json({ message: 'Event creation failed', details: error instanceof Error ? error.message : String(error) });
  }
});

app.patch('/api/events/:id', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const eventId = parseInt(id);
  if (isNaN(eventId)) return res.status(400).json({ message: 'Invalid event id' });

  try {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) return res.status(404).json({ message: 'Event not found' });

    const requester = await prisma.profile.findUnique({ where: { id: req.user.id } });
    if (!requester) return res.status(403).json({ message: 'Unauthorized' });

    const isAdmin = requester.role === 'admin';
    const isOwner = requester.role === 'organizer' && existing.organizerId === requester.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You do not have permission to modify this event' });
    }

    // Whitelist editable fields. Only admins may change status/organizer/rejectionReason.
    const editableByOwner = ['title', 'description', 'date', 'time', 'venueId', 'categoryId', 'maxCapacity', 'price', 'targetAudience', 'contactEmail', 'contactPhone', 'websiteUrl', 'bannerImage', 'certificateEnabled'];
    const editableByAdminOnly = ['status', 'organizerId', 'rejectionReason'];
    const allowedFields = isAdmin ? [...editableByOwner, ...editableByAdminOnly] : editableByOwner;

    const data: any = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }

    if (data.date) data.date = new Date(data.date);
    if (data.venueId) data.venueId = parseInt(data.venueId);
    if (data.categoryId) data.categoryId = parseInt(data.categoryId);
    if (data.maxCapacity) data.maxCapacity = parseInt(data.maxCapacity);
    if (data.price) data.price = parseFloat(data.price);
    if (data.organizerId) data.organizerId = parseInt(data.organizerId);
    if (data.certificateEnabled !== undefined) data.certificateEnabled = data.certificateEnabled === true || data.certificateEnabled === 'true';

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data,
      include: { organizer: { include: { user: true } }, venue: true }
    });
    res.json(event);

    // EMAIL #7 & #8: Event Approved / Rejected - notify organizer
    if (data.status === 'approved' && event.organizer) {
      sendEventApprovedEmail(event.organizer.user.email, {
        organizerName: event.organizer.name, eventTitle: event.title,
        date: new Date(event.date).toDateString()
      });
    }
    if (data.status === 'rejected' && event.organizer) {
      sendEventRejectedEmail(event.organizer.user.email, {
        organizerName: event.organizer.name, eventTitle: event.title,
        reason: data.rejectionReason || undefined
      });
      // EMAIL #4: Notify registered students that event was rejected
      const regs = await prisma.registration.findMany({
        where: { eventId: parseInt(id) },
        include: { user: { include: { user: true } } }
      });
      for (const reg of regs) {
        sendEventCancelledEmail(reg.attendeeEmail || reg.user.user.email, {
          studentName: reg.attendeeName || reg.user.name,
          eventTitle: event.title,
          reason: data.rejectionReason || 'Event did not meet institutional standards.'
        });
      }
    }

  } catch (error) {
    console.error('❌ Event Update Failed:', error);
    res.status(400).json({ message: 'Exhibition update failed due to registry mismatch.' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const eventId = parseInt(id);
  if (isNaN(eventId)) return res.status(400).json({ message: 'Invalid event id' });

  try {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) return res.status(404).json({ message: 'Event not found' });

    const requester = await prisma.profile.findUnique({ where: { id: req.user.id } });
    const isAdmin = requester?.role === 'admin';
    const isOwner = requester?.role === 'organizer' && existing.organizerId === requester.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You do not have permission to delete this event' });
    }

    await prisma.event.delete({ where: { id: eventId } });
    res.json({ message: 'Event purged' });
  } catch (error) {
    res.status(400).json({ message: 'Delete failed' });
  }
});

// --- Registration Endpoints ---
app.get('/api/registrations', authenticateToken, async (req: any, res) => {
  const registrations = await prisma.registration.findMany({
    where: { userId: req.user.id }
  });
  res.json(registrations);
});

app.post('/api/registrations', authenticateToken, async (req: any, res) => {
  const { eventId, attendeeName, attendeeGender, attendeeContact, attendeeEmail } = req.body;
  const userId = req.user.id;
  const parsedEventId = parseInt(eventId);
  if (isNaN(parsedEventId)) return res.status(400).json({ message: 'Invalid event id' });

  try {
    const registration = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: parsedEventId } });
      if (!event) throw new Error('EVENT_NOT_FOUND');
      if (event.status !== 'approved') throw new Error('EVENT_NOT_OPEN');
      if (event.maxCapacity > 0 && event.registeredCount >= event.maxCapacity) {
        throw new Error('EVENT_FULL');
      }

      const reg = await tx.registration.create({
        data: {
          userId,
          eventId: parsedEventId,
          attendeeName: attendeeName || null,
          attendeeGender: attendeeGender || null,
          attendeeContact: attendeeContact || null,
          attendeeEmail: attendeeEmail || null
        }
      });
      await tx.event.update({
        where: { id: parsedEventId },
        data: { registeredCount: { increment: 1 } }
      });
      return reg;
    });
    res.status(201).json(registration);

    // Fetch event + organizer for email context
    const event = await prisma.event.findUnique({
      where: { id: parsedEventId },
      include: { venue: true, organizer: { include: { user: true } } }
    });

    if (event) {
      const studentEmail = attendeeEmail || req.user.email;
      const studentName = attendeeName || req.user.name || 'Student';

      // EMAIL #1: Registration confirmation to student
      sendRegistrationEmail(studentEmail, {
        studentName, eventTitle: event.title,
        date: new Date(event.date).toDateString(), time: event.time,
        venue: event.venue?.name || 'TBD',
        registrationId: `REG-${registration.id.toString().padStart(5, '0')}`
      });

      // EMAIL #9: Notify organizer about new registration
      if (event.organizer) {
        sendNewRegistrationToOrganizer(event.organizer.user.email, {
          organizerName: event.organizer.name, eventTitle: event.title,
          studentName, studentEmail, studentContact: attendeeContact || 'Not provided'
        });
      }
    }

  } catch (error: any) {
    if (error.message === 'EVENT_NOT_FOUND') return res.status(404).json({ message: 'Event not found' });
    if (error.message === 'EVENT_NOT_OPEN') return res.status(400).json({ message: 'This event is not open for registration' });
    if (error.message === 'EVENT_FULL') return res.status(409).json({ message: 'This event has reached maximum capacity' });
    if (error.code === 'P2002') return res.status(409).json({ message: 'You are already registered for this event' });
    console.error('❌ Registration error:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
});

app.delete('/api/registrations/:id', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(id) }
    });

    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    if (registration.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

    await prisma.$transaction(async (tx) => {
      await tx.registration.delete({
        where: { id: parseInt(id) }
      });
      await tx.event.update({
        where: { id: registration.eventId },
        data: { registeredCount: { decrement: 1 } }
      });
    });

    res.json({ message: 'Withdrawal successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- Event Registrations List (Organizer/Admin) ---
app.get('/api/events/:eventId/registrations', authenticateToken, async (req: any, res) => {
  const { eventId } = req.params;
  try {
    const profile = await prisma.profile.findUnique({ where: { id: req.user.id } });
    if (!profile || (profile.role !== 'organizer' && profile.role !== 'admin')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // If organizer, verify they own the event
    if (profile.role === 'organizer') {
      const event = await prisma.event.findUnique({ where: { id: parseInt(eventId) } });
      if (!event || event.organizerId !== profile.id) {
        return res.status(403).json({ message: 'You do not own this event' });
      }
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId: parseInt(eventId) },
      include: {
        user: {
          include: { user: { select: { email: true } } }
        }
      },
      orderBy: { registeredAt: 'asc' }
    });

    const result = registrations.map((reg, index) => ({
      id: reg.id,
      seatNumber: reg.seatNumber || `S-${(index + 1).toString().padStart(3, '0')}`,
      attendeeName: reg.attendeeName || reg.user.name,
      attendeeEmail: reg.attendeeEmail || reg.user.user.email,
      attendeeContact: reg.attendeeContact || 'Not provided',
      attendeeGender: reg.attendeeGender || 'Not specified',
      profileName: reg.user.name,
      enrollmentNo: reg.user.enrollmentNo || '-',
      department: reg.user.department || '-',
      registeredAt: reg.registeredAt,
      attended: reg.attended
    }));

    res.json(result);
  } catch (error) {
    console.error('❌ Fetch registrations error:', error);
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

// --- Update Seat Number (Organizer/Admin) ---
app.patch('/api/registrations/:id/seat', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const { seatNumber } = req.body;
  try {
    const profile = await prisma.profile.findUnique({ where: { id: req.user.id } });
    if (!profile || (profile.role !== 'organizer' && profile.role !== 'admin')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await prisma.registration.update({
      where: { id: parseInt(id) },
      data: { seatNumber }
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Update seat error:', error);
    res.status(500).json({ message: 'Failed to update seat number' });
  }
});

app.get('/api/registrations/:registrationId/ticket', authenticateToken, async (req: any, res) => {
  const { registrationId } = req.params;
  const userId = req.user.id;

  try {
    const registration = await prisma.registration.findFirst({
      where: { 
        id: parseInt(registrationId)
      },
      include: {
        event: {
          include: { venue: true }
        },
        user: {
          include: { user: true }
        }
      }
    });

    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    // Only the registrant, or an organizer/admin, may download this ticket.
    // Note: registration.userId references Profile.id (same space as req.user.id from the JWT).
    if (registration.userId !== userId) {
      const requester = await prisma.profile.findUnique({ where: { id: userId } });
      const isPrivileged = requester && (requester.role === 'admin' || requester.role === 'organizer');
      if (!isPrivileged) {
        return res.status(403).json({ message: 'You do not have permission to access this ticket' });
      }
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filename = `Ticket-${registration.id}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    const regYear = new Date(registration.registeredAt).getFullYear();
    const qrData = `REG-${regYear}-${registration.id.toString().padStart(5, '0')}`;
    const qrImage = await QRCode.toDataURL(qrData);

    // --- PDF Design ---
    // Header
    doc.rect(0, 0, 612, 120).fill('#0f172a');
    doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('INSTITUTIONAL EVENT PASS', 50, 45);
    doc.fontSize(10).font('Helvetica').text('Official Academic Registry • Exhibition Gate Pass', 50, 75);

    // Content Start
    doc.fillColor('black').moveDown(5);
    
    // Grid-like layout
    doc.fontSize(16).font('Helvetica-Bold').text('Event Information', 50, 160);
    doc.rect(50, 180, 500, 1).fill('#e2e8f0');
    
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('Exhibition Title:', 50, 200);
    doc.font('Helvetica').text(registration.event.title, 160, 200);
    
    doc.font('Helvetica-Bold').text('Date & Time:', 50, 220);
    doc.font('Helvetica').text(`${new Date(registration.event.date).toDateString()} at ${registration.event.time}`, 160, 220);
    
    doc.font('Helvetica-Bold').text('Venue:', 50, 240);
    doc.font('Helvetica').text(`${registration.event.venue.name}, ${registration.event.venue.location}`, 160, 240);

    // Attendee Section
    doc.moveDown(3);
    doc.fontSize(16).font('Helvetica-Bold').fillColor('black').text('Attendee Credentials', 50, 290);
    doc.rect(50, 310, 500, 1).fill('#e2e8f0');

    const attendeeName = registration.attendeeName || registration.user.name;
    const attendeeGender = registration.attendeeGender || 'Not Specified';
    const attendeeContact = registration.attendeeContact || 'Not Provided';
    const attendeeEmail = registration.attendeeEmail || (registration.user.user ? registration.user.user.email : 'Not Provided');

    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('Full Name:', 50, 330);
    doc.font('Helvetica').text(attendeeName, 160, 330);

    doc.font('Helvetica-Bold').text('Gender:', 50, 350);
    doc.font('Helvetica').text(attendeeGender, 160, 350);

    doc.font('Helvetica-Bold').text('Contact:', 50, 370);
    doc.font('Helvetica').text(attendeeContact, 160, 370);

    doc.font('Helvetica-Bold').text('Email:', 50, 390);
    doc.font('Helvetica').text(attendeeEmail, 160, 390);

    doc.font('Helvetica-Bold').text('Enrollment:', 50, 410);
    doc.font('Helvetica').text(registration.user.enrollmentNo || 'PENDING_VERIFICATION', 160, 410);

    doc.font('Helvetica-Bold').text('Department:', 50, 430);
    doc.font('Helvetica').text(registration.user.department || 'GENERAL_ACADEMICS', 160, 430);

    // Verification Section
    doc.rect(50, 480, 500, 200).dash(5, { space: 5 }).stroke('#94a3b8');
    
    doc.fontSize(14).font('Helvetica-Bold').text('Security Verification', 230, 500);
    doc.image(qrImage, 225, 530, { width: 150 });
    doc.fontSize(12).text(qrData, 245, 690);

    // Footer
    doc.fontSize(8).fillColor('#64748b').text(`This is a computer-generated ticket. No signature required. Issued on: ${new Date().toLocaleString()}`, 50, 750, { align: 'center' });
    doc.text(`Digital Sign: ${Buffer.from(qrData).toString('base64').substring(0, 32)}`, 50, 765, { align: 'center' });

    doc.pipe(res);
    doc.end();

    // EMAIL #2: Ticket email to student
    const ticketStudentEmail = registration.attendeeEmail || (registration.user.user ? registration.user.user.email : req.user.email);
    const ticketStudentName = registration.attendeeName || registration.user.name;
    sendTicketEmail(ticketStudentEmail, {
      studentName: ticketStudentName, eventTitle: registration.event.title,
      date: new Date(registration.event.date).toDateString(), time: registration.event.time,
      venue: `${registration.event.venue.name}, ${registration.event.venue.location}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ticket generation error' });
  }
});

// --- Certificate Generation Endpoint ---
app.post('/api/certificates/generate', authenticateToken, async (req: any, res) => {
  const { eventId, certificateName, contactNumber, contactEmail } = req.body;
  const userId = req.user.id;

  try {
    // Verify event exists and has certificates enabled
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: { venue: true, organizer: { include: { user: true } } }
    });

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.certificateEnabled) return res.status(403).json({ message: 'Certificates are not enabled for this event' });

    // Verify user is registered for the event
    const registration = await prisma.registration.findFirst({
      where: { userId, eventId: parseInt(eventId) }
    });

    if (!registration) return res.status(403).json({ message: 'You must be registered for this event to generate a certificate' });

    // Generate Certificate PDF
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    const filename = `Certificate-${event.title.replace(/\s+/g, '_')}-${certificateName.replace(/\s+/g, '_')}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    const certId = `CERT-${new Date().getFullYear()}-${registration.id.toString().padStart(5, '0')}`;
    const qrImage = await QRCode.toDataURL(certId);

    // --- Certificate Design ---
    const pageW = 842; // A4 landscape width
    const pageH = 595; // A4 landscape height

    // Outer border
    doc.rect(20, 20, pageW - 40, pageH - 40).lineWidth(3).stroke('#0f172a');
    doc.rect(28, 28, pageW - 56, pageH - 56).lineWidth(1).stroke('#cbd5e1');

    // Top decorative band
    doc.rect(0, 0, pageW, 8).fill('#2563eb');
    doc.rect(0, pageH - 8, pageW, 8).fill('#2563eb');

    // Header
    doc.fontSize(12).font('Helvetica').fillColor('#64748b').text('INSTITUTIONAL ACADEMIC REGISTRY', 0, 60, { align: 'center' });
    doc.fontSize(42).font('Helvetica-Bold').fillColor('#0f172a').text('CERTIFICATE', 0, 85, { align: 'center' });
    doc.fontSize(16).font('Helvetica').fillColor('#2563eb').text('of Participation & Achievement', 0, 135, { align: 'center' });

    // Divider
    doc.rect(pageW / 2 - 100, 170, 200, 2).fill('#e2e8f0');

    // Body
    doc.fontSize(13).font('Helvetica').fillColor('#475569').text('This is to certify that', 0, 200, { align: 'center' });
    
    doc.fontSize(32).font('Helvetica-Bold').fillColor('#0f172a').text(certificateName, 0, 230, { align: 'center' });

    // Underline for name
    const nameWidth = doc.widthOfString(certificateName);
    doc.rect((pageW - nameWidth) / 2, 268, nameWidth, 2).fill('#2563eb');

    doc.fontSize(13).font('Helvetica').fillColor('#475569').text('has successfully participated in the institutional exhibition', 0, 290, { align: 'center' });

    doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e293b').text(`"${event.title}"`, 0, 320, { align: 'center' });

    doc.fontSize(12).font('Helvetica').fillColor('#64748b').text(
      `held on ${new Date(event.date).toDateString()} at ${event.venue.name}, ${event.venue.location}`,
      0, 355, { align: 'center' }
    );

    // QR Code
    doc.image(qrImage, pageW - 160, pageH - 180, { width: 100 });
    doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text(certId, pageW - 170, pageH - 72, { width: 120, align: 'center' });

    // Organizer signature area
    doc.rect(100, pageH - 130, 180, 1).fill('#1e293b');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text(event.organizer.name, 100, pageH - 125, { width: 180, align: 'center' });
    doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Event Organizer', 100, pageH - 110, { width: 180, align: 'center' });

    // Admin signature area
    doc.rect(pageW / 2 - 90, pageH - 130, 180, 1).fill('#1e293b');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Academic Registry', pageW / 2 - 90, pageH - 125, { width: 180, align: 'center' });
    doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Institutional Authority', pageW / 2 - 90, pageH - 110, { width: 180, align: 'center' });

    // Footer
    doc.fontSize(7).fillColor('#94a3b8').text(
      `This is an electronically generated certificate. Verification ID: ${certId} | Issued: ${new Date().toLocaleString()} | Contact: ${contactEmail || 'N/A'} | Phone: ${contactNumber || 'N/A'}`,
      50, pageH - 50, { align: 'center', width: pageW - 100 }
    );

    doc.pipe(res);
    doc.end();

    // EMAIL #3: Certificate email to student
    if (contactEmail) {
      sendCertificateEmail(contactEmail, {
        studentName: certificateName, eventTitle: event.title,
        date: new Date(event.date).toDateString()
      });
    }

    // EMAIL #10: Notify organizer that certificate was generated
    if (event.organizer) {
      sendCertificateToOrganizer(event.organizer.user.email, {
        organizerName: event.organizer.name, eventTitle: event.title,
        studentName: certificateName, studentEmail: contactEmail || 'Not provided',
        studentContact: contactNumber || 'Not provided'
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Certificate generation error' });
  }
});

// --- User Endpoints ---
app.get('/api/users', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  const users = await prisma.profile.findMany();
  res.json(users);
});

app.post('/api/users', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  const { name, email, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const result = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            name,
            role,
            status: 'active'
          }
        }
      },
      include: { profile: true }
    });
    res.status(201).json(result.profile);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Identity already exists in registry' });
    }
    res.status(500).json({ message: error.message || 'Provisioning failed' });
  }
});

app.patch('/api/users/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const { role, status } = req.body;
  try {
    const user = await prisma.profile.update({
      where: { id: parseInt(id) },
      data: { role, status }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'User update failed' });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  const { id } = req.params;
  try {
    await prisma.profile.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User purged' });
  } catch (error) {
    res.status(400).json({ message: 'User purge failed' });
  }
});

// --- Seed Data Helper ---
app.post('/api/admin/seed', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const adminId = req.user.id;
    
    try {
        // 1. Seed Venues
        const venuesData = [
            { name: 'Grand Auditorium', location: 'Block A, 1st Floor', capacity: 500, facilities: 'AC, Projector, Sound System' },
            { name: 'Seminar Hall 1', location: 'Digital Block, 2nd Floor', capacity: 120, facilities: 'AC, Digital Board' },
            { name: 'Open Air Theatre', location: 'Main Grounds', capacity: 1500, facilities: 'Stage, Lighting' },
            { name: 'Conference Room', location: 'Admin Block', capacity: 50, facilities: 'AC, Mic' }
        ];
        for (const v of venuesData) {
            await prisma.venue.upsert({ where: { name: v.name }, update: v, create: v });
        }

        // 2. Seed Categories
        const catsData = [
            { name: 'Technical' }, { name: 'Cultural' }, { name: 'Sports' }, { name: 'Workshop' }, { name: 'Seminar' }
        ];
        for (const c of catsData) {
            await prisma.category.upsert({ where: { name: c.name }, update: c, create: c });
        }

        // 3. Ensure we have diverse roles (Student / Organizer)
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Mock Organizer
        const mockOrg = await prisma.user.upsert({
            where: { email: 'organizer@aura.edu' },
            update: {},
            create: {
                email: 'organizer@aura.edu',
                password: hashedPassword,
                profile: { create: { name: 'Dr. Sarah Smith', role: 'organizer', status: 'active' } }
            },
            include: { profile: true }
        });

        // Mock Student
        const mockStudent = await prisma.user.upsert({
            where: { email: 'student@aura.edu' },
            update: {},
            create: {
                email: 'student@aura.edu',
                password: hashedPassword,
                profile: { create: { name: 'Alex Johnson', role: 'student', status: 'active' } }
            },
            include: { profile: true }
        });

        const venues = await prisma.venue.findMany();
        const cats = await prisma.category.findMany();

        // 4. Seed Events
        const existingEvents = await prisma.event.count();
        if (existingEvents === 0 && venues.length > 0 && cats.length > 0) {
            const sampleEvents = [
                {
                    title: 'Quantum Computing Hackathon',
                    description: 'A 24-hour challenge to solve institutional physics problems using quantum algorithms.',
                    date: new Date('2026-05-15T09:00:00Z'), time: '09:00', maxCapacity: 100, status: 'approved',
                    venueId: venues[0].id, categoryId: cats[0].id, organizerId: mockOrg.profile?.id || adminId
                },
                {
                    title: 'Annual Cultural Mosaic',
                    description: 'An evening of performing arts, music, and institutional heritage celebrations.',
                    date: new Date('2026-06-20T18:00:00Z'), time: '18:00', maxCapacity: 1000, status: 'approved',
                    venueId: venues[2].id, categoryId: cats[1].id, organizerId: mockOrg.profile?.id || adminId
                },
                {
                    title: 'Robotics Workshop 2.0',
                    description: 'Hands-on session for building autonomous institutional delivery drones.',
                    date: new Date('2026-04-25T10:00:00Z'), time: '10:00', maxCapacity: 50, status: 'pending',
                    venueId: venues[1].id, categoryId: cats[3].id, organizerId: mockOrg.profile?.id || adminId
                },
                {
                    title: 'Inter-College Chess Open',
                    description: 'Strategic deployment of intellectual resources in a grand tournament.',
                    date: new Date('2026-05-01T10:00:00Z'), time: '10:00', maxCapacity: 200, status: 'approved',
                    venueId: venues[1].id, categoryId: cats[2].id, organizerId: adminId
                }
            ];

            for (const eventData of sampleEvents) {
                await prisma.event.create({ data: eventData });
            }
        }

        res.json({ message: 'Institutional high-fidelity data residency confirmed.' });
    } catch (error) {
        console.error('Seed Error:', error);
        res.status(500).json({ message: 'Seeding failed' });
    }
});

app.listen(PORT, () => {
  console.log(`Institutional Governance API active on port ${PORT}`);
});

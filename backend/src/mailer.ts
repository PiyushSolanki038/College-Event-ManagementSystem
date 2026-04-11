import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const fromName = process.env.SMTP_FROM_NAME || 'College Event Management';
const fromEmail = process.env.SMTP_EMAIL;

// --- Base HTML Template ---
function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:20px 20px 0 0;padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:white;font-size:22px;font-weight:900;letter-spacing:-0.02em;">${title}</h1>
      <div style="width:60px;height:3px;background:#2563eb;margin:16px auto 0;border-radius:2px;"></div>
    </div>
    <!-- Body -->
    <div style="background:white;padding:40px 32px;border-radius:0 0 20px 20px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
      ${body}
    </div>
    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;">
      <p style="margin:0;font-size:11px;color:#94a3b8;font-weight:600;">College Event Management System</p>
      <p style="margin:4px 0 0;font-size:10px;color:#cbd5e1;">This is an automated message. Please do not reply directly.</p>
    </div>
  </div>
</body>
</html>`;
}

function infoRow(label: string, value: string): string {
  return `<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f1f5f9;">
    <span style="font-size:13px;color:#64748b;font-weight:600;">${label}</span>
    <span style="font-size:13px;color:#0f172a;font-weight:700;">${value}</span>
  </div>`;
}

function badge(text: string, color: string, bg: string): string {
  return `<span style="display:inline-block;padding:6px 16px;border-radius:8px;background:${bg};color:${color};font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;">${text}</span>`;
}

function heading(text: string): string {
  return `<h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 24px;letter-spacing:-0.01em;">${text}</h2>`;
}

function paragraph(text: string): string {
  return `<p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

function actionButton(text: string, url: string): string {
  return `<div style="text-align:center;margin:32px 0 16px;">
    <a href="${url}" style="display:inline-block;padding:14px 40px;background:#2563eb;color:white;text-decoration:none;border-radius:14px;font-size:14px;font-weight:800;letter-spacing:0.03em;box-shadow:0 4px 14px rgba(37,99,235,0.3);">${text}</a>
  </div>`;
}

function divider(): string {
  return `<div style="height:1px;background:#f1f5f9;margin:24px 0;"></div>`;
}

// ==============================
// EMAIL FUNCTIONS
// ==============================

async function sendMail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (error: any) {
    console.error(`❌ Email failed to ${to}:`, error.message);
  }
}

// ============ STUDENT EMAILS ============

// 1. Registration Confirmed
export async function sendRegistrationEmail(to: string, data: {
  studentName: string; eventTitle: string; date: string; time: string;
  venue: string; registrationId: string;
}) {
  const body = `
    ${heading('Registration Confirmed! 🎉')}
    ${paragraph(`Hi <strong>${data.studentName}</strong>, you have successfully registered for the following event.`)}
    <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #f1f5f9;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Date', data.date)}
      ${infoRow('Time', data.time)}
      ${infoRow('Venue', data.venue)}
      ${infoRow('Registration ID', data.registrationId)}
    </div>
    ${paragraph('Please carry a valid ID for entry verification. Your digital ticket is available in the student dashboard.')}
    ${actionButton('View Dashboard', 'http://localhost:5173/student/dashboard')}
  `;
  await sendMail(to, `✓ Registration Confirmed — ${data.eventTitle}`, wrapHtml('Registration Confirmed', body));
}

// 2. Ticket Downloaded
export async function sendTicketEmail(to: string, data: {
  studentName: string; eventTitle: string; date: string; time: string; venue: string;
}) {
  const body = `
    ${heading('Your Ticket is Ready 🎫')}
    ${paragraph(`Hi <strong>${data.studentName}</strong>, your official event ticket has been generated.`)}
    <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #f1f5f9;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Date', data.date)}
      ${infoRow('Time', data.time)}
      ${infoRow('Venue', data.venue)}
    </div>
    ${paragraph('You can download your ticket anytime from the student dashboard. Present the QR code at the event for fast entry.')}
    ${actionButton('Access Ticket', 'http://localhost:5173/student/dashboard')}
  `;
  await sendMail(to, `🎫 Your Ticket — ${data.eventTitle}`, wrapHtml('Ticket Generated', body));
}

// 3. Certificate Generated
export async function sendCertificateEmail(to: string, data: {
  studentName: string; eventTitle: string; date: string;
}) {
  const body = `
    ${heading('Certificate Generated 🏆')}
    ${paragraph(`Hi <strong>${data.studentName}</strong>, your participation certificate for the following event has been generated.`)}
    <div style="background:#f0fdf4;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #bbf7d0;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Date', data.date)}
      ${infoRow('Issued To', data.studentName)}
      ${infoRow('Status', 'Verified ✓')}
    </div>
    ${paragraph('Your certificate has been downloaded. You can regenerate it anytime from the event page.')}
  `;
  await sendMail(to, `🏆 Certificate Generated — ${data.eventTitle}`, wrapHtml('Certificate Issued', body));
}

// 4. Event Cancelled / Rejected (Student notification)
export async function sendEventCancelledEmail(to: string, data: {
  studentName: string; eventTitle: string; reason?: string;
}) {
  const body = `
    ${heading('Event Update ⚠️')}
    ${paragraph(`Hi <strong>${data.studentName}</strong>, we regret to inform you that the following event has been cancelled or is no longer available.`)}
    <div style="background:#fef2f2;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #fecaca;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Status', 'Cancelled')}
      ${data.reason ? infoRow('Reason', data.reason) : ''}
    </div>
    ${paragraph('If you had registered for this event, your registration has been noted. Please check the dashboard for alternative events.')}
    ${actionButton('Browse Events', 'http://localhost:5173/student/discover')}
  `;
  await sendMail(to, `⚠️ Event Update — ${data.eventTitle}`, wrapHtml('Event Update', body));
}

// 5. Welcome Email (Sign Up)
export async function sendWelcomeEmail(to: string, data: {
  name: string; role: string;
}) {
  const roleColor = data.role === 'student' ? '#2563eb' : data.role === 'organizer' ? '#7c3aed' : '#0f172a';
  const body = `
    ${heading('Welcome to the Institution! 👋')}
    ${paragraph(`Hi <strong>${data.name}</strong>, your account has been successfully created.`)}
    <div style="text-align:center;margin:24px 0;">
      ${badge(data.role.toUpperCase(), 'white', roleColor)}
    </div>
    <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #f1f5f9;">
      ${infoRow('Name', data.name)}
      ${infoRow('Email', to)}
      ${infoRow('Role', data.role.charAt(0).toUpperCase() + data.role.slice(1))}
      ${infoRow('Account Status', 'Active ✓')}
    </div>
    ${paragraph('You can now log in and start exploring events, registering for exhibitions, and managing your academic portfolio.')}
    ${actionButton('Get Started', 'http://localhost:5173/login')}
  `;
  await sendMail(to, `🎓 Welcome — ${data.name}`, wrapHtml('Welcome Aboard', body));
}

// ============ ORGANIZER EMAILS ============

// 6. Event Submitted
export async function sendEventSubmittedEmail(to: string, data: {
  organizerName: string; eventTitle: string; date: string; venue: string;
}) {
  const body = `
    ${heading('Event Submitted for Review 📋')}
    ${paragraph(`Hi <strong>${data.organizerName}</strong>, your event has been submitted and is now awaiting admin approval.`)}
    <div style="background:#fffbeb;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #fde68a;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Date', data.date)}
      ${infoRow('Venue', data.venue)}
      ${infoRow('Status', 'Pending Review')}
    </div>
    ${paragraph('You will receive a notification once the admin reviews and approves your event. This usually takes 24-48 hours.')}
    ${actionButton('View My Events', 'http://localhost:5173/organizer/events')}
  `;
  await sendMail(to, `📋 Event Submitted — ${data.eventTitle}`, wrapHtml('Event Submitted', body));
}

// 7. Event Approved
export async function sendEventApprovedEmail(to: string, data: {
  organizerName: string; eventTitle: string; date: string;
}) {
  const body = `
    ${heading('Event Approved! ✅')}
    ${paragraph(`Congratulations <strong>${data.organizerName}</strong>! Your event has been approved by the administration.`)}
    <div style="background:#f0fdf4;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #bbf7d0;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Date', data.date)}
      ${infoRow('Status', 'Approved & Live ✓')}
    </div>
    ${paragraph('Your event is now visible to all students and open for registration. Share the event link to maximize participation.')}
    ${actionButton('View Event', 'http://localhost:5173/organizer/events')}
  `;
  await sendMail(to, `✅ Event Approved — ${data.eventTitle}`, wrapHtml('Event Approved', body));
}

// 8. Event Rejected
export async function sendEventRejectedEmail(to: string, data: {
  organizerName: string; eventTitle: string; reason?: string;
}) {
  const body = `
    ${heading('Event Not Approved ❌')}
    ${paragraph(`Hi <strong>${data.organizerName}</strong>, unfortunately your event was not approved by the administration.`)}
    <div style="background:#fef2f2;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #fecaca;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Status', 'Rejected')}
      ${data.reason ? infoRow('Reason', data.reason) : ''}
    </div>
    ${paragraph('You may edit and resubmit the event after addressing the issues. Contact the administration for further details.')}
    ${actionButton('Edit Event', 'http://localhost:5173/organizer/events')}
  `;
  await sendMail(to, `❌ Event Not Approved — ${data.eventTitle}`, wrapHtml('Event Rejected', body));
}

// 9. New Registration (Organizer notified)
export async function sendNewRegistrationToOrganizer(to: string, data: {
  organizerName: string; eventTitle: string;
  studentName: string; studentEmail: string; studentContact: string;
}) {
  const body = `
    ${heading('New Registration! 🎉')}
    ${paragraph(`Hi <strong>${data.organizerName}</strong>, a new student has registered for your event.`)}
    <div style="background:#eff6ff;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #dbeafe;">
      <h3 style="font-size:14px;font-weight:800;color:#1e40af;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Student Details</h3>
      ${infoRow('Name', data.studentName)}
      ${infoRow('Email', data.studentEmail)}
      ${infoRow('Contact', data.studentContact || 'Not provided')}
    </div>
    <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #f1f5f9;">
      ${infoRow('Event', data.eventTitle)}
    </div>
    ${actionButton('View Registrations', 'http://localhost:5173/organizer/events')}
  `;
  await sendMail(to, `🎉 New Registration — ${data.eventTitle}`, wrapHtml('New Registration', body));
}

// 10. Certificate Generated (Organizer notified)
export async function sendCertificateToOrganizer(to: string, data: {
  organizerName: string; eventTitle: string;
  studentName: string; studentEmail: string; studentContact: string;
}) {
  const body = `
    ${heading('Certificate Generated 📜')}
    ${paragraph(`Hi <strong>${data.organizerName}</strong>, a student has generated a participation certificate for your event.`)}
    <div style="background:#eff6ff;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #dbeafe;">
      <h3 style="font-size:14px;font-weight:800;color:#1e40af;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Certificate Recipient</h3>
      ${infoRow('Name on Certificate', data.studentName)}
      ${infoRow('Email', data.studentEmail)}
      ${infoRow('Contact', data.studentContact || 'Not provided')}
    </div>
    <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #f1f5f9;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Issued At', new Date().toLocaleString())}
    </div>
  `;
  await sendMail(to, `📜 Certificate Generated — ${data.eventTitle}`, wrapHtml('Certificate Issued', body));
}

// ============ ADMIN EMAILS ============

// 11. New Event Pending
export async function sendNewEventToAdmin(to: string, data: {
  eventTitle: string; organizerName: string; organizerEmail: string;
  date: string; venue: string;
}) {
  const body = `
    ${heading('New Event Pending Approval 🔔')}
    ${paragraph('A new event has been submitted and requires your review.')}
    <div style="background:#fffbeb;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #fde68a;">
      ${infoRow('Event Title', data.eventTitle)}
      ${infoRow('Organizer', data.organizerName)}
      ${infoRow('Organizer Email', data.organizerEmail)}
      ${infoRow('Scheduled Date', data.date)}
      ${infoRow('Venue', data.venue)}
    </div>
    ${paragraph('Please review this event and approve or reject it from the admin dashboard.')}
    ${actionButton('Review Now', 'http://localhost:5173/admin/approvals')}
  `;
  await sendMail(to, `🔔 New Event Pending — ${data.eventTitle}`, wrapHtml('Event Review Required', body));
}

// 12. New User Registered
export async function sendNewUserToAdmin(to: string, data: {
  userName: string; userEmail: string; userRole: string;
}) {
  const body = `
    ${heading('New User Registered 👤')}
    ${paragraph('A new user has registered on the platform.')}
    <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #f1f5f9;">
      ${infoRow('Name', data.userName)}
      ${infoRow('Email', data.userEmail)}
      ${infoRow('Role', data.userRole.charAt(0).toUpperCase() + data.userRole.slice(1))}
      ${infoRow('Registered At', new Date().toLocaleString())}
    </div>
    ${actionButton('View Users', 'http://localhost:5173/admin/users')}
  `;
  await sendMail(to, `👤 New User — ${data.userName} (${data.userRole})`, wrapHtml('New User Registration', body));
}

// ============ AUTH EMAILS ============

// 13. Password Reset
export async function sendPasswordResetEmail(to: string, data: {
  name: string; tempPassword: string;
}) {
  const body = `
    ${heading('Password Reset 🔐')}
    ${paragraph(`Hi <strong>${data.name}</strong>, we received a request to reset your password.`)}
    <div style="background:#fffbeb;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #fde68a;">
      <h3 style="font-size:14px;font-weight:800;color:#92400e;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Your Temporary Password</h3>
      <div style="background:white;border-radius:12px;padding:20px;text-align:center;border:2px dashed #f59e0b;">
        <span style="font-size:24px;font-weight:900;color:#0f172a;letter-spacing:0.1em;font-family:monospace;">${data.tempPassword}</span>
      </div>
    </div>
    ${paragraph('Use this temporary password to log in. We strongly recommend changing your password after logging in.')}
    <div style="background:#fef2f2;border-radius:12px;padding:16px;margin:16px 0;border:1px solid #fecaca;">
      <p style="font-size:12px;color:#dc2626;margin:0;font-weight:700;">⚠️ Security Notice: If you did not request this reset, please ignore this email. Your existing password remains unchanged until the temporary password is used.</p>
    </div>
    ${actionButton('Login Now', 'http://localhost:5173/login')}
  `;
  await sendMail(to, `🔐 Password Reset — ${data.name}`, wrapHtml('Password Reset', body));
}

// 14. Sign Up Confirmation / OTP
export async function sendSignupOtpEmail(to: string, data: {
  name: string; otp: string;
}) {
  const body = `
    ${heading('Verify Your Email ✉️')}
    ${paragraph(`Hi <strong>${data.name}</strong>, please verify your email address to complete your registration.`)}
    <div style="background:#eff6ff;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #dbeafe;">
      <h3 style="font-size:14px;font-weight:800;color:#1e40af;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Verification Code</h3>
      <div style="background:white;border-radius:12px;padding:20px;text-align:center;border:2px dashed #3b82f6;">
        <span style="font-size:32px;font-weight:900;color:#0f172a;letter-spacing:0.2em;font-family:monospace;">${data.otp}</span>
      </div>
    </div>
    ${paragraph('Enter this code in the registration form to verify your email. This code expires in 10 minutes.')}
    <div style="background:#f8fafc;border-radius:12px;padding:16px;margin:16px 0;border:1px solid #f1f5f9;">
      <p style="font-size:12px;color:#64748b;margin:0;font-weight:600;">If you did not create an account, please ignore this email.</p>
    </div>
  `;
  await sendMail(to, `✉️ Verify Your Email — ${data.name}`, wrapHtml('Email Verification', body));
}
// 15. Contact Confirmation (To User)
export async function sendContactConfirmationEmail(to: string, data: {
  name: string; subject: string;
}) {
  const body = `
    ${heading('We Received Your Message! 📨')}
    ${paragraph(`Hi <strong>${data.name}</strong>, thank you for reaching out to us.`)}
    ${paragraph(`We have received your inquiry regarding <strong>"${data.subject}"</strong>. Our team will review your message and get back to you as soon as possible.`)}
    <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #f1f5f9;">
      ${infoRow('Subject', data.subject)}
      ${infoRow('Status', 'Received')}
      ${infoRow('Expected Response', 'Within 24 Hours')}
    </div>
    ${paragraph('Thank you for your patience.')}
  `;
  await sendMail(to, `📨 Message Received — ${data.subject}`, wrapHtml('Contact Inquiry Received', body));
}

// 16. Contact Inquiry Notification (To Admin)
export async function sendContactInquiryToAdmin(to: string, data: {
  name: string; email: string; subject: string; message: string;
}) {
  const body = `
    ${heading('New Contact Inquiry 📬')}
    ${paragraph('A new message has been submitted via the public contact form.')}
    <div style="background:#eff6ff;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #dbeafe;">
      <h3 style="font-size:14px;font-weight:800;color:#1e40af;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Sender Details</h3>
      ${infoRow('Name', data.name)}
      ${infoRow('Email', data.email)}
    </div>
    <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:20px 0;border:1px solid #f1f5f9;">
      <h3 style="font-size:14px;font-weight:800;color:#0f172a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em;">Message Content</h3>
      ${infoRow('Subject', data.subject)}
      <div style="padding:16px;background:white;border-radius:12px;border:1px solid #e2e8f0;margin-top:8px;">
        <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
      </div>
    </div>
  `;
  await sendMail(to, `📬 New Inquiry: ${data.subject}`, wrapHtml('New Contact Message', body));
}

// 17. Custom Direct Email (General)
export async function sendCustomDirectEmail(to: string, data: {
  recipientName: string; subject: string; message: string; senderRole: string;
}) {
  const body = `
    ${heading(data.subject)}
    ${paragraph(`Hi <strong>${data.recipientName}</strong>,`)}
    <div style="padding:24px;background:#f8fafc;border-radius:20px;border:1px solid #f1f5f9;margin:24px 0;">
      <p style="margin:0;font-size:15px;color:#0f172a;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
    </div>
    <div style="display:flex;align-items:center;gap:12px;margin-top:24px;padding-top:24px;border-top:1px solid #f1f5f9;">
      <div style="width:10px;height:10px;border-radius:50%;background:#2563eb;"></div>
      <span style="font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Official Communication from ${data.senderRole}</span>
    </div>
    ${paragraph('If you have questions about this message, please contact the administration.')}
  `;
  await sendMail(to, `✉️ ${data.subject}`, wrapHtml('Institutional Message', body));
}

// 18. Broadcast Email (Event Announcement)
export async function sendBroadcastEmail(to: string, data: {
  recipientName: string; eventTitle: string; subject: string; message: string;
}) {
  const body = `
    ${heading(data.subject)}
    ${paragraph(`Hi <strong>${data.recipientName}</strong>, this is an official announcement regarding the exhibition <strong>"${data.eventTitle}"</strong>.`)}
    <div style="padding:24px;background:#eff6ff;border-radius:20px;border:1px solid #dbeafe;margin:24px 0;">
      <p style="margin:0;font-size:15px;color:#1e40af;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
    </div>
    <div style="background:#f8fafc;border-radius:16px;padding:20px;border:1px solid #f1f5f9;">
      ${infoRow('Event', data.eventTitle)}
      ${infoRow('Announcement Type', 'Exhibition Update')}
    </div>
    ${actionButton('View Event Details', 'http://localhost:5173/student/dashboard')}
  `;
  await sendMail(to, `📢 ${data.subject} — ${data.eventTitle}`, wrapHtml('Exhibition Announcement', body));
}

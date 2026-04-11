---
marp: true
theme: default
class: lead
backgroundColor: #f0f4f8
---

# College Event Management System (CEMS)
**Institutional Registry & Event Lifecycle Platform**

---

## 1. The Problem We Solve
Managing college events is often chaotic, relying on scattered emails, manual approvals, and disjointed platforms for students to discover them.

- **For Governance:** Lack of central oversight and moderation.
- **For Organizers:** Cumbersome facility booking and difficulty engaging students.
- **For Students:** Poor discovery and fragmented registration processes.

---

## 2. Our Solution: A Centralized Platform
The CEMS bridges the gap between Administration, Faculty, and Students through a premium, high-fidelity portal.

- **Centralized Registry:** One source of truth for all campus events.
- **Role-based Workflows:** Tailored experiences for Admin, Organizers, and Students.
- **Sleek Aesthetic:** Built with the "Aura" design system (Glassmorphism & fluid animations).

---

## 3. Key User Personas

### 🏛️ Institutional Admin (Governance)
- Approves or rejects event proposals.
- Manages campus venues, user directories, and monitors system-wide analytics.

### ✍️ Event Organizer
- Authors event drafts and reserves campus facilities.
- Submits proposals and tracks real-time student engagement.

### 🎓 Student
- Explores academic, technical, and cultural events via an "Academic Gallery".
- Enjoys one-click, seamless seat reservation.

---

## 4. Technical Architecture
Built for performance, scalability, and robust data residency.

- **Frontend:** React + Vite + Framer Motion (Aura UI / Glassmorphism)
- **Backend:** Node.js + Express + Custom JWT Authentication
- **Database Layer:** Microsoft SQL Server (MSSQL) managed via Prisma ORM

---

## 5. Repository & Documentation
Explore the code, deployment guides, and technical specifications.

- **GitHub Repository:** [College-Event-ManagementSystem](https://github.com/PiyushSolanki038/College-Event-ManagementSystem.git)
- **Documentation:** Built-in PRD and modular component guides.
- **Open Source:** Designed for institutional scalability.

---

## 6. Event Lifecycle
1. **Draft:** Created by the Organizer, preparing details, media, and venues.
2. **Pending:** Submitted to the Institutional Admin for rigorous review.
3. **Approved:** Pushed live to the Student Gallery for active registrations.
4. **Rejected:** Returned with specific feedback for necessary modifications.

---

## 6. Registration System Features
- **Transactional Consistency:** Atomic database operations prevent double-booking.
- **Capacity Limits:** Automatic lockouts when an event's max capacity is reached.
- **Engagement Analytics:** Real-time `registeredCount` metrics for organizers.

---

## 7. Future Roadmap (Phases 2 & 3)
- 📅 **Automated Notifications:** Email integration (SendGrid/SMTP) and in-app alerts for status changes.
- 📜 **Accreditation & Validation:** Auto-generated PDF certificates & QR code check-ins for attendees.
- 📊 **Advanced Analytics:** AI-powered event recommendations & campus venue utilization heatmaps.

---

# Thank You!
**Opening the floor for questions and live demo.**

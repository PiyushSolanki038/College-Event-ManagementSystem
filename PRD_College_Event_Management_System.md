# Product Requirements Document (PRD)
## College Event Management System

---

| Field | Details |
|---|---|
| **Project** | College Event Management System |
| **Version** | 1.0 |
| **Team ID** | T_105 |
| **Author** | Piyush Solanki (92301703038) |
| **Guide** | Prof. Twinkle Bhimani |
| **Department** | Computer Engineering, Faculty of Engineering & Technology |
| **Date** | March 2026 |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Objectives](#3-goals--objectives)
4. [Scope](#4-scope)
5. [User Roles & Personas](#5-user-roles--personas)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [System Architecture](#8-system-architecture)
9. [Technology Stack](#9-technology-stack)
10. [Feature Modules](#10-feature-modules)
11. [UI/UX Requirements](#11-uiux-requirements)
12. [Analytics & Reporting](#12-analytics--reporting)
13. [Challenges & Constraints](#13-challenges--constraints)
14. [Future Scope](#14-future-scope)
15. [Conclusion](#15-conclusion)

---

## 1. Overview

The **College Event Management System** is a web-based platform designed to simplify and digitize the end-to-end process of managing college events. Traditional event management methods — such as notice boards, WhatsApp groups, and email threads — lead to poor communication, scheduling conflicts, and low student engagement.

This system provides a **centralized, role-based platform** for Students, Organizers, and Administrators to discover, create, register for, approve, and analyze college events. It is built with modern frontend technologies following a modular, component-based architecture for scalability and maintainability.

---

## 2. Problem Statement

Current college event management suffers from the following pain points:

- Event information is scattered across notice boards, WhatsApp groups, and emails.
- There is no centralized platform for event discovery or student registration.
- Event approval workflows lack transparency between organizers and administrators.
- Venue scheduling conflicts arise due to the absence of a shared availability calendar.
- There is no mechanism to collect data or analytics on event participation and trends.

---

## 3. Goals & Objectives

1. **Centralize** all event-related activities on a single unified platform.
2. **Automate** the event approval workflow between Organizers and Administrators.
3. **Empower students** to discover, browse, and register for events easily.
4. **Provide role-based dashboards** tailored to each user type (Student, Organizer, Admin).
5. **Manage venues** with real-time availability tracking to eliminate scheduling conflicts.
6. **Generate analytics** on participation rates, event popularity, and engagement trends.
7. **Ensure responsiveness** with a mobile-friendly design accessible on all devices.

---

## 4. Scope

### In Scope
- Role-based authentication (Student, Organizer, Admin)
- Event creation, editing, and publishing by Organizers
- Event discovery, search, and filtering for Students
- One-click student registration with capacity tracking
- Admin approval queue for event review
- Venue management with availability calendar
- User management panel for Admins
- Analytics dashboard with charts and statistics

### Out of Scope (v1.0)
- Payment gateway integration for paid events
- Native mobile applications (iOS/Android)
- Real-time chat/messaging between users
- Third-party calendar sync (Google Calendar, Outlook)
- Email/SMS notification service

---

## 5. User Roles & Personas

### 5.1 Student
- **Goal:** Discover and register for events easily.
- **Needs:** Browse upcoming events, view event details, register with one click, track registered events.

### 5.2 Organizer
- **Goal:** Create and manage college events efficiently.
- **Needs:** Create/edit events, request venue bookings, submit events for admin approval, track registrations.

### 5.3 Administrator
- **Goal:** Oversee all platform activity and maintain control.
- **Needs:** Approve/reject events, manage users and roles, manage venues, view platform-wide analytics.

---

## 6. Functional Requirements

### 6.1 Authentication & Authorization
- Users must be able to register and log in with role-based access (Student / Organizer / Admin).
- Passwords must be securely handled.
- Unauthorized users must be redirected appropriately based on their role.

### 6.2 Event Management (Organizer)
- Organizer can create a new event with: title, description, date/time, venue, category, banner image, and maximum capacity.
- Organizer can edit or delete events that are pending approval.
- Organizer can submit events to the Admin approval queue.
- Organizer can view the registration list for their events.

### 6.3 Event Discovery (Student)
- Students can browse a list of all published events.
- Students can search events by name, category, or date.
- Students can filter events by upcoming/past, category, or venue.
- Students can view full event details including venue info and remaining seats.

### 6.4 Event Registration (Student)
- Students can register for an event with a single click.
- The system must track seat capacity and prevent over-registration.
- Students can view their registered events on their personal dashboard.
- Students can cancel their registration before the event date.

### 6.5 Approval Queue (Admin)
- Admin can view all events pending approval.
- Admin can approve or reject events with an optional reason/comment.
- Approved events become visible to all students.
- Rejected events are returned to the organizer with feedback.

### 6.6 Venue Management (Admin/Organizer)
- Admin can add, edit, or remove venue listings (name, location, capacity, facilities).
- The system must display venue availability to avoid double-booking.
- Organizers can browse available venues while creating an event.

### 6.7 User Management (Admin)
- Admin can view all registered users.
- Admin can change user roles (e.g., promote a student to organizer).
- Admin can deactivate or remove user accounts.

### 6.8 Analytics Dashboard (Admin/Organizer)
- Display total events created, approved, and rejected.
- Display total registrations per event.
- Show participation trends over time using charts.
- Organizer can view analytics specific to their own events.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Pages must load within 2 seconds on a standard connection. |
| **Scalability** | Modular component-based architecture to support feature additions. |
| **Responsiveness** | Fully responsive UI supporting desktop, tablet, and mobile screens. |
| **Usability** | Intuitive UI with minimal learning curve for all user roles. |
| **Code Quality** | ESLint rules enforced; TypeScript strict mode enabled. |
| **Maintainability** | Reusable components; clear folder structure and naming conventions. |
| **Accessibility** | Semantic HTML; keyboard navigable; sufficient color contrast ratios. |
| **Browser Support** | Latest 2 versions of Chrome, Firefox, Safari, and Edge. |

---

## 8. System Architecture

The system follows a **component-based, Single Page Application (SPA)** architecture.

```
┌─────────────────────────────────────────────┐
│                  Browser (SPA)              │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Student  │  │Organizer │  │  Admin   │  │
│  │  Views   │  │  Views   │  │  Views   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       └─────────────┼─────────────┘         │
│              ┌──────▼──────┐                │
│              │  React Router│                │
│              │  (v6 Routes) │                │
│              └──────┬───────┘               │
│         ┌───────────┼───────────┐           │
│    ┌────▼───┐  ┌────▼───┐  ┌───▼────┐      │
│    │  Auth  │  │ Events │  │Venues/ │      │
│    │Context │  │Context │  │Analytics│     │
│    └────────┘  └────────┘  └─────────┘     │
│              ┌──────────────┐               │
│              │  Components  │               │
│              │  (Lucide +   │               │
│              │  Recharts)   │               │
│              └──────────────┘               │
└─────────────────────────────────────────────┘
```

### Workflow

1. User logs in → Role is determined → Redirected to role-specific dashboard.
2. **Organizer** creates event → Submitted to approval queue.
3. **Admin** reviews → Approves or rejects → Notification shown on dashboard.
4. **Student** browses → Finds event → Registers → Capacity counter decrements.
5. **Admin/Organizer** views analytics dashboard for insights.

---

## 9. Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.x | Frontend UI framework |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 3.x | Utility-first CSS styling |
| **React Router** | v6 | Client-side routing & navigation |
| **Recharts** | Latest | Data visualization & charts |
| **Vite** | Latest | Build tool & development server |
| **ESLint** | Latest | Code quality and linting |
| **Lucide React** | Latest | UI icon library |

### Rationale
- **React 18** enables concurrent rendering and efficient component updates for a smooth UX.
- **TypeScript** enforces type safety, reducing runtime errors and improving maintainability.
- **Tailwind CSS** accelerates UI development with utility classes and ensures design consistency.
- **React Router v6** provides declarative, nested routing ideal for a multi-role SPA.
- **Recharts** integrates natively with React for seamless analytics visualizations.
- **Vite** offers fast Hot Module Replacement (HMR) and optimized production builds.

---

## 10. Feature Modules

### Module 1: Authentication
- Role-based login and registration forms.
- Protected routes that redirect unauthorized users.
- Session persistence using local state/context.

### Module 2: Event Management
- Event creation form with all required fields.
- Edit and delete capabilities for pending events.
- Status indicator (Draft / Pending / Approved / Rejected).

### Module 3: Event Discovery
- Event listing page with search bar and filter controls.
- Event detail page showing full information, venue map, and registration CTA.
- Category-based browsing.

### Module 4: Registration System
- One-click register/unregister buttons.
- Real-time seat availability counter.
- Registered events listed under the student's personal dashboard.

### Module 5: Approval Queue
- Admin view of all pending events with event details.
- Approve / Reject action buttons.
- Optional comment field for rejection reason.

### Module 6: Venue Management
- Venue listing with name, location, capacity, and facilities.
- Availability calendar view.
- Admin CRUD operations on venues.

### Module 7: User Management
- Admin panel showing all registered users.
- Role assignment and account management tools.

### Module 8: Analytics Dashboard
- Key metric cards: Total Events, Total Registrations, Pending Approvals.
- Bar/line charts for registrations over time (Recharts).
- Pie charts for event category distribution.
- Organizer-specific analytics filtered to their events.

---

## 11. UI/UX Requirements

- **Navigation:** Persistent sidebar or top navigation bar with role-appropriate links.
- **Dashboard:** Personalized landing page per role with summary cards and quick actions.
- **Forms:** Validated forms with clear error messages and field hints.
- **Tables:** Sortable and filterable data tables for event and user lists.
- **Modals:** Confirmation dialogs for destructive actions (delete, reject).
- **Loading States:** Skeleton loaders or spinners during data fetches.
- **Empty States:** Helpful illustrations and CTAs when no data is present.
- **Icons:** Consistent use of Lucide React icon set throughout the UI.
- **Color Palette:** Consistent theming via Tailwind CSS configuration.
- **Typography:** Clear hierarchy with defined heading and body text styles.

---

## 12. Analytics & Reporting

The analytics module must surface the following metrics:

| Metric | Visualization | Available To |
|---|---|---|
| Total events created | Metric card | Admin, Organizer |
| Events by status (approved/rejected/pending) | Donut chart | Admin |
| Total registrations per event | Bar chart | Admin, Organizer |
| Registration trend over time | Line chart | Admin |
| Category distribution | Pie chart | Admin |
| Top venues by bookings | Horizontal bar | Admin |
| Student participation rate | Metric card | Admin |

---

## 13. Challenges & Constraints

| Challenge | Mitigation |
|---|---|
| Role-based access complexity | Use React Context + protected route HOCs |
| Venue double-booking | Enforce availability checks on event submission |
| Scalability of state management | Use modular contexts; migrate to Zustand/Redux if needed |
| Form validation across complex forms | Use controlled components with custom validation logic |
| Consistent UI across roles | Shared component library with Tailwind utility classes |
| No backend in v1.0 | Use mock data / localStorage for state persistence |

---

## 14. Future Scope

- **Backend Integration:** Connect to a REST API or GraphQL backend (Node.js/Express or Firebase) for persistent data storage.
- **Email & Push Notifications:** Notify students about event approvals, reminders, and cancellations.
- **Payment Gateway:** Support paid event registrations via Razorpay or Stripe.
- **QR Code Check-in:** Generate QR codes for registered students for event entry.
- **Calendar Integration:** Sync events with Google Calendar or Outlook.
- **Native Mobile App:** React Native app for iOS and Android.
- **Real-time Updates:** WebSocket-based live seat count and notification updates.
- **Certificate Generation:** Auto-generate participation certificates post-event.
- **Multi-college Support:** Expand the platform to support events across multiple institutions.

---

## 15. Conclusion

The College Event Management System addresses a clear and present need in academic institutions by replacing fragmented, manual processes with a unified, digital, and role-based platform. By leveraging React, TypeScript, Tailwind CSS, and supporting libraries, the system is built for scalability, maintainability, and a polished user experience.

The modular architecture ensures each feature can be developed, tested, and extended independently, making this a solid foundation for future enhancements including backend integration and mobile support.

---

*Document prepared for Mini Project (01CE0609), Semester 6 — Department of Computer Engineering, Faculty of Engineering & Technology.*

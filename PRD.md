# Product Requirements Document (PRD)
## Project: College Event Management System

### 1. Executive Summary
The **College Event Management System** is a centralized, high-fidelity platform designed to manage the lifecycle of campus events. It serves as an institutional registry connecting three primary silos: Administration (Governance), Faculty/Organizers (Content Authoring), and Students (Consumption & Discovery). The system emphasizes a premium "Aura" aesthetic with glassmorphic UI elements and high-performance data residency using **Microsoft SQL Server**.

---

### 2. User Personas & Workflows

#### A. Institutional Admin (Governance)
*   **Role**: Oversight and moderation.
*   **Key Workflows**:
    *   Review and Approve/Reject pending exhibition records.
    *   Manage User Directory (Active/Inactive status).
    *   Global Resource Management (Venues/Facilities).
    *   System-wide impact analytics.

#### B. Event Organizer (Content Authoring)
*   **Role**: Content creation and scheduling.
*   **Key Workflows**:
    *   Author new event drafts with media (Banner Images).
    *   Reserve campus facilities (Venues) and verify capacity.
    *   Submit exhibitions for institutional review.
    *   Monitor engagement (Registration counts) in real-time.

#### C. Student (Engagement)
*   **Role**: Discovery and participation.
*   **Key Workflows**:
    *   Browse the "Academic Gallery" of approved events.
    *   Filter events by Discipline (Category) and Timeline.
    *   One-click seat reservation.
    *   View personal registration history.

---

### 3. Technical Architecture

#### Frontend Layer
*   **Framework**: React (Vite)
*   **Styling**: Vanilla CSS with Design Tokens (Aura System).
*   **Animations**: Framer Motion for smooth transitions.
*   **Icons/Typography**: Lucide React / Manrope Font.

#### Backend Layer (Custom API)
*   **Runtime**: Node.js & Express.
*   **ORM**: Prisma 7 (configured for SQL Server).
*   **Security**: JSON Web Tokens (JWT) for secure session persistence.
*   **Authentication**: Custom bcrypt logic with multi-role support.

#### Database Layer
*   **Engine**: Microsoft SQL Server (MSSQL).
*   **Management**: SQL Server Management Studio (SSMS).
*   **Host**: Localhost (Standard Port 1433).

---

### 4. Functional Specifications

#### 4.1. Identity Management
*   **Multi-Role Auth**: Single entry point with dynamic role-based redirection.
*   **Profile Provisioning**: Automatic profile creation for institutional members.
*   **JWT Sessions**: Stateless sessions stored in client-side `localStorage`.

#### 4.2. Event Lifecycle
1.  **Draft**: Created by Organizer, invisible to others.
2.  **Pending**: Submitted for review, visible only to Admins.
3.  **Approved**: Live in the Student Gallery.
4.  **Rejected**: Returned to Organizer with "Rejection Reason" for modification.

#### 4.3. Registration System
*   **Transactional Logic**: Atomic operations for seat reservation.
*   **Concurrency Control**: Prevents registration beyond max capacity.
*   **Engagement Tracking**: Real-time incrementing of `registeredCount`.

---

### 5. Design System: Aura Portal
*   **Foundational Palette**:
    *   `Indigo-600`: Primary Institutional Brand.
    *   `Obsidian-900`: Text and primary surfaces.
    *   `Snow-White`: Card surfaces.
*   **Aesthetics**:
    *   **Glassmorphism**: Subtle backdrops and blur effects on navigation and modals.
    *   **Micro-interactions**: Hover lifts on event cards and smooth route transitions.
    *   **Typography**: Bold Manrope headers for a modern academic feel.

---

### 6. Database Schema (Prisma)
*   **User/Profile**: User auth linked 1:1 with Profile metadata.
*   **Event**: Central table linked to `Venue`, `Category`, and `Organizer`.
*   **Venue**: Master records of campus locations.
*   **Registration**: Junction table linking `Profile` to `Event`.

---

### 7. Future Roadmap (Phase 2 & 3)

#### 7.1. Automated Notifications 📅
*   **Email Gateway**: Integration with SendGrid or SMTP to notify organizers on approval and students on successful registration.
*   **Alert System**: In-app notifications for status changes.

#### 7.2. Accreditation & Certificates 📜
*   **Auto-Generation**: PDF certificate generation for students who attended "Academic" categories.
*   **QR Validation**: Check-in system for event attendees to confirm participation.

#### 7.3. Advanced Analytics 📊
*   **AI Recommendations**: Suggested events based on a student's past participation categories.
*   **Resource Mapping**: Heatmaps of the most utilized campus venues.

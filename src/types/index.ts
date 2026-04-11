export type UserRole = 'student' | 'organizer' | 'admin';
export type EventStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type RegistrationStatus = 'upcoming' | 'past' | 'cancelled';
export type EventCategory = 'technical' | 'cultural' | 'sports' | 'seminar' | 'workshop' | 'competition';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  joinedAt: string;
  avatarInitials: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  facilities: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venueId: string;
  organizerId: string;
  maxCapacity: number;
  registeredCount: number;
  status: EventStatus;
  bannerUrl: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  studentId: string;
  eventId: string;
  registeredAt: string;
  status: RegistrationStatus;
}

export interface TrendPoint {
  date: string;
  count: number;
}

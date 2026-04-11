import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui-custom/Toast';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  facilities: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venueId: string;
  categoryId: string;
  organizerId: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  maxCapacity: number;
  registeredCount: number;
  bannerImage?: string;
  rejectionReason?: string;
}

interface EventContextType {
  events: Event[];
  venues: Venue[];
  categories: Category[];
  registrations: Registration[];
  users: any[];
  isLoading: boolean;
  addEvent: (event: Omit<Event, 'id' | 'registeredCount' | 'organizerId'>) => Promise<void>;
  updateEvent: (eventId: string, data: Partial<Event>) => Promise<void>;
  registerForEvent: (eventId: string, userId: string, attendeeDetails?: { attendeeName: string; attendeeGender: string; attendeeContact: string; attendeeEmail: string }) => Promise<any>;
  unregisterFromEvent: (registrationId: string) => Promise<void>;
  downloadTicket: (registrationId: number) => Promise<void>;
  updateEventStatus: (eventId: string, status: Event['status'], reason?: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  updateUser: (userId: string, data: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addVenue: (venue: any) => Promise<void>;
  updateVenue: (venueId: string, data: any) => Promise<void>;
  deleteVenue: (venueId: string) => Promise<void>;
  provisionUser: (data: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('college_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [eventsRes, venuesRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/venues`),
        fetch(`${API_URL}/categories`)
      ]);

      const eventsData = await eventsRes.json();
      const venuesData = await venuesRes.json();
      const categoriesData = await categoriesRes.json();

      console.log('--- Institutional Data Sync Diagnostic ---');
      console.log('Total Exhibits Fetched:', eventsData.length);
      if (eventsData.length > 0) console.log('Sample Exhibit Owner ID:', eventsData[0].organizerId);
      console.log('-----------------------------------------');

      setEvents(Array.isArray(eventsData) ? eventsData.map((e: any) => ({ 
        ...e, 
        id: String(e.id),
        organizerId: String(e.organizerId),
        venueId: String(e.venueId),
        categoryId: String(e.categoryId)
      })) : []);
      setVenues(Array.isArray(venuesData) ? venuesData.map((v: any) => ({ 
        ...v, 
        id: v.id.toString(),
        facilities: typeof v.facilities === 'string' ? v.facilities.split(',').filter(Boolean) : (Array.isArray(v.facilities) ? v.facilities : [])
      })) : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData.map((c: any) => ({ ...c, id: c.id.toString() })) : []);

      if (user) {
        const fetchUserData = async () => {
            if (user.role === 'admin') {
                const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
                if (res.ok) setUsers(await res.json());
            }
        };

        const [regRes] = await Promise.all([
          fetch(`${API_URL}/registrations`, { headers: getHeaders() }),
          fetchUserData()
        ]);
        if (regRes.ok) {
          const regData = await regRes.json();
          setRegistrations(Array.isArray(regData) ? regData.map((r: any) => ({ 
            ...r, 
            id: r.id.toString(), 
            userId: r.userId.toString(), 
            eventId: r.eventId.toString() 
          })) : []);
        }
      }
    } catch (error) {
      console.error('Data sync failed:', error);
      showToast('danger', 'Institutional records synchronization failed.');
    } finally {
      setIsLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const addEvent = async (eventData: Omit<Event, 'id' | 'registeredCount' | 'organizerId'>) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API Error');
      }
      await fetchAllData();
      showToast('success', 'Exhibition recorded at institutional level.');
    } catch (error: any) {
      showToast('danger', error.message || 'Failed to append exhibition record.');
      throw error;
    }
  };

  const registerForEvent = async (eventId: string, userId: string, attendeeDetails?: { attendeeName: string; attendeeGender: string; attendeeContact: string; attendeeEmail: string }) => {
    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
          eventId,
          ...(attendeeDetails || {})
        }),
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      await fetchAllData();
      showToast('success', 'Institutional engagement confirmed.');
      return data;
    } catch (error) {
      showToast('danger', 'Engagement registration failed.');
      throw error;
    }
  };

  const unregisterFromEvent = async (registrationId: string) => {
    try {
      const response = await fetch(`${API_URL}/registrations/${registrationId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
      showToast('success', 'Engagement withdrawal processed.');
    } catch (error) {
      showToast('danger', 'Withdrawal failed.');
      throw error;
    }
  };

  const downloadTicket = async (registrationId: number) => {
    try {
      showToast('info', 'Generating institutional PDF pass...');
      const response = await fetch(`${API_URL}/registrations/${registrationId}/ticket`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ticket-${registrationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast('success', 'Institutional pass downloaded.');
    } catch (error) {
      showToast('danger', 'Failed to generate PDF pass.');
    }
  };

  const updateEvent = async (eventId: string, data: Partial<Event>) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
      showToast('success', 'Master exhibition record updated.');
    } catch (error) {
      showToast('danger', 'Exhibition update failed.');
      throw error;
    }
  };

  const updateEventStatus = async (eventId: string, status: Event['status'], reason?: string) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status, rejectionReason: reason }),
      });

      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
    } catch (error) {
      showToast('danger', 'Governance status update failed.');
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
      showToast('success', 'Exhibition record purged.');
    } catch (error) {
      showToast('danger', 'Exhibition purge failed.');
      throw error;
    }
  };

  const updateUser = async (userId: string, data: any) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
    } catch (error) {
      showToast('danger', 'Principal update failed.');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
    } catch (error) {
      showToast('danger', 'Principal purge failed.');
    }
  };

  const addVenue = async (venueData: any) => {
    try {
      const response = await fetch(`${API_URL}/venues`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(venueData)
      });
      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
    } catch (error) {
      showToast('danger', 'Facility creation failed.');
    }
  };

  const updateVenue = async (venueId: string, data: any) => {
    try {
      const response = await fetch(`${API_URL}/venues/${venueId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
    } catch (error) {
      showToast('danger', 'Facility update failed.');
    }
  };

  const deleteVenue = async (venueId: string) => {
    try {
      const response = await fetch(`${API_URL}/venues/${venueId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('API Error');
      await fetchAllData();
    } catch (error) {
      showToast('danger', 'Facility deletion failed.');
    }
  };

  const provisionUser = async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Provisioning failed');
      }
      await fetchAllData();
      showToast('success', 'Verified account provisioned successfully.');
    } catch (error: any) {
      showToast('danger', error.message || 'Identity provisioning failed.');
      throw error;
    }
  };

  return (
    <EventContext.Provider value={{ 
      events, venues, categories, registrations, users, isLoading, 
      addEvent, updateEvent, registerForEvent, unregisterFromEvent,
      downloadTicket,
      updateEventStatus, deleteEvent,
      updateUser, deleteUser, addVenue, updateVenue, deleteVenue,
      provisionUser,
      refreshData: fetchAllData
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

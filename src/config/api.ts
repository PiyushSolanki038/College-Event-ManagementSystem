export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    SEND_VERIFICATION: `${API_BASE_URL}/api/auth/send-verification`,
    VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
  },
  EVENTS: {
    BASE: `${API_BASE_URL}/api/events`,
    REGISTRATIONS: (id: number) => `${API_BASE_URL}/api/events/${id}/registrations`,
  },
  VENUES: `${API_BASE_URL}/api/venues`,
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  CONTACT: `${API_BASE_URL}/api/contact`,
  COMMUNICATE: {
    DIRECT: `${API_BASE_URL}/api/communicate/direct`,
    BROADCAST: `${API_BASE_URL}/api/communicate/broadcast`,
  },
};

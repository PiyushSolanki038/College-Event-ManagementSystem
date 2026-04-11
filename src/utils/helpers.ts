import type { EventCategory } from '../types';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function categoryLabel(cat: EventCategory): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function getCategoryColor(cat: EventCategory): string {
  const map: Record<EventCategory, string> = {
    technical: 'bg-info-bg text-info-text',
    cultural: 'bg-warning-bg text-warning-text',
    sports: 'bg-success-bg text-success-text',
    seminar: 'bg-brand-light text-brand',
    workshop: 'bg-danger-bg text-danger-text',
    competition: 'bg-info-bg text-info-text',
  };
  return map[cat];
}

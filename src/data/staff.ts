import { StaffMember } from '../types/scheduler';

export const pharmacyStaff: StaffMember[] = [
  {
    id: 'pharmacist-1',
    name: 'Dr. Sarah Johnson',
    color: '#2563eb', // Blue
    role: 'Head Pharmacist'
  },
  {
    id: 'pharmacist-2',
    name: 'Dr. Michael Chen',
    color: '#dc2626', // Red
    role: 'Pharmacist'
  },
  {
    id: 'tech-1',
    name: 'Emily Rodriguez',
    color: '#16a34a', // Green
    role: 'Pharmacy Technician'
  },
  {
    id: 'tech-2',
    name: 'James Wilson',
    color: '#ea580c', // Orange
    role: 'Pharmacy Technician'
  },
  {
    id: 'assistant-1',
    name: 'Lisa Thompson',
    color: '#9333ea', // Purple
    role: 'Pharmacy Assistant'
  },
  {
    id: 'cashier-1',
    name: 'Robert Kim',
    color: '#0891b2', // Cyan
    role: 'Cashier'
  }
];

export const getStaffById = (id: string): StaffMember | undefined => {
  return pharmacyStaff.find(staff => staff.id === id);
};

export const getEventTypeColors = () => ({
  'shift': '#1f2937',
  'break': '#6b7280',
  'consultation': '#059669',
  'inventory': '#d97706',
  'training': '#7c3aed',
  'meeting': '#dc2626'
});
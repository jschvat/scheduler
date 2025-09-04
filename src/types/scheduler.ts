export interface StaffMember {
  id: string;
  name: string;
  color: string;
  role: string;
}

export interface EventTypeConfig {
  [key: string]: string;
}

export interface SchedulerEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  staffId?: string;
  type: 'shift' | 'break' | 'consultation' | 'inventory' | 'training' | 'meeting';
  allDay?: boolean;
  isTracking?: boolean;
  actualStartTime?: Date;
  actualEndTime?: Date;
}

export interface TimeSlot {
  date: Date;
  hour: number;
}

export interface DragItem {
  type: string;
  id: string;
  event: SchedulerEvent;
}
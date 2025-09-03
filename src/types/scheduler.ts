export interface SchedulerEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
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
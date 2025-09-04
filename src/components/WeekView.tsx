import React from 'react';
import { SchedulerEvent, StaffMember, EventTypeConfig } from '../types/scheduler';
import DayColumn from './DayColumn';

interface WeekViewProps {
  events: SchedulerEvent[];
  staffMembers?: StaffMember[];
  eventTypeColors?: EventTypeConfig;
  defaultEventType?: string;
  selectedEventId?: string | null;
  onEventMove: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onEventResize: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onEventAdd: (event: SchedulerEvent) => void;
  onEventSelect?: (eventId: string) => void;
  onTimeTrackingToggle?: (eventId: string) => void;
  showTimeTracking?: boolean;
}

const WeekView: React.FC<WeekViewProps> = ({
  events,
  staffMembers,
  eventTypeColors,
  defaultEventType,
  selectedEventId,
  onEventMove,
  onEventResize,
  onEventAdd,
  onEventSelect,
  onTimeTrackingToggle,
  showTimeTracking
}) => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="week-view">
      <div className="time-column">
        <div className="time-header"></div>
        {hours.map(hour => (
          <div key={hour} className="time-slot">
            {hour.toString().padStart(2, '0')}:00
          </div>
        ))}
      </div>
      
      {weekDays.map((day, dayIndex) => (
        <DayColumn
          key={day.toISOString()}
          date={day}
          events={events.filter(event => {
            const eventDate = new Date(event.startDate);
            return eventDate.toDateString() === day.toDateString();
          })}
          staffMembers={staffMembers}
          eventTypeColors={eventTypeColors}
          defaultEventType={defaultEventType}
          selectedEventId={selectedEventId}
          onEventMove={onEventMove}
          onEventResize={onEventResize}
          onEventAdd={onEventAdd}
          onEventSelect={onEventSelect}
          onTimeTrackingToggle={onTimeTrackingToggle}
          showTimeTracking={showTimeTracking}
        />
      ))}
    </div>
  );
};

export default WeekView;
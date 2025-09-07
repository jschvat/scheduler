import React, { useCallback } from 'react';
import { SchedulerEvent, StaffMember, EventTypeConfig } from '../types/scheduler';
import EventBlock from './EventBlock';
import TimeSlot from './TimeSlot';

interface DayColumnProps {
  date: Date;
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
  onEventEdit?: (eventId: string) => void;
  onEventDelete?: (eventId: string) => void;
  onEventSetAsTemplate?: (eventId: string) => void;
  onEventCopy?: (eventId: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({
  date,
  events,
  staffMembers = [],
  eventTypeColors = {},
  defaultEventType = 'shift',
  selectedEventId,
  onEventMove,
  onEventResize,
  onEventAdd,
  onEventSelect,
  onTimeTrackingToggle,
  showTimeTracking = false,
  onEventEdit,
  onEventDelete,
  onEventSetAsTemplate,
  onEventCopy
}) => {

  const handleTimeSlotClick = useCallback((hour: number) => {
    const startDate = new Date(date);
    startDate.setHours(hour, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(hour + 1, 0, 0, 0);
    
    const newEvent: SchedulerEvent = {
      id: `event-${Date.now()}`,
      title: 'New Task',
      startDate,
      endDate,
      type: (defaultEventType || 'shift') as 'shift' | 'break' | 'consultation' | 'inventory' | 'training' | 'meeting',
    };
    
    onEventAdd(newEvent);
  }, [date, onEventAdd, defaultEventType]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="day-column">
      <div className="day-header">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
      
      <div className="day-content">
        {hours.map(hour => (
          <TimeSlot
            key={hour}
            date={date}
            hour={hour}
            onClick={() => handleTimeSlotClick(hour)}
          />
        ))}
        
        {events.map(event => (
          <EventBlock
            key={event.id}
            event={event}
            staffMembers={staffMembers}
            eventTypeColors={eventTypeColors}
            isSelected={selectedEventId === event.id}
            onEventResize={onEventResize}
            onEventSelect={onEventSelect}
            onTimeTrackingToggle={onTimeTrackingToggle}
            showTimeTracking={showTimeTracking}
            onEventEdit={onEventEdit}
            onEventDelete={onEventDelete}
            onEventSetAsTemplate={onEventSetAsTemplate}
            onEventCopy={onEventCopy}
          />
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
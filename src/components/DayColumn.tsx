import React, { useCallback } from 'react';
import { SchedulerEvent } from '../types/scheduler';
import EventBlock from './EventBlock';
import TimeSlot from './TimeSlot';
import './DayColumn.css';

interface DayColumnProps {
  date: Date;
  events: SchedulerEvent[];
  onEventMove: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onEventResize: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onEventAdd: (event: SchedulerEvent) => void;
  onTimeTrackingToggle?: (eventId: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({
  date,
  events,
  onEventMove,
  onEventResize,
  onEventAdd,
  onTimeTrackingToggle
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
      type: 'shift',
    };
    
    onEventAdd(newEvent);
  }, [date, onEventAdd]);

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
            onEventResize={onEventResize}
            onTimeTrackingToggle={onTimeTrackingToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
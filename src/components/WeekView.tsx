import React from 'react';
import { SchedulerEvent } from '../types/scheduler';
import DayColumn from './DayColumn';
import './WeekView.css';

interface WeekViewProps {
  events: SchedulerEvent[];
  onEventMove: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onEventResize: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onEventAdd: (event: SchedulerEvent) => void;
  onTimeTrackingToggle?: (eventId: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  events,
  onEventMove,
  onEventResize,
  onEventAdd,
  onTimeTrackingToggle
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
          onEventMove={onEventMove}
          onEventResize={onEventResize}
          onEventAdd={onEventAdd}
          onTimeTrackingToggle={onTimeTrackingToggle}
        />
      ))}
    </div>
  );
};

export default WeekView;
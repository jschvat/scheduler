import React, { useState, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { SchedulerEvent } from '../types/scheduler';
import './EventBlock.css';

interface EventBlockProps {
  event: SchedulerEvent;
  onEventResize: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
}

const EventBlock: React.FC<EventBlockProps> = ({ event, onEventResize }) => {
  const [isResizing, setIsResizing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: event.id,
  });

  const getEventStyle = useCallback(() => {
    const startHour = event.startDate.getHours() + event.startDate.getMinutes() / 60;
    const endHour = event.endDate.getHours() + event.endDate.getMinutes() / 60;
    const duration = endHour - startHour;
    
    return {
      top: `${startHour * 60}px`,
      height: `${Math.max(duration * 60, 30)}px`,
      opacity: isDragging ? 0.5 : 1,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };
  }, [event, isDragging, transform]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startY = e.clientY;
    const originalHeight = event.endDate.getTime() - event.startDate.getTime();

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newDuration = originalHeight + (deltaY * 60 * 60 * 1000 / 60); // Convert pixels to milliseconds
      
      if (newDuration > 30 * 60 * 1000) { // Minimum 30 minutes
        const newEndDate = new Date(event.startDate.getTime() + newDuration);
        onEventResize(event.id, event.startDate, newEndDate);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [event, onEventResize]);

  return (
    <div
      ref={setNodeRef}
      className={`event-block ${isResizing ? 'resizing' : ''}`}
      style={getEventStyle()}
      {...listeners}
      {...attributes}
    >
      <div className="event-content">
        <div className="event-title">{event.title}</div>
        <div className="event-time">
          {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <div
        className="resize-handle"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};

export default EventBlock;
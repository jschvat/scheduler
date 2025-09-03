import React, { useState, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { SchedulerEvent } from '../types/scheduler';
import { getStaffById, getEventTypeColors } from '../data/staff';
import './EventBlock.css';

interface EventBlockProps {
  event: SchedulerEvent;
  onEventResize: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onTimeTrackingToggle?: (eventId: string) => void;
}

const EventBlock: React.FC<EventBlockProps> = ({ event, onEventResize, onTimeTrackingToggle }) => {
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
    
    const staff = event.staffId ? getStaffById(event.staffId) : null;
    const eventTypeColors = getEventTypeColors();
    const backgroundColor = staff ? staff.color : eventTypeColors[event.type];
    
    return {
      top: `${startHour * 60}px`,
      height: `${Math.max(duration * 60, 30)}px`,
      opacity: isDragging ? 0.5 : 1,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      backgroundColor,
      borderLeftColor: backgroundColor,
    };
  }, [event, isDragging, transform]);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: 'top' | 'bottom') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startY = e.clientY;
    const originalStartTime = event.startDate.getTime();
    const originalEndTime = event.endDate.getTime();

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const timeChange = deltaY * 60 * 60 * 1000 / 60; // Convert pixels to milliseconds (1px = 1 minute)
      
      if (direction === 'bottom') {
        // Resize from bottom (change end time)
        const newEndTime = originalEndTime + timeChange;
        if (newEndTime > originalStartTime + (15 * 60 * 1000)) { // Minimum 15 minutes
          const newEndDate = new Date(newEndTime);
          onEventResize(event.id, event.startDate, newEndDate);
        }
      } else {
        // Resize from top (change start time)
        const newStartTime = originalStartTime + timeChange;
        if (newStartTime < originalEndTime - (15 * 60 * 1000)) { // Minimum 15 minutes
          const newStartDate = new Date(newStartTime);
          onEventResize(event.id, newStartDate, event.endDate);
        }
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

  const handleTimeTrackingClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTimeTrackingToggle?.(event.id);
  }, [event.id, onTimeTrackingToggle]);

  const staff = event.staffId ? getStaffById(event.staffId) : null;
  
  return (
    <div
      ref={setNodeRef}
      className={`event-block ${isResizing ? 'resizing' : ''} ${event.isTracking ? 'tracking' : ''}`}
      style={getEventStyle()}
    >
      <div
        className="resize-handle resize-handle-top"
        onMouseDown={(e) => handleResizeStart(e, 'top')}
      />
      
      <div 
        className="event-content"
        {...listeners}
        {...attributes}
      >
        <div className="event-header">
          <div className="event-title">{event.title}</div>
          {onTimeTrackingToggle && (
            <button
              className={`time-tracking-btn ${event.isTracking ? 'active' : ''}`}
              onClick={handleTimeTrackingClick}
              title={event.isTracking ? 'Stop tracking' : 'Start tracking'}
            >
              {event.isTracking ? '⏹' : '▶'}
            </button>
          )}
        </div>
        
        {staff && (
          <div className="event-staff">{staff.name} - {staff.role}</div>
        )}
        
        <div className="event-time">
          {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        <div className="event-type">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</div>
        
        {event.isTracking && event.actualStartTime && (
          <div className="actual-time">
            Started: {event.actualStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
      
      <div
        className="resize-handle resize-handle-bottom"
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
      />
    </div>
  );
};

export default EventBlock;
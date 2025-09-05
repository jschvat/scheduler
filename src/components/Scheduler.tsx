import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SchedulerEvent, StaffMember, EventTypeConfig } from '../types/scheduler';
import WeekView from './WeekView';
import './Scheduler.css';

interface SchedulerProps {
  events?: SchedulerEvent[];
  staffMembers?: StaffMember[];
  eventTypeColors?: EventTypeConfig;
  defaultEventType?: string;
  showTimeTracking?: boolean;
  onEventChange?: (events: SchedulerEvent[]) => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ 
  events: initialEvents = [],
  staffMembers = [],
  eventTypeColors = {},
  defaultEventType = 'task',
  showTimeTracking = false,
  onEventChange 
}) => {
  const [events, setEvents] = useState<SchedulerEvent[]>(initialEvents);
  const [activeEvent, setActiveEvent] = useState<SchedulerEvent | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleEventMove = useCallback((eventId: string, newStartDate: Date, newEndDate: Date) => {
    console.log('handleEventMove called:', { eventId, newStartDate, newEndDate });
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, startDate: newStartDate, endDate: newEndDate }
        : event
    );
    console.log('Updated events:', updatedEvents);
    setEvents(updatedEvents);
    onEventChange?.(updatedEvents);
  }, [events, onEventChange]);

  const handleEventResize = useCallback((eventId: string, newStartDate: Date, newEndDate: Date) => {
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, startDate: newStartDate, endDate: newEndDate }
        : event
    );
    setEvents(updatedEvents);
    onEventChange?.(updatedEvents);
  }, [events, onEventChange]);

  const handleEventAdd = useCallback((newEvent: SchedulerEvent) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    onEventChange?.(updatedEvents);
  }, [events, onEventChange]);

  const handleTimeTrackingToggle = useCallback((eventId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        if (event.isTracking) {
          // Stop tracking
          return {
            ...event,
            isTracking: false,
            actualEndTime: new Date(),
          };
        } else {
          // Start tracking
          return {
            ...event,
            isTracking: true,
            actualStartTime: new Date(),
            actualEndTime: undefined,
          };
        }
      }
      return event;
    });
    setEvents(updatedEvents);
    onEventChange?.(updatedEvents);
  }, [events, onEventChange]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const draggedEvent = events.find(e => e.id === event.active.id);
    setActiveEvent(draggedEvent || null);
  }, [events]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveEvent(null);

    if (over && active.id !== over.id) {
      const eventId = active.id as string;
      const overData = over.data.current;
      
      if (overData?.date && overData?.hour !== undefined) {
        const newStartDate = new Date(overData.date);
        newStartDate.setHours(overData.hour, 0, 0, 0);
        
        const originalEvent = events.find(e => e.id === eventId);
        if (originalEvent) {
          const duration = originalEvent.endDate.getTime() - originalEvent.startDate.getTime();
          const newEndDate = new Date(newStartDate.getTime() + duration);
          handleEventMove(eventId, newStartDate, newEndDate);
        }
      }
    }
  }, [events, handleEventMove]);

  // Keyboard controls for time adjustment
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    console.log('Key pressed:', event.key, 'Selected event:', selectedEventId);
    
    if (!selectedEventId) return;
    
    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) return;

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      
      const adjustment = event.key === 'ArrowUp' ? -15 : 15; // Up = earlier, Down = later
      const adjustmentMs = adjustment * 60 * 1000; // Convert to milliseconds
      
      const newStartDate = new Date(selectedEvent.startDate.getTime() + adjustmentMs);
      const newEndDate = new Date(selectedEvent.endDate.getTime() + adjustmentMs);
      
      console.log('Adjusting time by', adjustment, 'minutes');
      console.log('New times:', newStartDate, newEndDate);
      
      // Ensure we don't go before midnight or after 23:45
      const startHours = newStartDate.getHours() + newStartDate.getMinutes() / 60;
      const endHours = newEndDate.getHours() + newEndDate.getMinutes() / 60;
      
      console.log('Time validation:', { startHours, endHours, valid: startHours >= 0 && endHours <= 24 });
      
      if (startHours >= 0 && endHours <= 24) {
        console.log('Moving event to new time');
        handleEventMove(selectedEventId, newStartDate, newEndDate);
      } else {
        console.log('Time adjustment blocked - would go outside valid range');
      }
    }
    
    if (event.key === 'Escape') {
      setSelectedEventId(null);
    }
  }, [selectedEventId, events, handleEventMove]);

  const handleEventSelect = useCallback((eventId: string) => {
    console.log('handleEventSelect called - Event selected:', eventId, 'Previously selected:', selectedEventId);
    const newSelectedId = eventId === selectedEventId ? null : eventId;
    console.log('Setting selectedEventId to:', newSelectedId);
    setSelectedEventId(newSelectedId);
  }, [selectedEventId]);

  // Debug selected event changes
  React.useEffect(() => {
    console.log('selectedEventId changed to:', selectedEventId);
  }, [selectedEventId]);

  // Add keyboard event listeners
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="scheduler">
        <div className="scheduler-header">
          <h2>Scheduler</h2>
        </div>
        <WeekView
          events={events}
          staffMembers={staffMembers}
          eventTypeColors={eventTypeColors}
          defaultEventType={defaultEventType}
          selectedEventId={selectedEventId}
          onEventMove={handleEventMove}
          onEventResize={handleEventResize}
          onEventAdd={handleEventAdd}
          onEventSelect={handleEventSelect}
          onTimeTrackingToggle={handleTimeTrackingToggle}
          showTimeTracking={showTimeTracking}
        />
      </div>
      <DragOverlay>
        {activeEvent ? (
          <div className="drag-overlay">
            {activeEvent.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Scheduler;
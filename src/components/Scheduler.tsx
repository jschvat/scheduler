import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SchedulerEvent } from '../types/scheduler';
import WeekView from './WeekView';
import './Scheduler.css';

interface SchedulerProps {
  events?: SchedulerEvent[];
  onEventChange?: (events: SchedulerEvent[]) => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ 
  events: initialEvents = [], 
  onEventChange 
}) => {
  const [events, setEvents] = useState<SchedulerEvent[]>(initialEvents);
  const [activeEvent, setActiveEvent] = useState<SchedulerEvent | null>(null);

  const handleEventMove = useCallback((eventId: string, newStartDate: Date, newEndDate: Date) => {
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, startDate: newStartDate, endDate: newEndDate }
        : event
    );
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
          onEventMove={handleEventMove}
          onEventResize={handleEventResize}
          onEventAdd={handleEventAdd}
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
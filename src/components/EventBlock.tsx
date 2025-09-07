import React, { useState, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { SchedulerEvent, StaffMember, EventTypeConfig } from '../types/scheduler';
import ContextMenu, { ContextMenuOption } from './ContextMenu';

interface EventBlockProps {
  event: SchedulerEvent;
  staffMembers?: StaffMember[];
  eventTypeColors?: EventTypeConfig;
  isSelected?: boolean;
  onEventResize: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onEventSelect?: (eventId: string) => void;
  onTimeTrackingToggle?: (eventId: string) => void;
  showTimeTracking?: boolean;
  onEventEdit?: (eventId: string) => void;
  onEventDelete?: (eventId: string) => void;
  onEventSetAsTemplate?: (eventId: string) => void;
  onEventCopy?: (eventId: string) => void;
}

const EventBlock: React.FC<EventBlockProps> = ({ 
  event, 
  staffMembers = [], 
  eventTypeColors = {},
  isSelected = false,
  onEventResize,
  onEventSelect,
  onTimeTrackingToggle,
  showTimeTracking = false,
  onEventEdit,
  onEventDelete,
  onEventSetAsTemplate,
  onEventCopy 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: event.id,
    disabled: false,
  });

  const getStaff = useCallback(() => {
    return event.staffId ? staffMembers.find(s => s.id === event.staffId) : null;
  }, [event.staffId, staffMembers]);

  const getEventStyle = useCallback(() => {
    const startHour = event.startDate.getHours() + event.startDate.getMinutes() / 60;
    const endHour = event.endDate.getHours() + event.endDate.getMinutes() / 60;
    const duration = endHour - startHour;
    
    const staff = getStaff();
    const backgroundColor = staff ? staff.color : (eventTypeColors[event.type] || '#6b7280');
    
    return {
      top: `${startHour * 60}px`,
      height: `${Math.max(duration * 60, 30)}px`,
      opacity: isDragging ? 0.5 : 1,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      backgroundColor,
      borderLeftColor: backgroundColor,
    };
  }, [event, isDragging, transform, getStaff, eventTypeColors]);

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

  const handleEventClick = useCallback((e: React.MouseEvent) => {
    // Only handle clicks that don't come from draggable area
    const target = e.target as HTMLElement;
    
    // If the click is on a button (like time tracking), don't select
    if (target.tagName === 'BUTTON') {
      return;
    }
    
    console.log('EventBlock clicked for event:', event.id);
    onEventSelect?.(event.id);
  }, [event.id, onEventSelect]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const getContextMenuOptions = useCallback((): ContextMenuOption[] => {
    return [
      {
        label: 'Edit',
        icon: '✏️',
        action: () => onEventEdit?.(event.id),
        disabled: !onEventEdit
      },
      {
        label: 'Copy',
        icon: '📋',
        action: () => onEventCopy?.(event.id),
        disabled: !onEventCopy
      },
      {
        label: 'Set as Template',
        icon: '📄',
        action: () => onEventSetAsTemplate?.(event.id),
        disabled: !onEventSetAsTemplate
      },
      {
        label: 'Delete',
        icon: '🗑️',
        action: () => onEventDelete?.(event.id),
        disabled: !onEventDelete,
        divider: true
      }
    ];
  }, [event.id, onEventEdit, onEventCopy, onEventSetAsTemplate, onEventDelete]);

  const staff = getStaff();
  
  return (
    <div
      ref={setNodeRef}
      className={`event-block ${isResizing ? 'resizing' : ''} ${event.isTracking ? 'tracking' : ''} ${isSelected ? 'selected' : ''}`}
      style={getEventStyle()}
    >
      <div
        className="resize-handle resize-handle-top"
        onMouseDown={(e) => handleResizeStart(e, 'top')}
      />
      
      {/* Draggable area - small handle in top-right */}
      <div 
        className="drag-handle"
        {...listeners}
        {...attributes}
        title="Drag to move event"
      />
      
      {/* Clickable content area */}
      <div 
        className="event-content"
        onClick={handleEventClick}
        onContextMenu={handleContextMenu}
      >
        <div className="event-header">
          <div className="event-title">{event.title}</div>
          {showTimeTracking && onTimeTrackingToggle && (
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

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={getContextMenuOptions()}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

export default EventBlock;
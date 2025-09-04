import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface TimeSlotProps {
  date: Date;
  hour: number;
  onClick: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ date, hour, onClick }) => {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: `timeslot-${date.toISOString()}-${hour}`,
    data: {
      date,
      hour,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`time-slot ${isOver ? 'drop-over' : ''}`}
      data-hour={hour}
      onClick={onClick}
    >
    </div>
  );
};

export default TimeSlot;
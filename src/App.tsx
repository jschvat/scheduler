import React, { useState } from 'react';
import Scheduler from './components/Scheduler';
import StaffLegend from './components/StaffLegend';
import { SchedulerEvent } from './types/scheduler';
import { pharmacyStaff, getEventTypeColors } from './data/staff';
import './App.css';

const getCurrentWeekEvents = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  return [
    {
      id: '1',
      title: 'Morning Shift - Dispensing',
      startDate: new Date(startOfWeek.getTime() + (1 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (1 * 24 * 60 * 60 * 1000) + (16 * 60 * 60 * 1000)),
      staffId: 'pharmacist-1',
      type: 'shift' as const,
    },
    {
      id: '2',
      title: 'Patient Consultation',
      startDate: new Date(startOfWeek.getTime() + (1 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (1 * 24 * 60 * 60 * 1000) + (15 * 60 * 60 * 1000)),
      staffId: 'pharmacist-2',
      type: 'consultation' as const,
    },
    {
      id: '3',
      title: 'Inventory Count',
      startDate: new Date(startOfWeek.getTime() + (2 * 24 * 60 * 60 * 1000) + (10 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (2 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000)),
      staffId: 'tech-1',
      type: 'inventory' as const,
    },
    {
      id: '4',
      title: 'Break',
      startDate: new Date(startOfWeek.getTime() + (2 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (2 * 24 * 60 * 60 * 1000) + (13 * 60 * 60 * 1000)),
      staffId: 'tech-1',
      type: 'break' as const,
    },
    {
      id: '5',
      title: 'Afternoon Shift - Counter',
      startDate: new Date(startOfWeek.getTime() + (3 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (3 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)),
      staffId: 'assistant-1',
      type: 'shift' as const,
    },
    {
      id: '6',
      title: 'Staff Training - New Procedures',
      startDate: new Date(startOfWeek.getTime() + (4 * 24 * 60 * 60 * 1000) + (16 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (4 * 24 * 60 * 60 * 1000) + (18 * 60 * 60 * 1000)),
      staffId: 'pharmacist-1',
      type: 'training' as const,
    },
  ];
};

function App() {
  const [events, setEvents] = useState<SchedulerEvent[]>(getCurrentWeekEvents());
  
  // Configuration for pharmacy business
  const staffMembers = pharmacyStaff;
  const eventTypeColors = getEventTypeColors();

  const handleEventChange = (updatedEvents: SchedulerEvent[]) => {
    setEvents(updatedEvents);
    console.log('Events updated:', updatedEvents);
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>Pharmacy Staff Scheduler</h1>
        <p>
          Manage pharmacy staff schedules, track time, and plan activities. 
          Click time slots to create tasks. Drag events to reschedule. 
          Use resize handles (top/bottom) to adjust duration. Click play button to start time tracking.
        </p>
      </div>
      
      <div className="app-content">
        <StaffLegend 
          staffMembers={staffMembers}
          eventTypeColors={eventTypeColors}
        />
        <Scheduler 
          events={events}
          staffMembers={staffMembers}
          eventTypeColors={eventTypeColors}
          defaultEventType="shift"
          showTimeTracking={true}
          onEventChange={handleEventChange}
        />
      </div>
    </div>
  );
}

export default App;

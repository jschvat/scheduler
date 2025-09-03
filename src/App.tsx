import React, { useState } from 'react';
import Scheduler from './components/Scheduler';
import { SchedulerEvent } from './types/scheduler';
import './App.css';

const getCurrentWeekEvents = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  return [
    {
      id: '1',
      title: 'Team Meeting',
      startDate: new Date(startOfWeek.getTime() + (1 * 24 * 60 * 60 * 1000) + (9 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (1 * 24 * 60 * 60 * 1000) + (10.5 * 60 * 60 * 1000)),
    },
    {
      id: '2',
      title: 'Project Review',
      startDate: new Date(startOfWeek.getTime() + (1 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (1 * 24 * 60 * 60 * 1000) + (16 * 60 * 60 * 1000)),
    },
    {
      id: '3',
      title: 'Client Call',
      startDate: new Date(startOfWeek.getTime() + (2 * 24 * 60 * 60 * 1000) + (11 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (2 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000)),
    },
    {
      id: '4',
      title: 'Code Review',
      startDate: new Date(startOfWeek.getTime() + (3 * 24 * 60 * 60 * 1000) + (15.5 * 60 * 60 * 1000)),
      endDate: new Date(startOfWeek.getTime() + (3 * 24 * 60 * 60 * 1000) + (17 * 60 * 60 * 1000)),
    },
  ];
};

function App() {
  const [events, setEvents] = useState<SchedulerEvent[]>(getCurrentWeekEvents());

  const handleEventChange = (updatedEvents: SchedulerEvent[]) => {
    setEvents(updatedEvents);
    console.log('Events updated:', updatedEvents);
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>Drag & Drop Scheduler Demo</h1>
        <p>
          Click on time slots to create events. Drag events to move them. 
          Drag the resize handle at the bottom of events to change duration.
        </p>
      </div>
      <Scheduler 
        events={events} 
        onEventChange={handleEventChange}
      />
    </div>
  );
}

export default App;

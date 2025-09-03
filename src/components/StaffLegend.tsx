import React from 'react';
import { pharmacyStaff, getEventTypeColors } from '../data/staff';
import './StaffLegend.css';

const StaffLegend: React.FC = () => {
  const eventTypeColors = getEventTypeColors();

  return (
    <div className="staff-legend">
      <div className="legend-section">
        <h3>Staff Colors</h3>
        <div className="legend-items">
          {pharmacyStaff.map(staff => (
            <div key={staff.id} className="legend-item">
              <div 
                className="color-box" 
                style={{ backgroundColor: staff.color }}
              />
              <span className="legend-text">
                {staff.name} - {staff.role}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="legend-section">
        <h3>Activity Types</h3>
        <div className="legend-items">
          {Object.entries(eventTypeColors).map(([type, color]) => (
            <div key={type} className="legend-item">
              <div 
                className="color-box" 
                style={{ backgroundColor: color }}
              />
              <span className="legend-text">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffLegend;
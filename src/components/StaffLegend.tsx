import React from 'react';
import { StaffMember, EventTypeConfig } from '../types/scheduler';

interface StaffLegendProps {
  staffMembers?: StaffMember[];
  eventTypeColors?: EventTypeConfig;
  showStaff?: boolean;
  showEventTypes?: boolean;
}

const StaffLegend: React.FC<StaffLegendProps> = ({ 
  staffMembers = [], 
  eventTypeColors = {},
  showStaff = true,
  showEventTypes = true
}) => {

  return (
    <div className="staff-legend">
      {showStaff && staffMembers.length > 0 && (
        <div className="legend-section">
          <h3>Staff Colors</h3>
          <div className="legend-items">
            {staffMembers.map(staff => (
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
      )}
      
      {showEventTypes && Object.keys(eventTypeColors).length > 0 && (
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
      )}
    </div>
  );
};

export default StaffLegend;
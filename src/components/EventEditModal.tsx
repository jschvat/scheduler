import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SchedulerEvent, StaffMember } from '../types/scheduler';
import CustomSelect from './CustomSelect';
import './EventEditModal.css';

interface EventEditModalProps {
  event: SchedulerEvent;
  staffMembers: StaffMember[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: SchedulerEvent) => void;
}

const EventEditModal: React.FC<EventEditModalProps> = ({
  event,
  staffMembers,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: event.title,
    type: event.type,
    staffId: event.staffId || '',
    startDate: event.startDate.toISOString().slice(0, 16), // Format for datetime-local input
    endDate: event.endDate.toISOString().slice(0, 16),
    allDay: event.allDay || false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      // Reset form data when modal opens
      setFormData({
        title: event.title,
        type: event.type,
        staffId: event.staffId || '',
        startDate: event.startDate.toISOString().slice(0, 16),
        endDate: event.endDate.toISOString().slice(0, 16),
        allDay: event.allDay || false
      });
      setErrors({});
    }
  }, [isOpen, event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate >= endDate) {
      newErrors.endDate = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedEvent: SchedulerEvent = {
      ...event,
      title: formData.title.trim(),
      type: formData.type as SchedulerEvent['type'],
      staffId: formData.staffId || undefined,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      allDay: formData.allDay
    };

    onSave(updatedEvent);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="event-edit-modal">
        <div className="modal-header">
          <h2>Edit Event</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? 'error' : ''}
              placeholder="Event title"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <CustomSelect
              options={[
                { value: "shift", label: "Shift" },
                { value: "break", label: "Break" },
                { value: "consultation", label: "Consultation" },
                { value: "inventory", label: "Inventory" },
                { value: "training", label: "Training" },
                { value: "meeting", label: "Meeting" }
              ]}
              value={formData.type}
              onChange={handleSelectChange('type')}
              placeholder="Select event type"
            />
          </div>

          <div className="form-group">
            <label htmlFor="staffId">Assigned Staff</label>
            <CustomSelect
              options={[
                { value: "", label: "No assignment" },
                ...staffMembers.map(staff => ({
                  value: staff.id,
                  label: `${staff.name} - ${staff.role}`
                }))
              ]}
              value={formData.staffId}
              onChange={handleSelectChange('staffId')}
              placeholder="Select staff member"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Time *</label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Time *</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <span className="error-text">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="allDay"
                checked={formData.allDay}
                onChange={handleInputChange}
              />
              All Day Event
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EventEditModal;
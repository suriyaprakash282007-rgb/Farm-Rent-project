import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay } from 'date-fns';
import './AvailabilityCalendar.css';

const AvailabilityCalendar = ({ availability = [], onUpdate, readOnly = false }) => {
  const [value, setValue] = useState(new Date());

  const availableDates = availability
    .filter((a) => a.isAvailable)
    .map((a) => new Date(a.date));

  const unavailableDates = availability
    .filter((a) => !a.isAvailable)
    .map((a) => new Date(a.date));

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    if (availableDates.some((d) => isSameDay(d, date))) return 'available-day';
    if (unavailableDates.some((d) => isSameDay(d, date))) return 'unavailable-day';
    return null;
  };

  const handleDayClick = (date) => {
    if (readOnly) return;
    const existing = availability.find((a) => isSameDay(new Date(a.date), date));

    let updated;
    if (!existing) {
      // Mark as available
      updated = [...availability, { date: date.toISOString(), isAvailable: true }];
    } else if (existing.isAvailable) {
      // Toggle to unavailable
      updated = availability.map((a) =>
        isSameDay(new Date(a.date), date) ? { ...a, isAvailable: false } : a
      );
    } else {
      // Remove entry
      updated = availability.filter((a) => !isSameDay(new Date(a.date), date));
    }

    onUpdate && onUpdate(updated);
  };

  return (
    <div className="availability-calendar">
      <Calendar
        value={value}
        onChange={setValue}
        onClickDay={handleDayClick}
        tileClassName={tileClassName}
        minDate={readOnly ? undefined : new Date()}
      />
      <div className="calendar-legend">
        <span className="legend-item">
          <span className="dot available" /> Available
        </span>
        <span className="legend-item">
          <span className="dot unavailable" /> Booked / Unavailable
        </span>
        <span className="legend-item">
          <span className="dot default" /> Not set
        </span>
      </div>
      {!readOnly && (
        <p className="calendar-hint">
          Click a date to toggle availability. Green = available, Red = unavailable.
        </p>
      )}
    </div>
  );
};

export default AvailabilityCalendar;

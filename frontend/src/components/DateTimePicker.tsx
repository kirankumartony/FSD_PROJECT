import { useState, type FC } from 'react';
import '../styles/DateTimePicker.css';

interface DateTimePickerProps {
  onSelect: (dateTime: string | undefined) => void;
  defaultValue?: string;
}

export const DateTimePicker: FC<DateTimePickerProps> = ({ onSelect, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<string>(defaultValue || '');

  const handleDateTimeChange = (value: string) => {
    setSelectedDateTime(value);
    onSelect(value || undefined);
  };

  const handleClear = () => {
    setSelectedDateTime('');
    onSelect(undefined);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateTimeStr: string): string => {
    if (!dateTimeStr) return 'Set due date';

    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMinDateTime = (): string => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="date-time-picker-wrapper">
      <button
        type="button"
        className={`date-time-trigger ${selectedDateTime ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Set due date and time"
      >
        📅 {formatDisplayDate(selectedDateTime)}
      </button>

      {isOpen && (
        <div className="date-time-picker-popup">
          <div className="picker-header">
            <h4>Set Due Date & Time</h4>
            <button
              type="button"
              className="close-picker"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="picker-body">
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => handleDateTimeChange(e.target.value)}
              min={getMinDateTime()}
              className="date-time-input"
            />

            <div className="quick-options">
              <button
                type="button"
                className="quick-btn"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(9, 0, 0, 0);
                  handleDateTimeChange(tomorrow.toISOString().slice(0, 16));
                }}
              >
                Tomorrow 9am
              </button>
              <button
                type="button"
                className="quick-btn"
                onClick={() => {
                  const today = new Date();
                  today.setHours(17, 0, 0, 0);
                  handleDateTimeChange(today.toISOString().slice(0, 16));
                }}
              >
                Today 5pm
              </button>
              <button
                type="button"
                className="quick-btn"
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  nextWeek.setHours(9, 0, 0, 0);
                  handleDateTimeChange(nextWeek.toISOString().slice(0, 16));
                }}
              >
                Next Week
              </button>
            </div>
          </div>

          <div className="picker-footer">
            <button
              type="button"
              className="btn-clear"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn-done"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

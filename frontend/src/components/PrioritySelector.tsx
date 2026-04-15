import type { FC } from 'react';
import type { Priority } from '../types';
import '../styles/PrioritySelector.css';

interface PrioritySelectorProps {
  selectedPriority?: Priority;
  onSelect: (priority: Priority) => void;
}

export const PrioritySelector: FC<PrioritySelectorProps> = ({ selectedPriority, onSelect }) => {
  const priorities: Array<{ value: Priority; label: string; icon: string; color: string }> = [
    { value: 'low', label: 'Low', icon: '🟢', color: '#2ed573' },
    { value: 'medium', label: 'Medium', icon: '🟡', color: '#ffa502' },
    { value: 'high', label: 'High', icon: '🔴', color: '#ff4757' },
  ];

  return (
    <div className="priority-selector">
      <label className="priority-label">Priority</label>
      <div className="priority-options">
        {priorities.map((priority) => (
          <button
            key={priority.value}
            type="button"
            className={`priority-btn ${selectedPriority === priority.value ? 'selected' : ''}`}
            onClick={() => onSelect(priority.value)}
            style={{
              borderColor: selectedPriority === priority.value ? priority.color : '#e0e0e0',
              backgroundColor:
                selectedPriority === priority.value ? `${priority.color}15` : 'white',
            }}
            title={`Set priority to ${priority.label}`}
          >
            <span className="priority-icon">{priority.icon}</span>
            <span className="priority-name">{priority.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

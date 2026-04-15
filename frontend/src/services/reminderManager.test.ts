import { NotificationService } from './notificationService';
import { reminderManager } from './reminderManager';

describe('reminderManager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-14T10:00:00.000Z'));
    reminderManager.clearAllReminders();
  });

  afterEach(() => {
    reminderManager.clearAllReminders();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('schedules reminders and notifies when the timer elapses', () => {
    const showTaskReminderSpy = jest
      .spyOn(NotificationService, 'showTaskReminder')
      .mockReturnValue(null);

    reminderManager.setupReminder(
      {
        id: 'todo-1',
        title: 'Prepare standup notes',
        dueDate: '2026-04-14T10:20:00.000Z',
        priority: 'high',
      },
      15
    );

    jest.advanceTimersByTime(5 * 60 * 1000);

    expect(showTaskReminderSpy).toHaveBeenCalledWith(
      'Prepare standup notes',
      expect.any(String),
      'high'
    );
  });

  it('returns priority-specific reminder windows', () => {
    expect(reminderManager.getPriorityReminderMinutes('high')).toBe(30);
    expect(reminderManager.getPriorityReminderMinutes('medium')).toBe(15);
    expect(reminderManager.getPriorityReminderMinutes('low')).toBe(5);
    expect(reminderManager.getPriorityReminderMinutes()).toBe(15);
  });
});

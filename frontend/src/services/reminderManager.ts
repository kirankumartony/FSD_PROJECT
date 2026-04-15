import type { Priority, ReminderTodo } from '../types';
import { NotificationService } from './notificationService';

export class ReminderManager {
  private reminders: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private reminderTimes = [
    { label: 'At time of task', minutes: 0 },
    { label: '5 minutes before', minutes: 5 },
    { label: '15 minutes before', minutes: 15 },
    { label: '30 minutes before', minutes: 30 },
    { label: '1 hour before', minutes: 60 },
    { label: '1 day before', minutes: 1440 },
  ];

  /**
   * Set up reminders for a todo
   */
  setupReminder(todo: ReminderTodo, reminderMinutesBefore: number = 15): void {
    if (!todo.dueDate) return;

    const dueDate = new Date(todo.dueDate);
    const now = new Date();
    const reminderTime = new Date(dueDate.getTime() - reminderMinutesBefore * 60000);

    if (reminderTime <= now) {
      // Show reminder immediately if it's in the past
      this.showReminder(todo);
      return;
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      this.showReminder(todo);
    }, timeUntilReminder);

    this.reminders.set(todo.id, timeoutId);
  }

  /**
   * Show reminder notification
   */
  private showReminder(todo: ReminderTodo): void {
    const dueDate = new Date(todo.dueDate!);
    const dueTime = dueDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    NotificationService.showTaskReminder(todo.title, dueTime, todo.priority || 'medium');
  }

  /**
   * Clear reminder for a todo
   */
  clearReminder(todoId: string): void {
    const timeoutId = this.reminders.get(todoId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.reminders.delete(todoId);
    }
  }

  /**
   * Clear all reminders
   */
  clearAllReminders(): void {
    this.reminders.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.reminders.clear();
  }

  /**
   * Get reminder time options
   */
  getReminderTimeOptions(): Array<{ label: string; minutes: number }> {
    return this.reminderTimes;
  }

  /**
   * Get time remaining until due date
   */
  getTimeRemaining(dueDate: string): {
    text: string;
    status: 'overdue' | 'due-soon' | 'upcoming';
  } {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff < 0) {
      const overdueDays = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
      return {
        text: `Overdue by ${overdueDays}d`,
        status: 'overdue',
      };
    }

    if (diff < 60 * 60 * 1000) {
      // Less than 1 hour
      const minutes = Math.floor(diff / (1000 * 60));
      return {
        text: `Due in ${minutes}m`,
        status: 'due-soon',
      };
    }

    if (diff < 24 * 60 * 60 * 1000) {
      // Less than 1 day
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return {
        text: `Due in ${hours}h`,
        status: 'due-soon',
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return {
      text: `Due in ${days}d`,
      status: 'upcoming',
    };
  }

  /**
   * Format date for display
   */
  formatDueDate(dueDate: string): string {
    const date = new Date(dueDate);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  /**
   * Get priority-based reminders
   */
  getPriorityReminderMinutes(priority?: Priority): number {
    switch (priority) {
      case 'high':
        return 30; // 30 min before
      case 'medium':
        return 15; // 15 min before
      case 'low':
        return 5; // 5 min before
      default:
        return 15;
    }
  }
}

export const reminderManager = new ReminderManager();

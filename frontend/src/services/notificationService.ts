export class NotificationService {
  /**
   * Request notification permission from user
   */
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Show browser notification
   */
  static showNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return null;
    }

    if (Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '📋',
        ...options,
      });
    }

    return null;
  }

  /**
   * Show task reminder notification
   */
  static showTaskReminder(
    taskTitle: string,
    dueTime: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Notification | null {
    const priorityIcons: Record<string, string> = {
      high: '🔴',
      medium: '🟡',
      low: '🟢',
    };

    const icon = priorityIcons[priority] || '📋';

    return this.showNotification(`${icon} Task Reminder`, {
      body: `${taskTitle}\nDue: ${dueTime}`,
      tag: `reminder-${taskTitle}`,
      requireInteraction: priority === 'high',
    });
  }

  /**
   * Show deadline warning
   */
  static showDeadlineWarning(taskTitle: string, timeRemaining: string): Notification | null {
    return this.showNotification('⚠️ Deadline Alert', {
      body: `${taskTitle}\n${timeRemaining}`,
      tag: 'deadline-warning',
      requireInteraction: true,
    });
  }

  /**
   * Show completion congratulation
   */
  static showCompletionCongrats(taskTitle: string): Notification | null {
    return this.showNotification('🎉 Great Job!', {
      body: `You completed: ${taskTitle}`,
      tag: 'completion',
    });
  }

  /**
   * Get permission status
   */
  static getPermissionStatus(): NotificationPermission | null {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return null;
  }

  /**
   * Check if notifications are supported
   */
  static isSupported(): boolean {
    return 'Notification' in window;
  }
}

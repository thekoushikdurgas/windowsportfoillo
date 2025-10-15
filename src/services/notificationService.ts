/**
 * Notification Service - Easy API for showing notifications
 */

import useNotificationStore, { notificationTemplates, Notification } from '@/store/notificationStore';
import { audioSystem } from '@/utils/audioSystem';

type NotificationOptions = Partial<Omit<Notification, 'id' | 'timestamp' | 'read' | 'title' | 'message' | 'type' | 'appName'>>;

class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Quick notification methods
  public success(title: string, message: string, appName: string = 'System', options?: NotificationOptions) {
    const id = useNotificationStore.getState().addNotification({
      title,
      message,
      type: 'success',
      appName,
      icon: '✅',
      ...options,
    });
    
    // Play notification sound
    audioSystem.playNotification('success');
    
    return id;
  }

  public error(title: string, message: string, appName: string = 'System', options?: NotificationOptions) {
    const id = useNotificationStore.getState().addNotification({
      title,
      message,
      type: 'error',
      appName,
      icon: '❌',
      persistent: true,
      ...options,
    });
    
    // Play notification sound
    audioSystem.playNotification('error');
    
    return id;
  }

  public warning(title: string, message: string, appName: string = 'System', options?: NotificationOptions) {
    const id = useNotificationStore.getState().addNotification({
      title,
      message,
      type: 'warning',
      appName,
      icon: '⚠️',
      persistent: true,
      ...options,
    });
    
    // Play notification sound
    audioSystem.playNotification('warning');
    
    return id;
  }

  public info(title: string, message: string, appName: string = 'System', options?: NotificationOptions) {
    const id = useNotificationStore.getState().addNotification({
      title,
      message,
      type: 'info',
      appName,
      icon: 'ℹ️',
      ...options,
    });
    
    // Play notification sound
    audioSystem.playNotification('default');
    
    return id;
  }

  // System notifications
  public systemBootComplete() {
    const template = notificationTemplates.system.bootComplete();
    return useNotificationStore.getState().addNotification(template);
  }

  public systemLowBattery() {
    const template = notificationTemplates.system.lowBattery();
    return useNotificationStore.getState().addNotification(template);
  }

  public systemWifiConnected(networkName: string) {
    const template = notificationTemplates.system.wifiConnected(networkName);
    return useNotificationStore.getState().addNotification(template);
  }

  public systemUpdateAvailable() {
    const template = notificationTemplates.system.updateAvailable();
    return useNotificationStore.getState().addNotification(template);
  }

  // App-specific notifications
  public calculatorError() {
    const template = notificationTemplates.apps.calculator.error();
    return useNotificationStore.getState().addNotification(template);
  }

  public fileExplorerCopyComplete(fileName: string) {
    const template = notificationTemplates.apps.fileExplorer.copyComplete(fileName);
    return useNotificationStore.getState().addNotification(template);
  }

  public fileExplorerDeleteConfirm(fileName: string) {
    const template = notificationTemplates.apps.fileExplorer.deleteConfirm(fileName);
    return useNotificationStore.getState().addNotification(template);
  }

  public settingsChanged(settingName: string) {
    const template = notificationTemplates.apps.settings.settingChanged(settingName);
    return useNotificationStore.getState().addNotification(template);
  }

  // Progress notifications
  public showProgress(title: string, message: string, current: number, total: number, appName: string = 'System') {
    const notificationId = this.info(title, message, appName, {
      progress: {
        current,
        total,
        label: 'Progress',
      },
      persistent: true,
    });

    return {
      update: (newCurrent: number, newTotal?: number) => {
        useNotificationStore.getState().updateNotification(notificationId, {
          progress: {
            current: newCurrent,
            total: newTotal || total,
            label: 'Progress',
          },
        });
      },
      complete: (successMessage: string = 'Complete!') => {
        useNotificationStore.getState().updateNotification(notificationId, {
          message: successMessage,
          type: 'success',
          progress: undefined,
          persistent: false,
        });
        // Auto-dismiss after completion
        setTimeout(() => {
          useNotificationStore.getState().removeNotification(notificationId);
        }, 3000);
      },
      error: (errorMessage: string = 'Failed!') => {
        useNotificationStore.getState().updateNotification(notificationId, {
          message: errorMessage,
          type: 'error',
          progress: undefined,
          persistent: false,
        });
        // Auto-dismiss after error
        setTimeout(() => {
          useNotificationStore.getState().removeNotification(notificationId);
        }, 5000);
      },
      dismiss: () => {
        useNotificationStore.getState().removeNotification(notificationId);
      },
    };
  }

  // Toast notifications (auto-dismiss)
  public toast(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', appName: string = 'System') {
    return useNotificationStore.getState().showToast({
      title,
      message,
      type,
      appName,
      icon: type === 'success' ? '✅' : 
           type === 'warning' ? '⚠️' : 
           type === 'error' ? '❌' : 'ℹ️',
    });
  }

  // Notification with actions
  public withActions(
    title: string, 
    message: string, 
    actions: Array<{ label: string; action: () => void }>,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    appName: string = 'System'
  ) {
    return useNotificationStore.getState().addNotification({
      title,
      message,
      type,
      appName,
      icon: type === 'success' ? '✅' : 
           type === 'warning' ? '⚠️' : 
           type === 'error' ? '❌' : 'ℹ️',
      actions,
      persistent: true,
    });
  }

  // Bulk operations
  public clearAll() {
    useNotificationStore.getState().clearAll();
  }

  public markAllAsRead() {
    useNotificationStore.getState().markAllAsRead();
  }

  // Focus Assist integration
  public setFocusAssist(mode: 'off' | 'priority' | 'alarms' | 'off') {
    useNotificationStore.getState().setFocusAssist(mode);
  }

  public isFocusAssistOn(): boolean {
    const state = useNotificationStore.getState();
    return state.focusAssist !== 'off';
  }

  // Quiet Hours integration
  public setQuietHours(enabled: boolean, start: string, end: string) {
    useNotificationStore.getState().setQuietHours({ enabled, start, end });
  }

  public isQuietHours(): boolean {
    const { quietHours } = useNotificationStore.getState();
    if (!quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = this.timeToMinutes(quietHours.start);
    const endTime = this.timeToMinutes(quietHours.end);

    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight quiet hours
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Smart notification filtering
  public shouldShowNotification(priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'): boolean {
    if (this.isQuietHours()) {
      return priority === 'urgent';
    }

    if (this.isFocusAssistOn()) {
      return priority === 'high' || priority === 'urgent';
    }

    return true;
  }

  // Smart notification method that respects focus assist and quiet hours
  public smartNotify(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal',
    appName: string = 'System'
  ) {
    if (!this.shouldShowNotification(priority)) {
      // Still add to notification center but don't show toast
      return useNotificationStore.getState().addNotification({
        title,
        message,
        type,
        appName,
        priority,
        icon: type === 'success' ? '✅' : 
             type === 'warning' ? '⚠️' : 
             type === 'error' ? '❌' : 'ℹ️',
        persistent: false,
      });
    }

    // Show normal notification with toast
    return useNotificationStore.getState().addNotification({
      title,
      message,
      type,
      appName,
      priority,
      icon: type === 'success' ? '✅' : 
           type === 'warning' ? '⚠️' : 
           type === 'error' ? '❌' : 'ℹ️',
    });
  }
}

// Export singleton instance
export const notifications = NotificationService.getInstance();

// Export for easy importing
export default notifications;

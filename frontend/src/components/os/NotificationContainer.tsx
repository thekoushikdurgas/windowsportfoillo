'use client';

import React from 'react';
import { useNotification } from '@/context/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification, snoozeNotification } = useNotification();

  return (
    <div className="notification-container">
       <div className="notification-container-list"> 
          {notifications.map(n => (
              <NotificationToast 
                key={n.id} 
                notification={n} 
                onClose={removeNotification} 
                onSnooze={snoozeNotification}
              />
          ))}
       </div>
    </div>
  );
};

export default NotificationContainer;


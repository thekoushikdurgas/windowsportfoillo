import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification, snoozeNotification } = useNotification();

  return (
    <div className="absolute bottom-12 right-0 z-[9999] p-4 flex flex-col items-end pointer-events-none overflow-hidden max-h-[calc(100vh-60px)]">
       {/* Stack from bottom */}
       <div className="flex flex-col-reverse pointer-events-auto gap-2"> 
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

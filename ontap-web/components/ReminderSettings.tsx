import { useState, useEffect } from 'react';
import { scheduleLocalReminder } from '../utils/reminder';

export const ReminderSettings: React.FC = () => {
  const [reminderTime, setReminderTime] = useState(
    localStorage.getItem('reminderTime') || '19:00'
  );

  const saveReminder = (time: string) => scheduleLocalReminder(time, setReminderTime);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-4 mb-4">
      <h3 className="font-bold mb-2">Cài đặt giờ nhắc học</h3>
      <label className="mr-2">Giờ nhắc học mỗi ngày</label>
      <input
        type="time"
        value={reminderTime}
        onChange={(e) => saveReminder(e.target.value)}
        className="border p-1 rounded"
      />
    </div>
  );
};

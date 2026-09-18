let activeTimer: ReturnType<typeof setTimeout> | null = null;

export const scheduleLocalReminder = (time: string, onSaved: (t: string) => void) => {
  localStorage.setItem('reminderTime', time);
  onSaved(time);

  if (activeTimer) clearTimeout(activeTimer);

  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delta = target.getTime() - now.getTime();

  activeTimer = setTimeout(function fire() {
    if (Notification.permission === 'granted') {
      new Notification('Nhắc nhở học tập 📚', {
        body: 'Đến giờ ôn thi rồi bạn ơi!'
      });
    }
    scheduleLocalReminder(time, () => {});
  }, delta);
};

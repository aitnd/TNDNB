import { useState, useEffect } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true khi đã hết thời gian đếm ngược */
  isOver: boolean;
  /** true khi targetDate hợp lệ và hook đang hoạt động */
  isActive: boolean;
}

/**
 * Hook đếm ngược thời gian từ hiện tại đến thời điểm mục tiêu.
 * Cập nhật mỗi giây, tự cleanup khi unmount hoặc hết giờ.
 * 
 * @param targetDateString - Chuỗi ISO 8601 (ví dụ: "2026-06-29T15:00:00+07:00")
 *                           Nếu undefined/null/không parse được → trả về isActive=false
 */
const useCountdown = (targetDateString?: string): CountdownResult => {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
    isActive: false,
  });

  useEffect(() => {
    // Không có target → không kích hoạt
    if (!targetDateString) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false, isActive: false });
      return;
    }

    const targetDate = new Date(targetDateString).getTime();

    // Không parse được → không kích hoạt
    if (isNaN(targetDate)) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false, isActive: false });
      return;
    }

    // Hàm tính toán khoảng chênh lệch
    const calculate = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true, isActive: true });
        return true; // Đã hết giờ → dừng interval
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isOver: false,
        isActive: true,
      });
      return false; // Chưa hết → tiếp tục
    };

    // Tính ngay lần đầu
    const isAlreadyOver = calculate();
    if (isAlreadyOver) return;

    // Cập nhật mỗi giây
    const interval = setInterval(() => {
      const over = calculate();
      if (over) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateString]);

  return timeLeft;
};

export default useCountdown;

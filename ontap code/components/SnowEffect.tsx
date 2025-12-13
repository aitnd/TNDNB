import React from 'react';

const SnowEffect: React.FC = () => {
  // Danh sách các icon ảnh thực tế có trong thư mục assets
  const fallingIcons = [
    'gift1.png', 
    'bell.png', 
    'star-gold.png', 
    'ball.png',
    'gift2.png',
    'gift3.png',
    'gift4.png',
    'gift5.png'
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* === PHẦN 5: HIỆU ỨNG TUYẾT & QUÀ RƠI === */
        .snowflakes {
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 9999;
        }
        
        .snowflake {
            color: #fff;
            font-size: 1.2em;
            font-family: Arial, sans-serif;
            text-shadow: 0 0 3px rgba(255,255,255,0.8); /* Tuyết phát sáng nhẹ */
            position: fixed;
            top: -10%;
            z-index: 9999;
            user-select: none;
            cursor: default;
            animation-name: snowflakes-fall, snowflakes-shake;
            animation-timing-function: linear, ease-in-out;
            animation-iteration-count: infinite, infinite;
            animation-play-state: running, running;
        }

        .snowflake-img img {
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
            width: 30px; 
            height: auto;
            opacity: 0.9;
        }

        @keyframes snowflakes-fall {
            0% { top: -10%; }
            100% { top: 100%; }
        }
        @keyframes snowflakes-shake {
            0% { transform: translateX(0px) rotate(0deg); }
            50% { transform: translateX(80px) rotate(180deg); }
            100% { transform: translateX(0px) rotate(360deg); }
        }

        /* Cấu hình rơi ngẫu nhiên */
        .snowflake:nth-of-type(1) { left: 1%; animation-duration: 12s, 4s; animation-delay: 0s, 0s; }
        .snowflake:nth-of-type(2) { left: 5%; animation-duration: 15s, 6s; animation-delay: 1s, 1s; }
        .snowflake:nth-of-type(3) { left: 10%; animation-duration: 10s, 3s; animation-delay: 2s, 0.5s; }
        .snowflake:nth-of-type(4) { left: 15%; animation-duration: 18s, 5s; animation-delay: 4s, 2s; }
        .snowflake:nth-of-type(5) { left: 20%; animation-duration: 11s, 4s; animation-delay: 2s, 2s; }
        .snowflake:nth-of-type(6) { left: 25%; animation-duration: 14s, 7s; animation-delay: 6s, 3s; }
        .snowflake:nth-of-type(7) { left: 30%; animation-duration: 16s, 5s; animation-delay: 3s, 2s; }
        .snowflake:nth-of-type(8) { left: 35%; animation-duration: 13s, 4s; animation-delay: 1s, 1s; }
        .snowflake:nth-of-type(9) { left: 40%; animation-duration: 17s, 6s; animation-delay: 0s, 0s; }
        .snowflake:nth-of-type(10) { left: 45%; animation-duration: 9s, 3s; animation-delay: 5s, 1.5s; }
        .snowflake:nth-of-type(11) { left: 50%; animation-duration: 14s, 5s; animation-delay: 2s, 3s; }
        .snowflake:nth-of-type(12) { left: 55%; animation-duration: 11s, 4s; animation-delay: 4s, 1s; }
        .snowflake:nth-of-type(13) { left: 60%; animation-duration: 19s, 7s; animation-delay: 1s, 2s; }
        .snowflake:nth-of-type(14) { left: 65%; animation-duration: 12s, 3s; animation-delay: 3s, 0s; }
        .snowflake:nth-of-type(15) { left: 70%; animation-duration: 15s, 6s; animation-delay: 5s, 4s; }
        .snowflake:nth-of-type(16) { left: 75%; animation-duration: 10s, 4s; animation-delay: 0s, 2s; }
        .snowflake:nth-of-type(17) { left: 80%; animation-duration: 16s, 5s; animation-delay: 2s, 1s; }
        .snowflake:nth-of-type(18) { left: 85%; animation-duration: 13s, 4s; animation-delay: 4s, 3s; }
        .snowflake:nth-of-type(19) { left: 90%; animation-duration: 18s, 6s; animation-delay: 1s, 2s; }
        .snowflake:nth-of-type(20) { left: 95%; animation-duration: 11s, 3s; animation-delay: 3s, 0s; }
        
        .snowflake:nth-of-type(21) { left: 2%; animation-duration: 13s, 5s; animation-delay: 5s, 1s; }
        .snowflake:nth-of-type(22) { left: 8%; animation-duration: 10s, 3s; animation-delay: 2s, 4s; }
        .snowflake:nth-of-type(23) { left: 12%; animation-duration: 16s, 6s; animation-delay: 1s, 2s; }
        .snowflake:nth-of-type(24) { left: 18%; animation-duration: 12s, 4s; animation-delay: 6s, 0s; }
        .snowflake:nth-of-type(25) { left: 22%; animation-duration: 14s, 5s; animation-delay: 0s, 3s; }
        .snowflake:nth-of-type(26) { left: 28%; animation-duration: 11s, 3s; animation-delay: 4s, 2s; }
        .snowflake:nth-of-type(27) { left: 32%; animation-duration: 19s, 7s; animation-delay: 2s, 1s; }
        .snowflake:nth-of-type(28) { left: 38%; animation-duration: 15s, 6s; animation-delay: 5s, 5s; }
        .snowflake:nth-of-type(29) { left: 42%; animation-duration: 12s, 4s; animation-delay: 1s, 0s; }
        .snowflake:nth-of-type(30) { left: 48%; animation-duration: 17s, 5s; animation-delay: 3s, 2s; }
        .snowflake:nth-of-type(31) { left: 52%; animation-duration: 9s, 3s; animation-delay: 0s, 3s; }
        .snowflake:nth-of-type(32) { left: 58%; animation-duration: 14s, 6s; animation-delay: 4s, 1s; }
        .snowflake:nth-of-type(33) { left: 62%; animation-duration: 11s, 4s; animation-delay: 2s, 4s; }
        .snowflake:nth-of-type(34) { left: 68%; animation-duration: 16s, 5s; animation-delay: 6s, 0s; }
        .snowflake:nth-of-type(35) { left: 72%; animation-duration: 13s, 3s; animation-delay: 1s, 2s; }
        .snowflake:nth-of-type(36) { left: 78%; animation-duration: 18s, 7s; animation-delay: 5s, 1s; }
        .snowflake:nth-of-type(37) { left: 82%; animation-duration: 10s, 4s; animation-delay: 2s, 3s; }
        .snowflake:nth-of-type(38) { left: 88%; animation-duration: 15s, 6s; animation-delay: 4s, 0s; }
        .snowflake:nth-of-type(39) { left: 92%; animation-duration: 12s, 5s; animation-delay: 0s, 2s; }
        .snowflake:nth-of-type(40) { left: 98%; animation-duration: 17s, 4s; animation-delay: 3s, 5s; }

        .snowflake:nth-child(odd) { animation-direction: normal; }
        .snowflake:nth-child(even) { animation-direction: alternate; }

        @media (max-width: 768px) {
            .snowflake { font-size: 1em; }
            .snowflake-img img { width: 20px; }
        }
      `}} />

      {/* ❄️ HIỆU ỨNG TUYẾT & QUÀ RƠI DÀY ĐẶC ❄️ */}
      <div className="snowflakes" aria-hidden="true">
        {/* Bông tuyết trắng (100 bông) */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={`snow-${i}`} className="snowflake">
            {['❅', '❆', '❄'][i % 3]} {/* Chọn ngẫu nhiên ký tự tuyết */}
          </div>
        ))}

        {/* Ảnh quả châu và kẹo rơi cùng (8 hình ảnh) */}
        {Array.from({ length: 8 }).map((_, i) => {
          // Lấy icon từ danh sách có sẵn trong assets
          const iconName = fallingIcons[i % fallingIcons.length];
          return (
            <div key={`img-${i}`} className="snowflake snowflake-img">
              <img 
                src={`/assets/img/${iconName}`} 
                alt="" 
                style={{ width: '25px', height: 'auto' }} 
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SnowEffect;

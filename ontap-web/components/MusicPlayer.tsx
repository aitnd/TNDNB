import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Tự động phát nhạc khi component được mount
    const playMusic = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.05; // Âm lượng 5/100
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Trình duyệt chặn tự động phát nhạc, người dùng cần tương tác thủ công:", err);
          setIsPlaying(false);
        }
      }
    };

    // playMusic();
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Không thể phát nhạc:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-bounce-slow">
      <audio ref={audioRef} src="/music/jingle-bells.mp3" loop />
      <button
        onClick={toggleMusic}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full border-2 border-white shadow-lg transition-all duration-300 overflow-hidden
          ${isPlaying ? 'bg-red-600 hover:bg-red-700 animate-spin-slow' : 'bg-gray-600 hover:bg-gray-700'}
        `}
        title={isPlaying ? "Tắt nhạc Giáng sinh" : "Bật nhạc Giáng sinh"}
      >
        {isPlaying ? (
          <img src="/assets/img/bell.png" alt="Playing" className="w-8 h-8 object-contain" />
        ) : (
          <img src="/assets/img/MusicPlayer.png" alt="Muted" className="w-8 h-8 object-contain opacity-50 grayscale" />
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
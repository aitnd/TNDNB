'use client'

import { useState, useRef, useEffect } from 'react'
import { FaMusic, FaVolumeMute } from 'react-icons/fa'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioUrl = '/music/jingle-bells.mp3'
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // 🔥 Cố gắng phát nhạc ngay khi load trang
    // const attemptPlay = async () => {
    //   if (audioRef.current) {
    //     try {
    //       audioRef.current.volume = 0.05
    //       // Trình duyệt có thể chặn dòng này nếu người dùng chưa tương tác
    //       // await audioRef.current.play()
    //       // setIsPlaying(true)
    //     } catch (err) {
    //       console.log('Autoplay bị chặn bởi trình duyệt (cần tương tác người dùng).')
    //       setIsPlaying(false) // Nếu bị chặn thì hiển thị icon tắt tiếng
    //     }
    //   }
    // }
    // attemptPlay()
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.volume = 0.05 // Set volume when playing manually
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      {/* 🔥 Thêm autoPlay loop để tăng khả năng tự phát */}
      <audio ref={audioRef} src={audioUrl} loop />

      <button
        onClick={togglePlay}
        style={{
          backgroundColor: 'var(--mau-chinh)',
          color: 'white',
          border: '2px solid white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(218, 37, 53, 0.6)',
          animation: isPlaying ? 'spin 3s linear infinite' : 'none',
          fontSize: '1.2rem'
        }}
        title={isPlaying ? "Tắt nhạc Noel" : "Bật nhạc Noel"}
      >
        {isPlaying ? <FaMusic /> : <FaVolumeMute />}
      </button>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
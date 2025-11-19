// 💖 1. BIẾN THÀNH CLIENT COMPONENT 💖
'use client'

import React, { useState, useRef } from 'react'
import styles from './page.module.css' 

// 💖 2. DANH SÁCH GAME 💖
const gamesList = [
  // --- Game NES ---
  { 
    name: 'Contra', 
    file: '/games/index.html?game=contra.nes', 
    type: 'html5', 
  },
  { 
    name: 'Tank 1990', 
    file: '/games/index.html?game=tank1990.nes', 
    type: 'html5', 
  },
  { 
    name: 'Bomberman', 
    file: '/games/index.html?game=bomberman.nes', 
    type: 'html5', 
  },
  { 
    name: 'Super Mario Bros', 
    file: '/games/index.html?game=super-mario.nes', 
    type: 'html5', 
  },
  { 
    name: 'Ninja Rùa', 
    file: '/games/index.html?game=ninja-turtles.nes', 
    type: 'html5', 
  },
  { 
    name: 'Mario (Cổ điển)', 
    file: '/games/index.html?game=mario.nes', 
    type: 'html5', 
  },

  // --- Game HTML5 ---
  {
    name: 'Mario (HTML5 Bản đẹp)',
    file: '/mario-html5/index.html', 
    type: 'html5', 
  },
  { 
    name: 'Piece of Cake',
    file: 'https://www.crazygames.com/embed/piece-of-cake-merge-and-bake', 
    type: 'html5',
  },
  { 
    name: 'EverWing', 
    file: 'https://fb.gg/play/364648672526634', 
    type: 'external', 
  },
];

type Game = typeof gamesList[0];

export default function GiaiTriPage() {

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const handleGoBack = () => {
    const iframe = document.getElementById('html5-game-iframe');
    if (iframe) iframe.remove();
    setSelectedGame(null); 
  }

  const handleSelectGame = (game: Game) => {
    if (game.type === 'external') {
      const width = 450;
      const height = 800;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);

      window.open(
        game.file,
        'FacebookGameWindow', 
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );
    } else {
      setSelectedGame(game);
    }
  }

  const handleFullScreen = () => {
    if (gameContainerRef.current) {
      if (gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current.requestFullscreen();
      } else if ((gameContainerRef.current as any).webkitRequestFullscreen) { 
        (gameContainerRef.current as any).webkitRequestFullscreen();
      } else if ((gameContainerRef.current as any).msRequestFullscreen) { 
        (gameContainerRef.current as any).msRequestFullscreen();
      }
    }
  }

  return (
    <div className={styles.container}>
      
      {!selectedGame && (
        <>
          <h1 className={styles.title}>Góc Giải Trí 🕹️</h1>
          <p style={{marginBottom: '1.5rem', fontSize: '1.1rem', color: '#333', textAlign: 'center'}}>
            Vé về tuổi thơ xin mời bạn chọn:
          </p>
          <div className={styles.gameList}>
            {gamesList.map((game) => (
              <button
                key={game.name}
                className={styles.gameButton}
                onClick={() => handleSelectGame(game)}
              >
                {game.type === 'external' ? `📱 ${game.name}` : `🎮 ${game.name}`}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedGame && (
        <>
          <h1 className={styles.title}>
            Đang chơi: {selectedGame.name}
          </h1>
          
          <div ref={gameContainerRef} className={styles.fullscreenContainer}>
            <div className={styles.iframeWrapper}>
              <iframe
                id="html5-game-iframe"
                src={selectedGame.file} 
                className={styles.iframeContent}
                title={selectedGame.name}
                
                // 💖 CẤP QUYỀN TỐI ĐA CHO GAME MOBILE 💖
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-orientation-lock allow-modals allow-top-navigation-by-user-activation"
                allowFullScreen={true}
                allow="autoplay; fullscreen; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; clipboard-read; clipboard-write"
              />
            </div>
          </div>

          <p style={{marginTop: '1rem', textAlign: 'center', fontStyle: 'italic', color: '#555'}}>
            Mẹo: Bấm nút Phóng to để chơi dễ hơn!
          </p>

          <div className={styles.actionBar}>
            <button onClick={handleGoBack} className={styles.backButton}>
              « Quay lại
            </button>

            <button onClick={handleFullScreen} className={styles.fullscreenButton}>
              ⛶ Phóng to toàn màn hình
            </button>
          </div>
        </>
      )}

    </div>
  )
}
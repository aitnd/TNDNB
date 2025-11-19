// 💖 1. BIẾN THÀNH CLIENT COMPONENT 💖
'use client'

import React, { useState, useRef } from 'react'
import styles from './page.module.css' 

// 💖 2. DANH SÁCH GAME FULL (ĐÃ CẬP NHẬT ẢNH CHO HTML5) 💖
const gamesList = [
  // === GAME NDS (Folder /games2/) ===
  { 
    name: 'Plants vs Zombies', 
    file: '/nds-player/index.html?game=PlantsvsZombies.nds', 
    image: '/games2/PlantsvsZombies.png', 
    tag: 'NDS',
    type: 'html5', 
  },
  { 
    name: 'Cờ Vua (Chess)', 
    file: '/nds-player/index.html?game=chess.nds', 
    image: '/games2/chess.png', 
    tag: 'NDS',
    type: 'html5', 
  },

  // === GAME NES (Folder /games/) ===
  { 
    name: 'Contra', 
    file: '/games/index.html?game=contra.nes', 
    image: '/games/contra.png', 
    tag: 'NES',
    type: 'html5', 
  },
  { 
    name: 'Tank 1990', 
    file: '/games/index.html?game=tank1990.nes', 
    image: '/games/tank1990.png', 
    tag: 'NES',
    type: 'html5', 
  },
  { 
    name: 'Bomberman', 
    file: '/games/index.html?game=bomberman.nes', 
    image: '/games/bomberman.png', 
    tag: 'NES',
    type: 'html5', 
  },
  { 
    name: 'Super Mario Bros', 
    file: '/games/index.html?game=super-mario.nes', 
    image: '/games/super-mario.png', 
    tag: 'NES',
    type: 'html5', 
  },
  { 
    name: 'Ninja Rùa', 
    file: '/games/index.html?game=ninja-turtles.nes', 
    image: '/games/ninja-turtles.png',
    tag: 'NES', 
    type: 'html5', 
  },
  { 
    name: 'Mario Cổ điển', 
    file: '/games/index.html?game=mario.nes', 
    image: '/games/mario.png',
    tag: 'NES',
    type: 'html5', 
  },

  // === GAME HTML5 KHÁC (CẬP NHẬT ẢNH) ===
  {
    name: 'Mario HTML5',
    file: '/mario-html5/index.html', 
    // 💖 ẢNH MỚI CỦA ANH 💖
    image: '/games/mariohtml5.png', 
    tag: 'HTML5',
    type: 'html5', 
  },
  { 
    name: 'Piece of Cake',
    file: 'https://www.crazygames.com/embed/piece-of-cake-merge-and-bake', 
    // 💖 ẢNH MỚI CỦA ANH 💖
    image: '/games/pieceofcake.png', 
    tag: 'HOT',
    type: 'html5', 
  },
  { 
    name: 'EverWing', 
    file: 'https://www.facebook.com/gaming/play/364648672526634/?source=www_games_home', 
    image: 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/305560846_473621724777470_7192078378846329845_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=LpT8eKqXW_QQ7kNvgHs4V_c&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=As7yBwG_xU7gGj6hXzXfWd_&oh=00_AYDq-1qXwBwXwXwXwXwXwXwXwXwXwXwXwXwXwXwXwXw&oe=67451234',
    tag: 'Facebook',
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
      
      {/* == MENU CHỌN GAME DẠNG THẺ == */}
      {!selectedGame && (
        <>
          <h1 className={styles.title}>Góc Giải Trí 🕹️</h1>
          <p style={{marginBottom: '2rem', fontSize: '1.1rem', color: '#555', textAlign: 'center'}}>
            Vé về tuổi thơ xin mời anh chọn:
          </p>
          
          <div className={styles.gameList}>
            {gamesList.map((game) => (
              <button
                key={game.name}
                className={styles.gameCard} 
                onClick={() => handleSelectGame(game)}
              >
                {/* Phần Ảnh */}
                <div className={styles.cardImageWrapper}>
                   <img 
                     src={game.image || '/on-tap.png'} 
                     alt={game.name} 
                     className={styles.cardImage}
                     loading="lazy"
                   />
                </div>
                
                {/* Phần Chữ */}
                <div className={styles.cardContent}>
                  <span className={styles.cardTitle}>{game.name}</span>
                  <span className={styles.cardTag}>{game.tag}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* == MÀN HÌNH CHƠI GAME (Giữ nguyên) == */}
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
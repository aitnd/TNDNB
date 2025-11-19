// 💖 1. BIẾN THÀNH CLIENT COMPONENT 💖
'use client'

import React, { useState, useRef } from 'react'
import styles from './page.module.css' 

// 💖 2. DANH SÁCH GAME (ĐÃ CẬP NHẬT PIKACHU SOCVUI) 💖
const gamesList = [
  
  {
    name: 'Đào Vàng (Gold Miner)',
    // 💖 LINK MỚI SIÊU SẠCH 💖
    file: 'https://cdn.htmlgames.com/GoldMiner/', 
    image: '/games/daovang.png', 
    tag: 'Kinh Điển',
    type: 'html5', 
  },
  
  // === GAME HIỆN ĐẠI (HTML5) ===
  {
    name: 'Subway Surfers',
    // 💖 LINK GAME CHẠY NGAY 💖
    file: 'https://vietdp.com/games/2023/subway-surfers-world-seul/index.html', 
    image: '/games/subwaysurfers.png', // (Anh nhớ kiếm ảnh đẹp bỏ vào nha)
    tag: 'Siêu Hot',
    type: 'html5', 
  },
  
  // === GAME MỚI (NDS) ===
  { 
    name: 'Plants vs Zombies', 
    file: '/nds-player/index.html?game=PlantsvsZombies.nds', 
    image: '/games2/PlantsvsZombies.png', 
    tag: 'NDS',
    type: 'html5', 
  },
  { 
    name: 'Cờ Vua', 
    file: '/nds-player/index.html?game=chess.nds', 
    image: '/games2/chess.png', 
    tag: 'NDS',
    type: 'html5', 
  },

  // === GAME HUYỀN THOẠI (HTML5) ===
  {
    name: 'Pikachu',
    // Link bản chuẩn quốc tế, chơi cực mượt
    file: 'https://www.pikachucodien.net/games/pikachu/index.html', 
    image: '/games/pikachu.png', 
    tag: 'Huyền Thoại',
    type: 'html5', 
  },
   
  
  {
    name: 'Mario',
    file: '/mario-html5/index.html', 
    image: '/games/mariohtml5.png', 
    tag: 'HTML5',
    type: 'html5', 
  },
  

  {
    name: 'Sudoku Cổ Điển',
    // 💖 LINK SUDOKU SẠCH ĐẸP 💖
    file: 'https://cdn.htmlgames.com/SudokuClassic/', 
    image: '/games/sudoku.png', // (Anh nhớ kiếm ảnh Sudoku đẹp bỏ vào nha)
    tag: 'Trí Tuệ',
    type: 'html5', 
  },

{
    name: 'Sudoku Hàng Ngày',
    // 💖 LINK SUDOKU MỚI 💖
    file: 'https://cdn.htmlgames.com/DailySudoku/', 
    image: '/games/dailysudoku.png', // (Anh nhớ kiếm ảnh đẹp bỏ vào nha)
    tag: 'Trí Tuệ',
    type: 'html5', 
  },

  {
    name: 'Thủ Thành Trung Cổ',
    // 💖 LINK MỚI SIÊU XỊN 💖
    file: 'https://cdn.htmlgames.com/MedievalCastleDefense/', 
    image: '/games/medieval.png', // (Anh nhớ kiếm cái ảnh lâu đài đẹp đẹp bỏ vào nha)
    tag: 'Chiến Thuật',
    type: 'html5', 
  },
  
  // === GAME NES (Giả lập) ===
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
    name: 'Pac-Man Cổ Điển',
    // 💖 LINK PAC-MAN SẠCH ĐẸP 💖
    file: 'https://cdn.htmlgames.com/ClassicPac/', 
    image: '/games/pacman.png', // (Anh nhớ kiếm ảnh Pac-Man đẹp bỏ vào nha)
    tag: 'Kinh Điển',
    type: 'html5', 
  },

  { 
    name: 'Piece of Cake',
    file: 'https://www.crazygames.com/embed/piece-of-cake-merge-and-bake', 
    image: '/games/pieceofcake.png', 
    tag: 'HOT',
    type: 'html5', 
  },

  // === GAME FACEBOOK ===
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
      
      {/* == MENU CHỌN GAME == */}
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
                <div className={styles.cardImageWrapper}>
                   <img 
                     src={game.image || '/on-tap.png'} 
                     alt={game.name} 
                     className={styles.cardImage}
                     loading="lazy"
                   />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardTitle}>{game.name}</span>
                  <span className={styles.cardTag}>{game.tag}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* == MÀN HÌNH CHƠI GAME == */}
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
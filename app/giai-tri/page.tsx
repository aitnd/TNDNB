// 💖 1. BIẾN THÀNH CLIENT COMPONENT 💖
'use client'

import React, { useState } from 'react'
// (Em xóa cái Script giả lập rồi cho nhẹ web nha)
import styles from './page.module.css' 

// 💖 2. DANH SÁCH GAME (CHỈ CÒN HTML5) 💖
const gamesList = [
  {
    name: 'Mario ',
    file: '/mario-html5/index.html', 
    type: 'html5', 
  },
  { 
    // Game CrazyGames
    name: 'Piece of Cake ',
    file: 'https://www.crazygames.com/embed/piece-of-cake-merge-and-bake', 
    type: 'html5',
  },
];

// (Kiểu game)
type Game = typeof gamesList[0];

export default function GiaiTriPage() {

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Hàm dọn dẹp
  const handleGoBack = () => {
    const iframe = document.getElementById('html5-game-iframe');
    if (iframe) iframe.remove();
    setSelectedGame(null); 
  }

  return (
    <div className={styles.container}>
      
      {/* == MENU CHỌN GAME == */}
      {!selectedGame && (
        <>
          <h1 className={styles.title}>Góc Giải Trí 🕹️</h1>
          <p style={{marginBottom: '1.5rem', fontSize: '1.1rem', color: '#333', textAlign: 'center'}}>
            Chọn một game để 'chiến' nha anh:
          </p>
          <div className={styles.gameList}>
            {gamesList.map((game) => (
              <button
                key={game.name}
                className={styles.gameButton}
                onClick={() => setSelectedGame(game)}
              >
                Chơi {game.name}
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
          
          {/* (Chỉ còn khung HTML5 thôi) */}
          <div className={styles.iframeWrapper}>
            <iframe
              id="html5-game-iframe"
              src={selectedGame.file} 
              className={styles.iframeContent}
              title={selectedGame.name}
              // (Quyền lực cho game chạy mượt)
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
              allowFullScreen={true} 
            />
          </div>

          <p style={{marginTop: '1rem', textAlign: 'center', fontStyle: 'italic', color: '#555'}}>
            Chúc anh chơi vui vẻ!
          </p>

          <button onClick={handleGoBack} className={styles.backButton}>
            « Quay lại chọn game
          </button>
        </>
      )}

    </div>
  )
}
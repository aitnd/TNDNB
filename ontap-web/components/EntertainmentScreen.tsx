import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, ArrowLeft, Maximize2, Sparkles, Trophy } from 'lucide-react';

interface Game {
  name: string;
  file: string;
  image: string;
  tag: string;
  type: string;
}

const gamesList: Game[] = [
  {
    name: 'Đào Vàng (Gold Miner)',
    file: 'https://cdn.htmlgames.com/GoldMiner/',
    image: 'https://cdn.htmlgames.com/GoldMiner/icon.png',
    tag: 'Kinh Điển',
    type: 'html5',
  },
  {
    name: 'Subway Surfers',
    file: 'https://vietdp.com/games/2023/subway-surfers-world-seul/index.html',
    image: 'https://play-lh.googleusercontent.com/9s9Y7-3_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z=w240-h480-rw',
    tag: 'Siêu Hot',
    type: 'html5',
  },
  {
    name: 'Pikachu Cổ Điển',
    file: 'https://www.pikachucodien.net/games/pikachu/index.html',
    image: 'https://play-lh.googleusercontent.com/I7yXyZ_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z=w240-h480-rw',
    tag: 'Huyền Thoại',
    type: 'html5',
  },
  {
    name: 'Contra Original',
    file: 'https://www.retrogames.cc/embed/18526-contra-japan.html',
    image: 'https://www.retrogames.cc/c_img/contra_japan.png',
    tag: 'Tuổi Thơ',
    type: 'html5',
  },
  {
    name: 'Rambo Lùn (Metal Slug)',
    file: 'https://www.retrogames.cc/embed/31154-metal-slug-super-vehicle-001.html',
    image: 'https://www.retrogames.cc/c_img/metal-slug-super-vehicle-001.png',
    tag: 'Hành Động',
    type: 'html5',
  },
  {
    name: 'Xếp Thuốc (Dr. Mario)',
    file: 'https://www.retrogames.cc/embed/18579-dr-mario-japan-usa.html',
    image: 'https://www.retrogames.cc/c_img/dr.-mario-(japan,-usa).png',
    tag: 'Trí Tuệ',
    type: 'html5',
  },
  {
    name: 'Cờ Caro (Gomoku)',
    file: 'https://cdn.htmlgames.com/Gomoku/',
    image: 'https://cdn.htmlgames.com/Gomoku/icon.png',
    tag: 'Trí Tuệ',
    type: 'html5',
  },
  {
    name: 'Rắn Săn Mồi (Slither.io)',
    file: 'http://slither.io/',
    image: 'https://play-lh.googleusercontent.com/6Xz_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z=w240-h480-rw',
    tag: 'Vui Nhộn',
    type: 'html5',
  },
  {
    name: 'Bắn Bong Bóng',
    file: 'https://cdn.htmlgames.com/BubbleShooterClassic/',
    image: 'https://cdn.htmlgames.com/BubbleShooterClassic/icon.png',
    tag: 'Thư Giãn',
    type: 'html5',
  },
  {
    name: 'Cờ Tướng (Chinese Chess)',
    file: 'https://cdn.htmlgames.com/ChineseChess/',
    image: 'https://cdn.htmlgames.com/ChineseChess/icon.png',
    tag: 'Chiến Thuật',
    type: 'html5',
  },
  {
    name: 'Cờ Vua (Chess)',
    file: 'https://cdn.htmlgames.com/ChessClassic/',
    image: 'https://cdn.htmlgames.com/ChessClassic/icon.png',
    tag: 'Chiến Thuật',
    type: 'html5',
  },
  {
    name: 'Trốn Khỏi Văn Phòng',
    file: 'https://vietdp.com/games/2023/escape-from-the-office/index.html',
    image: 'https://vietdp.com/games/2023/escape-from-the-office/icon.png',
    tag: 'Siêu Troll',
    type: 'html5',
  },
  {
    name: '2048 Puzzle',
    file: 'https://2048game.com/embed/',
    image: 'https://play-lh.googleusercontent.com/fymW_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z=w240-h480-rw',
    tag: 'Trí Não',
    type: 'html5',
  },
  {
    name: 'Flappy Bird',
    file: 'https://flappybird.io/',
    image: 'https://play-lh.googleusercontent.com/fLz_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z=w240-h480-rw',
    tag: 'Ức Chế',
    type: 'html5',
  },
  {
    name: 'Khủng Long Nhảy (Chrome Dino)',
    file: 'https://chromedino.com/',
    image: 'https://play-lh.googleusercontent.com/9wz_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z_Z=w240-h480-rw',
    tag: 'Mất Mạng',
    type: 'html5',
  }
];

interface EntertainmentScreenProps {
  onBack: () => void;
}

const EntertainmentScreen: React.FC<EntertainmentScreenProps> = ({ onBack }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
  };

  const handleFullScreen = () => {
    if (gameContainerRef.current) {
      if (!document.fullscreenElement) {
        gameContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative min-h-screen p-4 md:p-8 overflow-hidden bg-background text-foreground pb-24 pt-20 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {!selectedGame ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="relative">
                <h1 className="text-3xl md:text-5xl font-black text-foreground flex items-center gap-3 py-1">
                  <Gamepad2 size={44} className="text-primary" />
                  Góc Giải Trí
                </h1>
                <p className="text-muted-foreground mt-1 font-semibold text-base flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  Xả stress sau giờ học căng thẳng nè! ✨
                </p>
              </div>
              <button 
                onClick={onBack}
                className="p-3 rounded-2xl bg-card border border-border hover:bg-muted text-foreground transition-all duration-200 transform active:scale-95 shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Quay lại"
              >
                <ArrowLeft size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {gamesList.map((game, idx) => (
                <motion.button
                  key={game.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, type: 'spring', stiffness: 120 }}
                  onClick={() => handleSelectGame(game)}
                  className="group relative flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md text-left border border-border hover:border-primary/40 transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Game+Icon';
                      }} loading="lazy" />
                    
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/20">
                        {game.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 relative z-20">
                    <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="mt-12 p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Trophy size={40} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-black text-foreground">Bạn muốn chơi Game nào khác?</h4>
                <p className="text-muted-foreground mt-1 text-sm">Hãy nhắn cho Admin để tụi mình cập nhật thêm những game tuổi thơ nhé! 🚀</p>
              </div>
              <button 
                onClick={onBack}
                className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground font-bold text-sm rounded-xl transition-all shadow-sm min-h-[44px]"
              >
                Nhắn Admin
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="player"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative z-10 flex flex-col h-[calc(100vh-6rem)] max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground transition-all shadow-sm active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Thoát trò chơi"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                    <Sparkles size={22} className="text-amber-500" />
                    {selectedGame.name}
                  </h2>
                </div>
              </div>
              <button 
                onClick={handleFullScreen}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 font-bold rounded-xl transition-all shadow-sm min-h-[44px] text-sm"
              >
                <Maximize2 size={18} />
                <span className="hidden md:inline">Toàn màn hình</span>
              </button>
            </div>

            <div 
              ref={gameContainerRef}
              className="flex-1 rounded-2xl overflow-hidden border border-border shadow-sm relative bg-black"
            >
              <iframe
                src={selectedGame.file}
                className="w-full h-full border-none relative z-10"
                title={selectedGame.name}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-orientation-lock allow-modals allow-top-navigation-by-user-activation"
                allowFullScreen
                allow="autoplay; fullscreen; gamepad; gyroscope; accelerometer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntertainmentScreen;

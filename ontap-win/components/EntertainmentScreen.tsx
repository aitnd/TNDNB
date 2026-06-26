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
    image: 'https://2048game.com/meta/apple-touch-icon.png',
    tag: 'Trí Tuệ',
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
    if (game.type === 'external') {
      window.open(game.file, '_blank');
    } else {
      setSelectedGame(game);
    }
  };

  const handleFullScreen = () => {
    if (gameContainerRef.current) {
      if (gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative min-h-screen p-4 md:p-8 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Dynamic Background Overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px] animate-bounce-slow" />
      </div>

      <AnimatePresence mode="wait">
        {!selectedGame ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="relative">
                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-4 py-2">
                  <Gamepad2 size={56} className="text-emerald-500 drop-shadow-lg" />
                  Góc Giải Trí
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-lg flex items-center gap-2">
                  <Sparkles size={20} className="text-yellow-500" />
                  Xả stress sau giờ học căng thẳng nè! ✨
                </p>
              </div>
              <button 
                onClick={onBack}
                className="group p-4 rounded-2xl glass-premium hover:bg-white/10 transition-all duration-300 transform active:scale-95 shadow-xl"
              >
                <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {gamesList.map((game, idx) => (
                <motion.button
                  key={game.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, type: 'spring', stiffness: 100 }}
                  onClick={() => handleSelectGame(game)}
                  className="game-card-hover group relative flex flex-col glass-premium rounded-[32px] overflow-hidden shadow-2xl text-left border-white/5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Game+Icon';
                      }} loading="lazy" />
                    {/* Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1.5 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400 shadow-lg">
                        {game.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 relative z-20">
                    <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg line-clamp-1 group-hover:text-emerald-400 transition-colors duration-300">
                      {game.name}
                    </h3>
                    <div className="mt-2 w-0 group-hover:w-12 h-1 bg-emerald-500 rounded-full transition-all duration-500" />
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="mt-16 p-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[42px] opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative p-8 md:p-12 rounded-[40px] glass-premium flex flex-col md:flex-row items-center gap-8 border-white/10">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Trophy size={48} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Bạn muốn chơi Game nào khác?</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg font-medium">Hãy nhắn cho Admin để tụi mình cập nhật thêm những game tuổi thơ xịn xò nhất nhé! 🚀</p>
                </div>
                <button className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 hover:shadow-emerald-500/40 text-white font-black text-lg rounded-2xl transition-all shadow-xl">
                  Yêu cầu ngay
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="p-3 rounded-2xl glass-premium hover:bg-white/10 transition-all shadow-lg active:scale-95"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black dark:text-white flex items-center gap-3">
                    <Sparkles size={28} className="text-yellow-500 animate-pulse" />
                    {selectedGame.name}
                  </h2>
                </div>
              </div>
              <button 
                onClick={handleFullScreen}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20"
              >
                <Maximize2 size={24} />
                <span className="hidden md:inline">Toàn màn hình</span>
              </button>
            </div>

            <div 
              ref={gameContainerRef}
              className="flex-1 rounded-[40px] overflow-hidden border-[1px] border-white/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative bg-black"
            >
              {/* Neon Frame Effect */}
              <div className="absolute inset-0 border-[8px] border-emerald-500/5 pointer-events-none rounded-[40px] z-20" />
              
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

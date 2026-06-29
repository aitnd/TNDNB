import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BADGE_DEFINITIONS, BadgeDefinition } from '../../constants/badges';
import { BadgeIcon } from './BadgeIcon';
import { X } from 'lucide-react';

interface BadgeUnlockPopupProps {
  badgeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeUnlockPopup: React.FC<BadgeUnlockPopupProps> = ({ badgeId, isOpen, onClose }) => {
  const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);

  if (!badge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Background rays effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-[200%] h-[200%] rounded-full"
                style={{ background: 'conic-gradient(from 0deg, transparent 0deg, #fde047 20deg, transparent 40deg, #fde047 60deg, transparent 80deg, #fde047 100deg, transparent 120deg, #fde047 140deg, transparent 160deg, #fde047 180deg, transparent 200deg, #fde047 220deg, transparent 240deg, #fde047 260deg, transparent 280deg, #fde047 300deg, transparent 320deg, #fde047 340deg, transparent 360deg)' }}
              />
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white z-10"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
              Huy Hiệu Mới!
            </h2>
            
            <div className="flex justify-center my-8 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <BadgeIcon icon={badge.fallbackIcon} colorClass={badge.color} size="xl" />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10"
            >
              <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`}>
                {badge.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {badge.description}
              </p>
              
              <button 
                onClick={onClose}
                className={`mt-6 w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${badge.color} shadow-lg hover:opacity-90 transition-opacity`}
              >
                Tuyệt Vời!
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

interface BadgeIconProps {
  icon: string;
  colorClass: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isUnlocked?: boolean;
  animate?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ 
  icon, 
  colorClass, 
  size = 'md', 
  isUnlocked = true,
  animate = true 
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-7xl'
  };

  const containerClass = `
    relative flex items-center justify-center rounded-full
    shadow-lg border-2
    ${isUnlocked ? `bg-gradient-to-br ${colorClass} border-white/40` : 'bg-gray-800 border-gray-600 grayscale opacity-50'}
    ${sizeClasses[size]}
  `;

  const content = (
    <div className={containerClass}>
      <span className="relative z-10 drop-shadow-md">{icon}</span>
      
      {/* Glow effect for unlocked badges */}
      {isUnlocked && (
        <div className="absolute inset-0 rounded-full bg-white/20 blur-md pointer-events-none" />
      )}
      
      {/* Lock icon for locked badges */}
      {!isUnlocked && (
        <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-600">
          <span className="text-xs">🔒</span>
        </div>
      )}
    </div>
  );

  if (!isUnlocked || !animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ 
        y: [0, -5, 0], // Floating effect
      }}
      transition={{ 
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
    >
      {content}
    </motion.div>
  );
};

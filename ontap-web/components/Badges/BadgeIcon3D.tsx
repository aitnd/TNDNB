import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaLock } from 'react-icons/fa';

interface BadgeIcon3DProps {
  name: string;
  description: string;
  fallbackIcon: string;
  colorClass: string; // e.g. "from-yellow-400 via-amber-300 to-yellow-500"
  level: 'dong' | 'bac' | 'vang' | 'kim_cuong' | 'role';
  isUnlocked: boolean;
  currentProgress?: number;
  targetValue?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BadgeIcon3D: React.FC<BadgeIcon3DProps> = ({
  name,
  description,
  fallbackIcon,
  colorClass,
  level,
  isUnlocked,
  currentProgress = 0,
  targetValue,
  size = 'md'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tracking cursor coordinates [-0.5, 0.5]
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  // Smooth spring physics for rotation
  const springConfig = { damping: 22, stiffness: 220, mass: 0.8 };
  const rotateX = useSpring(rotateXVal, springConfig);
  const rotateY = useSpring(rotateYVal, springConfig);

  // Transform coordinates to glare opacity & gradient position
  const glareOpacity = useTransform(rotateXVal, [-0.5, 0.5], [0.1, 0.5]);
  const glareX = useTransform(rotateYVal, [-0.5, 0.5], ['-30%', '130%']);
  const glareY = useTransform(rotateXVal, [-0.5, 0.5], ['-30%', '130%']);

  // Holographic rainbow gradient position shifting
  const holoX = useTransform(rotateYVal, [-0.5, 0.5], ['0%', '100%']);
  const holoY = useTransform(rotateXVal, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates to range [-0.5, 0.5]
    const normX = mouseX / width - 0.5;
    const normY = mouseY / height - 0.5;

    // Set rotation degrees (max 20deg tilt)
    rotateXVal.set(-normY * 20);
    rotateYVal.set(normX * 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateXVal.set(0);
    rotateYVal.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Size mapping
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
    xl: 'w-44 h-44 text-7xl'
  };

  // Border & Glow classes based on level
  const levelStyles = {
    dong: 'border-amber-600/30 shadow-amber-500/10 hover:shadow-amber-500/30',
    bac: 'border-slate-300/30 shadow-slate-400/10 hover:shadow-slate-400/30',
    vang: 'border-yellow-400/30 shadow-yellow-500/10 hover:shadow-yellow-500/30',
    kim_cuong: 'border-cyan-400/30 shadow-sky-400/10 hover:shadow-sky-400/30',
    role: 'border-teal-500/30 shadow-teal-500/10 hover:shadow-teal-500/30'
  };

  // Base progress calc
  const hasProgress = targetValue !== undefined && targetValue > 0 && !isUnlocked;
  const progressPercent = hasProgress ? Math.min((currentProgress / targetValue) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-center select-none" title={`${name}: ${description}`}>
      <div 
        className="perspective-[1000px] cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
          }}
          animate={isUnlocked && !isHovered ? {
            y: [0, -6, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          } : { y: 0 }}
          className={`
            relative ${sizeClasses[size]} rounded-2xl border bg-gradient-to-br ${colorClass}
            flex items-center justify-center shadow-lg transition-shadow duration-300
            ${levelStyles[level]} overflow-hidden
            ${!isUnlocked ? 'grayscale contrast-75 brightness-75 opacity-60' : ''}
          `}
        >
          {/* Glass Glare Highlight Layer */}
          <motion.div
            style={{
              x: glareX,
              y: glareY,
              opacity: isUnlocked ? glareOpacity : 0,
            }}
            className="absolute -inset-10 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none z-20"
          />

          {/* Holographic Prismatic Rainbow Shine Layer */}
          {isUnlocked && (
            <motion.div
              style={{
                backgroundPositionX: holoX,
                backgroundPositionY: holoY,
              }}
              className="
                absolute inset-0 pointer-events-none mix-blend-color-dodge z-10 opacity-30
                bg-[linear-gradient(115deg,transparent_20%,#ff00f0_30%,#00f0ff_45%,#00ff00_60%,transparent_80%)]
                bg-[length:200%_200%] transition-opacity duration-300
              "
            />
          )}

          {/* Golden/Shimmer Border Animation on Hover */}
          {isHovered && isUnlocked && (
            <div className="absolute inset-0 border-2 border-white/40 rounded-2xl pointer-events-none z-30 animate-pulse" />
          )}

          {/* Core Emoji / Icon Symbol */}
          <span 
            style={{ transform: 'translateZ(30px)' }}
            className={`
              inline-block filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] 
              ${isHovered ? 'scale-110' : 'scale-100'} transition-transform duration-300
            `}
          >
            {fallbackIcon}
          </span>

          {/* Locked Badge Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-40">
              <FaLock className="text-white drop-shadow" size={size === 'sm' ? 12 : 20} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Progress Bar (under locked badge if applicable) */}
      {hasProgress && (
        <div className="w-16 mt-2 bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-sky-500 h-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      )}
    </div>
  );
};

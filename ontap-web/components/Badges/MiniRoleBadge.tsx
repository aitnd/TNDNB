import React from 'react';
import { motion } from 'framer-motion';
import { BADGE_DEFINITIONS } from '../../constants/badges';

interface MiniRoleBadgeProps {
  role: string;
  className?: string;
}

export const MiniRoleBadge: React.FC<MiniRoleBadgeProps> = ({ role, className = '' }) => {
  // Find the corresponding role badge definition
  const badgeDef = BADGE_DEFINITIONS.find(b => b.group === 'role' && b.roleId === role);
  
  if (!badgeDef) return null;

  // Check if role deserves glow effect
  const isPremiumRole = ['admin', 'super_admin', 'lanh_dao'].includes(role);

  return (
    <motion.div
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/40 bg-gradient-to-br ${badgeDef.color} ${className}`}
      title={badgeDef.name}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isPremiumRole ? {
        scale: [1, 1.1, 1],
        boxShadow: [
          '0 0 2px rgba(234, 179, 8, 0.4)',
          '0 0 8px rgba(239, 68, 68, 0.7)',
          '0 0 2px rgba(234, 179, 8, 0.4)'
        ],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      } : { scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.3, rotate: [0, -15, 15, 0], boxShadow: '0 0 12px rgba(234, 179, 8, 0.9)' }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <span className="text-[10px] leading-none drop-shadow-sm select-none">{badgeDef.fallbackIcon}</span>
    </motion.div>
  );
};

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

  return (
    <motion.div
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full shadow-sm border border-white/50 bg-gradient-to-br ${badgeDef.color} ${className}`}
      title={badgeDef.name}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <span className="text-[10px] leading-none drop-shadow-sm">{badgeDef.fallbackIcon}</span>
    </motion.div>
  );
};

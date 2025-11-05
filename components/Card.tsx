'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)' } : {}}
      onClick={onClick}
      className={`
        bg-white rounded-3xl p-6 shadow-lg border border-gray-100
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

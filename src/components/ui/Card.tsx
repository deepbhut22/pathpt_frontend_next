"use client"

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
}

export default function Card({ className, children, interactive = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -5 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-lg bg-white shadow-card overflow-hidden',
        interactive && 'cursor-pointer hover:shadow-card-hover',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'orange' | 'purple' | 'blue' | 'yellow';
}

const colorMap = {
  orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 text-orange-400',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400',
  yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 text-yellow-400',
};

export function StatsCard({ icon, label, value, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorMap[color]} border backdrop-blur-xl rounded-2xl p-5`}
    >
      <div className={`${colorMap[color].split(' ').pop()} mb-2`}>{icon}</div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

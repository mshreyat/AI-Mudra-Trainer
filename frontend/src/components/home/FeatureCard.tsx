import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10 hover:border-surface-600/50 group cursor-default">
      <div className="w-12 h-12 rounded-xl bg-surface-800/80 border border-surface-700/80 flex items-center justify-center text-primary-400 mb-6 group-hover:bg-primary-900/30 group-hover:text-primary-300 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-surface-300 leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  );
};

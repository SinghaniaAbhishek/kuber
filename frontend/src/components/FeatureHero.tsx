import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureHeroProps {
  title: string;
  description: string;
  icon: ReactNode;
  value?: string;
  valueLabel?: string;
  gradientFrom?: string;
  gradientTo?: string;
  actionButton?: ReactNode;
}

const FeatureHero = ({ 
  title, 
  description, 
  icon, 
  value, 
  valueLabel, 
  gradientFrom = 'primary', 
  gradientTo = 'accent',
  actionButton 
}: FeatureHeroProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl surface p-8 mb-8"
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom}/10 via-transparent to-${gradientTo}/10`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-4xl font-bold mb-2 text-foreground`}>
              {title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {value && (
              <div className="text-right">
                <p className={`text-2xl font-bold text-${gradientFrom}`}>
                  {value}
                </p>
                <p className="text-sm text-muted-foreground">{valueLabel}</p>
              </div>
            )}
            <div className={`text-${gradientFrom}/60`}>
              {icon}
            </div>
          </div>
        </div>
        {actionButton && (
          <div className="flex justify-end">
            {actionButton}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureHero;

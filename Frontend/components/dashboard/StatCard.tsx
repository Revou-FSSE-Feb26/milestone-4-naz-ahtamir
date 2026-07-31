import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down';
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-blue-600',
  trend,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {typeof value === 'number' ? formatCurrency(value) : value}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : trend === 'down'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-neutral-600 dark:text-neutral-400'
                  )}
                >
                  {formatPercentage(change)}
                </span>
                {changeLabel && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          <div
            className={cn(
              'p-3 rounded-xl bg-opacity-10 dark:bg-opacity-20',
              iconColor.replace('text-', 'bg-'),
              'group-hover:scale-110 transition-transform duration-200'
            )}
          >
            <Icon className={cn('w-6 h-6', iconColor)} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

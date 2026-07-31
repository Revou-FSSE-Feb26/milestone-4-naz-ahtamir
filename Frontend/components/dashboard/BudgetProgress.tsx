'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { formatCurrency, calculatePercentage, cn } from '@/lib/utils';

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
}

interface BudgetProgressProps {
  budgets: Budget[];
  isLoading?: boolean;
}

export function BudgetProgress({ budgets, isLoading }: BudgetProgressProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Track your spending limits</CardDescription>
          </div>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Manage
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget, index) => {
            const percentage = calculatePercentage(budget.spent, budget.limit);
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80 && percentage <= 100;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: budget.color }}
                    />
                    <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                      {budget.category}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                  </span>
                </div>
                <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={cn(
                      'h-full rounded-full',
                      isOverBudget
                        ? 'bg-red-500'
                        : isNearLimit
                        ? 'bg-yellow-500'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    )}
                    style={
                      !isOverBudget && !isNearLimit
                        ? { backgroundColor: budget.color }
                        : undefined
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isOverBudget
                        ? 'text-red-600 dark:text-red-400'
                        : isNearLimit
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-neutral-600 dark:text-neutral-400'
                    )}
                  >
                    {percentage.toFixed(0)}% used
                  </span>
                  {isOverBudget && (
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Over budget by {formatCurrency(budget.spent - budget.limit)}
                    </span>
                  )}
                  {isNearLimit && !isOverBudget && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      {formatCurrency(budget.limit - budget.spent)} remaining
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

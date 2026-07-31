'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  account: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
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
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                </div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-20" />
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
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </div>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer group"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  transaction.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : 'bg-red-100 dark:bg-red-900/20'
                )}
              >
                {transaction.type === 'income' ? (
                  <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="neutral" size="sm">
                    {transaction.category}
                  </Badge>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDate(transaction.date, 'relative')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    'font-semibold text-sm',
                    transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-neutral-900 dark:text-neutral-100'
                  )}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
                <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                  <MoreVertical className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Wallet, CreditCard, Building, PiggyBank, TrendingUp, MoreVertical } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data
  const accounts = [
    {
      id: '1',
      name: 'Main Checking',
      type: 'checking',
      balance: 12500.00,
      currency: 'USD',
      institution: 'Chase Bank',
      accountNumber: '****1234',
      isDefault: true,
      color: '#3b82f6',
      icon: Building,
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 25000.00,
      currency: 'USD',
      institution: 'Bank of America',
      accountNumber: '****5678',
      isDefault: false,
      color: '#22c55e',
      icon: PiggyBank,
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: -1234.56,
      currency: 'USD',
      institution: 'American Express',
      accountNumber: '****9012',
      isDefault: false,
      color: '#8b5cf6',
      icon: CreditCard,
    },
    {
      id: '4',
      name: 'Investment Account',
      type: 'investment',
      balance: 45678.90,
      currency: 'USD',
      institution: 'Fidelity',
      accountNumber: '****3456',
      isDefault: false,
      color: '#f59e0b',
      icon: TrendingUp,
    },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, acc) => sum + acc.balance, 0));

  const getAccountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      checking: 'Checking',
      savings: 'Savings',
      credit: 'Credit Card',
      investment: 'Investment',
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Accounts
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your financial accounts and track balances
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Account
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Net Worth
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Assets
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalAssets)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Liabilities
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalLiabilities)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Accounts Grid */}
        {accounts.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<Wallet className="w-12 h-12" />}
                title="No accounts yet"
                description="Add your first account to start tracking your finances"
                action={
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Add Your First Account
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((account, index) => {
              const Icon = account.icon;
              return (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card hover className="group">
                    <div className="relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${account.color}20` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: account.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                {account.name}
                              </h3>
                              {account.isDefault && (
                                <Badge variant="info" size="sm">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {account.institution}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>

                      {/* Balance */}
                      <div className="mb-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                          Current Balance
                        </p>
                        <p
                          className={cn(
                            'text-3xl font-bold',
                            account.balance >= 0
                              ? 'text-neutral-900 dark:text-neutral-100'
                              : 'text-red-600 dark:text-red-400'
                          )}
                        >
                          {formatCurrency(account.balance)}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            Account Number
                          </p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {account.accountNumber}
                          </p>
                        </div>
                        <Badge variant="neutral" size="sm">
                          {getAccountTypeLabel(account.type)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Account Distribution */}
        {accounts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Account Distribution</CardTitle>
              <CardDescription>
                Overview of your assets across different accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.filter(a => a.balance > 0).map((account) => {
                  const percentage = (account.balance / totalAssets) * 100;
                  return (
                    <div key={account.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: account.color }}
                          />
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {account.name}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatCurrency(account.balance)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: account.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

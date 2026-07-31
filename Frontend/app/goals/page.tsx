'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { GoalModal } from '@/components/ui/GoalModal';
import { Plus, Target, TrendingUp, Calendar, DollarSign, Flag } from 'lucide-react';
import { formatCurrency, calculatePercentage, cn } from '@/lib/utils';

export default function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveGoal = (goalData: any) => {
    console.log('Goal created:', goalData);
    // TODO: Integrate with backend API
  };

  // Mock data
  const goals = [
    {
      id: '1',
      name: 'Emergency Fund',
      description: 'Build 6 months of expenses',
      targetAmount: 10000,
      currentAmount: 7500,
      targetDate: '2024-12-31',
      status: 'on-track',
      category: 'Savings',
      monthlyContribution: 500,
      color: '#3b82f6',
    },
    {
      id: '2',
      name: 'Vacation to Europe',
      description: 'Summer vacation 2024',
      targetAmount: 5000,
      currentAmount: 3200,
      targetDate: '2024-08-15',
      status: 'at-risk',
      category: 'Travel',
      monthlyContribution: 400,
      color: '#8b5cf6',
    },
    {
      id: '3',
      name: 'New Laptop',
      description: 'MacBook Pro M3',
      targetAmount: 2000,
      currentAmount: 2000,
      targetDate: '2024-06-30',
      status: 'achieved',
      category: 'Electronics',
      monthlyContribution: 0,
      color: '#22c55e',
    },
    {
      id: '4',
      name: 'Home Down Payment',
      description: '20% down payment',
      targetAmount: 50000,
      currentAmount: 15000,
      targetDate: '2025-12-31',
      status: 'on-track',
      category: 'Real Estate',
      monthlyContribution: 2000,
      color: '#f59e0b',
    },
  ];

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const achievedGoals = goals.filter(g => g.status === 'achieved').length;
  const activeGoals = goals.filter(g => g.status !== 'achieved').length;

  const getDaysRemaining = (targetDate: string) => {
    const days = Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'achieved':
        return <Badge variant="success" size="sm" dot>Achieved</Badge>;
      case 'on-track':
        return <Badge variant="info" size="sm" dot>On Track</Badge>;
      case 'at-risk':
        return <Badge variant="warning" size="sm" dot>At Risk</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Financial Goals
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Set, track, and achieve your financial objectives
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Goal
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Progress
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {calculatePercentage(totalCurrentAmount, totalTargetAmount).toFixed(0)}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Saved
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalCurrentAmount)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Active Goals
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {activeGoals}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {achievedGoals}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Flag className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<Target className="w-12 h-12" />}
                title="No goals yet"
                description="Create your first financial goal to start saving"
                action={
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Create Your First Goal
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, index) => {
              const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysRemaining = getDaysRemaining(goal.targetDate);

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card hover className="h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${goal.color}20` }}
                        >
                          <Target className="w-6 h-6" style={{ color: goal.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                            {goal.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(goal.status)}
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: goal.color }}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="relative h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: goal.color }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Remaining
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatCurrency(remaining)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Deadline
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {daysRemaining > 0
                            ? `${daysRemaining} days`
                            : goal.status === 'achieved'
                            ? 'Completed'
                            : 'Overdue'}
                        </p>
                      </div>
                    </div>

                    {/* Monthly Contribution */}
                    {goal.monthlyContribution > 0 && (
                      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Monthly Contribution
                          </span>
                          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(goal.monthlyContribution)}
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Goal Modal */}
        <GoalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveGoal}
        />
      </div>
    </DashboardLayout>
  );
}

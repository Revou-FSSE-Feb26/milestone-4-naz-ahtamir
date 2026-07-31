'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CategoryModal } from '@/components/ui/CategoryModal';
import { Plus, Tag, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, calculatePercentage } from '@/lib/utils';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveCategory = (categoryData: any) => {
    console.log('Category created:', categoryData);
    // TODO: Integrate with backend API
  };

  // Mock data
  const categories = [
    {
      id: '1',
      name: 'Salary',
      type: 'income',
      color: '#22c55e',
      icon: '💰',
      monthlyTotal: 5000,
      transactionCount: 2,
      percentage: 100,
    },
    {
      id: '2',
      name: 'Food & Dining',
      type: 'expense',
      color: '#ef4444',
      icon: '🍔',
      monthlyTotal: 1200,
      transactionCount: 24,
      percentage: 30,
    },
    {
      id: '3',
      name: 'Transportation',
      type: 'expense',
      color: '#f59e0b',
      icon: '🚗',
      monthlyTotal: 800,
      transactionCount: 15,
      percentage: 20,
    },
    {
      id: '4',
      name: 'Entertainment',
      type: 'expense',
      color: '#8b5cf6',
      icon: '🎬',
      monthlyTotal: 600,
      transactionCount: 12,
      percentage: 15,
    },
    {
      id: '5',
      name: 'Shopping',
      type: 'expense',
      color: '#3b82f6',
      icon: '🛍️',
      monthlyTotal: 1500,
      transactionCount: 18,
      percentage: 35,
    },
  ];

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const totalIncome = incomeCategories.reduce((sum, c) => sum + c.monthlyTotal, 0);
  const totalExpense = expenseCategories.reduce((sum, c) => sum + c.monthlyTotal, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Categories
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Organize your transactions with custom categories
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Category
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Income Categories
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalIncome)}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {incomeCategories.length} categories
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
                  Expense Categories
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpense)}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {expenseCategories.length} categories
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Income Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Income Categories</CardTitle>
            <CardDescription>Track your income sources</CardDescription>
          </CardHeader>
          <CardContent>
            {incomeCategories.length === 0 ? (
              <EmptyState
                icon={<Tag className="w-12 h-12" />}
                title="No income categories"
                description="Add categories to organize your income"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {incomeCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card hover className="group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            {category.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {category.name}
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {category.transactionCount} transactions
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                            <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(category.monthlyTotal)}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Manage your spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            {expenseCategories.length === 0 ? (
              <EmptyState
                icon={<Tag className="w-12 h-12" />}
                title="No expense categories"
                description="Add categories to organize your expenses"
              />
            ) : (
              <div className="space-y-4">
                {expenseCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {category.name}
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {category.transactionCount} transactions this month
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(category.monthlyTotal)}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {category.percentage}% of total
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                            <Edit2 className="w-4 h-4 text-neutral-400" />
                          </button>
                          <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Modal */}
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
        />
      </div>
    </DashboardLayout>
  );
}

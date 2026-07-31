'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock data
  const monthlyData = [
    { month: 'Jan', income: 12000, expense: 8000, savings: 4000 },
    { month: 'Feb', income: 13500, expense: 8500, savings: 5000 },
    { month: 'Mar', income: 11800, expense: 7800, savings: 4000 },
    { month: 'Apr', income: 14200, expense: 9200, savings: 5000 },
    { month: 'May', income: 12800, expense: 8400, savings: 4400 },
    { month: 'Jun', income: 12500, expense: 8234, savings: 4266 },
  ];

  const categoryData = [
    { name: 'Housing', value: 2800, color: '#3b82f6', percentage: 34 },
    { name: 'Food', value: 1200, color: '#22c55e', percentage: 15 },
    { name: 'Transportation', value: 800, color: '#f59e0b', percentage: 10 },
    { name: 'Entertainment', value: 600, color: '#8b5cf6', percentage: 7 },
    { name: 'Shopping', value: 1500, color: '#ef4444', percentage: 18 },
    { name: 'Others', value: 1334, color: '#6b7280', percentage: 16 },
  ];

  const incomeSourceData = [
    { source: 'Salary', amount: 5000, percentage: 71 },
    { source: 'Freelance', amount: 1500, percentage: 21 },
    { source: 'Investments', amount: 500, percentage: 7 },
  ];

  const yearlyComparison = [
    { year: '2021', income: 120000, expense: 90000 },
    { year: '2022', income: 135000, expense: 95000 },
    { year: '2023', income: 145000, expense: 100000 },
    { year: '2024', income: 155000, expense: 105000 },
  ];

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);
  const totalSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);
  const savingsRate = ((totalSavings / totalIncome) * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Financial Reports
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Detailed insights and analytics about your finances
            </p>
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              options={[
                { value: '2024', label: '2024' },
                { value: '2023', label: '2023' },
                { value: '2022', label: '2022' },
              ]}
            />
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalIncome)}
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
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Savings
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(totalSavings)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Savings Rate
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {savingsRate}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Income vs Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expense Trend</CardTitle>
            <CardDescription>Monthly comparison of income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.5} />
                <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                <Bar dataKey="savings" fill="#3b82f6" name="Savings" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Spending distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatCurrency(category.value)}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>Revenue streams breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {incomeSourceData.map((source, index) => (
                  <div key={source.source} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {source.source}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {source.percentage}% of total income
                        </p>
                      </div>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(source.amount)}
                      </p>
                    </div>
                    {index < incomeSourceData.length - 1 && (
                      <div className="border-b border-neutral-200 dark:border-neutral-800" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yearly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Yearly Comparison</CardTitle>
            <CardDescription>Track your financial growth over the years</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.5} />
                <XAxis dataKey="year" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Income"
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Expenses"
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransactionModal } from '@/components/ui/TransactionModal';
import { Button } from '@/components/ui/Button';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { ExpenseByCategoryChart } from '@/components/dashboard/ExpenseByCategoryChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetProgress } from '@/components/dashboard/BudgetProgress';
import { FinancialGoals } from '@/components/dashboard/FinancialGoals';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [defaultType, setDefaultType] = React.useState<'income' | 'expense' | 'transfer'>('expense');
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Calculate date range for current month
  const startDate = new Date(selectedYear, selectedMonth, 1);
  const endDate = new Date(selectedYear, selectedMonth + 1, 0);

  const { transactions, stats, loading } = useTransactions(startDate, endDate, refreshKey);

  const handleAddTransaction = (type: 'income' | 'expense' | 'transfer') => {
    setDefaultType(type);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = async (transaction: any) => {
    // Refresh data after creating transaction
    setRefreshKey(prev => prev + 1);
    setIsModalOpen(false);
  };

  const [budgets, setBudgets] = React.useState<any[]>([]);
  const [goals, setGoals] = React.useState<any[]>([]);

  // Fetch budgets and goals
  React.useEffect(() => {
    const fetchBudgetsAndGoals = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch budgets
        const budgetResponse = await fetch('http://localhost:3000/api/budgets', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json();
          setBudgets(budgetData.slice(0, 4)); // Show first 4
        }

        // Fetch goals
        const goalResponse = await fetch('http://localhost:3000/api/goals', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (goalResponse.ok) {
          const goalData = await goalResponse.json();
          setGoals(goalData.slice(0, 3)); // Show first 3
        }
      } catch (error) {
        console.error('Error fetching budgets/goals:', error);
      }
    };

    fetchBudgetsAndGoals();
  }, []);

  // Calculate monthly data for chart (last 6 months including current)
  const cashFlowData = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date(selectedYear, selectedMonth - i, 1);
    // Filter transactions for this month
    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.transactionDate);
      return txDate.getFullYear() === date.getFullYear() && txDate.getMonth() === date.getMonth();
    });

    const income = monthTransactions
      .filter(tx => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expense = monthTransactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      income,
      expense,
    };
  }).reverse();

  // Group transactions by category for expense chart
  const expenseByCategory = transactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((acc, tx) => {
      const existing = acc.find(item => item.name === tx.category?.name);
      if (existing) {
        existing.value += tx.amount;
      } else {
        acc.push({
          name: tx.category?.name || 'Other',
          value: tx.amount,
          color: tx.category?.color || '#6b7280',
        });
      }
      return acc;
    }, [] as any[]);

  const recentTransactions = transactions.slice(0, 5).map(tx => ({
    id: String(tx.id),
    description: tx.description,
    amount: tx.type === 'INCOME' ? tx.amount : -tx.amount,
    type: tx.type.toLowerCase() as 'income' | 'expense' | 'transfer',
    category: tx.category?.name || 'Other',
    date: tx.transactionDate,
    account: tx.account?.name || 'Account',
  }));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header with Month/Year Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              >
                {monthNames.map((month, i) => (
                  <option key={i} value={i}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              >
                {Array.from({ length: 5 }).map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>{year}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Welcome back! Here's your financial status for {monthNames[selectedMonth]} {selectedYear}.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value={stats.balance}
            icon={Wallet}
            iconColor="text-blue-600"
            isCurrency
          />
          <StatCard
            title="Monthly Income"
            value={stats.income}
            change={8.2}
            changeLabel="vs last month"
            icon={TrendingUp}
            iconColor="text-green-600"
            trend="up"
            isCurrency
          />
          <StatCard
            title="Monthly Expenses"
            value={stats.expenses}
            change={-3.5}
            changeLabel="vs last month"
            icon={TrendingDown}
            iconColor="text-red-600"
            trend="down"
            isCurrency
          />
          <StatCard
            title="Transactions"
            value={stats.transactionCount}
            icon={PiggyBank}
            iconColor="text-purple-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CashFlowChart data={cashFlowData} />
          <ExpenseByCategoryChart data={expenseByCategory.length > 0 ? expenseByCategory : [{ name: 'No data', value: 0, color: '#6b7280' }]} />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <RecentTransactions transactions={recentTransactions} />
            )}
          </div>
          <div>
            <BudgetProgress budgets={budgets} />
          </div>
        </div>

        {/* Goals Section */}
        <FinancialGoals goals={goals} />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="success"
            size="md"
            leftIcon={<ArrowDownLeft className="w-4 h-4" />}
            onClick={() => handleAddTransaction('income')}
          >
            Add Income
          </Button>
          <Button
            variant="danger"
            size="md"
            leftIcon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => handleAddTransaction('expense')}
          >
            Add Expense
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => handleAddTransaction('transfer')}
          >
            Add Transfer
          </Button>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={defaultType}
        onSave={handleSaveTransaction}
      />
    </DashboardLayout>
  );
}

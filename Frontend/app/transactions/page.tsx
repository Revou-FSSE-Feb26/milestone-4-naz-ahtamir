'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TransactionModal } from '@/components/ui/TransactionModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Search, Filter, Download, ArrowUpRight, ArrowDownLeft, MoreVertical } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface Transaction {
  id: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  description: string;
  category?: {
    id: number;
    name: string;
    color?: string;
  };
  account?: {
    id: number;
    name: string;
  };
  transactionDate: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [defaultType, setDefaultType] = React.useState<'income' | 'expense' | 'transfer'>('expense');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Fetch transactions when component mounts or when month/year/refreshKey changes
  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter by selected month/year
          const filtered = data.filter((tx: Transaction) => {
            const txDate = new Date(tx.transactionDate);
            return txDate.getFullYear() === selectedYear && txDate.getMonth() === selectedMonth;
          });
          setTransactions(filtered);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedMonth, selectedYear, refreshKey]);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || tx.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalIncome: transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0),
    netCashFlow: transactions.filter(t => t.type !== 'TRANSFER').reduce((sum, t) => sum + (t.type === 'INCOME' ? t.amount : -t.amount), 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Transactions
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track and manage all your financial transactions for all months
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Transaction
          </Button>
        </div>

        {/* Month/Year Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filter by:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                  {formatCurrency(stats.totalExpense)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Net Cash Flow
                </p>
                <p className={cn(
                  "text-2xl font-bold",
                  stats.netCashFlow >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}>
                  {formatCurrency(stats.netCashFlow)}
                </p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                stats.netCashFlow >= 0
                  ? "bg-green-100 dark:bg-green-900/20"
                  : "bg-red-100 dark:bg-red-900/20"
              )}>
                {stats.netCashFlow >= 0 ? (
                  <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card padding="none">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                ]}
              />
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                More Filters
              </Button>
              <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                Export
              </Button>
            </div>
          </div>

          {/* Transactions Table */}
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-neutral-500">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <EmptyState
                icon={<Search className="w-12 h-12" />}
                title="No transactions found"
                description="Try adjusting your search or filters"
                action={
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Add Your First Transaction
                  </Button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-xl flex items-center justify-center',
                                transaction.type === 'INCOME'
                                  ? 'bg-green-100 dark:bg-green-900/20'
                                  : 'bg-red-100 dark:bg-red-900/20'
                              )}
                            >
                              {transaction.type === 'INCOME' ? (
                                <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {transaction.type}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="neutral"
                            style={{ backgroundColor: `${transaction.category?.color || '#6b7280'}20`, color: transaction.category?.color || '#6b7280' }}
                          >
                            {transaction.category?.name || 'Other'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-neutral-700 dark:text-neutral-300">
                            {transaction.account?.name || 'Account'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {formatDate(transaction.transactionDate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success" size="sm">
                            completed
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              'font-semibold',
                              transaction.type === 'INCOME'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-neutral-900 dark:text-neutral-100'
                            )}
                          >
                            {transaction.type === 'INCOME' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-neutral-400" />
                          </button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={defaultType}
        onSave={(transaction) => {
          setRefreshKey(prev => prev + 1);
          setIsModalOpen(false);
        }}
      />
    </DashboardLayout>
  );
}

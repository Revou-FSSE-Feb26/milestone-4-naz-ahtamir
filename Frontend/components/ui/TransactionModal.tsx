'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Wallet, Receipt, ChevronDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth.store';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { Badge } from './Badge';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense' | 'transfer';
  onSave?: (transaction: any) => void;
}

export interface TransactionFormData {
  type: 'income' | 'expense' | 'transfer';
  amount: string;
  description: string;
  category: string;
  account: string;
  date: string;
  tags: string[];
}

interface Category {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color?: string;
}

interface Account {
  id: number;
  name: string;
  type: string;
  balance?: number;
}

const categoryIcons: Record<string, string> = {
  'Salary': '💰',
  'Freelance': '💻',
  'Investment': '📈',
  'Food & Dining': '🍔',
  'Transportation': '🚗',
  'Entertainment': '🎬',
  'Shopping': '🛍️',
  'Utilities': '⚡',
  'Housing': '🏠',
  'Healthcare': '⚕️',
  'Other': '📦',
};

export function TransactionModal({ isOpen, onClose, defaultType = 'expense', onSave }: TransactionModalProps) {
  const { token } = useAuthStore();
  
  const [formData, setFormData] = useState<TransactionFormData>({
    type: defaultType,
    amount: '',
    description: '',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories and accounts when modal opens
  useEffect(() => {
    if (isOpen && token) {
      fetchCategoriesAndAccounts();
    }
  }, [isOpen, token]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: defaultType,
    }));
  }, [defaultType]);

  const fetchCategoriesAndAccounts = async () => {
    try {
      setIsLoading(true);

      // Fetch categories
      const catResponse = await fetch('http://localhost:3000/api/categories', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (catResponse.ok) {
        const catData = await catResponse.json();
        setCategories(catData);
        // Set default category
        if (catData.length > 0 && formData.category === '') {
          setFormData(prev => ({ ...prev, category: String(catData[0].id) }));
        }
      } else {
        console.error('Failed to fetch categories:', catResponse.status);
      }

      // Fetch accounts
      const accResponse = await fetch('http://localhost:3000/api/accounts', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (accResponse.ok) {
        const accData = await accResponse.json();
        setAccounts(accData);
        // Set default account
        if (accData.length > 0 && formData.account === '') {
          setFormData(prev => ({ ...prev, account: String(accData[0].id) }));
        }
      } else {
        console.error('Failed to fetch accounts:', accResponse.status);
      }
    } catch (error) {
      console.error('Error fetching categories/accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFormData({ ...formData, amount: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.description) {
      try {
        // Call API to create transaction
        const response = await fetch('http://localhost:3000/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: formData.type.toUpperCase(),
            amount: parseFloat(formData.amount),
            description: formData.description,
            categoryId: parseInt(formData.category) || undefined,
            accountId: parseInt(formData.account),
            date: formData.date,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create transaction: ${response.status}`);
        }

        const result = await response.json();
        onSave?.(result);
        onClose();
        resetForm();
      } catch (error) {
        console.error('Error creating transaction:', error);
        alert('Failed to save transaction. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: defaultType,
      amount: '',
      description: '',
      category: '',
      account: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
    });
  };

  const currentCategory = categories.find(c => String(c.id) === formData.category);
  const currentAccount = accounts.find(a => String(a.id) === formData.account);
  const selectedCategoryIcon = currentCategory ? (categoryIcons[currentCategory.name] || currentCategory.color || '🏷️') : '🏷️';

  const incomeCategories = categories.filter(c => c.type.toUpperCase() === 'INCOME');
  const expenseCategories = categories.filter(c => c.type.toUpperCase() === 'EXPENSE');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 bg-white dark:bg-neutral-900 z-10">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    Add Transaction
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Record a new financial transaction
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Transaction Type */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Transaction Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['income', 'expense', 'transfer'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, type });
                        }}
                        className={cn(
                          'flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200',
                          formData.type === type
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        )}
                      >
                        {type === 'income' && <ArrowDownLeft className="w-5 h-5 mb-1" />}
                        {type === 'expense' && <ArrowUpRight className="w-5 h-5 mb-1" />}
                        {type === 'transfer' && <div className="w-5 h-5 mb-1 rounded-full border-2 border-current" />}
                        <span className="text-xs font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Amount
                  </label>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-neutral-500 dark:text-neutral-400">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleAmountChange}
                      className="pl-10 text-2xl font-bold"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Description
                  </label>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input
                      placeholder="Enter transaction description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Category
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCategoryDropdown(!showCategoryDropdown);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{selectedCategoryIcon}</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {currentCategory?.name || 'Select Category'}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    </button>

                    {/* Category Dropdown */}
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden max-h-64 overflow-y-auto"
                      >
                        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            {formData.type === 'income' ? 'Income Categories' : 'Expense Categories'}
                          </span>
                        </div>
                        <div className="p-2">
                          {(formData.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({ ...formData, category: String(category.id) });
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                              <span className="text-xl">{categoryIcons[category.name] || '🏷️'}</span>
                              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                {category.name}
                              </span>
                              {formData.category === String(category.id) && (
                                <div className="ml-auto">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Account */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Account
                  </label>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={formData.account}
                      onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                      options={accounts.map(account => ({
                        value: String(account.id),
                        label: account.name,
                      }))}
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Date
                  </label>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="mt-4"
                  leftIcon={formData.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                >
                  {formData.type === 'income' ? 'Add Income' : 'Add Expense'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

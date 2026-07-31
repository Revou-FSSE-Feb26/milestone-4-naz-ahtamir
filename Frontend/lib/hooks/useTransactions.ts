'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';

export interface Transaction {
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

export interface TransactionStats {
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

export function useTransactions(
  startDate?: Date,
  endDate?: Date,
  refreshKey: number = 0
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    income: 0,
    expenses: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get token from auth store
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Check if token exists
        if (!token) {
          setError('No authentication token. Please login first.');
          setLoading(false);
          return;
        }
        
        // Fetch transactions
        const txResponse = await fetch('http://localhost:3000/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!txResponse.ok) {
          const errorData = await txResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${txResponse.status}`);
        }
        const txData = await txResponse.json();
        setTransactions(txData);

        // Fetch stats with date range
        const statsParams = new URLSearchParams();
        if (startDate) statsParams.append('startDate', startDate.toISOString());
        if (endDate) statsParams.append('endDate', endDate.toISOString());

        const statsResponse = await fetch(
          `http://localhost:3000/api/transactions/stats?${statsParams}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Transaction fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [startDate, endDate, refreshKey, token]);

  return { transactions, stats, loading, error };
}

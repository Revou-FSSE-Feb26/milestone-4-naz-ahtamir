// src/transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { CreateTransactionDto, UpdateTransactionDto, TransactionType } from './dto/transaction.dto';

// Map DTO TransactionType to database TransactionType
const transactionTypeMap: Record<TransactionType, string> = {
  [TransactionType.INCOME]: 'INCOME',
  [TransactionType.EXPENSE]: 'EXPENSE',
  [TransactionType.TRANSFER]: 'TRANSFER',
};

@Injectable()
export class TransactionsService {
  private transactionRepo: TransactionRepository;

  constructor(private prisma: PrismaService) {
    this.transactionRepo = new TransactionRepository(prisma);
  }

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    return this.transactionRepo.create({
      type: transactionTypeMap[createTransactionDto.type] as any,
      amount: createTransactionDto.amount,
      description: createTransactionDto.description,
      transactionDate: new Date(createTransactionDto.date),
      user: {
        connect: { id: userId }
      },
      ...(createTransactionDto.accountId && {
        account: {
          connect: { id: createTransactionDto.accountId }
        }
      }),
      ...(createTransactionDto.categoryId && {
        category: {
          connect: { id: createTransactionDto.categoryId }
        }
      }),
      ...(createTransactionDto.toAccountId && {
        toAccount: {
          connect: { id: createTransactionDto.toAccountId }
        }
      })
    });
  }

  async findAll(userId: number) {
    return this.transactionRepo.findByUserId(userId);
  }

  async findOne(id: number, userId: number) {
    const transaction = await this.transactionRepo.findById(id);
    
    if (!transaction || transaction.userId !== userId) {
      throw new Error('Transaction not found');
    }
    
    return transaction;
  }

  async update(id: number, userId: number, updateTransactionDto: UpdateTransactionDto) {
    // Verify ownership
    await this.findOne(id, userId);
    
    const updateData: any = {};
    
    if (updateTransactionDto.type) updateData.type = transactionTypeMap[updateTransactionDto.type];
    if (updateTransactionDto.amount) updateData.amount = updateTransactionDto.amount;
    if (updateTransactionDto.description) updateData.description = updateTransactionDto.description;
    if (updateTransactionDto.date) updateData.transactionDate = new Date(updateTransactionDto.date);
    if (updateTransactionDto.categoryId) updateData.categoryId = updateTransactionDto.categoryId;

    return this.transactionRepo.update(id, updateData);
  }

  async remove(id: number, userId: number) {
    // Verify ownership
    await this.findOne(id, userId);
    
    return this.transactionRepo.delete(id);
  }

  async getStats(userId: number, startDate?: Date, endDate?: Date) {
    const transactions = await this.transactionRepo.findByUserId(userId);
    
    let filtered = transactions;
    if (startDate || endDate) {
      filtered = transactions.filter(tx => {
        const txDate = new Date(tx.transactionDate);
        if (startDate && txDate < startDate) return false;
        if (endDate && txDate > endDate) return false;
        return true;
      });
    }

    const income = filtered
      .filter(tx => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const expenses = filtered
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const balance = income - expenses;

    return {
      income,
      expenses,
      balance,
      transactionCount: filtered.length,
    };
  }
}

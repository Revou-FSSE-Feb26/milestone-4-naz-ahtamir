/**
 * Seed Script - FinTrack Personal Finance Management System
 * Creates demo user with 1 year of realistic financial data
 * Usage: npx prisma db seed
 */

import 'dotenv/config';
import { PrismaClient, GoalStatus, CategoryType } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

interface SeedData {
  user: any;
  accounts: any[];
  categories: any[];
  transactions: any[];
  budgets: any[];
  goals: any[];
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clean up existing data (be careful with this in production!)
    console.log('🗑️  Cleaning up existing data...');
    await prisma.budgetAlert.deleteMany();
    await prisma.goalTransaction.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.userSetting.deleteMany();
    await prisma.accountType.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleanup complete\n');

    // ========== Create Account Types ==========
    console.log('📝 Creating account types...');
    const accountTypes = await prisma.accountType.createMany({
      data: [
        { name: 'CASH' },
        { name: 'BANK' },
        { name: 'EWALLET' },
        { name: 'CREDIT_CARD' },
        { name: 'INVESTMENT' },
      ],
    });
    console.log(`✅ Created ${accountTypes.count} account types\n`);

    // Get the created account types
    const allAccountTypes = await prisma.accountType.findMany();
    const accountTypeMap = Object.fromEntries(
      allAccountTypes.map((at) => [at.name, at.id]),
    );

    // ========== Create Demo User ==========
    console.log('👤 Creating demo user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@fintrack.com',
        password: hashedPassword,
        role: 'USER',
        isActive: true,
        emailVerified: true,
      },
    });
    console.log(`✅ Created user: ${user.email}\n`);

    // ========== Create User Settings ==========
    console.log('⚙️  Creating user settings...');
    await prisma.userSetting.create({
      data: {
        userId: user.id,
        currency: 'IDR',
        language: 'id',
        timeZone: 'Asia/Jakarta',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
        decimalPlaces: 2,
        budgetNotification: 'WEEKLY',
        transactionNotification: true,
        goalNotification: true,
      },
    });
    console.log('✅ User settings created\n');

    // ========== Create Accounts ==========
    console.log('🏦 Creating accounts...');
    const accountsData = [
      {
        name: 'BCA Savings',
        accountTypeId: accountTypeMap['BANK'],
        balance: 15000000,
        currency: 'IDR',
        description: 'Primary savings account',
      },
      {
        name: 'GoPay Wallet',
        accountTypeId: accountTypeMap['EWALLET'],
        balance: 500000,
        currency: 'IDR',
        description: 'Mobile e-wallet for daily transactions',
      },
      {
        name: 'Cash in Hand',
        accountTypeId: accountTypeMap['CASH'],
        balance: 1000000,
        currency: 'IDR',
        description: 'Physical cash',
      },
      {
        name: 'BRI Credit Card',
        accountTypeId: accountTypeMap['CREDIT_CARD'],
        balance: -2500000,
        currency: 'IDR',
        description: 'Primary credit card',
      },
      {
        name: 'Stock Investment',
        accountTypeId: accountTypeMap['INVESTMENT'],
        balance: 25000000,
        currency: 'IDR',
        description: 'Stock investment portfolio',
      },
    ];

    const accounts = await Promise.all(
      accountsData.map((acc) =>
        prisma.account.create({
          data: {
            ...acc,
            userId: user.id,
          },
        }),
      ),
    );
    console.log(`✅ Created ${accounts.length} accounts\n`);

    // ========== Create Categories ==========
    console.log('📂 Creating categories...');
    const categoriesData: Array<{
      name: string;
      type: CategoryType;
      icon: string;
      color: string;
      isDefault: boolean;
    }> = [
      // Income categories
      {
        name: 'Salary',
        type: CategoryType.INCOME,
        icon: '💰',
        color: '#4CAF50',
        isDefault: true,
      },
      {
        name: 'Bonus',
        type: CategoryType.INCOME,
        icon: '🎁',
        color: '#4CAF50',
        isDefault: false,
      },
      {
        name: 'Freelance',
        type: CategoryType.INCOME,
        icon: '💻',
        color: '#4CAF50',
        isDefault: false,
      },
      {
        name: 'Investment Return',
        type: CategoryType.INCOME,
        icon: '📈',
        color: '#4CAF50',
        isDefault: false,
      },

      // Expense categories
      {
        name: 'Food & Dining',
        type: CategoryType.EXPENSE,
        icon: '🍽️',
        color: '#FF6F00',
        isDefault: true,
      },
      {
        name: 'Transportation',
        type: CategoryType.EXPENSE,
        icon: '🚗',
        color: '#2196F3',
        isDefault: true,
      },
      {
        name: 'Utilities',
        type: CategoryType.EXPENSE,
        icon: '💡',
        color: '#FFC107',
        isDefault: false,
      },
      {
        name: 'Entertainment',
        type: CategoryType.EXPENSE,
        icon: '🎬',
        color: '#E91E63',
        isDefault: false,
      },
      {
        name: 'Shopping',
        type: CategoryType.EXPENSE,
        icon: '🛍️',
        color: '#9C27B0',
        isDefault: false,
      },
      {
        name: 'Healthcare',
        type: CategoryType.EXPENSE,
        icon: '🏥',
        color: '#F44336',
        isDefault: false,
      },
      {
        name: 'Education',
        type: CategoryType.EXPENSE,
        icon: '📚',
        color: '#3F51B5',
        isDefault: false,
      },
      {
        name: 'Insurance',
        type: CategoryType.EXPENSE,
        icon: '🛡️',
        color: '#607D8B',
        isDefault: false,
      },
      {
        name: 'Subscription',
        type: CategoryType.EXPENSE,
        icon: '📱',
        color: '#00BCD4',
        isDefault: false,
      },
      {
        name: 'Rent',
        type: CategoryType.EXPENSE,
        icon: '🏠',
        color: '#795548',
        isDefault: false,
      },
      {
        name: 'Other',
        type: CategoryType.EXPENSE,
        icon: '📌',
        color: '#9E9E9E',
        isDefault: false,
      },
    ];

    const categories = await Promise.all(
      categoriesData.map((cat) =>
        prisma.category.create({
          data: {
            ...cat,
            user: {
              connect: { id: user.id },
            },
          },
        }),
      ),
    );
    console.log(`✅ Created ${categories.length} categories\n`);

    // ========== Create Transactions (1 year: Jan-Dec 2024) ==========
    console.log('💳 Creating transactions for 12 months...');
    const transactions: any[] = [];
    const year = 2024;

    // Helper function to create date
    const createDate = (month: number, day: number) =>
      new Date(year, month - 1, day);

    // Monthly salary
    for (let month = 1; month <= 12; month++) {
      transactions.push({
        userId: user.id,
        type: 'INCOME',
        amount: 8000000,
        description: `Monthly Salary - ${new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' })}`,
        accountId: accounts[0].id, // BCA
        categoryId: categories[0].id, // Salary
        transactionDate: createDate(month, 5),
        isReconciled: true,
      });
    }

    // Bonus in March and December
    transactions.push({
      userId: user.id,
      type: 'INCOME',
      amount: 3000000,
      description: 'Bonus - March',
      accountId: accounts[0].id,
      categoryId: categories[1].id, // Bonus
      transactionDate: createDate(3, 10),
      isReconciled: true,
    });

    transactions.push({
      userId: user.id,
      type: 'INCOME',
      amount: 5000000,
      description: 'Year-End Bonus',
      accountId: accounts[0].id,
      categoryId: categories[1].id,
      transactionDate: createDate(12, 20),
      isReconciled: false,
    });

    // Freelance income (sporadic)
    transactions.push(
      {
        userId: user.id,
        type: 'INCOME',
        amount: 1500000,
        description: 'Freelance Project - Website Design',
        accountId: accounts[0].id,
        categoryId: categories[2].id,
        transactionDate: createDate(2, 15),
        isReconciled: true,
      },
      {
        userId: user.id,
        type: 'INCOME',
        amount: 2000000,
        description: 'Freelance Project - App Development',
        accountId: accounts[0].id,
        categoryId: categories[2].id,
        transactionDate: createDate(6, 20),
        isReconciled: true,
      },
      {
        userId: user.id,
        type: 'INCOME',
        amount: 1200000,
        description: 'Freelance - Consulting',
        accountId: accounts[0].id,
        categoryId: categories[2].id,
        transactionDate: createDate(10, 10),
        isReconciled: true,
      },
    );

    // Daily expenses - Food & Dining
    const foodDays = [3, 7, 10, 14, 17, 21, 24, 28];
    for (let month = 1; month <= 12; month++) {
      for (const day of foodDays) {
        const amount =
          Math.floor(Math.random() * (150000 - 50000 + 1)) + 50000;
        transactions.push({
          userId: user.id,
          type: 'EXPENSE',
          amount,
          description: `${['Lunch', 'Dinner', 'Breakfast', 'Coffee'][Math.floor(Math.random() * 4)]}`,
          accountId: accounts[1].id, // GoPay
          categoryId: categories[4].id, // Food & Dining
          transactionDate: createDate(month, Math.min(day, 28)),
          isReconciled: true,
        });
      }
    }

    // Transportation expenses
    for (let month = 1; month <= 12; month++) {
      // Weekly fuel/transport
      for (let week = 0; week < 4; week++) {
        transactions.push({
          userId: user.id,
          type: 'EXPENSE',
          amount: 200000,
          description: 'Fuel',
          accountId: accounts[1].id,
          categoryId: categories[5].id,
          transactionDate: createDate(month, Math.min(5 + week * 7, 28)),
          isReconciled: true,
        });
      }

      // Monthly car maintenance
      transactions.push({
        userId: user.id,
        type: 'EXPENSE',
        amount: 500000,
        description: 'Car Maintenance',
        accountId: accounts[2].id, // Cash
        categoryId: categories[5].id,
        transactionDate: createDate(month, 15),
        isReconciled: true,
      });
    }

    // Utilities (monthly)
    for (let month = 1; month <= 12; month++) {
      transactions.push(
        {
          userId: user.id,
          type: 'EXPENSE',
          amount: 250000,
          description: 'Electricity Bill',
          accountId: accounts[3].id, // Credit Card
          categoryId: categories[6].id,
          transactionDate: createDate(month, 10),
          isReconciled: true,
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          amount: 150000,
          description: 'Internet Bill',
          accountId: accounts[3].id,
          categoryId: categories[6].id,
          transactionDate: createDate(month, 5),
          isReconciled: true,
        },
      );
    }

    // Rent (monthly)
    for (let month = 1; month <= 12; month++) {
      transactions.push({
        userId: user.id,
        type: 'EXPENSE',
        amount: 3000000,
        description: 'Monthly Rent',
        accountId: accounts[0].id,
        categoryId: categories[13].id, // Rent
        transactionDate: createDate(month, 1),
        isReconciled: true,
      });
    }

    // Entertainment
    for (let month = 1; month <= 12; month++) {
      transactions.push(
        {
          userId: user.id,
          type: 'EXPENSE',
          amount: 150000,
          description: 'Movie Ticket',
          accountId: accounts[1].id,
          categoryId: categories[7].id,
          transactionDate: createDate(month, 8),
          isReconciled: true,
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          amount: 200000,
          description: 'Gaming Subscription',
          accountId: accounts[3].id,
          categoryId: categories[7].id,
          transactionDate: createDate(month, 1),
          isReconciled: true,
        },
      );
    }

    // Shopping
    for (let month = 1; month <= 12; month++) {
      const shoppingDays = month % 2 === 0 ? [12, 25] : [10, 20];
      for (const day of shoppingDays) {
        const amount =
          Math.floor(Math.random() * (800000 - 200000 + 1)) + 200000;
        transactions.push({
          userId: user.id,
          type: 'EXPENSE',
          amount,
          description: 'Shopping',
          accountId: accounts[3].id,
          categoryId: categories[8].id,
          transactionDate: createDate(month, day),
          isReconciled: month <= 10,
        });
      }
    }

    // Subscriptions (monthly)
    for (let month = 1; month <= 12; month++) {
      transactions.push(
        {
          userId: user.id,
          type: 'EXPENSE',
          amount: 49000,
          description: 'Music Streaming',
          accountId: accounts[3].id,
          categoryId: categories[12].id,
          transactionDate: createDate(month, 3),
          isReconciled: true,
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          amount: 29000,
          description: 'Cloud Storage',
          accountId: accounts[3].id,
          categoryId: categories[12].id,
          transactionDate: createDate(month, 7),
          isReconciled: true,
        },
      );
    }

    // Healthcare (sporadic)
    transactions.push(
      {
        userId: user.id,
        type: 'EXPENSE',
        amount: 300000,
        description: 'Medical Checkup',
        accountId: accounts[0].id,
        categoryId: categories[9].id,
        transactionDate: createDate(3, 20),
        isReconciled: true,
      },
      {
        userId: user.id,
        type: 'EXPENSE',
        amount: 450000,
        description: 'Dental Treatment',
        accountId: accounts[0].id,
        categoryId: categories[9].id,
        transactionDate: createDate(7, 15),
        isReconciled: true,
      },
    );

    // Insurance (quarterly)
    for (let quarter = 0; quarter < 4; quarter++) {
      transactions.push({
        userId: user.id,
        type: 'EXPENSE',
        amount: 500000,
        description: 'Health Insurance',
        accountId: accounts[0].id,
        categoryId: categories[11].id,
        transactionDate: createDate(quarter * 3 + 1, 10),
        isReconciled: true,
      });
    }

    // Education (occasional)
    transactions.push(
      {
        userId: user.id,
        type: 'EXPENSE',
        amount: 1500000,
        description: 'Online Course - React Advanced',
        accountId: accounts[0].id,
        categoryId: categories[10].id,
        transactionDate: createDate(4, 15),
        isReconciled: true,
      },
      {
        userId: user.id,
        type: 'EXPENSE',
        amount: 2000000,
        description: 'Professional Certification',
        accountId: accounts[0].id,
        categoryId: categories[10].id,
        transactionDate: createDate(9, 20),
        isReconciled: true,
      },
    );

    // Transfers between accounts
    transactions.push(
      {
        userId: user.id,
        type: 'TRANSFER',
        amount: 5000000,
        description: 'Transfer to Investment Account',
        fromAccountId: accounts[0].id, // BCA
        toAccountId: accounts[4].id, // Stock Investment
        transactionDate: createDate(1, 15),
        isReconciled: true,
      },
      {
        userId: user.id,
        type: 'TRANSFER',
        amount: 1000000,
        description: 'Transfer from Savings to GoPay',
        fromAccountId: accounts[0].id,
        toAccountId: accounts[1].id,
        transactionDate: createDate(6, 1),
        isReconciled: true,
      },
    );

    // Create all transactions
    await Promise.all(
      transactions.map((tx) =>
        prisma.transaction.create({
          data: tx,
        }),
      ),
    );
    console.log(`✅ Created ${transactions.length} transactions\n`);

    // ========== Create Budgets ==========
    console.log('💰 Creating monthly budgets...');
    const budgetsData = [
      { categoryId: categories[4].id, amount: 2500000, alertThreshold: 80 }, // Food
      { categoryId: categories[5].id, amount: 2000000, alertThreshold: 85 }, // Transport
      { categoryId: categories[6].id, amount: 600000, alertThreshold: 90 }, // Utilities
      { categoryId: categories[7].id, amount: 800000, alertThreshold: 80 }, // Entertainment
      { categoryId: categories[8].id, amount: 3000000, alertThreshold: 75 }, // Shopping
      { categoryId: categories[12].id, amount: 200000, alertThreshold: 95 }, // Subscriptions
    ];

    const budgets: any[] = [];
    for (let month = 1; month <= 12; month++) {
      for (const budget of budgetsData) {
        const createdBudget = await prisma.budget.create({
          data: {
            userId: user.id,
            categoryId: budget.categoryId,
            amount: budget.amount,
            month,
            year,
            alertThreshold: budget.alertThreshold,
            isActive: true,
          },
        });
        budgets.push(createdBudget);
      }
    }
    console.log(`✅ Created ${budgets.length} budgets (12 months × ${budgetsData.length} categories)\n`);

    // ========== Create Budget Alerts ==========
    console.log('🚨 Creating budget alerts...');
    // Simulate alerts for months where spending exceeded threshold
    const budgetAlerts = [
      {
        budgetId: budgets[4].id, // Feb Food budget
        threshold: 92,
        spentAmount: 2300000,
      },
      {
        budgetId: budgets[8].id, // March Transport
        threshold: 88,
        spentAmount: 1760000,
      },
      {
        budgetId: budgets[26].id, // March Shopping
        threshold: 82,
        spentAmount: 2460000,
      },
    ];

    await Promise.all(
      budgetAlerts.map((alert) =>
        prisma.budgetAlert.create({
          data: {
            userId: user.id,
            budgetId: alert.budgetId,
            threshold: alert.threshold,
            spentAmount: alert.spentAmount,
            isRead: false,
          },
        }),
      ),
    );
    console.log(`✅ Created ${budgetAlerts.length} budget alerts\n`);

    // ========== Create Financial Goals ==========
    console.log('🎯 Creating financial goals...');
    const goals = [
      {
        title: 'Emergency Fund',
        description: 'Build 6 months of living expenses',
        category: 'Saving',
        targetAmount: 50000000,
        currentAmount: 35000000,
        startDate: createDate(1, 1),
        targetDate: createDate(12, 31),
        status: GoalStatus.ACTIVE,
        priority: 1,
      },
      {
        title: 'House Down Payment',
        description: 'Save for 20% down payment on house',
        category: 'Investment',
        targetAmount: 100000000,
        currentAmount: 45000000,
        startDate: createDate(1, 1),
        targetDate: new Date(2025, 11, 31),
        status: GoalStatus.ACTIVE,
        priority: 2,
      },
      {
        title: 'Vacation to Japan',
        description: 'Annual vacation trip',
        category: 'Travel',
        targetAmount: 20000000,
        currentAmount: 20000000,
        startDate: createDate(1, 1),
        targetDate: createDate(7, 31),
        status: GoalStatus.COMPLETED,
        completedDate: createDate(7, 15),
        priority: 3,
      },
      {
        title: 'New Car',
        description: 'Buy a new sedan',
        category: 'Asset',
        targetAmount: 150000000,
        currentAmount: 60000000,
        startDate: createDate(1, 1),
        targetDate: new Date(2025, 11, 31),
        status: GoalStatus.ACTIVE,
        priority: 2,
      },
      {
        title: 'Laptop Upgrade',
        description: 'Buy new MacBook Pro',
        category: 'Gadget',
        targetAmount: 25000000,
        currentAmount: 25000000,
        startDate: createDate(4, 1),
        targetDate: createDate(5, 31),
        status: GoalStatus.COMPLETED,
        completedDate: createDate(5, 10),
        priority: 3,
      },
    ];

    const createdGoals = await Promise.all(
      goals.map((goal) =>
        prisma.goal.create({
          data: {
            userId: user.id,
            title: goal.title,
            description: goal.description,
            category: goal.category,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            startDate: goal.startDate,
            targetDate: goal.targetDate,
            status: goal.status,
            completedDate: goal.completedDate || null,
            priority: goal.priority,
            isAutoCalculate: true,
          },
        }),
      ),
    );
    console.log(`✅ Created ${createdGoals.length} goals\n`);

    // ========== Create Goal Transactions ==========
    console.log('📊 Creating goal contributions...');
    const goalTransactionsList = [
      {
        goalId: createdGoals[0].id, // Emergency Fund
        amount: 5000000,
        date: createDate(2, 10),
        notes: 'Monthly contribution',
      },
      {
        goalId: createdGoals[0].id,
        amount: 5000000,
        date: createDate(5, 15),
        notes: 'Monthly contribution',
      },
      {
        goalId: createdGoals[0].id,
        amount: 8000000,
        date: createDate(8, 20),
        notes: 'Extra contribution from bonus',
      },
      {
        goalId: createdGoals[1].id, // House Down Payment
        amount: 5000000,
        date: createDate(3, 10),
        notes: 'Monthly contribution',
      },
      {
        goalId: createdGoals[1].id,
        amount: 10000000,
        date: createDate(9, 15),
        notes: 'Extra from freelance income',
      },
      {
        goalId: createdGoals[3].id, // New Car
        amount: 10000000,
        date: createDate(4, 5),
        notes: 'Initial deposit',
      },
      {
        goalId: createdGoals[3].id,
        amount: 25000000,
        date: createDate(6, 20),
        notes: 'Investment return',
      },
    ];

    for (const gt of goalTransactionsList) {
      await prisma.goalTransaction.create({
        data: {
          userId: user.id,
          goalId: gt.goalId,
          amount: gt.amount,
          notes: gt.notes,
          createdAt: gt.date,
        },
      });
    }
    console.log(`✅ Created ${goalTransactionsList.length} goal contributions\n`);

    // ========== Create Activity Logs ==========
    console.log('📋 Creating activity logs...');
    const activityLogs = [
      {
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        statusCode: 200,
      },
      {
        action: 'CREATE',
        entity: 'Account',
        entityId: accounts[0].id,
        statusCode: 201,
      },
      {
        action: 'CREATE',
        entity: 'Category',
        entityId: categories[0].id,
        statusCode: 201,
      },
      {
        action: 'UPDATE',
        entity: 'UserSetting',
        entityId: user.id,
        statusCode: 200,
      },
    ];

    await Promise.all(
      activityLogs.map((log) =>
        prisma.activityLog.create({
          data: {
            userId: user.id,
            action: log.action,
            entity: log.entity,
            entityId: log.entityId,
            statusCode: log.statusCode,
            description: `${log.action} ${log.entity}`,
          },
        }),
      ),
    );
    console.log(`✅ Created ${activityLogs.length} activity logs\n`);

    // ========== Summary ==========
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ DATABASE SEED COMPLETED SUCCESSFULLY\n');
    console.log('📊 SEED DATA SUMMARY:');
    console.log(`   • User: ${user.name} (${user.email})`);
    console.log(`   • Accounts: ${accounts.length}`);
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Transactions: ${transactions.length}`);
    console.log(`   • Budgets: ${budgets.length}`);
    console.log(`   • Goals: ${createdGoals.length}`);
    console.log(`   • Goal Contributions: ${goalTransactionsList.length}`);
    console.log(`   • Budget Alerts: ${budgetAlerts.length}`);
    console.log(`   • Activity Logs: ${activityLogs.length}`);
    console.log('\n📝 TEST CREDENTIALS:');
    console.log('   • Email: demo@fintrack.com');
    console.log('   • Password: password123');
    console.log('\n📈 DATA PERIOD: Jan - Dec 2024 (12 months of realistic data)');
    console.log('═══════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

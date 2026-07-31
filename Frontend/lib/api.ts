// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Array<{ path: string; message: string }>
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Users
  getUsers() {
    return this.request('/users')
  }

  getUserProfile() {
    return this.request('/users/profile')
  }

  getUserById(id: number) {
    return this.request(`/users/${id}`)
  }

  // Accounts
  getAccounts(userId?: number) {
    const params = userId ? `?userId=${userId}` : ''
    return this.request(`/accounts${params}`)
  }

  // Categories
  getCategories(userId: number, type?: 'INCOME' | 'EXPENSE') {
    const params = type ? `?userId=${userId}&type=${type}` : `?userId=${userId}`
    return this.request(`/categories${params}`)
  }

  // Transactions
  getTransactions(params?: {
    userId?: number
    accountId?: number
    type?: 'INCOME' | 'EXPENSE' | 'TRANSFER'
    startDate?: string
    endDate?: string
  }) {
    const query = params
      ? '?' +
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : ''
    return this.request(`/transactions${query}`)
  }

  createTransaction(data: any) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  getTransactionById(id: number) {
    return this.request(`/transactions/${id}`)
  }

  updateTransaction(id: number, data: any) {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  deleteTransaction(id: number) {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  // Budgets
  getBudgets(userId: number, month?: number, year?: number) {
    let params = `?userId=${userId}`
    if (month && year) {
      params += `&month=${month}&year=${year}`
    }
    return this.request(`/budgets${params}`)
  }
}

export const api = new ApiClient()

// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import { ThemeProvider } from '@/lib/providers/ThemeProvider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'FinTrack - Personal Finance Management',
  description: 'Track expenses, manage budgets, and achieve your financial goals',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// src/test/utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
  user?: User | null
  theme?: 'light' | 'dark'
}

// Render with Router
export const renderWithRouter = (
  ui: React.ReactElement, 
  { route = '/' }: { route?: string } = {}
) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: BrowserRouter })
}

// Render with React Query
export const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}

// Render with all providers
export const renderWithProviders = (
  ui: React.ReactElement, 
  options: CustomRenderOptions = {}
) => {
  const {
    route = '/',
    user = null,
    theme = 'light',
    ...renderOptions
  } = options

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  window.history.pushState({}, 'Test page', route)

  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider initialTheme={theme}>
          <AuthProvider initialUser={user}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )

  return render(ui, { wrapper: AllProviders, ...renderOptions })
}

// Test wrapper component
export const TestWrapper: React.FC<{ 
  children: React.ReactNode
  options?: CustomRenderOptions 
}> = ({ children, options = {} }) => {
  const { user = null, theme = 'light' } = options

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider initialTheme={theme}>
          <AuthProvider initialUser={user}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

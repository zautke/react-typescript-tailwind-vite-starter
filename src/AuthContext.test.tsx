// AuthContext.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: User | null
}

const TestComponent: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  return (
    <div>
      {isAuthenticated ? (
        <span>Welcome {user?.name}</span>
      ) : (
        <span>Please login</span>
      )}
    </div>
  )
}

const renderWithAuth = (
  ui: React.ReactElement, 
  { user = null }: { user?: User | null } = {}
) => {
  return render(
    <AuthProvider initialUser={user}>
      {ui}
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  it('shows login prompt when not authenticated', () => {
    renderWithAuth(<TestComponent />)
    expect(screen.getByText('Please login')).toBeInTheDocument()
  })

  it('shows welcome message when authenticated', () => {
    const mockUser: User = { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      role: 'user'
    }
    renderWithAuth(<TestComponent />, { user: mockUser })
    
    expect(screen.getByText('Welcome John Doe')).toBeInTheDocument()
  })

  it('handles admin users', () => {
    const adminUser: User = { 
      id: 1, 
      name: 'Admin User', 
      email: 'admin@example.com',
      role: 'admin'
    }
    renderWithAuth(<TestComponent />, { user: adminUser })
    
    expect(screen.getByText('Welcome Admin User')).toBeInTheDocument()
  })
})

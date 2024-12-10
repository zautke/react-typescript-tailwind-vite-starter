// ErrorBoundary.test.tsx
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ThrowErrorProps {
  shouldThrow?: boolean
}

const ThrowError: React.FC<ThrowErrorProps> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

const CustomFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div>Custom error: {error.message}</div>
)

describe('ErrorBoundary', () => {
  const originalError = console.error
  
  beforeAll(() => {
    console.error = vi.fn()
  })
  
  afterAll(() => {
    console.error = originalError
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('renders custom fallback component', () => {
    const props: ErrorBoundaryProps = {
      fallback: CustomFallback,
      children: <ThrowError shouldThrow={true} />
    }
    
    render(<ErrorBoundary {...props} />)
    
    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument()
  })

  it('calls onError callback', () => {
    const mockOnError = vi.fn()
    const props: ErrorBoundaryProps = {
      onError: mockOnError,
      children: <ThrowError shouldThrow={true} />
    }
    
    render(<ErrorBoundary {...props} />)
    
    expect(mockOnError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.objectContaining({ componentStack: expect.stringContaining('ThrowError') })
    )
  })

  it('recovers from error when children change', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })
})

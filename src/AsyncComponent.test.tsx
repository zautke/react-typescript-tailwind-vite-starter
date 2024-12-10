// AsyncComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { AsyncComponent } from './AsyncComponent'

interface AsyncComponentProps {
  shouldError?: boolean
  delay?: number
  onDataLoaded?: (data: unknown) => void
}

interface AsyncData {
  id: number
  message: string
}

describe('AsyncComponent', () => {
  it('shows loading state', () => {
    render(<AsyncComponent />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows data after loading', async () => {
    render(<AsyncComponent />)
    
    await waitFor(() => {
      expect(screen.getByText(/data loaded/i)).toBeInTheDocument()
    })
  })

  it('loading disappears after data loads', async () => {
    render(<AsyncComponent />)
    
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument()
  })

  it('handles errors', async () => {
    const props: AsyncComponentProps = { shouldError: true }
    render(<AsyncComponent {...props} />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('calls onDataLoaded callback', async () => {
    const handleDataLoaded = vi.fn()
    const props: AsyncComponentProps = { onDataLoaded: handleDataLoaded }
    render(<AsyncComponent {...props} />)
    
    await waitFor(() => {
      expect(handleDataLoaded).toHaveBeenCalled()
    })
  })
})

// Button.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

describe('Button', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('renders button text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const props: ButtonProps = { 
      children: 'Click me', 
      onClick: handleClick 
    }
    render(<Button {...props} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    const props: ButtonProps = { 
      children: 'Disabled', 
      disabled: true 
    }
    render(<Button {...props} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading state', () => {
    const props: ButtonProps = { 
      children: 'Submit', 
      loading: true 
    }
    render(<Button {...props} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    const props: ButtonProps = { 
      children: 'Danger', 
      variant: 'danger' 
    }
    render(<Button {...props} />)
    expect(screen.getByRole('button')).toHaveClass('btn-danger')
  })
})

// KeyboardEvents.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KeyboardComponent } from './KeyboardComponent'

interface KeyboardComponentProps {
  onEnter?: (value: string) => void
  onEscape?: () => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

describe('KeyboardComponent', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('handles Enter key', async () => {
    const handleEnter = vi.fn()
    const props: KeyboardComponentProps = { onEnter: handleEnter }
    render(<KeyboardComponent {...props} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test{enter}')
    
    expect(handleEnter).toHaveBeenCalledWith('test')
  })

  it('handles Escape key', async () => {
    const handleEscape = vi.fn()
    const props: KeyboardComponentProps = { onEscape: handleEscape }
    render(<KeyboardComponent {...props} />)
    
    await user.keyboard('{Escape}')
    expect(handleEscape).toHaveBeenCalled()
  })

  it('handles Tab navigation', async () => {
    render(<KeyboardComponent />)
    
    const firstInput = screen.getByLabelText(/first/i)
    const secondInput = screen.getByLabelText(/second/i)
    
    firstInput.focus()
    await user.tab()
    
    expect(secondInput).toHaveFocus()
  })

  it('handles keydown events', async () => {
    const handleKeyDown = vi.fn()
    const props: KeyboardComponentProps = { onKeyDown: handleKeyDown }
    render(<KeyboardComponent {...props} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'a')
    
    expect(handleKeyDown).toHaveBeenCalled()
  })
})

// ClickEvents.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClickableComponent } from './ClickableComponent'

interface ClickableComponentProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onDoubleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  children: React.ReactNode
}

describe('ClickableComponent', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('handles single click', async () => {
    const handleClick = vi.fn()
    const props: ClickableComponentProps = { 
      onClick: handleClick,
      children: 'Click me'
    }
    render(<ClickableComponent {...props} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles double click', async () => {
    const handleDoubleClick = vi.fn()
    const props: ClickableComponentProps = { 
      onDoubleClick: handleDoubleClick,
      children: 'Double click me'
    }
    render(<ClickableComponent {...props} />)
    
    await user.dblClick(screen.getByRole('button'))
    expect(handleDoubleClick).toHaveBeenCalledTimes(1)
  })

  it('prevents event when disabled', async () => {
    const handleClick = vi.fn()
    const props: ClickableComponentProps = { 
      onClick: handleClick,
      disabled: true,
      children: 'Disabled'
    }
    render(<ClickableComponent {...props} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})

// FormControls.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormControls } from './FormControls'

type Category = 'electronics' | 'clothing' | 'books'

interface FormControlsProps {
  category?: Category
  agreed?: boolean
  onCategoryChange?: (category: Category) => void
  onAgreementChange?: (agreed: boolean) => void
}

describe('FormControls', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('handles select dropdown', async () => {
    const handleCategoryChange = vi.fn()
    const props: FormControlsProps = { onCategoryChange: handleCategoryChange }
    render(<FormControls {...props} />)
    
    const select = screen.getByRole('combobox', { name: /category/i })
    await user.selectOption(select, 'electronics')
    
    expect(select).toHaveValue('electronics')
    expect(handleCategoryChange).toHaveBeenCalledWith('electronics')
  })

  it('handles checkbox', async () => {
    const handleAgreementChange = vi.fn()
    const props: FormControlsProps = { onAgreementChange: handleAgreementChange }
    render(<FormControls {...props} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /agree/i })
    
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(handleAgreementChange).toHaveBeenCalledWith(true)
  })

  it('handles radio buttons', async () => {
    render(<FormControls />)
    
    const radio = screen.getByRole('radio', { name: /option 1/i })
    await user.click(radio)
    
    expect(radio).toBeChecked()
  })

  it('sets initial values', () => {
    const props: FormControlsProps = { 
      category: 'books', 
      agreed: true 
    }
    render(<FormControls {...props} />)
    
    expect(screen.getByRole('combobox')).toHaveValue('books')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})

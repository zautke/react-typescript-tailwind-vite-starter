// Component.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

interface ComponentProps {
  title?: string
  className?: string
}

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('renders with props', () => {
    const props: ComponentProps = { title: 'Test Title' }
    render(<ComponentName {...props} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('applies CSS classes', () => {
    const props: ComponentProps = { className: 'custom-class' }
    render(<ComponentName {...props} />)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})

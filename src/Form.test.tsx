// Form.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

interface FormData {
  name: string
  email: string
  message: string
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => void | Promise<void>
  initialData?: Partial<FormData>
}

describe('ContactForm', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('submits form with valid data', async () => {
    const mockSubmit = vi.fn()
    const props: ContactFormProps = { onSubmit: mockSubmit }
    render(<ContactForm {...props} />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Test message')
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      })
    })
  })

  it('shows validation errors', async () => {
    render(<ContactForm />)
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })

  it('validates email format', async () => {
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })

  it('populates with initial data', () => {
    const initialData: FormData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Initial message'
    }
    const props: ContactFormProps = { initialData }
    render(<ContactForm {...props} />)
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Initial message')).toBeInTheDocument()
  })
})

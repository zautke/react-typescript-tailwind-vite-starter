// Integration.test.tsx
import { describe, it, expect, beforeAll, afterEach, afterAll, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '../test/mocks/server'
import { renderWithProviders } from '../test/utils'
import { createMockUser } from '../test/factories'
import { App } from './App'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('completes user authentication flow', async () => {
    renderWithProviders(<App />)
    
    // Step 1: Navigate to login
    await user.click(screen.getByRole('link', { name: /login/i }))
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    
    // Step 2: Fill login form
    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    // Step 3: Verify redirect to dashboard
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    })
    
    // Step 4: Verify user data is displayed
    await waitFor(() => {
      expect(screen.getByText(/welcome.*user/i)).toBeInTheDocument()
    })
  })

  it('handles user creation workflow', async () => {
    const mockUser = createMockUser({ 
      name: 'John Admin', 
      role: 'admin' 
    })
    
    renderWithProviders(<App />, { user: mockUser })
    
    // Navigate to users page
    await user.click(screen.getByRole('link', { name: /users/i }))
    
    // Create new user
    await user.click(screen.getByRole('button', { name: /add user/i }))
    await user.type(screen.getByLabelText(/name/i), 'New User')
    await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
    await user.click(screen.getByRole('button', { name: /save/i }))
    
    // Verify user was created
    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument()
    })
  })

  it('handles error states gracefully', async () => {
    // Mock server error
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json(
          { error: 'Server Error' }, 
          { status: 500 }
        )
      })
    )
    
    renderWithProviders(<App />)
    
    await user.click(screen.getByRole('link', { name: /users/i }))
    
    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/error loading users/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })
})

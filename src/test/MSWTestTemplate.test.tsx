// ApiTest.test.tsx
import { describe, it, expect, beforeAll, afterEach, afterAll, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../test/mocks/server'
import { UserList } from './UserList'

interface User {
  id: number
  name: string
  email: string
}

interface UserListProps {
  onUserCreate?: (user: User) => void
  onUserDelete?: (id: number) => void
}

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('UserList', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('loads and displays users', async () => {
    render(<UserList />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('handles API errors', async () => {
    const errorResponse = {
      error: 'Server Error',
      message: 'Internal server error'
    }
    
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json(errorResponse, { status: 500 })
      })
    )

    render(<UserList />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('creates new user', async () => {
    const handleUserCreate = vi.fn()
    const props: UserListProps = { onUserCreate: handleUserCreate }
    render(<UserList {...props} />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    await user.type(screen.getByLabelText(/name/i), 'New User')
    await user.type(screen.getByLabelText(/email/i), 'new@example.com')
    await user.click(screen.getByRole('button', { name: /add/i }))
    
    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument()
    })
    
    expect(handleUserCreate).toHaveBeenCalledWith({
      id: 3,
      name: 'New User',
      email: 'new@example.com'
    })
  })

  it('deletes user', async () => {
    const handleUserDelete = vi.fn()
    const props: UserListProps = { onUserDelete: handleUserDelete }
    render(<UserList {...props} />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    await user.click(screen.getByRole('button', { name: /delete.*john doe/i }))
    
    expect(handleUserDelete).toHaveBeenCalledWith(1)
  })
})

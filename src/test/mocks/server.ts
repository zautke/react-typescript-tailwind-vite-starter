// src/test/mocks/server.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

interface User {
  id: number
  name: string
  email: string
}

interface CreateUserRequest {
  name: string
  email: string
}

interface ApiError {
  error: string
  message: string
}

export const handlers = [
  http.get('/api/users', () => {
    const users: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
    return HttpResponse.json(users)
  }),

  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json() as CreateUserRequest
    const createdUser: User = { id: 3, ...newUser }
    return HttpResponse.json(createdUser, { status: 201 })
  }),

  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    const userId = Number(id)
    
    if (userId === 999) {
      const error: ApiError = {
        error: 'Not Found',
        message: 'User not found'
      }
      return HttpResponse.json(error, { status: 404 })
    }
    
    const user: User = { 
      id: userId, 
      name: `User ${id}`, 
      email: `user${id}@example.com` 
    }
    return HttpResponse.json(user)
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({ message: `User ${id} deleted` })
  })
]

export const server = setupServer(...handlers)

// ApiComponent.test.tsx
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { ApiComponent } from './ApiComponent'

interface ApiData {
  id: number
  message: string
}

interface ApiError {
  error: string
  message: string
}

const mockApiData: ApiData = { id: 1, message: 'Success' }

const server = setupServer(
  http.get('/api/data', () => {
    return HttpResponse.json(mockApiData)
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ApiComponent', () => {
  it('fetches and displays data', async () => {
    render(<ApiComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument()
    })
  })

  it('handles API errors', async () => {
    const errorResponse: ApiError = {
      error: 'Server Error',
      message: 'Internal server error'
    }
    
    server.use(
      http.get('/api/data', () => {
        return HttpResponse.json(errorResponse, { status: 500 })
      })
    )
    
    render(<ApiComponent />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('handles network errors', async () => {
    server.use(
      http.get('/api/data', () => {
        return HttpResponse.error()
      })
    )
    
    render(<ApiComponent />)
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })
})

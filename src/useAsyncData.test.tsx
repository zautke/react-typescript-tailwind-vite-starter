// useAsyncData.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { useAsyncData } from './useAsyncData'

interface User {
  id: number
  name: string
  email: string
}

interface UseAsyncDataReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const mockUsers: User[] = [
  { id: 1, name: 'John', email: 'john@example.com' }
]

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers)
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useAsyncData', () => {
  it('fetches data successfully', async () => {
    const { result } = renderHook(() => useAsyncData<User[]>('/api/users'))
    
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual(mockUsers)
    expect(result.current.error).toBe(null)
  })

  it('handles errors', async () => {
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    const { result } = renderHook(() => useAsyncData<User[]>('/api/users'))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBe(null)
  })

  it('refetches data', async () => {
    const { result } = renderHook(() => useAsyncData<User[]>('/api/users'))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual(mockUsers)
    
    // Trigger refetch
    act(() => {
      result.current.refetch()
    })
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual(mockUsers)
  })
})

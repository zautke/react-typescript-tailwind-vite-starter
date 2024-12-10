// src/test/factories.ts
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
  description: string
}

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
  timestamp: string
}

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Test Product',
  price: 99.99,
  category: 'electronics',
  inStock: true,
  description: 'A test product description',
  ...overrides
})

export const createMockApiResponse = <T>(
  data: T, 
  overrides: Partial<Omit<ApiResponse<T>, 'data'>> = {}
): ApiResponse<T> => ({
  data,
  status: 200,
  message: 'Success',
  timestamp: new Date().toISOString(),
  ...overrides
})

export const createMockUsers = (count: number): User[] => 
  Array.from({ length: count }, (_, index) => 
    createMockUser({ 
      id: index + 1, 
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`
    })
  )

export const createMockProducts = (count: number): Product[] => 
  Array.from({ length: count }, (_, index) => 
    createMockProduct({ 
      id: index + 1, 
      name: `Product ${index + 1}`,
      price: (index + 1) * 10
    })
  )

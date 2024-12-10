// src/test/matchers.ts
import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  toBeInRange(min: number, max: number): R
  toHaveExactLength(expected: number): R
  toContainObject(expected: Record<string, unknown>): R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toBeInRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be in range ${min}-${max}`
          : `Expected ${received} to be in range ${min}-${max}`
    }
  },

  toHaveExactLength(received: unknown[], expected: number) {
    const pass = received.length === expected
    return {
      pass,
      message: () =>
        pass
          ? `Expected array not to have length ${expected}`
          : `Expected array to have length ${expected}, got ${received.length}`
    }
  },

  toContainObject(received: Record<string, unknown>[], expected: Record<string, unknown>) {
    const pass = received.some(item => 
      Object.keys(expected).every(key => item[key] === expected[key])
    )
    return {
      pass,
      message: () =>
        pass
          ? `Expected array not to contain object ${JSON.stringify(expected)}`
          : `Expected array to contain object ${JSON.stringify(expected)}`
    }
  }
})

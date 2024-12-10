// ThemeContext.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const TestComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span>Theme: {theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('provides default theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByText('Theme: light')).toBeInTheDocument()
  })

  it('toggles theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByText('Theme: light')).toBeInTheDocument()
    
    await user.click(screen.getByRole('button', { name: /toggle/i }))
    expect(screen.getByText('Theme: dark')).toBeInTheDocument()
  })

  it('accepts initial theme', () => {
    render(
      <ThemeProvider initialTheme="dark">
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByText('Theme: dark')).toBeInTheDocument()
  })

  it('throws error outside provider', () => {
    const originalError = console.error
    console.error = vi.fn()
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow(/useTheme must be used within a ThemeProvider/i)
    
    console.error = originalError
  })
})

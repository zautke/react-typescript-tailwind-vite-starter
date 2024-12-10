// List.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { List } from './List'

interface ListItem {
  id: number
  name: string
}

interface ListProps {
  items: ListItem[]
  onItemClick?: (item: ListItem) => void
}

describe('List', () => {
  const mockItems: ListItem[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]

  it('renders all items', () => {
    const props: ListProps = { items: mockItems }
    render(<List {...props} />)
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    const props: ListProps = { items: [] }
    render(<List {...props} />)
    expect(screen.getByText(/no items/i)).toBeInTheDocument()
  })

  it('renders correct number of items', () => {
    const props: ListProps = { items: mockItems }
    render(<List {...props} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('handles item clicks', async () => {
    const handleItemClick = vi.fn()
    const props: ListProps = { 
      items: mockItems, 
      onItemClick: handleItemClick 
    }
    const user = userEvent.setup()
    
    render(<List {...props} />)
    
    await user.click(screen.getByText('Item 1'))
    expect(handleItemClick).toHaveBeenCalledWith(mockItems[0])
  })
})

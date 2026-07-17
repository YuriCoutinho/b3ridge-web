import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

describe('Counter', () => {
  it('começa em zero', () => {
    render(<Counter />)

    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('incrementa ao clicar em Increment', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: 'Increment' }))

    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('decrementa ao clicar em Decrement', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: 'Decrement' }))

    expect(screen.getByText('Count: -1')).toBeInTheDocument()
  })

  it('acumula múltiplos cliques', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    const increment = screen.getByRole('button', { name: 'Increment' })
    await user.click(increment)
    await user.click(increment)
    await user.click(screen.getByRole('button', { name: 'Decrement' }))

    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
})

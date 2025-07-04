import React from 'react'
import {describe, it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Note} from './Note'

describe('Note', () => {
  it('renders children correctly', () => {
    render(<Note>Test note content</Note>)
    expect(screen.getByText('Test note content')).toBeInTheDocument()
  })

  it('applies default info variant', () => {
    render(<Note>Info note</Note>)
    const note = screen.getByText('Info note')
    expect(note.className).toContain('Note--info')
  })

  it('applies warning variant when specified', () => {
    render(<Note variant="warning">Warning note</Note>)
    const note = screen.getByText('Warning note')
    expect(note.className).toContain('Note--warning')
  })

  it('applies base Note class', () => {
    render(<Note>Base note</Note>)
    const note = screen.getByText('Base note')
    expect(note.className).toContain('Note')
  })

  it('renders as a div element', () => {
    render(<Note>Div note</Note>)
    const note = screen.getByText('Div note')
    expect(note.tagName).toBe('DIV')
  })

  it('handles complex children', () => {
    render(
      <Note>
        <strong>Important:</strong> This is a complex note with <a href="#link">a link</a> and other elements.
      </Note>,
    )

    expect(screen.getByText('Important:')).toBeInTheDocument()
    expect(screen.getByText('a link')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '#link')
  })

  it('supports both variant types', () => {
    const {rerender} = render(<Note variant="info">Info note</Note>)
    expect(screen.getByText('Info note').className).toContain('Note--info')

    rerender(<Note variant="warning">Warning note</Note>)
    expect(screen.getByText('Warning note').className).toContain('Note--warning')
  })
})

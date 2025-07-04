import React from 'react'
import {describe, it, expect} from 'vitest'
import {render} from '../../../test/utils'
import {Note} from './Note'
import styles from './Note.module.css'

describe('Note', () => {
  it('renders children correctly', () => {
    const {getByText} = render(<Note>Test note content</Note>)
    const el = getByText('Test note content')
    expect(el).toBeInTheDocument()
  })

  it('applies default info variant', () => {
    const {getByText} = render(<Note>Info note</Note>)
    const el = getByText('Info note')
    expect(el).toHaveClass(styles.Note, styles['Note--info'])
  })

  it('applies warning variant when specified', () => {
    const {getByText} = render(<Note variant="warning">Warning note</Note>)
    const el = getByText('Warning note')
    expect(el).toHaveClass(styles.Note, styles['Note--warning'])
  })

  it('applies base Note class', () => {
    const {getByText} = render(<Note>Base note</Note>)
    const el = getByText('Base note')
    expect(el).toHaveClass(styles.Note)
  })

  it('renders as a div element', () => {
    const {getByText} = render(<Note>Div note</Note>)
    const el = getByText('Div note')
    expect(el.tagName).toBe('DIV')
  })

  it('handles complex children', () => {
    const {getByText, getByRole} = render(
      <Note>
        <strong>Important:</strong> This is a complex note with <a href="#link">a link</a> and other elements.
      </Note>,
    )

    const importantEl = getByText('Important:')
    const linkEl = getByText('a link')
    const linkRole = getByRole('link')

    expect(importantEl).toBeInTheDocument()
    expect(linkEl).toBeInTheDocument()
    expect(linkRole).toHaveAttribute('href', '#link')
  })

  it('supports both variant types', () => {
    const {rerender, getByText} = render(<Note variant="info">Info note</Note>)
    const infoEl = getByText('Info note')
    expect(infoEl).toHaveClass(styles.Note, styles['Note--info'])

    rerender(<Note variant="warning">Warning note</Note>)
    const warningEl = getByText('Warning note')
    expect(warningEl).toHaveClass(styles.Note, styles['Note--warning'])
  })
})

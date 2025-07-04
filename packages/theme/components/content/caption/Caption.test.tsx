import React from 'react'
import {describe, it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Caption} from './Caption'

// Mock @primer/react to avoid CSS issues
vi.mock('@primer/react', () => ({
  Text: ({children, ...props}: any) => <span {...props}>{children}</span>,
}))

describe('Caption', () => {
  it('renders children correctly', () => {
    render(<Caption>Test caption</Caption>)
    expect(screen.getByText('Test caption')).toBeInTheDocument()
  })

  it('renders as a span element', () => {
    render(<Caption>Styled caption</Caption>)
    const caption = screen.getByText('Styled caption')

    // Check if it's rendered as a span
    expect(caption.tagName).toBe('SPAN')
  })

  it('passes through additional props', () => {
    render(<Caption data-testid="custom-caption">Caption with props</Caption>)
    const caption = screen.getByTestId('custom-caption')
    expect(caption).toBeInTheDocument()
    expect(caption).toHaveTextContent('Caption with props')
  })

  it('handles empty children', () => {
    render(<Caption></Caption>)
    // Should render an empty span element
    const caption = screen.getByText('', {selector: 'span'})
    expect(caption).toBeInTheDocument()
  })

  it('handles multiple children', () => {
    render(
      <Caption>
        First part <strong>bold part</strong> last part
      </Caption>,
    )
    expect(screen.getByText('bold part')).toBeInTheDocument()
    // Check that the container has the expected content
    const container = screen.getByText('bold part').closest('span')
    expect(container).toHaveTextContent('First part bold part last part')
  })
})

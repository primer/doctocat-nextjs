import React from 'react'
import {describe, it, expect} from 'vitest'
import {render} from '@testing-library/react'
import {Caption} from './Caption'

describe('Caption', () => {
  it('renders children correctly', () => {
    const {getByText} = render(<Caption>Test caption</Caption>)
    const el = getByText('Test caption')
    expect(el).toBeInTheDocument()
  })

  it('renders as a span element', () => {
    const {getByText} = render(<Caption>Styled caption</Caption>)
    const el = getByText('Styled caption')

    // Check if it's rendered as a span
    expect(el.tagName).toBe('SPAN')
  })

  it('passes through additional props', () => {
    const {getByTestId} = render(
      <Caption data-testid="custom-caption">Caption with props</Caption>,
    )
    const el = getByTestId('custom-caption')
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent('Caption with props')
  })

  it('handles empty children', () => {
    const {getByText} = render(<Caption></Caption>)
    // Should render an empty span element
    const el = getByText('', {selector: 'span'})
    expect(el).toBeInTheDocument()
  })

  it('handles multiple children', () => {
    const {getByText} = render(
      <Caption>
        First part <strong>bold part</strong> last part
      </Caption>,
    )
    const boldEl = getByText('bold part')
    expect(boldEl).toBeInTheDocument()
    // Check that the container has the expected content
    const container = boldEl.closest('span')
    expect(container).toHaveTextContent('First part bold part last part')
  })
})

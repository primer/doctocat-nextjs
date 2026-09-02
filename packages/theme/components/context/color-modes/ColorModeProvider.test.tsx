import {render, screen, waitFor} from '@testing-library/react'
import {afterEach, describe, expect, it} from 'vitest'
import {ColorModeProvider} from './ColorModeProvider'
import {useColorMode} from './useColorMode'

const ColorModeValue = () => {
  const {colorMode} = useColorMode()
  return <span>{colorMode}</span>
}

describe('ColorModeProvider', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/')
    window.localStorage.clear()
    delete document.documentElement.dataset.doctocatReady
  })

  it('uses the URL theme and marks the document ready after fonts load', async () => {
    window.localStorage.setItem('doctocat-active-color-mode', 'light')
    window.history.replaceState({}, '', '/?theme=dark')
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: {ready: Promise.resolve()},
    })

    render(
      <ColorModeProvider>
        <ColorModeValue />
      </ColorModeProvider>,
    )

    await waitFor(() => expect(screen.getByText('dark')).toBeInTheDocument())
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-doctocat-ready', 'true'))
    expect(window.localStorage.getItem('doctocat-active-color-mode')).toBe('dark')
  })
})

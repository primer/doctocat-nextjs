import React from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {ThemeProvider} from '@primer/react'

// Create a custom render function that includes providers
const AllTheProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <ThemeProvider colorMode="light" dayScheme="light" nightScheme="dark">
      {children}
    </ThemeProvider>
  )
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, {wrapper: AllTheProviders, ...options})

// Re-export everything
export * from '@testing-library/react'
export {customRender as render}

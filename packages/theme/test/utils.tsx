import React from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {ThemeProvider} from '@primer/react'

// Wrapper for components that need Primer React ThemeProvider
const PrimerThemeWrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <ThemeProvider colorMode="light" dayScheme="light" nightScheme="dark">
      {children}
    </ThemeProvider>
  )
}

// Render function specifically for Primer React components
export const renderWithPrimerThemeProviders = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, {wrapper: PrimerThemeWrapper, ...options})

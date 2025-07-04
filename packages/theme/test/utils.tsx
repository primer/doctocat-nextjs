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

// Custom matchers and utilities
export const createMockComponent = (displayName: string) => {
  const MockComponent = (props: any) => React.createElement('div', {...props, 'data-testid': displayName})
  MockComponent.displayName = displayName
  return MockComponent
}

// Mock Next.js Image component
export const MockImage = (props: any) => React.createElement('img', props)

// Helper to test component props
export const getComponentProps = (component: React.ReactElement) => {
  return component.props
}

// Helper to create test IDs
export const createTestId = (component: string, variant?: string) => {
  return variant ? `${component}-${variant}` : component
}

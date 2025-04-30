import {createContext, useContext} from 'react'
import type {PageMapItem} from 'nextra'

export type ConfigContextValue = {
  pageMap: PageMapItem[]
}

export const ConfigContext = createContext<ConfigContextValue | null>(null)

export const useConfig = (): ConfigContextValue => {
  const context = useContext(ConfigContext)

  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }

  return context
}

import React, {createContext, PropsWithChildren, useContext} from 'react'
import type {PageMapItem} from 'nextra'

export type ConfigContextLink = {
  title: string
  href: string
  isActive?: boolean
  isExternal?: boolean
}

export type ConfigContextValue = {
  pageMap: PageMapItem[]
  headerLinks: ConfigContextLink[]
  sidebarLinks: ConfigContextLink[]
}

export const ConfigContext = createContext<ConfigContextValue | null>(null)

export const useConfig = (): ConfigContextValue => {
  const context = useContext(ConfigContext)

  if (!context) {
    throw new Error('useConfig must be used within a ConfigContextProvider')
  }

  return context
}

type ConfigContextProviderProps = PropsWithChildren<{value: ConfigContextValue}>

export const ConfigContextProvider = ({children, value}: ConfigContextProviderProps) => {
  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

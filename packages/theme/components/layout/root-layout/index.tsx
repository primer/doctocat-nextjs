'use client'
import React from 'react'

import {ColorModeProvider} from '../../context/color-modes/ColorModeProvider'
import {Theme, ThemeProps} from './Theme'
import {type ConfigContextLink, ConfigContextProvider} from '../../context/useConfig'
import type {PageMapItem} from 'nextra'

type Props = {
  pageMap: PageMapItem[]
  headerLinks?: ConfigContextLink[]
  sidebarLinks?: ConfigContextLink[]
} & ThemeProps

/**
 * Catch-all layout component
 * This component is used for all pages in the site by default
 * To add custom layouts, create a new file in `pages/_layouts`
 * and export a component with the same name as the layout file
 */
export default function Shell({children, headerLinks = [], sidebarLinks = [], ...rest}: Props) {
  return (
    <ColorModeProvider>
      <ConfigContextProvider
        value={{
          headerLinks,
          sidebarLinks,
          basePath: process.env.NEXT_PUBLIC_DOCTOCAT_BASE_PATH || '',
        }}
      >
        <Theme {...rest}>{children}</Theme>
      </ConfigContextProvider>
    </ColorModeProvider>
  )
}

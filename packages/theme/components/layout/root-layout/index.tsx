'use client'
import React from 'react'
import type {PageMapItem} from 'nextra'

import {ColorModeProvider} from '../../context/color-modes/ColorModeProvider'
import {Theme, ThemeProps} from './Theme'
import {ConfigContext} from '../../context/useConfig'

type Props = {
  pageMap: PageMapItem[]
} & ThemeProps

/**
 * Catch-all layout component
 * This component is used for all pages in the site by default
 * To add custom layouts, create a new file in `pages/_layouts`
 * and export a component with the same name as the layout file
 */
export default function Shell({children, pageMap, ...rest}: Props) {
  return (
    <ColorModeProvider>
      <ConfigContext.Provider value={{pageMap}}>
        <Theme {...rest}>{children}</Theme>
      </ConfigContext.Provider>
    </ColorModeProvider>
  )
}

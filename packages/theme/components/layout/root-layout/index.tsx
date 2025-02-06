'use client'
import React from 'react'

import {ColorModeProvider} from '../../context/color-modes/ColorModeProvider'
import {Theme} from './Theme'

/**
 * Catch-all layout component
 * This component is used for all pages in the site by default
 * To add custom layouts, create a new file in `pages/_layouts`
 * and export a component with the same name as the layout file
 */
export default function Shell({children, pageMap, ...rest}) {
  return (
    <ColorModeProvider>
      <Theme {...rest} pageMap={pageMap}>
        {children}
      </Theme>
    </ColorModeProvider>
  )
}

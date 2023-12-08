import {useContext} from 'react'
import {ColorModeContext, ColorModeContextProps} from './context'

export const useColorMode = (): ColorModeContextProps => {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider')
  }
  return context
}

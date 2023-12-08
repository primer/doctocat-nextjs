import {useContext} from 'react'
import {ColorModeContext, ColorModeContextProps} from './context'

export const useColorMode = (): ColorModeContextProps => {
  const context = useContext(ColorModeContext)

  return context
}

import {createContext} from 'react'

export type ColorMode = 'light' | 'dark'

export type ColorModeContextProps = {
  colorMode: ColorMode
  setColorMode: (mode: ColorMode) => void
}

const defaultValues: ColorModeContextProps = {
  colorMode: 'light',
  setColorMode: () => {},
}

export const ColorModeContext = createContext<ColorModeContextProps>(defaultValues)

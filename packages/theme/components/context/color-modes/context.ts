import {createContext} from 'react'

export const colorModes = ['light', 'dark'] as const

export type ColorMode = (typeof colorModes)[number]

export type ColorModeContextProps = {
  colorMode: ColorMode
  setColorMode: (mode: ColorMode) => void
}

const defaultValues: ColorModeContextProps = {
  colorMode: 'light',
  setColorMode: () => {},
}

export const ColorModeContext = createContext<ColorModeContextProps>(defaultValues)

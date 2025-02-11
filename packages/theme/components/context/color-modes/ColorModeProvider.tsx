import React, {useState, useEffect, useCallback, PropsWithChildren} from 'react'
import {ColorMode, ColorModeContext} from './context'

const ColorModeProvider = ({children}: PropsWithChildren) => {
  const [colorMode, setColorMode] = useState<ColorMode>('light')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = window.localStorage.getItem('doctocat-active-color-mode')
      if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
        setColorMode(savedMode)
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setColorMode('dark')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('doctocat-active-color-mode', colorMode)
  }, [colorMode])

  const setMode = useCallback((mode: ColorMode) => {
    setColorMode(mode)
  }, [])

  return <ColorModeContext.Provider value={{colorMode, setColorMode: setMode}}>{children}</ColorModeContext.Provider>
}

export {ColorModeProvider}

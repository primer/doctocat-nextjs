import React, {useState, useEffect, useCallback, PropsWithChildren} from 'react'
import {ColorMode, ColorModeContext} from './context'

const ColorModeProvider = ({children}: PropsWithChildren) => {
  const [colorMode, setColorMode] = useState<ColorMode>('light')

  useEffect(() => {
    const requestedMode = new URLSearchParams(window.location.search).get('theme')
    const savedMode = window.localStorage.getItem('doctocat-active-color-mode')
    const initialMode =
      requestedMode === 'light' || requestedMode === 'dark'
        ? requestedMode
        : savedMode === 'light' || savedMode === 'dark'
          ? savedMode
          : window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'

    setColorMode(initialMode)
    window.localStorage.setItem('doctocat-active-color-mode', initialMode)

    let isMounted = true
    const markReady = () => {
      if (isMounted) document.documentElement.dataset.doctocatReady = 'true'
    }
    if (document.fonts) void document.fonts.ready.then(markReady, markReady)
    else markReady()

    return () => {
      isMounted = false
    }
  }, [])

  const setMode = useCallback((mode: ColorMode) => {
    setColorMode(mode)
    window.localStorage.setItem('doctocat-active-color-mode', mode)
  }, [])

  return <ColorModeContext.Provider value={{colorMode, setColorMode: setMode}}>{children}</ColorModeContext.Provider>
}

export {ColorModeProvider}

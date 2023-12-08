import React from 'react'
import debounce from 'lodash.debounce'

export function useNavDrawerState(breakpoint): [boolean, (value: boolean) => void] {
  if (typeof breakpoint === 'string') {
    breakpoint = parseInt(breakpoint, 10)
  }
  const [isOpen, setOpen] = React.useState<boolean>(false)

  const onResize = React.useCallback(() => {
    if (window.innerWidth >= breakpoint) {
      setOpen(false)
    }
  }, [setOpen, breakpoint])

  const handleSetOpen = React.useCallback(
    (value: boolean) => {
      setOpen(value)
    },
    [setOpen],
  )

  const debouncedOnResize = React.useMemo(() => debounce(onResize, 250), [onResize])

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('resize', debouncedOnResize)
      return () => {
        // cancel any debounced invocation of the resize handler
        debouncedOnResize.cancel()
        window.removeEventListener('resize', debouncedOnResize)
      }
    }
  }, [isOpen, debouncedOnResize])

  return [isOpen, handleSetOpen]
}

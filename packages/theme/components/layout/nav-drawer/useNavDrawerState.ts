import {useCallback, useEffect, useMemo, useState} from 'react'
import debounce from 'lodash.debounce'

export function useNavDrawerState(breakpoint: string | number): [boolean, (value: boolean) => void] {
  if (typeof breakpoint === 'string') {
    breakpoint = parseInt(breakpoint, 10)
  }
  const [isOpen, setOpen] = useState<boolean>(false)

  const onResize = useCallback(() => {
    if (window.innerWidth >= breakpoint) {
      setOpen(false)
    }
  }, [setOpen, breakpoint])

  const handleSetOpen = useCallback(
    (value: boolean) => {
      setOpen(value)
    },
    [setOpen],
  )

  const debouncedOnResize = useMemo(() => debounce(onResize, 250), [onResize])

  useEffect(() => {
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

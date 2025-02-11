import React, {PropsWithChildren} from 'react'
import {Text} from '@primer/react'

export function Caption(props: PropsWithChildren) {
  return <Text as="p" {...props} sx={{mt: 2, mb: 3, fontSize: 1, color: 'var(--brand-color-text-default)'}} />
}

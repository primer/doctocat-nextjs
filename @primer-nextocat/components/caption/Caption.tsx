import React from 'react'
import {Text} from '@primer/react'

export function Caption(props) {
  return <Text as="p" {...props} sx={{mt: 2, mb: 3, fontSize: 1, color: 'gray.5'}} />
}

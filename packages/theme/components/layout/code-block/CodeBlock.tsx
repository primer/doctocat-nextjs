'use client'
import React, {PropsWithChildren} from 'react'

import {ReactCodeBlock} from './ReactCodeBlock'
import {Pre} from 'nextra/components'

type CodeBlockProps = {
  'data-language': string
  jsxScope: Record<string, unknown>
} & PropsWithChildren<HTMLElement>

export function CodeBlock(props: CodeBlockProps) {
  if (['tsx', 'jsx'].includes(props['data-language'])) {
    return <ReactCodeBlock {...props} />
  }

  return <Pre>{props.children}</Pre>
}

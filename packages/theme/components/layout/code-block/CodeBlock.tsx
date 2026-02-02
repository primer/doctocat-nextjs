'use client'
import React, {PropsWithChildren} from 'react'
import dynamic from 'next/dynamic'

import {Pre} from 'nextra/components'
import {Box, Stack, Text} from '@primer/react-brand'
import {Spinner} from '@primer/react'

// We need to load this on the client to avoid a hydration mismatch.
const ReactCodeBlock = dynamic(
  async () => {
    const module = await import('./ReactCodeBlock')
    return {default: module.ReactCodeBlock}
  },
  {
    ssr: false,
    loading: () => (
      <Box borderStyle="solid" borderWidth="thin" borderColor="default" borderRadius="medium" marginBlockEnd="normal">
        <Stack style={{minHeight: 340}} alignItems="center" justifyContent="center">
          <Text>
            <Spinner />
          </Text>
        </Stack>
      </Box>
    ),
  },
)

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

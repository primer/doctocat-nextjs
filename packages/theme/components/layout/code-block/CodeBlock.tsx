'use client'
import React, {PropsWithChildren} from 'react'
import dynamic from 'next/dynamic'
import {renderToStaticMarkup} from 'react-dom/server'

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
    // Next.js v15.4+ will lazy render components on the server, which prevents us from
    // sending usable React nodes to the ReactCodeBlock component.
    // Workaround is to convert the code snippets to string on the client and pass to react-live.
    try {
      const childrenAsString = renderToStaticMarkup(<>{props.children}</>)

      const textContent = childrenAsString.replace(/<[^>]*>/g, '')

      // Restore escaped chars
      const decodedText = textContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&')

      return <ReactCodeBlock {...props} code={decodedText} />
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error extracting code snippet. Forwarding children directly:', error)
      // Fallback to original children-based approach
      return <ReactCodeBlock {...props} />
    }
  }

  return <Pre>{props.children}</Pre>
}

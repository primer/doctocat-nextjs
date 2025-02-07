import React from 'react'
import {PencilIcon} from '@primer/octicons-react'
import {Box, InlineLink, Stack, Text} from '@primer/react-brand'

type FooterProps = {
  filePath: string
  repoURL: string
  repoSrcPath: string
}

export function Footer({repoURL, repoSrcPath, filePath}: FooterProps) {
  return (
    <footer>
      <Box marginBlockStart={64}>
        <Stack direction="vertical" padding="none" gap={16}>
          <Stack direction="horizontal" padding="none" alignItems="center" gap={8}>
            <PencilIcon size={16} fill="var(--brand-InlineLink-color-rest)" />

            <InlineLink
              target="_blank"
              href={`${repoURL}/blob/main/${repoSrcPath ? `${repoSrcPath}/` : ''}${filePath}`}
            >
              Edit this page
            </InlineLink>
          </Stack>
          <Box
            marginBlockStart={8}
            paddingBlockStart={24}
            borderStyle="solid"
            borderBlockStartWidth="thin"
            borderColor="default"
          >
            <Text as="p" variant="muted" size="100">
              &copy; {new Date().getFullYear()} GitHub, Inc. All rights reserved.
            </Text>
          </Box>
        </Stack>
      </Box>
    </footer>
  )
}

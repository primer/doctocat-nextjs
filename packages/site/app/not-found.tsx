'use client'
import {HomeFillIcon} from '@primer/octicons-react'
import {Section, Heading, Text, Button, Stack, Box} from '@primer/react-brand'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Section>
      <Stack direction="vertical" alignItems="center">
        <Heading as="h1" size="3">
          404
        </Heading>
        <Text as="p" size="400">
          Page Not Found
        </Text>
        <Text as="p" variant="muted">
          The page you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Box marginBlockStart={24}>
          <Link href="/">
            <Button leadingVisual={<HomeFillIcon />}>Go back</Button>
          </Link>
        </Box>
      </Stack>
    </Section>
  )
}

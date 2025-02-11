'use client'
import {Card, Box, Stack} from '@primer/react-brand'
import Link from 'next/link'

export function PrimerCards() {
  return (
    <Box padding="none" backgroundColor="default">
      <Stack direction="horizontal" padding="none" gap={24}>
        <Link href="/components/primer/marketing-ui" legacyBehavior passHref>
          <Card href="/components/primer/marketing-ui" hasBorder>
            <Card.Heading>Primer Marketing UI</Card.Heading>
            <Card.Description>Learn how to use Primer Brand components in Markdown files.</Card.Description>
          </Card>
        </Link>
        <Link href="/components/primer/product-ui" legacyBehavior passHref>
          <Card
            hasBorder
            href="/components/primer/product-ui"
            style={{
              ['--brand-color-accent-primary' as string]: 'var(--base-color-scale-lime-2)',
            }}
          >
            <Card.Heading>Primer Product UI</Card.Heading>
            <Card.Description>Learn how to use Primer web UI components in Markdown files.</Card.Description>
          </Card>
        </Link>
      </Stack>
    </Box>
  )
}

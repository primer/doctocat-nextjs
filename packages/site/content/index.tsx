'use client'
import {Button, Card, Grid, Hero} from '@primer/react-brand'
import {FileIcon} from '@primer/octicons-react'
import Link from 'next/link'

type IndexProps = {
  title?: string
}

export default function Index({title = 'Doctocat'}: IndexProps) {
  return (
    <>
      <div>
        <Hero align="center">
          <Hero.Eyebrow>
            <img
              src="https://github.com/primer/doctocat-nextjs/assets/13340707/536d426a-c72d-4316-a9e9-135a2182667c"
              alt=""
              width="500"
              loading="lazy"
              decoding="async"
            />
          </Hero.Eyebrow>
          <Hero.Heading style={{marginTop: '-80px'}}>{title}</Hero.Heading>
          <Hero.Description>A Next.js theme for building Primer documentation sites</Hero.Description>
          <Hero.ButtonGroup>
            <Button as={Link} href="/getting-started/introduction/">
              Get started
            </Button>
          </Hero.ButtonGroup>
        </Hero>
      </div>
      <section
        style={{
          ['--brand-Card-maxWidth' as string]: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          ['--brand-Grid-spacing-row' as string]: 'var(--brand-Grid-spacing-column-gap)',
        }}
      >
        <Grid>
          <Grid.Column span={12}>
            <Link legacyBehavior passHref href="/getting-started/introduction">
              <Card href="#" hasBorder style={{width: '100%'}}>
                <Card.Icon icon={<FileIcon />} />
                <Card.Heading size="5">Get started</Card.Heading>
                <Card.Description>
                  Doctocat makes it easy to set up a documentation site so that you can focus on what&apos;s important:
                  writing docs.
                </Card.Description>
              </Card>
            </Link>
          </Grid.Column>
        </Grid>
      </section>
    </>
  )
}

'use client'
import {Grid, Box, Card, Hero} from '@primer/react-brand'
import {HeartIcon, NorthStarIcon, FileMediaIcon} from '@primer/octicons-react'
import Link from 'next/link'

export default function Index() {
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
          <Hero.Heading style={{marginTop: '-80px'}}>Doctocat</Hero.Heading>
          <Hero.Description>A Next.js theme for building Primer documentation sites</Hero.Description>
          <Box marginBlockStart={24}>
            <Link legacyBehavior href="/getting-started/introduction">
              <Hero.PrimaryAction href="/getting-started/introduction">Get started</Hero.PrimaryAction>
            </Link>
          </Box>
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
                <Card.Image
                  src="https://github.com/primer/nextocat/assets/13340707/cb9c1418-897d-47ac-a79e-0d60997e8bde"
                  alt="placeholder, blank area with an gray background color"
                />
                <Card.Heading size="5">Get started</Card.Heading>
                <Card.Description>
                  Doctocat makes it easy to set up a documentation site so that you can focus on what&apos;s important:
                  writing docs.
                </Card.Description>
              </Card>
            </Link>
          </Grid.Column>
          <Grid.Column span={12}>
            <Card href="#" hasBorder style={{width: '100%'}}>
              <Card.Label color="green">New </Card.Label>
              <Card.Icon icon={<NorthStarIcon />} />
              <Card.Heading size="5">An important part of this platform</Card.Heading>
              <Card.Description>
                Use wide boxes to callout important things like the brand guidelines or your core reference like
                foundations. You can even illustrate it or keep it simple with a simple icon
              </Card.Description>
            </Card>
          </Grid.Column>

          <Grid.Column
            span={{
              small: 12,
              medium: 6,
            }}
          >
            <Link legacyBehavior href="/content-examples">
              <Card
                hasBorder
                href="/content-examples"
                style={{
                  width: '100%',
                  ['--brand-color-accent-primary' as string]: 'var(--base-color-scale-lime-2)',
                }}
              >
                <Card.Icon icon={<FileMediaIcon />} />
                <Card.Heading>Content examples</Card.Heading>
              </Card>
            </Link>
          </Grid.Column>
          <Grid.Column
            span={{
              small: 12,
              medium: 6,
            }}
          >
            <Link legacyBehavior href="/tabs-example">
              <Card
                href="/tabs-example"
                hasBorder
                style={{
                  width: '100%',
                  ['--brand-color-accent-primary' as string]: 'var(--base-color-scale-blue-2)',
                }}
              >
                <Card.Icon icon={<HeartIcon />} />
                <Card.Heading>Tab examples</Card.Heading>
              </Card>
            </Link>
          </Grid.Column>
        </Grid>
      </section>
    </>
  )
}

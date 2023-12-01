import Head from 'next/head'
import type {MdxFile, NextraThemeLayoutProps} from 'nextra'
import {useFSRoute} from 'nextra/hooks'
import React, {useMemo} from 'react'
import type {Icon} from '@primer/octicons-react'
import {PencilIcon} from '@primer/octicons-react'
import {BaseStyles, Breadcrumbs, PageLayout, ThemeProvider} from '@primer/react'
import {
  Animate,
  AnimationProvider,
  Box,
  ThemeProvider as BrandThemeProvider,
  Grid,
  Heading,
  InlineLink,
  Stack,
  Text,
} from '@primer/react-brand'
import {Sidebar} from './components/layout/sidebar/Sidebar'
import {UnderlineNav} from './components/layout/underline-nav/UnderlineNav'

import '@primer/react-brand/fonts/fonts.css'
import '@primer/react-brand/lib/css/main.css'

import {useRouter} from 'next/router'
import getConfig from 'next/config'
import {normalizePages} from 'nextra/normalize-pages'
import {Header} from './components/layout/header/Header'
import {TableOfContents} from './components/layout/table-of-contents/TableOfContents'
import bodyStyles from './css/prose.module.css'

const {publicRuntimeConfig} = getConfig()

/**
 * Catch-all layout component
 * This component is used for all pages in the site by default
 * To add custom layouts, create a new file in `pages/_layouts`
 * and export a component with the same name as the layout file
 */
export default function Layout({children, pageOpts}: NextraThemeLayoutProps) {
  const {title, frontMatter, headings, filePath, pageMap, route} = pageOpts
  const {locale = 'en-US', defaultLocale, basePath} = useRouter()
  const fsPath = useFSRoute()
  const [colorMode, setColorMode] = React.useState<'light' | 'dark'>('light')
  const {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    topLevelNavbarItems,
    docsDirectories,
    flatDirectories,
    flatDocsDirectories,
    directories,
  } = useMemo(
    () =>
      normalizePages({
        list: pageMap,
        locale,
        defaultLocale,
        route: fsPath,
      }),
    [pageMap, locale, defaultLocale, fsPath],
  )

  const {siteTitle} = publicRuntimeConfig
  const isHomePage = route === '/'

  const data = !isHomePage && activePath[activePath.length - 2]
  const filteredTabData: MdxFile[] =
    data?.kind === 'Folder' ? (data.children.filter(child => child.kind === 'MdxPage') as MdxFile[]) : []

  return (
    <BrandThemeProvider dir="ltr" colorMode={colorMode}>
      <ThemeProvider colorMode={colorMode}>
        {/* @ts-ignore */}
        <BaseStyles>
          <Head>
            <title>{title}</title>
            <meta name="og:image" content={frontMatter.image} />
          </Head>
          <AnimationProvider runOnce visibilityOptions={1} autoStaggerChildren={false}>
            <Animate animate="fade-in">
              <PageLayout containerWidth="full" padding="none">
                <PageLayout.Header>
                  <Header
                    pageMap={pageMap}
                    menuItems={topLevelNavbarItems}
                    siteTitle={siteTitle}
                    colorModes={{
                      value: colorMode,
                      handler: setColorMode,
                    }}
                  />
                </PageLayout.Header>
                <PageLayout.Content padding="normal">
                  <Grid>
                    <Grid.Column span={!isHomePage && {large: 9}}>
                      <Stack direction="vertical" padding="none" gap="spacious">
                        {!isHomePage && (
                          <>
                            {activePath.length && (
                              <Breadcrumbs
                                sx={{
                                  fontFamily: 'var(--brand-fontStack-sansSerif)',
                                }}
                              >
                                {siteTitle && (
                                  <Breadcrumbs.Item
                                    href={basePath}
                                    sx={{
                                      color: 'var(--brand-InlineLink-color-rest)',
                                    }}
                                  >
                                    {siteTitle}
                                  </Breadcrumbs.Item>
                                )}
                                {activePath.map((item, index) => {
                                  return (
                                    <Breadcrumbs.Item
                                      key={item.name}
                                      href={`${basePath}${item.route}`}
                                      selected={index === activePath.length - 1}
                                      sx={{textTransform: 'capitalize', color: 'var(--brand-InlineLink-color-rest)'}}
                                    >
                                      {item.title.replace(/-/g, ' ')}
                                    </Breadcrumbs.Item>
                                  )
                                })}
                              </Breadcrumbs>
                            )}

                            <Box marginBlockEnd={24}>
                              <Stack direction="vertical" padding="none" gap={16}>
                                {frontMatter.title && (
                                  <Heading as="h1" size="2">
                                    {frontMatter.title}
                                  </Heading>
                                )}
                                {frontMatter.description && (
                                  <Text as="p" variant="muted" size="300">
                                    {frontMatter.description}
                                  </Text>
                                )}
                              </Stack>
                            </Box>
                            {Boolean(frontMatter['show-tabs']) && <UnderlineNav tabData={filteredTabData} />}
                          </>
                        )}

                        <article className={route != '/' ? bodyStyles.Prose : ''}>{children}</article>
                        <footer>
                          <Box marginBlockStart={64}>
                            <Stack direction="vertical" padding="none" gap={16}>
                              <Stack direction="horizontal" padding="none" alignItems="center" gap={8}>
                                <PencilIcon size={16} fill="var(--brand-InlineLink-color-rest)" />

                                <InlineLink href={`https://github.com/primer/nextocat/blob/main/${filePath}`}>
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
                      </Stack>
                    </Grid.Column>
                    {!isHomePage && headings.length > 0 && (
                      <Grid.Column span={{large: 3}}>
                        <TableOfContents headings={headings} />
                      </Grid.Column>
                    )}
                  </Grid>
                </PageLayout.Content>
                <PageLayout.Pane sticky padding="none" position="start">
                  <Sidebar pageMap={docsDirectories} />
                </PageLayout.Pane>
              </PageLayout>
            </Animate>
          </AnimationProvider>
        </BaseStyles>
      </ThemeProvider>
    </BrandThemeProvider>
  )
}

export type ThemeConfig = {
  docsRepositoryBase: string
  sidebarLinks: {
    title: string
    href: string
    leadingIcon?: 'repo' | 'org' | 'bookmark'
  }[]
}

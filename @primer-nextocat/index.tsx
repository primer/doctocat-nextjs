import Head from 'next/head'
import React, {useEffect, useMemo} from 'react'
import type {Folder, MdxFile, Meta, NextraThemeLayoutProps, PageMapItem} from 'nextra'
import {useFSRoute, useMounted} from 'nextra/hooks'

import {Sidebar} from './components/layout/sidebar/Sidebar'
import {
  MinimalFooter,
  ThemeProvider as BrandThemeProvider,
  AnimationProvider,
  Animate,
  InlineLink,
  Box,
  Grid,
  Stack,
  Heading,
} from '@primer/react-brand'
import {Box as PRCBox, ActionList, ActionMenu, BaseStyles, PageLayout, ThemeProvider, NavList} from '@primer/react'
import {UnderlineNav} from './components/layout/underline-nav/UnderlineNav'
import {MoonIcon, PencilIcon, SunIcon, SyncIcon} from '@primer/octicons-react'

import '@primer/react-brand/lib/css/main.css'
import '@primer/react-brand/fonts/fonts.css'

import bodyStyles from './css/prose.module.css'
import {Header} from './components/layout/header/Header'
import {TableOfContents} from './components/layout/table-of-contents/TableOfContents'
import themeConfig from '../theme.config'
import {normalizePages} from 'nextra/normalize-pages'
import {useRouter} from 'next/router'

/**
 * Catch-all layout component
 * This component is used for all pages in the site by default
 * To add custom layouts, create a new file in `pages/_layouts`
 * and export a component with the same name as the layout file
 */
export default function Layout({children, pageOpts}: NextraThemeLayoutProps) {
  const {title, frontMatter, headings, filePath, pageMap, route} = pageOpts
  const {locale = 'en-US', defaultLocale} = useRouter()
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

  const isHomePage = route === '/'

  const data = !isHomePage && activePath[activePath.length - 2]
  const filteredTabData: MdxFile[] =
    data?.kind === 'Folder' ? (data.children.filter(child => child.kind === 'MdxPage') as MdxFile[]) : []

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorMode)
  }, [colorMode])

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
              <PageLayout containerWidth="full" padding="none" sx={{pt: 76}}>
                <PageLayout.Header>
                  <Header pageMap={pageMap} />
                </PageLayout.Header>
                <PageLayout.Content padding="normal">
                  <Grid>
                    <Grid.Column span={!isHomePage && {large: 9}}>
                      <Stack direction="vertical" padding="none" gap="spacious">
                        {!isHomePage && frontMatter.title && (
                          <Box marginBlockEnd={24}>
                            <Heading as="h1" size="3">
                              {frontMatter.title}
                            </Heading>
                          </Box>
                        )}
                        {!isHomePage && Boolean(frontMatter['show-tabs']) && <UnderlineNav tabData={filteredTabData} />}
                        <article className={route != '/' ? bodyStyles.Prose : ''}>{children}</article>
                        <Box marginBlockStart={64}>
                          <Stack direction="horizontal" padding="none" alignItems="center" gap={8}>
                            <PencilIcon size={16} fill="var(--brand-InlineLink-color-rest)" />

                            <InlineLink href={`${themeConfig.docsRepositoryBase}/blob/main/${filePath}`}>
                              Edit this page
                            </InlineLink>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid.Column>
                    {!isHomePage && headings.length > 0 && (
                      <Grid.Column span={{large: 3}}>
                        <TableOfContents headings={headings} />
                      </Grid.Column>
                    )}
                  </Grid>
                </PageLayout.Content>
                <PageLayout.Pane sticky offsetHeader={76} padding="condensed" position="start" divider="line" resizable>
                  <Sidebar pageMap={pageMap} />
                  <PRCBox
                    sx={{
                      borderTop: '1px solid var(--brand-color-border-muted)',
                      mt: 4,
                      pt: 4,
                    }}
                  >
                    <ActionMenu>
                      <ActionMenu.Button
                        variant="invisible"
                        alignContent="start"
                        block
                        leadingVisual={colorMode === 'light' ? SunIcon : MoonIcon}
                      >
                        {colorMode === 'light' && 'Light'}
                        {colorMode === 'dark' && 'Dark'}
                      </ActionMenu.Button>

                      <ActionMenu.Overlay>
                        <ActionList>
                          <ActionList.Item onSelect={() => setColorMode('light')}>Light</ActionList.Item>
                          <ActionList.Divider />
                          <ActionList.Item onSelect={() => setColorMode('dark')}>Dark</ActionList.Item>
                        </ActionList>
                      </ActionMenu.Overlay>
                    </ActionMenu>
                  </PRCBox>
                </PageLayout.Pane>
                <PageLayout.Footer>
                  <MinimalFooter />
                </PageLayout.Footer>
              </PageLayout>
            </Animate>
          </AnimationProvider>
        </BaseStyles>
      </ThemeProvider>
    </BrandThemeProvider>
  )
}

import Head from 'next/head'
import type {MdxFile, NextraThemeLayoutProps} from 'nextra'
import {useFSRoute} from 'nextra/hooks'
import React, {useEffect, useMemo} from 'react'

import {MoonIcon, PencilIcon, SunIcon} from '@primer/octicons-react'
import {ActionList, ActionMenu, BaseStyles, Breadcrumbs, Box as PRCBox, PageLayout, ThemeProvider} from '@primer/react'
import {
  Animate,
  AnimationProvider,
  Box,
  ThemeProvider as BrandThemeProvider,
  Grid,
  Heading,
  InlineLink,
  MinimalFooter,
  Stack,
  Text,
} from '@primer/react-brand'
import {Sidebar} from './components/layout/sidebar/Sidebar'
import {UnderlineNav} from './components/layout/underline-nav/UnderlineNav'

import '@primer/react-brand/fonts/fonts.css'
import '@primer/react-brand/lib/css/main.css'

import {useRouter} from 'next/router'
import {normalizePages} from 'nextra/normalize-pages'
import themeConfig from '../theme.config'
import {Header} from './components/layout/header/Header'
import {TableOfContents} from './components/layout/table-of-contents/TableOfContents'
import bodyStyles from './css/prose.module.css'

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
                  <Header
                    pageMap={pageMap}
                    menuItems={topLevelNavbarItems}
                    siteTitle={pageMap[0].kind === 'Meta' ? pageMap[0].data.index['title' as string] : ''}
                  />
                </PageLayout.Header>
                <PageLayout.Content padding="normal">
                  <Grid>
                    <Grid.Column span={!isHomePage && {large: 9}}>
                      <Stack direction="vertical" padding="none" gap="spacious">
                        {!isHomePage && (
                          <>
                            {activePath.length && (
                              <Breadcrumbs>
                                {pageMap[0].kind === 'Meta' && (
                                  <Breadcrumbs.Item href="/">
                                    {pageMap[0].data.index['title' as string]}
                                  </Breadcrumbs.Item>
                                )}
                                {activePath.map((item, index) => {
                                  return (
                                    <Breadcrumbs.Item
                                      key={item.name}
                                      href={`${basePath}${item.route}`}
                                      selected={index === activePath.length - 1}
                                      sx={{textTransform: 'capitalize'}}
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
                                  <Heading as="h1" size="3">
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
                  <Sidebar pageMap={docsDirectories} activePath={activePath} />
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

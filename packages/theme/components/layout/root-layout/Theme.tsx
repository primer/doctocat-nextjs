import React, {useMemo} from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import type {Folder, MdxFile, NextraThemeLayoutProps} from 'nextra'
import {MDXProvider} from 'nextra/mdx'
import {useFSRoute} from 'nextra/hooks'
import {PencilIcon} from '@primer/octicons-react'
import {BaseStyles, Box as PRCBox, Breadcrumbs, PageLayout, ThemeProvider} from '@primer/react'

import {
  Animate,
  AnimationProvider,
  Box,
  ButtonGroup,
  ThemeProvider as BrandThemeProvider,
  Button,
  Hero,
  Heading,
  InlineLink,
  Stack,
  Text,
} from '@primer/react-brand'
import {Sidebar} from '../sidebar/Sidebar'
import {UnderlineNav} from '../underline-nav/UnderlineNav'

import '@primer/react-brand/fonts/fonts.css'
import '@primer/react-brand/lib/css/main.css'

import {useRouter} from 'next/router'
import getConfig from 'next/config'
import {normalizePages} from 'nextra/normalize-pages'
import {Header} from '../header/Header'
import {TableOfContents} from '../table-of-contents/TableOfContents'
import bodyStyles from '../../../css/prose.module.css'
import {IndexCards} from '../index-cards/IndexCards'
import {useColorMode} from '../../context/color-modes/useColorMode'
import {getComponents} from '../../mdx-components/mdx-components'
import {SkipToMainContent} from '../skip-to-main-content/SkipToMainContent'

const {publicRuntimeConfig} = getConfig()

export function Theme({children, pageOpts}: NextraThemeLayoutProps) {
  const {title, frontMatter, headings, filePath, pageMap, route} = pageOpts
  const {locale = 'en-US', defaultLocale} = useRouter()
  const fsPath = useFSRoute()
  const {colorMode} = useColorMode()
  const {activePath, topLevelNavbarItems, docsDirectories, flatDocsDirectories} = useMemo(
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
  const isIndexPage = /index\.mdx?$/.test(filePath) && !isHomePage && !frontMatter['show-tabs']
  const data = !isHomePage && activePath[activePath.length - 2]
  const filteredTabData: MdxFile[] =
    data && data.kind === 'Folder'
      ? ((data as Folder).children.filter(child => child.kind === 'MdxPage') as MdxFile[])
      : []

  return (
    <>
      <BrandThemeProvider dir="ltr" colorMode={colorMode}>
        <ThemeProvider colorMode={colorMode}>
          <BaseStyles>
            <Head>
              <title>{title}</title>
              <meta name="og:image" content={frontMatter.image} />
            </Head>
            <AnimationProvider runOnce visibilityOptions={1} autoStaggerChildren={false}>
              <Animate animate="fade-in">
                <PRCBox
                  sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 99,
                  }}
                >
                  <SkipToMainContent href="#main">Skip to main content</SkipToMainContent>
                  <Header
                    pageMap={pageMap}
                    docsDirectories={docsDirectories}
                    menuItems={topLevelNavbarItems}
                    siteTitle={siteTitle}
                  />
                </PRCBox>
                <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
                  <PageLayout.Content padding="normal">
                    <main id="main">
                      <PRCBox sx={!isHomePage && {display: 'flex', maxWidth: 1600, margin: '0 auto'}}>
                        <PRCBox sx={!isHomePage && {maxWidth: 800, width: '100%', margin: '0 auto'}}>
                          <Stack direction="vertical" padding="none" gap="spacious">
                            {!isHomePage && (
                              <>
                                {activePath.length && (
                                  <Breadcrumbs>
                                    {siteTitle && (
                                      <Breadcrumbs.Item
                                        as={NextLink}
                                        href="/"
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
                                          as={NextLink}
                                          key={item.name}
                                          href={item.route}
                                          selected={index === activePath.length - 1}
                                          sx={{
                                            textTransform: 'capitalize',
                                            color: 'var(--brand-InlineLink-color-rest)',
                                          }}
                                        >
                                          {item.title.replace(/-/g, ' ')}
                                        </Breadcrumbs.Item>
                                      )
                                    })}
                                  </Breadcrumbs>
                                )}

                                <Box>
                                  <Stack direction="vertical" padding="none" gap={12} alignItems="flex-start">
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
                                    {frontMatter.image && (
                                      <Box paddingBlockStart={16}>
                                        <Hero.Image src={frontMatter.image} alt={frontMatter['image-alt']} />
                                      </Box>
                                    )}
                                    {frontMatter['action-1-text'] && (
                                      <Box paddingBlockStart={16}>
                                        <ButtonGroup>
                                          <Button as="a" href={frontMatter['action-1-link']}>
                                            {frontMatter['action-1-text']}
                                          </Button>
                                          {frontMatter['action-2-text'] && (
                                            <Button as="a" variant="secondary" href={frontMatter['action-2-link']}>
                                              {frontMatter['action-2-text']}
                                            </Button>
                                          )}
                                        </ButtonGroup>
                                      </Box>
                                    )}
                                  </Stack>
                                </Box>
                                {Boolean(frontMatter['show-tabs']) && <UnderlineNav tabData={filteredTabData} />}
                              </>
                            )}
                            <article className={route !== '/' && !isIndexPage ? bodyStyles.Prose : ''}>
                              {isIndexPage ? (
                                <IndexCards folderData={flatDocsDirectories} route={route} />
                              ) : (
                                <MDXProvider components={getComponents()}>{children}</MDXProvider>
                              )}
                            </article>
                            <footer>
                              <Box marginBlockStart={64}>
                                <Stack direction="vertical" padding="none" gap={16}>
                                  <Stack direction="horizontal" padding="none" alignItems="center" gap={8}>
                                    <PencilIcon size={16} fill="var(--brand-InlineLink-color-rest)" />

                                    <InlineLink
                                      href={`${publicRuntimeConfig.repo}/blob/main/${
                                        publicRuntimeConfig.repoSrcPath ? `${publicRuntimeConfig.repoSrcPath}/` : ''
                                      }${filePath}`}
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
                          </Stack>
                        </PRCBox>
                        {!isHomePage && headings.length > 0 && (
                          <PRCBox sx={{py: 2, pr: 3, display: ['none', null, null, null, 'block']}}>
                            <TableOfContents headings={headings} />
                          </PRCBox>
                        )}
                      </PRCBox>
                    </main>
                  </PageLayout.Content>
                  <PageLayout.Pane
                    aria-label="Sticky pane"
                    width="small"
                    sticky
                    padding="none"
                    position="start"
                    hidden={{narrow: true}}
                    divider="line"
                  >
                    <Sidebar pageMap={docsDirectories} />
                  </PageLayout.Pane>
                </PageLayout>
              </Animate>
            </AnimationProvider>
          </BaseStyles>
        </ThemeProvider>
      </BrandThemeProvider>
    </>
  )
}

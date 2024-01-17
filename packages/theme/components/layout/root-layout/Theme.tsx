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
import {RelatedContentLink, RelatedContentLinks} from '../related-content-links/RelatedContentLinks'

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

  /**
   * Uses a frontmatter 'keywords' value (as an array)
   * to find adjacent pages that share the same values.
   * @returns {RelatedContentLink[]}
   */
  const getRelatedPages = () => {
    const currentPageKeywords = frontMatter.keywords || []
    const relatedLinks = frontMatter['related'] || []
    const matches: RelatedContentLink[] = []

    // 1. Check keywords property and find local matches
    for (const page of flatDocsDirectories) {
      if (page.route === route) continue

      if ('frontMatter' in page) {
        const pageKeywords = page.frontMatter?.keywords || []
        const intersection = pageKeywords.filter(keyword => currentPageKeywords.includes(keyword))

        if (intersection.length) {
          matches.push(page)
        }
      }
    }

    // 2. Check related property for internal and external links
    for (const link of relatedLinks) {
      if (!link.title || !link.href || link.href === route) continue

      if (link.href.startsWith('/')) {
        const page = flatDocsDirectories.find(localPage => localPage.route === link.href) as
          | RelatedContentLink
          | undefined

        if (page) {
          const entry = {
            ...page,
            title: link.title || page.title,
            route: link.href || page.route,
          }
          matches.push(entry)
        }
      } else {
        matches.push({...link, route: link.href})
      }
    }

    return matches
  }

  return (
    <>
      <BrandThemeProvider dir="ltr" colorMode={colorMode}>
        <ThemeProvider colorMode={colorMode}>
          <BaseStyles>
            <Head>
              <title>{title}</title>
              {frontMatter.description && <meta name="description" content={frontMatter.description} />}
              <meta property="og:type" content="website" />
              <meta property="og:title" content={title} />
              {frontMatter.description && <meta property="og:description" content={frontMatter.description} />}
              <meta
                property="og:image"
                content={
                  frontMatter.image ||
                  'https://github.com/primer/brand/assets/19292210/8562a9a5-a1e4-4722-9ec7-47ebccd5901e'
                }
              />
              {/* X (Twitter) OG */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={title} />
              {frontMatter.description && <meta name="twitter:description" content={frontMatter.description} />}
              <meta
                name="twitter:image"
                content={
                  frontMatter.image ||
                  'https://github.com/primer/brand/assets/19292210/8562a9a5-a1e4-4722-9ec7-47ebccd5901e'
                }
              />
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
                    <div id="main">
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
                                <>
                                  <MDXProvider components={getComponents()}>{children}</MDXProvider>
                                  {getRelatedPages().length > 0 && (
                                    <PRCBox sx={{pt: 5}}>
                                      <RelatedContentLinks links={getRelatedPages()} />
                                    </PRCBox>
                                  )}
                                </>
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
                        <PRCBox sx={{py: 2, pr: 3, display: ['none', null, null, null, 'block']}}>
                          <PRCBox
                            sx={{
                              position: 'sticky',
                              top: 112,
                              width: 220,
                            }}
                          >
                            {!isHomePage && headings.length > 0 && <TableOfContents headings={headings} />}
                          </PRCBox>
                        </PRCBox>
                      </PRCBox>
                    </div>
                  </PageLayout.Content>
                  <PageLayout.Pane
                    aria-label="Side navigation"
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

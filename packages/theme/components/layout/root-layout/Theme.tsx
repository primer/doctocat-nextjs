'use client'
import React, {PropsWithChildren, useMemo} from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import type {Folder, MdxFile, PageMapItem} from 'nextra'
import {useFSRoute} from 'nextra/hooks'
import {BaseStyles, Box as PRCBox, Breadcrumbs, PageLayout, ThemeProvider} from '@primer/react'
import '@primer/primitives/dist/css/functional/themes/light.css'
import '@primer/primitives/dist/css/functional/themes/dark.css'
import {
  Animate,
  AnimationProvider,
  Box,
  ButtonGroup,
  ThemeProvider as BrandThemeProvider,
  Button,
  Hero,
  Heading,
  Stack,
  Text,
} from '@primer/react-brand'
import {Sidebar} from '../sidebar/Sidebar'
import {UnderlineNav} from '../underline-nav/UnderlineNav'

import '@primer/react-brand/fonts/fonts.css'
import '@primer/react-brand/lib/css/main.css'

import {normalizePages} from 'nextra/normalize-pages'
import {usePathname} from 'next/navigation'

import {Header} from '../header/Header'
import {IndexCards} from '../index-cards/IndexCards'
import {useColorMode} from '../../context/color-modes/useColorMode'
import {SkipToMainContent} from '../skip-to-main-content/SkipToMainContent'
import {RelatedContentLinks} from '../related-content-links/RelatedContentLinks'
import {getRelatedPages} from '../related-content-links/getRelatedPages'
import {hasChildren} from '../../../helpers/hasChildren'
import {Footer} from '../footer/Footer'

const repoSrcPath = process.env.NEXT_PUBLIC_REPO_SRC_PATH || ''
const repoURL = process.env.NEXT_PUBLIC_REPO || ''

if (!repoURL) {
  // eslint-disable-next-line no-console
  console.warn(
    'NEXT_PUBLIC_REPO is not set. Edit the .env.local file to set the NEXT_PUBLIC_REPO environment variable.',
  )
}

export type ThemeProps = PropsWithChildren<{
  pageMap: PageMapItem[]
}>

export function Theme({pageMap, children}: ThemeProps) {
  const pathname = usePathname()
  const pathHasTrailingSlash = pathname.endsWith('/')

  const normalizedPages = normalizePages({
    list: pageMap,
    route: pathname,
  })

  const route = usePathname()

  const fsPath = useFSRoute()
  const {colorMode} = useColorMode()
  const {activePath, flatDocsDirectories} = useMemo(
    () =>
      normalizePages({
        list: pageMap,
        route: fsPath,
      }),
    [pageMap, fsPath],
  )

  // eslint-disable-next-line i18n-text/no-en
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'Example Site'
  const isHomePage = route === '/'

  const activeFile = isHomePage
    ? undefined
    : (normalizedPages.flatDocsDirectories.find(
        item => `${item.route}${pathHasTrailingSlash ? '/' : ''}` === pathname,
      ) as MdxFile)

  const activeMetadata = activeFile?.frontMatter || {}
  const filePath = activeMetadata.filePath || ''
  const title = activeMetadata.title || ''

  const isIndexPage = /index\.mdx?$/.test(filePath) && !isHomePage && activeMetadata['show-tabs'] === undefined
  const data = !isHomePage && activePath[activePath.length - 2]
  const filteredTabData: MdxFile[] = data && hasChildren(data) ? ((data as Folder).children as MdxFile[]) : []

  const relatedLinks = getRelatedPages(route, activeMetadata, flatDocsDirectories)
  const disablePageAnimation = activeMetadata?.options?.disablePageAnimation || false

  return (
    <>
      <BrandThemeProvider dir="ltr" colorMode={colorMode}>
        <ThemeProvider colorMode={colorMode}>
          <BaseStyles>
            <Head>
              <title>{title}</title>
              {activeMetadata.description && <meta name="description" content={activeMetadata.description} />}
              <meta property="og:type" content="website" />
              <meta property="og:title" content={title} />
              {activeMetadata.description && <meta property="og:description" content={activeMetadata.description} />}
              <meta property="og:image" content={activeMetadata.image || '/og-image.png'} />
              {/* X (Twitter) OG */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={title} />
              {activeMetadata.description && <meta name="twitter:description" content={activeMetadata.description} />}
              <meta name="twitter:image" content={activeMetadata.image || '/og-image.png'} />
            </Head>

            <ContentWrapper disableAnimations={disablePageAnimation}>
              <PRCBox
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 99,
                }}
              >
                <SkipToMainContent href="#main">Skip to main content</SkipToMainContent>
                <Header flatDocsDirectories={flatDocsDirectories} siteTitle={siteTitle} pageMap={pageMap} />
              </PRCBox>
              <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
                <PageLayout.Content padding="normal">
                  <div id="main">
                    <PRCBox sx={!isHomePage && {maxWidth: 1200, width: '100%', margin: '0 auto'}}>
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
                                {activeMetadata?.title && (
                                  <Heading as="h1" size="3">
                                    {activeMetadata.title}
                                  </Heading>
                                )}
                                {activeMetadata?.description && (
                                  <Text as="p" variant="muted" size="300">
                                    {activeMetadata.description}
                                  </Text>
                                )}
                                {activeMetadata?.image && (
                                  <Box paddingBlockStart={16} style={{width: '100%'}}>
                                    <Hero.Image src={activeMetadata.image} alt={activeMetadata['image-alt']} />
                                  </Box>
                                )}
                                {activeMetadata && activeMetadata['action-1-text'] && (
                                  <Box paddingBlockStart={16}>
                                    <ButtonGroup>
                                      <Button as="a" href={activeMetadata['action-1-link']}>
                                        {activeMetadata['action-1-text']}
                                      </Button>
                                      {activeMetadata['action-2-text'] && (
                                        <Button as="a" variant="secondary" href={activeMetadata['action-2-link']}>
                                          {activeMetadata['action-2-text']}
                                        </Button>
                                      )}
                                    </ButtonGroup>
                                  </Box>
                                )}
                              </Stack>
                            </Box>
                            {activeMetadata && activeMetadata['show-tabs'] && (
                              <UnderlineNav tabData={filteredTabData} />
                            )}
                          </>
                        )}
                        <article>
                          {isIndexPage ? (
                            <IndexCards folderData={flatDocsDirectories} route={route} />
                          ) : (
                            <>
                              <>{children}</>

                              {relatedLinks.length > 0 && (
                                <PRCBox sx={{pt: 5}}>
                                  <RelatedContentLinks links={relatedLinks} />
                                </PRCBox>
                              )}
                            </>
                          )}
                        </article>
                        <Footer filePath={filePath} repoURL={repoURL} repoSrcPath={repoSrcPath} />
                      </Stack>
                    </PRCBox>
                  </div>
                </PageLayout.Content>
                <PageLayout.Pane
                  aria-label="Side navigation"
                  width="small"
                  sticky
                  offsetHeader={65}
                  padding="none"
                  position="start"
                  hidden={{narrow: true}}
                  divider="line"
                >
                  <Sidebar pageMap={pageMap} />
                </PageLayout.Pane>
              </PageLayout>
            </ContentWrapper>
          </BaseStyles>
        </ThemeProvider>
      </BrandThemeProvider>
    </>
  )
}

type ContentWrapperProps = PropsWithChildren<{
  disableAnimations?: boolean
}>

/**
 * The fade in animation masks the layout repainting issues.
 * That animation however, interferes with nested AnimationProviders so we need
 * to disable it for certain pages that use that.
 */
function ContentWrapper({children, disableAnimations}: ContentWrapperProps) {
  if (disableAnimations) {
    return <>{children}</>
  }

  return (
    <>
      <AnimationProvider runOnce visibilityOptions={1} autoStaggerChildren={false}>
        <Animate animate="fade-in">{children}</Animate>
      </AnimationProvider>
    </>
  )
}

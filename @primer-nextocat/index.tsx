import Head from "next/head";
import React from "react";
import type { NextraThemeLayoutProps } from "nextra";
import { Sidebar } from "./sidebar/Sidebar";
import {
  MinimalFooter,
  ThemeProvider as BrandThemeProvider,
  AnimationProvider,
  Animate,
  InlineLink,
  Box,
  Heading,
  Grid,
  Stack,
} from "@primer/react-brand";
import { BaseStyles, PageLayout, ThemeProvider } from "@primer/react";

import "@primer/react-brand/lib/css/main.css";
import "@primer/react-brand/fonts/fonts.css";

import globalStyles from "./css/global.module.css";
import bodyStyles from "./css/prose.module.css";
import { Header } from "./header/Header";

import themeConfig from "../theme.config";

export default function Layout({ children, pageOpts }: NextraThemeLayoutProps) {
  const { title, frontMatter, headings, filePath, pageMap, route } = pageOpts;

  return (
    <>
      {/* @ts-ignore */}
      <BaseStyles>
        <BrandThemeProvider
          dir="ltr"
          colorMode="light"
          className={globalStyles.body}
        >
          <ThemeProvider colorMode="light">
            <Head>
              <title>{title}</title>
              <meta name="og:image" content={frontMatter.image} />
            </Head>
            <AnimationProvider
              runOnce
              visibilityOptions={1}
              autoStaggerChildren={false}
            >
              <Animate animate="fade-in">
                <PageLayout
                  containerWidth="xlarge"
                  padding="none"
                  sx={{ pt: 76 }}
                >
                  <PageLayout.Header>
                    <Header pageMap={pageMap} />
                  </PageLayout.Header>
                  <PageLayout.Content padding="normal">
                    <Grid>
                      <Grid.Column span={{ large: 9 }}>
                        <article
                          className={route != "/" ? bodyStyles.Prose : ""}
                        >
                          {children}
                          <Box marginBlockStart={64}>
                            <p>
                              <InlineLink
                                href={`${themeConfig.docsRepositoryBase}/blob/main/${filePath}`}
                              >
                                Edit this page
                              </InlineLink>
                            </p>
                          </Box>
                        </article>
                      </Grid.Column>
                      <Grid.Column span={{ large: 3 }}>
                        {/* <TableOfContents headings={headings} /> */}
                      </Grid.Column>
                    </Grid>
                  </PageLayout.Content>
                  <PageLayout.Pane
                    sticky
                    offsetHeader={76}
                    padding="condensed"
                    position="start"
                    divider="line"
                  >
                    <Sidebar routes={pageMap} />
                  </PageLayout.Pane>
                  <PageLayout.Footer>
                    <MinimalFooter />
                  </PageLayout.Footer>
                </PageLayout>
              </Animate>
            </AnimationProvider>
          </ThemeProvider>
        </BrandThemeProvider>
      </BaseStyles>
    </>
  );
}

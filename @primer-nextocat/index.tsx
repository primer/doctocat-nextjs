import Head from "next/head";
import React, { useEffect } from "react";
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
  Text,
  useTheme,
} from "@primer/react-brand";
import {
  Box as PRCBox,
  ActionList,
  ActionMenu,
  BaseStyles,
  PageLayout,
  ThemeProvider,
} from "@primer/react";

import "@primer/react-brand/lib/css/main.css";
import "@primer/react-brand/fonts/fonts.css";

import bodyStyles from "./css/prose.module.css";
import { Header } from "./header/Header";

import themeConfig from "../theme.config";
import { TableOfContents } from "./components/table-of-contents/TableOfContents";
import { MoonIcon, SunIcon, SyncIcon } from "@primer/octicons-react";

export default function Layout({ children, pageOpts }: NextraThemeLayoutProps) {
  const [colorMode, setColorMode] = React.useState<"light" | "dark">("light");

  const { title, frontMatter, headings, filePath, pageMap, route } = pageOpts;

  const isHomePage = route === "/";

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", colorMode);
  }, [colorMode]);

  return (
    <BrandThemeProvider dir="ltr" colorMode={colorMode}>
      <ThemeProvider colorMode={colorMode}>
        {/* @ts-ignore */}
        <BaseStyles>
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
                    <Grid.Column span={!isHomePage && { large: 9 }}>
                      <article className={route != "/" ? bodyStyles.Prose : ""}>
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
                    {!isHomePage && (
                      <Grid.Column span={{ large: 3 }}>
                        <TableOfContents headings={headings} />
                      </Grid.Column>
                    )}
                  </Grid>
                </PageLayout.Content>
                <PageLayout.Pane
                  sticky
                  offsetHeader={76}
                  padding="condensed"
                  position="start"
                  divider="line"
                  width={{
                    min: `150px`,
                    max: `240px`,
                    default: `180px`,
                  }}
                  resizable
                >
                  <Sidebar routes={pageMap} />
                  <PRCBox
                    sx={{
                      borderTop: "1px solid var(--brand-color-border-muted)",
                      mt: 4,
                      pt: 4,
                    }}
                  >
                    <ActionMenu>
                      <ActionMenu.Button
                        variant="invisible"
                        alignContent="start"
                        block
                        leadingVisual={
                          colorMode === "light" ? SunIcon : MoonIcon
                        }
                      >
                        {colorMode === "light" && "Light"}
                        {colorMode === "dark" && "Dark"}
                      </ActionMenu.Button>

                      <ActionMenu.Overlay>
                        <ActionList>
                          <ActionList.Item
                            onSelect={() => setColorMode("light")}
                          >
                            Light
                          </ActionList.Item>
                          <ActionList.Divider />
                          <ActionList.Item
                            onSelect={() => setColorMode("dark")}
                          >
                            Dark
                          </ActionList.Item>
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
  );
}

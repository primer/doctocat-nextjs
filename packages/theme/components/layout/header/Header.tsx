import React, {useEffect, useRef, useState} from 'react'
import {MarkGithubIcon, MoonIcon, SearchIcon, SunIcon, ThreeBarsIcon, XIcon} from '@primer/octicons-react'
import {IconButton} from '@primer/react'
import {Stack, Text} from '@primer/react-brand'
import {clsx} from 'clsx'
import {PageMapItem} from 'nextra'

import Link from 'next/link'
import styles from './Header.module.css'
import {NavDrawer} from '../nav-drawer/NavDrawer'
import {useNavDrawerState} from '../nav-drawer/useNavDrawerState'
import {useColorMode} from '../../context/color-modes/useColorMode'

import {DocsItem, ExtendedPageItem} from '../../../types'

import {GlobalSearch} from '../global-search/GlobalSearch'
import {FocusOn} from 'react-focus-on'
import {LinksDropdown} from '../links-dropdown/LinksDropdown'

// Attempt to find the closest URL match based on the current site URL
const findClosestUrlMatchIdx = (items: ExtendedPageItem[]): number => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  if (!siteUrl || items.length === 0) return 0

  try {
    const siteUrlObj = new URL(siteUrl)
    const siteUrlPath = siteUrlObj.pathname

    // Find items with closest path match
    let bestMatchIndex = 0
    let bestMatchLength = 0

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      // Handle both absolute and relative URLs
      const itemPath = item.href.startsWith('http') ? new URL(item.href).pathname : item.href

      if (siteUrlPath.startsWith(itemPath) && itemPath.length > bestMatchLength) {
        bestMatchIndex = i
        bestMatchLength = itemPath.length
      }
    }

    return bestMatchIndex
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return 0
  }
}

type HeaderProps = {
  pageMap: PageMapItem[]
  flatDocsDirectories: DocsItem[]
  siteTitle: string
}

export function Header({pageMap, siteTitle, flatDocsDirectories}: HeaderProps) {
  const searchRef = useRef<HTMLInputElement | null>(null)
  const {colorMode, setColorMode} = useColorMode()
  const searchTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useNavDrawerState('768')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const headerExternalLinks = (pageMap as ExtendedPageItem[]).filter(page => page.type === 'page')
  const activePageIndex = findClosestUrlMatchIdx(headerExternalLinks)
  headerExternalLinks[activePageIndex].active = true

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorMode)
  }, [colorMode])

  const closeSearch = () => {
    setIsSearchOpen(false)
    setTimeout(() => {
      searchTriggerRef.current?.focus()
    }, 0)
  }

  return (
    <nav
      className={clsx(styles.Header, isSearchOpen && styles['Header--searchAreaOpen'])}
      role="navigation"
      aria-label="Header Navigation"
    >
      <div className={styles.Header__start}>
        <Link href="/" className={styles.Header__siteTitle}>
          <MarkGithubIcon size={24} />
          <Text as="p" size="300" weight="semibold">
            {siteTitle}
          </Text>
        </Link>
        <Text as="span" className={styles.Header__separator} weight="semibold" aria-hidden>
          &#47;
        </Text>
        <LinksDropdown className={styles.Header__linksDropdown} items={headerExternalLinks} />
      </div>
      <div className={styles.Header__end}>
        <Stack className={styles.Header__links} direction="horizontal" padding="none" gap={24}>
          {headerExternalLinks.map(item => (
            <Link key={item.href} className={styles.Header__link} href={item.href}>
              <Text size="200" variant={item.active ? 'default' : 'muted'}>
                {item.title}
              </Text>
            </Link>
          ))}
        </Stack>
        <div className={clsx(styles.Header__searchArea, isSearchOpen && styles['Header__searchArea--open'])}>
          <FocusOn enabled={isSearchOpen} onEscapeKey={closeSearch} onClickOutside={closeSearch}>
            <GlobalSearch
              ref={searchRef}
              siteTitle={siteTitle}
              flatDocsDirectories={flatDocsDirectories}
              onNavigate={() => closeSearch()}
            />
            <div className={styles.Header__searchHeaderBanner}>
              <Stack direction="horizontal" padding="none" gap={4} alignItems="center" justifyContent="space-between">
                <Text as="p" size="300" weight="semibold">
                  Search
                </Text>
                <IconButton icon={XIcon} variant="invisible" aria-label="Close search" onClick={closeSearch} />
              </Stack>
            </div>
          </FocusOn>
        </div>
        <div>
          <Stack direction="horizontal" padding="none" gap={4}>
            <IconButton
              icon={colorMode === 'light' ? SunIcon : MoonIcon}
              variant="invisible"
              aria-label={`Change color mode. Active mode is ${colorMode}.`}
              onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
            />
            <IconButton
              ref={searchTriggerRef}
              className={styles.Header__searchButton}
              icon={SearchIcon}
              variant="invisible"
              aria-label={`Open search`}
              onClick={() => setIsSearchOpen(true)}
            />
            <div className={styles.Header__navDrawerContainer}>
              <IconButton
                icon={ThreeBarsIcon}
                variant="invisible"
                aria-label="Menu"
                aria-expanded={isNavDrawerOpen}
                onClick={() => setIsNavDrawerOpen(true)}
              />
              <NavDrawer isOpen={isNavDrawerOpen} onDismiss={() => setIsNavDrawerOpen(false)} navItems={pageMap} />
            </div>
          </Stack>
        </div>
      </div>
    </nav>
  )
}

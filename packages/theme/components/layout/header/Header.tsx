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
import {DocsItem} from '../../../types'
import {GlobalSearch} from '../global-search/GlobalSearch'
import {FocusOn} from 'react-focus-on'

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
      <Link href="/" className={styles.Header__siteTitle}>
        <MarkGithubIcon size={24} />
        <Text as="p" size="300" weight="semibold">
          {siteTitle}
        </Text>
      </Link>
      <div className={clsx(styles.Header__searchArea, isSearchOpen && styles['Header__searchArea--open'])}>
        <FocusOn enabled={isSearchOpen} onEscapeKey={closeSearch} onClickOutside={closeSearch}>
          <GlobalSearch ref={searchRef} siteTitle={siteTitle} flatDocsDirectories={flatDocsDirectories} />
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
    </nav>
  )
}

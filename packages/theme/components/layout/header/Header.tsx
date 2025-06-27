import React, {useEffect, useRef, useState} from 'react'
import {
  ArrowUpRightIcon,
  MarkGithubIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  ThreeBarsIcon,
  XIcon,
} from '@primer/octicons-react'
import {IconButton} from '@primer/react'
import {Stack, Text} from '@primer/react-brand'
import {clsx} from 'clsx'
import type {PageMapItem} from 'nextra'

import Link from 'next/link'
import styles from './Header.module.css'
import {NavDrawer} from '../nav-drawer/NavDrawer'
import {useNavDrawerState} from '../nav-drawer/useNavDrawerState'
import {useColorMode} from '../../context/color-modes/useColorMode'

import type {DocsItem} from '../../../types'

import {GlobalSearch} from '../global-search/GlobalSearch'
import {FocusOn} from 'react-focus-on'
import {LinksDropdown} from '../links-dropdown/LinksDropdown'
import {useConfig} from '../../context/useConfig'

type HeaderProps = {
  flatDocsDirectories: DocsItem[]
  siteTitle: string
  pageMap: PageMapItem[]
}

export function Header({siteTitle, flatDocsDirectories, pageMap}: HeaderProps) {
  const searchRef = useRef<HTMLInputElement | null>(null)
  const {colorMode, setColorMode} = useColorMode()
  const searchTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useNavDrawerState('768')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const {headerLinks} = useConfig()

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
          <Text className={styles.Header__siteTitleText} as="p" size="200" weight="semibold">
            {siteTitle}
          </Text>
        </Link>
        <Text as="span" className={styles.Header__separator} weight="semibold" aria-hidden>
          &#47;
        </Text>
        {headerLinks.length > 0 && <LinksDropdown className={styles.Header__linksDropdown} items={headerLinks} />}
      </div>
      <div className={styles.Header__end}>
        <ul className={styles.Header__links}>
          {headerLinks.map(link => (
            <li key={link.href}>
              <a
                className={styles.Header__link}
                href={link.href}
                aria-current={link.isActive ? 'page' : undefined}
                {...(link.isExternal && {target: '_blank', rel: 'noopener noreferrer'})}
              >
                <Text
                  size="200"
                  variant={link.isActive ? 'default' : 'muted'}
                  weight={link.isActive ? 'semibold' : 'normal'}
                >
                  {link.title}
                  {link.isExternal && (
                    <ArrowUpRightIcon
                      className={styles.Header__externalLinkIcon}
                      size={10}
                      aria-label="External link"
                    />
                  )}
                </Text>
              </a>
            </li>
          ))}
        </ul>
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
              aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
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
              <NavDrawer isOpen={isNavDrawerOpen} onDismiss={() => setIsNavDrawerOpen(false)} pageMap={pageMap} />
            </div>
          </Stack>
        </div>
      </div>
    </nav>
  )
}

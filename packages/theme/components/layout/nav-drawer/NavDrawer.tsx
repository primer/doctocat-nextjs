import React from 'react'
import NextLink from 'next/link'
import {IconButton, Link, ThemeProvider} from '@primer/react'
import {XIcon} from '@primer/octicons-react'

import {Drawer} from './Drawer'
import type {PageMapItem} from 'nextra'
import {Sidebar} from '../sidebar/Sidebar'
import {useColorMode} from '../../context/color-modes/useColorMode'
import styles from './NavDrawer.module.css'

type NavDrawerProps = {
  isOpen: boolean
  onDismiss: () => void
  navItems?: PageMapItem[]
}

export function NavDrawer({isOpen, onDismiss, navItems}: NavDrawerProps) {
  const {colorMode} = useColorMode()
  return (
    <Drawer isOpen={isOpen} onDismiss={onDismiss}>
      <div className={styles.scrollContainer}>
        <div className={styles.header}>
          <div className={styles.headerBorder}>
            <div className={styles.headerContent}>
              <Link as={NextLink} href="https://primer.style" className={styles.headerLink}>
                Explore
              </Link>
              <IconButton icon={XIcon} aria-label="Close" onClick={onDismiss} variant="invisible" />
            </div>
          </div>
          <div className={styles.navContainer}>{/* <PrimerNavItems items={primerNavItems} /> */}</div>
        </div>
        {navItems && navItems.length > 0 ? (
          <ThemeProvider colorMode={colorMode}>
            <div className={styles.sidebarWrapper}>
              <Sidebar pageMap={navItems} />
            </div>
          </ThemeProvider>
        ) : null}
      </div>
    </Drawer>
  )
}

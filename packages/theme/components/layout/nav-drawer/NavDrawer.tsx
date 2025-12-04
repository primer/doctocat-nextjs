import React from 'react'
import NextLink from 'next/link'
import {IconButton, Link, ThemeProvider} from '@primer/react'
import {XIcon} from '@primer/octicons-react'

import {Drawer} from './Drawer'
import {Sidebar} from '../sidebar/Sidebar'
import {useColorMode} from '../../context/color-modes/useColorMode'
import styles from './NavDrawer.module.css'
import type {PageMapItem} from 'nextra'

type NavDrawerProps = {
  isOpen: boolean
  onDismiss: () => void
  pageMap: PageMapItem[]
}

export function NavDrawer({isOpen, onDismiss, pageMap}: NavDrawerProps) {
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
              <IconButton as="button" icon={XIcon} aria-label="Close" onClick={onDismiss} variant="invisible" />
            </div>
          </div>
          <div className={styles.navContainer}>{/* <PrimerNavItems items={primerNavItems} /> */}</div>
        </div>
        <ThemeProvider colorMode={colorMode}>
          <div className={styles.sidebarWrapper}>
            <Sidebar pageMap={pageMap} />
          </div>
        </ThemeProvider>
      </div>
    </Drawer>
  )
}

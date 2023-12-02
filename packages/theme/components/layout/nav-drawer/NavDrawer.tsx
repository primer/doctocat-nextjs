import React from 'react'
import {Box, Button, IconButton, Link, LinkButton, Text, ThemeProvider} from '@primer/react'
import {ChevronDownIcon, ChevronUpIcon, XIcon} from '@primer/octicons-react'
import NextLink from 'next/link'

import {Drawer} from './Drawer'
import {PageItem} from 'nextra/normalize-pages'
import {Sidebar} from '../sidebar/Sidebar'

type NavDrawerProps = {
  isOpen: boolean
  onDismiss: () => void
  navItems?: PageItem[]
}

export function NavDrawer({isOpen, onDismiss, navItems}: NavDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onDismiss={onDismiss}>
      <Box
        style={{overflow: 'auto', WebkitOverflowScrolling: 'touch'}}
        sx={{flexDirection: 'column', height: '100%', bg: 'canvas.default', display: 'flex'}}
      >
        <Box
          sx={{flexDirection: 'column', flex: '0 0 auto', color: 'fg.default', bg: 'canvas.default', display: 'flex'}}
        >
          <Box
            sx={{
              borderWidth: 0,
              borderRadius: 0,
              borderBottomWidth: 1,
              borderColor: 'border.muted',
              borderStyle: 'solid',
            }}
          >
            <Box sx={{py: 20, pl: 4, pr: 3, alignItems: 'center', justifyContent: 'space-between', display: 'flex'}}>
              <Link href="https://primer.style" sx={{fontWeight: 'bold', color: 'inherit'}}>
                Explore
              </Link>
              <IconButton icon={XIcon} aria-label="Close" onClick={onDismiss} variant="invisible" />
            </Box>
          </Box>
          <Box sx={{flexDirection: 'column', display: 'flex'}}>{/* <PrimerNavItems items={primerNavItems} /> */}</Box>
        </Box>
        {navItems && navItems.length > 0 ? (
          <ThemeProvider colorMode="day">
            <Box
              sx={{
                flexDirection: 'column',
                flex: '1 0 auto',
                color: 'fg.default',
                bg: 'canvas.default',
                display: 'flex',
              }}
            >
              <Sidebar pageMap={navItems} />
            </Box>
          </ThemeProvider>
        ) : null}
      </Box>
    </Drawer>
  )
}

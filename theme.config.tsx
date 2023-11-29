import {Icon, RepoIcon} from '@primer/octicons-react'
import React from 'react'

export type ThemeConfig = {
  docsRepositoryBase: string
  sidebarLinks: {
    title: string
    href: string
    leadingIcon?: Icon
  }[]
}

const config: ThemeConfig = {
  docsRepositoryBase: 'https://github.com/rezrah/nextocat',
  sidebarLinks: [
    {
      title: 'GitHub',
      href: 'https://github.com/rezrah/nextocat',
      leadingIcon: RepoIcon,
    },
    {
      title: 'Primer Brand',
      href: 'https://github.com/primer/brand',
      leadingIcon: RepoIcon,
    },
  ],
}

export default config

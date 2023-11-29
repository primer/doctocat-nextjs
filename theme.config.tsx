import React from 'react'
import {Icon, OrganizationIcon, RepoIcon} from '@primer/octicons-react'

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
      title: 'Primer',
      href: 'https://primer.style',
      leadingIcon: OrganizationIcon,
    },
  ],
}

export default config

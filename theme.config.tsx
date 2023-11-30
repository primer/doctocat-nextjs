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
  docsRepositoryBase: 'https://github.com/primer/nextocat',
  sidebarLinks: [
    {
      title: 'GitHub',
      href: 'https://github.com/primer/nextocat',
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

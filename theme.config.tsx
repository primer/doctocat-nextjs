import React from 'react'
import {OrganizationIcon, RepoIcon} from '@primer/octicons-react'
import type {ThemeConfig} from './@primer-nextocat'

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

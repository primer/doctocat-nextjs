'use client'
import React from 'react'
import {NavList} from '@primer/react'
import {Folder, MdxFile, PageMapItem} from 'nextra'
import {useRouter} from 'next/router'
import {Item} from 'nextra/normalize-pages'
import themeConfig, {ThemeConfig} from '../../../../theme.config'

import styles from './Sidebar.module.css'
import {ArrowUpRightIcon} from '@primer/octicons-react'

type SidebarProps = {
  pageMap: DocsItem[]
}

type FolderWithoutChildren = Omit<Folder, 'children'>

type DocsItem = (MdxFile | FolderWithoutChildren) & {
  title: string
  type: string
  children?: DocsItem[]
  firstChildRoute?: string
  withIndexPage?: boolean
  isUnderCurrentDocsTree?: boolean
}

const {sidebarLinks} = themeConfig

export function Sidebar({pageMap}: SidebarProps) {
  const router = useRouter()
  const basePath = router.basePath
  const currentRoute = router.pathname

  return (
    <NavList className={styles.NavList}>
      <NavList.Group title="" sx={{mb: 24}}>
        {sidebarLinks &&
          sidebarLinks.length > 0 &&
          sidebarLinks.map(link => {
            const {leadingIcon: Icon} = link
            const isExternalUrl = link.href.startsWith('http')
            return (
              <NavList.Item key={link.title} href={link.href} target={isExternalUrl ? '_blank' : undefined}>
                {Icon && (
                  <NavList.LeadingVisual>
                    <Icon />
                  </NavList.LeadingVisual>
                )}
                {link.title}
                {isExternalUrl && (
                  <NavList.TrailingVisual>
                    <ArrowUpRightIcon />
                  </NavList.TrailingVisual>
                )}
              </NavList.Item>
            )
          })}
      </NavList.Group>

      {pageMap.map(item => {
        if (item.kind === 'MdxPage' && item.route === '/') return null

        if (item.kind === 'MdxPage') {
          return (
            <NavList.Item
              key={item.name}
              href={`${basePath}${item.route}`}
              sx={{textTransform: 'capitalize'}}
              aria-current={currentRoute === item.route ? 'page' : undefined}
            >
              {item.frontMatter.title || item.name}
            </NavList.Item>
          )
        }
        if (item.kind === 'Folder') {
          const indexPage = item.children.find(child => child.kind === 'MdxPage' && child.name === 'index') as MdxFile
          const subNavName = indexPage.frontMatter.title
          const shouldHideTabbedPages = indexPage.frontMatter['show-tabs'] || false

          if (shouldHideTabbedPages) {
            return (
              <NavList.Item key={indexPage.name} href={`${basePath}${indexPage.route}`}>
                {(indexPage as MdxFile).frontMatter?.title || item.name}
              </NavList.Item>
            )
          }

          return (
            <NavList.Group title={subNavName} key={item.name} sx={{mb: 24}}>
              {item.children
                .sort((a, b) => (a.name === 'index' ? -1 : b.name === 'index' ? 1 : 0)) // puts index page first
                .map((child: DocsItem) => {
                  if ((child as MdxFile).kind === 'MdxPage') {
                    return (
                      <NavList.Item key={child.name} href={`${basePath}${child.route}`}>
                        {(child as MdxFile).frontMatter?.title || item.name}
                      </NavList.Item>
                    )
                  }

                  if ((child as Folder).kind === 'Folder') {
                    const landingPageItem: PageMapItem | undefined = (child as Folder).children.find(
                      innerChild => innerChild.kind === 'MdxPage' && innerChild.name === 'index',
                    )

                    return (
                      <NavList.Item
                        key={(landingPageItem as MdxFile).name}
                        href={`${basePath}${(landingPageItem as MdxFile).route}`}
                        sx={{textTransform: 'capitalize'}}
                      >
                        {(landingPageItem as MdxFile).frontMatter?.title || item.name}
                      </NavList.Item>
                    )
                  }

                  return null
                })}
            </NavList.Group>
          )
        }

        return null
      })}
    </NavList>
  )
}

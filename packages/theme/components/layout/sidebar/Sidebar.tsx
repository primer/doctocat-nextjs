import React, {useMemo} from 'react'
import NextLink from 'next/link'
import {NavList} from '@primer/react'
import {Folder, MdxFile, PageMapItem} from 'nextra'
import {useRouter} from 'next/router'
import getConfig from 'next/config'

import styles from './Sidebar.module.css'
import {LinkExternalIcon} from '@primer/octicons-react'
import type {ThemeConfig} from '../../../index'

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

const {publicRuntimeConfig} = getConfig()

export function Sidebar({pageMap}: SidebarProps) {
  const router = useRouter()

  const {sidebarLinks}: ThemeConfig = publicRuntimeConfig

  /**
   * Sorts the incoming data so that folders with a menu-position frontmatter value
   * are sorted to the top of the list. If a folder does not have a menu-position
   * value, it is sorted to the bottom of the list.
   */
  const reorderedPageMap = useMemo(
    () =>
      [...pageMap].sort((a, b) => {
        if (a.kind === 'Folder' && a.children) {
          const aIndex = a.children.find(child => child.name === 'index' && child.kind === 'MdxPage')
          const aPosition = (aIndex as MdxFile | undefined)?.frontMatter?.['menu-position'] ?? Infinity
          if (b.kind === 'Folder' && b.children) {
            const bIndex = b.children.find(child => child.name === 'index' && child.kind === 'MdxPage')
            const bPosition = (bIndex as MdxFile | undefined)?.frontMatter?.['menu-position'] ?? Infinity
            return aPosition - bPosition
          }
        }
        return 0
      }),
    [pageMap],
  )

  return (
    <div className={styles.Sidebar}>
      <NavList className={styles.NavList} aria-label="Menu links">
        {reorderedPageMap.map(item => {
          if (item.kind === 'MdxPage' && item.route === '/') return null

          if (item.kind === 'MdxPage') {
            return (
              <NavList.Item as={NextLink} key={item.name} href={item.route} sx={{textTransform: 'capitalize'}}>
                {item.frontMatter?.title ?? item.name}
              </NavList.Item>
            )
          }

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (item.kind === 'Folder') {
            const indexPage = (item as Folder).children.find(
              child => child.kind === 'MdxPage' && child.name === 'index',
            ) as MdxFile
            const subNavName = indexPage.frontMatter?.title ?? ''
            const shouldShowTabs = indexPage.frontMatter?.['show-tabs'] ?? false
            if (shouldShowTabs) {
              return (
                <NavList.Item as={NextLink} key={indexPage.name} href={indexPage.route}>
                  {(indexPage as MdxFile).frontMatter?.title || item.name}
                </NavList.Item>
              )
            }

            return (
              <NavList.Group title={subNavName} key={item.name} sx={{mb: 24}}>
                {item.children &&
                  item.children
                    .sort((a, b) => (a.name === 'index' ? -1 : b.name === 'index' ? 1 : 0)) // puts index page first
                    .filter(
                      child =>
                        (child as DocsItem).name !== 'index' ||
                        ((child.name === 'index' && (child as MdxFile).frontMatter?.['show-tabs']) ?? false),
                    ) // only show index page if it has show-tabs
                    .map((child: DocsItem) => {
                      if (child.kind === 'MdxPage') {
                        return (
                          <NavList.Item
                            as={NextLink}
                            key={child.name}
                            href={child.route}
                            aria-current={child.route === router.pathname ? 'page' : undefined}
                          >
                            {(child as MdxFile).frontMatter?.title || item.name}
                          </NavList.Item>
                        )
                      }

                      if ((child as DocsItem).kind === 'Folder') {
                        const landingPageItem: PageMapItem | undefined = (child as Folder).children.find(
                          innerChild => innerChild.kind === 'MdxPage' && innerChild.name === 'index',
                        )
                        return (
                          <NavList.Item
                            as={NextLink}
                            key={(landingPageItem as MdxFile).route}
                            href={(landingPageItem as MdxFile).route}
                            sx={{textTransform: 'capitalize'}}
                            aria-current={(landingPageItem as MdxFile).route === router.pathname ? 'page' : undefined}
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
        {sidebarLinks && sidebarLinks.length > 0 && (
          <NavList.Group title="" sx={{mb: 24}}>
            {sidebarLinks.map(link => {
              const isExternalUrl = link.href.startsWith('http')

              return (
                <NavList.Item
                  as={NextLink}
                  key={link.title}
                  href={link.href}
                  target={isExternalUrl ? '_blank' : undefined}
                >
                  {link.title}
                  {isExternalUrl && (
                    <NavList.TrailingVisual>
                      <LinkExternalIcon />
                    </NavList.TrailingVisual>
                  )}
                </NavList.Item>
              )
            })}
          </NavList.Group>
        )}
      </NavList>
    </div>
  )
}

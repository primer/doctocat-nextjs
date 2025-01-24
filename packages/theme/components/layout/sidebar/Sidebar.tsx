import React, {useMemo} from 'react'
import NextLink from 'next/link'
import {NavList} from '@primer/react'
import {Folder, MdxFile, PageMapItem} from 'nextra'
import {useRouter} from 'next/router'
import getConfig from 'next/config'

import styles from './Sidebar.module.css'
import {LinkExternalIcon} from '@primer/octicons-react'
import type {DocsItem, ThemeConfig} from '../../../index'
import {hasChildren} from '../../../helpers/hasChildren'

type SidebarProps = {
  pageMap: DocsItem[]
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
        if (hasChildren(a) && a.children) {
          const aIndex = a.children.find(child => child.name === 'index' && child.type === 'doc')
          const aPosition = (aIndex as MdxFile | undefined)?.frontMatter?.['menu-position'] ?? Infinity
          if (hasChildren(b) && b.children) {
            const bIndex = b.children.find(child => child.name === 'index' && child.type === 'doc')
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
          if (item.type === 'doc' && item.route === '/') return null

          if (!hasChildren(item) && item.type === 'doc') {
            return (
              <NavList.Item as={NextLink} key={item.name} href={item.route} sx={{textTransform: 'capitalize'}}>
                {(item as MdxFile).frontMatter?.title ?? item.name}
              </NavList.Item>
            )
          }

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (hasChildren(item)) {
            const indexPage = (item as Folder).children.find(child => (child as MdxFile).name === 'index') as MdxFile
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
                    .filter(child => {
                      return (
                        child.name !== 'index' ||
                        ((child.name === 'index' && (child as MdxFile).frontMatter?.['show-tabs']) ?? false)
                      )
                    }) // only show index page if it has show-tabs
                    .map((child: DocsItem) => {
                      if (child.type === 'doc') {
                        return (
                          <NavList.Item
                            as={NextLink}
                            key={child.name}
                            href={child.route}
                            sx={{textTransform: 'capitalize'}}
                            aria-current={child.route === router.pathname ? 'page' : undefined}
                          >
                            {child.title}
                          </NavList.Item>
                        )
                      }

                      if (hasChildren(child)) {
                        const landingPageItem = (child as Folder).children.find(
                          innerChild =>
                            (innerChild as DocsItem).type === 'doc' && (innerChild as DocsItem).name === 'index',
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

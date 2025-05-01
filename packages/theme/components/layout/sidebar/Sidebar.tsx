import React, {useMemo} from 'react'
import NextLink from 'next/link'
import {NavList} from '@primer/react'
import type {Folder, MdxFile, PageMapItem} from 'nextra'

import styles from './Sidebar.module.css'
import {LinkExternalIcon} from '@primer/octicons-react'
import type {DocsItem, ExtendedPageItem} from '../../../index'
import {hasChildren} from '../../../helpers/hasChildren'
import {usePathname} from 'next/navigation'
import {useConfig} from '../../context/useConfig'

const hasShowTabs = (child: ExtendedPageItem): boolean => {
  return child.name === 'index' && (child as MdxFile).frontMatter?.['show-tabs'] === true
}

type SidebarProps = {
  pageMap: PageMapItem[]
}

export function Sidebar({pageMap}: SidebarProps) {
  const pathname = usePathname()
  const {sidebarLinks} = useConfig()

  /**
   * Sorts the incoming data so that folders with a menu-position frontmatter value
   * are sorted to the top of the list. If a folder does not have a menu-position
   * value, it is sorted to the bottom of the list.
   */
  const reorderedPageMap = useMemo(
    () =>
      [...pageMap].sort((a, b) => {
        if (hasChildren(a)) {
          const aIndex = a.children.find(child => (child as MdxFile).name === 'index')
          const aPosition = (aIndex as MdxFile | undefined)?.frontMatter?.['menu-position'] ?? Infinity
          if (hasChildren(b)) {
            const bIndex = b.children.find(child => (child as MdxFile).name === 'index')
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
          if (item.hasOwnProperty('data')) return null

          if (!hasChildren(item)) return null

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
              {item.children
                .sort((a, b) => ((a as MdxFile).name === 'index' ? -1 : (b as MdxFile).name === 'index' ? 1 : 0)) // puts index page first
                // only show index page if it has show-tabs
                .filter(child => (child as MdxFile).name !== 'index' || hasShowTabs(child as ExtendedPageItem))
                .map(child => {
                  if (!hasChildren(child)) {
                    const {name, route} = child as MdxFile

                    return (
                      <NavList.Item
                        as={NextLink}
                        key={name}
                        href={route}
                        aria-current={route === pathname ? 'page' : undefined}
                      >
                        {(child as MdxFile).frontMatter?.title || name}
                      </NavList.Item>
                    )
                  }

                  if (hasChildren(child)) {
                    const landingPageItem = (child as Folder).children.find(
                      innerChild => (innerChild as DocsItem).name === 'index',
                    )

                    return (
                      <NavList.Item
                        as={NextLink}
                        key={(landingPageItem as MdxFile).route}
                        href={(landingPageItem as MdxFile).route}
                        sx={{textTransform: 'capitalize'}}
                        aria-current={(landingPageItem as MdxFile).route === pathname ? 'page' : undefined}
                      >
                        {(landingPageItem as MdxFile).frontMatter?.title || item.name}
                      </NavList.Item>
                    )
                  }
                })}
            </NavList.Group>
          )
        })}
        {sidebarLinks.length > 0 && (
          <NavList.Group title="" sx={{mb: 24}}>
            {sidebarLinks.map(link => {
              return (
                <NavList.Item
                  as={NextLink}
                  key={link.title}
                  href={link.href}
                  {...(link.isExternal && {target: '_blank', rel: 'noopener noreferrer'})}
                  aria-current={link.isActive ? 'page' : undefined}
                >
                  {link.title}
                  {link.isExternal && (
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

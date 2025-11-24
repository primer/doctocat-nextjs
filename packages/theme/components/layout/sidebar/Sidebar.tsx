import React, {useMemo} from 'react'
import NextLink from 'next/link'
import {NavList} from '@primer/react'
import {Heading} from '@primer/react-brand'
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
  const {headerLinks, sidebarLinks} = useConfig()
  const activeHeaderLink = headerLinks.find(link => link.isActive)

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
      {activeHeaderLink && (
        <Heading as="h2" size="6" className={styles.Sidebar__title} id="nav-list-heading">
          {activeHeaderLink.title}
          <span className="visually-hidden"> navigation</span>
        </Heading>
      )}
      <NavList className={styles.NavList} aria-labelledby="nav-list-heading">
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

          const normalizePath = (path: string) => {
            // Remove trailing slash unless it's the root path
            return path === '/' ? path : path.replace(/\/+$/, '')
          }

          return (
            <NavList.Group title={subNavName} key={item.name} style={{marginBottom: 'var(--base-size-24)'}}>
              <NavList.GroupHeading as="h3">
                <NextLink href={item.route}>{subNavName}</NextLink>
              </NavList.GroupHeading>
              {item.children
                .sort((a, b) => {
                  // make sure index page is first
                  if ((a as MdxFile).name === 'index') return -1
                  if ((b as MdxFile).name === 'index') return 1

                  // Check for menu-position property in frontmatter
                  const aPos = (a as MdxFile).frontMatter?.['menu-position']
                  const bPos = (b as MdxFile).frontMatter?.['menu-position']

                  // If both have menu-position, sort by menu-position
                  if (typeof aPos === 'number' && typeof bPos === 'number') {
                    return aPos - bPos
                  }

                  // If only one has menu-position, it comes first
                  if (typeof aPos === 'number') return -1
                  if (typeof bPos === 'number') return 1

                  // Neither has menu-position, sort alphabetically by title or name
                  const aTitle = (a as MdxFile).frontMatter?.title || (a as MdxFile).name
                  const bTitle = (b as MdxFile).frontMatter?.title || (b as MdxFile).name
                  return aTitle.localeCompare(bTitle)
                })
                // only show index page if it has show-tabs
                .filter(child => (child as MdxFile).name !== 'index' || hasShowTabs(child as ExtendedPageItem))
                .map(child => {
                  if (!hasChildren(child)) {
                    const {name, route} = child as MdxFile

                    const cleanPathname = normalizePath(pathname)
                    return (
                      <NavList.Item
                        as={NextLink}
                        key={name}
                        href={route}
                        aria-current={route === cleanPathname ? 'page' : undefined}
                        className={styles.NavListItem}
                      >
                        {(child as MdxFile).frontMatter?.title || name}
                      </NavList.Item>
                    )
                  }

                  if (hasChildren(child)) {
                    const landingPageItem = (child as Folder).children.find(
                      innerChild => (innerChild as DocsItem).name === 'index',
                    ) as MdxFile

                    // Then inside your component where you need to compare paths:
                    const cleanPathname = normalizePath(pathname)
                    const cleanRoute = normalizePath(landingPageItem.route)

                    // For checking if current path is this route or a direct child:
                    const isCurrentOrChild = cleanPathname === cleanRoute || cleanPathname.startsWith(`${cleanRoute}/`)

                    return (
                      <NavList.Item
                        as={NextLink}
                        key={landingPageItem.route}
                        href={landingPageItem.route}
                        style={{textTransform: 'capitalize'}}
                        aria-current={isCurrentOrChild ? 'page' : undefined}
                        className={styles.NavListItem}
                      >
                        {landingPageItem.frontMatter?.title || item.name}
                      </NavList.Item>
                    )
                  }
                })}
            </NavList.Group>
          )
        })}
        {sidebarLinks.length > 0 && (
          <NavList.Group title="" style={{marginBottom: 'var(--base-size-24)'}}>
            {sidebarLinks.map(link => {
              return (
                <NavList.Item
                  as={NextLink}
                  key={link.title}
                  href={link.href}
                  {...(link.isExternal && {target: '_blank', rel: 'noopener noreferrer'})}
                  aria-current={link.isActive ? 'page' : undefined}
                  className={styles.NavListItem}
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

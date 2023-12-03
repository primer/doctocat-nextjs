'use client'
import React from 'react'
import {NavList} from '@primer/react'
import {Folder, MdxFile, PageMapItem} from 'nextra'
import {useRouter} from 'next/router'
import getConfig from 'next/config'

import styles from './Sidebar.module.css'
import {BookmarkIcon, LinkExternalIcon, OrganizationIcon, RepoIcon, StarIcon} from '@primer/octicons-react'
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

function getOcticonForType(type: string) {
  switch (type) {
    case 'repo':
      return RepoIcon
    case 'org':
      return OrganizationIcon
    case 'bookmark':
      return BookmarkIcon
    default:
      return StarIcon
  }
}

export function Sidebar({pageMap}: SidebarProps) {
  const router = useRouter()
  const basePath = router.basePath
  const currentRoute = router.pathname

  const {sidebarLinks}: ThemeConfig = publicRuntimeConfig

  return (
    <NavList className={styles.NavList}>
      {sidebarLinks && sidebarLinks.length > 0 && (
        <NavList.Group title="" sx={{mb: 24}}>
          {sidebarLinks.map(link => {
            const {leadingIcon} = link
            const isExternalUrl = link.href.startsWith('http')
            const LeadingIcon = getOcticonForType(leadingIcon)

            return (
              <NavList.Item key={link.title} href={link.href} target={isExternalUrl ? '_blank' : undefined}>
                <NavList.LeadingVisual>
                  <LeadingIcon />
                </NavList.LeadingVisual>
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
          const shouldShowTabs = indexPage.frontMatter['show-tabs'] || false

          if (shouldShowTabs) {
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
                .filter(
                  child =>
                    child.name !== 'index' || (child.name === 'index' && (child as MdxFile).frontMatter['show-tabs']),
                ) // only show index page if it has show-tabs
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
                        key={`${(landingPageItem as MdxFile).route}`}
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

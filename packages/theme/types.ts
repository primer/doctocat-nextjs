import {Folder, PageMapItem, MdxFile} from 'nextra'
import {ReactNode} from 'react'

export type ThemeConfig = {
  docsRepositoryBase: string
  sidebarLinks?: {
    title: string
    href: string
  }[]
}

export type ExtendedPageItem = PageMapItem & {
  name: string
  title: string
  href: string
  type?: string
  active?: boolean
}

export type FolderWithoutChildren = Omit<Folder, 'children'>

export type DocsItem = MdxFile & {
  title: ReactNode
  type: string
  children?: DocsItem[]
  firstChildRoute?: string
  withIndexPage?: boolean
  isUnderCurrentDocsTree?: boolean
}

export type FrontMatter = {
  description?: string
  filePath?: string
  keywords?: string[]
  menu_position?: number
  related?: {
    title: string
    href: string
  }[]
  timestamp?: number
  title?: string
  [key: string]: unknown
  thumbnail?: string
  thumbnail_darkMode?: string
}

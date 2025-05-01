import {Folder, PageMapItem, MdxFile} from 'nextra'

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
  title: string
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
  related?: {
    title: string
    href: string
  }[]
  timestamp?: number
  title?: string
  [key: string]: unknown
}

import {PageMapItem, Folder} from 'nextra'
import {DocsItem} from '../types'

export const hasChildren = (item: DocsItem | PageMapItem): boolean =>
  'children' in item && Array.isArray((item as Folder).children) && (item as Folder).children.length > 0

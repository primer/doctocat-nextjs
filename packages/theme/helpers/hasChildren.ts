import type {PageMapItem, Folder} from 'nextra'

export function hasChildren(item: PageMapItem): item is Folder {
  return 'children' in item && Array.isArray(item.children)
}

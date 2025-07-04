import {describe, it, expect} from 'vitest'
import {hasChildren} from './hasChildren'
import type {PageMapItem, Folder, MdxFile} from 'nextra'

describe('hasChildren', () => {
  it('returns true for folder with children array', () => {
    const folder: Folder = {
      type: 'folder',
      name: 'test-folder',
      children: [],
    }

    expect(hasChildren(folder)).toBe(true)
  })

  it('returns true for folder with non-empty children array', () => {
    const mockChild: MdxFile = {
      type: 'page',
      name: 'child-page',
      route: '/child-page',
    }

    const folder: Folder = {
      type: 'folder',
      name: 'test-folder',
      children: [mockChild],
    }

    expect(hasChildren(folder)).toBe(true)
  })

  it('returns false for page item without children', () => {
    const page: MdxFile = {
      type: 'page',
      name: 'test-page',
      route: '/test-page',
    }

    expect(hasChildren(page)).toBe(false)
  })

  it('returns false for item with non-array children property', () => {
    const invalidItem = {
      type: 'folder',
      name: 'invalid-folder',
      children: 'not-an-array',
    } as unknown as PageMapItem

    expect(hasChildren(invalidItem)).toBe(false)
  })

  it('returns false for item with null children', () => {
    const invalidItem = {
      type: 'folder',
      name: 'invalid-folder',
      children: null,
    } as unknown as PageMapItem

    expect(hasChildren(invalidItem)).toBe(false)
  })

  it('returns false for item with undefined children', () => {
    const invalidItem = {
      type: 'folder',
      name: 'invalid-folder',
      children: undefined,
    } as unknown as PageMapItem

    expect(hasChildren(invalidItem)).toBe(false)
  })

  it('correctly narrows type when returns true', () => {
    const folder: Folder = {
      type: 'folder',
      name: 'test-folder',
      children: [],
    }

    const item: PageMapItem = folder

    if (hasChildren(item)) {
      // TypeScript should recognize item as Folder here
      expect(item.children).toBeDefined()
      expect(Array.isArray(item.children)).toBe(true)
    }
  })

  it('handles mixed page types correctly', () => {
    const page: MdxFile = {
      type: 'page',
      name: 'test-page',
      route: '/test-page',
    }

    const folder: Folder = {
      type: 'folder',
      name: 'test-folder',
      children: [page],
    }

    const items: PageMapItem[] = [page, folder]

    const foldersWithChildren = items.filter(hasChildren)
    expect(foldersWithChildren).toHaveLength(1)
    expect(foldersWithChildren[0]).toBe(folder)
  })
})

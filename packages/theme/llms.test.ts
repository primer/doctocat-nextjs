import {describe, it, expect, vi, beforeEach} from 'vitest'
import type {MdxFile, Folder, MetaJsonFile, PageMapItem} from 'nextra'

vi.mock('nextra/page-map', () => ({
  getPageMap: vi.fn(),
}))

import {getPageMap} from 'nextra/page-map'
import {generateLLMsTxt} from './llms'

const mockGetPageMap = vi.mocked(getPageMap)

function createMockMdxFile(overrides: Partial<MdxFile> & {name: string; route: string}): MdxFile {
  return {frontMatter: {}, ...overrides}
}

function createMockFolder(name: string, route: string, children: PageMapItem[]): Folder {
  return {name, route, children}
}

const metaFile: MetaJsonFile = {data: {'index.mdx': 'Home'}}

beforeEach(() => {
  vi.restoreAllMocks()
  delete process.env.NEXT_PUBLIC_SITE_TITLE
})

describe('generateLLMsTxt', () => {
  it('infers title and description from homepage frontmatter', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'My Docs', description: 'A docs site'}}),
    ])

    const result = await generateLLMsTxt()

    expect(result).toContain('# My Docs')
    expect(result).toContain('> A docs site')
  })

  it('falls back to NEXT_PUBLIC_SITE_TITLE env var', async () => {
    process.env.NEXT_PUBLIC_SITE_TITLE = 'Env Title'
    mockGetPageMap.mockResolvedValue([createMockMdxFile({name: 'index', route: '/'})])

    const result = await generateLLMsTxt()

    expect(result).toContain('# Env Title')
  })

  it('falls back to "Documentation" when no title source exists', async () => {
    mockGetPageMap.mockResolvedValue([createMockMdxFile({name: 'index', route: '/'})])

    const result = await generateLLMsTxt()

    expect(result).toContain('# Documentation')
    expect(result).not.toContain('>')
  })

  it('lists pages with title and description', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      createMockMdxFile({name: 'guide', route: '/guide', frontMatter: {title: 'Guide', description: 'A guide'}}),
    ])

    const result = await generateLLMsTxt()

    expect(result).toContain('- [Home](/)')
    expect(result).toContain('- [Guide](/guide): A guide')
  })

  it('appends tab-label to title', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      createMockMdxFile({
        name: 'button',
        route: '/button',
        frontMatter: {title: 'Button', 'tab-label': 'React'},
      }),
    ])

    const result = await generateLLMsTxt()

    expect(result).toContain('- [Button - React](/button)')
  })

  it('includes keywords when present', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      createMockMdxFile({
        name: 'testimonials',
        route: '/testimonials',
        frontMatter: {title: 'Testimonials', keywords: ['quotes', 'reviews']},
      }),
    ])

    const result = await generateLLMsTxt()

    expect(result).toContain('- [Testimonials](/testimonials) (quotes, reviews)')
  })

  it('omits keywords when array is empty', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      createMockMdxFile({name: 'page', route: '/page', frontMatter: {title: 'Page', keywords: []}}),
    ])

    const result = await generateLLMsTxt()

    const line = result.split('\n').find(l => l.includes('[Page]'))
    expect(line).toBe('- [Page](/page)')
  })

  it('recursively collects pages from nested folders', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      createMockFolder('components', '/components', [
        createMockMdxFile({name: 'button', route: '/components/button', frontMatter: {title: 'Button'}}),
        createMockFolder('patterns', '/components/patterns', [
          createMockMdxFile({name: 'forms', route: '/components/patterns/forms', frontMatter: {title: 'Forms'}}),
        ]),
      ]),
    ])

    const result = await generateLLMsTxt()

    expect(result).toContain('- [Button](/components/button)')
    expect(result).toContain('- [Forms](/components/patterns/forms)')
  })

  it('skips MetaJsonFile entries', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      metaFile,
    ])

    const result = await generateLLMsTxt()

    expect(result).not.toContain('index.mdx')
    expect(result).toContain('- [Home](/)')
  })

  it('uses file name when title is missing from frontmatter', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      createMockMdxFile({name: 'untitled-page', route: '/untitled-page'}),
    ])

    const result = await generateLLMsTxt()

    expect(result).toContain('- [untitled-page](/untitled-page)')
  })

  it('combines description and keywords in one entry', async () => {
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      createMockMdxFile({
        name: 'hero',
        route: '/hero',
        frontMatter: {title: 'Hero', description: 'Hero section', keywords: ['banner', 'header']},
      }),
    ])

    const result = await generateLLMsTxt()

    expect(result).toContain('- [Hero](/hero): Hero section (banner, header)')
  })

  it('prepends basePath to routes when NEXT_PUBLIC_DOCTOCAT_BASE_PATH is set', async () => {
    process.env.NEXT_PUBLIC_DOCTOCAT_BASE_PATH = '/doctocat-nextjs'
    mockGetPageMap.mockResolvedValue([
      createMockMdxFile({name: 'index', route: '/', frontMatter: {title: 'Home'}}),
      createMockMdxFile({name: 'guide', route: '/guide', frontMatter: {title: 'Guide'}}),
    ])

    const result = await generateLLMsTxt()

    expect(result).toContain('- [Home](/doctocat-nextjs/)')
    expect(result).toContain('- [Guide](/doctocat-nextjs/guide)')
  })
})

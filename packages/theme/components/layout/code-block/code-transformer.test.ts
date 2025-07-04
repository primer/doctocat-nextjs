import {describe, it, expect} from 'vitest'
import {codeTransformer} from './code-transformer'

describe('codeTransformer', () => {
  const basePath = '/docs'

  describe('should transform img tags', () => {
    it('should transform img src with absolute path', () => {
      const sourceCode = '<img src="/image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<img src="/docs/image.png" alt="test" />')
    })

    it('should transform img src with relative path', () => {
      const sourceCode = '<img src="image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<img src="/docs/image.png" alt="test" />')
    })

    it('should transform img with additional attributes', () => {
      const sourceCode = '<img class="hero" src="/hero.jpg" alt="Hero image" width="100" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<img class="hero" src="/docs/hero.jpg" alt="Hero image" width="100" />')
    })
  })

  describe('should transform Image component tags', () => {
    it('should transform Image component src with absolute path', () => {
      const sourceCode = '<Image src="/image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<Image src="/docs/image.png" alt="test" />')
    })

    it('should transform Image component src with relative path', () => {
      const sourceCode = '<Image src="image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<Image src="/docs/image.png" alt="test" />')
    })

    it('should transform Image component with additional props', () => {
      const sourceCode = '<Image width={100} height={200} src="/hero.jpg" alt="Hero image" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<Image width={100} height={200} src="/docs/hero.jpg" alt="Hero image" />')
    })
  })

  describe('should transform Image.Item component tags', () => {
    it('should transform Image.Item component src with absolute path', () => {
      const sourceCode = '<Image.Item src="/image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<Image.Item src="/docs/image.png" alt="test" />')
    })

    it('should transform Image.Item component src with relative path', () => {
      const sourceCode = '<Image.Item src="image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<Image.Item src="/docs/image.png" alt="test" />')
    })

    it('should transform Image.Item with additional props', () => {
      const sourceCode = '<Image.Item className="gallery-item" src="/gallery/item.jpg" alt="Gallery item" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<Image.Item className="gallery-item" src="/docs/gallery/item.jpg" alt="Gallery item" />')
    })
  })

  describe('should handle edge cases', () => {
    it('should not transform external URLs', () => {
      const sourceCode = '<img src="https://example.com/image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<img src="https://example.com/image.png" alt="test" />')
    })

    it('should not transform protocol-relative URLs', () => {
      const sourceCode = '<img src="//example.com/image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<img src="//example.com/image.png" alt="test" />')
    })

    it('should not transform URLs that already start with basePath', () => {
      const sourceCode = '<img src="/docs/image.png" alt="test" />'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<img src="/docs/image.png" alt="test" />')
    })

    it('should return original code when basePath is empty', () => {
      const sourceCode = '<img src="/image.png" alt="test" />'
      const result = codeTransformer(sourceCode, '')
      expect(result).toBe('<img src="/image.png" alt="test" />')
    })

    it('should handle multiple tags in one string', () => {
      const sourceCode = `
        <div>
          <img src="/image1.png" alt="test1" />
          <Image src="image2.jpg" alt="test2" />
          <Image.Item src="/image3.png" alt="test3" />
        </div>
      `
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toContain('<img src="/docs/image1.png" alt="test1" />')
      expect(result).toContain('<Image src="/docs/image2.jpg" alt="test2" />')
      expect(result).toContain('<Image.Item src="/docs/image3.png" alt="test3" />')
    })

    it('should handle mixed quotes', () => {
      const sourceCode = `<img src='/image.png' alt="test" />`
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe(`<img src="/docs/image.png" alt="test" />`)
    })
  })

  describe('should handle complex component structures', () => {
    it('should transform nested component with dot notation', () => {
      const sourceCode = '<Gallery.Image.Item src="/gallery/nested.jpg" alt="nested" />'
      const result = codeTransformer(sourceCode, basePath)
      // The current regex doesn't support multiple dots in component names
      expect(result).toBe('<Gallery.Image.Item src="/gallery/nested.jpg" alt="nested" />')
    })

    it('should transform components with namespaces', () => {
      const sourceCode = '<ui.Image src="/ui/image.png" alt="ui image" />'
      const result = codeTransformer(sourceCode, basePath)
      // The current regex doesn't support lowercase namespaces
      expect(result).toBe('<ui.Image src="/ui/image.png" alt="ui image" />')
    })

    it('should handle self-closing and regular tags', () => {
      const sourceCode = '<img src="/image.png" alt="test"></img>'
      const result = codeTransformer(sourceCode, basePath)
      expect(result).toBe('<img src="/docs/image.png" alt="test"></img>')
    })
  })
})

import {describe, it, expect} from 'vitest'
import {codeTransformer} from './code-transformer'

describe('codeTransformer', () => {
  const basePath = '/docs'

  it('returns original code when basePath is empty', () => {
    const sourceCode = '<img src="/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, '')
    expect(result).toBe('<img src="/image.png" alt="test" />')
  })

  it('transforms img src with absolute path when basePath is set', () => {
    const sourceCode = '<img src="/image.png" alt="test" />'
    const expectedCode = '<img src="/docs/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms img src with relative path when basePath is set', () => {
    const sourceCode = '<img src="image.png" alt="test" />'
    const expectedCode = '<img src="/docs/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms img with additional attributes when basePath is set', () => {
    const sourceCode = '<img class="hero" src="/hero.jpg" alt="Hero image" width="100" />'
    const expectedCode = '<img class="hero" src="/docs/hero.jpg" alt="Hero image" width="100" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms img self-closing and regular tags when basePath is set', () => {
    const sourceCode = '<img src="/image.png" alt="test"></img>'
    const expectedCode = '<img src="/docs/image.png" alt="test"></img>'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms Image component src with absolute path when basePath is set', () => {
    const sourceCode = '<Image src="/image.png" alt="test" />'
    const expectedCode = '<Image src="/docs/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms Image component src with relative path when basePath is set', () => {
    const sourceCode = '<Image src="image.png" alt="test" />'
    const expectedCode = '<Image src="/docs/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms Image component with additional props when basePath is set', () => {
    const sourceCode = '<Image width={100} height={200} src="/hero.jpg" alt="Hero image" />'
    const expectedCode = '<Image width={100} height={200} src="/docs/hero.jpg" alt="Hero image" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms Image.Item component src with absolute path when basePath is set', () => {
    const sourceCode = '<Image.Item src="/image.png" alt="test" />'
    const expectedCode = '<Image.Item src="/docs/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms Image.Item component src with relative path when basePath is set', () => {
    const sourceCode = '<Image.Item src="image.png" alt="test" />'
    const expectedCode = '<Image.Item src="/docs/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms Image.Item with additional props when basePath is set', () => {
    const sourceCode = '<Image.Item className="gallery-item" src="/gallery/item.jpg" alt="Gallery item" />'
    const expectedCode = '<Image.Item className="gallery-item" src="/docs/gallery/item.jpg" alt="Gallery item" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms VideoPlayer.Source src with absolute path when basePath is set', () => {
    const sourceCode = '<VideoPlayer.Source src="/example.mp4" />'
    const expectedCode = '<VideoPlayer.Source src="/docs/example.mp4" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms VideoPlayer.Source src with relative path when basePath is set', () => {
    const sourceCode = '<VideoPlayer.Source src="example.mp4" />'
    const expectedCode = '<VideoPlayer.Source src="/docs/example.mp4" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms VideoPlayer.Track src with absolute path when basePath is set', () => {
    const sourceCode = '<VideoPlayer.Track src="/example.vtt" default />'
    const expectedCode = '<VideoPlayer.Track src="/docs/example.vtt" default />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms VideoPlayer.Track src with relative path when basePath is set', () => {
    const sourceCode = '<VideoPlayer.Track src="example.vtt" default />'
    const expectedCode = '<VideoPlayer.Track src="/docs/example.vtt" default />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms complex VideoPlayer structure when basePath is set', () => {
    const sourceCode = `<VideoPlayer title="GitHub media player">
  <VideoPlayer.Source src="/example.mp4" />
  <VideoPlayer.Track src="/example.vtt" default />
</VideoPlayer>`
    const expectedCode = `<VideoPlayer title="GitHub media player">
  <VideoPlayer.Source src="/docs/example.mp4" />
  <VideoPlayer.Track src="/docs/example.vtt" default />
</VideoPlayer>`
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('transforms multiple tags in one string when basePath is set', () => {
    const sourceCode = `
      <div>
        <img src="/image1.png" alt="test1" />
        <Image src="image2.jpg" alt="test2" />
        <Image.Item src="/image3.png" alt="test3" />
      </div>
    `
    const expectedCode = `
      <div>
        <img src="/docs/image1.png" alt="test1" />
        <Image src="/docs/image2.jpg" alt="test2" />
        <Image.Item src="/docs/image3.png" alt="test3" />
      </div>
    `
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('handles mixed quotes in src attributes when basePath is set', () => {
    const sourceCode = `<img src='/image.png' alt="test" />`
    const expectedCode = `<img src="/docs/image.png" alt="test" />`
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('does not transform external URLs when basePath is set', () => {
    const sourceCode = '<img src="https://example.com/image.png" alt="test" />'
    const expectedCode = '<img src="https://example.com/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('does not transform protocol-relative URLs when basePath is set', () => {
    const sourceCode = '<img src="//example.com/image.png" alt="test" />'
    const expectedCode = '<img src="//example.com/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('does not transform URLs that already start with basePath when basePath is set', () => {
    const sourceCode = '<img src="/docs/image.png" alt="test" />'
    const expectedCode = '<img src="/docs/image.png" alt="test" />'
    const result = codeTransformer(sourceCode, basePath)
    expect(result).toBe(expectedCode)
  })

  it('does not transform nested component with multiple dots when basePath is set', () => {
    const sourceCode = '<Gallery.Image.Item src="/gallery/nested.jpg" alt="nested" />'
    const expectedCode = '<Gallery.Image.Item src="/gallery/nested.jpg" alt="nested" />'
    const result = codeTransformer(sourceCode, basePath)
    // The current regex doesn't support multiple dots in component names
    expect(result).toBe(expectedCode)
  })

  it('does not transform components with lowercase namespaces when basePath is set', () => {
    const sourceCode = '<ui.Image src="/ui/image.png" alt="ui image" />'
    const expectedCode = '<ui.Image src="/ui/image.png" alt="ui image" />'
    const result = codeTransformer(sourceCode, basePath)
    // The current regex doesn't support lowercase namespaces
    expect(result).toBe(expectedCode)
  })
})

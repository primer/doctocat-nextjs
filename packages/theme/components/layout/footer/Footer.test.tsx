import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {Footer} from './Footer'

describe('Footer', () => {
  it('omits the edit link when repository metadata is not configured', () => {
    const consoleWarning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Footer filePath="content/getting-started/index.mdx" repoURL="" repoSrcPath="" />)

    expect(screen.queryByRole('link', {name: 'Edit this page'})).not.toBeInTheDocument()
    expect(consoleWarning).not.toHaveBeenCalled()
    consoleWarning.mockRestore()
  })

  it('links to the configured repository source file', () => {
    render(
      <Footer
        filePath="content/getting-started/index.mdx"
        repoURL="https://code.example/organization/project"
        repoSrcPath="packages/docs"
      />,
    )

    expect(screen.getByRole('link', {name: 'Edit this page'})).toHaveAttribute(
      'href',
      'https://code.example/organization/project/blob/main/packages/docs/content/getting-started/index.mdx',
    )
  })
})

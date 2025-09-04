import {generateStaticParamsFor, importPage} from '@primer/doctocat-nextjs'
import {useMDXComponents as getMDXComponents} from '../../mdx-components.js'
import {notFound} from 'next/navigation'

const generateStaticParamsFunction = generateStaticParamsFor('mdxPath')
export const generateStaticParams = generateStaticParamsFunction

type Props = {
  params: Promise<{
    mdxPath: string[]
  }>
}
export async function generateMetadata(props: Props) {
  const params = await props.params
  try {
    const {metadata} = await importPage(params.mdxPath)
    return metadata
  } catch {
    return {}
  }
}

const {Article: Wrapper} = getMDXComponents()

export default async function Page(props: Props) {
  const params = await props.params
  try {
    const result = await importPage(params.mdxPath)
    const {default: MDXContent, toc, metadata} = result

    return (
      <Wrapper toc={toc} metadata={metadata}>
        <MDXContent {...props} params={params} />
      </Wrapper>
    )
  } catch {
    notFound()
  }
}

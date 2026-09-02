import NextLink from 'next/link'
import NextImage from 'next/image'
import {
  Article,
  Box,
  Button,
  Caption,
  CodeBlock,
  Do,
  DoDontContainer,
  Dont,
  Heading,
  HeadingLink,
  Label,
  Note,
  PropTableValues,
  Stack,
  TableOfContents,
  TableWrapper,
  Text,
} from '@primer/doctocat-nextjs/components'

const basePath = process.env.NEXT_PUBLIC_DOCTOCAT_BASE_PATH || ''

const withBasePath = source => {
  if (
    !basePath ||
    typeof source !== 'string' ||
    source.startsWith(`${basePath}/`) ||
    /^(?:[a-z]+:|\/\/|#)/i.test(source)
  ) {
    return source
  }
  return `${basePath}${source.startsWith('/') ? '' : '/'}${source}`
}

const Link = ({href = '', ...props}) => <NextLink href={href} {...props} />
const AssetImage = ({src = '', alt = '', ...props}) => {
  const imageSource = typeof src === 'object' && src !== null ? {...src, src: withBasePath(src.src)} : withBasePath(src)
  return <NextImage src={imageSource} alt={alt} {...props} />
}

export function useMDXComponents(customComponents) {
  return {
    ...customComponents,
    Article,
    Box,
    Button,
    Caption,
    CodeBlock,
    Do,
    DoDontContainer,
    Dont,
    Heading,
    HeadingLink,
    Label,
    Link,
    Note,
    PropTableValues,
    Stack,
    TableOfContents,
    TableWrapper,
    Text,
    a: Link,
    h2: props => <HeadingLink tag="h2" {...props} />,
    h3: props => <HeadingLink tag="h3" {...props} />,
    h4: props => <HeadingLink tag="h4" {...props} />,
    h5: props => <HeadingLink tag="h5" {...props} />,
    h6: props => <HeadingLink tag="h6" {...props} />,
    img: AssetImage,
    pre: CodeBlock,
    table: props => (
      <TableWrapper>
        <table {...props} />
      </TableWrapper>
    ),
  }
}

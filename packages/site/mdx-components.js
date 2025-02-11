import * as DoctocatComponents from '@primer/doctocat-nextjs/components'
import {HeadingLink} from '@primer/doctocat-nextjs/components'
import NextLink from 'next/link'

export const Link = ({href = '', ...props}) => <NextLink href={href} {...props} />

export function useMDXComponents(customComponents) {
  return {
    ...customComponents,
    ...DoctocatComponents,
    Link,
    h2: props => <HeadingLink tag="h2" {...props} />,
    h3: props => <HeadingLink tag="h3" {...props} />,
    h4: props => <HeadingLink tag="h4" {...props} />,
    h5: props => <HeadingLink tag="h5" {...props} />,
    h6: props => <HeadingLink tag="h6" {...props} />,
  }
}

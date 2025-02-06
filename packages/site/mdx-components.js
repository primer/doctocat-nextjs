import * as DoctocatComponents from '@primer/doctocat-nextjs/components'

export function useMDXComponents(customComponents) {
  return {
    ...customComponents,
    ...DoctocatComponents,
  }
}

import React, {useMemo} from 'react'
import {SubdomainNavBar} from '@primer/react-brand'
import {PageMapItem, MdxFile} from 'nextra'
import {useRouter} from 'next/router'

type HeaderProps = {
  pageMap: PageMapItem[]
}

export function Header({pageMap}: HeaderProps) {
  const router = useRouter()
  const basePath = router.basePath
  const inputRef = React.useRef(null)
  const [searchResults, setSearchResults] = React.useState([])
  const [searchTerm, setSearchTerm] = React.useState('')

  const searchData = useMemo(
    () =>
      pageMap
        .map(item => {
          if (item.kind === 'Folder') {
            return item.children.filter(child => child.kind === 'MdxPage')
          }
          if (item.kind === 'MdxPage') {
            return item
          }
        })
        .flat()
        .filter(Boolean)
        .map(({frontMatter, route}: MdxFile) => {
          const result = {
            title: frontMatter.title,
            description: frontMatter.description,
            url: `${basePath}${route}`,
          }
          return result
        }),
    [pageMap],
  )

  const handleChange = () => {
    if (!inputRef.current) return
    if (inputRef.current.value.length === 0) {
      setSearchResults(undefined)
      return
    }
    if (inputRef.current.value.length > 2) {
      const searchTerm = inputRef.current.value.toLowerCase()
      const results = searchData.filter(data => {
        const title = data.title.toLowerCase()
        const description = data.description.toLowerCase()
        let searchIndex = 0
        for (let i = 0; i < title.length; i++) {
          if (title[i] === searchTerm[searchIndex]) {
            searchIndex++
            if (searchIndex === searchTerm.length) {
              return true
            }
          }
        }
        searchIndex = 0
        for (let i = 0; i < description.length; i++) {
          if (description[i] === searchTerm[searchIndex]) {
            searchIndex++
            if (searchIndex === searchTerm.length) {
              return true
            }
          }
        }
        return false
      })
      setTimeout(() => setSearchResults(results), 1000)
      setSearchTerm(inputRef.current.value)
      return
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!inputRef.current) return
    if (!inputRef.current.value) {
      alert(`Enter a value and try again.`)
      return
    }

    alert(`Name: ${inputRef.current.value}`)
  }

  return (
    <SubdomainNavBar title="Brand toolkit" titleHref={basePath || '/'} fullWidth>
      <SubdomainNavBar.Search
        ref={inputRef}
        searchTerm={searchTerm}
        onSubmit={handleSubmit}
        onChange={handleChange}
        searchResults={searchResults}
      />
      <SubdomainNavBar.SecondaryAction href="#">Secondary CTA</SubdomainNavBar.SecondaryAction>
    </SubdomainNavBar>
  )
}

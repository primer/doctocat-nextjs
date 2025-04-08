import React, {useEffect, useMemo, useRef, useState} from 'react'
import {SearchIcon} from '@primer/octicons-react'
import {Box, FormControl, TextInput} from '@primer/react'
import {Heading, Stack, Text} from '@primer/react-brand'
import {clsx} from 'clsx'
import {MdxFile, PageMapItem} from 'nextra'

import Link from 'next/link'
import styles from './GlobalSearch.module.css'
import {DocsItem} from '../../../types'

type GlobalSearchProps = {
  pageMap: PageMapItem[]
  flatDocsDirectories: DocsItem[]
  siteTitle: string
}

type SearchResult = {
  title: string
  description: string
  url: string
}

export function GlobalSearch({pageMap, siteTitle, flatDocsDirectories}: GlobalSearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const searchResultsRef = useRef<HTMLElement | null>(null)
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[] | undefined>()
  const [searchTerm, setSearchTerm] = useState<string | undefined>('')
  const [activeDescendant] = useState<number>(-1)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchResultOpen(false)
      }
    }

    const handleClickAway = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !searchResultsRef.current?.contains(event.target as Node)
      ) {
        setIsSearchResultOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClickAway)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClickAway)
    }
  }, [])

  const searchData = useMemo(
    () =>
      flatDocsDirectories
        .map(item => {
          if (item.route === '/') return null // remove homepage
          return item
        })
        .filter(Boolean)
        .map(item => {
          const {frontMatter, route} = item as MdxFile
          if (!frontMatter) return null
          const result = {
            title:
              frontMatter['show-tabs'] && frontMatter['tab-label']
                ? `${frontMatter.title} | ${frontMatter['tab-label']}`
                : frontMatter.title
                  ? frontMatter.title
                  : '',
            description: frontMatter.description ? frontMatter.description : '',
            url: route,
          }
          return result
        }),
    [flatDocsDirectories],
  )

  const handleChange = () => {
    if (!inputRef.current) return
    if (inputRef.current.value.length === 0) {
      setSearchTerm(undefined)
      setSearchResults(undefined)
      setIsSearchResultOpen(false)
      return
    }
    // if (inputRef.current.value.length > 2) {
    if (inputRef.current.value.length > 0) {
      const curSearchTerm = inputRef.current.value.toLowerCase()

      // filters the frontMatter title and descriptions against the search term
      const filteredData = searchData
        .filter((data): data is SearchResult => data !== null)
        .filter(data => {
          if (!data.title) return false
          const title = data.title.toLowerCase()
          const description = data.description.toLowerCase()
          return title.includes(curSearchTerm) || description.includes(curSearchTerm)
        })

      // sorts the data to show hits in title first, description second
      const sortedData = filteredData.sort((a, b) => {
        const aTitle = a.title.toLowerCase()
        const bTitle = b.title.toLowerCase()
        const aIncludes = aTitle.includes(curSearchTerm)
        const bIncludes = bTitle.includes(curSearchTerm)

        if (aIncludes && !bIncludes) {
          return -1
        } else if (!aIncludes && bIncludes) {
          return 1
        } else {
          return 0
        }
      })

      setSearchResults(sortedData)

      setSearchTerm(inputRef.current.value)
      setIsSearchResultOpen(true)
      return
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputRef.current) return
    if (!inputRef.current.value) {
      // eslint-disable-next-line i18n-text/no-en
      alert(`Enter a value and try again.`)
      return
    }

    alert(`Name: ${inputRef.current.value}`)
  }

  return (
    <>
      <FormControl>
        <FormControl.Label visuallyHidden>Search</FormControl.Label>
        <TextInput
          contrast
          type="search"
          className={styles.GlobalSearch__searchInput}
          leadingVisual={<SearchIcon />}
          placeholder={`Search ${siteTitle}`}
          ref={inputRef}
          onSubmit={handleSubmit}
          onChange={handleChange}
          aria-activedescendant={activeDescendant === -1 ? undefined : `search-result-${activeDescendant}`}
        />
      </FormControl>
      {searchTerm && (
        <Box
          ref={searchResultsRef}
          sx={{
            display: isSearchResultOpen ? 'block' : 'none',
            marginTop: 1,
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'var(--brand-color-canvas-default)',
            padding: 'var(--base-size-16)',
            width: '100%',
            maxWidth: ['calc(100% - 46px)', null, '350px'],
            border: 'var(--brand-borderWidth-thin) solid var(--brand-color-border-default)',
            borderRadius: 'var(--brand-borderRadius-medium)',
            maxHeight: 300,
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'var(--brand-color-canvas-default)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'var(--brand-color-text-muted)',
              borderRadius: 'var(--base-size-4)',
            },
          }}
        >
          <Stack direction="vertical" padding="none" gap="none">
            {searchTerm && (
              <Box sx={{pl: 1}}>
                <Heading as="h3" size="subhead-large" id="search-results-heading">
                  {searchResults && searchResults.length} Results for &quot;{searchTerm}&quot;
                </Heading>
              </Box>
            )}
            {searchResults && searchResults.length > 0 ? (
              <ul
                role="listbox"
                tabIndex={0}
                aria-labelledby="search-results-heading"
                className={clsx(styles.GlobalSearch__searchResultsList)}
              >
                {searchResults.map((result, index) => (
                  <li
                    key={`${result.title}-${index}`}
                    id={`search-result-${index}`}
                    role="option"
                    aria-selected={index === activeDescendant}
                  >
                    <Text size="200">
                      <Link href={result.url}>{result.title}</Link>
                    </Text>
                    <Text as="p" size="100" variant="muted" id={`search-result-item-desc${index}`}>
                      {result.description}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Box sx={{p: '100', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
                <Text variant="muted">No results found</Text>
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </>
  )
}

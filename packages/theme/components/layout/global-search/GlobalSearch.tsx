import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react'
import {SearchIcon} from '@primer/octicons-react'
import {FormControl, TextInput} from '@primer/react'
import {Heading, Stack, Text} from '@primer/react-brand'
import {clsx} from 'clsx'
import type {MdxFile} from 'nextra'
import Link from 'next/link'

import styles from './GlobalSearch.module.css'
import type {DocsItem} from '../../../types'

type GlobalSearchProps = {
  flatDocsDirectories: DocsItem[]
  siteTitle: string
}

type SearchResult = {
  title: string
  description: string
  url: string
}

export const GlobalSearch = forwardRef<HTMLInputElement, GlobalSearchProps>(
  ({siteTitle, flatDocsDirectories}, forwardedRef) => {
    const listboxRef = useRef<HTMLUListElement | null>(null)
    const searchResultsRef = useRef<HTMLDivElement | null>(null)
    const [isSearchResultOpen, setIsSearchResultOpen] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searchTerm, setSearchTerm] = useState<string | undefined>('')
    const [activeDescendant, setActiveDescendant] = useState<number>(-1)

    useEffect(() => {
      const handleClickAway = (event: MouseEvent) => {
        if (!searchResultsRef.current?.contains(event.target as Node)) {
          setIsSearchResultOpen(false)
        }
      }

      document.addEventListener('click', handleClickAway)

      return () => {
        document.removeEventListener('click', handleClickAway)
      }
    }, [])

    const searchData = useMemo(
      () =>
        flatDocsDirectories.reduce<SearchResult[]>((acc, item) => {
          if (item.route === '/') return acc // remove homepage

          const {frontMatter, route} = item as MdxFile
          if (!frontMatter) return acc
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
          return [...acc, result]
        }, []),
      [flatDocsDirectories],
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()

      if (value.length === 0) {
        setSearchTerm(undefined)
        setSearchResults([])
        setIsSearchResultOpen(false)
        return
      }

      const filteredData = searchData.filter(data => {
        const title = data.title.toLowerCase()
        const description = data.description.toLowerCase()
        return title.includes(value) || description.includes(value)
      })

      const sortedData = filteredData.sort((a, b) => {
        const aTitle = a.title.toLowerCase()
        const bTitle = b.title.toLowerCase()
        const aIncludes = aTitle.includes(value)
        const bIncludes = bTitle.includes(value)

        if (aIncludes && !bIncludes) {
          return -1
        } else if (!aIncludes && bIncludes) {
          return 1
        } else {
          return 0
        }
      })

      setSearchResults(sortedData)

      setSearchTerm(value)
      setIsSearchResultOpen(true)
      return
    }

    const updateActiveDescendant = (offset: number) => {
      if (searchResults.length === 0) {
        setActiveDescendant(-1)
        return
      }

      // Wraps from the last item to the first and vice versa
      const nextActiveDescendant = (activeDescendant + offset + searchResults.length) % searchResults.length
      setActiveDescendant(nextActiveDescendant)

      listboxRef.current
        ?.querySelector(`#search-result-${nextActiveDescendant}`)
        // Scroll all the way to the top when the first item is selected
        ?.scrollIntoView({block: nextActiveDescendant === 0 ? 'center' : 'nearest'})
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          updateActiveDescendant(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          updateActiveDescendant(-1)
          break
        case 'Enter':
          e.preventDefault()
          if (activeDescendant !== -1) {
            const selectedResult = searchResults[activeDescendant]
            if (selectedResult.url) {
              window.location.href = selectedResult.url
            }
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsSearchResultOpen(false)
          setActiveDescendant(-1)
          break
        case 'Tab':
          setIsSearchResultOpen(false)
          setActiveDescendant(-1)
          break
        default:
          break
      }
    }

    return (
      <div ref={searchResultsRef}>
        <FormControl>
          <FormControl.Label visuallyHidden>Search</FormControl.Label>
          <TextInput
            contrast
            type="search"
            className={styles.GlobalSearch__searchInput}
            leadingVisual={<SearchIcon />}
            placeholder={`Search ${siteTitle}`}
            ref={forwardedRef}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-activedescendant={activeDescendant === -1 ? undefined : `search-result-${activeDescendant}`}
            aria-autocomplete="list"
            aria-controls="search-results-listbox"
            aria-expanded={isSearchResultOpen}
          />
        </FormControl>
        {searchTerm && (
          <div
            className={clsx(
              styles.GlobalSearch__searchResultsContainer,
              isSearchResultOpen && styles['GlobalSearch__searchResultsContainer--open'],
            )}
            tabIndex={-1}
          >
            <Stack direction="vertical" padding="none" gap="none">
              {searchTerm && (
                <Heading
                  as="h3"
                  size="subhead-large"
                  id="search-results-heading"
                  className={styles.GlobalSearch__searchResultsHeading}
                >
                  {searchResults.length} Results for &quot;{searchTerm}&quot;
                </Heading>
              )}
              {searchResults.length > 0 ? (
                <ul
                  role="listbox"
                  ref={listboxRef}
                  id="search-results-listbox"
                  aria-labelledby="search-results-heading"
                  className={clsx(styles.GlobalSearch__searchResultsList)}
                >
                  {searchResults.map((result, index) => (
                    <li
                      key={`${result.title}-${index}`}
                      id={`search-result-${index}`}
                      className={clsx(styles.GlobalSearch__searchResultItem)}
                      role="option"
                      aria-selected={index === activeDescendant}
                    >
                      <Text size="200">
                        <Link href={result.url} tabIndex={-1}>
                          {result.title}
                        </Link>
                      </Text>
                      <Text as="p" size="100" variant="muted" id={`search-result-item-desc${index}`}>
                        {result.description}
                      </Text>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.GlobalSearch__searchResultsEmpty}>
                  <Text variant="muted">No results found</Text>
                </div>
              )}
            </Stack>
          </div>
        )}
      </div>
    )
  },
)

GlobalSearch.displayName = 'GlobalSearch'

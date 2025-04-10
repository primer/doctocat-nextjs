import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react'
import {SearchIcon} from '@primer/octicons-react'
import {FormControl, TextInput} from '@primer/react'
import {Heading, Stack, Text} from '@primer/react-brand'
import {clsx} from 'clsx'
import type {MdxFile} from 'nextra'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

import styles from './GlobalSearch.module.css'
import type {DocsItem} from '../../../types'

type GlobalSearchProps = {
  flatDocsDirectories: DocsItem[]
  siteTitle: string
  onNavigate?: () => void
}

type SearchResult = {
  title: string
  description: string
  url: string
}

export const GlobalSearch = forwardRef<HTMLInputElement, GlobalSearchProps>(
  ({siteTitle, flatDocsDirectories, onNavigate}, forwardedRef) => {
    const router = useRouter()
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

    const resetSearch = () => {
      setSearchTerm('')
      setSearchResults([])
      setIsSearchResultOpen(false)
      setActiveDescendant(-1)
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
              router.push(selectedResult.url)
              onNavigate?.()
              resetSearch()
            }
          }
          break
        case 'Escape':
          if (isSearchResultOpen) {
            e.preventDefault()
            resetSearch()
          }
          break
        case 'Tab':
          resetSearch()
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
            value={searchTerm}
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
                      className={clsx(styles.GlobalSearch__searchResultItem)}
                      id={`search-result-${index}`}
                      aria-selected={index === activeDescendant}
                      role="option"
                    >
                      <Link
                        href={result.url}
                        tabIndex={-1}
                        onClick={() => {
                          onNavigate?.()
                          resetSearch()
                        }}
                      >
                        <Text size="200">
                          <HighlightSearchTerm searchTerm={searchTerm}>{result.title}</HighlightSearchTerm>
                        </Text>
                      </Link>
                      <Text as="p" size="100" variant="muted" id={`search-result-item-desc${index}`}>
                        <HighlightSearchTerm searchTerm={searchTerm}>{result.description}</HighlightSearchTerm>
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

type HighlightSearchTermProps = {
  children: React.ReactNode
  searchTerm: string
}

const HighlightSearchTerm = ({children, searchTerm}: HighlightSearchTermProps) => {
  if (!children || !searchTerm) {
    return <>{children}</>
  }

  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\<>]/g, '\\$&')

  const parts = children.toString().split(new RegExp(`(${escapedSearchTerm})`, 'gi'))

  return (
    <>
      {parts.map((part, i) => (part.toLowerCase() === searchTerm.toLowerCase() ? <mark key={i}>{part}</mark> : part))}
    </>
  )
}

GlobalSearch.displayName = 'GlobalSearch'

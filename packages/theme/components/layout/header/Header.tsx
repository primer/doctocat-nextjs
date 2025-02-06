import {MarkGithubIcon, MoonIcon, SearchIcon, SunIcon, ThreeBarsIcon, XIcon} from '@primer/octicons-react'
import {Box, FormControl, IconButton, TextInput} from '@primer/react'
import {Heading, Stack, Text} from '@primer/react-brand'
import {clsx} from 'clsx'
import {MdxFile, Folder, PageMapItem} from 'nextra'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {debounce} from 'lodash'

import Link from 'next/link'
import styles from './Header.module.css'
import {NavDrawer} from '../nav-drawer/NavDrawer'
import {useNavDrawerState} from '../nav-drawer/useNavDrawerState'
import {useColorMode} from '../../context/color-modes/useColorMode'
import {hasChildren} from '../../../helpers/hasChildren'
import {DocsItem} from '../../../types'

type HeaderProps = {
  pageMap: PageMapItem[]
  siteTitle: string
}

type SearchResults = {
  title: string
  description: string
  url: string
}

export function Header({pageMap, siteTitle}: HeaderProps) {
  const {colorMode, setColorMode} = useColorMode()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const searchResultsRef = useRef<HTMLElement | null>(null)
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useNavDrawerState('768')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResults[] | undefined>()
  const [searchTerm, setSearchTerm] = useState<string | undefined>('')
  const [activeDescendant] = useState<number>(-1)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

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

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorMode)
  }, [colorMode])

  const setSearchResultsDebounced = debounce(data => setSearchResults(data), 1000)

  const searchData = useMemo(
    () =>
      pageMap
        .map(item => {
          if (hasChildren(item)) {
            return (item as Folder).children.filter(child => !hasChildren(child))
          }
          if ((item as DocsItem).type === 'doc') {
            return item
          }
        })
        .flat()
        .filter(Boolean)
        .map(({frontMatter, route}: MdxFile) => {
          if (!frontMatter) return null
          const result = {
            title: frontMatter.title ? frontMatter.title : '',
            description: frontMatter.description ? frontMatter.description : '',
            url: route,
          }
          return result
        }),
    [pageMap],
  )

  const handleChange = () => {
    if (!inputRef.current) return
    if (inputRef.current.value.length === 0) {
      setSearchTerm(undefined)
      setSearchResults(undefined)
      setIsSearchResultOpen(false)
      return
    }
    if (inputRef.current.value.length > 2) {
      const curSearchTerm = inputRef.current.value.toLowerCase()

      // filters the frontMatter title and descriptions against the search term
      const filteredData = searchData
        .filter((data): data is SearchResults => data !== null)
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

      setSearchResultsDebounced(sortedData)

      setSearchTerm(inputRef.current.value)
      setIsSearchResultOpen(true)
      return
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!inputRef.current) return
    if (!inputRef.current.value) {
      // eslint-disable-next-line i18n-text/no-en
      alert(`Enter a value and try again.`)
      return
    }

    alert(`Name: ${inputRef.current.value}`)
  }

  const handleSearchButtonOpenClick = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  return (
    <nav
      className={clsx(styles.Header, isSearchOpen && styles['Header--searchAreaOpen'])}
      role="navigation"
      aria-label="Header Navigation"
    >
      <Link href="/" className={styles.Header__siteTitle}>
        <MarkGithubIcon size={24} />
        <Text as="p" size="300" weight="semibold">
          {siteTitle}
        </Text>
      </Link>
      <Box className={clsx(styles.Header__searchArea, isSearchOpen && styles['Header__searchArea--open'])}>
        <FormControl>
          <FormControl.Label visuallyHidden>Search</FormControl.Label>
          <TextInput
            contrast
            className={styles.Header__searchInput}
            leadingVisual={<SearchIcon />}
            placeholder={`Search ${siteTitle}`}
            ref={inputRef}
            onSubmit={handleSubmit}
            onChange={handleChange}
            trailingAction={
              searchTerm ? (
                <TextInput.Action
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.value = ''
                      setSearchTerm(undefined)
                      setSearchResults(undefined)
                    }
                  }}
                  icon={XIcon}
                  aria-label="Clear input"
                  tooltipDirection="nw"
                  sx={{color: 'fg.subtle'}}
                />
              ) : undefined
            }
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
                  className={clsx(styles.Header__searchResultsList)}
                >
                  {searchResults.map((result, index) => (
                    <li
                      key={`${result.title}-${index}`}
                      id={`search-result-${index}`}
                      role="option"
                      aria-selected={index === activeDescendant}
                    >
                      <Text size="200" className={styles.Header__searchResultItemTitle}>
                        <Link href={result.url}>{result.title}</Link>
                      </Text>
                      <Text
                        as="p"
                        size="100"
                        variant="muted"
                        id={`search-result-item-desc${index}`}
                        className={styles.Header__searchResultItemDesc}
                      >
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
        <div className={styles.Header__searchHeaderBanner}>
          <Stack direction="horizontal" padding="none" gap={4} alignItems="center" justifyContent="space-between">
            <Text as="p" size="300" weight="semibold">
              Search
            </Text>
            <IconButton
              icon={XIcon}
              variant="invisible"
              aria-label="Close search"
              onClick={() => setIsSearchOpen(false)}
            />
          </Stack>
        </div>
      </Box>
      <div>
        <Stack direction="horizontal" padding="none" gap={4}>
          <IconButton
            icon={colorMode === 'light' ? SunIcon : MoonIcon}
            variant="invisible"
            aria-label={`Change color mode. Active mode is ${colorMode}.`}
            onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
          />
          <IconButton
            icon={SearchIcon}
            variant="invisible"
            aria-label={`Open search`}
            sx={{display: ['flex', null, 'none']}}
            onClick={handleSearchButtonOpenClick}
          />
          <Box sx={{display: ['flex', null, 'none']}}>
            <IconButton
              icon={ThreeBarsIcon}
              variant="invisible"
              aria-label="Menu"
              aria-expanded={isNavDrawerOpen}
              onClick={() => setIsNavDrawerOpen(true)}
            />
            <NavDrawer isOpen={isNavDrawerOpen} onDismiss={() => setIsNavDrawerOpen(false)} navItems={pageMap} />
          </Box>
        </Stack>
      </div>
    </nav>
  )
}

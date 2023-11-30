import {MarkGithubIcon, MoonIcon, SearchIcon, SunIcon, XIcon} from '@primer/octicons-react'
import {Box, FormControl, IconButton, TextInput} from '@primer/react'
import {Heading, Stack, Text} from '@primer/react-brand'
import {useRouter} from 'next/router'
import {MdxFile, PageMapItem} from 'nextra'
import {PageItem} from 'nextra/normalize-pages'
import React, {useEffect, useMemo} from 'react'

import Link from 'next/link'
import styles from './Header.module.css'

type HeaderProps = {
  pageMap: PageMapItem[]
  menuItems: PageItem[]
  siteTitle: string
  colorModes: {
    value: 'light' | 'dark'
    handler: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
  }
}

export function Header({colorModes, pageMap, menuItems, siteTitle}: HeaderProps) {
  const router = useRouter()
  const basePath = router.basePath
  const inputRef = React.useRef(null)
  const searchResultsRef = React.useRef(null)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const [activeDescendant, setActiveDescendant] = React.useState<number>(-1)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    const handleClickAway = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !searchResultsRef.current?.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
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
    document.documentElement.setAttribute('data-color-mode', colorModes.value)
  }, [colorModes.value])

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
      setIsSearchOpen(false)
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
      setIsSearchOpen(true)
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
    <nav className={styles.Header}>
      <Link href="/" className={styles.Header__siteTitle}>
        <MarkGithubIcon size={24} />
        <Text as="p" size="300" weight="semibold">
          {siteTitle}
        </Text>
      </Link>
      <div className={styles.Header__searchArea}>
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
              searchTerm && (
                <TextInput.Action
                  onClick={() => {
                    inputRef.current.value = ''
                    setSearchTerm(undefined)
                    setSearchResults(undefined)
                  }}
                  icon={XIcon}
                  aria-label="Clear input"
                  tooltipDirection="nw"
                  sx={{color: 'fg.subtle'}}
                />
              )
            }
            aria-activedescendant={activeDescendant === -1 ? undefined : `search-result-${activeDescendant}`}
          />
        </FormControl>
        {searchTerm && (
          <Box
            ref={searchResultsRef}
            sx={{
              display: isSearchOpen ? 'block' : 'none',
              marginTop: 1,
              position: 'absolute',
              zIndex: 1,
              backgroundColor: 'var(--brand-color-canvas-subtle)',
              padding: 'var(--base-size-16)',
              width: '100%',
              maxWidth: '700px',
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
                    {searchResults && searchResults.length} Results for "{searchTerm}"
                  </Heading>
                </Box>
              )}
              {searchResults && searchResults.length > 0 ? (
                <ul
                  role="listbox"
                  tabIndex={0}
                  aria-labelledby="search-results-heading"
                  className={styles.Header__searchResultsList}
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
      </div>
      <div>
        <IconButton
          icon={colorModes.value === 'light' ? SunIcon : MoonIcon}
          variant="invisible"
          aria-label={`Change color mode. Active mode is ${colorModes.value}.`}
          onClick={() => colorModes.handler(colorModes.value === 'light' ? 'dark' : 'light')}
        />
      </div>
    </nav>
  )
}

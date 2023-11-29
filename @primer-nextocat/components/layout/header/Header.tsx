import React, {useEffect, useMemo} from 'react'
import {Heading, Stack, SubdomainNavBar, Text} from '@primer/react-brand'
import {PageMapItem, MdxFile} from 'nextra'
import {PageItem} from 'nextra/normalize-pages'
import {useRouter} from 'next/router'
import {MarkGithubIcon, MoonIcon, SearchIcon, SunIcon, XIcon} from '@primer/octicons-react'
import {FormControl, TextInput, IconButton, ActionMenu, ActionList, Box} from '@primer/react'

import styles from './Header.module.css'
import Link from 'next/link'

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
            url: `${basePath}${route}`,
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
              backgroundColor: 'var(--brand-color-canvas-default)',
              padding: 'var(--base-size-16)',
              width: '100%',
              maxWidth: '700px',
              border: 'var(--brand-borderWidth-thin) solid var(--brand-color-border-default)',
              borderRadius: 'var(--brand-borderRadius-medium)',
              maxHeight: 300,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <Stack direction="vertical" padding="none">
              {searchTerm && (
                <Box sx={{pl: 1}}>
                  <Heading as="h3" size="subhead-medium">
                    Results for "{searchTerm}"
                  </Heading>
                </Box>
              )}
              {searchResults && searchResults.length > 0 ? (
                <ActionList variant="full">
                  {searchResults.map(result => (
                    <ActionList.LinkItem href={result.url} key={result.title}>
                      {result.title}
                      <ActionList.Description>{result.description}</ActionList.Description>
                    </ActionList.LinkItem>
                  ))}
                </ActionList>
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

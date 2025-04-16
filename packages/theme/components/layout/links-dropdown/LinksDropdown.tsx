import React, {useState, useRef, useEffect, type HTMLProps} from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import {TriangleDownIcon} from '@primer/octicons-react'
import {Text} from '@primer/react-brand'

import styles from './LinksDropdown.module.css'

export type LinksDropdownItem = {
  title: string
  href: string
  selected?: boolean
}

export type LinksDropdownProps = {
  items: LinksDropdownItem[]
} & HTMLProps<HTMLDivElement>

export const LinksDropdown = ({items, className, ...props}: LinksDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const activeItem = items.find(item => item.selected) || items[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        buttonRef.current.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const focusElementWithIndex = (index: number) => {
    document.querySelector<HTMLAnchorElement>(`#dropdown-item-${index} a`)?.focus()
  }

  const handleToggle = () => {
    const nextIsOpen = !isOpen
    setIsOpen(nextIsOpen)

    if (nextIsOpen) {
      setTimeout(() => {
        focusElementWithIndex(0)
      }, 0)
    } else {
      buttonRef.current?.focus()
    }
  }

  useEffect(() => {
    const menu = menuRef.current

    if (!menu) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          buttonRef.current?.focus()
          break
        case 'Tab':
          setTimeout(() => {
            if (menuRef.current && !menuRef.current.contains(document.activeElement)) {
              setIsOpen(false)
            }
          }, 0)
          break
      }
    }

    menu.addEventListener('keydown', handleKeyDown)
    return () => {
      menu.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuRef])

  return (
    <div className={clsx(styles.dropdown, className)} {...props}>
      <button
        ref={buttonRef}
        className={styles.dropdownButton}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="links-dropdown-menu"
        onClick={handleToggle}
      >
        <Text size="200" className={styles.buttonText} variant="muted">
          {activeItem.title}
        </Text>
        <TriangleDownIcon className={styles.chevron} size={16} />
      </button>

      <div
        ref={menuRef}
        id="links-dropdown-menu"
        className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''}`}
        role="menu"
        aria-labelledby="links-dropdown-button"
      >
        <ul role="menu">
          {items.map((item, index) => (
            <li
              key={item.href}
              className={clsx(styles.menuItem)}
              role="menuitem"
              id={`dropdown-item-${index}`}
              aria-current={item.selected ? 'page' : undefined}
            >
              <Link
                href={item.href}
                className={clsx(styles.link, item.selected && styles.selected)}
                onClick={() => {
                  setIsOpen(false)
                }}
                tabIndex={isOpen ? 0 : -1}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    window.location.href = item.href
                  }
                }}
              >
                <Text size="200">{item.title}</Text>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

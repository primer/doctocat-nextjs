import React, {useState, useRef, useEffect, type HTMLProps, useCallback} from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import {TriangleDownIcon} from '@primer/octicons-react'
import {Text} from '@primer/react-brand'

import styles from './LinksDropdown.module.css'
import type {ConfigContextLink} from '../../context/useConfig'

export type LinksDropdownProps = {
  items: ConfigContextLink[]
} & HTMLProps<HTMLDivElement>

export const LinksDropdown = ({items, className, ...props}: LinksDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
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

    document.addEventListener('mousedown', closeDropdown)
    return () => {
      document.removeEventListener('mousedown', closeDropdown)
    }
  }, [menuRef, buttonRef])

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
            if (!menu.contains(document.activeElement)) {
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

  const handleToggle = useCallback(() => {
    const nextIsOpen = !isOpen
    setIsOpen(nextIsOpen)

    if (nextIsOpen) {
      setTimeout(() => {
        document.querySelector<HTMLAnchorElement>(`#dropdown-item-0 a`)?.focus()
      }, 0)
    } else {
      buttonRef.current?.focus()
    }
  }, [isOpen])

  const activeItem = items.find(item => item.isActive) || items[0]

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
              aria-current={item.active ? 'page' : undefined}
            >
              <Link
                href={item.href}
                className={clsx(styles.link)}
                onClick={() => {
                  setIsOpen(false)
                }}
                tabIndex={isOpen ? 0 : -1}
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

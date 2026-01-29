'use client'
import React, {type PropsWithChildren, useCallback, useState, useRef, useEffect, useId} from 'react'
import clsx from 'clsx'
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live'
import {useColorMode} from '../../context/color-modes/useColorMode'
import {useConfig} from '../../context/useConfig'
import styles from './ReactCodeBlock.module.css'
import {ActionBar, Button, ThemeProvider} from '@primer/react'
import {Text} from '@primer/react-brand'
import {CopyIcon, MoonIcon, SunIcon, UndoIcon, UnfoldIcon, FoldIcon} from '@primer/octicons-react'
import {colorModes} from '../../context/color-modes/context'

import {lightTheme, darkTheme} from './syntax-highlighting-themes'
import {codeTransformer} from './code-transformer'

const COLLAPSE_HEIGHT = 400 // TODO: Hoist this to config to make user customizable eventually

type ReactCodeBlockProps = {
  'data-language': string
  'data-filename'?: string
  code?: string
  jsxScope: Record<string, unknown>
} & PropsWithChildren<HTMLElement>

const getFocusableElements = () => {
  const focusableElementsQuery = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  return Array.from(document.querySelectorAll<HTMLElement>(focusableElementsQuery)).filter(el => {
    const style = window.getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden' && !el.hasAttribute('disabled')
  })
}

export function ReactCodeBlock(props: ReactCodeBlockProps) {
  const uniqueId = useId()
  const {colorMode, setColorMode} = useColorMode()
  const {basePath} = useConfig()
  const codeSourceRef = useRef<HTMLDivElement>(null)
  const [code, setCode] = useState<string>('')
  const [isReady, setIsReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [isCodePaneCollapsed, setIsCodePaneCollapsed] = useState<boolean | null>(null)
  const [initialPosition, setInitialPosition] = useState<number | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const resetButtonRef = useRef<HTMLButtonElement>(null)
  const shouldShowPreview = ['tsx', 'jsx'].includes(props['data-language'])

  useEffect(() => {
    if (codeSourceRef.current && !isReady) {
      const textContent = codeSourceRef.current.textContent || ''
      if (textContent) {
        setCode(textContent)
        setIsReady(true)
      }
    }
  }, [isReady, props.children])

  // scroll back to the initial y pos on collapse state change
  useEffect(() => {
    if (rootRef.current && initialPosition === null) {
      const rect = rootRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setInitialPosition(rect.top + scrollTop)
    }
  }, [initialPosition])

  useEffect(() => {
    if (editorRef.current && isCodePaneCollapsed === null) {
      const editorHeight = editorRef.current.scrollHeight
      setIsCodePaneCollapsed(editorHeight > COLLAPSE_HEIGHT)
    }
  }, [code, isCodePaneCollapsed])

  const shouldShowCollapse = isCodePaneCollapsed !== null && (editorRef.current?.scrollHeight || 0) > COLLAPSE_HEIGHT

  /**
   * Transforms code to prepend basePath to img src attributes
   */
  const transformCodeWithBasePath = useCallback(
    (sourceCode: string) => codeTransformer(sourceCode, basePath),
    [basePath],
  )

  const handleReset = useCallback(() => {
    if (codeSourceRef.current) {
      setCode(codeSourceRef.current.textContent || '')
    }
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
  }, [code])

  const handleCollapsibleCodePane = useCallback(() => {
    const newCollapsedState = !isCodePaneCollapsed

    if (!isCodePaneCollapsed && newCollapsedState && initialPosition !== null) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: initialPosition,
          behavior: 'smooth',
        })
      })
    }

    setIsCodePaneCollapsed(newCollapsedState)
  }, [isCodePaneCollapsed, initialPosition])

  const noInline = props['data-filename'] === 'noinline' || false

  useEffect(() => {
    const editor = editorRef.current

    if (!editor) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return
      }

      if (e.shiftKey) {
        e.preventDefault()
        // We know that the previous focusable element is always the reset button
        resetButtonRef.current?.focus()
        return
      }

      const focusableElements = getFocusableElements()

      const currentIndex = focusableElements.findIndex(el => el === resetButtonRef.current)

      if (currentIndex !== -1) {
        e.preventDefault()
        const nextIndex = currentIndex + 1
        focusableElements[nextIndex]?.focus()
      }
    }

    editor.addEventListener('keydown', onKeyDown)

    return () => {
      editor.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <>
      {/* Hidden el to render children and extract text content */}
      <div ref={codeSourceRef} style={{display: 'none'}} aria-hidden="true">
        {props.children}
      </div>
      {isReady && (
        <LiveProvider transformCode={transformCodeWithBasePath} code={code} scope={props.jsxScope} noInline={noInline}>
          <div ref={rootRef} className={clsx(styles.CodeBlock, 'custom-component')}>
            {shouldShowPreview && (
              <div>
                <div className={styles.colorModeMenu}>
                  <ActionBar aria-label="Toolbar">
                    {colorModes.map((mode, index) => {
                      const Icon = mode === 'light' ? SunIcon : MoonIcon
                      return (
                        <ActionBar.IconButton
                          className={clsx(styles.colorModeButton, colorMode === mode && styles.colorModeButtonActive)}
                          key={`color-mode-${mode}-${index}`}
                          icon={Icon}
                          aria-label={mode}
                          onClick={() => setColorMode(mode)}
                        />
                      )
                    })}
                  </ActionBar>
                </div>
                <ThemeProvider colorMode={colorMode}>
                  <div className="custom-component">
                    <LivePreview className={styles.Preview} />
                  </div>
                </ThemeProvider>
              </div>
            )}
            <div className={styles.Toolbar}>
              <Button size="small" leadingVisual={CopyIcon} onClick={handleCopy}>
                Copy
              </Button>
              <Button size="small" leadingVisual={UndoIcon} onClick={handleReset} ref={resetButtonRef}>
                Reset
              </Button>
            </div>
            <div className={styles.EditorWrapper}>
              <div
                className={clsx(styles.Editor, isCodePaneCollapsed && styles['Editor--is-collapsed'])}
                ref={editorRef}
                id={`${uniqueId}-code-editor-content`}
              >
                <LiveEditor theme={colorMode === 'light' ? lightTheme : darkTheme} onChange={setCode} />
              </div>
              {shouldShowCollapse && (
                <button
                  className={clsx(styles.collapseButton, isCodePaneCollapsed && styles['collapseButton--collapsed'])}
                  onClick={handleCollapsibleCodePane}
                  aria-expanded={!isCodePaneCollapsed}
                  aria-controls={`${uniqueId}-code-editor-content`}
                  aria-label={isCodePaneCollapsed ? 'Show full code block' : 'Collapse code block'}
                >
                  <Text size="100" className={styles.collapseLabel}>
                    {isCodePaneCollapsed ? 'Show full code' : 'Collapse code'}
                  </Text>
                  <Text variant="muted">{isCodePaneCollapsed ? <UnfoldIcon /> : <FoldIcon />}</Text>
                </button>
              )}
            </div>
            {shouldShowPreview && (
              <div className={styles.Error}>
                <LiveError />
              </div>
            )}
          </div>
        </LiveProvider>
      )}
    </>
  )
}

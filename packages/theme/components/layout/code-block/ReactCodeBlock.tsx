'use client'
import React, {PropsWithChildren, useCallback, useState} from 'react'
import clsx from 'clsx'
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live'
import {useColorMode} from '../../context/color-modes/useColorMode'
import {useConfig} from '../../context/useConfig'
import styles from './ReactCodeBlock.module.css'
import {ActionBar, Button, ThemeProvider} from '@primer/react'
import {CopyIcon, MoonIcon, SunIcon, UndoIcon} from '@primer/octicons-react'
import {colorModes} from '../../context/color-modes/context'

import {lightTheme, darkTheme} from './syntax-highlighting-themes'
import {codeTransformer} from './code-transformer'

type ReactCodeBlockProps = {
  'data-language': string
  'data-filename'?: string
  jsxScope: Record<string, unknown>
} & PropsWithChildren<HTMLElement>

export function ReactCodeBlock(props: ReactCodeBlockProps) {
  const {colorMode, setColorMode} = useColorMode()
  const {basePath} = useConfig()
  const initialCode = getCodeFromChildren(props.children)
  const [code, setCode] = useState(initialCode)
  const shouldShowPreview = ['tsx', 'jsx'].includes(props['data-language'])

  /**
   * Transforms code to prepend basePath to img src attributes
   */
  const transformCodeWithBasePath = useCallback(
    (sourceCode: string) => codeTransformer(sourceCode, basePath),
    [basePath],
  )

  const handleReset = useCallback(() => {
    setCode(initialCode)
  }, [initialCode, setCode])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
  }, [code])

  const noInline = props['data-filename'] === 'noinline' || false

  return (
    <>
      <LiveProvider transformCode={transformCodeWithBasePath} code={code} scope={props.jsxScope} noInline={noInline}>
        <div className={clsx(styles.CodeBlock, 'custom-component')}>
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
            <Button size="small" leadingVisual={UndoIcon} onClick={handleReset}>
              Reset
            </Button>
          </div>
          <div className={styles.Editor}>
            <LiveEditor theme={colorMode === 'light' ? lightTheme : darkTheme} onChange={setCode} />
          </div>
          {shouldShowPreview && (
            <div className={styles.Error}>
              <LiveError />
            </div>
          )}
        </div>
      </LiveProvider>
    </>
  )
}

/**
 * Helper function to turn Nextra <code> children into plain text
 */
function getCodeFromChildren(children: React.ReactNode) {
  if (!React.isValidElement(children) || !children.props?.children) return ''

  // Flattens the nested spans and combine their text content if it's a react child
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractText).join('')
    if (React.isValidElement(node) && node.props?.children) return extractText(node.props.children)
    return ''
  }

  return extractText(children)
}

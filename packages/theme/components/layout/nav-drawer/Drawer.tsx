import React, {PropsWithChildren} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {FocusOn} from 'react-focus-on'
import styles from './Drawer.module.css'

type Drawer = {
  isOpen: boolean
  onDismiss: () => void
}

export function Drawer({isOpen, onDismiss, children}: PropsWithChildren<Drawer>) {
  return (
    <AnimatePresence>
      {isOpen ? (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          // These event handlers fix a bug that caused links below the fold
          // to be unclickable in macOS Safari.
          // Reference: https://github.com/theKashey/react-focus-lock/issues/79
          onMouseDown={event => event.preventDefault()}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <FocusOn returnFocus={true} onEscapeKey={() => onDismiss()}>
            <motion.div
              key="overlay"
              className={styles.DrawerOverlay}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{type: 'tween'}}
              onClick={() => onDismiss()}
            />

            <motion.div
              key="drawer"
              className={styles.DrawerPanel}
              initial={{x: '100%'}}
              animate={{x: 0}}
              exit={{x: '100%'}}
              transition={{type: 'tween', duration: 0.2}}
            >
              {children}
            </motion.div>
          </FocusOn>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

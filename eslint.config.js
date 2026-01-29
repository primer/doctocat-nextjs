import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import primerReactPlugin from 'eslint-plugin-primer-react'
import * as mdxPlugin from 'eslint-plugin-mdx'
import globals from 'globals'

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'out/**',
      'types/**',
      'CHANGELOG.md',
      '**/next-env.d.ts',
      '**/coverage/**',
    ],
  },

  // Base JavaScript config
  js.configs.recommended,

  // React config
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  reactPlugin.configs.flat['jsx-runtime'],

  // JSX A11y
  jsxA11yPlugin.flatConfigs.recommended,

  // Prettier
  prettierPlugin,

  // Primer React
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'primer-react': primerReactPlugin,
    },
    rules: {
      ...primerReactPlugin.configs.recommended.rules,
      'primer-react/no-system-props': 'off',
    },
  },

  // Base rules for all JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
        __DEV__: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'off',
      camelcase: [
        'error',
        {
          allow: ['dark_dimmed'],
        },
      ],
    },
  },

  // JavaScript specific rules
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-shadow': 'off',
      'no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // TypeScript
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^React$',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // MDX files
  {
    ...mdxPlugin.flat,
    files: ['**/*.{md,mdx}'],
    processor: mdxPlugin.createRemarkProcessor({
      lintCodeBlocks: false,
    }),
    rules: {
      'prettier/prettier': 'off',
      'react/jsx-no-undef': 'off',
      'react/no-unescaped-entities': 'off',
      'no-unused-vars': 'off',
    },
  },

  // MDX code blocks
  {
    ...mdxPlugin.flatCodeBlocks,
    files: ['**/*.{md,mdx}/**'],
    rules: {
      ...mdxPlugin.flatCodeBlocks?.rules,
      camelcase: 'off',
      'no-constant-condition': 'off',
      'no-console': 'off',
      'no-empty-pattern': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-undef': 'off',
      'react/jsx-key': 'off',
      'react/jsx-no-comment-textnodes': 'off',
      'prettier/prettier': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-unused-labels': 'off',
    },
  },
)

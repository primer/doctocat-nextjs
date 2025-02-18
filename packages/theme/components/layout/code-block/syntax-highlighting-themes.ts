export const lightTheme = {
  plain: {
    backgroundColor: '#ffffff',
    color: '#24292e',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: '#6a737d',
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['string', 'number', 'builtin', 'variable'],
      style: {
        color: '#032f62',
      },
    },
    {
      types: ['class-name', 'function', 'tag', 'attr-name'],
      style: {
        color: '#005CC5',
      },
    },
  ],
}

export const darkTheme = {
  plain: {
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: '#8b949e',
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['string', 'number', 'builtin', 'variable'],
      style: {
        color: '#a5d6ff',
      },
    },
    {
      types: ['class-name', 'function', 'tag', 'attr-name'],
      style: {
        color: '#d2a8ff',
      },
    },
  ],
}

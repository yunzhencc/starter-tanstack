import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    ignores: ['README.md', 'src/routeTree.gen.ts'],
  },
  {
    files: ['src/routes/**/*.tsx', 'src/integrations/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/components/Footer.tsx'],
    rules: {
      'react/purity': 'off',
    },
  },
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/components/ThemeToggle.tsx'],
    rules: {
      'react/set-state-in-effect': 'off',
    },
  },
  {
    files: ['src/routes/__root.tsx'],
    rules: {
      'react/dom-no-dangerously-set-innerhtml': 'off',
    },
  },
)

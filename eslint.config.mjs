import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ['**/*.test.ts', '**/*.test.tsx', 'vitest.config.ts', 'vitest.setup.ts'],
  },
  {
    rules: {
      // Date.now() in server components is fine — they're not pure render functions
      'react-hooks/purity': 'warn',
      // setState in useEffect for timers/subscriptions is a valid React pattern
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default eslintConfig

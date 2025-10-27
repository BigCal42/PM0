import js from '@eslint/js'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import reactRecommended from './config/eslint/react-recommended.js'
import { typescriptRecommended } from './config/eslint/typescript-recommended.js'
import viteRecommended from './config/eslint/vite-recommended.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    name: 'app/ignores',
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.vercel/**',
      '**/playwright-report/**',
      '**/.playwright/**',
    ],
  },
  {
    name: 'app/base-language-options',
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  js.configs.recommended,
  ...typescriptRecommended({ tsconfigRootDir: __dirname }),
  reactRecommended,
  viteRecommended,
]

import path from 'node:path'
import globals from 'globals'

import tsParser from './simple-typescript-parser.js'

function createNoExplicitAnyRule() {
  return {
    meta: {
      type: 'problem',
      docs: {
        description: 'discourage explicit any types to match common TypeScript recommended rules',
      },
      messages: {
        avoidAny: 'Avoid using the `any` type. Consider typing this value explicitly.',
      },
      schema: [],
    },
    create(context) {
      return {
        Program() {
          const sourceCode = context.sourceCode ?? context.getSourceCode()
          const sourceText = sourceCode.getText()
          const anyMatches = sourceText.match(/:\s*any\b/g)
          if (!anyMatches) return

          let match
          const regex = /:\s*any\b/g
          while ((match = regex.exec(sourceText)) !== null) {
            const index = match.index
            const node = sourceCode.getNodeByRangeIndex(index)
            if (node) {
              context.report({ node, messageId: 'avoidAny' })
            }
          }
        },
      }
    },
  }
}

const typescriptPlugin = {
  meta: {
    name: 'custom-typescript-plugin',
    version: '0.0.1',
  },
  rules: {
    'no-explicit-any': createNoExplicitAnyRule(),
  },
}

export function typescriptRecommended({ tsconfigRootDir }) {
  const tsconfigPath = path.join(tsconfigRootDir, 'tsconfig.json')
  return [
    {
      name: 'app/typescript-parser',
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          project: tsconfigPath,
          tsconfigRootDir,
          extraFileExtensions: ['.d.ts'],
          ecmaFeatures: {
            jsx: true,
          },
        },
        globals: {
          ...globals.browser,
          ...globals.node,
        },
      },
      plugins: {
        typescript: typescriptPlugin,
      },
      settings: {
        typescript: {
          project: tsconfigPath,
          tsconfigRootDir,
          paths: {
            '@/*': ['src/*'],
          },
        },
      },
      rules: {
        'no-undef': 'off',
        'no-unused-vars': [
          'error',
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        'no-redeclare': 'off',
        'no-dupe-class-members': 'off',
        'no-empty-function': [
          'error',
          { allow: ['arrowFunctions', 'functions', 'methods'] },
        ],
        'typescript/no-explicit-any': 'warn',
      },
    },
  ]
}

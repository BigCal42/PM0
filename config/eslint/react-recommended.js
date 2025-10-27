const reactPlugin = {
  meta: {
    name: 'custom-react-plugin',
    version: '0.0.1',
  },
  rules: {
    'no-dangerous-html': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'disallow dangerouslySetInnerHTML in JSX to mirror React recommended guidance',
        },
        messages: {
          avoidDangerousHtml: 'Avoid using dangerouslySetInnerHTML; prefer sanitized data rendering.',
        },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name && node.name.name === 'dangerouslySetInnerHTML') {
              context.report({
                node,
                messageId: 'avoidDangerousHtml',
              })
            }
          },
        }
      },
    },
  },
}

const reactRecommended = {
  name: 'app/react-recommended',
  plugins: {
    react: reactPlugin,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    'react/no-dangerous-html': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}

export default reactRecommended

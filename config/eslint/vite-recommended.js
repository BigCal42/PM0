const vitePlugin = {
  meta: {
    name: 'custom-vite-plugin',
    version: '0.0.1',
  },
  rules: {
    'no-process-env': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'encourage using import.meta.env instead of process.env in client code as recommended by Vite',
        },
        schema: [],
        messages: {
          preferImportMeta: 'Use import.meta.env instead of process.env in Vite client code.',
        },
      },
      create(context) {
        return {
          MemberExpression(node) {
            if (
              node.object &&
              node.object.type === 'Identifier' &&
              node.object.name === 'process' &&
              node.property &&
              ((node.property.type === 'Identifier' && node.property.name === 'env') ||
                (node.property.type === 'Literal' && node.property.value === 'env'))
            ) {
              context.report({ node, messageId: 'preferImportMeta' })
            }
          },
        }
      },
    },
  },
}

const viteRecommended = {
  name: 'app/vite-recommended',
  files: ['src/**/*.{ts,tsx,js,jsx}'],
  plugins: {
    vite: vitePlugin,
  },
  rules: {
    'vite/no-process-env': 'warn',
  },
}

export default viteRecommended

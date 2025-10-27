import ts from 'typescript'
import * as espree from 'espree'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { analyze } = require('eslint-scope')

function transpile(code, filePath) {
  const isTSX = filePath.endsWith('.tsx') || filePath.endsWith('.jsx')
  const compilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    jsx: isTSX ? ts.JsxEmit.Preserve : ts.JsxEmit.None,
    allowJs: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    useDefineForClassFields: false,
    importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Preserve,
  }

  return ts.transpileModule(code, {
    compilerOptions,
    fileName: filePath,
    reportDiagnostics: false,
  })
}

function toParseOptions(options, isTSX) {
  const ecmaVersion = options?.ecmaVersion ?? 2022
  const sourceType = options?.sourceType ?? 'module'

  return {
    ecmaVersion,
    sourceType,
    loc: true,
    range: true,
    tokens: true,
    comment: true,
    ecmaFeatures: {
      jsx: isTSX,
      globalReturn: options?.ecmaFeatures?.globalReturn ?? false,
    },
  }
}

export function parseForESLint(code, options = {}) {
  const filePath = options.filePath ?? 'eslint.ts'
  const isTSX = filePath.endsWith('.tsx') || filePath.endsWith('.jsx')
  const transpiled = transpile(code, filePath)
  const parserOptions = toParseOptions(options, isTSX)
  const ast = espree.parse(transpiled.outputText, parserOptions)

  const scopeManager = analyze(ast, {
    ecmaVersion: parserOptions.ecmaVersion,
    sourceType: parserOptions.sourceType,
    ecmaFeatures: parserOptions.ecmaFeatures,
  })

  return {
    ast,
    scopeManager,
    visitorKeys: espree.VisitorKeys,
    services: {
      transpiledText: transpiled.outputText,
      project: options.project ?? null,
    },
  }
}

export default {
  parseForESLint,
}

import tsParser from '@typescript-eslint/parser'
import baseConfig from '@bangbang93/eslint-config-recommended'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  ...baseConfig,
  {
    ignores: ['eslint.config.mjs', 'dist'],
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['test/*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintPluginPrettierRecommended,
]

// @ts-check

import jsxa11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import typescript from 'typescript-eslint'

// Importing from local file instead of npm package because of ESM vs CommonJS
import confusingBrowserGlobals from './confusingBrowserGlobals.js'

const jsxRuntime = react.configs.flat?.['jsx-runtime']

if (!jsxRuntime) {
  throw new Error('Missing react/jsx-runtime config')
}

export default [
  // Global ignore patterns
  {
    ignores: ['.sanity/', 'dist/'],
  },

  // Global settings
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],

    settings: {
      react: {
        // removes warning "React version not specified in eslint-plugin-react settings"
        version: 'detect',
      },
    },

    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Ground rules
  {
    // inspired by:
    // - https://github.com/eslint/eslint/blob/dd58cd4afa6ced9016c091fc99a702c97a3e44f0/conf/eslint-recommended.js#L14-L74
    // - https://github.com/suchipi/eslint-config-unobtrusive/blob/744a7f23a549c3dcf0a35a0d43372a268af4f028/index.js
    rules: {
      'constructor-super': 'error',
      'for-direction': 'error',
      'getter-return': 'error',
      'no-case-declarations': 'warn',
      'no-class-assign': 'warn',
      'no-compare-neg-zero': 'warn',
      // https://github.com/suchipi/eslint-config-unobtrusive/blob/744a7f23a549c3dcf0a35a0d43372a268af4f028/index.js#L43-L52
      'no-cond-assign': ['warn', 'except-parens'],
      'no-const-assign': 'error',
      // https://github.com/suchipi/eslint-config-unobtrusive/blob/744a7f23a549c3dcf0a35a0d43372a268af4f028/index.js#L58-L63
      'no-constant-condition': ['warn', {checkLoops: false}],
      'no-debugger': 'warn',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error', // Note: has a TS extension
      'no-dupe-else-if': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'warn',
      'no-empty-function': 'warn', // Note: has a TS extension
      'no-empty-pattern': 'warn',
      'no-ex-assign': 'warn',
      'no-func-assign': 'warn',
      'no-global-assign': 'error',
      'no-import-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-loss-of-precision': 'warn', // Note: has a TS extension
      'no-misleading-character-class': 'warn',
      'no-new-native-nonconstructor': 'error',
      'no-nonoctal-decimal-escape': 'warn',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-redeclare': 'warn', // Note: has a TS extension
      // https://github.com/facebook/create-react-app/blob/a422bf227cf5294a34d68696664e9568a152fd8f/packages/eslint-config-react-app/index.js#L165
      'no-restricted-globals': ['warn', ...confusingBrowserGlobals],
      'no-self-assign': 'warn',
      'no-setter-return': 'warn',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'warn',
      'no-this-before-super': 'error',
      'no-undef': 'error',
      'no-unexpected-multiline': 'warn',
      'no-unreachable': 'warn',
      'no-unsafe-finally': 'warn',
      'no-unsafe-negation': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      // typically represents an unfinished assignment
      // https://github.com/facebook/create-react-app/blob/a422bf227cf5294a34d68696664e9568a152fd8f/packages/eslint-config-react-app/index.js#L167-L174
      // Note: has a TS extension
      'no-unused-expressions': [
        'warn',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-unused-labels': 'warn',
      // rest siblings are fine
      // https://github.com/facebook/create-react-app/blob/a422bf227cf5294a34d68696664e9568a152fd8f/packages/eslint-config-react-app/index.js#L176-L182
      // Note: has a TS extension
      'no-unused-vars': ['warn', {args: 'none', ignoreRestSiblings: true}],
      // https://github.com/facebook/create-react-app/blob/a422bf227cf5294a34d68696664e9568a152fd8f/packages/eslint-config-react-app/index.js#L183-L190
      // Note: has TS extension
      'no-use-before-define': ['warn', {functions: false, classes: false, variables: false}],
      'no-useless-backreference': 'warn',
      'no-useless-escape': 'warn',
      'no-with': 'error',
      'require-yield': 'warn',
      'use-isnan': 'warn',
      // https://github.com/suchipi/eslint-config-unobtrusive/blob/744a7f23a549c3dcf0a35a0d43372a268af4f028/index.js#L217-L225
      'valid-typeof': ['warn', {requireStringLiterals: false}],
    },
  },

  // Basic React support
  {
    plugins: {react: react},
    rules: {
      // mostly inspired by plugin:react/recommended but less strict
      // https://github.com/yannickcr/eslint-plugin-react/blob/151bb2b13892969bea17b334e882eb422152c30a/index.js#L124-L157
      'react/jsx-key': 'warn',
      'react/jsx-no-comment-textnodes': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-target-blank': 'warn',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'warn',
      'react/no-danger-with-children': 'warn',
      'react/no-direct-mutation-state': 'error',
      'react/no-is-mounted': 'warn',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-typos': 'warn',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'warn',
      'react/prop-types': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/require-render-return': 'error',
      'react/style-prop-object': 'warn',
    },
  },

  // React Hooks
  {
    plugins: {'react-hooks': reactHooks},
    rules: {
      // https://github.com/facebook/react/blob/9a7e6bf0d0cf08114b74c9fe45c06e60a5e496e4/packages/eslint-plugin-react-hooks/src/index.js#L17-L18
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // React/JSX Accessibility
  {
    plugins: {'jsx-a11y': jsxa11y},
    rules: {
      // inspired by eslint-config-react-app
      // https://github.com/facebook/create-react-app/blob/9673858a3715287c40aef9e800c431c7d45c05a2/packages/eslint-config-react-app/index.js#L260-L281
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-role': ['warn', {ignoreNonDOM: true}],
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/scope': 'warn',
    },
  },

  // TypeScript
  {
    files: ['**/*.ts?(x)'],
    plugins: {typescript: typescript.plugin},
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {jsx: true},
      },
    },
    rules: {
      // https://typescript-eslint.io/rules/#extension-rules
      'no-dupe-class-members': 'off',
      'typescript/no-dupe-class-members': 'error',

      'no-empty-function': 'off',
      'typescript/no-empty-function': 'warn',

      'no-redeclare': 'off',
      'typescript/no-redeclare': 'warn',

      // TypeScript should do a good job at this
      'no-unsafe-optional-chaining': 'off',
      'no-undef': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'no-unused-vars': 'off',
      // https://github.com/facebook/create-react-app/blob/a422bf227cf5294a34d68696664e9568a152fd8f/packages/eslint-config-react-app/index.js#L82-L88
      'typescript/no-unused-vars': ['warn', {args: 'none', ignoreRestSiblings: true}],

      'no-use-before-define': 'off',
      // https://github.com/facebook/create-react-app/blob/a422bf227cf5294a34d68696664e9568a152fd8f/packages/eslint-config-react-app/index.js#L63-L71
      'typescript/no-use-before-define': [
        'warn',
        {functions: false, classes: false, variables: false},
      ],

      'no-unused-expressions': 'off',
      // https://github.com/facebook/create-react-app/blob/a422bf227cf5294a34d68696664e9568a152fd8f/packages/eslint-config-react-app/index.js#L73-L80
      'typescript/no-unused-expressions': [
        'warn',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],

      // ts-only rules
      'typescript/no-empty-object-type': 'warn',
      'typescript/no-extra-non-null-assertion': 'warn',
      'typescript/no-misused-new': 'warn',
    },
  },
]

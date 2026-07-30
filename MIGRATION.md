## From v6 to v7

v7 requires ESLint 10, and replaces `eslint-plugin-react` with
[ESLint React](https://eslint-react.xyz). **Every React rule has a new name**, so
any `eslint-disable` comment referencing a `react/*` rule needs updating.

- Upgrade `eslint` in your studios `package.json` to `^10.0.0`
- Upgrade `@sanity/eslint-config-studio` in your studios `package.json` to `^7.0.0`
- Upgrade Node.js to at least 22.13. Double check the Node.js version used by your editor's ESLint integration too
- Rename or remove `react/*` `eslint-disable` comments, see below
- Remove any `/* eslint-env */` comments from your code. ESLint 10 reports them as errors

### Update your `eslint-disable` comments

A disable comment naming a rule that no longer exists is reported as an error
(`Definition for rule 'react/jsx-key' was not found`), **and** the problem it used
to suppress comes back. Search your project for `react/` to find them.

Rules that were renamed:

| Removed                          | Replacement                                                    |
| -------------------------------- | -------------------------------------------------------------- |
| `react/jsx-key`                  | `@eslint-react/no-missing-key`                                 |
| `react/jsx-no-comment-textnodes` | `@eslint-react/jsx-no-comment-textnodes`                       |
| `react/jsx-no-target-blank`      | `@eslint-react/dom-no-unsafe-target-blank`                     |
| `react/no-danger-with-children`  | `@eslint-react/dom-no-dangerously-set-innerhtml-with-children` |
| `react/no-direct-mutation-state` | `@eslint-react/no-direct-mutation-state`                       |
| `react/no-render-return-value`   | `@eslint-react/dom-no-render-return-value`                     |
| `react/no-unknown-property`      | `@eslint-react/dom-no-unknown-property`                        |
| `react/style-prop-object`        | `@eslint-react/dom-no-string-style-prop`                       |

Rules that were removed without a replacement, because ESLint React has no
equivalent. Delete disable comments for these:

| Removed                        | Why                                                                 |
| ------------------------------ | ------------------------------------------------------------------- |
| `react/jsx-no-duplicate-props` | no equivalent                                                       |
| `react/no-unescaped-entities`  | no equivalent. ESLint 10 rejects an unescaped `>` as a parse error  |
| `react/no-string-refs`         | no equivalent. String refs were removed in React 19                 |
| `react/require-render-return`  | no equivalent                                                       |
| `react/no-is-mounted`          | no equivalent. `isMounted` was removed in React 19                  |
| `react/no-typos`               | no equivalent                                                       |
| `react/prop-types`             | no equivalent. `propTypes` was removed in React 19                  |
| `react/react-in-jsx-scope`     | not needed with the automatic JSX runtime, and was already disabled |
| `react/jsx-uses-react`         | not needed with the automatic JSX runtime, see below                |
| `react/jsx-uses-vars`          | ESLint 10 tracks JSX references natively                            |

`jsx-a11y/*` rules are unaffected. They are now provided by
[`eslint-plugin-jsx-a11y-x`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x),
a maintained fork with identical rule names, registered under the same `jsx-a11y`
namespace.

### If you use the classic JSX runtime

With the classic runtime, `import React from 'react'` is only referenced
implicitly, by the JSX transform. `react/jsx-uses-react` used to mark it as used;
nothing in v7 does, so `no-unused-vars` will report it.

Sanity Studio uses the automatic runtime, where no `React` import is needed. If
you still need the classic runtime, remove the unused imports, or disable
`no-unused-vars` for them.

### New reports to expect

- `no-shadow-restricted-names` now reports declarations that shadow `globalThis`, such as `const globalThis = 'foo'`. Rename the local identifier, or set `'no-shadow-restricted-names': ['error', {reportGlobalThis: false}]` in your own config to opt out
- Three rules that ESLint 10 added to `eslint:recommended` are now enabled as warnings: [`no-unassigned-vars`](https://eslint.org/docs/latest/rules/no-unassigned-vars), [`no-useless-assignment`](https://eslint.org/docs/latest/rules/no-useless-assignment) and [`preserve-caught-error`](https://eslint.org/docs/latest/rules/preserve-caught-error)
- ESLint 10 tracks JSX references natively, which can surface `no-unused-vars` and `no-undef` reports in JSX files that were previously missed

### Other things to be aware of

- ESLint 10 looks for `eslint.config.*` starting from each linted file's directory and searching upwards, instead of from the current working directory. If you relied on the old behaviour, pass `--config path/to/eslint.config.mjs` explicitly
- See the [ESLint v10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0) for the full list of upstream changes
- ESLint React offers many more rules than this config enables. See [its rules reference](https://eslint-react.xyz/docs/rules) if you want to opt into more

## From v4 to v5

- Upgrade `eslint` in your studios `package.json` to `^9.0.0`
- Upgrade `@sanity/eslint-config-studio` in your studios `package.json` to `^5.0.0`
- Create `eslint.config.mjs` in the root of your studio, and add the following content:

  ```js
  import studio from '@sanity/eslint-config-studio'

  export default [...studio]
  ```

- If your `.eslintrc` file only contains the default `extends` value (`{"extends": "@sanity/eslint-config-studio"}`), delete the file. Otherwise, you will need to consult the [ESLint migration guide](https://eslint.org/docs/latest/use/configure/migration-guide) for more information on how to migrate to the new configuration format.

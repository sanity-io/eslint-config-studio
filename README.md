# @sanity/eslint-config-studio

The ESLint configuration that ships with new Sanity Studio projects.

Designed to be relatively unobtrusive to help find bugs instead enforce opinions.

## Installation

### Install

```
yarn add eslint @sanity/eslint-config-studio --dev
```

or

```
npm install eslint @sanity/eslint-config-studio --save-dev
```

### Update the configuration

Add the following to `eslint.config.mjs`

```js
import studio from '@sanity/eslint-config-studio'

export default [...studio]
```

### Version compatibility

This package is designed to work with ESLint >= 10, and requires Node.js >= 22.13.

| ESLint  | `@sanity/eslint-config-studio`                                       |
| ------- | -------------------------------------------------------------------- |
| `>= 10` | `7`                                                                  |
| `9`     | [`6`](https://github.com/sanity-io/eslint-config-studio/tree/v6.0.0) |
| `<= 8`  | [`4`](https://github.com/sanity-io/eslint-config-studio/tree/v4.0.0) |

See [`MIGRATION.md`](./MIGRATION.md) when upgrading between majors. Upgrading to `7` renames every React rule, so read it before you upgrade.

## Plugins

| Plugin                                                                                 | Namespace       | Covers            |
| -------------------------------------------------------------------------------------- | --------------- | ----------------- |
| [`@eslint-react/eslint-plugin`](https://eslint-react.xyz)                              | `@eslint-react` | React and JSX     |
| [`eslint-plugin-jsx-a11y-x`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x)   | `jsx-a11y`      | JSX accessibility |
| [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) | `react-hooks`   | Rules of Hooks    |
| [`typescript-eslint`](https://typescript-eslint.io)                                    | `typescript`    | TypeScript        |

`eslint-plugin-jsx-a11y-x` is a maintained fork of `eslint-plugin-jsx-a11y`, which has not supported ESLint since v9. Rule names are identical, and it is registered under the original `jsx-a11y` namespace, so `jsx-a11y/*` rule IDs and `eslint-disable` comments are unaffected.

## Differences from [`eslint-config-sanity`](https://github.com/sanity-io/eslint-config-sanity)

|              | `eslint-config-sanity`                             | `@sanity/eslint-config-studio`                                                   |
| ------------ | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| Use case     | internal projects                                  | offered publicly to be used in the [Sanity Studio](https://www.sanity.io/studio) |
| Rule set     | opinionated, enforces internal conventions         | unobtrusive, unopinionated, offered solely to catch bugs                         |
| Dependencies | contains many presets but must install each plugin | contains only one preset, but install plugins for you\*                          |

Since this package includes dependencies to plugins, it will never have more than one preset.

## Release new version

Run ["CI & Release" workflow](https://github.com/sanity-io/eslint-config-studio/actions).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.

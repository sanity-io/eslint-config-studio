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

This package is designed to work with ESLint >= 9, which supports/uses the new ["flat configuration"](https://eslint.org/blog/2022/08/new-config-system-part-2/) format.

If you are using ESLint <= 8, you should install and use [`@sanity/eslint-config-studio@4`](https://github.com/sanity-io/eslint-config-studio/tree/v4.0.0).

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

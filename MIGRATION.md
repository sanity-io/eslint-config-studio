## From v4 to v5

- Upgrade `eslint` in your studios `package.json` to `^9.0.0`
- Upgrade `@sanity/eslint-config-studio` in your studios `package.json` to `^5.0.0`
- Create `eslint.config.mjs` in the root of your studio, and add the following content:

  ```js
  import studio from '@sanity/eslint-config-studio'

  export default [...studio]
  ```

- If your `.eslintrc` file only contains the default `extends` value (`{"extends": "@sanity/eslint-config-studio"}`), delete the file. Otherwise, you will need to consult the [ESLint migration guide](https://eslint.org/docs/latest/use/configure/migration-guide) for more information on how to migrate to the new configuration format.

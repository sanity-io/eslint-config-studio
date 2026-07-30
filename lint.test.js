import fs from 'node:fs'
import path from 'node:path'
import {ESLint} from 'eslint'
import {afterEach, expect, it} from 'vitest'

// `mock-files` is gitignored. Fixtures are written at runtime rather than
// committed, so that `npm run lint` doesn't try to lint code that intentionally
// violates the config.
const mockDir = path.resolve(import.meta.dirname, 'mock-files')

afterEach(async () => {
  await fs.promises.rm(mockDir, {recursive: true, force: true})
})

/**
 * Lints the given fixtures with this package's config and returns every
 * reported rule, sorted and deduplicated.
 *
 * @param {Record<string, string>} files fixture filename to its contents
 * @returns {Promise<string[]>}
 */
async function lintRuleIds(files) {
  await fs.promises.mkdir(mockDir, {recursive: true})

  for (const [filename, content] of Object.entries(files)) {
    await fs.promises.writeFile(path.join(mockDir, filename), content)
  }

  const eslint = new ESLint({cwd: import.meta.dirname})
  const results = await eslint.lintFiles([mockDir])

  return [
    ...new Set(
      results.flatMap((result) =>
        // messages without a `ruleId` come from ESLint itself rather than a
        // rule, e.g. parse errors, so surface the message to make failures
        // readable instead of dropping them
        result.messages.map((message) => message.ruleId ?? `[fatal] ${message.message}`)
      )
    ),
  ].sort()
}

// `index.test.js` resolves the config and inspects rule metadata, so it cannot
// catch a rule that loads but stops reporting.
it('reports the expected rules across every supported plugin', async () => {
  const ruleIds = await lintRuleIds({
    'component.jsx': `
import {useEffect, useState} from 'react'

export function Component(props) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(count + 1)
  }, [])

  if (props.enabled) {
    useState(0)
  }

  return (
    <div>
      <img src={props.src} />
      <a href="https://example.com" target="_blank" />
      <div style="color: red" />
      {props.items.map((item) => (
        <span onClick={() => setCount(count + 1)}>{item}</span>
      ))}
    </div>
  )
}
`,
    'types.ts': `
export type Empty = {}

export function fn(): void {
  const unused: Empty = {}
}
`,
  })

  expect(ruleIds).toEqual([
    '@eslint-react/dom-no-string-style-prop',
    '@eslint-react/dom-no-unsafe-target-blank',
    '@eslint-react/no-missing-key',
    'jsx-a11y/alt-text',
    'jsx-a11y/anchor-has-content',
    'react-hooks/exhaustive-deps',
    'react-hooks/rules-of-hooks',
    'typescript/no-empty-object-type',
    'typescript/no-unused-vars',
  ])
})

// ESLint 10 tracks JSX references natively, which is why this config no longer
// enables `react/jsx-uses-vars`. If that tracking ever regresses, every
// component referenced only from JSX would be reported as unused.
it('does not report variables that are only referenced from JSX', async () => {
  const ruleIds = await lintRuleIds({
    'jsx-references.jsx': `
import {Imported} from './imported.js'

function Local() {
  return <b />
}

export function App() {
  return (
    <div>
      <Imported />
      <Local />
    </div>
  )
}
`,
  })

  expect(ruleIds).toEqual([])
})

// Documents an accepted consequence of dropping `eslint-plugin-react`: nothing
// marks a classic-runtime `React` import as used, because ESLint 10's native JSX
// reference tracking only sees real identifiers, and `@eslint-react` has no
// equivalent of `react/jsx-uses-react`. Sanity Studio uses the automatic
// runtime, so this is documented in MIGRATION.md rather than worked around.
it('reports a classic JSX runtime React import as unused', async () => {
  const ruleIds = await lintRuleIds({
    'classic-runtime.jsx': `
import React from 'react'

export const Classic = () => <span />
`,
  })

  expect(ruleIds).toEqual(['no-unused-vars'])
})

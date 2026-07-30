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

it('reports the React rules that catch outright bugs', async () => {
  const ruleIds = await lintRuleIds({
    'bugs.jsx': `
/* global document, window, setInterval, setTimeout, ResizeObserver, IntersectionObserver */
import {createRef, lazy, useEffect, useMemo} from 'react'
import ReactDOM, {findDOMNode, useFormState} from 'react-dom'

export function Bad({items, value, action}) {
  const ref = createRef()
  const memo = useMemo(() => {})
  const Lazy = lazy(() => import('./x.js'))
  const [state] = useFormState(action, null)

  function Nested() {
    return <i />
  }

  useEffect(() => {
    window.addEventListener('resize', () => value)
    setInterval(() => value, 1000)
    setTimeout(() => value, 1000)
    new ResizeObserver(() => value).observe(document.body)
    new IntersectionObserver(() => value).observe(document.body)
  }, [value])

  return (
    <div ref={ref}>
      <img alt="" src="/x.png">child</img>
      <span children="a">b</span>
      <svg:circle r="1" />
      <p>
        {value};
      </p>
      <Nested />
      <Lazy />
      {memo}
      {state}
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </div>
  )
}

export function mount(node) {
  ReactDOM.render(<Bad />, node)
  ReactDOM.hydrate(<Bad />, node)
  findDOMNode(node)
}
`,
  })

  expect(ruleIds).toEqual([
    '@eslint-react/dom-no-find-dom-node',
    '@eslint-react/dom-no-hydrate',
    '@eslint-react/dom-no-render',
    '@eslint-react/dom-no-use-form-state',
    '@eslint-react/dom-no-void-elements-with-children',
    '@eslint-react/jsx-no-children-prop-with-children',
    '@eslint-react/jsx-no-leaked-semicolon',
    '@eslint-react/jsx-no-namespace',
    '@eslint-react/no-array-index-key',
    '@eslint-react/no-create-ref',
    '@eslint-react/no-nested-component-definitions',
    '@eslint-react/no-nested-lazy-component-declarations',
    '@eslint-react/use-memo',
    '@eslint-react/web-api-no-leaked-event-listener',
    '@eslint-react/web-api-no-leaked-intersection-observer',
    '@eslint-react/web-api-no-leaked-interval',
    '@eslint-react/web-api-no-leaked-resize-observer',
    '@eslint-react/web-api-no-leaked-timeout',
    // the empty `useMemo` callback and the incomplete dependency array are
    // reported too, and are part of the same set of mistakes
    'no-empty-function',
    'react-hooks/exhaustive-deps',
  ])
})

// The rules above are only worth enabling if they stay quiet on correct code.
// `jsx-no-leaked-dollar` was left out of the config precisely because it does
// not: it reports ordinary currency formatting like `Total: ${value} USD`.
it('stays quiet on correct React code', async () => {
  const ruleIds = await lintRuleIds({
    'correct.jsx': `
/* global document, window, setInterval, clearInterval, setTimeout, clearTimeout, ResizeObserver, IntersectionObserver */
import {useEffect, useMemo, useRef} from 'react'

export function Good({items, value}) {
  const ref = useRef(null)
  const memo = useMemo(() => value * 2, [value])

  useEffect(() => {
    const onResize = () => {
      ref.current = window.innerWidth
    }
    window.addEventListener('resize', onResize)

    const interval = setInterval(onResize, 1000)
    const timeout = setTimeout(onResize, 1000)

    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)

    const io = new IntersectionObserver(onResize)
    io.observe(document.body)

    return () => {
      window.removeEventListener('resize', onResize)
      clearInterval(interval)
      clearTimeout(timeout)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div ref={ref}>
      <img alt="" src="/x.png" />
      <p>Total: \${value} USD</p>
      <p>one; two; three</p>
      {memo}
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </div>
  )
}
`,
  })

  expect(ruleIds).toEqual([])
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

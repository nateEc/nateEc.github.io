import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { runInNewContext } from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(resolve(root, 'public/theme-init.js'), 'utf8')
let assertions = 0

const check = (condition, message) => {
  assert.ok(condition, message)
  assertions += 1
}

const createHarness = ({ storedTheme = null, systemDark = false } = {}) => {
  const storage = new Map()
  if (storedTheme) storage.set('preferred-theme', storedTheme)

  const mediaListeners = []
  const documentListeners = new Map()
  const windowEvents = []
  const meta = {
    content: '#f7f8fa',
    setAttribute: (name, value) => {
      if (name === 'content') meta.content = value
    },
  }
  const buttonListeners = new Map()
  const button = {
    dataset: {
      labelDark: 'Switch to dark mode',
      labelLight: 'Switch to light mode',
    },
    attributes: new Map(),
    setAttribute: (name, value) => button.attributes.set(name, value),
    addEventListener: (name, listener) => buttonListeners.set(name, listener),
  }
  const media = {
    matches: systemDark,
    addEventListener: (name, listener) => {
      if (name === 'change') mediaListeners.push(listener)
    },
  }
  const documentElement = { dataset: {}, style: {} }
  const context = {
    CustomEvent: class CustomEvent {
      constructor(type, options) {
        this.type = type
        this.detail = options?.detail
      }
    },
    document: {
      documentElement,
      querySelector: (selector) => selector === 'meta[name="theme-color"]' ? meta : null,
      querySelectorAll: (selector) => selector === '[data-theme-toggle]' ? [button] : [],
      addEventListener: (name, listener) => documentListeners.set(name, listener),
    },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  }
  context.window = {
    matchMedia: () => media,
    dispatchEvent: (event) => windowEvents.push(event),
  }

  runInNewContext(source, context)
  documentListeners.get('DOMContentLoaded')?.()

  return {
    button,
    buttonListeners,
    context,
    documentElement,
    meta,
    storage,
    windowEvents,
    setSystemDark: (value) => {
      media.matches = value
      for (const listener of mediaListeners) listener({ matches: value })
    },
  }
}

const systemDark = createHarness({ systemDark: true })
check(systemDark.documentElement.dataset.theme === 'dark', 'first visit follows a dark system preference')
check(systemDark.documentElement.style.colorScheme === 'dark', 'native controls receive the active color scheme')
check(systemDark.meta.content === '#0b1017', 'browser theme color matches dark mode')
check(systemDark.button.attributes.get('aria-pressed') === 'true', 'theme button exposes dark mode state')
check(systemDark.button.attributes.get('aria-label') === 'Switch to light mode', 'theme button describes the next action')

const storedLight = createHarness({ storedTheme: 'light', systemDark: true })
check(storedLight.documentElement.dataset.theme === 'light', 'saved light preference overrides the system')
storedLight.setSystemDark(false)
check(storedLight.documentElement.dataset.theme === 'light', 'system changes do not override a saved preference')

const toggled = createHarness({ storedTheme: 'light' })
toggled.buttonListeners.get('click')?.()
check(toggled.documentElement.dataset.theme === 'dark', 'theme button toggles to dark mode')
check(toggled.storage.get('preferred-theme') === 'dark', 'manual theme selection is persisted')
check(toggled.meta.content === '#0b1017', 'manual toggle updates browser theme color')
check(toggled.windowEvents.at(-1)?.detail?.theme === 'dark', 'manual toggle notifies the Vue application')
check(toggled.button.attributes.get('aria-pressed') === 'true', 'manual toggle updates the button state')
check(toggled.button.attributes.get('aria-label') === 'Switch to light mode', 'manual toggle updates the button action')
toggled.buttonListeners.get('click')?.()
check(toggled.documentElement.dataset.theme === 'light', 'theme button toggles back to light mode')
check(toggled.storage.get('preferred-theme') === 'light', 'light mode selection is persisted')

const followsSystem = createHarness({ systemDark: false })
followsSystem.setSystemDark(true)
check(followsSystem.documentElement.dataset.theme === 'dark', 'unsaved preference continues following system changes')
check(!followsSystem.storage.has('preferred-theme'), 'system-driven changes do not become manual preferences')

console.log(`Theme checks passed (${assertions} assertions).`)

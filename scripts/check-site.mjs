import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const failures = []
const passes = []

const assert = (condition, message) => {
  if (condition) passes.push(message)
  else failures.push(message)
}

const read = (path) => readFileSync(join(root, path), 'utf8')
const walk = (directory, extension) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name)
  if (entry.isDirectory()) return walk(path, extension)
  return !extension || extname(path) === extension ? [path] : []
})

const requiredFiles = [
  'dist/index.html',
  'dist/404.html',
  'dist/robots.txt',
  'dist/sitemap.xml',
  'dist/og-image.png',
  'dist/resume-en.pdf',
  'dist/resume-zh.pdf',
  'dist/images/linkedin-avatar.webp',
  'dist/images/projects/yt-dub-studio-cover.webp',
  'dist/images/projects/shortcutype-cover.webp',
  'dist/blog/blog-shell.css',
  'dist/blog/ai-harness-summary.html',
  'dist/blog/skill-sedimentation-strategy.html',
  'dist/blog/skill-sedimentation-algorithm.html',
]

for (const file of requiredFiles) {
  assert(existsSync(join(root, file)), `required output exists: ${file}`)
}

const sourceIndex = read('index.html')
assert(/<html lang="en">/.test(sourceIndex), 'document language is explicit')
assert(/name="description"/.test(sourceIndex), 'homepage has a meta description')
assert(/rel="canonical"/.test(sourceIndex), 'homepage has a canonical URL')
assert(/property="og:image"/.test(sourceIndex), 'homepage has Open Graph metadata')
assert(/application\/ld\+json/.test(sourceIndex), 'homepage has structured Person data')

const sourceFiles = walk(join(root, 'src')).filter((path) => ['.vue', '.ts', '.css'].includes(extname(path)))
const source = sourceFiles.map((path) => readFileSync(path, 'utf8')).join('\n')
assert(!source.includes('IntroSection'), 'forced intro component is absent')
assert(!source.includes('/assignments.html'), 'removed assignment link cannot route to a 404')
assert(!/alert\s*\(/.test(source), 'contact flow does not fake success with alert()')
assert(source.includes('/resume-en.pdf') && source.includes('/resume-zh.pdf'), 'both résumé paths are wired')
assert(source.includes('/images/linkedin-avatar.webp'), 'LinkedIn portrait is wired')
assert(source.includes('linkedin.com/in/yukun-shan-803a02225'), 'portrait links to the LinkedIn profile')

for (const file of ['public/resume-en.pdf', 'public/resume-zh.pdf']) {
  const path = join(root, file)
  assert(existsSync(path) && statSync(path).size > 20_000, `${file} is a non-empty PDF`)
}

const ogImage = readFileSync(join(root, 'public/og-image.png'))
assert(ogImage.readUInt32BE(16) === 1200 && ogImage.readUInt32BE(20) === 630, 'Open Graph image is 1200×630')

for (const file of walk(dist, '.html')) {
  const html = readFileSync(file, 'utf8')
  const links = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1])
  for (const link of links) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/.test(link)) continue
    const clean = decodeURI(link.split(/[?#]/)[0])
    if (!clean) continue
    const target = clean === '/'
      ? join(dist, 'index.html')
      : clean.startsWith('/')
        ? join(dist, clean.slice(1))
        : resolve(dirname(file), clean)
    assert(existsSync(target), `${relative(dist, file)} resolves ${link}`)
  }
}

for (const file of walk(join(root, 'public', 'blog'), '.html')) {
  const html = readFileSync(file, 'utf8')
  assert(html.includes('portfolio-nav'), `${relative(root, file)} uses the shared portfolio navigation`)
  assert(html.includes('/blog/blog-shell.css'), `${relative(root, file)} uses the shared reading shell`)
}

const sitemap = read('public/sitemap.xml')
for (const slug of ['agent-failure-regression', 'hipilot-desktop', 'yt-dub-studio']) {
  assert(sitemap.includes(`/case-studies/${slug}`), `sitemap includes ${slug}`)
}

const trackedDist = execFileSync('git', ['ls-files', 'dist'], { cwd: root, encoding: 'utf8' }).trim()
assert(trackedDist === '', 'generated dist/ is not tracked as source')

if (failures.length) {
  console.error(`\nSite checks failed (${failures.length}):`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  process.exit(1)
}

console.log(`Site checks passed (${passes.length} assertions).`)

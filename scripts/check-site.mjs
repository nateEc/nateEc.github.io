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
  'dist/theme-init.js',
  'dist/tech-news/latest.json',
  'dist/og-image.png',
  'dist/resume-en.pdf',
  'dist/resume-zh.pdf',
  'dist/images/linkedin-avatar.webp',
  'dist/images/projects/yt-dub-studio-cover.webp',
  'dist/images/projects/shortcutype-cover.webp',
  'dist/images/projects/dsh-git-workbench-cover.jpg',
  'dist/demos/hipilot/workbench.webp',
  'dist/demos/hipilot/terminal.webp',
  'dist/demos/hipilot/preview-panel.webp',
  'dist/demos/hipilot/settings.webp',
  'dist/demos/yt-dub/app-workspace.webp',
  'dist/demos/yt-dub/original.mp4',
  'dist/demos/yt-dub/dubbed.mp4',
  'dist/demos/yt-dub/original-en.vtt',
  'dist/demos/yt-dub/dubbed-zh.vtt',
  'dist/demos/yt-dub/run-report.json',
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
assert(sourceIndex.includes('/theme-init.js'), 'theme initialization runs before the Vue app')
assert(sourceIndex.indexOf('/theme-init.js') < sourceIndex.indexOf('/src/main.ts'), 'theme initialization precedes application rendering')

const themeInit = read('public/theme-init.js')
assert(themeInit.includes('preferred-theme'), 'theme preference uses stable local storage')
assert(themeInit.includes('prefers-color-scheme: dark'), 'theme initialization follows the system preference')
assert(themeInit.includes('theme-color'), 'theme initialization updates browser chrome color')

const sourceFiles = walk(join(root, 'src')).filter((path) => ['.vue', '.ts', '.css'].includes(extname(path)))
const source = sourceFiles.map((path) => readFileSync(path, 'utf8')).join('\n')
assert(!source.includes('IntroSection'), 'forced intro component is absent')
assert(!source.includes('/assignments.html'), 'removed assignment link cannot route to a 404')
assert(!/alert\s*\(/.test(source), 'contact flow does not fake success with alert()')
assert(source.includes('/resume-en.pdf') && source.includes('/resume-zh.pdf'), 'both résumé paths are wired')
assert(source.includes('/images/linkedin-avatar.webp'), 'LinkedIn portrait is wired')
assert(source.includes('linkedin.com/in/yukun-shan-803a02225'), 'portrait links to the LinkedIn profile')
assert(source.includes('juejin.cn/post/7671947410311184403'), 'latest MCP article links to its Juejin publication')
assert(source.includes('noopener noreferrer'), 'external article links isolate the new browsing context')
assert(source.includes('worklogWeeks') && source.includes("path: '/worklog'"), 'weekly worklog data and route are wired')
assert(source.includes("data-theme='dark'") && source.includes('toggleTheme'), 'Vue surfaces expose dark theme tokens and a toggle')
assert(source.includes(':aria-pressed="currentTheme === \'dark\'"'), 'Vue theme toggle exposes its pressed state')
assert(source.includes('themeToDark') && source.includes('themeToLight'), 'Vue theme toggle describes both actions bilingually')
assert(source.includes('@media (prefers-reduced-motion: reduce)'), 'theme motion respects reduced-motion preferences')
assert(source.includes('RegressionReplayDemo') && source.includes('quality.empty_answer'), 'casebook wires the interactive regression replay lab')
assert(source.includes('HiPilotTourDemo') && source.includes('/demos/hipilot/settings.webp'), 'casebook wires the real HiPilot Desktop tour')
assert(source.includes('DubStudioDemo') && source.includes('/demos/yt-dub/dubbed.mp4'), 'casebook wires the playable A/B dubbing demo')
assert(source.includes('KnowledgeDeliveryDemo') && source.includes('Evidence Rail'), 'casebook wires the synthetic enterprise knowledge delivery demo')
assert(source.indexOf('case-demo-section') < source.indexOf('evidence-section'), 'case studies present the demo before supporting evidence')
assert(source.includes('DSH Git Workbench') && source.includes('/images/projects/dsh-git-workbench-cover.jpg'), 'public DSH Git Workbench project uses a real application capture')
assert(source.includes('upstreamContributions') && source.includes('14 patches'), 'accepted upstream contributions are presented as a separate evidence record')
assert(source.includes('2026-w36') && source.includes('31 Aug 2026'), 'worklog reaches the current partial week with an updated snapshot')
assert(source.includes("path: '/tech-news'") && source.includes('TechNewsView'), 'Tech Signal has a dedicated application route')
assert(source.includes("to=\"/tech-news\"") && source.includes("route: '/tech-news'"), 'Tech Signal is linked from the hero and primary navigation')
assert(!source.includes('TechNewsSection'), 'the old homepage Tech News section is removed')

const techNewsPayload = JSON.parse(read('public/tech-news/latest.json'))
assert(techNewsPayload.schemaVersion === 1, 'Tech Signal payload declares its schema version')
assert(Array.isArray(techNewsPayload.sections) && techNewsPayload.sections.length >= 3, 'Tech Signal contains all configured sources')
const techNewsItems = techNewsPayload.sections.flatMap((section) => section.items ?? [])
assert(techNewsItems.length >= 3, 'Tech Signal contains displayable items')
assert(techNewsItems.every((item) => /^https:\/\//.test(item.url)), 'Tech Signal exposes only HTTPS article links')
assert(techNewsItems.every((item) => !/…$/.test(item.published ?? '')), 'Tech Signal preserves complete publication timestamps')

const dubReport = JSON.parse(read('public/demos/yt-dub/run-report.json'))
assert(dubReport.ok === true && dubReport.tts.used_source_voice === true, 'yt-dub report records a successful source-voice run')
assert(dubReport.asr.language_probability === 1 && dubReport.output.audio_video_duration_delta_seconds === 0, 'yt-dub report records ASR confidence and synchronized output')
for (const file of ['public/demos/yt-dub/original.mp4', 'public/demos/yt-dub/dubbed.mp4']) {
  const path = join(root, file)
  assert(existsSync(path) && statSync(path).size > 50_000, `${file} is a non-empty playable demo`)
}

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
  assert(html.includes('/theme-init.js'), `${relative(root, file)} initializes the saved theme before rendering`)
  assert(html.includes('data-theme-toggle'), `${relative(root, file)} exposes the shared theme toggle`)
}

const blogShell = read('public/blog/blog-shell.css')
assert(blogShell.includes('.portfolio-theme-button:focus-visible'), 'blog theme toggle has a visible keyboard focus state')
for (const article of ['harness', 'algorithm', 'strategy']) {
  assert(blogShell.includes(`data-article='${article}'`), `blog shell contains dark overrides for ${article}`)
}

const sitemap = read('public/sitemap.xml')
for (const slug of ['agent-failure-regression', 'hipilot-desktop', 'yt-dub-studio', 'enterprise-knowledge-delivery']) {
  assert(sitemap.includes(`/case-studies/${slug}`), `sitemap includes ${slug}`)
}
assert(sitemap.includes('/worklog'), 'sitemap includes the weekly worklog')
assert(sitemap.includes('/tech-news'), 'sitemap includes the daily Tech Signal page')

const trackedDist = execFileSync('git', ['ls-files', 'dist'], { cwd: root, encoding: 'utf8' }).trim()
assert(trackedDist === '', 'generated dist/ is not tracked as source')

if (failures.length) {
  console.error(`\nSite checks failed (${failures.length}):`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  process.exit(1)
}

console.log(`Site checks passed (${passes.length} assertions).`)

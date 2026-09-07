// Reading affordances shared by the standalone essays. Text is always visible.
const bar = document.createElement('div')
bar.className = 'article-reading-progress'
bar.setAttribute('aria-hidden', 'true')
const fill = document.createElement('span')
bar.append(fill)
document.body.append(bar)
const headings = [...document.querySelectorAll('h2')]
const label = document.createElement('div')
label.className = 'article-current-chapter'
label.setAttribute('aria-hidden', 'true')
document.body.append(label)
let frame = 0
function update() {
  frame = 0
  const max = document.documentElement.scrollHeight - innerHeight
  fill.style.transform = `scaleX(${Math.max(0, Math.min(1, scrollY / Math.max(1, max)))})`
  let active
  for (const heading of headings) if (heading.getBoundingClientRect().top < innerHeight * 0.35) active = heading
  headings.forEach(heading => heading.classList.toggle('reading-current', heading === active))
  label.textContent = active?.textContent || ''
}
function schedule() { if (!frame) frame = requestAnimationFrame(update) }
window.addEventListener('scroll', schedule, { passive: true })
window.addEventListener('resize', schedule)
new ResizeObserver(schedule).observe(document.body)
schedule()

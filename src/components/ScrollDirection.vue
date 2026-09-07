<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'

const route = useRoute()
const { currentLanguage } = useLanguage()
const progress = ref(0)
const active = ref('home')
const reduced = ref(false)
const color = ref('112, 145, 229')
const drift = ref(0)
const home = computed(() => route.path === '/')
const chapters = [
  { id: 'home', en: 'Introduction', zh: '开场', color: '112, 145, 229' },
  { id: 'in-motion', en: 'In motion', zh: '作品放映', color: '146, 143, 216' },
  { id: 'about', en: 'Approach', zh: '关于我', color: '133, 160, 184' },
  { id: 'experience', en: 'Experience', zh: '经历', color: '111, 161, 170' },
  { id: 'skills', en: 'Capabilities', zh: '能力', color: '124, 148, 208' },
  { id: 'work', en: 'Casebook', zh: '案例', color: '146, 143, 216' },
  { id: 'blog', en: 'Writing', zh: '文章', color: '166, 157, 137' },
  { id: 'contact', en: 'Let’s talk', zh: '联系', color: '112, 145, 229' },
]
let frame = 0
let scanFrame = 0
let media: MediaQueryList | undefined
let reveals: IntersectionObserver | undefined
let mutation: MutationObserver | undefined
let resize: ResizeObserver | undefined
let sections: HTMLElement[] = []
let scrollItems: HTMLElement[] = []
let targets = new Set<HTMLElement>()
let disposed = false
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const update = () => {
  frame = 0
  const height = window.innerHeight
  progress.value = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - height))
  const positions = sections.map(el => ({ el, box: el.getBoundingClientRect() }))
  let current = positions[0]?.el.id || 'home'
  for (const { el, box } of positions) {
    if (box.top <= height * 0.48) current = el.id
    if (!reduced.value && box.bottom >= 0 && box.top <= height) {
      const phase = clamp((height - box.top) / (height + box.height))
      el.style.setProperty('--section-progress', phase.toFixed(4))
      if (el.id === 'home') {
        const cinematic = innerWidth > 1100 && innerHeight > 740
        const exit = cinematic ? clamp(-box.top / Math.max(1, box.height - height)) : 0
        el.style.setProperty('--hero-exit', exit.toFixed(4))
        el.querySelectorAll<HTMLElement>('.hero-copy, .trace-window').forEach(node => { node.inert = exit > 0.65 })
        el.querySelectorAll('.trace-steps li').forEach((node, i) => node.classList.toggle('trace-illuminated', i <= Math.floor(exit * 7)))
      }
      if (el.id === 'in-motion') el.style.setProperty('--cinema-entry', clamp(1 - box.top / height).toFixed(4))
      if (el.id === 'about') {
        el.querySelectorAll<HTMLElement>('.principles > li').forEach(node => {
          const item = node.getBoundingClientRect()
          node.classList.toggle('principle-current', item.top < height * .64 && item.bottom > height * .32)
        })
      }
    }
  }
  active.value = current
  color.value = chapters.find(item => item.id === current)?.color || '112, 145, 229'
  drift.value = progress.value
  if (!reduced.value) scrollItems.forEach(el => {
    const box = el.getBoundingClientRect()
    if (box.bottom < 0 || box.top > height) return
    el.style.setProperty('--item-travel', clamp((height - box.top) / (height + box.height)).toFixed(4))
    el.classList.toggle('reading-active', box.top < height * .65 && box.bottom > height * .3)
  })
  const experience = document.querySelector<HTMLElement>('.experience-list')
  if (experience && !reduced.value) {
    const box = experience.getBoundingClientRect()
    experience.style.setProperty('--career-progress', clamp((height * 0.62 - box.top) / box.height).toFixed(4))
    experience.querySelectorAll('details').forEach(el => {
      const row = el.getBoundingClientRect()
      el.classList.toggle('career-current', row.top < height * 0.7 && row.bottom > height * 0.3)
    })
  }
}
const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
const reveal = (el: HTMLElement) => { el.classList.add('has-entered'); reveals?.unobserve(el) }
const focusReveal = (event: FocusEvent) => {
  if (!(event.target instanceof HTMLElement)) return
  const el = event.target.closest<HTMLElement>('[data-scroll-reveal]')
  if (el) reveal(el)
}
const scan = () => {
  scanFrame = 0
  if (disposed) return
  sections = [...document.querySelectorAll<HTMLElement>('#main-content main > section[id]')]
  scrollItems = [...document.querySelectorAll<HTMLElement>('.project-card, .post-list > article')]
  if (reduced.value) { schedule(); return }
  const selector = '.section-heading, .portrait-card, .bio, .principles > li, .toolbox, .project-card, .post-list > article, .upstream-ledger, .contact-copy, .contact-form, .case-hero__grid, .case-section > .shell, .demo-section-label, .signal-hero__grid, .lead-signal, .signal-row, .signal-method__grid, .worklog-hero__grid, .week-entry'
  document.querySelectorAll<HTMLElement>(selector).forEach(el => {
    if (targets.has(el)) return
    targets.add(el)
    el.dataset.scrollReveal = ''
    const siblings = el.parentElement ? [...el.parentElement.children] : []
    el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el) % 3, 2) * 65}ms`)
    // Anchors and back/forward restores show already reached content immediately.
    if (el.getBoundingClientRect().top < innerHeight * 0.92) reveal(el)
    else reveals?.observe(el)
  })
  schedule()
}
const queueScan = () => { if (!scanFrame) scanFrame = requestAnimationFrame(scan) }
const reset = () => {
  reveals?.disconnect()
  targets.forEach(el => { delete el.dataset.scrollReveal; el.classList.remove('has-entered'); el.style.removeProperty('--reveal-delay') })
  targets.clear()
  scrollItems.forEach(el => { el.style.removeProperty('--item-travel'); el.classList.remove('reading-active') })
  scrollItems = []
  sections.forEach(el => { el.style.removeProperty('--section-progress'); el.style.removeProperty('--hero-exit') })
  document.querySelectorAll<HTMLElement>('#home [inert]').forEach(el => { el.inert = false })
  sections = []
}
const changeMotion = () => {
  reduced.value = media?.matches ?? false
  document.documentElement.classList.toggle('motion-on', !reduced.value)
  reset()
  scan()
  schedule()
}
watch(() => route.path, async () => {
  reset()
  active.value = 'home'
  color.value = '112, 145, 229'
  await nextTick()
  if (!disposed) scan()
})
onMounted(() => {
  media = matchMedia('(prefers-reduced-motion: reduce)')
  reveals = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) reveal(entry.target as HTMLElement)
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 })
  changeMotion()
  media.addEventListener('change', changeMotion)
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  document.addEventListener('focusin', focusReveal)
  const content = document.getElementById('main-content')
  if (content) {
    mutation = new MutationObserver(records => { if (records.some(r => r.addedNodes.length)) queueScan() })
    mutation.observe(content, { childList: true, subtree: true })
    resize = new ResizeObserver(schedule)
    resize.observe(content)
  }
})
onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(frame)
  cancelAnimationFrame(scanFrame)
  reset()
  mutation?.disconnect()
  resize?.disconnect()
  media?.removeEventListener('change', changeMotion)
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  document.removeEventListener('focusin', focusReveal)
  document.documentElement.classList.remove('motion-on')
})
</script>

<template>
  <div v-if="!reduced" class="scroll-atmosphere" :style="{ '--journey-color': `rgb(${color})`, '--journey-drift': drift }" aria-hidden="true">
    <div class="atmosphere-light"></div><div class="atmosphere-orbit"></div>
  </div>
  <div class="reading-progress" aria-hidden="true"><span :style="{ transform: `scaleX(${progress})` }"></span></div>
  <nav v-if="home" class="chapter-compass" :aria-label="currentLanguage === 'zh' ? '页面章节' : 'Page chapters'">
    <a v-for="chapter in chapters" :key="chapter.id" :href="`#${chapter.id}`" :aria-current="active === chapter.id ? 'location' : undefined" :aria-label="currentLanguage === 'zh' ? chapter.zh : chapter.en">
      <span class="compass-label">{{ currentLanguage === 'zh' ? chapter.zh : chapter.en }}</span><span class="compass-mark"></span>
    </a>
  </nav>
</template>

<style>
@property --journey-color { syntax: '<color>'; inherits: true; initial-value: #7091e5; }
#main-content { position: relative; z-index: 1; }
.scroll-atmosphere { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; contain: strict; transition: --journey-color 1.2s; }
.atmosphere-light { position: absolute; inset: -25%; background: radial-gradient(ellipse at 75% 25%, color-mix(in srgb, var(--journey-color) 18%, transparent), transparent 48%), radial-gradient(ellipse at 10% 75%, color-mix(in srgb, var(--journey-color) 8%, transparent), transparent 45%); transform: translateY(calc(var(--journey-drift) * -12%)); }
.atmosphere-orbit { position: absolute; left: 46%; top: 12%; width: 66vw; height: 66vw; border: 1px solid color-mix(in srgb, var(--journey-color) 18%, transparent); border-radius: 50%; transform: translateY(calc(var(--journey-drift) * -25vh)) rotate(-24deg) scaleY(0.65); }
.reading-progress { position: fixed; top: 0; left: 0; right: 0; z-index: 150; height: 3px; pointer-events: none; }
.reading-progress span { display: block; height: 100%; background: var(--blue); transform-origin: left; }
.chapter-compass { position: fixed; z-index: 80; right: 17px; top: 50%; transform: translateY(-50%); display: grid; gap: 3px; }
.chapter-compass a { display: flex; justify-content: flex-end; align-items: center; gap: 10px; min-width: 32px; min-height: 29px; text-decoration: none; }
.compass-mark { display: block; width: 5px; height: 5px; border-radius: 50%; background: var(--muted); opacity: 0.45; transition: height 0.4s, opacity 0.4s; }
.chapter-compass [aria-current] .compass-mark { height: 23px; border-radius: 4px; background: var(--blue); opacity: 1; }
.compass-label { font: 10px var(--mono); color: var(--ink); background: var(--surface); padding: 4px 8px; border: 1px solid var(--line); border-radius: 4px; opacity: 0; transform: translateX(5px); transition: opacity 0.2s, transform 0.2s; pointer-events: none; }
.chapter-compass a:hover .compass-label, .chapter-compass a:focus-visible .compass-label { opacity: 1; transform: none; }
.motion-on [data-scroll-reveal] { opacity: 0.12; translate: 0 28px; transition: opacity 750ms ease var(--reveal-delay, 0ms), translate 850ms cubic-bezier(.16,1,.3,1) var(--reveal-delay, 0ms); }
.motion-on [data-scroll-reveal].has-entered, .motion-on [data-scroll-reveal]:focus-within { opacity: 1; translate: 0 0; }
.motion-on #home .hero-copy { translate: 0 calc(var(--hero-exit, 0) * -70px); opacity: calc(1 - var(--hero-exit, 0) * 0.65); }
.motion-on #home .trace-window { translate: none; rotate: none; }
.motion-on #home .trace-node { transition: box-shadow 0.5s, background 0.5s; }
.motion-on #home .trace-illuminated .trace-node { background: var(--blue); box-shadow: 0 0 14px var(--blue); }
.motion-on #home::after { opacity: 0; }
.motion-on #home .hero-copy h1 > span { animation: page-arrive 850ms cubic-bezier(.16,1,.3,1) both; }
.motion-on #home .hero-copy h1 > span:nth-child(2) { animation-delay: 100ms; }
.motion-on #home .hero-copy h1 > span:nth-child(3) { animation-delay: 200ms; }
.motion-on #about .portrait-card.has-entered { translate: 0 calc((0.5 - var(--section-progress, 0.5)) * 42px); }
.motion-on #experience { background: color-mix(in srgb, var(--surface) 65%, transparent); }
.motion-on .experience-list { position: relative; padding-left: 27px; }
.motion-on .experience-list::before, .motion-on .experience-list::after { content: ''; position: absolute; top: 0; left: 0; width: 2px; height: 100%; background: var(--line); }
.motion-on .experience-list::after { background: var(--blue); transform-origin: top; transform: scaleY(var(--career-progress, 0)); }
.motion-on .experience-list details { position: relative; transition: background 0.5s; }
.motion-on .experience-list details::before { content: ''; position: absolute; left: -31px; top: 51px; z-index: 1; width: 10px; height: 10px; border: 2px solid var(--line-strong); border-radius: 50%; background: var(--paper); transition: background 0.4s, box-shadow 0.4s; }
.motion-on .experience-list .career-current::before { background: var(--blue); border-color: var(--blue); box-shadow: 0 0 0 5px var(--blue-soft); }
.motion-on .experience-list .career-current .experience-role h3 { color: var(--blue); }
.motion-on #skills { background: color-mix(in srgb, var(--paper-deep) 75%, transparent); }
.motion-on .project-card .project-image img { transform: scale(calc(1.12 - var(--item-travel, 0) * .08)) translateY(calc((.5 - var(--item-travel, .5)) * 12px)); transition: filter .5s; }
.motion-on .project-card { transition: border-color .6s, box-shadow .6s, opacity 750ms ease var(--reveal-delay, 0ms), translate 850ms cubic-bezier(.16,1,.3,1) var(--reveal-delay, 0ms); }
.motion-on .project-card.reading-active { border-color: #526788; box-shadow: 0 20px 65px #0002; }
.motion-on .post-list > article { position: relative; }
.motion-on .post-list > article::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--blue); transform: scaleX(var(--item-travel, 0)); transform-origin: left; }
.motion-on .post-list h3 { transition: color .4s, translate .5s; }
.motion-on .post-list .reading-active h3 { color: var(--blue); translate: 5px 0; }
.motion-on .experience-list details { background: linear-gradient(90deg, var(--blue-soft), transparent 85%); background-size: 0% 100%; background-repeat: no-repeat; transition: background-size .7s; }
.motion-on .experience-list .career-current { background-size: 100% 100%; }
.motion-on .experience-index { transition: transform .5s, color .5s; transform-origin: left; }
.motion-on .career-current .experience-index { transform: scale(1.5); color: var(--blue); }
.motion-on #contact { position: relative; isolation: isolate; overflow: hidden; }
.motion-on #contact::before { content: ''; position: absolute; z-index: -1; pointer-events: none; inset: 0; background: radial-gradient(ellipse at 10% 30%, #678bdb30, transparent 62%); }
.motion-on #contact::after { content: 'LET’S TALK'; font: 600 clamp(90px, 19vw, 300px)/1 var(--display); letter-spacing: -0.07em; color: #ffffff05; position: absolute; bottom: -0.15em; left: 3%; z-index: -1; white-space: nowrap; translate: calc((0.5 - var(--section-progress, 0.5)) * 70px) 0; pointer-events: none; }
.motion-on #contact .contact-copy h2 { font-size: clamp(2.6rem, 4.8vw, 5rem); line-height: 1.05; }
.motion-on .case-hero__grid, .motion-on .signal-hero__grid { animation: page-arrive 750ms cubic-bezier(.16,1,.3,1) both; }
@keyframes page-arrive { from { opacity: 0.35; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@media(min-width:1101px) and (min-height:741px) {
  .motion-on #home.hero { display: block; height: 165svh; padding: 0; overflow: clip; }
  .motion-on #home .hero-stage { position: sticky; top: 0; height: 100svh; display: grid; grid-template-rows: 1fr auto; align-items: center; padding: 130px 0 38px; }
  .motion-on #home .hero-copy { translate: calc(var(--hero-exit, 0) * -80px) calc(var(--hero-exit, 0) * -15px); opacity: clamp(0, calc(1 - var(--hero-exit, 0) * 2.2), 1); }
  .motion-on #home .hero-window-bridge { z-index: 2; transform: translateX(calc(var(--hero-exit, 0) * -22vw)) scale(calc(1 + var(--hero-exit, 0) * .3)); }
  .motion-on #home .hero-window-bridge .trace-window { opacity: clamp(0, calc(1 - var(--hero-exit, 0) * 1.7), 1); }
  .motion-on #home .hero-product-bridge { display: block; opacity: clamp(0, calc((var(--hero-exit, 0) - .22) * 1.8), 1); box-shadow: 0 30px 90px #15254940; }
  .motion-on #home .hero-handoff-title { display: block; position: absolute; top: 92px; left: 0; width: 100%; margin: 0; text-align: center; font: 500 clamp(25px, 3.5vw, 48px) var(--display); letter-spacing: -.055em; opacity: clamp(0, calc((var(--hero-exit, 0) - .4) * 2), 1); translate: 0 calc((1 - var(--hero-exit, 0)) * 20px); }
  .motion-on #about .about-grid { align-items: stretch; }
  .motion-on #about .portrait-card { position: sticky; top: 145px; align-self: start; }
  .motion-on #about .portrait-card.has-entered { translate: none; }
  .motion-on #about .principles > li { min-height: 250px; display: flex; align-items: center; opacity: .35; transition: opacity .5s, border-color .5s; }
  .motion-on #about .principles > li.principle-current { opacity: 1; border-color: var(--blue); }
  .motion-on #about .principles > li h3 { font-size: 27px; letter-spacing: -.045em; }
}
@media (max-width: 1350px) { .chapter-compass { display: none; } }
@media (max-width: 760px) {
  .atmosphere-orbit { width: 130vw; height: 130vw; left: 18%; top: 20%; }
  .motion-on [data-scroll-reveal] { translate: 0 14px; transition-duration: 550ms; }
  .motion-on #home .hero-copy, .motion-on #home .trace-window { translate: none; rotate: none; opacity: 1; }
  .motion-on #about .portrait-card.has-entered { translate: none; }
  .motion-on .experience-list { padding-left: 19px; }
  .motion-on .experience-list details::before { left: -23px; }
}
@media (prefers-reduced-motion: reduce) {
  .scroll-atmosphere { display: none; }
  [data-scroll-reveal] { opacity: 1 !important; translate: none !important; transition: none !important; }
  .reading-progress span, .compass-mark { transition: none; }
}
</style>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()
const zh = computed(() => currentLanguage.value === 'zh')
const root = ref<HTMLElement>()
const film = ref<HTMLVideoElement>()
const progress = ref(0)
const reduced = ref(false)
const ready = ref(false)
const manual = ref(0)
const paused = ref(false)
const playing = ref(false)
const loaded = ref(false)
const failed = ref(false)
const inView = ref(false)
const scenes = [
  { name: 'HiPilot Desktop', short: 'HiPilot', image: '/demos/hipilot/preview-panel.webp', color: '#98adff', en: 'Keep execution in view.', zh: '执行与检查，同时可见。', detailEn: 'A desktop agent with the terminal, files, and preview beside it.', detailZh: '对话旁边，就是终端、文件和预览。', href: '/case-studies/hipilot-desktop', kind: 'DESKTOP / AGENT SYSTEMS' },
  { name: 'YT Dub Studio', short: 'Dub Studio', image: '/demos/yt-dub/app-workspace.webp', color: '#6dd8c6', en: 'A new voice. Same story.', zh: '换一种语言，保留原来的声音。', detailEn: 'From source video to Chinese dubbing, with every stage inspectable.', detailZh: '从源视频到中文配音，每一步都能检查。', href: '/case-studies/yt-dub-studio', kind: 'VOICE / LOCAL AI' },
  { name: 'DSH Git Workbench', short: 'Git Workbench', image: '/images/projects/dsh-git-workbench-cover.jpg', color: '#cf9561', en: 'See the whole change.', zh: '让每一次变更，都有全貌。', detailEn: 'Branches, diffs, and agent sessions. One working surface.', detailZh: '分支、差异与 Agent 会话，在同一个工作界面。', href: 'https://github.com/nateEc/dsh-gitKraken', kind: 'GIT / DEVELOPER TOOLS' },
]
const index = computed(() => reduced.value ? manual.value : Math.min(2, Math.floor(progress.value * 3)))
const scene = computed(() => scenes[index.value]!)
const videoSrc = computed(() => ['/demos/cinema/hipilot.mp4', '/demos/cinema/dub-studio.mp4', '/demos/cinema/git-workbench.mp4'][index.value])
const phase = computed(() => reduced.value ? 0.5 : Math.min(1, progress.value * 3 - index.value))
const stageStyle = computed(() => ({
  '--scene-color': scene.value.color,
  '--shot-scale': String(0.9 + phase.value * 0.14),
  '--shot-rise': `${(0.5 - phase.value) * 20}px`,
  '--shot-rotate': `${(0.5 - phase.value) * 2}deg`,
}))
let frame = 0
let observer: IntersectionObserver | undefined
let media: MediaQueryList | undefined
let resizeObserver: ResizeObserver | undefined
let visible = false
const syncPlayback = () => {
  const video = film.value
  if (!video) return
  if (inView.value && !reduced.value && !paused.value && !document.hidden) {
    void video.play().catch(() => { playing.value = false })
  } else video.pause()
}
watch([index, ready], async () => { loaded.value = false; failed.value = false; await nextTick(); syncPlayback() })
watch([inView, paused, reduced], syncPlayback)
const update = () => {
  frame = 0
  if (!root.value) return
  const box = root.value.getBoundingClientRect()
  inView.value = box.top < window.innerHeight * 0.8 && box.bottom > window.innerHeight * 0.3
  if (reduced.value) return
  const distance = root.value.offsetHeight - window.innerHeight
  progress.value = Math.max(0, Math.min(1, -box.top / Math.max(1, distance)))
}
const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(update) }
const motionChanged = () => {
  const previous = index.value
  reduced.value = media?.matches ?? false
  if (reduced.value) manual.value = previous
  update()
}
const choose = (next: number) => {
  if (reduced.value) { manual.value = next; return }
  if (!root.value) return
  const top = root.value.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: top + (root.value.offsetHeight - window.innerHeight) * ((next + 0.35) / 3), behavior: 'instant' })
}
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionChanged()
  media.addEventListener('change', motionChanged)
  observer = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting)
    if (!visible) inView.value = false
    if (visible) { ready.value = true; schedule() }
  }, { rootMargin: '500px' })
  if (root.value) observer.observe(root.value)
  resizeObserver = new ResizeObserver(schedule)
  if (root.value) resizeObserver.observe(root.value)
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  document.addEventListener('visibilitychange', syncPlayback)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  resizeObserver?.disconnect()
  media?.removeEventListener('change', motionChanged)
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  document.removeEventListener('visibilitychange', syncPlayback)
  film.value?.pause()
})
</script>

<template>
  <section id="in-motion" ref="root" class="work-cinema" :class="{ 'is-reduced': reduced }" aria-labelledby="cinema-title">
    <div class="cinema-sticky" :style="stageStyle">
      <div class="cinema-atmosphere" aria-hidden="true">
        <img v-for="(shot, i) in scenes" :key="shot.name" :src="ready ? shot.image : undefined" alt="" :class="{ visible: i === index }">
      </div>
      <div class="cinema-top">
        <div>
          <p class="cinema-eyebrow">{{ zh ? '从构想到运行' : 'FROM CONCEPT TO RUNNING CODE' }}</p>
          <h2 id="cinema-title">{{ zh ? '让作品，动起来。' : 'Built to run.' }} <span>{{ zh ? '亲眼看看。' : 'Made to be seen.' }}</span></h2>
        </div>
        <a class="cinema-skip" href="#work">{{ zh ? '全部案例' : 'All case studies' }} <span>↗</span></a>
      </div>

      <div class="cinema-stage">
        <div class="cinema-backtype" aria-hidden="true">{{ scene.short }}</div>
        <div class="cinema-shot">
          <div class="shot-bar" aria-hidden="true"><span class="shot-dots">● ● ●</span><span>{{ scene.name }}</span><span>↗</span></div>
          <div class="shot-images">
            <img v-for="(shot, i) in scenes" :key="shot.name" :src="ready ? shot.image : undefined" :alt="`${shot.name} — ${zh ? '真实应用界面' : 'actual application interface'}`" :class="{ visible: i === index }" :aria-hidden="i !== index" width="1440" height="857">
            <video v-if="ready && !reduced" :key="videoSrc" ref="film" class="shot-film" :class="{ 'is-loaded': loaded && !failed }" :src="videoSrc" :poster="scene.image" muted loop playsinline preload="metadata" :aria-label="`${scene.name} — ${zh ? '真实界面制作的动态短片' : 'motion study from real application captures'}`" @loadeddata="loaded = true; syncPlayback()" @playing="playing = true" @pause="playing = false" @error="failed = true; playing = false"></video>
          </div>
          <div class="film-footer">
            <span>{{ failed ? (zh ? '视频不可用 · 显示界面' : 'VIDEO UNAVAILABLE · STILL PREVIEW') : (zh ? '界面演绎' : 'INTERFACE MOTION STUDY') }} <span v-if="index === 1">{{ zh ? ' + 真实配音产物' : ' + ACTUAL DUBBED OUTPUT' }}</span></span>
            <button v-if="!reduced && !failed" type="button" @click="paused = !paused" :aria-label="paused ? (zh ? '播放项目短片' : 'Play project film') : (zh ? '暂停项目短片' : 'Pause project film')">{{ paused ? '▶' : 'Ⅱ' }} {{ playing ? 'PLAYING' : paused ? 'PAUSED' : 'READY' }}</button>
          </div>
        </div>
        <div class="shot-note"><span></span>{{ zh ? '真实界面 · 动态演绎' : 'REAL INTERFACES / IN MOTION' }}</div>
      </div>

      <div class="cinema-bottom">
        <div class="cinema-caption" :key="scene.name">
          <p class="cinema-eyebrow">{{ scene.kind }}</p>
          <h3>{{ zh ? scene.zh : scene.en }}</h3>
          <p class="cinema-description">{{ zh ? scene.detailZh : scene.detailEn }}</p>
          <a v-if="scene.href.startsWith('https:')" :href="scene.href" target="_blank" rel="noopener" class="cinema-link">{{ zh ? '探索源码' : 'Explore the source' }} ↗</a>
          <RouterLink v-else :to="scene.href" class="cinema-link">{{ zh ? '进入交互案例' : 'Explore the interactive case' }} ↗</RouterLink>
        </div>
        <div class="cinema-controls">
          <p>{{ reduced ? (zh ? '选择一个项目' : 'SELECT A PROJECT') : (zh ? '向下滚动，继续探索' : 'SCROLL TO EXPLORE') }} <span aria-hidden="true">↓</span></p>
          <div class="cinema-chapters" :aria-label="zh ? '选择展示项目' : 'Choose a featured project'">
            <button v-for="(shot, i) in scenes" :key="shot.name" type="button" :aria-pressed="index === i" @click="choose(i)">
              <span class="chapter-track"><span :style="{ transform: `scaleX(${reduced ? (i === index ? 1 : 0) : Math.max(0, Math.min(1, progress * 3 - i))})` }"></span></span>
              {{ shot.short }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work-cinema { position: relative; height: 360svh; background: #101725; color: #f4f6fa; }
.cinema-sticky { position: sticky; top: 0; height: 100svh; min-height: 680px; padding: 106px max(32px, calc((100vw - 1320px) / 2)) 30px; overflow: hidden; isolation: isolate; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; }
.cinema-sticky::before { content: ''; position: absolute; inset: 0; z-index: -1; background: radial-gradient(ellipse at 65% 45%, color-mix(in srgb, var(--scene-color) 22%, transparent), transparent 66%); transition: background 0.7s; }
.cinema-atmosphere { position: absolute; inset: 0; z-index: -2; opacity: 0.14; filter: blur(40px); transform: scale(1.15); pointer-events: none; }
.cinema-atmosphere img { position: absolute; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.8s; }
.cinema-atmosphere img.visible { opacity: 1; }
.cinema-top, .cinema-bottom { display: flex; align-items: flex-start; justify-content: space-between; gap: 28px; z-index: 2; }
.cinema-eyebrow { font: 10px var(--mono); letter-spacing: 0.16em; color: var(--scene-color); margin: 0 0 12px; }
.cinema-top h2 { margin: 0; font: 500 clamp(24px, 2.7vw, 42px)/1.15 var(--display); letter-spacing: -0.05em; }
.cinema-top h2 span { color: #a4aebf; }
.cinema-skip { color: #ccd3df; font-size: 12px; white-space: nowrap; padding: 8px 0; border-bottom: 1px solid #687184; }
.cinema-skip span { margin-left: 12px; }
.cinema-stage { position: relative; min-height: 0; display: flex; align-items: center; justify-content: center; perspective: 1400px; padding: 24px 0 28px; }
.cinema-backtype { position: absolute; top: 42%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; font: 600 clamp(100px, 15vw, 250px)/1 var(--display); letter-spacing: -0.075em; color: #fff; opacity: 0.045; pointer-events: none; }
.cinema-shot { width: min(900px, 76vw); aspect-ratio: 1450 / 742; max-height: 100%; border: 1px solid #647084; border-radius: 9px; overflow: hidden; background: #13161c; box-shadow: 0 35px 70px #0008, 0 0 90px color-mix(in srgb, var(--scene-color) 9%, transparent); transform: translateY(var(--shot-rise)) rotateX(var(--shot-rotate)) scale(var(--shot-scale)); transition: width 0.65s, box-shadow 0.7s; display: flex; flex-direction: column; }
.cinema-shot.is-desktop { width: min(620px, 68vw); aspect-ratio: 956 / 810; }
.cinema-shot.is-dub { aspect-ratio: 1440 / 903; }
.shot-bar { display: flex; justify-content: space-between; padding: 9px 14px; color: #bec5d1; background: #202631; font: 10px var(--mono); flex-shrink: 0; }
.shot-dots { color: #8490a3; font-size: 8px; letter-spacing: 3px; }
.shot-images { position: relative; flex: 1; min-height: 0; }
.shot-images img { position: absolute; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 0.55s; }
.shot-images img.visible { opacity: 1; }
.cinema-shot { aspect-ratio: 1280 / 870; transform: translateY(var(--shot-rise)) rotateX(var(--shot-rotate)) scale(calc(var(--shot-scale) * (.72 + var(--cinema-entry, 1) * .28))); }
.shot-film { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 0.4s; }
.shot-film.is-loaded { opacity: 1; }
.film-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 12px; color: #aebed0; font: 8px var(--mono); background: #17202d; min-height: 32px; }
.film-footer button { background: transparent; color: #e9f1ff; border: 0; font: 9px var(--mono); cursor: pointer; padding: 4px 6px; white-space: nowrap; }
.shot-note { position: absolute; left: 0; bottom: 28px; writing-mode: vertical-rl; transform: rotate(180deg); color: #a4aebf; font: 9px var(--mono); letter-spacing: 0.13em; display: flex; align-items: center; gap: 10px; }
.shot-note span { width: 5px; height: 5px; background: var(--scene-color); border-radius: 50%; }
.cinema-output { position: absolute; right: 0; bottom: 40px; width: 27%; max-width: 330px; border: 1px solid #48675f; background: #0c161d; padding: 6px; box-shadow: 0 18px 40px #0008; transform: rotate(2deg); }
.cinema-output video { width: 100%; aspect-ratio: 16/9; display: block; object-fit: cover; }
.cinema-output p { font: 8px var(--mono); color: #b9d5ce; padding: 8px 3px 3px; margin: 0; }
.cinema-output p span { display: inline-block; width: 4px; height: 4px; background: #6dd8c6; border-radius: 50%; margin-right: 6px; }
.cinema-bottom { align-items: flex-end; }
.cinema-caption { animation: caption-in 0.55s ease both; }
.cinema-caption h3 { font: 500 clamp(25px, 3vw, 44px)/1.1 var(--display); letter-spacing: -0.045em; margin: 0; }
.cinema-description { font-size: 13px; color: #bac3d2; margin: 10px 0; }
.cinema-link { display: inline-block; font-size: 12px; color: #f4f6fa; border-bottom: 1px solid #728096; padding: 2px 0; }
.cinema-controls { width: 330px; flex-shrink: 0; }
.cinema-controls > p { font: 9px var(--mono); letter-spacing: 0.1em; color: #a4aebf; display: flex; justify-content: space-between; margin: 0 0 20px; }
.cinema-chapters { display: flex; gap: 14px; }
.cinema-chapters button { border: 0; border-radius: 0; padding: 10px 0; flex: 1; background: none; text-align: left; color: #9ba7b9; font: 10px var(--mono); cursor: pointer; white-space: nowrap; }
.cinema-chapters button[aria-pressed='true'] { color: #fff; }
.chapter-track { display: block; height: 2px; background: #485164; margin-bottom: 12px; overflow: hidden; }
.chapter-track > span { display: block; width: 100%; height: 100%; background: var(--scene-color); transform-origin: left; }
.cinema-sticky a:focus-visible, .cinema-sticky button:focus-visible { outline: 2px solid #b6c9ff; outline-offset: 6px; }
@keyframes caption-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
:global(:root:not([data-theme='dark']) .work-cinema) { background: #e9edf4; color: #172235; }
:global(:root:not([data-theme='dark']) .work-cinema .cinema-top h2 span) { color: #5c6b80; }
:global(:root:not([data-theme='dark']) .work-cinema .cinema-eyebrow) { color: #435570; }
:global(:root:not([data-theme='dark']) .work-cinema .cinema-skip),
:global(:root:not([data-theme='dark']) .work-cinema .cinema-link) { color: #253550; }
:global(:root:not([data-theme='dark']) .work-cinema .cinema-description),
:global(:root:not([data-theme='dark']) .work-cinema .cinema-controls > p),
:global(:root:not([data-theme='dark']) .work-cinema .cinema-chapters button),
:global(:root:not([data-theme='dark']) .work-cinema .shot-note) { color: #4c5d75; }
:global(:root:not([data-theme='dark']) .work-cinema .cinema-chapters button[aria-pressed='true']) { color: #142139; }
:global(:root:not([data-theme='dark']) .work-cinema .cinema-backtype) { color: #253550; }
:global(:root:not([data-theme='dark']) .work-cinema .chapter-track) { background: #a0acbc; }
@media (min-width: 1700px) { .cinema-shot { width: min(1100px, 76vw); max-height: 640px; } }
@media (max-width: 760px) {
  .work-cinema { height: 300svh; }
  .cinema-sticky { padding: 92px 22px 22px; min-height: 0; }
  .cinema-top { gap: 12px; }
  .cinema-top h2 { font-size: 28px; max-width: 290px; }
  .cinema-top h2 span { display: block; }
  .cinema-eyebrow { font-size: 8px; letter-spacing: 0.08em; }
  .cinema-skip { font-size: 10px; }
  .cinema-stage { padding: 24px 0; }
  .cinema-shot, .cinema-shot.is-desktop { width: 100%; max-height: 310px; }
  .shot-bar { font-size: 8px; padding: 8px 10px; }
  .shot-note { display: none; }
  .cinema-output { width: 42%; bottom: 14px; right: -6px; }
  .cinema-output p { font-size: 6px; line-height: 1.4; }
  .cinema-bottom { display: block; }
  .cinema-caption h3 { font-size: 27px; }
  .cinema-description { font-size: 12px; max-width: 340px; min-height: 40px; }
  .cinema-controls { width: 100%; margin-top: 22px; }
  .cinema-controls > p { margin-bottom: 4px; font-size: 8px; }
  .cinema-chapters { gap: 18px; }
  .cinema-chapters button { font-size: 9px; }
  .chapter-track { margin-bottom: 8px; }
}
@media (max-height: 680px) and (min-width: 761px) {
  .cinema-sticky { padding-top: 84px; padding-bottom: 16px; min-height: 500px; }
  .cinema-top h2 { font-size: 25px; }
  .cinema-caption h3 { font-size: 28px; }
  .cinema-description { margin: 6px 0; }
}
.work-cinema.is-reduced { height: auto; }
.is-reduced .cinema-sticky { position: relative; height: max(760px, 100svh); }
.is-reduced .cinema-shot { transform: none; }
@media (prefers-reduced-motion: reduce) {
  .work-cinema { height: auto; }
  .cinema-sticky { position: relative; height: max(760px, 100svh); }
  .cinema-caption { animation: none; }
  .cinema-shot { transform: none; }
  .cinema-sticky *, .cinema-sticky::before { transition: none !important; }
}
</style>

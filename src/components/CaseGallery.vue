<script setup lang="ts">
import { computed, nextTick, ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { caseStudies, localize } from '../data/portfolio'
import { useLanguage } from '../composables/useLanguage'
import { useScrollChapters } from '../composables/useScrollChapters'

const { currentLanguage } = useLanguage()
const zh = computed(() => currentLanguage.value === 'zh')
const root = ref<HTMLElement>()
const { active, phase, visible, reduced, select } = useScrollChapters(root, '.case-chapter')
const study = computed(() => caseStudies[active.value]!)
const step = computed(() => Math.min(study.value.architecture.length - 1, Math.floor(phase.value * study.value.architecture.length)))
const t = (text: { en: string; zh: string }) => localize(text, currentLanguage.value)
const accent = computed(() => ({blue:'#7d9fff',teal:'#6dd8c6',amber:'#efb45c',violet:'#b397ff'}[study.value.accent]))
const clip = computed(() => ({ 'hipilot-desktop': '/demos/cinema/hipilot.mp4', 'yt-dub-studio': '/demos/cinema/dub-studio.mp4' }[study.value.slug]))
const poster = computed(() => study.value.slug === 'hipilot-desktop' ? '/demos/hipilot/preview-panel.webp' : '/demos/yt-dub/app-workspace.webp')
const video = ref<HTMLVideoElement>()
const paused = ref(false)
const failed = ref(false)
function syncPlayback() {
  if (!video.value) return
  if (visible.value && !paused.value && !reduced.value && !document.hidden) void video.value.play().catch(() => { paused.value = true })
  else video.value.pause()
}
watch([active, visible, reduced, paused], async () => { await nextTick(); syncPlayback() })
watch(active, () => { failed.value = false })
onMounted(() => document.addEventListener('visibilitychange', syncPlayback))
onBeforeUnmount(() => { video.value?.pause(); document.removeEventListener('visibilitychange', syncPlayback) })
</script>

<template>
  <div ref="root" class="case-gallery" :style="{ '--gallery-accent': accent, '--gallery-phase': phase }" :class="{ 'is-running': visible && !reduced }">
    <div class="case-narrative">
      <article v-for="(item, i) in caseStudies" :key="item.slug" class="case-chapter" :class="{ 'is-current': active === i }">
        <p class="case-chapter-meta"><span>0{{ i + 1 }}</span>{{ t(item.kind) }} / {{ item.period }}</p>
        <h3>{{ t(item.title) }}</h3>
        <p class="case-chapter-thesis">{{ t(item.thesis) }}</p>
        <p class="case-chapter-summary">{{ t(item.summary) }}</p>
        <dl class="case-chapter-evidence"><div v-for="evidence in item.evidence" :key="evidence.value"><dt>{{ evidence.value }}</dt><dd>{{ t(evidence.label) }}</dd></div></dl>
        <RouterLink :to="`/case-studies/${item.slug}`" class="case-chapter-link" :aria-label="`${zh ? '打开完整案例' : 'Open full case'}: ${t(item.title)}`">{{ zh ? '打开完整案例' : 'Open full case' }} <span>↗</span></RouterLink>
      </article>
    </div>
    <div class="case-visual-column" data-chapter-stage>
      <div class="case-visual-sticky">
        <nav class="case-switcher" :aria-label="zh ? '选择案例' : 'Choose a case study'">
          <button v-for="(item, i) in caseStudies" :key="item.slug" type="button" :aria-label="t(item.title)" :aria-pressed="active === i" @click="select(i)">0{{ i + 1 }}<span></span></button>
        </nav>
        <div class="case-monitor">
          <div class="monitor-chrome"><span><i></i>{{ zh ? '系统内部' : 'INSIDE THE SYSTEM' }}</span><span>CASE / 0{{ active + 1 }}</span></div>
          <div class="case-monitor-screen">
            <Transition name="monitor-scene" mode="out-in">
              <div :key="study.slug" class="monitor-scene">
                <template v-if="clip">
                  <img class="monitor-poster" :src="poster" :alt="`${t(study.title)} — ${zh ? '真实应用界面' : 'real application interface'}`">
                  <video v-if="visible && !reduced && !failed" ref="video" :src="clip" :poster="poster" muted loop playsinline preload="metadata" :aria-label="`${t(study.title)} ${zh ? '界面演绎短片' : 'interface motion study'}`" @loadeddata="syncPlayback" @error="failed = true"></video>
                  <button v-if="!reduced && !failed" class="monitor-play" type="button" @click="paused = !paused">{{ paused ? '▶' : 'Ⅱ' }} {{ zh ? (paused ? '播放' : '暂停') : (paused ? 'Play' : 'Pause') }}</button>
                </template>
                <div v-else-if="study.slug === 'agent-failure-regression'" class="replay-visual" role="img" :aria-label="zh ? '回归工作流示意：捕获、标准化、注册、回放、审核' : 'Illustrated regression workflow: capture, normalize, register, replay, review'">
                  <div class="replay-heading"><span>{{ zh ? '失败成为下一次的测试。' : 'Failure becomes the next test.' }}</span><small>{{ zh ? '工作流示意' : 'ILLUSTRATIVE WORKFLOW' }}</small></div>
                  <div class="replay-orbit">
                    <svg viewBox="0 0 400 230" aria-hidden="true"><ellipse cx="200" cy="115" rx="164" ry="75"/><ellipse cx="200" cy="115" rx="118" ry="96" transform="rotate(-35 200 115)"/><path class="replay-route" d="M36 115C36 15 364 15 364 115S36 215 36 115"/><circle cx="200" cy="115" r="46"/><path d="m183 105 17-10 17 10v20l-17 10-17-10z M183 105l17 10 17-10 M200 115v20" /></svg>
                    <span class="orbit-label orbit-label-a">{{ zh ? '失败信号' : 'FAILURE SIGNAL' }}</span><span class="orbit-label orbit-label-b">{{ zh ? '回放证据' : 'REPLAY EVIDENCE' }}</span>
                  </div>
                  <div class="replay-fields"><div><span>INPUT</span><strong>quality.empty_answer</strong></div><div><span>OUTPUT</span><strong>{{ zh ? '可审核的回归案例' : 'A reviewable regression case' }}</strong></div></div>
                </div>
                <div v-else class="knowledge-visual" role="img" :aria-label="zh ? '知识交付示意：来源资料、版本化对象、证据绑定和人工审核' : 'Illustrated knowledge delivery: source material, versioned objects, evidence binding and human review'">
                  <div class="replay-heading"><span>{{ zh ? '每个结论，都有来处。' : 'Every assertion has a source.' }}</span><small>{{ zh ? '工作流示意' : 'ILLUSTRATIVE WORKFLOW' }}</small></div>
                  <div class="knowledge-stack">
                    <div class="knowledge-sheet sheet-source"><span>{{ zh ? '来源资料' : 'SOURCE MATERIAL' }}</span><i></i><i></i><i></i><i></i><b>↗</b></div>
                    <div class="knowledge-sheet sheet-object"><span>{{ zh ? '版本化知识' : 'VERSIONED KNOWLEDGE' }}</span><i></i><i></i><i></i><b>↗</b></div>
                    <div class="knowledge-sheet sheet-evidence"><span>{{ zh ? '证据绑定' : 'EVIDENCE BOUND' }}</span><strong>{{ zh ? '可追溯。\n可审核。' : 'Traceable.\nReviewable.' }}</strong><em>{{ zh ? '人工验收' : 'HUMAN ACCEPTANCE' }}</em></div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
          <div class="monitor-caption"><span>{{ clip ? (zh ? '真实界面制作的动态演绎' : 'MOTION STUDY / REAL APP CAPTURES') : (zh ? '脱敏系统路径示意' : 'SANITIZED SYSTEM ILLUSTRATION') }}</span><span>↘</span></div>
        </div>
        <div class="case-system-path">
          <div v-for="(node, i) in study.architecture" :key="node.key" :class="{ reached: i <= step }"><span class="path-dot"></span><span>{{ t(node.label) }}</span></div>
        </div>
        <p class="case-path-detail"><span>↳</span>{{ t(study.architecture[step]!.detail) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.case-gallery { display: grid; grid-template-columns: .9fr 1.1fr; gap: 65px; color: #e5ebf4; }
.case-chapter { min-height: 76svh; display: flex; flex-direction: column; justify-content: center; padding: 50px 0; opacity: .38; transition: opacity .6s; }
.case-chapter.is-current, .case-chapter:focus-within { opacity: 1; }
.case-chapter-meta { color: #a7b2c4; font: 9px var(--mono); letter-spacing: .05em; display: flex; gap: 16px; }
.case-chapter-meta > span { color: var(--gallery-accent); }
.case-chapter h3 { font-size: clamp(30px, 3.4vw, 50px); letter-spacing: -.055em; line-height: 1.08; margin: 17px 0 22px; }
.case-chapter-thesis { font-size: 18px; line-height: 1.5; color: #dce4f1; margin-bottom: 16px; }
.case-chapter-summary { color: #94a2b7; font-size: 14px; line-height: 1.8; }
.case-chapter-evidence { display: flex; gap: 25px; padding: 22px 0; border-top: 1px solid #2c3545; border-bottom: 1px solid #2c3545; margin: 15px 0 22px; }
.case-chapter-evidence > div { flex: 1; }
.case-chapter-evidence dt { font: 500 clamp(17px, 2vw, 26px) var(--display); color: var(--gallery-accent); }
.case-chapter-evidence dd { font: 9px/1.5 var(--mono); margin: 8px 0 0; color: #93a1b6; }
.case-chapter-link { display: flex; justify-content: space-between; align-items: center; font: 11px var(--mono); color: #ecf1fb; text-decoration: none; padding: 10px 0; }
.case-chapter-link span { font-size: 24px; transition: translate .25s; }
.case-chapter-link:hover span { translate: 4px -4px; }
.case-visual-column { min-width: 0; }
.case-visual-sticky { position: sticky; top: max(105px, calc((100vh - 620px) / 2)); padding: 20px 0; }
.case-switcher { display: flex; gap: 12px; margin-bottom: 25px; }
.case-switcher button { display: flex; align-items: center; gap: 14px; flex: 1; padding: 9px 0; border: 0; color: #7c8ba2; background: none; font: 10px var(--mono); cursor: pointer; }
.case-switcher button > span { height: 1px; flex: 1; background: #303d50; transition: background .5s; }
.case-switcher button[aria-pressed='true'] { color: var(--gallery-accent); }
.case-switcher button[aria-pressed='true'] > span { background: var(--gallery-accent); }
.case-monitor { position: relative; border: 1px solid #3b485e; border-radius: 10px; background: #0e1625; box-shadow: 0 40px 80px #0005, 0 0 100px color-mix(in srgb, var(--gallery-accent) 8%, transparent); overflow: hidden; transform: perspective(1400px) rotateY(calc((var(--gallery-phase) - .5) * -3deg)); transition: box-shadow .8s; }
.monitor-chrome, .monitor-caption { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 15px 18px; font: 8px var(--mono); letter-spacing: .05em; color: #a8b6cb; }
.monitor-chrome { border-bottom: 1px solid #253247; }
.monitor-chrome i { display: inline-block; width: 5px; height: 5px; background: var(--gallery-accent); box-shadow: 0 0 12px var(--gallery-accent); border-radius: 50%; margin-right: 8px; }
.monitor-caption { border-top: 1px solid #253247; }
.case-monitor-screen { position: relative; aspect-ratio: 1.3; overflow: hidden; }
.monitor-scene { width: 100%; height: 100%; position: absolute; inset: 0; }
.monitor-poster, .monitor-scene video { position: absolute; width: 100%; height: 100%; object-fit: contain; }
.monitor-play { position: absolute; bottom: 12px; right: 12px; background: #10192de8; color: #fff; border: 1px solid #55647d; border-radius: 4px; font: 9px var(--mono); padding: 7px 12px; cursor: pointer; }
.monitor-scene-enter-active, .monitor-scene-leave-active { transition: opacity .28s, transform .4s; }.monitor-scene-enter-from { opacity: 0; transform: translateY(15px) scale(1.02); }.monitor-scene-leave-to { opacity: 0; transform: translateY(-10px); }
.replay-visual, .knowledge-visual { position: relative; width: 100%; height: 100%; padding: 27px 25px; background: radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--gallery-accent) 14%, #111b2d), #0d1626); }
.replay-heading { display: grid; gap: 8px; }.replay-heading > span { font: 500 22px/1.2 var(--display); letter-spacing: -.03em; }.replay-heading small { font: 7px var(--mono); color: #95a6c0; letter-spacing: .12em; }
.replay-orbit { height: 58%; position: relative; margin-top: 5px; }
.replay-orbit svg { width: 100%; height: 100%; fill: none; stroke: var(--gallery-accent); stroke-width: 1; }
.replay-orbit svg ellipse { opacity: .25; }.replay-route { stroke-width: 2; stroke-dasharray: 12 32; opacity: .75; }
.is-running .replay-route { animation: orbit-run 14s linear infinite; }
@keyframes orbit-run { to { stroke-dashoffset: -440; } }
.orbit-label { position: absolute; padding: 5px 7px; background: #14223ae8; border: 1px solid #526687; border-radius: 3px; font: 7px var(--mono); color: #cbd9f2; }.orbit-label-a { left: 0; top: 42%; }.orbit-label-b { right: 0; bottom: 25%; }
.replay-fields { display: flex; gap: 18px; border-top: 1px solid #ffffff15; padding-top: 15px; }.replay-fields > div { display: grid; gap: 6px; flex: 1; }.replay-fields span { color: #90a3c0; font: 7px var(--mono); }.replay-fields strong { font: 9px/1.4 var(--mono); font-weight: 400; color: #cedcf4; }
.knowledge-stack { position: relative; width: 100%; height: 78%; perspective: 800px; }
.knowledge-sheet { position: absolute; width: 55%; height: 76%; top: 15%; left: 23%; padding: 20px; border: 1px solid #7480a0; border-radius: 5px; background: linear-gradient(140deg, #2d3151, #172139); box-shadow: 0 15px 30px #0004; }
.knowledge-sheet > span { display: block; font: 7px var(--mono); color: #b7c2e3; margin-bottom: 20px; }.knowledge-sheet i { display: block; height: 3px; background: #8290bb50; margin-bottom: 16px; width: 90%; }.knowledge-sheet i:nth-child(3) { width: 65%; }.knowledge-sheet b { position: absolute; bottom: 20px; right: 20px; font-size: 25px; color: #afb9de; font-weight: 400; }
.sheet-source { transform: translateX(calc(-48px - var(--gallery-phase) * 18px)) rotate(-14deg); }.sheet-object { transform: translateX(calc(20px + var(--gallery-phase) * 12px)) translateY(-7px) rotate(9deg); }.sheet-evidence { transform: translateY(calc(25px + var(--gallery-phase) * -18px)) rotate(-2deg); border-color: var(--gallery-accent); background: linear-gradient(140deg, #5d4a8399, #25304cf5); }
.sheet-evidence strong { display: block; white-space: pre-line; font: 500 clamp(17px, 2vw, 28px)/1.1 var(--display); letter-spacing: -.04em; }.sheet-evidence em { position: absolute; bottom: 20px; left: 20px; font: normal 7px var(--mono); color: #d0baf9; border-top: 1px solid #af94ed66; padding-top: 10px; }
.case-system-path { display: flex; padding-top: 26px; }.case-system-path > div { flex: 1; display: grid; gap: 12px; color: #708199; font: 8px var(--mono); position: relative; }.case-system-path > div::before { content: ''; position: absolute; top: 3px; height: 1px; left: 0; right: 0; background: #2d3b50; }.case-system-path > div:last-child::before { display: none; }.path-dot { width: 7px; height: 7px; border: 1px solid #607088; border-radius: 50%; background: #131d2e; z-index: 1; }.case-system-path .reached { color: #dce6f6; }.reached .path-dot { background: var(--gallery-accent); border-color: var(--gallery-accent); box-shadow: 0 0 12px color-mix(in srgb, var(--gallery-accent) 40%, transparent); }
.case-path-detail { min-height: 35px; font: 10px/1.6 var(--mono); color: #91a3bd; margin: 20px 0 0; }.case-path-detail > span { color: var(--gallery-accent); margin-right: 10px; }
@media(max-width:1000px) { .case-gallery { gap: 30px; }.case-chapter-evidence { gap: 10px; }.replay-heading > span { font-size: 18px; }.replay-fields strong { font-size: 8px; }.replay-visual,.knowledge-visual { padding: 20px 16px; }.knowledge-sheet { padding: 13px; } }
@media(max-width:700px) { .case-gallery { display: flex; flex-direction: column; gap: 0; }.case-visual-column { order: -1; position: sticky; top: 72px; z-index: 5; background: var(--console-bg); padding-bottom: 10px; }.case-visual-sticky { position: static; padding: 0; }.case-switcher { margin-bottom: 6px; gap: 10px; }.case-monitor-screen { aspect-ratio: 1.85; }.monitor-chrome,.monitor-caption { font-size: 6px; padding: 9px 12px; }.case-system-path { padding-top: 12px; }.case-path-detail { display: none; }.case-system-path > div { font-size: 7px; gap: 6px; }.case-chapter { min-height: 600px; padding: 55px 0; }.case-chapter h3 { font-size: 35px; }.case-chapter-thesis { font-size: 16px; }.case-chapter-summary { font-size: 13px; }.replay-visual,.knowledge-visual { padding: 12px 15px; }.replay-heading > span { font-size: 16px; }.replay-heading small { font-size: 6px; }.replay-orbit { position: absolute; left: 40%; right: 0; top: 10%; height: 85%; }.replay-fields { position: absolute; left: 15px; bottom: 18px; display: grid; border: none; gap: 12px; width: 43%; }.orbit-label { display: none; }.knowledge-stack { position: absolute; width: 65%; right: 0; top: 15px; height: 95%; }.knowledge-sheet { padding: 10px; }.knowledge-sheet > span { font-size: 5px; margin-bottom: 12px; }.knowledge-sheet i { margin-bottom: 8px; }.sheet-evidence strong { font-size: 18px; }.sheet-evidence em { bottom: 10px; left: 10px; font-size: 5px; padding-top: 5px; } }
@media(min-width:701px) and (max-height:820px) { .case-monitor-screen { aspect-ratio: 1.85; }.case-visual-sticky { top: 90px; }.case-switcher { margin-bottom: 12px; }.case-system-path { padding-top: 16px; } }
@media(prefers-reduced-motion:reduce) { .case-chapter { opacity: 1; min-height: 0; transition: none; }.case-visual-sticky,.case-visual-column { position: static; }.case-monitor { transform: none; }.replay-route { animation: none !important; }.monitor-scene-enter-active,.monitor-scene-leave-active { transition: none; } }
</style>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ active: number; phase: number; running: boolean; language: string }>()
const zh = computed(() => props.language === 'zh')
const layers = computed(() => [
  { name: zh.value ? '交互' : 'INTERACTION', detail: 'VOICE · TOOLS · CONTEXT', key: 'interface' },
  { name: zh.value ? '执行' : 'EXECUTION', detail: 'STREAM · STATE · RUNTIME', key: 'runtime' },
  { name: zh.value ? '验证' : 'ASSURANCE', detail: 'REPLAY · EVIDENCE · REVIEW', key: 'assurance' },
])
const highlighted = computed(() => [2, 1, 0][props.active])
</script>

<template>
  <div class="system-sculpture" :class="{ 'is-running': running }" :style="{ '--system-phase': phase, '--system-travel': (active + phase) / 3, '--active-layer': highlighted }" role="img" :aria-label="zh ? '交互、执行和验证构成的 Agent 系统；当前能力对应的层高亮' : 'An agent system built from interaction, execution and assurance. The current capability highlights its layer.'">
    <div class="sculpture-topline"><span>AGENT / ANATOMY</span><span>{{ zh ? '随滚动拆解' : 'SCROLL TO DISASSEMBLE' }} ↘</span></div>
    <div class="sculpture-space" aria-hidden="true">
      <div class="system-axis axis-one"></div><div class="system-axis axis-two"></div>
      <div class="system-halo halo-one"></div><div class="system-halo halo-two"></div>
      <div class="system-assembly">
        <div v-for="(layer, i) in layers" :key="layer.key" class="system-plane" :class="{ selected: i === highlighted }" :style="{ '--plane-index': i }">
          <div class="plane-grid"></div>
          <div class="plane-corner corner-a"></div><div class="plane-corner corner-b"></div>
          <span class="plane-name">{{ layer.name }}</span>
          <span class="plane-detail">{{ layer.detail }}</span>
          <div class="plane-core"><svg viewBox="0 0 64 64"><path d="M32 5 55 18v28L32 59 9 46V18Z M9 18l23 14 23-14 M32 32v27" /></svg></div>
          <div class="plane-signal signal-one"></div><div class="plane-signal signal-two"></div>
        </div>
      </div>
      <div class="sculpture-coordinate coordinate-top">INPUT →</div>
      <div class="sculpture-coordinate coordinate-bottom">→ OUTCOME</div>
    </div>
    <div class="sculpture-legend">
      <span><i></i>{{ zh ? '一个系统，三个工作面。' : 'One system. Three working surfaces.' }}</span>
      <span>{{ String(active + 1).padStart(2, '0') }} / 03</span>
    </div>
  </div>
</template>

<style scoped>
.system-sculpture { --structure-blue: #7d9fff; position: relative; color: #dfe8fc; border: 1px solid #384764; background: radial-gradient(ellipse at 48% 40%, #25355d 0%, #131d33 45%, #0e1627 80%); overflow: hidden; border-radius: 12px; box-shadow: 0 40px 90px #08122730; }
.sculpture-topline, .sculpture-legend { position: relative; z-index: 3; display: flex; justify-content: space-between; gap: 16px; padding: 22px 24px; font: 9px var(--mono); letter-spacing: .06em; color: #a1b2d2; }
.sculpture-topline { border-bottom: 1px solid #ffffff0d; }
.sculpture-space { height: clamp(380px, 34vw, 510px); position: relative; perspective: 1000px; }
.system-assembly { position: absolute; width: 300px; height: 300px; left: 50%; top: 47%; transform-style: preserve-3d; transform: translate(-50%, -50%) rotateX(calc(55deg + var(--system-travel) * 7deg)) rotateZ(calc(-42deg + var(--system-travel) * 22deg)) scale3d(var(--assembly-scale, 1), var(--assembly-scale, 1), var(--assembly-scale, 1)); }
.system-plane { position: absolute; inset: 0; border: 1px solid #647cad; border-radius: 7px; background: linear-gradient(135deg, #4b648e28, #15243cd9); box-shadow: 0 18px 40px #02091640; transform: translateZ(calc((1 - var(--plane-index)) * (50px + var(--system-travel) * 85px))) translateX(calc((var(--plane-index) - 1) * var(--system-travel) * 45px)); transition: border-color .65s, background .65s, box-shadow .65s; overflow: hidden; }
.system-plane.selected { border-color: #c0d2ff; background: linear-gradient(140deg, #6b91e680, #233967e6); box-shadow: 0 0 50px #729eff38, 0 12px 25px #0004; }
.plane-grid { position: absolute; inset: 0; background-image: linear-gradient(#bbd0ff14 1px, transparent 1px), linear-gradient(90deg, #bbd0ff14 1px, transparent 1px); background-size: 25px 25px; mask-image: linear-gradient(130deg, #000, #0000); }
.plane-name { position: absolute; top: 20px; left: 22px; font: 500 17px var(--mono); letter-spacing: .09em; color: #e0e9fa; }
.plane-detail { position: absolute; bottom: 20px; left: 22px; font: 8px var(--mono); color: #a7c1f0; }
.plane-core { position: absolute; width: 76px; height: 76px; left: calc(50% - 38px); top: calc(50% - 38px); display: grid; place-items: center; border: 1px solid #b3ccff80; border-radius: 16px; background: #6b96ef22; }
.plane-core svg { width: 43px; fill: none; stroke: #c3d6ff; stroke-width: 1.2; }
.plane-corner { width: 17px; height: 17px; position: absolute; border-color: #c7daff; border-style: solid; }
.corner-a { top: 7px; left: 7px; border-width: 1px 0 0 1px; }
.corner-b { bottom: 7px; right: 7px; border-width: 0 1px 1px 0; }
.plane-signal { position: absolute; height: 2px; width: 55px; background: linear-gradient(90deg, transparent, #c6d9ff); opacity: 0; }
.signal-one { left: 0; top: 45%; }.signal-two { left: 0; top: 65%; }
.is-running .selected .plane-signal { animation: signal-pass 3s linear infinite; }
.is-running .selected .signal-two { animation-delay: 1.5s; }
@keyframes signal-pass { 0% { translate: -60px 0; opacity: 0; } 20%, 80% { opacity: 1; } 100% { translate: 330px 0; opacity: 0; } }
.system-halo { position: absolute; top: 50%; left: 50%; width: 440px; height: 240px; border: 1px solid #91acf427; border-radius: 50%; transform: translate(-50%, -50%) rotate(-24deg); }
.halo-two { width: 520px; height: 310px; border-color: #91acf414; transform: translate(-50%, -50%) rotate(24deg); }
.system-axis { position: absolute; height: 1px; width: 100%; top: 50%; background: linear-gradient(90deg, transparent, #91acf421, transparent); }
.axis-one { rotate: -24deg; }.axis-two { rotate: 40deg; }
.sculpture-coordinate { position: absolute; font: 9px var(--mono); letter-spacing: .12em; color: #a5bde6; }
.coordinate-top { left: 24px; top: 24px; }.coordinate-bottom { right: 24px; bottom: 24px; }
.sculpture-legend { border-top: 1px solid #ffffff0d; font-size: 9px; }
.sculpture-legend i { display: inline-block; width: 5px; height: 5px; margin-right: 8px; border-radius: 50%; background: #b4c9ff; box-shadow: 0 0 9px #7d9fff; }
@media(max-width: 1000px) { .system-assembly { --assembly-scale: .8; }.sculpture-space { height: 390px; } }
@media(min-width: 701px) and (max-height: 820px) { .sculpture-space { height: 330px; }.system-assembly { --assembly-scale: .8; } }
@media(max-width: 700px) { .sculpture-space { height: 220px; }.system-assembly { --assembly-scale: .58; }.sculpture-topline,.sculpture-legend { padding: 14px; font-size: 7px; }.system-halo { width: 300px; height: 160px; } }
@media(prefers-reduced-motion: reduce) { .system-plane { transition: none; }.plane-signal { animation: none !important; }.system-assembly { transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-36deg) scale3d(var(--assembly-scale, 1), var(--assembly-scale, 1), var(--assembly-scale, 1)); }.system-plane { transform: translateZ(calc((1 - var(--plane-index)) * 86px)); } }
</style>

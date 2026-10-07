<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()
const zh = computed(() => currentLanguage.value === 'zh')
const canvas = ref<HTMLCanvasElement>()
const ready = ref(false)
const paused = ref(false)
const unavailable = ref(false)
let dispose: (() => void) | undefined
let controls: { rotate: (direction: number) => void; pause: (value: boolean) => void } | undefined
let disposed = false
function toggle() {
  paused.value = !paused.value
  controls?.pause(paused.value)
}
onMounted(async () => {
  try {
    const { createPrism } = await import('../three/prism')
    if (disposed || !canvas.value) return
    const scene = createPrism(canvas.value, () => { unavailable.value = true; ready.value = false })
    controls = scene
    dispose = scene.dispose
    paused.value = scene.reduced
    ready.value = true
  } catch {
    unavailable.value = true
  }
})
onBeforeUnmount(() => { disposed = true; dispose?.() })
</script>

<template>
  <div class="prism-signature" :class="{ 'prism-ready': ready }">
    <div class="prism-edition" aria-hidden="true"><span>01 / PERSPECTIVE</span><span>N.S. — 光 / LIGHT</span></div>
    <div class="prism-static" aria-hidden="true"><span>NATHAN<br>SHAN</span><i></i></div>
    <canvas ref="canvas" class="prism-canvas" :tabindex="ready ? 0 : -1" :aria-hidden="!ready" role="img"
      :aria-label="zh ? '折射 Nathan Shan 名字的玻璃雕塑。左右方向键旋转，空格暂停。' : 'Glass sculpture refracting Nathan Shan’s name. Arrow keys rotate; Space pauses.'"
      @keydown.left.prevent="controls?.rotate(-1)" @keydown.right.prevent="controls?.rotate(1)" @keydown.space.prevent="toggle" />
    <div class="prism-caption"><p>{{ zh ? '把想象，变成现实。' : 'Ideas, brought into focus.' }}</p><span>{{ unavailable ? (zh ? '静态视图' : 'STILL VIEW') : (zh ? '拖动 · 改变视角' : 'DRAG TO CHANGE PERSPECTIVE') }}</span></div>
    <div v-if="ready" class="prism-controls">
      <button type="button" :aria-label="zh ? '向左旋转玻璃' : 'Rotate glass left'" @click="controls?.rotate(-1)">←</button>
      <button type="button" :aria-label="zh ? '向右旋转玻璃' : 'Rotate glass right'" @click="controls?.rotate(1)">→</button>
      <button type="button" :aria-pressed="paused" :aria-label="zh ? '暂停自动旋转' : 'Pause automatic rotation'" @click="toggle">{{ paused ? '▷' : 'Ⅱ' }}</button>
    </div>
  </div>
</template>

<style scoped>
.prism-signature { position: relative; isolation: isolate; height: clamp(410px, 39vw, 520px); background: #090c11; color: #f0efe8; overflow: hidden; }
.prism-edition { position: absolute; z-index: 2; top: 23px; left: 25px; right: 25px; display: flex; justify-content: space-between; gap: 10px; color: #a0a6b2; font: 9px var(--mono); letter-spacing: .1em; pointer-events: none; }
.prism-canvas { display: block; width: 100%; height: 100%; position: absolute; inset: 0; opacity: 0; cursor: grab; touch-action: pan-y; }
.prism-canvas:active { cursor: grabbing; }
.prism-canvas:focus-visible { outline-offset: -5px; }
.prism-ready .prism-canvas { opacity: 1; }
.prism-static { position: absolute; inset: 0; display: grid; place-items: center; }
.prism-static span { text-align: center; font: 700 clamp(60px, 7vw, 100px)/.9 var(--display); letter-spacing: -.07em; }
.prism-static i { position: absolute; width: 42%; aspect-ratio: 1; border: 1px solid #bacce975; border-radius: 22%; rotate: -20deg; background: linear-gradient(125deg, #ffffff13, #b5c8fc08 40%, #ffffff29); box-shadow: inset 1px 1px 15px #ffffff20; }
.prism-caption { position: absolute; z-index: 2; left: 25px; bottom: 27px; pointer-events: none; }
.prism-caption p { margin: 0 0 6px; font: 500 15px var(--display); letter-spacing: -.025em; }
.prism-caption > span { font: 8px var(--mono); letter-spacing: .075em; color: #989eab; }
.prism-controls { position: absolute; z-index: 2; right: 19px; bottom: 25px; display: flex; gap: 4px; }
.prism-controls button { width: 35px; height: 35px; padding: 0; border: 1px solid #f0efe824; border-radius: 50%; color: #f0efe8; background: #090c1170; cursor: pointer; transition: background .2s, border-color .2s; }
.prism-controls button:hover { background: #ffffff20; border-color: #f0efe888; }
@media(max-width:620px) { .prism-signature { height: 400px; }.prism-edition { left: 20px; right: 20px; font-size: 8px; }.prism-caption { left: 20px; bottom: 70px; }.prism-controls { bottom: 20px; right: 20px; }.prism-static span { font-size: 19vw; } }
</style>

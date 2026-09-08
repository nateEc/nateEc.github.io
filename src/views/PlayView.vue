<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { setPageMeta } from '../composables/usePageMeta'
const { currentLanguage } = useLanguage()
const zh = computed(() => currentLanguage.value === 'zh')
watchEffect(() => setPageMeta({
  title: 'Little Sunshine Snake — Nathan Shan',
  description: zh.value ? '休息一会儿，和 Little Sunshine 玩一局贪吃蛇。无需账号，最高分保存在本机。' : 'Take a small break with Little Sunshine Snake. No account, just one more round.',
  path: '/play',
}))
</script>

<template>
  <main class="play-page">
    <div class="shell play-layout">
      <div class="play-copy">
        <RouterLink class="play-back" to="/" :aria-label="zh ? '返回 Portfolio' : 'Back to portfolio'">← {{ zh ? '返回作品集' : 'Back to portfolio' }}</RouterLink>
        <p class="play-eyebrow"><span aria-hidden="true">☼</span>{{ zh ? '留一点时间，给自己' : 'A LITTLE TIME OFF' }}</p>
        <h1>{{ zh ? '追一束光。' : 'Chase a' }}<br v-if="!zh"><em>{{ zh ? '不赶时间。' : 'little light.' }}</em></h1>
        <p class="play-intro">{{ zh ? '代码可以等一会儿。和 Little Sunshine 玩一局，收集阳光，别咬到自己。' : 'The code can wait a minute. Take a lap with Little Sunshine, collect the light, and try not to eat your tail.' }}</p>
        <div class="play-note"><span class="tiny-snake" aria-hidden="true">〰</span><p>{{ zh ? '一个我用 Codex 做的小玩具。不是项目展示，只是想请你玩一会儿。' : 'A small game I made with Codex. Not a case study. Just something for you to enjoy.' }}</p></div>
        <p class="play-local">{{ zh ? '无需登录 · 最高分仅保存在当前浏览器' : 'NO SIGN-IN · BEST SCORE SAVED IN THIS BROWSER' }}</p>
      </div>
      <section class="arcade-cabinet" :aria-label="zh ? '贪吃蛇游戏机' : 'Snake arcade'">
        <div class="cabinet-label"><span><i></i>LITTLE SUNSHINE</span><span>SNAKE / PLAY</span></div>
        <iframe src="/games/snake/index.html" title="Little Sunshine Snake" allow="autoplay" referrerpolicy="same-origin"></iframe>
        <div class="cabinet-foot"><span>☼</span>{{ zh ? '太阳还在，再来一局。' : 'The sun is still up. One more round?' }}<span>↵</span></div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.play-page { min-height: 100svh; padding: 112px 0 48px; background: radial-gradient(ellipse at 80% 15%, #e8bd6214, transparent 55%), var(--paper); }
.play-layout { display: grid; grid-template-columns: minmax(0, .7fr) minmax(0, 1.3fr); gap: clamp(35px, 5vw, 85px); align-items: center; }
.play-back { display: inline-block; color: var(--muted); font: 11px var(--mono); text-decoration: none; padding: 12px 0; margin-bottom: 44px; }
.play-back:hover { color: var(--blue); }
.play-eyebrow { display: flex; align-items: center; gap: 10px; color: var(--muted); font: 10px var(--mono); letter-spacing: .12em; }
.play-eyebrow > span { color: #a16e20; font-size: 25px; }
.play-copy h1 { font: 500 clamp(45px, 5.5vw, 80px)/1.02 var(--display); letter-spacing: -.065em; margin: 22px 0 30px; }
.play-copy h1 em { display: block; font-style: normal; color: var(--teal); }
.play-intro { max-width: 340px; color: var(--muted); font-size: 17px; line-height: 1.8; }
.play-note { display: flex; align-items: center; gap: 17px; margin-top: 38px; padding-top: 25px; border-top: 1px solid var(--line); }
.tiny-snake { color: var(--teal); font-size: 50px; line-height: 1; }
.play-note p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.8; max-width: 280px; }
.play-local { color: var(--quiet); font: 8px/1.8 var(--mono); letter-spacing: .04em; margin-top: 28px; }
.arcade-cabinet { min-width: 0; background: #10232d; border: 1px solid #42606a; border-radius: 22px; overflow: hidden; box-shadow: 0 28px 70px #071c3030; }
.cabinet-label, .cabinet-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 17px 24px; color: #a7c4c7; font: 9px var(--mono); letter-spacing: .07em; }
.cabinet-label { border-bottom: 1px solid #34515b; }.cabinet-label i { display: inline-block; width: 6px; height: 6px; margin-right: 9px; border-radius: 50%; background: #f4c965; box-shadow: 0 0 12px #f4c96577; }
.arcade-cabinet iframe { width: 100%; height: clamp(590px, calc(100svh - 240px), 780px); border: 0; display: block; background: #10232d; }
.cabinet-foot { border-top: 1px solid #34515b; font-size: 8px; letter-spacing: 0; }.cabinet-foot > span { color: #f4c965; font-size: 17px; }
@media(max-width:900px) { .play-layout { grid-template-columns: 1fr; max-width: 700px; gap: 28px; }.play-back { margin-bottom: 14px; }.play-copy h1 { font-size: 50px; margin: 16px 0; }.play-copy h1 br { display: none; }.play-copy h1 em { display: inline; margin-left: .15em; }.play-intro { max-width: 550px; font-size: 15px; }.play-note,.play-local { display: none; }.arcade-cabinet iframe { height: 630px; } }
@media(max-width:480px) { .play-page { padding-top: 88px; }.play-copy h1 { font-size: 41px; }.play-layout { gap: 18px; }.cabinet-label,.cabinet-foot { padding: 12px 15px; font-size: 7px; }.arcade-cabinet { border-radius: 16px; }.arcade-cabinet iframe { height: 510px; } }
</style>

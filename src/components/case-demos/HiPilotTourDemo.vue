<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Language } from '../../data/portfolio'

const props = defineProps<{ language: Language }>()

type TourScene = {
  id: string
  image: string
  title: { en: string; zh: string }
  detail: { en: string; zh: string }
  callout: { en: string; zh: string }
  position: string
}

const scenes: TourScene[] = [
  {
    id: 'workbench',
    image: '/demos/hipilot/workbench.webp',
    title: { en: 'Upstream-synced workbench', zh: '同步上游的工作台' },
    detail: { en: 'A real packaged Electron window, mounted to a locally integrated t3code workbench after HiPilot authentication.', zh: '真实打包后的 Electron 窗口，在 HiPilot 本地认证后挂载经本地集成的 t3code 工作台。' },
    callout: { en: 'Upstream capability passes through one product surface for model, mode, workspace, and thread state.', zh: '上游能力经由同一产品界面呈现模型、运行模式、工作区与线程状态。' },
    position: '30% 72%',
  },
  {
    id: 'terminal',
    image: '/demos/hipilot/terminal.webp',
    title: { en: 'Terminal drawer', zh: '终端抽屉' },
    detail: { en: 'The app opens a real PTY inside the selected workspace; terminal behavior and the Ghostty working surface were hardened alongside this release path. This capture contains only the local smoke marker.', zh: '应用会在所选工作区中打开真实 PTY；本次发布路径也加固了终端行为与 Ghostty 工作界面。这张截图只保留了本地 smoke marker。' },
    callout: { en: 'Command evidence stays attached to task context instead of disappearing into a separate terminal.', zh: '命令证据与任务上下文保持关联，而不是消失在独立终端中。' },
    position: '55% 78%',
  },
  {
    id: 'panels',
    image: '/demos/hipilot/preview-panel.webp',
    title: { en: 'Inspectable side panel', zh: '可检查的右侧面板' },
    detail: { en: 'Browser, terminal, files, and diff live beside the conversation instead of behind modal navigation.', zh: '浏览器、终端、文件和 Diff 位于对话旁侧，而不是藏在多层弹窗之后。' },
    callout: { en: 'Execution and inspection remain visible at the same time.', zh: '执行过程和检查界面可以同时保持可见。' },
    position: '78% 43%',
  },
  {
    id: 'settings',
    image: '/demos/hipilot/settings.webp',
    title: { en: 'Desktop and project preferences', zh: '桌面与项目设置' },
    detail: { en: 'The shipped app exposes language, theme, safety defaults, project preferences, runtime checks, and redacted diagnostics.', zh: '已交付应用公开语言、主题、安全默认值、项目偏好、运行时检查和脱敏诊断设置。' },
    callout: { en: 'Product policy is visible and configurable—not hidden in env files or invisible collaboration side effects.', zh: '产品策略可见、可配置，而不是藏在环境变量或不可见的协作副作用中。' },
    position: '82% 38%',
  },
]

const activeId = ref(scenes[0]!.id)
const activeScene = computed<TourScene>(() => scenes.find((scene) => scene.id === activeId.value) ?? scenes[0]!)
const t = (value: { en: string; zh: string }) => value[props.language]
const copy = computed(() => props.language === 'zh'
  ? {
      label: '真实打包应用 · 本地后端 · 已裁去历史项目列表',
      title: '点击式产品导览',
      intro: '这些画面来自本机实际运行的 HiPilot Desktop.app。点击检查点，查看桌面 Agent 在真实窗口中的不同工作面。',
      scene: '场景',
      verified: '近期加固',
      verifiedValue: '上游同步 · 终端 · 项目偏好',
      auth: '输入边界',
      authValue: '图片仅走已支持的模型链路',
      privacy: '协作边界',
      privacyValue: 'PR/MR 交接保持可见并需确认',
      imageAlt: 'HiPilot Desktop 真实应用界面',
    }
  : {
      label: 'Real packaged app · local backend · history sidebar removed',
      title: 'Click-through product tour',
      intro: 'These frames come from HiPilot Desktop.app running on this machine. Select a checkpoint to inspect each working surface inside the real window.',
      scene: 'Scene',
      verified: 'Recent hardening',
      verifiedValue: 'upstream sync · terminal · project preferences',
      auth: 'Input boundary',
      authValue: 'images use supported model paths only',
      privacy: 'Collaboration boundary',
      privacyValue: 'PR/MR handoffs stay visible and confirmed',
      imageAlt: 'Real HiPilot Desktop application interface',
    })

const previous = () => {
  const index = scenes.findIndex((scene) => scene.id === activeScene.value.id)
  activeId.value = scenes[(index - 1 + scenes.length) % scenes.length]!.id
}

const next = () => {
  const index = scenes.findIndex((scene) => scene.id === activeScene.value.id)
  activeId.value = scenes[(index + 1) % scenes.length]!.id
}
</script>

<template>
  <section class="tour-demo" aria-labelledby="tour-demo-title">
    <header class="tour-header">
      <div>
        <p class="tour-kicker"><span aria-hidden="true"></span>{{ copy.label }}</p>
        <h2 id="tour-demo-title">{{ copy.title }}</h2>
      </div>
      <p>{{ copy.intro }}</p>
    </header>

    <div class="tour-frame">
      <div class="window-bar" aria-hidden="true">
        <span></span><span></span><span></span>
        <strong>HiPilot Desktop</strong>
        <small>localhost / packaged build 0.0.28</small>
      </div>
      <div class="capture-stage">
        <img :src="activeScene.image" :alt="`${copy.imageAlt} — ${t(activeScene.title)}`" width="956" height="768" />
        <span class="hotspot" :style="{ inset: activeScene.position }" aria-hidden="true"><i></i></span>
        <article class="scene-card" aria-live="polite">
          <p>{{ copy.scene }} / {{ String(scenes.findIndex((scene) => scene.id === activeScene.id) + 1).padStart(2, '0') }}</p>
          <h3>{{ t(activeScene.title) }}</h3>
          <p>{{ t(activeScene.detail) }}</p>
          <strong>{{ t(activeScene.callout) }}</strong>
        </article>
      </div>
    </div>

    <nav class="tour-nav" :aria-label="copy.title">
      <button type="button" aria-label="Previous scene" @click="previous">←</button>
      <button
        v-for="(scene, index) in scenes"
        :key="scene.id"
        type="button"
        :class="{ active: scene.id === activeScene.id }"
        :aria-pressed="scene.id === activeScene.id"
        @click="activeId = scene.id"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ t(scene.title) }}
      </button>
      <button type="button" aria-label="Next scene" @click="next">→</button>
    </nav>

    <footer class="verification-strip">
      <div><span>{{ copy.verified }}</span><strong>{{ copy.verifiedValue }}</strong></div>
      <div><span>{{ copy.auth }}</span><strong>{{ copy.authValue }}</strong></div>
      <div><span>{{ copy.privacy }}</span><strong>{{ copy.privacyValue }}</strong></div>
    </footer>
  </section>
</template>

<style scoped>
.tour-demo {
  --tour-green: #66d6b3;
  --tour-blue: #738cff;
  overflow: hidden;
  color: #edf3f0;
  border: 1px solid #28372f;
  border-radius: 20px;
  background: #09110e;
  box-shadow: 0 32px 90px rgb(5 25 17 / 25%);
}

.tour-header {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(280px, 1.1fr);
  gap: 48px;
  padding: clamp(30px, 5vw, 58px);
  background: radial-gradient(circle at 10% 0%, rgb(60 173 132 / 20%), transparent 42%);
}

.tour-kicker,
.scene-card > p:first-child,
.verification-strip span {
  margin: 0;
  color: #94aa9f;
  font-family: var(--mono);
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.tour-kicker span {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 9px;
  border-radius: 50%;
  background: var(--tour-green);
  box-shadow: 0 0 14px var(--tour-green);
}

.tour-header h2 {
  margin: 12px 0 0;
  color: #f6fbf8;
  font-size: clamp(2.4rem, 5vw, 5rem);
  line-height: 0.92;
}

.tour-header > p {
  align-self: end;
  max-width: 620px;
  margin: 0;
  color: #a5b9ae;
}

.tour-frame {
  width: calc(100% - clamp(24px, 6vw, 76px));
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #32453a;
  border-radius: 12px 12px 0 0;
  background: #111915;
  box-shadow: 0 24px 70px rgb(0 0 0 / 42%);
}

.window-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 42px;
  padding: 0 14px;
  border-bottom: 1px solid #28352e;
  background: #131c17;
}

.window-bar > span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ed6a5e;
}

.window-bar > span:nth-child(2) { background: #f4bd4f; }
.window-bar > span:nth-child(3) { background: #61c454; }

.window-bar strong,
.window-bar small {
  font-family: var(--mono);
  font-size: 0.62rem;
  font-weight: 500;
}

.window-bar strong { margin-left: 8px; color: #dce8e1; }
.window-bar small { margin-left: auto; color: #6f8479; }

.capture-stage {
  position: relative;
  min-height: 530px;
  overflow: hidden;
  background: #161616;
}

.capture-stage img {
  width: 100%;
  min-height: 530px;
  object-fit: cover;
  object-position: top left;
}

.capture-stage::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background: linear-gradient(90deg, transparent 50%, rgb(3 8 6 / 60%) 100%), linear-gradient(0deg, rgb(3 8 6 / 50%), transparent 46%);
}

.scene-card {
  position: absolute;
  right: clamp(18px, 4vw, 44px);
  bottom: clamp(18px, 4vw, 40px);
  z-index: 2;
  width: min(390px, calc(100% - 36px));
  padding: 22px;
  border: 1px solid rgb(131 196 169 / 35%);
  border-radius: 10px;
  background: rgb(7 15 11 / 90%);
  backdrop-filter: blur(18px);
}

.scene-card h3 {
  margin: 8px 0 10px;
  color: #f3faf6;
  font-size: clamp(1.35rem, 2.4vw, 2rem);
}

.scene-card > p:not(:first-child) {
  margin-bottom: 14px;
  color: #a9bbb1;
  font-size: 0.82rem;
}

.scene-card strong {
  display: block;
  padding-top: 12px;
  border-top: 1px solid #2b3c33;
  color: var(--tour-green);
  font-size: 0.76rem;
  font-weight: 500;
}

.hotspot {
  position: absolute;
  z-index: 3;
  width: 19px;
  height: 19px;
  border: 1px solid #b8ffdf;
  border-radius: 50%;
  background: rgb(102 214 179 / 28%);
  box-shadow: 0 0 0 7px rgb(102 214 179 / 12%), 0 0 26px rgb(102 214 179 / 55%);
}

.hotspot i {
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  background: #d5ffee;
}

.tour-nav {
  display: grid;
  grid-template-columns: 48px repeat(4, minmax(0, 1fr)) 48px;
  gap: 1px;
  width: calc(100% - clamp(24px, 6vw, 76px));
  margin: 0 auto;
  background: #29372f;
}

.tour-nav button {
  min-height: 68px;
  padding: 8px 12px;
  border: 0;
  color: #82978c;
  background: #101813;
  font-size: 0.7rem;
  cursor: pointer;
}

.tour-nav button:hover,
.tour-nav button.active {
  color: #eef8f2;
  background: #18251e;
}

.tour-nav button span {
  display: block;
  margin-bottom: 2px;
  color: var(--tour-green);
  font-family: var(--mono);
  font-size: 0.58rem;
}

.verification-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 30px clamp(24px, 6vw, 76px) 38px;
}

.verification-strip div {
  padding-right: 20px;
}

.verification-strip div + div {
  padding-left: 20px;
  border-left: 1px solid #28372f;
}

.verification-strip strong {
  display: block;
  margin-top: 4px;
  color: #dbe7e0;
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 500;
}

@media (max-width: 820px) {
  .tour-header { grid-template-columns: 1fr; gap: 20px; }
  .capture-stage,
  .capture-stage img { min-height: 470px; }
  .capture-stage img { object-position: 25% top; }
  .tour-nav { grid-template-columns: repeat(4, 1fr); }
  .tour-nav button:first-child,
  .tour-nav button:last-child { display: none; }
}

@media (max-width: 600px) {
  .tour-demo { border-radius: 12px; }
  .tour-header { padding: 25px 18px; }
  .window-bar small { display: none; }
  .capture-stage,
  .capture-stage img { min-height: 430px; }
  .capture-stage img { width: auto; max-width: none; height: 430px; }
  .scene-card { right: 12px; bottom: 12px; width: calc(100% - 24px); padding: 17px; }
  .hotspot { display: none; }
  .tour-nav { overflow-x: auto; grid-template-columns: repeat(4, 138px); }
  .verification-strip { grid-template-columns: 1fr; gap: 14px; }
  .verification-strip div + div { padding: 14px 0 0; border-top: 1px solid #28372f; border-left: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hotspot { box-shadow: 0 0 0 5px rgb(102 214 179 / 12%); }
}
</style>

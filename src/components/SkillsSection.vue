<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { useScrollChapters } from '../composables/useScrollChapters'
import SystemSculpture from './SystemSculpture.vue'

const { currentLanguage } = useLanguage()
const section = ref<HTMLElement>()
const { active, phase, visible, reduced, select } = useScrollChapters(section, '.capability-chapter')

const content = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '能力模型',
      title: '拆开系统，看看里面。',
      subtitle: '从交互到执行，再到验证。让模型能力成为产品，需要把这三个工作面连接起来。',
      capabilities: [
        {
          index: '01',
          title: 'Agent 可靠性',
          summary: '捕获失败、构建回放、比较稳定信号，并把发布决策变成可审核证据。',
          items: ['失败回归', 'LLM 评测', '路由 Shadow', '隐私最小化', '敏感输出扫描'],
        },
        {
          index: '02',
          title: '生产系统',
          summary: '将流式模型调用、异步后端、用量账本和发布门禁组合成可运维产品。',
          items: ['FastAPI', 'SSE / WebSocket', 'Redis', 'PostgreSQL', 'Docker / CI/CD'],
        },
        {
          index: '03',
          title: '多模态交互',
          summary: '围绕语音、检索、工具调用和本地模型构建实时交互与工作流。',
          items: ['ASR / TTS', 'RAG', 'Function calling', 'Ollama', '语音评分'],
        },
      ],
      toolbox: '日常工具箱',
      tools: ['Python', 'TypeScript', 'Vue / React', 'Electron', 'FastAPI', 'Playwright', 'PostgreSQL', 'Redis', 'Docker', 'Jenkins', 'Cloudflare'],
    }
  : {
      kicker: 'Capability model',
      title: 'Inside the system.',
      subtitle: 'Interaction. Execution. Assurance. The connected surfaces that turn model capability into a working product.',
      capabilities: [
        {
          index: '01',
          title: 'Agent reliability',
          summary: 'Capture failures, build replays, compare stable signals, and turn release decisions into reviewable evidence.',
          items: ['Failure regression', 'LLM evaluation', 'Routing shadow', 'Privacy minimization', 'Sensitive-output scans'],
        },
        {
          index: '02',
          title: 'Production systems',
          summary: 'Combine streaming model calls, async backends, usage ledgers, and release gates into operable products.',
          items: ['FastAPI', 'SSE / WebSocket', 'Redis', 'PostgreSQL', 'Docker / CI/CD'],
        },
        {
          index: '03',
          title: 'Multimodal interaction',
          summary: 'Build real-time experiences and workflows around voice, retrieval, tools, and local models.',
          items: ['ASR / TTS', 'RAG', 'Function calling', 'Ollama', 'Pronunciation scoring'],
        },
      ],
      toolbox: 'Working toolbox',
      tools: ['Python', 'TypeScript', 'Vue / React', 'Electron', 'FastAPI', 'Playwright', 'PostgreSQL', 'Redis', 'Docker', 'Jenkins', 'Cloudflare'],
    })
</script>

<template>
  <section id="skills" ref="section" class="section skills" aria-labelledby="skills-title">
    <div class="shell">
      <div class="section-heading">
        <p class="eyebrow">{{ content.kicker }}</p>
        <div>
          <h2 id="skills-title">{{ content.title }}</h2>
          <p class="section-heading__copy">{{ content.subtitle }}</p>
        </div>
      </div>

      <div class="capability-layout">
        <div class="capability-narrative">
          <article v-for="(capability, i) in content.capabilities" :key="capability.index" class="capability-chapter" :class="{ 'is-current': i === active }">
            <p class="capability-number"><span>{{ capability.index }}</span> / {{ currentLanguage === 'zh' ? '工作面' : 'WORKING SURFACE' }}</p>
            <h3>{{ capability.title }}</h3>
            <p class="capability-summary">{{ capability.summary }}</p>
            <ul><li v-for="item in capability.items" :key="item">{{ item }}</li></ul>
          </article>
        </div>
        <div class="capability-visual" data-chapter-stage>
          <div class="capability-sticky">
            <SystemSculpture :active="active" :phase="phase" :running="visible && !reduced" :language="currentLanguage" />
            <nav class="capability-tabs" :aria-label="currentLanguage === 'zh' ? '选择工程能力' : 'Choose an engineering capability'">
              <button v-for="(capability, i) in content.capabilities" :key="capability.index" type="button" :aria-pressed="i === active" @click="select(i)">{{ capability.title }}</button>
            </nav>
          </div>
        </div>
      </div>

      <div class="toolbox">
        <p class="mono-label">{{ content.toolbox }}</p>
        <ul>
          <li v-for="tool in content.tools" :key="tool">{{ tool }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.capability-layout { display: grid; grid-template-columns: .85fr 1.15fr; gap: 60px; align-items: stretch; }
.capability-visual { min-width: 0; }
.capability-sticky { position: sticky; top: max(100px, calc((100vh - 590px) / 2)); padding: 15px 0; }
.capability-chapter { min-height: 62vh; display: flex; flex-direction: column; justify-content: center; padding: 55px 0; opacity: .42; transition: opacity .6s; }
.capability-chapter.is-current, .capability-chapter:focus-within { opacity: 1; }
.capability-number { font: 10px var(--mono); color: var(--muted); letter-spacing: .1em; }
.capability-number span { color: var(--blue); margin-right: 18px; }
.capability-chapter h3 { font-size: clamp(32px, 3.7vw, 55px); line-height: 1.07; margin: 15px 0 22px; letter-spacing: -.055em; }
.capability-summary { color: var(--muted); font-size: 17px; line-height: 1.75; }
.capability-chapter ul { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; margin: 12px 0 0; }
.capability-chapter li { border: 1px solid var(--line-strong); background: var(--surface-soft); padding: 6px 10px; font: 10px var(--mono); border-radius: 4px; }
.capability-tabs { display: flex; margin-top: 18px; gap: 14px; }
.capability-tabs button { flex: 1; background: transparent; border: 0; border-top: 2px solid var(--line); padding: 12px 0; font: 10px var(--mono); color: var(--muted); text-align: left; cursor: pointer; }
.capability-tabs button[aria-pressed='true'] { border-color: var(--blue); color: var(--ink); }
@media(max-width: 900px) { .capability-layout { gap: 30px; grid-template-columns: .9fr 1.1fr; }.capability-chapter h3 { font-size: 34px; } }
@media(max-width: 700px) { .capability-layout { display: flex; flex-direction: column; gap: 20px; }.capability-visual { order: -1; position: sticky; top: 72px; z-index: 4; background: var(--paper-deep); padding: 8px 0; }.capability-sticky { padding: 0; position: static; }.capability-tabs { margin-top: 6px; gap: 8px; }.capability-tabs button { font-size: 8px; padding: 7px 0; }.capability-chapter { min-height: 420px; padding: 35px 0; }.capability-chapter h3 { font-size: 34px; }.capability-summary { font-size: 15px; }.capability-chapter li { font-size: 9px; } }
@media(prefers-reduced-motion: reduce) { .capability-chapter { opacity: 1; min-height: 0; transition: none; }.capability-visual { position: static; }.capability-sticky { position: static; } }
.skills {
  background: var(--paper-deep);
}

.section-heading__copy {
  margin-top: 24px;
}

.toolbox {
  display: grid;
  grid-template-columns: 0.36fr 1.64fr;
  gap: 30px;
  padding-top: 38px;
}

.toolbox .mono-label {
  color: var(--quiet);
}

.toolbox ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  padding: 0;
  margin: 0;
  list-style: none;
}

.toolbox li {
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.75rem;
}

.toolbox li:not(:last-child)::after {
  margin: 0 13px;
  color: var(--line-strong);
  content: '/';
}

@media (max-width: 780px) {
  .toolbox {
    grid-template-columns: 1fr;
  }
}
</style>

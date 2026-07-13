<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const content = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '能力模型',
      title: '围绕 Agent 生命周期工作的工程能力。',
      subtitle: '不再用图标墙罗列工具；这里按我解决问题的方式组织能力。',
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
      title: 'Engineering across the agent lifecycle.',
      subtitle: 'This replaces the old logo wall with the problem-solving capabilities I actually use.',
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
  <section id="skills" class="section skills" aria-labelledby="skills-title">
    <div class="shell">
      <div class="section-heading">
        <p class="eyebrow">{{ content.kicker }}</p>
        <div>
          <h2 id="skills-title">{{ content.title }}</h2>
          <p class="section-heading__copy">{{ content.subtitle }}</p>
        </div>
      </div>

      <div class="capability-grid">
        <article v-for="capability in content.capabilities" :key="capability.index">
          <span>{{ capability.index }}</span>
          <h3>{{ capability.title }}</h3>
          <p>{{ capability.summary }}</p>
          <ul>
            <li v-for="item in capability.items" :key="item">{{ item }}</li>
          </ul>
        </article>
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
.skills {
  background: var(--paper-deep);
}

.section-heading__copy {
  margin-top: 24px;
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
}

.capability-grid article {
  min-height: 440px;
  padding: 30px;
  border-right: 1px solid var(--line-strong);
}

.capability-grid article:first-child {
  padding-left: 0;
}

.capability-grid article:last-child {
  padding-right: 0;
  border-right: 0;
}

.capability-grid article > span {
  color: var(--blue);
  font-family: var(--mono);
  font-size: 0.69rem;
}

.capability-grid h3 {
  margin: 72px 0 16px;
  font-size: clamp(1.6rem, 2.6vw, 2.25rem);
}

.capability-grid p {
  min-height: 108px;
  color: var(--muted);
}

.capability-grid ul {
  padding: 0;
  margin: 24px 0 0;
  list-style: none;
}

.capability-grid li {
  padding: 8px 0;
  border-top: 1px solid var(--line);
  color: var(--ink);
  font-family: var(--mono);
  font-size: 0.7rem;
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
  .capability-grid {
    grid-template-columns: 1fr;
  }

  .capability-grid article,
  .capability-grid article:first-child,
  .capability-grid article:last-child {
    min-height: auto;
    padding: 30px 0;
    border-right: 0;
    border-bottom: 1px solid var(--line-strong);
  }

  .capability-grid article:last-child {
    border-bottom: 0;
  }

  .capability-grid h3 {
    margin-top: 35px;
  }

  .capability-grid p {
    min-height: 0;
  }

  .toolbox {
    grid-template-columns: 1fr;
  }
}
</style>

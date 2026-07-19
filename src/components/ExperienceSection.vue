<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '经历',
      title: '从模型能力，到可交付系统。',
      subtitle: '点击每段经历查看职责与结果。当前工作默认展开。',
      current: '当前',
      details: '查看工作证据',
    }
  : {
      kicker: 'Experience',
      title: 'From model capability to shipped systems.',
      subtitle: 'Open each role for responsibilities and outcomes. The current role starts expanded.',
      current: 'Current',
      details: 'Inspect work evidence',
    })

const experiences = computed(() => currentLanguage.value === 'zh'
  ? [
      {
        period: '2026.03 — 至今',
        title: 'AI Agent 开发工程师',
        company: '北京目的涌现科技公司',
        location: '北京，中国',
        bullets: [
          '设计用户级 Skill 自动沉淀闭环，通过风险分级、幂等去重与隐私最小化，避免错误查数和不确定结论被固化为技能。',
          '搭建 Agent 失败自动回归平台，将点踩、空答、工具失败转化为可审核用例，覆盖 6 个仓库、13 个领域和 29 个套件。',
          '设计 Skill Router Rule Shadow 框架，通过稳定字段比对、延迟统计、原子审查包和敏感输出扫描支持安全灰度。',
          '从 0 到 1 构建 HiPilot Desktop，集成 Electron、Codex app server 与 t3code workbench，覆盖模型代理、幂等计费、诊断和 macOS 发布。',
          '交付招聘 Agent 与 AI 面试闭环，包括候选人同步、检索匹配、触达提醒、运营周报及 JD/简历驱动的语音面试。',
        ],
      },
      {
        period: '2025.05 — 2026.02',
        title: 'AI 算法开发工程师',
        company: '意仕腾人工智能科技',
        location: '上海，中国',
        bullets: [
          '作为后端核心开发完成 AI 数字人产品的架构设计，基于 FastAPI 集成 GPT、RAG、ASR/TTS 与 Ollama 联网搜索。',
          '为 Ollama 服务设计负载均衡代理并推进全链路异步化，平均响应时间降低 70%，吞吐量提升近 10 倍。',
          '重构音素解析与相似度计算，并开发 K12 口语题型和动态出题流程，评分准确率提升约 40%。',
        ],
      },
      {
        period: '2024.06 — 2024.07',
        title: '软件工程师实习生',
        company: '中国历史基督教数据库',
        location: '美国波士顿',
        bullets: ['优化 Neo4j Cypher 查询并修复前端数据获取错误，查询执行时间减少约 30%，同时提升区域人口数据准确性。'],
      },
      {
        period: '2023.09 — 2023.12',
        title: '软件工程师',
        company: 'BU Spark!',
        location: '美国波士顿',
        bullets: ['协调 1 名设计师与 3 名开发者，使用 Ionic React、PostgreSQL 和 Prisma 构建 Petventure 全栈应用。'],
      },
      {
        period: '2021.09 — 2025.01',
        title: '计算机科学学士',
        company: '波士顿大学',
        location: '美国波士顿',
        bullets: ['课程包括算法、数据结构、移动软件工程、Web 编程、计算机系统、数据库、网络、线性代数和计算概率论。'],
      },
    ]
  : [
      {
        period: 'Mar 2026 — Present',
        title: 'AI Agent Engineer',
        company: 'VisionFlow AI',
        location: 'Beijing, China',
        bullets: [
          'Designed a user-level skill-learning loop with risk tiers, idempotent deduplication, and privacy minimization so uncertain runs do not become reusable skills.',
          'Built an agent-failure regression platform that turns negative feedback, empty answers, and tool failures into reviewable cases across 6 repositories, 13 domains, and 29 suites.',
          'Designed a Skill Router Rule Shadow framework with stable-field comparison, latency statistics, atomic review bundles, and sensitive-output scanning.',
          'Built HiPilot Desktop with Electron, the Codex app server, and the t3code workbench, covering model proxying, idempotent billing, diagnostics, and macOS release verification.',
          'Delivered recruiting and AI-interview workflows spanning candidate sync, retrieval, outreach, reporting, and JD/résumé-driven voice interviews.',
        ],
      },
      {
        period: 'May 2025 — Feb 2026',
        title: 'AI Algorithm Development Engineer',
        company: 'Iston AI',
        location: 'Shanghai, China',
        bullets: [
          'Architected an AI digital-human backend and integrated GPT, RAG, ASR/TTS, and Ollama-powered web search through FastAPI.',
          'Designed load balancing for Ollama and moved the pipeline to asynchronous execution, reducing average latency by 70% and increasing throughput by nearly 10×.',
          'Refactored phoneme parsing and similarity scoring, then built K12 speaking tasks and dynamic question generation, improving scoring accuracy by about 40%.',
        ],
      },
      {
        period: 'Jun 2024 — Jul 2024',
        title: 'Software Engineer Intern',
        company: 'Chinese Historical Christian Database',
        location: 'Boston, MA',
        bullets: ['Optimized Neo4j Cypher queries and fixed frontend data-fetching errors, reducing query time by about 30% while improving regional population-data accuracy.'],
      },
      {
        period: 'Sep 2023 — Dec 2023',
        title: 'Software Engineer',
        company: 'BU Spark!',
        location: 'Boston, MA',
        bullets: ['Coordinated one designer and three developers to build the Petventure full-stack application with Ionic React, PostgreSQL, and Prisma.'],
      },
      {
        period: 'Sep 2021 — Jan 2025',
        title: 'B.S. in Computer Science',
        company: 'Boston University',
        location: 'Boston, MA',
        bullets: ['Coursework included algorithms, data structures, mobile software engineering, web programming, computer systems, databases, networks, linear algebra, and computational probability.'],
      },
    ])
</script>

<template>
  <section id="experience" class="section experience" aria-labelledby="experience-title">
    <div class="shell">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.kicker }}</p>
        <div>
          <h2 id="experience-title">{{ copy.title }}</h2>
          <p class="section-heading__copy">{{ copy.subtitle }}</p>
        </div>
      </div>

      <div class="experience-list">
        <details v-for="(item, index) in experiences" :key="`${item.company}-${item.period}`" :open="index === 0">
          <summary>
            <span class="experience-index">0{{ index + 1 }}</span>
            <div class="experience-role">
              <h3>{{ item.title }}</h3>
              <p>{{ item.company }} · {{ item.location }}</p>
            </div>
            <div class="experience-meta">
              <span v-if="index === 0" class="current-label">{{ copy.current }}</span>
              <time>{{ item.period }}</time>
            </div>
            <span class="disclosure" aria-hidden="true">+</span>
          </summary>
          <div class="experience-detail">
            <p class="mono-label">{{ copy.details }}</p>
            <ul>
              <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience {
  background: var(--section-tint);
}

.section-heading__copy {
  margin-top: 24px;
}

.experience-list {
  border-top: 1px solid var(--line-strong);
}

details {
  border-bottom: 1px solid var(--line-strong);
}

summary {
  display: grid;
  grid-template-columns: 45px minmax(0, 1fr) auto 26px;
  gap: 20px;
  align-items: center;
  min-height: 112px;
  padding: 22px 4px;
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

summary:hover .experience-role h3 {
  color: var(--blue);
}

.experience-index {
  color: var(--blue);
  font-family: var(--mono);
  font-size: 0.67rem;
}

.experience-role h3 {
  margin-bottom: 3px;
  font-size: clamp(1.15rem, 2vw, 1.55rem);
  transition: color 160ms ease;
}

.experience-role p,
.experience-meta time {
  margin: 0;
  color: var(--muted);
  font-size: 0.83rem;
}

.experience-meta {
  display: flex;
  gap: 13px;
  align-items: center;
  justify-content: flex-end;
}

.experience-meta time {
  font-family: var(--mono);
  font-size: 0.65rem;
  white-space: nowrap;
}

.current-label {
  padding: 3px 7px;
  border: 1px solid var(--teal-line);
  border-radius: 3px;
  color: var(--teal);
  background: var(--teal-soft);
  font-family: var(--mono);
  font-size: 0.57rem;
  text-transform: uppercase;
}

.disclosure {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  font-family: var(--mono);
  font-size: 0.9rem;
  transition: color 160ms ease, background 160ms ease, transform 160ms ease;
}

details[open] .disclosure {
  color: var(--solid-text);
  background: var(--solid-bg);
  transform: rotate(45deg);
}

.experience-detail {
  display: grid;
  grid-template-columns: minmax(110px, 0.28fr) minmax(0, 1fr);
  gap: 35px;
  padding: 2px 52px 38px 69px;
}

.experience-detail .mono-label {
  padding-top: 5px;
  color: var(--quiet);
}

.experience-detail ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.experience-detail li {
  position: relative;
  max-width: 850px;
  padding: 10px 0 10px 26px;
  color: var(--muted);
}

.experience-detail li::before {
  position: absolute;
  left: 0;
  color: var(--blue);
  content: '↳';
}

@media (max-width: 720px) {
  summary {
    grid-template-columns: 26px 1fr 26px;
    gap: 12px;
  }

  .experience-meta {
    grid-column: 2;
    justify-content: flex-start;
  }

  .disclosure {
    grid-column: 3;
    grid-row: 1;
  }

  .experience-detail {
    grid-template-columns: 1fr;
    gap: 5px;
    padding: 0 0 30px 38px;
  }
}
</style>

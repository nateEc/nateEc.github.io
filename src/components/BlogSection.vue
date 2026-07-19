<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

type LocalizedText = { en: string; zh: string }

const posts = [
  {
    number: '01',
    date: '2026.06.24',
    category: { en: 'Agent architecture', zh: 'Agent 架构' },
    title: { en: 'AI Harness Dimension Summary', zh: 'AI Harness 维度摘要' },
    summary: {
      en: 'A compact analysis of agent-harness scenarios, the six-dimension model, ETCLOVG, and why assurance layers matter in real deployments.',
      zh: '围绕 Agent Harness 场景、六维模型、ETCLOVG 七层框架，以及真实部署中保障层为何重要的摘要。',
    },
    tags: ['Harness', 'ETCLOVG', 'Agent Eval'],
    href: '/blog/ai-harness-summary.html',
  },
  {
    number: '02',
    date: '2026.06.25',
    category: { en: 'Product policy', zh: '产品策略' },
    title: { en: 'Skill Sedimentation Strategy', zh: 'Skill 沉淀策略调整' },
    summary: {
      en: 'Separating complex execution from reusable methods, with gates for uncertainty and safer candidate collection.',
      zh: '讨论如何区分复杂执行和可复用方法，并通过不确定性 Gate 与候选聚合重构沉淀路径。',
    },
    tags: ['Skill', 'Policy Gate', 'Candidate'],
    href: '/blog/skill-sedimentation-strategy.html',
  },
  {
    number: '03',
    date: '2026.06.29',
    category: { en: 'Runtime design', zh: '运行时设计' },
    title: { en: 'Skill Sedimentation Algorithm', zh: 'Skill 沉淀算法外显' },
    summary: {
      en: 'A visual map of the HiPilot skill-sedimentation runtime, including policy decisions, observations, candidates, and QA cases.',
      zh: 'HiPilot Skill 沉淀运行时的可视化地图，覆盖策略判定、观察、候选聚合与 QA 用例。',
    },
    tags: ['HiPilot', 'Runtime', 'QA Flow'],
    href: '/blog/skill-sedimentation-algorithm.html',
  },
]

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '技术笔记',
      title: '把思考留成可复用的系统图。',
      subtitle: '关于 Agent 架构、Harness 评估和 Skill 学习策略的长文。文章使用与主站一致的阅读外壳。',
      read: '阅读笔记',
    }
  : {
      kicker: 'Technical notes',
      title: 'Leave the thinking as a reusable system map.',
      subtitle: 'Long-form notes on agent architecture, harness evaluation, and skill-learning strategy, now sharing the portfolio’s reading shell.',
      read: 'Read note',
    })

const t = (text: LocalizedText) => text[currentLanguage.value]
</script>

<template>
  <section id="blog" class="section blog" aria-labelledby="blog-title">
    <div class="shell">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.kicker }}</p>
        <div>
          <h2 id="blog-title">{{ copy.title }}</h2>
          <p class="section-heading__copy">{{ copy.subtitle }}</p>
        </div>
      </div>

      <div class="post-list">
        <article v-for="post in posts" :key="post.href">
          <div class="post-index">{{ post.number }}</div>
          <div class="post-meta">
            <span>{{ t(post.category) }}</span>
            <time>{{ post.date }}</time>
          </div>
          <div class="post-copy">
            <h3>{{ t(post.title) }}</h3>
            <p>{{ t(post.summary) }}</p>
            <ul class="tag-list">
              <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
          <a class="post-link" :href="post.href" :aria-label="`${copy.read}: ${t(post.title)}`">
            {{ copy.read }} <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog {
  background: var(--section-tint);
}

.section-heading__copy {
  margin-top: 24px;
}

.post-list {
  border-top: 1px solid var(--line-strong);
}

.post-list article {
  display: grid;
  grid-template-columns: 50px 145px minmax(0, 1fr) 110px;
  gap: 25px;
  align-items: start;
  padding: 34px 0;
  border-bottom: 1px solid var(--line-strong);
}

.post-index,
.post-meta,
.post-link {
  font-family: var(--mono);
  font-size: 0.66rem;
}

.post-index {
  color: var(--blue);
}

.post-meta {
  display: grid;
  gap: 6px;
  color: var(--teal);
  text-transform: uppercase;
}

.post-meta time {
  color: var(--quiet);
}

.post-copy h3 {
  margin-bottom: 10px;
  font-size: clamp(1.45rem, 2.5vw, 2.2rem);
}

.post-copy > p {
  max-width: 690px;
  margin-bottom: 19px;
  color: var(--muted);
}

.post-link {
  display: flex;
  justify-content: space-between;
  color: var(--ink);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 5px;
}

.post-link:hover {
  color: var(--blue);
}

@media (max-width: 760px) {
  .post-list article {
    grid-template-columns: 28px 1fr;
    gap: 14px;
  }

  .post-meta,
  .post-copy,
  .post-link {
    grid-column: 2;
  }

  .post-link {
    width: max-content;
    gap: 12px;
  }
}
</style>

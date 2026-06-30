<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

type LocalizedText = {
  en: string
  zh: string
}

type BlogPost = {
  title: LocalizedText
  date: string
  category: LocalizedText
  summary: LocalizedText
  href: string
  tags: string[]
  accent: 'blue' | 'teal' | 'gold'
}

const blogPosts: BlogPost[] = [
  {
    title: {
      en: 'AI Harness Dimension Summary',
      zh: 'AI Harness 维度摘要'
    },
    date: '2026.06.24',
    category: {
      en: 'Agent architecture',
      zh: 'Agent 架构'
    },
    summary: {
      en: 'A compact analysis of agent harness scenarios, the six-dimension model, ETCLOVG, and why assurance layers matter in real deployments.',
      zh: '围绕 agent harness 的场景划分、六维模型、ETCLOVG 七层框架与真实落地中的可观测、核验、治理优先级做的摘要。'
    },
    href: '/blog/ai-harness-summary.html',
    tags: ['Harness', 'ETCLOVG', 'Agent Eval'],
    accent: 'blue'
  },
  {
    title: {
      en: 'Skill Sedimentation Strategy',
      zh: 'Skill 沉淀策略调整'
    },
    date: '2026.06.25',
    category: {
      en: 'Product policy',
      zh: '产品策略'
    },
    summary: {
      en: 'A policy proposal for separating complex execution from reusable methods, with gates for data-query uncertainty and safer candidate collection.',
      zh: '讨论如何避免把“复杂执行”误判成“可复用方法”，并用负向 gate、候选聚合和低打扰草稿来重构沉淀路径。'
    },
    href: '/blog/skill-sedimentation-strategy.html',
    tags: ['Skill', 'Policy Gate', 'Candidate'],
    accent: 'teal'
  },
  {
    title: {
      en: 'Skill Sedimentation Algorithm',
      zh: 'Skill 沉淀算法外显'
    },
    date: '2026.06.29',
    category: {
      en: 'Runtime design',
      zh: '运行时设计'
    },
    summary: {
      en: 'A visual map of the HiPilot skill-sedimentation runtime, including policy decisions, observation, candidate aggregation, and QA cases.',
      zh: '把 HiPilot Skill 沉淀链路外显成流程图，覆盖 policy 判定、observation、candidate 聚合、自动草稿和测试用例。'
    },
    href: '/blog/skill-sedimentation-algorithm.html',
    tags: ['HiPilot', 'Runtime', 'QA Flow'],
    accent: 'gold'
  }
]

const sectionTitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return { main: '技术', highlight: 'Blog' }
  }
  return { main: 'Technical', highlight: 'Blog' }
})

const sectionSubtitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return '把最近的 agent 架构、harness 评估和 Skill 沉淀思考整理成可独立打开的长文。'
  }
  return 'Long-form notes on agent architecture, harness evaluation, and skill-sedimentation design.'
})

const localized = (text: LocalizedText) => {
  return currentLanguage.value === 'zh' ? text.zh : text.en
}

const openLabel = computed(() => {
  return currentLanguage.value === 'zh' ? '阅读文章' : 'Read note'
})
</script>

<template>
  <section id="blog" class="blog-section">
    <div class="container">
      <div class="section-heading">
        <p class="section-kicker">{{ currentLanguage === 'zh' ? '长文与系统设计' : 'Long-form notes' }}</p>
        <h2 class="section-title">{{ sectionTitle.main }} <span>{{ sectionTitle.highlight }}</span></h2>
        <p class="section-subtitle">{{ sectionSubtitle }}</p>
      </div>

      <div class="blog-grid">
        <article
          v-for="post in blogPosts"
          :key="post.href"
          :class="['blog-card', `accent-${post.accent}`]"
        >
          <div class="post-topline">
            <span>{{ localized(post.category) }}</span>
            <time>{{ post.date }}</time>
          </div>

          <h3>{{ localized(post.title) }}</h3>
          <p>{{ localized(post.summary) }}</p>

          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
          </div>

          <a :href="post.href" target="_blank" rel="noopener noreferrer" class="post-button">
            {{ openLabel }}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M14 3h7v7"></path>
              <path d="M10 14 21 3"></path>
              <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>
            </svg>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-section {
  min-height: auto;
  padding: 5rem 6.5rem 5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background:
    linear-gradient(180deg, rgba(0, 168, 120, 0.04), transparent 30%),
    var(--bg-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-heading {
  max-width: 760px;
  margin: 0 auto 3rem;
  text-align: center;
}

.section-kicker {
  margin-bottom: 0.65rem;
  color: #0f766e;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-align: center;
  text-transform: uppercase;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-title span {
  color: var(--accent-color);
}

.section-subtitle {
  color: var(--secondary-color);
  line-height: 1.7;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.blog-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 360px;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-top: 4px solid var(--post-accent);
  border-radius: 0.55rem;
  background: rgba(255, 255, 255, 0.74);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.blog-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--post-accent) 46%, var(--border-color));
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.08);
}

.accent-blue {
  --post-accent: var(--accent-color);
}

.accent-teal {
  --post-accent: #0f766e;
}

.accent-gold {
  --post-accent: #9a7332;
}

.post-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.1rem;
  color: var(--post-accent);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.post-topline time {
  color: var(--secondary-color);
  font-weight: 700;
  letter-spacing: 0;
  white-space: nowrap;
}

.blog-card h3 {
  margin-bottom: 0.7rem;
  color: var(--text-color);
  font-size: 1.28rem;
  line-height: 1.25;
  font-weight: 800;
}

.blog-card p {
  color: var(--secondary-color);
  font-size: 0.94rem;
  line-height: 1.65;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.42rem;
  margin: auto 0 1.2rem;
  padding-top: 1.2rem;
}

.post-tags span {
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 0.3rem 0.52rem;
  color: var(--text-color);
  background: rgba(255, 255, 255, 0.76);
  font-size: 0.74rem;
  font-weight: 600;
}

.post-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: fit-content;
  min-height: 44px;
  padding: 0.64rem 0.82rem;
  border: 1px solid var(--post-accent);
  border-radius: 0.45rem;
  color: #fff;
  background: var(--post-accent);
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 800;
  transition: transform 0.22s ease, background-color 0.22s ease, color 0.22s ease;
}

.post-button:hover {
  transform: translateY(-2px);
  color: var(--post-accent);
  background: transparent;
}

@media (max-width: 1080px) {
  .blog-section {
    padding-right: 6rem;
  }

  .blog-grid {
    grid-template-columns: 1fr;
  }

  .blog-card {
    min-height: 0;
  }
}

@media (max-width: 768px) {
  .blog-section {
    padding: 4rem 1rem;
  }

  .section-heading {
    margin-bottom: 2.3rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .post-topline {
    display: block;
  }

  .post-topline time {
    display: block;
    margin-top: 0.3rem;
  }
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

type NewsItem = {
  title: string
  summary: string
  url: string
  source: string
  score?: number
  reasons?: string[]
  published?: string
}

type TechNewsSection = {
  name: string
  source: string
  items: NewsItem[]
}

type TechNewsPayload = {
  updatedAt: string
  date: string
  sections: TechNewsSection[]
}

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '科技快讯',
      title: '今天的 Tech News',
      subtitle: '每个早上抓取两个科技新闻来源，自动更新展示。',
      fallback: '今日尚未生成 Tech News，请稍候片刻。',
      byline: '来源',
      updated: '更新于',
      scoreLabel: '趋势',
    }
  : {
      kicker: 'Tech News',
      title: 'Today’s Tech News',
      subtitle: 'Pulled from two scheduled tech-news cron feeds every morning.',
      fallback: 'Today’s Tech News has not been generated yet; please check back shortly.',
      byline: 'source',
      updated: 'Updated',
      scoreLabel: 'trend',
    })

const payload = ref<TechNewsPayload>({
  updatedAt: '',
  date: '',
  sections: [],
})
const status = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const errorMessage = ref('')

const hasNews = computed(() => payload.value.sections.some((section) => section.items.length > 0))

const formattedUpdatedAt = computed(() => {
  if (!payload.value.updatedAt) return ''
  const dt = new Date(payload.value.updatedAt)
  if (Number.isNaN(dt.getTime())) return payload.value.updatedAt
  return dt.toLocaleString(currentLanguage.value === 'zh' ? 'zh-CN' : 'en-US', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const loadNews = async () => {
  status.value = 'loading'
  errorMessage.value = ''

  try {
    const response = await fetch('/tech-news/latest.json', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    payload.value = {
      updatedAt: data.updatedAt ?? '',
      date: data.date ?? '',
      sections: Array.isArray(data.sections) ? data.sections : [],
    }
    status.value = hasNews.value ? 'ready' : 'empty'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error)
    status.value = 'error'
  }
}

const reasonsText = (item: NewsItem) => {
  if (!item.reasons?.length) {
    return ''
  }
  return item.reasons.join(' · ')
}

onMounted(() => {
  loadNews()
})
</script>

<template>
  <section id="tech-news" class="section tech-news" aria-labelledby="tech-news-title">
    <div class="shell">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.kicker }}</p>
        <div>
          <h2 id="tech-news-title">{{ copy.title }}</h2>
          <p class="section-heading__copy">{{ copy.subtitle }}</p>
        </div>
      </div>

      <div v-if="status === 'error'" class="tech-news-empty">{{ copy.fallback }}
        <span v-if="errorMessage">（{{ errorMessage }}）</span>
      </div>
      <div v-else-if="status === 'loading' || status === 'empty'" class="tech-news-empty">{{ copy.fallback }}</div>

      <div v-else class="tech-news-grid">
        <article v-for="section in payload.sections" :key="section.name" class="tech-news-card">
          <div class="tech-news-card__head">
            <h3>{{ section.name }}</h3>
            <p>{{ copy.byline }}：{{ section.source }}</p>
          </div>

          <ul>
            <li v-for="item in section.items" :key="item.url">
              <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
              <p>{{ item.summary }}</p>
              <p v-if="item.published" class="tech-news-meta">{{ item.published }}</p>
              <div v-if="reasonsText(item) || item.score" class="tech-news-meta">
                <span v-if="copy.scoreLabel">{{ copy.scoreLabel }}:</span>
                <span v-if="item.score">{{ item.score }}</span>
                <span v-if="reasonsText(item)" class="tech-news-reasons">{{ reasonsText(item) }}</span>
              </div>
            </li>
          </ul>
        </article>
      </div>

      <p v-if="status === 'ready' && formattedUpdatedAt" class="tech-news-updated">
        {{ copy.updated }}：{{ formattedUpdatedAt }} {{ payload.date ? `(${payload.date})` : '' }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.tech-news-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.tech-news-card {
  border: 1px solid var(--line-strong);
  border-radius: 7px;
  overflow: hidden;
  padding: 14px;
  background: var(--surface-soft);
}

.tech-news-card__head {
  margin-bottom: 10px;
}

.tech-news-card__head h3 {
  margin: 0 0 4px;
  font-size: 1.05rem;
}

.tech-news-card__head p {
  margin: 0;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.68rem;
}

.tech-news-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.tech-news-card li {
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--section-bg);
}

.tech-news-card a {
  color: var(--ink);
  text-decoration: none;
  font-weight: 600;
}

.tech-news-card a:hover {
  color: var(--blue);
}

.tech-news-card p {
  margin: 6px 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.tech-news-meta {
  margin-top: 8px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.67rem;
}

.tech-news-reasons {
  display: block;
}

.tech-news-empty {
  padding: 12px;
  border: 1px dashed var(--line);
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.75rem;
}

.tech-news-updated {
  margin-top: 20px;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.66rem;
}
</style>

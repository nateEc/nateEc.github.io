<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { setPageMeta } from '../composables/usePageMeta'

type NewsItem = {
  title: string
  summary: string
  url: string
  source: string
  score?: number
  reasons?: string[]
  published?: string
}

type NewsSection = {
  name: string
  source: string
  items: NewsItem[]
}

type NewsPayload = {
  updatedAt: string
  date: string
  sections: NewsSection[]
}

type RankedNewsItem = NewsItem & {
  sectionName: string
  sectionSource: string
}

const { currentLanguage } = useLanguage()
const activeSource = ref('all')
const status = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const payload = ref<NewsPayload>({ updatedAt: '', date: '', sections: [] })

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      back: '返回作品集',
      kicker: 'NATHAN’S SIGNAL DESK · DAILY',
      titleLead: '我不追完所有新闻。',
      titleAccent: '只保留值得改变判断的信号。',
      intro: '来自 AI、开发者工具与科技产业的一份每日筛选。热度只负责排序；是否值得读，仍由事实、工程影响和后续问题决定。',
      fresh: '今日快照',
      stale: '最近快照',
      updated: '生成时间',
      cadence: '每日 11:30 · 北京时间',
      sources: '信息源',
      signals: '条信号',
      trace: '今日信号强度',
      traceHint: '公开信号排序 · 原文可核验',
      filter: '按来源筛选',
      all: '全部信号',
      lead: '最高信号',
      feed: '信号流',
      score: '趋势',
      why: '入选依据',
      open: '阅读原文',
      sourcePage: '查看来源',
      method: '筛选方法',
      methodTitle: '让热度进入视野，让判断留在人手里。',
      methodBody: '自动任务每天汇总三个公开来源，保留原文链接、发布时间与趋势依据。分数用于建立阅读顺序，不替代事实核验。',
      methodTags: ['时效性', '讨论热度', '工程相关性'],
      loading: '正在读取最新信号…',
      empty: '最新快照里还没有可展示的信号。',
      error: '新闻快照暂时不可用。',
      retry: '重新读取',
    }
  : {
      back: 'Back to portfolio',
      kicker: 'NATHAN’S SIGNAL DESK · DAILY',
      titleLead: 'I don’t read everything.',
      titleAccent: 'I keep the signals that might change my mind.',
      intro: 'A daily filter across AI, developer tools, and the technology business. Momentum sets the reading order; facts, engineering impact, and open questions decide what deserves attention.',
      fresh: 'Today’s snapshot',
      stale: 'Latest snapshot',
      updated: 'Generated',
      cadence: 'Daily at 11:30 · Beijing time',
      sources: 'sources',
      signals: 'signals',
      trace: 'Today’s signal strength',
      traceHint: 'ranked from public signals · source-linked',
      filter: 'Filter by source',
      all: 'All signals',
      lead: 'Strongest signal',
      feed: 'Signal stream',
      score: 'trend',
      why: 'Why it surfaced',
      open: 'Read original',
      sourcePage: 'Open source',
      method: 'Selection method',
      methodTitle: 'Let momentum into the room. Keep judgment human.',
      methodBody: 'An automated task collects three public sources each day and preserves the original link, publication time, and ranking evidence. The score sets an order; it does not replace verification.',
      methodTags: ['Recency', 'Discussion', 'Engineering relevance'],
      loading: 'Reading the latest signals…',
      empty: 'The latest snapshot has no displayable signals yet.',
      error: 'The news snapshot is temporarily unavailable.',
      retry: 'Read again',
    })

watchEffect(() => {
  setPageMeta(currentLanguage.value === 'zh'
    ? {
        title: 'Tech Signal — Nathan Shan 的每日科技情报',
        description: 'Nathan Shan 每日筛选的 AI、开发者工具与科技产业信号，保留来源、趋势依据与原文链接。',
      }
    : {
        title: 'Tech Signal — Nathan Shan’s daily technology brief',
        description: 'A daily, source-linked signal desk covering AI, developer tools, and the technology business.',
      })
})

const safeHttpsUrl = (value: unknown) => {
  if (typeof value !== 'string') return ''
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' ? parsed.toString() : ''
  } catch {
    return ''
  }
}

const normalizePayload = (data: unknown): NewsPayload => {
  if (!data || typeof data !== 'object') return { updatedAt: '', date: '', sections: [] }
  const record = data as Record<string, unknown>
  const rawSections = Array.isArray(record.sections) ? record.sections : []
  const sections = rawSections.flatMap((rawSection): NewsSection[] => {
    if (!rawSection || typeof rawSection !== 'object') return []
    const section = rawSection as Record<string, unknown>
    const name = typeof section.name === 'string' ? section.name.trim() : ''
    if (!name) return []

    const items = (Array.isArray(section.items) ? section.items : []).flatMap((rawItem): NewsItem[] => {
      if (!rawItem || typeof rawItem !== 'object') return []
      const item = rawItem as Record<string, unknown>
      const title = typeof item.title === 'string' ? item.title.trim() : ''
      const url = safeHttpsUrl(item.url)
      if (!title || !url) return []
      return [{
        title,
        url,
        summary: typeof item.summary === 'string' ? item.summary.trim() : '',
        source: typeof item.source === 'string' ? item.source.trim() : name,
        score: typeof item.score === 'number' && Number.isFinite(item.score) ? item.score : undefined,
        reasons: Array.isArray(item.reasons)
          ? item.reasons.filter((reason): reason is string => typeof reason === 'string' && reason.trim().length > 0)
          : [],
        published: typeof item.published === 'string' ? item.published : '',
      }]
    })

    return [{
      name,
      source: safeHttpsUrl(section.source),
      items,
    }]
  })

  return {
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : '',
    date: typeof record.date === 'string' ? record.date : '',
    sections,
  }
}

const loadNews = async () => {
  status.value = 'loading'
  try {
    const response = await fetch('/tech-news/latest.json', { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    payload.value = normalizePayload(await response.json())
    status.value = payload.value.sections.some((section) => section.items.length) ? 'ready' : 'empty'
  } catch {
    status.value = 'error'
  }
}

onMounted(loadNews)

const allItems = computed<RankedNewsItem[]>(() => payload.value.sections
  .flatMap((section) => section.items.map((item) => ({
    ...item,
    sectionName: section.name,
    sectionSource: section.source,
  })))
  .sort((left, right) => (right.score ?? 0) - (left.score ?? 0)))

const filteredItems = computed(() => activeSource.value === 'all'
  ? allItems.value
  : allItems.value.filter((item) => item.sectionName === activeSource.value))

const leadItem = computed(() => filteredItems.value[0])
const streamItems = computed(() => filteredItems.value.slice(1))
const traceItems = computed(() => allItems.value.slice(0, 8))
const maxScore = computed(() => Math.max(...allItems.value.map((item) => item.score ?? 0), 1))

const tracePoints = computed(() => {
  const items = traceItems.value
  if (!items.length) return ''
  return items.map((item, index) => {
    const x = items.length === 1 ? 300 : 22 + (index * 556) / (items.length - 1)
    const y = 140 - ((item.score ?? 0) / maxScore.value) * 108
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
})

const pointPosition = (item: RankedNewsItem, index: number) => {
  const count = traceItems.value.length
  const left = count === 1 ? 50 : 3.67 + (index * 92.66) / (count - 1)
  const top = 87.5 - ((item.score ?? 0) / maxScore.value) * 67.5
  return { left: `${left}%`, top: `${top}%` }
}

const sourceLabel = (name: string) => currentLanguage.value === 'en' && name === 'AI资讯' ? 'AI Digest' : name

const displayDate = (value?: string, withTime = false) => {
  if (!value) return '—'
  const isoDate = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  if (!isoDate) return value
  const parsed = new Date(withTime ? value.replace(/…$/, '') : `${isoDate}T00:00:00+08:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return new Intl.DateTimeFormat(currentLanguage.value === 'zh' ? 'zh-CN' : 'en-US', {
    timeZone: 'Asia/Shanghai',
    month: 'short',
    day: '2-digit',
    ...(withTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
  }).format(parsed)
}

const todayInBeijing = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date())

const isFresh = computed(() => payload.value.date === todayInBeijing())
const scoreWidth = (score?: number) => `${Math.max(8, Math.min(100, ((score ?? 0) / maxScore.value) * 100))}%`
const itemReasons = (item: NewsItem) => item.reasons?.join(' · ') ?? ''
</script>

<template>
  <main class="signal-page">
    <header class="signal-hero">
      <div class="shell">
        <RouterLink class="signal-back" to="/">← {{ copy.back }}</RouterLink>

        <div class="signal-hero__grid">
          <div class="signal-thesis">
            <p class="signal-kicker">{{ copy.kicker }}</p>
            <h1>
              <span>{{ copy.titleLead }}</span>
              <strong>{{ copy.titleAccent }}</strong>
            </h1>
            <p class="signal-intro">{{ copy.intro }}</p>

            <dl class="signal-facts">
              <div>
                <dt>{{ isFresh ? copy.fresh : copy.stale }}</dt>
                <dd>{{ displayDate(payload.date) }}</dd>
              </div>
              <div>
                <dt>{{ copy.sources }}</dt>
                <dd>{{ payload.sections.length }}</dd>
              </div>
              <div>
                <dt>{{ copy.signals }}</dt>
                <dd>{{ allItems.length }}</dd>
              </div>
            </dl>
          </div>

          <aside class="signal-trace" :aria-label="copy.trace">
            <header>
              <div>
                <span class="trace-live"><i></i>{{ isFresh ? copy.fresh : copy.stale }}</span>
                <h2>{{ copy.trace }}</h2>
              </div>
              <p>{{ copy.traceHint }}</p>
            </header>

            <div class="trace-plot" aria-hidden="true">
              <svg viewBox="0 0 600 160" preserveAspectRatio="none">
                <line x1="0" y1="36" x2="600" y2="36" />
                <line x1="0" y1="86" x2="600" y2="86" />
                <line x1="0" y1="136" x2="600" y2="136" />
                <polyline v-if="tracePoints" :points="tracePoints" />
              </svg>
              <span
                v-for="(item, index) in traceItems"
                :key="item.url"
                class="trace-point"
                :style="pointPosition(item, index)"
              ></span>
            </div>

            <ol class="trace-labels">
              <li v-for="(item, index) in traceItems" :key="item.url">
                <span>{{ String(index + 1).padStart(2, '0') }}</span>
                <b>{{ item.score?.toFixed(1) ?? '—' }}</b>
              </li>
            </ol>

            <footer>
              <span>{{ copy.updated }} · {{ displayDate(payload.updatedAt, true) }}</span>
              <span>{{ copy.cadence }}</span>
            </footer>
          </aside>
        </div>
      </div>
    </header>

    <section class="signal-feed" aria-labelledby="signal-feed-title">
      <div class="shell signal-feed__shell">
        <aside class="source-rail">
          <div class="source-rail__sticky">
            <p class="mono-label">{{ copy.filter }}</p>
            <nav aria-label="News sources">
              <button
                type="button"
                :class="{ active: activeSource === 'all' }"
                :aria-pressed="activeSource === 'all'"
                @click="activeSource = 'all'"
              >
                <span>{{ copy.all }}</span>
                <b>{{ allItems.length }}</b>
              </button>
              <button
                v-for="section in payload.sections"
                :key="section.name"
                type="button"
                :class="{ active: activeSource === section.name }"
                :aria-pressed="activeSource === section.name"
                @click="activeSource = section.name"
              >
                <span>{{ sourceLabel(section.name) }}</span>
                <b>{{ section.items.length }}</b>
              </button>
            </nav>

            <div class="source-rail__note">
              <p>{{ copy.updated }}</p>
              <time :datetime="payload.updatedAt">{{ displayDate(payload.updatedAt, true) }}</time>
              <span>{{ copy.cadence }}</span>
            </div>
          </div>
        </aside>

        <div class="signal-river">
          <div class="signal-river__heading">
            <p class="mono-label">{{ copy.feed }}</p>
            <h2 id="signal-feed-title">{{ activeSource === 'all' ? copy.all : sourceLabel(activeSource) }}</h2>
          </div>

          <div v-if="status === 'loading'" class="signal-state" role="status">{{ copy.loading }}</div>
          <div v-else-if="status === 'empty'" class="signal-state">{{ copy.empty }}</div>
          <div v-else-if="status === 'error'" class="signal-state signal-state--error" role="alert">
            <p>{{ copy.error }}</p>
            <button type="button" @click="loadNews">{{ copy.retry }}</button>
          </div>

          <template v-else-if="leadItem">
            <article class="lead-signal">
              <div class="lead-signal__copy">
                <div class="signal-meta">
                  <span>{{ copy.lead }}</span>
                  <span>{{ sourceLabel(leadItem.sectionName) }}</span>
                  <time :datetime="leadItem.published">{{ displayDate(leadItem.published) }}</time>
                </div>
                <h3>
                  <a :href="leadItem.url" target="_blank" rel="noopener noreferrer">{{ leadItem.title }}</a>
                </h3>
                <p>{{ leadItem.summary }}</p>
                <div class="lead-signal__footer">
                  <a :href="leadItem.url" target="_blank" rel="noopener noreferrer">{{ copy.open }} ↗</a>
                  <a
                    v-if="leadItem.sectionSource"
                    :href="leadItem.sectionSource"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ copy.sourcePage }} ↗</a>
                </div>
              </div>

              <div class="lead-score" :aria-label="`${copy.score}: ${leadItem.score ?? '—'}`">
                <span>{{ copy.score }}</span>
                <strong>{{ leadItem.score?.toFixed(2) ?? '—' }}</strong>
                <i><b :style="{ width: scoreWidth(leadItem.score) }"></b></i>
                <p v-if="itemReasons(leadItem)">{{ itemReasons(leadItem) }}</p>
              </div>
            </article>

            <div class="signal-list">
              <article v-for="(item, index) in streamItems" :key="item.url" class="signal-row">
                <div class="signal-row__index">
                  <b>{{ String(index + 2).padStart(2, '0') }}</b>
                  <span>{{ sourceLabel(item.sectionName) }}</span>
                  <time :datetime="item.published">{{ displayDate(item.published) }}</time>
                </div>

                <div class="signal-row__copy">
                  <h3><a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></h3>
                  <p>{{ item.summary }}</p>
                  <p v-if="itemReasons(item)" class="signal-reasons"><span>{{ copy.why }}</span>{{ itemReasons(item) }}</p>
                </div>

                <a class="signal-row__score" :href="item.url" target="_blank" rel="noopener noreferrer" :aria-label="`${copy.open}: ${item.title}`">
                  <span>{{ copy.score }}</span>
                  <strong>{{ item.score?.toFixed(2) ?? '—' }}</strong>
                  <i><b :style="{ width: scoreWidth(item.score) }"></b></i>
                  <em aria-hidden="true">↗</em>
                </a>
              </article>
            </div>
          </template>
        </div>
      </div>
    </section>

    <section class="signal-method" aria-labelledby="signal-method-title">
      <div class="shell signal-method__grid">
        <p class="mono-label">{{ copy.method }}</p>
        <div>
          <h2 id="signal-method-title">{{ copy.methodTitle }}</h2>
          <p>{{ copy.methodBody }}</p>
          <ul>
            <li v-for="tag in copy.methodTags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.signal-page {
  --signal: #e13f67;
  --signal-deep: #9e183b;
  --signal-soft: #ffe8ef;
  --signal-violet: #635bdb;
  --signal-console: #0c1420;
  --signal-console-line: #263548;
  padding-top: 72px;
}

:global(html[data-theme='dark']) .signal-page {
  --signal: #ff6f91;
  --signal-deep: #ff9bb2;
  --signal-soft: #3a1724;
  --signal-violet: #a69cff;
  --signal-console: #070d14;
  --signal-console-line: #243245;
}

.signal-hero {
  position: relative;
  padding: 54px 0 78px;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
}

.signal-hero::before {
  position: absolute;
  top: 0;
  right: max(24px, calc((100vw - 1180px) / 2));
  width: 136px;
  height: 5px;
  background: linear-gradient(90deg, var(--signal), var(--signal-violet));
  content: '';
}

.signal-back {
  display: inline-block;
  margin-bottom: 68px;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.72rem;
  text-underline-offset: 4px;
}

.signal-back:hover {
  color: var(--signal);
}

.signal-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(430px, 0.92fr);
  gap: clamp(52px, 8vw, 112px);
  align-items: end;
}

.signal-kicker {
  margin-bottom: 24px;
  color: var(--signal);
  font-family: var(--mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.signal-thesis h1 {
  max-width: 780px;
  margin-bottom: 32px;
  font-size: clamp(3.25rem, 6.1vw, 6.9rem);
  letter-spacing: -0.067em;
  line-height: 0.89;
}

.signal-thesis h1 span,
.signal-thesis h1 strong {
  display: block;
}

.signal-thesis h1 strong {
  margin-top: 0.15em;
  color: var(--signal);
  font-weight: 600;
}

.signal-intro {
  max-width: 680px;
  margin-bottom: 38px;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.75;
}

.signal-facts {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  margin: 0;
  border-top: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line);
}

.signal-facts div {
  padding: 15px 16px;
  border-right: 1px solid var(--line);
}

.signal-facts div:first-child {
  padding-left: 0;
}

.signal-facts div:last-child {
  border-right: 0;
}

.signal-facts dt {
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.61rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.signal-facts dd {
  margin: 4px 0 0;
  font-family: var(--display);
  font-size: 1.15rem;
  font-weight: 600;
}

.signal-trace {
  color: #eaf0f8;
  background: var(--signal-console);
  box-shadow: 12px 12px 0 var(--signal);
}

.signal-trace > header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 22px;
  padding: 20px 22px 17px;
  border-bottom: 1px solid var(--signal-console-line);
}

.signal-trace h2 {
  margin: 7px 0 0;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}

.signal-trace header p {
  max-width: 170px;
  margin: 0;
  color: #7f8ea2;
  font-family: var(--mono);
  font-size: 0.58rem;
  line-height: 1.5;
  text-align: right;
  text-transform: uppercase;
}

.trace-live {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  color: #aeb9c8;
  font-family: var(--mono);
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.trace-live i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--signal);
  box-shadow: 0 0 0 4px rgba(225, 63, 103, 0.16);
}

.trace-plot {
  position: relative;
  height: 184px;
  margin: 10px 18px 0;
}

.trace-plot svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.trace-plot line {
  stroke: var(--signal-console-line);
  stroke-width: 1;
  stroke-dasharray: 3 8;
}

.trace-plot polyline {
  fill: none;
  stroke: var(--signal);
  stroke-linecap: square;
  stroke-linejoin: miter;
  stroke-width: 3;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 900;
  animation: trace-draw 900ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.trace-point {
  position: absolute;
  width: 9px;
  height: 9px;
  border: 2px solid var(--signal-console);
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 0 2px var(--signal);
  transform: translate(-50%, -50%);
}

.trace-labels {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  padding: 0 18px;
  margin: -5px 0 20px;
  list-style: none;
}

.trace-labels li {
  display: grid;
  justify-items: center;
  border-right: 1px solid var(--signal-console-line);
  font-family: var(--mono);
}

.trace-labels li:last-child {
  border-right: 0;
}

.trace-labels span {
  color: #68778c;
  font-size: 0.54rem;
}

.trace-labels b {
  color: #d9e2ed;
  font-size: 0.66rem;
  font-weight: 500;
}

.signal-trace footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  border-top: 1px solid var(--signal-console-line);
  color: #77869a;
  font-family: var(--mono);
  font-size: 0.56rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

@keyframes trace-draw {
  from { stroke-dashoffset: 900; }
  to { stroke-dashoffset: 0; }
}

.signal-feed {
  background: var(--surface);
}

.signal-feed__shell {
  display: grid;
  grid-template-columns: minmax(205px, 0.42fr) minmax(0, 1.58fr);
  gap: clamp(54px, 8vw, 112px);
}

.source-rail {
  position: relative;
  border-right: 1px solid var(--line);
}

.source-rail__sticky {
  position: sticky;
  top: 96px;
  padding: 82px 38px 82px 0;
}

.source-rail .mono-label,
.signal-river .mono-label,
.signal-method .mono-label {
  color: var(--signal);
}

.source-rail nav {
  display: grid;
  margin-top: 25px;
  border-top: 1px solid var(--line-strong);
}

.source-rail button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
  padding: 13px 0;
  border: 0;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.7rem;
  text-align: left;
}

.source-rail button b {
  min-width: 28px;
  color: var(--quiet);
  font-weight: 500;
  text-align: right;
}

.source-rail button:hover,
.source-rail button.active {
  color: var(--signal);
}

.source-rail button.active span::before {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 9px;
  border-radius: 50%;
  background: currentColor;
  content: '';
}

.source-rail__note {
  display: grid;
  gap: 4px;
  margin-top: 48px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.6rem;
}

.source-rail__note p {
  margin: 0;
  color: var(--muted);
  text-transform: uppercase;
}

.source-rail__note time {
  color: var(--ink);
}

.signal-river {
  min-width: 0;
  padding: 82px 0 94px;
}

.signal-river__heading {
  margin-bottom: 36px;
}

.signal-river__heading h2 {
  margin: 9px 0 0;
  font-size: clamp(2.1rem, 4vw, 4rem);
  line-height: 1;
}

.signal-state {
  padding: 32px;
  border: 1px dashed var(--line-strong);
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.78rem;
}

.signal-state p {
  margin-bottom: 18px;
}

.signal-state button {
  padding: 8px 12px;
  border: 1px solid var(--ink);
  color: var(--surface);
  background: var(--ink);
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.7rem;
}

.lead-signal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  border-top: 4px solid var(--signal);
  border-bottom: 1px solid var(--line-strong);
  background: linear-gradient(135deg, var(--signal-soft), transparent 58%);
}

.lead-signal__copy {
  padding: clamp(28px, 4vw, 48px) clamp(24px, 4vw, 46px);
}

.signal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 9px 16px;
  margin-bottom: 22px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.signal-meta span:first-child {
  color: var(--signal-deep);
  font-weight: 600;
}

.lead-signal h3 {
  max-width: 760px;
  margin-bottom: 20px;
  font-size: clamp(1.8rem, 3.5vw, 3.2rem);
  line-height: 1.04;
}

.lead-signal h3 a,
.signal-row h3 a {
  text-decoration: none;
}

.lead-signal h3 a:hover,
.signal-row h3 a:hover {
  color: var(--signal);
}

.lead-signal__copy > p {
  max-width: 740px;
  margin-bottom: 28px;
  color: var(--muted);
}

.lead-signal__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.lead-signal__footer a {
  color: var(--ink);
  font-family: var(--mono);
  font-size: 0.7rem;
  font-weight: 600;
  text-underline-offset: 4px;
}

.lead-signal__footer a:hover {
  color: var(--signal);
}

.lead-score {
  display: grid;
  align-content: start;
  padding: 34px 24px;
  border-left: 1px solid var(--line);
}

.lead-score > span,
.signal-row__score > span {
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.57rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lead-score strong {
  margin: 7px 0 16px;
  color: var(--signal-deep);
  font-family: var(--display);
  font-size: 3.35rem;
  line-height: 1;
}

.lead-score i,
.signal-row__score i {
  display: block;
  height: 3px;
  background: var(--line);
}

.lead-score i b,
.signal-row__score i b {
  display: block;
  height: 100%;
  background: var(--signal);
}

.lead-score p {
  margin: 18px 0 0;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.62rem;
  line-height: 1.55;
}

.signal-list {
  border-bottom: 1px solid var(--line-strong);
}

.signal-row {
  display: grid;
  grid-template-columns: 122px minmax(0, 1fr) 116px;
  gap: 30px;
  padding: 33px 0;
  border-bottom: 1px solid var(--line);
}

.signal-row:last-child {
  border-bottom: 0;
}

.signal-row__index {
  display: grid;
  align-content: start;
  gap: 7px;
  font-family: var(--mono);
}

.signal-row__index b {
  color: var(--signal);
  font-size: 1.35rem;
  line-height: 1;
}

.signal-row__index span,
.signal-row__index time {
  color: var(--quiet);
  font-size: 0.6rem;
}

.signal-row__copy h3 {
  margin-bottom: 12px;
  font-size: clamp(1.18rem, 2vw, 1.55rem);
  line-height: 1.18;
}

.signal-row__copy > p:not(.signal-reasons) {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.65;
}

.signal-reasons {
  margin: 14px 0 0;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.61rem;
}

.signal-reasons span {
  margin-right: 10px;
  color: var(--signal-deep);
  font-weight: 600;
}

.signal-row__score {
  display: grid;
  align-content: start;
  gap: 8px;
  color: var(--ink);
  text-decoration: none;
}

.signal-row__score strong {
  font-family: var(--display);
  font-size: 1.45rem;
  line-height: 1;
}

.signal-row__score em {
  justify-self: end;
  margin-top: 7px;
  color: var(--quiet);
  font-style: normal;
  transition: color 150ms ease, transform 150ms ease;
}

.signal-row__score:hover em {
  color: var(--signal);
  transform: translate(3px, -3px);
}

.signal-method {
  padding: 88px 0 96px;
  border-top: 1px solid var(--line);
  background: var(--paper-deep);
}

.signal-method__grid {
  display: grid;
  grid-template-columns: minmax(200px, 0.42fr) minmax(0, 1.58fr);
  gap: clamp(54px, 8vw, 112px);
}

.signal-method h2 {
  max-width: 780px;
  margin-bottom: 20px;
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 1.02;
}

.signal-method div > p {
  max-width: 720px;
  color: var(--muted);
}

.signal-method ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 30px 0 0;
  list-style: none;
}

.signal-method li {
  padding: 7px 10px;
  border: 1px solid var(--line-strong);
  color: var(--muted);
  background: var(--surface-soft);
  font-family: var(--mono);
  font-size: 0.66rem;
}

@media (max-width: 1040px) {
  .signal-hero__grid {
    grid-template-columns: 1fr;
  }

  .signal-trace {
    max-width: 720px;
  }

  .signal-feed__shell,
  .signal-method__grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .source-rail {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .source-rail__sticky {
    position: static;
    padding: 52px 0 34px;
  }

  .source-rail nav {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .source-rail button {
    padding: 12px;
    border-right: 1px solid var(--line);
  }

  .source-rail__note {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    margin-top: 24px;
  }
}

@media (max-width: 720px) {
  .signal-hero {
    padding-top: 38px;
  }

  .signal-back {
    margin-bottom: 48px;
  }

  .signal-thesis h1 {
    font-size: clamp(3rem, 15vw, 5rem);
  }

  .signal-facts {
    grid-template-columns: 1fr 1fr;
  }

  .signal-facts div:first-child {
    grid-column: 1 / -1;
    padding-left: 0;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .signal-facts div:nth-child(2) {
    padding-left: 0;
  }

  .signal-trace > header,
  .signal-trace footer {
    align-items: start;
    flex-direction: column;
  }

  .signal-trace header p {
    max-width: none;
    text-align: left;
  }

  .trace-plot {
    height: 150px;
  }

  .trace-labels li:nth-child(even) span {
    visibility: hidden;
  }

  .source-rail nav {
    grid-template-columns: 1fr 1fr;
  }

  .signal-river {
    padding-top: 62px;
  }

  .lead-signal {
    grid-template-columns: 1fr;
  }

  .lead-score {
    grid-template-columns: auto 1fr;
    gap: 12px 18px;
    border-top: 1px solid var(--line);
    border-left: 0;
  }

  .lead-score strong {
    margin: 0;
    font-size: 2rem;
    text-align: right;
  }

  .lead-score i,
  .lead-score p {
    grid-column: 1 / -1;
  }

  .signal-row {
    grid-template-columns: 78px minmax(0, 1fr);
    gap: 20px;
  }

  .signal-row__score {
    grid-column: 2;
    grid-template-columns: auto 1fr auto;
    align-items: center;
  }

  .signal-row__score i {
    min-width: 80px;
  }

  .signal-row__score em {
    margin: 0;
  }
}
</style>

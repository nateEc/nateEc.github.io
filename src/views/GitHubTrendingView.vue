<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { setPageMeta } from '../composables/usePageMeta'

type Repository = { rank: number; fullName: string; description: string; language: string; languageColor: string; starsToday: number; totalStars: number; forks: number; url: string }
type Language = { name: string; count: number; share: number; color: string }
type Theme = { name: string; count: number; repositories: string[] }
type RadarPayload = { updatedAt: string; date: string; source: string; repositories: Repository[]; languages: Language[]; themes: Theme[] }

const emptyPayload = (): RadarPayload => ({ updatedAt: '', date: '', source: '', repositories: [], languages: [], themes: [] })
const { currentLanguage } = useLanguage()
const payload = ref<RadarPayload>(emptyPayload())
const status = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const language = ref('all')
const activeRepo = ref(0)

const copy = computed(() => currentLanguage.value === 'zh' ? {
  back: '返回作品集', desk: 'Tech Signal', radar: 'Repository Radar', kicker: 'NATHAN’S SIGNAL DESK · OPEN SOURCE',
  titleLead: '今天，代码世界的', titleAccent: '引力正落向哪里？', intro: '每天观察 GitHub Trending。排名告诉我注意力在哪里，语言和主题告诉我开发者正在为什么下注。',
  fresh: '今日雷达', stale: '最近快照', repos: '仓库', stars: '今日新增 stars', languages: '种语言', orbit: '趋势轨道', orbitHint: '轨道长度对应今日 star 增量', updated: '采样时间', cadence: '每日 14:30 · 北京时间',
  all: '全部', filter: '语言频谱', ranking: '今日前十', open: '查看仓库', total: '累计 stars', forks: 'forks', today: '今日', themes: '注意力聚类', themesTitle: '热度之外，开发者在反复解决什么？', source: '查看 GitHub Trending',
  loading: '正在校准今日雷达…', empty: '今天还没有可展示的趋势仓库。', error: '趋势快照暂时不可用。', retry: '重新读取', unknown: '未标注',
} : {
  back: 'Back to portfolio', desk: 'Tech Signal', radar: 'Repository Radar', kicker: 'NATHAN’S SIGNAL DESK · OPEN SOURCE',
  titleLead: 'Where is gravity', titleAccent: 'pulling code today?', intro: 'A daily read of GitHub Trending. Rank shows where attention lands; language and themes reveal what developers are betting on.',
  fresh: 'Today’s radar', stale: 'Latest snapshot', repos: 'repositories', stars: 'stars gained today', languages: 'languages', orbit: 'Momentum orbit', orbitHint: 'lane length maps today’s star gain', updated: 'Sampled', cadence: 'Daily at 14:30 · Beijing time',
  all: 'All', filter: 'Language spectrum', ranking: 'Today’s top ten', open: 'Open repository', total: 'total stars', forks: 'forks', today: 'today', themes: 'Attention clusters', themesTitle: 'Beyond velocity, what are builders solving repeatedly?', source: 'Open GitHub Trending',
  loading: 'Calibrating today’s radar…', empty: 'No trending repositories are available today.', error: 'The radar snapshot is temporarily unavailable.', retry: 'Read again', unknown: 'Unknown',
})

watchEffect(() => setPageMeta(currentLanguage.value === 'zh' ? {
  title: 'Repository Radar — Nathan Shan 的 GitHub 趋势雷达', description: '每日更新的 GitHub Trending 前十仓库、语言频谱与开发者注意力聚类。',
} : {
  title: 'Repository Radar — Nathan Shan’s GitHub trend watch', description: 'A daily view of GitHub Trending: top repositories, language spectrum, and developer attention clusters.',
}))

const safeUrl = (value: unknown) => {
  if (typeof value !== 'string') return ''
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'github.com' ? url.toString() : '' } catch { return '' }
}

const normalize = (raw: unknown): RadarPayload => {
  if (!raw || typeof raw !== 'object') return emptyPayload()
  const record = raw as Record<string, unknown>
  const repositories = (Array.isArray(record.repositories) ? record.repositories : []).flatMap((entry): Repository[] => {
    if (!entry || typeof entry !== 'object') return []
    const repo = entry as Record<string, unknown>; const fullName = typeof repo.fullName === 'string' ? repo.fullName.trim() : ''; const url = safeUrl(repo.url)
    if (!fullName || !url) return []
    return [{ rank: typeof repo.rank === 'number' ? repo.rank : 0, fullName, description: typeof repo.description === 'string' ? repo.description.trim() : '', language: typeof repo.language === 'string' && repo.language ? repo.language : 'Unknown', languageColor: typeof repo.languageColor === 'string' ? repo.languageColor : '#8B949E', starsToday: typeof repo.starsToday === 'number' ? Math.max(0, repo.starsToday) : 0, totalStars: typeof repo.totalStars === 'number' ? Math.max(0, repo.totalStars) : 0, forks: typeof repo.forks === 'number' ? Math.max(0, repo.forks) : 0, url }]
  })
  return { updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : '', date: typeof record.date === 'string' ? record.date : '', source: safeUrl(record.source), repositories, languages: Array.isArray(record.languages) ? record.languages.filter((item): item is Language => Boolean(item && typeof item === 'object' && typeof (item as Language).name === 'string')) : [], themes: Array.isArray(record.themes) ? record.themes.filter((item): item is Theme => Boolean(item && typeof item === 'object' && typeof (item as Theme).name === 'string')) : [] }
}

const loadRadar = async () => {
  status.value = 'loading'
  try { const response = await fetch('/tech-news/github-trending.json', { cache: 'no-store' }); if (!response.ok) throw new Error(`HTTP ${response.status}`); payload.value = normalize(await response.json()); status.value = payload.value.repositories.length ? 'ready' : 'empty' } catch { status.value = 'error' }
}
onMounted(loadRadar)

const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
const isFresh = computed(() => payload.value.date === today())
const filteredRepos = computed(() => language.value === 'all' ? payload.value.repositories : payload.value.repositories.filter((repo) => repo.language === language.value))
const activeRepository = computed(() => payload.value.repositories[activeRepo.value])
const maxStars = computed(() => Math.max(...payload.value.repositories.map((repo) => repo.starsToday), 1))
const totalStarsToday = computed(() => payload.value.repositories.reduce((sum, repo) => sum + repo.starsToday, 0))
const orbitWidth = (stars: number) => `${Math.max(7, (stars / maxStars.value) * 100)}%`
const formatNumber = (value: number) => new Intl.NumberFormat(currentLanguage.value === 'zh' ? 'zh-CN' : 'en-US', { notation: value >= 10_000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value)
const displayDate = (value: string, time = false) => { if (!value) return '—'; const parsed = new Date(time ? value : `${value.slice(0, 10)}T00:00:00+08:00`); if (Number.isNaN(parsed.getTime())) return value; return new Intl.DateTimeFormat(currentLanguage.value === 'zh' ? 'zh-CN' : 'en-US', { timeZone: 'Asia/Shanghai', month: 'short', day: '2-digit', ...(time ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}) }).format(parsed) }
const themeName = (name: string) => currentLanguage.value === 'zh' ? ({ 'Agent systems': 'Agent 系统', 'Developer tools': '开发者工具', 'AI infrastructure': 'AI 基础设施', 'Data & systems': '数据与系统', Security: '安全' }[name] ?? name) : name
</script>

<template>
  <main class="radar-page">
    <header class="radar-hero">
      <div class="shell">
        <RouterLink class="radar-back" to="/">← {{ copy.back }}</RouterLink>
        <nav class="signal-switcher" aria-label="Signal desk sections"><RouterLink to="/tech-news">{{ copy.desk }}</RouterLink><RouterLink class="is-current" to="/tech-news/github" aria-current="page">{{ copy.radar }}</RouterLink></nav>
        <div class="radar-hero__grid">
          <div class="radar-thesis">
            <p class="radar-kicker">{{ copy.kicker }}</p><h1><span>{{ copy.titleLead }}</span><strong>{{ copy.titleAccent }}</strong></h1><p class="radar-intro">{{ copy.intro }}</p>
            <dl class="radar-facts"><div><dt>{{ isFresh ? copy.fresh : copy.stale }}</dt><dd>{{ displayDate(payload.date) }}</dd></div><div><dt>{{ copy.repos }}</dt><dd>{{ payload.repositories.length }}</dd></div><div><dt>{{ copy.stars }}</dt><dd>+{{ formatNumber(totalStarsToday) }}</dd></div><div><dt>{{ copy.languages }}</dt><dd>{{ payload.languages.length }}</dd></div></dl>
          </div>
          <aside class="orbit-console" :aria-label="copy.orbit">
            <header><div><span class="radar-live"><i></i>{{ isFresh ? copy.fresh : copy.stale }}</span><h2>{{ copy.orbit }}</h2></div><p>{{ copy.orbitHint }}</p></header>
            <ol class="orbit-list"><li v-for="(repo, index) in payload.repositories" :key="repo.fullName" :class="{ active: activeRepo === index }" @mouseenter="activeRepo = index"><button type="button" :aria-label="repo.fullName" :aria-pressed="activeRepo === index" @focus="activeRepo = index" @click="activeRepo = index"><span>{{ String(repo.rank).padStart(2, '0') }}</span><i><b :style="{ width: orbitWidth(repo.starsToday), '--repo-color': repo.languageColor }"></b></i><strong>+{{ formatNumber(repo.starsToday) }}</strong></button></li></ol>
            <footer v-if="activeRepository"><span :style="{ '--repo-color': activeRepository.languageColor }"><i></i>{{ activeRepository.language }}</span><strong>{{ activeRepository.fullName }}</strong></footer>
          </aside>
        </div>
      </div>
    </header>

    <section class="radar-board" aria-labelledby="ranking-title"><div class="shell radar-board__grid">
      <aside class="spectrum"><div class="spectrum__sticky"><p class="mono-label">{{ copy.filter }}</p><button type="button" :class="{ active: language === 'all' }" :aria-pressed="language === 'all'" @click="language = 'all'"><span>{{ copy.all }}</span><b>{{ payload.repositories.length }}</b></button><button v-for="item in payload.languages" :key="item.name" type="button" :class="{ active: language === item.name }" :aria-pressed="language === item.name" @click="language = item.name"><span><i :style="{ background: item.color }"></i>{{ item.name === 'Unknown' ? copy.unknown : item.name }}</span><b>{{ item.share }}%</b></button><div class="spectrum__note"><span>{{ copy.updated }}</span><time :datetime="payload.updatedAt">{{ displayDate(payload.updatedAt, true) }}</time><small>{{ copy.cadence }}</small></div></div></aside>
      <div class="repo-river"><header><p class="mono-label">{{ copy.ranking }}</p><h2 id="ranking-title">{{ language === 'all' ? copy.ranking : language }}</h2></header><div v-if="status === 'loading'" class="radar-state" role="status">{{ copy.loading }}</div><div v-else-if="status === 'empty'" class="radar-state">{{ copy.empty }}</div><div v-else-if="status === 'error'" class="radar-state" role="alert"><p>{{ copy.error }}</p><button type="button" @click="loadRadar">{{ copy.retry }}</button></div>
        <ol v-else class="repo-list"><li v-for="repo in filteredRepos" :key="repo.fullName"><article class="repo-card"><div class="repo-rank"><span>RANK</span><strong>{{ String(repo.rank).padStart(2, '0') }}</strong></div><div class="repo-copy"><p><span :style="{ background: repo.languageColor }"></span>{{ repo.language === 'Unknown' ? copy.unknown : repo.language }}</p><h3><a :href="repo.url" target="_blank" rel="noopener noreferrer">{{ repo.fullName }}</a></h3><p class="repo-description">{{ repo.description || '—' }}</p><a class="repo-open" :href="repo.url" target="_blank" rel="noopener noreferrer">{{ copy.open }} ↗</a></div><dl class="repo-metrics"><div class="repo-metrics__today"><dt>{{ copy.today }}</dt><dd>+{{ formatNumber(repo.starsToday) }}</dd></div><div><dt>{{ copy.total }}</dt><dd>{{ formatNumber(repo.totalStars) }}</dd></div><div><dt>{{ copy.forks }}</dt><dd>{{ formatNumber(repo.forks) }}</dd></div></dl></article></li></ol>
      </div>
    </div></section>

    <section class="attention" aria-labelledby="attention-title"><div class="shell attention__grid"><div><p class="mono-label">{{ copy.themes }}</p><h2 id="attention-title">{{ copy.themesTitle }}</h2></div><ol><li v-for="(theme, index) in payload.themes" :key="theme.name"><span>{{ String(index + 1).padStart(2, '0') }}</span><div><h3>{{ themeName(theme.name) }}</h3><p>{{ theme.repositories.join(' · ') }}</p></div><strong>{{ theme.count }}/{{ payload.repositories.length }}</strong></li></ol><a v-if="payload.source" :href="payload.source" target="_blank" rel="noopener noreferrer">{{ copy.source }} ↗</a></div></section>
  </main>
</template>

<style scoped>
.radar-page { --radar: #3155d9; --radar-hot: #f06449; --radar-violet: #7961d8; --radar-soft: #e9edff; --console: #10131c; --console-line: #2a3040; padding-top: 72px; }
:global(html[data-theme='dark'] .radar-page) { --radar: #8ea6ff; --radar-hot: #ff8c73; --radar-violet: #b7a9ff; --radar-soft: #202947; --console: #090b10; --console-line: #293044; }
.radar-hero { position: relative; padding: 38px 0 80px; overflow: hidden; border-bottom: 1px solid var(--line); }.radar-hero::before { position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--radar) 0 38%, transparent 38% 42%, var(--radar-hot) 42% 61%, transparent 61%); content: ''; }
.radar-back { display: inline-block; margin: 16px 0 28px; color: var(--muted); font: .7rem var(--mono); text-underline-offset: 4px; }.signal-switcher { display: inline-flex; gap: 6px; margin-left: 28px; padding: 4px; border: 1px solid var(--line); border-radius: 999px; }.signal-switcher a { padding: 7px 12px; border-radius: 999px; color: var(--muted); font: .62rem var(--mono); text-decoration: none; }.signal-switcher a.is-current { color: white; background: var(--radar); }
.radar-hero__grid { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(430px, .92fr); gap: clamp(54px, 8vw, 110px); align-items: end; margin-top: 44px; }.radar-kicker { margin: 0 0 22px; color: var(--radar); font: 600 .68rem var(--mono); letter-spacing: .12em; }.radar-thesis h1 { max-width: 780px; margin: 0 0 28px; font-size: clamp(3.2rem, 6vw, 6.8rem); letter-spacing: -.066em; line-height: .88; }.radar-thesis h1 span, .radar-thesis h1 strong { display: block; }.radar-thesis h1 strong { margin-top: .16em; color: var(--radar); font-weight: 600; }.radar-intro { max-width: 650px; margin: 0 0 34px; color: var(--muted); font-size: 1.02rem; line-height: 1.72; }
.radar-facts { display: grid; grid-template-columns: 1.2fr .7fr 1.1fr .7fr; margin: 0; border-block: 1px solid var(--line); }.radar-facts div { padding: 14px; border-right: 1px solid var(--line); }.radar-facts div:first-child { padding-left: 0; }.radar-facts div:last-child { border: 0; }.radar-facts dt { color: var(--quiet); font: .58rem var(--mono); text-transform: uppercase; }.radar-facts dd { margin: 5px 0 0; font-family: var(--display); font-size: 1.08rem; font-weight: 650; }
.orbit-console { color: #edf1ff; background: var(--console); box-shadow: 11px 11px 0 var(--radar-hot); }.orbit-console > header { display: flex; justify-content: space-between; gap: 20px; padding: 18px 20px; border-bottom: 1px solid var(--console-line); }.orbit-console h2 { margin: 6px 0 0; font-size: 1.15rem; }.orbit-console header p { max-width: 150px; margin: 0; color: #818ba2; font: .56rem/1.5 var(--mono); text-align: right; text-transform: uppercase; }.radar-live { display: flex; gap: 7px; align-items: center; color: #aab4cb; font: .56rem var(--mono); letter-spacing: .08em; text-transform: uppercase; }.radar-live i { width: 7px; height: 7px; border-radius: 50%; background: var(--radar-hot); box-shadow: 0 0 0 4px rgb(240 100 73 / 17%); }
.orbit-list { display: grid; gap: 1px; padding: 11px 18px; margin: 0; list-style: none; background: var(--console-line); }.orbit-list li { background: var(--console); }.orbit-list button { display: grid; grid-template-columns: 28px 1fr 58px; gap: 10px; align-items: center; width: 100%; padding: 7px 3px; border: 0; color: #738097; background: transparent; font: .58rem var(--mono); cursor: pointer; }.orbit-list button > i { height: 2px; background: #242b39; }.orbit-list button b { display: block; height: 100%; background: linear-gradient(90deg, var(--repo-color), var(--radar-hot)); transform-origin: left; transition: transform .3s, filter .3s; }.orbit-list strong { color: #8995aa; font-weight: 500; text-align: right; }.orbit-list li.active button { color: white; }.orbit-list li.active button b { filter: brightness(1.4); transform: scaleY(3); }.orbit-list li.active strong { color: white; }.orbit-console footer { display: flex; justify-content: space-between; gap: 16px; padding: 13px 20px; border-top: 1px solid var(--console-line); font: .58rem var(--mono); }.orbit-console footer span { display: flex; gap: 7px; align-items: center; color: #8d98ad; }.orbit-console footer span i { width: 7px; height: 7px; border-radius: 50%; background: var(--repo-color); }.orbit-console footer strong { overflow: hidden; max-width: 65%; color: #d9dfeb; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.radar-board { background: var(--surface); }.radar-board__grid { display: grid; grid-template-columns: minmax(205px, .42fr) minmax(0, 1.58fr); gap: clamp(54px, 8vw, 112px); }.spectrum { border-right: 1px solid var(--line); }.spectrum__sticky { position: sticky; top: 96px; padding: 78px 36px 78px 0; }.spectrum .mono-label, .repo-river .mono-label, .attention .mono-label { color: var(--radar); }.spectrum button { display: flex; justify-content: space-between; width: 100%; padding: 13px 0; border: 0; border-bottom: 1px solid var(--line); color: var(--muted); background: transparent; font: .67rem var(--mono); cursor: pointer; }.spectrum button:first-of-type { margin-top: 22px; border-top: 1px solid var(--line-strong); }.spectrum button span { display: flex; gap: 8px; align-items: center; }.spectrum button span i { width: 7px; height: 7px; border-radius: 50%; }.spectrum button b { color: var(--quiet); font-weight: 500; }.spectrum button.active, .spectrum button.active b { color: var(--radar); }.spectrum__note { display: grid; gap: 5px; margin-top: 36px; color: var(--quiet); font: .59rem var(--mono); }.spectrum__note time { color: var(--ink); font-size: .7rem; }.spectrum__note small { line-height: 1.5; }
.repo-river { padding: 78px 0 96px; }.repo-river > header { display: flex; justify-content: space-between; align-items: end; margin-bottom: 30px; }.repo-river h2 { margin: 0; font-size: clamp(2rem, 4vw, 4.4rem); letter-spacing: -.05em; }.repo-list { display: grid; padding: 0; margin: 0; border-top: 1px solid var(--line-strong); list-style: none; }.repo-card { display: grid; grid-template-columns: 82px minmax(0, 1fr) 190px; gap: 28px; padding: 30px 0; border-bottom: 1px solid var(--line); transition: padding .25s, border-color .25s; }.repo-card:hover { padding-inline: 12px; border-color: var(--radar); }.repo-rank { display: grid; align-content: start; gap: 5px; }.repo-rank span { color: var(--quiet); font: .55rem var(--mono); }.repo-rank strong { color: var(--radar); font: 500 1.8rem var(--mono); }.repo-copy > p:first-child { display: flex; gap: 7px; align-items: center; margin: 0 0 9px; color: var(--muted); font: .59rem var(--mono); }.repo-copy > p:first-child span { width: 7px; height: 7px; border-radius: 50%; }.repo-copy h3 { margin: 0; font-size: clamp(1.25rem, 2.2vw, 2rem); letter-spacing: -.035em; }.repo-copy h3 a { color: var(--ink); text-decoration: none; overflow-wrap: anywhere; }.repo-copy h3 a:hover { color: var(--radar); }.repo-description { max-width: 680px; margin: 12px 0 15px; color: var(--muted); line-height: 1.65; }.repo-open { color: var(--radar); font: .63rem var(--mono); text-underline-offset: 4px; }
.repo-metrics { display: grid; grid-template-columns: 1fr 1fr; margin: 0; align-content: start; }.repo-metrics div { padding: 10px 0 10px 13px; border-left: 1px solid var(--line); }.repo-metrics__today { grid-column: 1 / -1; }.repo-metrics dt { color: var(--quiet); font: .54rem var(--mono); text-transform: uppercase; }.repo-metrics dd { margin: 4px 0 0; font: 600 1rem var(--mono); }.repo-metrics__today dd { color: var(--radar-hot); font-size: 1.45rem; }.radar-state { padding: 60px 0; border-block: 1px solid var(--line); color: var(--muted); }.radar-state button { margin-top: 12px; padding: 9px 13px; border: 1px solid var(--radar); color: var(--radar); background: transparent; cursor: pointer; }
.attention { padding: 94px 0; border-top: 1px solid var(--line); background: color-mix(in srgb, var(--surface) 92%, var(--radar-soft)); }.attention__grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(48px, 8vw, 112px); }.attention h2 { max-width: 480px; margin: 16px 0 0; font-size: clamp(2.3rem, 4.2vw, 4.9rem); letter-spacing: -.055em; line-height: .98; }.attention ol { padding: 0; margin: 0; border-top: 1px solid var(--line-strong); list-style: none; }.attention li { display: grid; grid-template-columns: 36px 1fr auto; gap: 18px; align-items: center; padding: 22px 0; border-bottom: 1px solid var(--line); }.attention li > span { color: var(--radar); font: .7rem var(--mono); }.attention h3 { margin: 0 0 6px; font-size: 1.25rem; }.attention li p { margin: 0; color: var(--muted); font: .62rem/1.6 var(--mono); overflow-wrap: anywhere; }.attention li > strong { color: var(--radar-hot); font: 500 1rem var(--mono); }.attention__grid > a { grid-column: 2; justify-self: start; color: var(--radar); font: .66rem var(--mono); text-underline-offset: 5px; }
@media (max-width: 900px) { .radar-hero__grid { grid-template-columns: 1fr; }.radar-board__grid { grid-template-columns: 1fr; }.spectrum { border-right: 0; border-bottom: 1px solid var(--line); }.spectrum__sticky { position: static; padding: 42px 0; }.spectrum__note { display: none; }.repo-river { padding-top: 56px; }.attention__grid { grid-template-columns: 1fr; }.attention__grid > a { grid-column: 1; }.repo-card { grid-template-columns: 62px minmax(0, 1fr); }.repo-metrics { grid-column: 2; grid-template-columns: repeat(3, 1fr); }.repo-metrics__today { grid-column: auto; } }
@media (max-width: 600px) { .radar-hero { padding-bottom: 58px; }.signal-switcher { display: flex; width: fit-content; margin: 0 0 28px; }.radar-hero__grid { margin-top: 18px; }.radar-thesis h1 { font-size: clamp(3rem, 16vw, 4.7rem); }.radar-facts { grid-template-columns: 1fr 1fr; }.radar-facts div:nth-child(2) { border-right: 0; }.radar-facts div:nth-child(-n+2) { border-bottom: 1px solid var(--line); }.radar-facts div:nth-child(3) { padding-left: 0; }.orbit-console { box-shadow: 7px 7px 0 var(--radar-hot); }.repo-card { grid-template-columns: 44px minmax(0, 1fr); gap: 16px; }.repo-card:hover { padding-inline: 0; }.repo-metrics { grid-column: 1 / -1; }.repo-river > header { display: block; }.repo-river h2 { margin-top: 10px; }.attention { padding: 70px 0; } }
@media (prefers-reduced-motion: reduce) { .orbit-list button b, .repo-card { transition: none; } }
</style>

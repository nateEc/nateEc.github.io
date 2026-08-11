<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { localize } from '../data/portfolio'
import { worklogWeeks, type WorklogProject, type WorklogWeek } from '../data/worklog'
import { useLanguage } from '../composables/useLanguage'
import { setPageMeta } from '../composables/usePageMeta'

const { currentLanguage } = useLanguage()

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      back: '返回首页',
      eyebrow: 'GitLab 工程证据周志 · 2026',
      titleLead: '工作，',
      titleSignal: '一周一周展开。',
      intro: '这不是工时表，而是一条可核验的交付轨迹：从入职第一周开始，把远端 Git 历史按周切开，保留高峰，也保留空档。',
      snapshot: '数据快照 · 2026 年 7 月 26 日',
      pulse: '提交脉冲',
      pulseHint: '选择任意周，跳到对应记录',
      commits: '次提交',
      repositories: '个仓库',
      weeks: '周',
      activeWeeks: '个活跃周',
      method: '如何阅读',
      methodBody: '统计匹配两个已确认的作者身份，覆盖当前可达的分支、标签与 Merge Request refs；合并提交计入总数。',
      identities: '匹配身份',
      coverage: '覆盖范围',
      coverageValue: '远端 branches · tags · MR refs',
      quietTitle: '零，也是一条证据。',
      quietBody: '“0 次提交”只表示仓库中没有可归属证据，不表示没有工作发生。页面不会为缺失记录编造叙事。',
      latest: '最新',
      evidence: '本周可核验结果',
      projectMix: '项目构成',
      noProject: '没有可归属的仓库活动',
      close: '记录结束',
      closeBody: '所有内容来自截至快照日仍可达的 GitLab commit objects，并经过面向公开 portfolio 的概括与脱敏。',
    }
  : {
      back: 'Back home',
      eyebrow: 'GitLab engineering evidence · 2026',
      titleLead: 'The work,',
      titleSignal: 'week by week.',
      intro: 'Not a timesheet, but a verifiable delivery trail. The remote Git history is cut into weeks from day one, keeping the peaks—and the gaps—visible.',
      snapshot: 'Data snapshot · 26 Jul 2026',
      pulse: 'Commit pulse',
      pulseHint: 'Select any week to jump to its record',
      commits: 'commits',
      repositories: 'repositories',
      weeks: 'weeks',
      activeWeeks: 'active weeks',
      method: 'How to read this',
      methodBody: 'The audit matches two confirmed author identities across currently reachable branches, tags, and merge-request refs. Merge commits are included.',
      identities: 'Matched identities',
      coverage: 'Coverage',
      coverageValue: 'Remote branches · tags · MR refs',
      quietTitle: 'A zero is evidence, too.',
      quietBody: '“0 commits” means no attributable repository evidence—not that no work happened. The page does not invent a story where the record is silent.',
      latest: 'Latest',
      evidence: 'Verifiable outcomes',
      projectMix: 'Project mix',
      noProject: 'No attributable repository activity',
      close: 'End of record',
      closeBody: 'Every entry comes from GitLab commit objects reachable on the snapshot date, then summarized and sanitized for a public-facing portfolio.',
    })

const t = (text: { en: string; zh: string }) => localize(text, currentLanguage.value)
const newestFirst = computed(() => [...worklogWeeks].reverse())
const totalCommits = worklogWeeks.reduce((sum, week) => sum + week.commits, 0)
const activeWeeks = worklogWeeks.filter((week) => week.commits > 0).length
const repositoryCount = new Set(worklogWeeks.flatMap((week) => week.projects.map((project) => project.name))).size
const maxCommits = Math.max(...worklogWeeks.map((week) => week.commits))

const pulseHeight = (week: WorklogWeek) => {
  if (week.commits === 0) return '3px'
  return `${Math.max(8, Math.round((week.commits / maxCommits) * 104))}px`
}

const projectShare = (project: WorklogProject, week: WorklogWeek) => (
  week.commits === 0 ? '0%' : `${Math.round((project.commits / week.commits) * 100)}%`
)

const weekLabel = (week: WorklogWeek) => currentLanguage.value === 'zh'
  ? `${week.isoWeek}，${t(week.range)}，${week.commits} 次提交`
  : `${week.isoWeek}, ${t(week.range)}, ${week.commits} commits`

watchEffect(() => {
  setPageMeta(currentLanguage.value === 'zh'
    ? {
        title: '工作周志 — Nathan Shan',
        description: 'Nathan Shan 从 2026 年 3 月起按周整理的 GitLab 工程交付证据。',
        path: '/worklog',
      }
    : {
        title: 'Weekly Worklog — Nathan Shan',
        description: 'A week-by-week evidence trail of Nathan Shan’s engineering work since March 2026.',
        path: '/worklog',
      })
})
</script>

<template>
  <main class="worklog-page">
    <header class="worklog-hero">
      <div class="shell">
        <RouterLink class="worklog-back" to="/">← {{ copy.back }}</RouterLink>

        <div class="worklog-hero__grid">
          <div>
            <p class="eyebrow">{{ copy.eyebrow }}</p>
            <h1 :class="{ 'is-zh': currentLanguage === 'zh' }">
              {{ copy.titleLead }}
              <span>{{ copy.titleSignal }}</span>
            </h1>
          </div>

          <div class="worklog-intro">
            <p>{{ copy.intro }}</p>
            <p class="worklog-snapshot">{{ copy.snapshot }}</p>
            <dl class="worklog-facts">
              <div>
                <dt>{{ copy.commits }}</dt>
                <dd>{{ totalCommits }}</dd>
              </div>
              <div>
                <dt>{{ copy.repositories }}</dt>
                <dd>{{ repositoryCount }}</dd>
              </div>
              <div>
                <dt>{{ copy.weeks }}</dt>
                <dd>{{ worklogWeeks.length }}</dd>
              </div>
              <div>
                <dt>{{ copy.activeWeeks }}</dt>
                <dd>{{ activeWeeks }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <section class="pulse-panel" :aria-label="copy.pulse">
          <div class="pulse-panel__heading">
            <p>{{ copy.pulse }}</p>
            <span>{{ copy.pulseHint }}</span>
          </div>

          <div class="pulse-scroll">
            <ol class="pulse-chart">
              <li
                v-for="(week, index) in worklogWeeks"
                :key="week.id"
                :class="{ 'is-quiet': week.commits === 0 }"
              >
                <a
                  :href="`#week-${week.id}`"
                  :aria-label="weekLabel(week)"
                  :data-count="week.commits"
                >
                  <span class="pulse-track" aria-hidden="true">
                    <span
                      class="pulse-fill"
                      :style="{ height: pulseHeight(week), animationDelay: `${index * 28}ms` }"
                    ></span>
                  </span>
                  <span class="pulse-week">{{ week.isoWeek }}</span>
                </a>
              </li>
            </ol>
          </div>
        </section>
      </div>
    </header>

    <section class="worklog-ledger" aria-label="Weekly work records">
      <div class="shell ledger-grid">
        <aside class="ledger-aside">
          <div class="ledger-aside__sticky">
            <p class="mono-label">{{ copy.method }}</p>
            <p>{{ copy.methodBody }}</p>

            <dl class="audit-notes">
              <div>
                <dt>{{ copy.identities }}</dt>
                <dd>Nathan Shan<br />shanyukun</dd>
              </div>
              <div>
                <dt>{{ copy.coverage }}</dt>
                <dd>{{ copy.coverageValue }}</dd>
              </div>
            </dl>

            <div class="zero-note">
              <span aria-hidden="true">0</span>
              <h2>{{ copy.quietTitle }}</h2>
              <p>{{ copy.quietBody }}</p>
            </div>
          </div>
        </aside>

        <div class="week-list">
          <article
            v-for="week in newestFirst"
            :id="`week-${week.id}`"
            :key="week.id"
            :class="['week-entry', `is-${week.status}`]"
          >
            <header class="week-entry__header">
              <div>
                <span class="week-code">{{ week.isoWeek }}</span>
                <time :datetime="week.start">{{ t(week.range) }}</time>
              </div>
              <p class="week-count">
                <strong>{{ week.commits }}</strong>
                <span>{{ copy.commits }}</span>
              </p>
            </header>

            <div class="week-entry__body">
              <div class="week-story">
                <p v-if="week.id === '2026-w30'" class="latest-label">{{ copy.latest }}</p>
                <h2>{{ t(week.title) }}</h2>
                <p class="week-summary">{{ t(week.summary) }}</p>

                <div class="week-evidence">
                  <p>{{ copy.evidence }}</p>
                  <ul>
                    <li v-for="highlight in week.highlights" :key="highlight.en">
                      {{ t(highlight) }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="project-mix">
                <p>{{ copy.projectMix }}</p>
                <ul v-if="week.projects.length">
                  <li v-for="project in week.projects" :key="project.name">
                    <div>
                      <span>{{ project.name }}</span>
                      <strong>{{ project.commits }}</strong>
                    </div>
                    <span class="project-track" aria-hidden="true">
                      <span :style="{ width: projectShare(project, week) }"></span>
                    </span>
                  </li>
                </ul>
                <p v-else class="project-empty">{{ copy.noProject }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="worklog-close">
      <div class="shell">
        <p class="mono-label">{{ copy.close }}</p>
        <p>{{ copy.closeBody }}</p>
        <RouterLink to="/">← {{ copy.back }}</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.worklog-page {
  --signal: #f0522d;
  --signal-soft: #ffe4dc;
  --signal-ink: #8f2b11;
  padding-top: 72px;
}

:global(html[data-theme='dark']) .worklog-page {
  --signal: #ff7958;
  --signal-soft: #3c211b;
  --signal-ink: #ffb09a;
}

.worklog-hero {
  position: relative;
  padding: 58px 0 72px;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
}

.worklog-hero::after {
  position: absolute;
  top: 0;
  right: max(24px, calc((100vw - 1180px) / 2));
  width: 1px;
  height: 176px;
  background: var(--signal);
  content: '';
  opacity: 0.68;
}

.worklog-back {
  display: inline-block;
  margin-bottom: 76px;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.72rem;
  text-underline-offset: 4px;
}

.worklog-back:hover {
  color: var(--signal);
}

.worklog-hero .eyebrow {
  color: var(--signal);
}

.worklog-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(340px, 0.75fr);
  gap: clamp(56px, 10vw, 144px);
  align-items: end;
}

.worklog-hero__grid > *,
.ledger-grid > *,
.week-entry__body > * {
  min-width: 0;
}

.worklog-hero h1 {
  max-width: 810px;
  margin: 25px 0 0;
  font-size: clamp(4rem, 8.6vw, 8.6rem);
  font-weight: 700;
  letter-spacing: -0.07em;
  line-height: 0.82;
}

.worklog-hero h1 span {
  position: relative;
  display: block;
  width: max-content;
  max-width: 100%;
  margin-top: 0.16em;
  color: var(--signal);
}

.worklog-hero h1 span::after {
  position: absolute;
  right: 0.02em;
  bottom: -0.13em;
  width: 31%;
  height: 0.065em;
  background: currentColor;
  content: '';
}

.worklog-intro > p:first-child {
  margin-bottom: 28px;
  color: var(--ink);
  font-family: var(--display);
  font-size: clamp(1.2rem, 2vw, 1.58rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.42;
}

.worklog-snapshot {
  margin-bottom: 30px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.worklog-facts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 0;
  border-top: 1px solid var(--line-strong);
}

.worklog-facts div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--line);
}

.worklog-facts div:nth-child(odd) {
  padding-right: 18px;
  border-right: 1px solid var(--line);
}

.worklog-facts div:nth-child(even) {
  padding-left: 18px;
}

.worklog-facts dt {
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.66rem;
}

.worklog-facts dd {
  margin: 0;
  font-family: var(--display);
  font-size: 1.28rem;
  font-weight: 700;
}

.pulse-panel {
  margin-top: 78px;
  color: #edf2f7;
  background: var(--console-bg);
  box-shadow: 10px 10px 0 var(--signal);
}

.pulse-panel__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 46px;
  padding: 0 18px;
  border-bottom: 1px solid #2b3440;
  font-family: var(--mono);
}

.pulse-panel__heading p,
.pulse-panel__heading span {
  margin: 0;
  font-size: 0.66rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.pulse-panel__heading p {
  color: var(--signal);
  font-weight: 600;
}

.pulse-panel__heading span {
  color: #7e8b9d;
}

.pulse-scroll {
  overflow-x: auto;
  scrollbar-color: var(--signal) #202732;
  scrollbar-width: thin;
}

.pulse-chart {
  display: grid;
  grid-template-columns: repeat(19, minmax(38px, 1fr));
  min-width: 820px;
  height: 176px;
  padding: 18px 12px 0;
  margin: 0;
  list-style: none;
}

.pulse-chart li {
  min-width: 0;
  border-right: 1px solid #202732;
}

.pulse-chart li:last-child {
  border-right: 0;
}

.pulse-chart a {
  position: relative;
  display: grid;
  height: 100%;
  grid-template-rows: 1fr 29px;
  color: #8290a3;
  text-decoration: none;
}

.pulse-chart a::before {
  position: absolute;
  top: -6px;
  left: 50%;
  z-index: 2;
  padding: 3px 6px;
  color: #10151d;
  background: var(--signal);
  content: attr(data-count);
  font-family: var(--mono);
  font-size: 0.62rem;
  font-weight: 600;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 5px);
  transition: opacity 150ms ease, transform 150ms ease;
}

.pulse-chart a:hover::before,
.pulse-chart a:focus-visible::before {
  opacity: 1;
  transform: translate(-50%, 0);
}

.pulse-track {
  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
}

.pulse-fill {
  display: block;
  width: min(54%, 22px);
  background: var(--signal);
  transform: scaleY(0);
  transform-origin: bottom;
  animation: pulse-rise 620ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  transition: width 150ms ease, filter 150ms ease;
}

.pulse-chart a:hover .pulse-fill,
.pulse-chart a:focus-visible .pulse-fill {
  width: min(72%, 28px);
  filter: brightness(1.14);
}

.pulse-chart .is-quiet .pulse-fill {
  width: 12px;
  border: 1px solid #687589;
  background: transparent;
}

.pulse-week {
  align-self: center;
  justify-self: center;
  font-family: var(--mono);
  font-size: 0.58rem;
}

.pulse-chart a:hover .pulse-week,
.pulse-chart a:focus-visible .pulse-week {
  color: #ffffff;
}

@keyframes pulse-rise {
  to {
    transform: scaleY(1);
  }
}

.worklog-ledger {
  background: var(--surface);
}

.ledger-grid {
  display: grid;
  grid-template-columns: minmax(230px, 0.52fr) minmax(0, 1.48fr);
  gap: clamp(56px, 9vw, 128px);
}

.ledger-aside {
  position: relative;
  border-right: 1px solid var(--line);
}

.ledger-aside__sticky {
  position: sticky;
  top: 106px;
  padding: 88px 48px 88px 0;
}

.ledger-aside__sticky > p:not(.mono-label) {
  color: var(--muted);
  font-size: 0.92rem;
}

.ledger-aside .mono-label {
  margin-bottom: 20px;
  color: var(--signal);
}

.audit-notes {
  margin: 36px 0 0;
  border-top: 1px solid var(--line);
}

.audit-notes div {
  padding: 15px 0;
  border-bottom: 1px solid var(--line);
}

.audit-notes dt {
  margin-bottom: 5px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.audit-notes dd {
  margin: 0;
  color: var(--ink);
  font-family: var(--mono);
  font-size: 0.7rem;
}

.zero-note {
  position: relative;
  margin-top: 58px;
  padding-top: 20px;
  border-top: 2px solid var(--signal);
}

.zero-note > span {
  display: block;
  margin-bottom: 17px;
  color: var(--signal);
  font-family: var(--display);
  font-size: 3.8rem;
  font-weight: 700;
  line-height: 0.86;
}

.zero-note h2 {
  margin-bottom: 10px;
  font-size: 1.15rem;
  letter-spacing: -0.025em;
}

.zero-note p {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
}

.week-list {
  min-width: 0;
}

.week-entry {
  position: relative;
  padding: 82px 0 86px;
  border-bottom: 1px solid var(--line-strong);
  scroll-margin-top: 72px;
}

.week-entry::before {
  position: absolute;
  top: -1px;
  left: 0;
  width: 72px;
  height: 3px;
  background: var(--signal);
  content: '';
}

.week-entry.is-quiet::before,
.week-entry.is-onboarding::before {
  width: 24px;
  height: 1px;
  background: var(--quiet);
}

.week-entry__header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 48px;
}

.week-entry__header > div {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.week-code {
  color: var(--signal);
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 600;
}

.is-quiet .week-code,
.is-onboarding .week-code {
  color: var(--quiet);
}

.week-entry time {
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.7rem;
}

.week-count {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.66rem;
}

.week-count strong {
  color: var(--ink);
  font-family: var(--display);
  font-size: 2.15rem;
  line-height: 0.9;
}

.is-quiet .week-count strong,
.is-onboarding .week-count strong {
  color: var(--quiet);
}

.week-entry__body {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(210px, 0.8fr);
  gap: clamp(40px, 7vw, 82px);
}

.latest-label {
  width: max-content;
  padding: 4px 7px;
  margin-bottom: 17px;
  color: var(--signal-ink);
  background: var(--signal-soft);
  font-family: var(--mono);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.week-story h2 {
  max-width: 680px;
  margin: 0 0 22px;
  font-size: clamp(2rem, 4vw, 3.45rem);
  line-height: 0.98;
}

.week-summary {
  max-width: 690px;
  margin-bottom: 36px;
  color: var(--muted);
  font-size: 1rem;
}

.week-evidence > p,
.project-mix > p:first-child {
  margin-bottom: 12px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.week-evidence ul,
.project-mix ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.week-evidence li {
  position: relative;
  padding: 11px 0 11px 23px;
  border-top: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.88rem;
}

.week-evidence li:last-child {
  border-bottom: 1px solid var(--line);
}

.week-evidence li::before {
  position: absolute;
  top: 11px;
  left: 0;
  color: var(--signal);
  content: '↳';
  font-family: var(--mono);
}

.project-mix {
  align-self: start;
  padding-top: 4px;
}

.project-mix li + li {
  margin-top: 17px;
}

.project-mix li > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 7px;
  font-family: var(--mono);
  font-size: 0.65rem;
}

.project-mix li > div span {
  min-width: 0;
  overflow: hidden;
  color: var(--muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-mix li > div strong {
  color: var(--ink);
}

.project-track {
  display: block;
  height: 3px;
  background: var(--line);
}

.project-track > span {
  display: block;
  height: 100%;
  background: var(--signal);
}

.project-empty {
  padding: 16px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.68rem;
}

.worklog-close {
  padding: 74px 0;
  color: var(--console-text);
  background: var(--console-bg);
}

.worklog-close .shell {
  display: grid;
  grid-template-columns: 0.5fr 1.1fr auto;
  gap: 48px;
  align-items: start;
}

.worklog-close .mono-label {
  color: var(--signal);
}

.worklog-close p:not(.mono-label) {
  max-width: 650px;
  margin: 0;
  color: #8f9bad;
}

.worklog-close a {
  color: #e6ebf2;
  font-family: var(--mono);
  font-size: 0.72rem;
  text-underline-offset: 5px;
}

.worklog-close a:hover {
  color: var(--signal);
}

@media (max-width: 900px) {
  .worklog-hero__grid,
  .ledger-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .worklog-hero__grid {
    gap: 48px;
  }

  .ledger-aside {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .ledger-aside__sticky {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px 48px;
    padding: 70px 0;
  }

  .ledger-aside__sticky > .mono-label,
  .ledger-aside__sticky > p:not(.mono-label) {
    grid-column: 1;
  }

  .audit-notes {
    grid-column: 1;
    margin-top: 0;
  }

  .zero-note {
    grid-column: 2;
    grid-row: 1 / span 3;
    margin-top: 0;
  }

  .worklog-close .shell {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (min-width: 651px) {
  .worklog-hero h1.is-zh {
    font-size: clamp(4rem, 7.4vw, 7.4rem);
  }

  .worklog-hero h1.is-zh span {
    white-space: nowrap;
  }
}

@media (max-width: 650px) {
  .worklog-hero {
    padding-top: 42px;
  }

  .worklog-back {
    margin-bottom: 56px;
  }

  .worklog-hero h1 {
    font-size: clamp(3.65rem, 18vw, 6.2rem);
  }

  .worklog-hero h1.is-zh {
    font-size: clamp(2.7rem, 13.5vw, 4.75rem);
  }

  .worklog-hero h1.is-zh span {
    white-space: nowrap;
  }

  .worklog-facts {
    grid-template-columns: 1fr;
  }

  .worklog-facts div,
  .worklog-facts div:nth-child(odd),
  .worklog-facts div:nth-child(even) {
    padding: 11px 0;
    border-right: 0;
  }

  .pulse-panel {
    margin-top: 58px;
    box-shadow: 6px 6px 0 var(--signal);
  }

  .pulse-panel__heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    padding: 12px 14px;
  }

  .ledger-aside__sticky {
    grid-template-columns: 1fr;
  }

  .ledger-aside__sticky > .mono-label,
  .ledger-aside__sticky > p:not(.mono-label),
  .audit-notes,
  .zero-note {
    grid-column: 1;
  }

  .zero-note {
    grid-row: auto;
  }

  .week-entry {
    padding: 66px 0 70px;
  }

  .week-entry__header {
    margin-bottom: 38px;
  }

  .week-entry__header > div {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .week-entry__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .project-mix {
    padding-top: 8px;
  }

  .worklog-close {
    padding: 58px 0;
  }
}
</style>

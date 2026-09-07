<script setup lang="ts">
import { computed } from 'vue'
import CaseGallery from './CaseGallery.vue'
import { localize, projects, upstreamContributions } from '../data/portfolio'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '精选工作',
      title: '不是项目陈列，是工程证据。',
      subtitle: '四个深度案例拆解问题、约束、系统路径、关键决策与结果。涉及公司内部工作的内容均已脱敏，只保留可公开的工程事实。',
      open: '打开完整案例',
      architecture: '系统路径',
      evidence: '证据',
      archiveKicker: '产品与开源归档',
      archiveTitle: '更多完成的构建',
      upstreamKicker: '上游合入记录',
      upstreamTitle: '14 个补丁，已进入别人的代码库。',
      upstreamIntro: '这里单独呈现被上游接受的贡献，不把它们伪装成我独立拥有的产品。每条均可回到公开 PR 记录核对。',
      merged: '已合入',
      inspectMerge: '查看已合入 PR',
      snapshot: '核验快照 · 2026 年 8 月 31 日',
      role: '负责',
      source: '源码',
      live: '在线体验',
    }
  : {
      kicker: 'Selected work',
      title: 'Not a gallery. An evidence archive.',
      subtitle: 'Four deep cases unpack the problem, constraints, system path, decisions, and outcomes. Internal company work is sanitized and limited to facts that can be shared publicly.',
      open: 'Open full case',
      architecture: 'System path',
      evidence: 'Evidence',
      archiveKicker: 'Product & open-source archive',
      archiveTitle: 'More finished builds',
      upstreamKicker: 'Upstream contribution record',
      upstreamTitle: '14 patches, accepted into someone else’s codebase.',
      upstreamIntro: 'Accepted upstream contributions are deliberately separated from products I own. Every entry links back to its public merged-PR record.',
      merged: 'merged',
      inspectMerge: 'Review merged PRs',
      snapshot: 'Verified snapshot · 31 Aug 2026',
      role: 'Scope',
      source: 'Source',
      live: 'Live',
    })

const t = (text: { en: string; zh: string }) => localize(text, currentLanguage.value)
const mergedContributions = upstreamContributions.reduce((sum, contribution) => sum + contribution.merged, 0)
</script>

<template>
  <section id="work" class="section portfolio" aria-labelledby="work-title">
    <div class="shell">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.kicker }}</p>
        <div>
          <h2 id="work-title">{{ copy.title }}</h2>
          <p class="section-heading__copy">{{ copy.subtitle }}</p>
        </div>
      </div>

      <CaseGallery />

      <section class="upstream-ledger" aria-labelledby="upstream-title">
        <header class="upstream-ledger__heading">
          <div>
            <p class="eyebrow">{{ copy.upstreamKicker }}</p>
            <h2 id="upstream-title">{{ copy.upstreamTitle }}</h2>
          </div>
          <div>
            <p>{{ copy.upstreamIntro }}</p>
            <span>{{ copy.snapshot }}</span>
          </div>
        </header>

        <div class="upstream-ledger__rail">
          <p class="upstream-ledger__total"><strong>{{ mergedContributions }}</strong><span>{{ copy.merged }}</span></p>
          <article v-for="contribution in upstreamContributions" :key="contribution.project" class="upstream-entry">
            <div class="upstream-entry__topline">
              <span>{{ contribution.project }}</span>
              <strong>{{ contribution.merged }} {{ copy.merged }}</strong>
            </div>
            <h3>{{ t(contribution.focus) }}</h3>
            <p>{{ t(contribution.detail) }}</p>
            <a :href="contribution.sourceUrl" target="_blank" rel="noopener noreferrer">{{ copy.inspectMerge }} ↗</a>
          </article>
        </div>
      </section>

      <div class="archive-heading">
        <p class="eyebrow">{{ copy.archiveKicker }}</p>
        <h2>{{ copy.archiveTitle }}</h2>
      </div>

      <div class="project-grid">
        <article :class="['project-card', { 'project-card--featured': project.featured }]" v-for="project in projects" :key="project.title">
          <div class="project-image">
            <img :src="project.image" :alt="`${project.title} application interface`" width="1600" height="900" loading="lazy" />
            <span>{{ project.period }}</span>
          </div>
          <div class="project-content">
            <p class="mono-label">{{ t(project.context) }}</p>
            <h3>{{ project.title }}</h3>
            <p>{{ t(project.summary) }}</p>
            <p class="project-role"><strong>{{ copy.role }}:</strong> {{ t(project.role) }}</p>
            <ul class="tag-list">
              <li v-for="item in project.stack" :key="item">{{ item }}</li>
            </ul>
            <div class="project-links">
              <a v-if="project.sourceUrl" class="text-link" :href="project.sourceUrl" target="_blank" rel="noopener noreferrer">{{ copy.source }} ↗</a>
              <a v-if="project.liveUrl" class="text-link" :href="project.liveUrl" target="_blank" rel="noopener noreferrer">{{ copy.live }} ↗</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio {
  background: var(--console-bg);
}

.portfolio :deep(.section-heading h2),
.portfolio .archive-heading h2 {
  color: var(--white);
}

.portfolio .section-heading__copy {
  margin-top: 25px;
  color: #98a2b2;
}

.portfolio .eyebrow {
  color: #7d9fff;
}

.upstream-ledger {
  margin-top: 18px;
  padding: 76px 0 2px;
  border-top: 1px solid #303744;
}

.upstream-ledger__heading {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 48px;
  align-items: end;
  margin-bottom: 30px;
}

.upstream-ledger__heading .eyebrow {
  color: #8ed5ff;
}

.upstream-ledger__heading h2 {
  max-width: 720px;
  margin: 16px 0 0;
  color: var(--white);
  font-size: clamp(2.2rem, 4.4vw, 4.35rem);
  line-height: 0.96;
}

.upstream-ledger__heading > div:last-child > p {
  max-width: 470px;
  margin: 0;
  color: #98a5b6;
  font-size: 0.94rem;
}

.upstream-ledger__heading > div:last-child > span {
  display: block;
  margin-top: 14px;
  color: #67768b;
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.upstream-ledger__rail {
  display: grid;
  grid-template-columns: minmax(152px, 0.48fr) repeat(2, 1fr);
  overflow: hidden;
  border: 1px solid #303744;
  background: linear-gradient(135deg, rgba(62, 138, 219, 0.11), #10161f 48%);
}

.upstream-ledger__total,
.upstream-entry {
  position: relative;
  min-height: 256px;
  margin: 0;
  padding: 28px;
}

.upstream-ledger__total {
  display: flex;
  flex-direction: column;
  justify-content: end;
  border-right: 1px solid #303744;
  background: rgba(7, 12, 19, 0.42);
}

.upstream-ledger__total::before {
  position: absolute;
  top: 27px;
  left: 28px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #8ed5ff;
  box-shadow: 0 0 0 7px rgba(142, 213, 255, 0.1), 0 0 32px rgba(142, 213, 255, 0.5);
  content: '';
}

.upstream-ledger__total strong {
  color: #f0f7ff;
  font-family: var(--display);
  font-size: clamp(3.4rem, 7vw, 6.4rem);
  line-height: 0.82;
}

.upstream-ledger__total span {
  margin-top: 8px;
  color: #8ed5ff;
  font-family: var(--mono);
  font-size: 0.69rem;
  text-transform: uppercase;
}

.upstream-entry {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #303744;
}

.upstream-entry:last-child {
  border-right: 0;
}

.upstream-entry__topline {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #dbe7f4;
  font-family: var(--mono);
  font-size: 0.68rem;
}

.upstream-entry__topline strong {
  color: #8ed5ff;
  font-weight: 500;
}

.upstream-entry h3 {
  max-width: 310px;
  margin: 42px 0 12px;
  color: var(--white);
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  line-height: 1.05;
}

.upstream-entry p {
  max-width: 340px;
  margin: 0;
  color: #8f9cad;
  font-size: 0.85rem;
}

.upstream-entry a {
  margin-top: auto;
  padding-top: 20px;
  color: #dce9f8;
  font-family: var(--mono);
  font-size: 0.66rem;
  text-underline-offset: 4px;
}

.upstream-entry a:hover {
  color: #8ed5ff;
}

.archive-heading {
  display: grid;
  grid-template-columns: 0.65fr 1.35fr;
  gap: 48px;
  align-items: end;
  padding-top: 118px;
  margin-bottom: 42px;
}

.archive-heading h2 {
  margin: 0;
  font-size: clamp(2.3rem, 4.8vw, 4.5rem);
  line-height: 0.98;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.project-card {
  min-width: 0;
  border: 1px solid #303744;
  background: #11161e;
}

.project-card--featured {
  display: grid;
  grid-column: span 2;
  grid-template-columns: minmax(0, 1.22fr) minmax(320px, 0.78fr);
}

.project-card--featured .project-image {
  width: 100%;
  aspect-ratio: auto;
  min-height: 100%;
  border-right: 1px solid #303744;
  border-bottom: 0;
}

.project-card--featured .project-content {
  display: flex;
  flex-direction: column;
  padding: clamp(25px, 3.4vw, 42px);
}

.project-card--featured .project-content h3 {
  font-size: clamp(2rem, 3.4vw, 3.5rem);
  line-height: 0.97;
}

.project-card--featured .project-links {
  margin-top: auto;
  padding-top: 28px;
}

.project-image {
  position: relative;
  aspect-ratio: 16 / 9;
  border-bottom: 1px solid #303744;
  background: #090d12;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 420ms ease, filter 420ms ease;
}

.project-card:hover .project-image img {
  transform: scale(1.025);
}

.project-image > span {
  position: absolute;
  top: 13px;
  right: 13px;
  padding: 5px 8px;
  color: #dce3ec;
  background: rgba(9, 13, 18, 0.85);
  font-family: var(--mono);
  font-size: 0.6rem;
}

.project-content {
  padding: 25px;
}

.project-content .mono-label {
  margin-bottom: 12px;
  color: #7d9fff;
}

.project-content h3 {
  margin-bottom: 10px;
  color: var(--white);
  font-size: 1.65rem;
}

.project-content > p:not(.mono-label) {
  color: #919dad;
  font-size: 0.91rem;
}

.project-role {
  padding-top: 15px;
  border-top: 1px solid #303744;
}

.project-role strong {
  color: #ccd4df;
  font-weight: 500;
}

.portfolio .tag-list li {
  border-color: #36404e;
  color: #8f9aac;
  background: #161d27;
}

.project-links {
  display: flex;
  gap: 20px;
  margin-top: 24px;
}

.project-links .text-link {
  color: #dde5ef;
}

.project-links .text-link:hover {
  color: #7d9fff;
}

@media (max-width: 850px) {
  .upstream-ledger__heading {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .upstream-ledger__rail {
    grid-template-columns: minmax(130px, 0.5fr) 1fr 1fr;
  }

  .upstream-ledger__total,
  .upstream-entry {
    min-height: 232px;
    padding: 22px;
  }

  .upstream-ledger__total::before {
    top: 21px;
    left: 22px;
  }

  .archive-heading {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }

  .project-card--featured {
    grid-column: auto;
    grid-template-columns: 1fr;
  }

  .project-card--featured .project-image {
    min-height: 0;
    border-right: 0;
    border-bottom: 1px solid #303744;
  }
}

@media (max-width: 560px) {
  .upstream-ledger {
    padding-top: 60px;
  }

  .upstream-ledger__rail {
    grid-template-columns: 1fr;
  }

  .upstream-ledger__total,
  .upstream-entry {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid #303744;
  }

  .upstream-entry:last-child {
    border-bottom: 0;
  }

  .upstream-entry h3 {
    margin-top: 30px;
  }

  .project-content {
    padding: 20px;
  }
}
</style>

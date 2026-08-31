<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { caseStudies, localize, projects, upstreamContributions } from '../data/portfolio'
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

      <div class="case-grid">
        <article
          v-for="(study, index) in caseStudies"
          :key="study.slug"
          :class="['case-card', `accent-${study.accent}`, { 'case-card--featured': study.featured }]"
        >
          <div class="case-card__topline">
            <span>0{{ index + 1 }}</span>
            <span>{{ t(study.kind) }}</span>
            <time>{{ study.period }}</time>
          </div>

          <div class="case-card__body">
            <div class="case-card__copy">
              <h3>{{ t(study.title) }}</h3>
              <p class="case-card__thesis">{{ t(study.thesis) }}</p>
              <p>{{ t(study.summary) }}</p>
            </div>

            <figure v-if="study.image" class="case-card__media">
              <img :src="study.image" :alt="`${study.title.en} application interface`" width="1280" height="720" loading="lazy" />
              <figcaption>{{ currentLanguage === 'zh' ? '实际 Gradio 应用界面' : 'Actual Gradio application interface' }}</figcaption>
            </figure>

            <div v-else class="mini-architecture" aria-hidden="true">
              <p>{{ copy.architecture }}</p>
              <ol>
                <li v-for="step in study.architecture" :key="step.key">
                  <span></span>{{ t(step.label) }}
                </li>
              </ol>
            </div>
          </div>

          <div class="case-card__evidence">
            <p class="mono-label">{{ copy.evidence }}</p>
            <dl>
              <div v-for="item in study.evidence" :key="item.value">
                <dt>{{ item.value }}</dt>
                <dd>{{ t(item.label) }}</dd>
              </div>
            </dl>
          </div>

          <RouterLink class="case-card__link" :to="`/case-studies/${study.slug}`">
            {{ copy.open }} <span aria-hidden="true">↗</span>
          </RouterLink>
        </article>
      </div>

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

.case-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 18px;
}

.case-card {
  --case-accent: var(--blue);
  --case-soft: rgba(37, 99, 235, 0.12);
  position: relative;
  display: flex;
  grid-column: span 6;
  min-height: 600px;
  padding: 30px;
  border: 1px solid #303744;
  border-top: 3px solid var(--case-accent);
  color: #e8edf4;
  background: linear-gradient(155deg, var(--case-soft), #11161e 42%);
  flex-direction: column;
  overflow: hidden;
  transition: border-color 180ms ease, transform 180ms ease;
}

.case-card--featured {
  grid-column: span 12;
  min-height: 540px;
}

.case-card.accent-teal {
  --case-accent: #45b8aa;
  --case-soft: rgba(15, 118, 110, 0.15);
}

.case-card.accent-amber {
  --case-accent: #daa34e;
  --case-soft: rgba(154, 100, 22, 0.16);
}

.case-card.accent-violet {
  --case-accent: #b397ff;
  --case-soft: rgba(125, 92, 210, 0.18);
}

.case-card:hover {
  border-color: #556070;
  transform: translateY(-3px);
}

.case-card__topline {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid #323946;
  color: #8591a2;
  font-family: var(--mono);
  font-size: 0.63rem;
  text-transform: uppercase;
}

.case-card__topline span:first-child {
  color: var(--case-accent);
}

.case-card__body {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(240px, 0.9fr);
  gap: 42px;
  padding: 42px 0 32px;
}

.case-card:not(.case-card--featured) .case-card__body {
  grid-template-columns: 1fr;
}

.case-card h3 {
  max-width: 720px;
  margin-bottom: 19px;
  color: var(--white);
  font-size: clamp(2rem, 4vw, 4.25rem);
  line-height: 0.97;
}

.case-card:not(.case-card--featured) h3 {
  font-size: clamp(2rem, 3.3vw, 3rem);
}

.case-card__thesis {
  max-width: 660px;
  color: #dce4ef !important;
  font-family: var(--display);
  font-size: 1.18rem;
  letter-spacing: -0.02em;
}

.case-card__copy > p:last-child {
  max-width: 660px;
  margin: 0;
  color: #939eae;
  font-size: 0.94rem;
}

.mini-architecture {
  align-self: end;
  padding: 18px;
  border: 1px solid #323946;
  background: rgba(7, 10, 15, 0.48);
}

.case-card__media {
  align-self: end;
  margin: 0;
  border: 1px solid #323946;
  background: #090d12;
}

.case-card__media img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: top left;
}

.case-card__media figcaption {
  padding: 8px 10px;
  color: #788597;
  font-family: var(--mono);
  font-size: 0.58rem;
}

.mini-architecture > p {
  margin-bottom: 14px;
  color: #667285;
  font-family: var(--mono);
  font-size: 0.6rem;
  text-transform: uppercase;
}

.mini-architecture ol {
  padding: 0;
  margin: 0;
  list-style: none;
}

.mini-architecture li {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 9px;
  align-items: center;
  padding: 7px 0;
  color: #aab4c2;
  font-family: var(--mono);
  font-size: 0.63rem;
}

.mini-architecture li span {
  width: 7px;
  height: 7px;
  border: 1px solid var(--case-accent);
  border-radius: 50%;
  background: var(--case-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--case-accent), transparent 80%);
}

.case-card__evidence {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 20px;
  padding: 20px 0;
  margin-top: auto;
  border-top: 1px solid #323946;
  border-bottom: 1px solid #323946;
}

.case-card__evidence .mono-label {
  margin: 0;
  color: #667285;
}

.case-card__evidence dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin: 0;
}

.case-card__evidence dl div {
  min-width: 0;
}

.case-card__evidence dt {
  color: var(--white);
  font-family: var(--display);
  font-size: 1.35rem;
  font-weight: 600;
}

.case-card__evidence dd {
  margin: 1px 0 0;
  color: #8591a2;
  font-family: var(--mono);
  font-size: 0.58rem;
}

.case-card__link {
  display: flex;
  justify-content: space-between;
  padding-top: 21px;
  color: #d9e1ec;
  font-family: var(--mono);
  font-size: 0.71rem;
  font-weight: 600;
  text-decoration: none;
}

.case-card__link:hover {
  color: var(--case-accent);
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
  .case-card,
  .case-card--featured {
    grid-column: span 12;
  }

  .case-card__body,
  .case-card--featured .case-card__body {
    grid-template-columns: 1fr;
  }

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
  .case-card {
    min-height: auto;
    padding: 21px;
  }

  .case-card__topline {
    grid-template-columns: auto 1fr;
  }

  .case-card__topline time {
    display: none;
  }

  .case-card__evidence {
    grid-template-columns: 1fr;
  }

  .case-card__evidence dl {
    gap: 10px;
  }

  .case-card__evidence dt {
    font-size: 1.05rem;
  }

  .case-card__body {
    gap: 22px;
    padding: 30px 0 24px;
  }

  .case-card .mini-architecture {
    display: none;
  }

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

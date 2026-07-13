<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { caseStudies, localize, projects } from '../data/portfolio'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '精选工作',
      title: '不是项目陈列，是工程证据。',
      subtitle: '三个深度案例拆解问题、约束、系统路径、关键决策与结果。涉及公司内部工作的内容均已脱敏，只保留可公开的工程事实。',
      open: '打开完整案例',
      architecture: '系统路径',
      evidence: '证据',
      archiveKicker: '产品与开源归档',
      archiveTitle: '更多完成的构建',
      role: '负责',
      source: '源码',
      live: '在线体验',
    }
  : {
      kicker: 'Selected work',
      title: 'Not a gallery. An evidence archive.',
      subtitle: 'Three deep cases unpack the problem, constraints, system path, decisions, and outcomes. Internal company work is sanitized and limited to facts that can be shared publicly.',
      open: 'Open full case',
      architecture: 'System path',
      evidence: 'Evidence',
      archiveKicker: 'Product & open-source archive',
      archiveTitle: 'More finished builds',
      role: 'Scope',
      source: 'Source',
      live: 'Live',
    })

const t = (text: { en: string; zh: string }) => localize(text, currentLanguage.value)
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
          :class="['case-card', `accent-${study.accent}`]"
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

      <div class="archive-heading">
        <p class="eyebrow">{{ copy.archiveKicker }}</p>
        <h2>{{ copy.archiveTitle }}</h2>
      </div>

      <div class="project-grid">
        <article v-for="project in projects" :key="project.title" class="project-card">
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
  background: var(--ink);
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

.case-card:first-child {
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

.case-card:not(:first-child) .case-card__body {
  grid-template-columns: 1fr;
}

.case-card h3 {
  max-width: 720px;
  margin-bottom: 19px;
  color: var(--white);
  font-size: clamp(2rem, 4vw, 4.25rem);
  line-height: 0.97;
}

.case-card:not(:first-child) h3 {
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
  .case-card:first-child {
    grid-column: span 12;
  }

  .case-card__body,
  .case-card:first-child .case-card__body {
    grid-template-columns: 1fr;
  }

  .archive-heading {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .project-grid {
    grid-template-columns: 1fr;
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

  .project-content {
    padding: 20px;
  }
}
</style>

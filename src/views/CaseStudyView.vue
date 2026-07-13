<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { caseStudies, localize } from '../data/portfolio'
import { useLanguage } from '../composables/useLanguage'
import { setPageMeta } from '../composables/usePageMeta'

const route = useRoute()
const { currentLanguage } = useLanguage()

const study = computed(() => caseStudies.find((item) => item.slug === route.params.slug))
const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      back: '返回案例总览',
      evidence: '可核验证据',
      challenge: '问题与约束',
      constraints: '约束',
      architecture: '系统路径',
      decisions: '关键决策',
      outcomes: '结果',
      stack: '实现栈',
      source: '查看源码',
      missing: '没有找到这个案例。',
      home: '返回首页',
    }
  : {
      back: 'Back to casebook',
      evidence: 'Verifiable evidence',
      challenge: 'Problem & constraints',
      constraints: 'Constraints',
      architecture: 'System path',
      decisions: 'Decisions that mattered',
      outcomes: 'What changed',
      stack: 'Implementation stack',
      source: 'View source',
      missing: 'This case study does not exist.',
      home: 'Return home',
    })

const t = (text: { en: string; zh: string }) => localize(text, currentLanguage.value)

watchEffect(() => {
  if (study.value) {
    setPageMeta({
      title: `${t(study.value.title)} — Nathan Shan`,
      description: t(study.value.summary),
      path: `/case-studies/${study.value.slug}`,
    })
  }
})
</script>

<template>
  <main v-if="study" class="case-page">
    <header :class="['case-hero', `accent-${study.accent}`]">
      <div class="shell">
        <RouterLink class="case-back" :to="{ path: '/', hash: '#work' }">← {{ copy.back }}</RouterLink>
        <div class="case-hero__grid">
          <div>
            <p class="eyebrow">{{ t(study.kind) }} · {{ study.period }}</p>
            <h1>{{ t(study.title) }}</h1>
          </div>
          <div class="case-intro">
            <p class="case-thesis">{{ t(study.thesis) }}</p>
            <p>{{ t(study.summary) }}</p>
            <a v-if="study.sourceUrl" class="text-link" :href="study.sourceUrl" target="_blank" rel="noopener noreferrer">
              {{ copy.source }} ↗
            </a>
          </div>
        </div>
        <figure v-if="study.image" class="case-hero__media">
          <img :src="study.image" :alt="`${study.title.en} application interface`" width="1280" height="720" />
          <figcaption>{{ currentLanguage === 'zh' ? '实际应用界面 · Gradio 本地工作台' : 'Actual application interface · local Gradio workspace' }}</figcaption>
        </figure>
      </div>
    </header>

    <section class="case-section evidence-section" :aria-labelledby="`${study.slug}-evidence`">
      <div class="shell">
        <p :id="`${study.slug}-evidence`" class="mono-label">01 / {{ copy.evidence }}</p>
        <div class="evidence-grid">
          <article v-for="item in study.evidence" :key="item.value">
            <strong>{{ item.value }}</strong>
            <h2>{{ t(item.label) }}</h2>
            <p>{{ t(item.detail) }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="case-section">
      <div class="shell case-two-column">
        <div>
          <p class="mono-label">02 / {{ copy.challenge }}</p>
          <h2>{{ copy.challenge }}</h2>
        </div>
        <div class="case-prose">
          <p class="lead">{{ t(study.challenge) }}</p>
          <h3>{{ copy.constraints }}</h3>
          <ul class="constraint-list">
            <li v-for="constraint in study.constraints" :key="constraint.en">{{ t(constraint) }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="case-section architecture-section">
      <div class="shell">
        <div class="case-section-heading">
          <p class="mono-label">03 / {{ copy.architecture }}</p>
          <h2>{{ copy.architecture }}</h2>
        </div>
        <ol class="architecture-flow">
          <li v-for="(step, index) in study.architecture" :key="step.key">
            <span>0{{ index + 1 }}</span>
            <h3>{{ t(step.label) }}</h3>
            <p>{{ t(step.detail) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="case-section">
      <div class="shell">
        <div class="case-section-heading">
          <p class="mono-label">04 / {{ copy.decisions }}</p>
          <h2>{{ copy.decisions }}</h2>
        </div>
        <div class="decision-grid">
          <article v-for="(decision, index) in study.decisions" :key="decision.title.en">
            <span>0{{ index + 1 }}</span>
            <h3>{{ t(decision.title) }}</h3>
            <p>{{ t(decision.body) }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="case-section outcome-section">
      <div class="shell case-two-column">
        <div>
          <p class="mono-label">05 / {{ copy.outcomes }}</p>
          <h2>{{ copy.outcomes }}</h2>
        </div>
        <div>
          <ul class="outcome-list">
            <li v-for="outcome in study.outcomes" :key="outcome.en">{{ t(outcome) }}</li>
          </ul>
          <div class="stack-block">
            <p class="mono-label">{{ copy.stack }}</p>
            <ul class="tag-list">
              <li v-for="item in study.stack" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <nav class="case-next" aria-label="Case study navigation">
      <div class="shell">
        <RouterLink :to="{ path: '/', hash: '#work' }">← {{ copy.back }}</RouterLink>
        <a href="mailto:nathanshanusa@gmail.com">{{ currentLanguage === 'zh' ? '讨论类似系统' : 'Discuss a similar system' }} →</a>
      </div>
    </nav>
  </main>

  <main v-else class="missing-case shell">
    <p class="eyebrow">404 / Case study</p>
    <h1>{{ copy.missing }}</h1>
    <RouterLink class="button" to="/">{{ copy.home }}</RouterLink>
  </main>
</template>

<style scoped>
.case-page {
  padding-top: 72px;
}

.case-hero {
  --case-accent: var(--blue);
  --case-soft: var(--blue-soft);
  padding: 76px 0 88px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(135deg, var(--case-soft), rgba(255, 255, 255, 0.44) 64%);
}

.case-hero.accent-teal {
  --case-accent: var(--teal);
  --case-soft: var(--teal-soft);
}

.case-hero.accent-amber {
  --case-accent: var(--amber);
  --case-soft: var(--amber-soft);
}

.case-hero .eyebrow,
.case-hero .mono-label {
  color: var(--case-accent);
}

.case-back {
  display: inline-block;
  margin-bottom: 64px;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.72rem;
  text-underline-offset: 4px;
}

.case-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: clamp(48px, 9vw, 120px);
  align-items: end;
}

.case-hero h1 {
  max-width: 760px;
  margin: 22px 0 0;
  font-size: clamp(3.4rem, 7vw, 7.6rem);
  line-height: 0.9;
}

.case-thesis {
  color: var(--ink) !important;
  font-family: var(--display);
  font-size: clamp(1.45rem, 2.4vw, 2rem) !important;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.3 !important;
}

.case-intro > p {
  color: var(--muted);
  font-size: 1.02rem;
}

.case-hero__media {
  margin: 70px 0 0;
  border: 1px solid var(--line-strong);
  background: #0d1118;
  box-shadow: 12px 12px 0 color-mix(in srgb, var(--case-accent), transparent 78%);
}

.case-hero__media img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: top left;
}

.case-hero__media figcaption {
  padding: 10px 13px;
  color: #687384;
  background: var(--paper);
  font-family: var(--mono);
  font-size: 0.62rem;
}

.case-section {
  padding: 96px 0;
  border-bottom: 1px solid var(--line);
}

.evidence-section {
  padding: 44px 0 74px;
  background: var(--ink);
}

.evidence-section .mono-label {
  margin-bottom: 30px;
  color: #7e8da4;
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.evidence-grid article {
  padding: 8px 32px 8px 0;
  border-right: 1px solid #303845;
}

.evidence-grid article + article {
  padding-left: 32px;
}

.evidence-grid article:last-child {
  border: 0;
}

.evidence-grid strong {
  display: block;
  margin-bottom: 16px;
  color: #f4f7fb;
  font-family: var(--display);
  font-size: clamp(2.7rem, 5vw, 5rem);
  line-height: 1;
}

.evidence-grid h2 {
  margin-bottom: 5px;
  color: #e4e9f0;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.evidence-grid p {
  margin: 0;
  color: #8f9bad;
  font-size: 0.86rem;
}

.case-two-column {
  display: grid;
  grid-template-columns: minmax(220px, 0.65fr) minmax(0, 1.35fr);
  gap: clamp(48px, 9vw, 130px);
}

.case-section h2 {
  max-width: 560px;
  margin: 17px 0 0;
  font-size: clamp(2.4rem, 5vw, 4.9rem);
  line-height: 0.98;
}

.case-prose .lead {
  margin-bottom: 45px;
  color: var(--ink);
  font-family: var(--display);
  font-size: clamp(1.35rem, 2.3vw, 1.95rem);
  letter-spacing: -0.025em;
  line-height: 1.42;
}

.case-prose h3 {
  margin-bottom: 16px;
  font-size: 1rem;
}

.constraint-list,
.outcome-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.constraint-list li,
.outcome-list li {
  position: relative;
  padding: 17px 0 17px 28px;
  border-top: 1px solid var(--line);
  color: var(--muted);
}

.constraint-list li:last-child,
.outcome-list li:last-child {
  border-bottom: 1px solid var(--line);
}

.constraint-list li::before,
.outcome-list li::before {
  position: absolute;
  top: 20px;
  left: 3px;
  color: var(--blue);
  font-family: var(--mono);
  content: '→';
}

.architecture-section {
  background: var(--paper-deep);
}

.case-section-heading {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: end;
  margin-bottom: 55px;
}

.architecture-flow {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0;
  margin: 0;
  counter-reset: flow;
  list-style: none;
}

.architecture-flow li {
  position: relative;
  min-height: 192px;
  padding: 21px 20px;
  border: 1px solid var(--line-strong);
  background: rgba(255, 255, 255, 0.5);
}

.architecture-flow li + li {
  border-left: 0;
}

.architecture-flow li:not(:last-child)::after {
  position: absolute;
  top: 50%;
  right: -9px;
  z-index: 2;
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border-radius: 50%;
  color: white;
  background: var(--blue);
  content: '›';
  transform: translateY(-50%);
}

.architecture-flow span,
.decision-grid span {
  color: var(--blue);
  font-family: var(--mono);
  font-size: 0.67rem;
}

.architecture-flow h3 {
  margin: 48px 0 7px;
  font-size: 1.02rem;
}

.architecture-flow p {
  margin: 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.decision-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.decision-grid article {
  min-height: 280px;
  padding: 28px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.55);
}

.decision-grid h3 {
  margin: 65px 0 12px;
  font-size: 1.35rem;
}

.decision-grid p {
  margin: 0;
  color: var(--muted);
}

.outcome-section {
  background: rgba(255, 255, 255, 0.5);
}

.stack-block {
  margin-top: 48px;
}

.stack-block .mono-label {
  margin-bottom: 14px;
}

.case-next {
  padding: 36px 0;
  color: var(--white);
  background: var(--ink);
}

.case-next .shell {
  display: flex;
  justify-content: space-between;
  gap: 30px;
}

.case-next a {
  color: #d9e0ea;
  font-family: var(--mono);
  font-size: 0.75rem;
  text-underline-offset: 5px;
}

.missing-case {
  min-height: calc(100vh - 72px);
  padding-top: 200px;
}

.missing-case h1 {
  max-width: 700px;
  margin: 25px 0 40px;
  font-size: clamp(3rem, 7vw, 6.5rem);
  line-height: 0.95;
}

@media (max-width: 850px) {
  .case-hero__grid,
  .case-two-column {
    grid-template-columns: 1fr;
  }

  .case-back {
    margin-bottom: 45px;
  }

  .evidence-grid,
  .decision-grid {
    grid-template-columns: 1fr;
  }

  .evidence-grid article,
  .evidence-grid article + article {
    padding: 24px 0;
    border-right: 0;
    border-bottom: 1px solid #303845;
  }

  .architecture-flow {
    grid-template-columns: 1fr;
  }

  .architecture-flow li + li {
    border-top: 0;
    border-left: 1px solid var(--line-strong);
  }

  .architecture-flow li:not(:last-child)::after {
    top: auto;
    right: 50%;
    bottom: -9px;
    transform: translateX(50%) rotate(90deg);
  }
}

@media (max-width: 560px) {
  .case-hero {
    padding-top: 55px;
  }

  .case-hero h1 {
    font-size: clamp(3rem, 16vw, 5rem);
  }

  .case-section {
    padding: 74px 0;
  }

  .case-section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .case-next .shell {
    flex-direction: column;
  }
}
</style>

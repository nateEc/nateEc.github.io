<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const content = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '工作方法',
      title: '可靠性不是收尾工作。它就是产品。',
      bio: '我是单玉昆（Nathan），波士顿大学计算机科学学士，目前在北京的目的涌现科技担任 AI Agent 开发工程师。我的工作横跨 Skill 学习与路由、评测和回归基础设施、桌面 Agent，以及招聘与语音 AI 工作流。此前在意仕腾，我负责 AI 算法与实时语音后端系统。',
      caption: 'Nathan Shan · Beijing · 2026',
      principles: [
        { index: '01', title: '先让失败可见', text: '运行轨迹、稳定字段和责任边界，是迭代 Agent 的起点。' },
        { index: '02', title: '用回放替代猜测', text: '真实路径必须能重现，变更必须能和基线一起被审核。' },
        { index: '03', title: '把边界做进产品', text: '隐私、成本、幂等和 fallback 都应成为设计的一部分。' },
      ],
    }
  : {
      kicker: 'Working principles',
      title: 'Reliability is not polish. It is the product.',
      bio: 'I’m Nathan Shan, a Boston University Computer Science graduate and an AI Agent Engineer at VisionFlow AI in Beijing. My work spans skill learning and routing, evaluation and regression infrastructure, desktop agents, and recruiting and voice workflows. Previously at Iston AI, I built AI algorithm and real-time voice backend systems.',
      caption: 'Nathan Shan · Beijing · 2026',
      principles: [
        { index: '01', title: 'Make failure visible', text: 'Runtime traces, stable signals, and explicit ownership are the starting point for improving an agent.' },
        { index: '02', title: 'Replay before guessing', text: 'Real paths should be reproducible, and every change should be reviewable beside its baseline.' },
        { index: '03', title: 'Design the boundaries', text: 'Privacy, cost, idempotency, and fallback behavior belong inside the product model.' },
      ],
    })
</script>

<template>
  <section id="about" class="section about" aria-labelledby="about-title">
    <div class="shell">
      <div class="section-heading">
        <p class="eyebrow">{{ content.kicker }}</p>
        <h2 id="about-title">{{ content.title }}</h2>
      </div>

      <div class="about-grid">
        <figure class="portrait-card">
          <div class="portrait-frame">
            <img src="/images/portrait.JPG" alt="Nathan Shan" width="760" height="950" loading="lazy" />
          </div>
          <figcaption>{{ content.caption }}</figcaption>
        </figure>

        <div class="about-body">
          <p class="bio">{{ content.bio }}</p>
          <ol class="principles">
            <li v-for="principle in content.principles" :key="principle.index">
              <span>{{ principle.index }}</span>
              <div>
                <h3>{{ principle.title }}</h3>
                <p>{{ principle.text }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: rgba(255, 255, 255, 0.48);
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.68fr) minmax(0, 1.32fr);
  gap: clamp(46px, 8vw, 112px);
  align-items: start;
}

.portrait-card {
  margin: 0;
}

.portrait-frame {
  position: relative;
  border: 1px solid var(--line-strong);
  background: var(--paper-deep);
}

.portrait-frame::after {
  position: absolute;
  right: -10px;
  bottom: -10px;
  z-index: -1;
  width: 56%;
  height: 58%;
  background: var(--blue);
  content: '';
}

.portrait-frame img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.02);
}

.portrait-card figcaption {
  margin-top: 15px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.68rem;
}

.bio {
  max-width: 760px;
  margin-bottom: 48px;
  color: var(--ink);
  font-family: var(--display);
  font-size: clamp(1.35rem, 2.3vw, 2rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.38;
}

.principles {
  padding: 0;
  margin: 0;
  list-style: none;
}

.principles li {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 22px;
  padding: 23px 0;
  border-top: 1px solid var(--line);
}

.principles li:last-child {
  border-bottom: 1px solid var(--line);
}

.principles > li > span {
  padding-top: 4px;
  color: var(--blue);
  font-family: var(--mono);
  font-size: 0.68rem;
}

.principles h3 {
  margin-bottom: 7px;
  font-size: 1.15rem;
}

.principles p {
  max-width: 640px;
  margin-bottom: 0;
  color: var(--muted);
}

@media (max-width: 760px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .portrait-card {
    max-width: 430px;
  }
}
</style>

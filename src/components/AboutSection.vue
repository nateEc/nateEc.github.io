<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()
const linkedInUrl = 'https://www.linkedin.com/in/yukun-shan-803a02225/'

const handlePortraitPointerMove = (event: PointerEvent) => {
  if (event.pointerType !== 'mouse') return

  const target = event.currentTarget as HTMLElement
  const bounds = target.getBoundingClientRect()
  const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
  const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))

  target.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`)
  target.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`)
  target.style.setProperty('--pointer-x', `${x * 100}%`)
  target.style.setProperty('--pointer-y', `${y * 100}%`)
}

const handlePortraitPointerLeave = (event: PointerEvent) => {
  const target = event.currentTarget as HTMLElement
  target.style.removeProperty('--tilt-x')
  target.style.removeProperty('--tilt-y')
  target.style.removeProperty('--pointer-x')
  target.style.removeProperty('--pointer-y')
}

const content = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '工作方法',
      title: '可靠性不是收尾工作。它就是产品。',
      bio: '我是单玉昆（Nathan），波士顿大学计算机科学学士，目前在北京的目的涌现科技担任 AI Agent 开发工程师。我的工作横跨 Skill 学习与路由、评测和回归基础设施、桌面 Agent，以及招聘与语音 AI 工作流。此前在意仕腾，我负责 AI 算法与实时语音后端系统。',
      caption: 'Nathan Shan · Beijing · 2026',
      photoAlt: 'Nathan Shan 的 LinkedIn 头像',
      profileLabel: '在 LinkedIn 上查看 Nathan Shan 的个人主页',
      profileKicker: '职业网络',
      profileAction: '在 LinkedIn 上联系我',
      profileHint: '打开 LinkedIn 主页 ↗',
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
      photoAlt: 'Nathan Shan’s LinkedIn portrait',
      profileLabel: 'View Nathan Shan’s profile on LinkedIn',
      profileKicker: 'Professional network',
      profileAction: 'Connect on LinkedIn',
      profileHint: 'Open LinkedIn profile ↗',
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
          <a
            class="portrait-link"
            :href="linkedInUrl"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="content.profileLabel"
            @pointermove="handlePortraitPointerMove"
            @pointerleave="handlePortraitPointerLeave"
          >
            <span class="portrait-frame">
              <img
                src="/images/linkedin-avatar.webp"
                :alt="content.photoAlt"
                width="1200"
                height="1200"
                loading="lazy"
                decoding="async"
              />
              <span class="linkedin-panel" aria-hidden="true">
                <svg class="linkedin-logo" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.54V8.98H7.1v11.47Z" />
                </svg>
                <span class="linkedin-kicker">{{ content.profileKicker }}</span>
                <strong class="linkedin-action">{{ content.profileAction }} <span>↗</span></strong>
              </span>
            </span>
          </a>
          <figcaption>
            <span>{{ content.caption }}</span>
            <span class="portrait-hint">{{ content.profileHint }}</span>
          </figcaption>
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

.portrait-link {
  --pointer-x: 72%;
  --pointer-y: 28%;
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  position: relative;
  display: block;
  color: var(--white);
  text-decoration: none;
  isolation: isolate;
  transform: perspective(900px) rotateX(0deg) rotateY(0deg);
  transform-style: preserve-3d;
  transition: transform 260ms cubic-bezier(0.2, 0.75, 0.25, 1), filter 260ms ease;
  will-change: transform;
}

.portrait-link::after {
  position: absolute;
  inset: 10px -10px -10px 10px;
  z-index: -1;
  background: var(--blue);
  content: '';
  transition: transform 260ms ease, background 260ms ease;
}

.portrait-frame {
  position: relative;
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  background: var(--paper-deep);
  isolation: isolate;
}

.portrait-link:hover,
.portrait-link:focus-visible {
  transform: perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateY(-6px);
  filter: drop-shadow(0 24px 26px rgba(10, 102, 194, 0.18));
}

.portrait-link:hover::after,
.portrait-link:focus-visible::after {
  background: #0a66c2;
  transform: translate(4px, 4px);
}

.portrait-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
  filter: saturate(0.92) contrast(1.03);
  transition: transform 520ms cubic-bezier(0.2, 0.75, 0.25, 1), filter 420ms ease, opacity 320ms ease;
}

.linkedin-panel {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  color: var(--white);
  background:
    radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(255, 255, 255, 0.27), transparent 28%),
    linear-gradient(145deg, #0a66c2 0%, #004182 100%);
  clip-path: inset(calc(100% - 72px) 0 0 calc(100% - 72px));
  transition: clip-path 480ms cubic-bezier(0.76, 0, 0.24, 1);
}

.linkedin-panel::before {
  position: absolute;
  inset: 0;
  opacity: 0.24;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size: 36px 36px;
  content: '';
}

.linkedin-panel::after {
  position: absolute;
  top: -28%;
  right: 0;
  left: 0;
  height: 24%;
  opacity: 0;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.28), transparent);
  content: '';
}

.linkedin-logo {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 2;
  width: 36px;
  height: 36px;
  transition:
    right 480ms cubic-bezier(0.76, 0, 0.24, 1),
    bottom 480ms cubic-bezier(0.76, 0, 0.24, 1),
    width 480ms cubic-bezier(0.76, 0, 0.24, 1),
    height 480ms cubic-bezier(0.76, 0, 0.24, 1),
    transform 480ms cubic-bezier(0.76, 0, 0.24, 1);
}

.linkedin-kicker,
.linkedin-action {
  position: absolute;
  z-index: 2;
  left: 24px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 180ms ease, transform 260ms ease;
}

.linkedin-kicker {
  top: 24px;
  font-family: var(--mono);
  font-size: 0.67rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.linkedin-action {
  right: 24px;
  bottom: 23px;
  font-family: var(--display);
  font-size: clamp(1.05rem, 2vw, 1.4rem);
  letter-spacing: -0.03em;
}

.linkedin-action span {
  display: inline-block;
  margin-left: 4px;
  transition: transform 180ms ease;
}

.portrait-link:hover .portrait-frame img,
.portrait-link:focus-visible .portrait-frame img {
  opacity: 0.18;
  filter: saturate(0.4) blur(3px);
  transform: scale(1.08);
}

.portrait-link:hover .linkedin-panel,
.portrait-link:focus-visible .linkedin-panel {
  clip-path: inset(0);
}

.portrait-link:hover .linkedin-panel::after,
.portrait-link:focus-visible .linkedin-panel::after {
  opacity: 1;
  animation: linkedin-scan 1.1s 180ms ease-out both;
}

.portrait-link:hover .linkedin-logo,
.portrait-link:focus-visible .linkedin-logo {
  right: 50%;
  bottom: 50%;
  width: 92px;
  height: 92px;
  transform: translate(50%, 50%);
}

.portrait-link:hover .linkedin-kicker,
.portrait-link:hover .linkedin-action,
.portrait-link:focus-visible .linkedin-kicker,
.portrait-link:focus-visible .linkedin-action {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 260ms;
}

.portrait-link:hover .linkedin-action span,
.portrait-link:focus-visible .linkedin-action span {
  transform: translate(3px, -3px);
}

.portrait-card figcaption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px 18px;
  margin-top: 15px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.68rem;
}

.portrait-hint {
  color: #0a66c2;
  font-weight: 600;
}

@keyframes linkedin-scan {
  from { transform: translateY(0); }
  to { transform: translateY(530%); }
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

@media (prefers-reduced-motion: reduce) {
  .portrait-link,
  .portrait-link::after,
  .portrait-frame img,
  .linkedin-panel,
  .linkedin-logo,
  .linkedin-kicker,
  .linkedin-action,
  .linkedin-action span {
    transition-duration: 1ms;
  }

  .portrait-link:hover,
  .portrait-link:focus-visible {
    transform: none;
  }

  .linkedin-panel::after {
    display: none;
  }
}
</style>

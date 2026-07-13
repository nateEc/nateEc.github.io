<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

type SignalKey = 'idle' | 'profile' | 'skills' | 'evals' | 'desktop' | 'voice' | 'resume' | 'projects' | 'blog'

const typedText = ref('')
const heroRef = ref<HTMLElement | null>(null)
const cursorX = ref(0)
const cursorY = ref(0)
const activeSignal = ref<SignalKey>('idle')
const phrasesEn = [
  'AI Agent Engineer at VisionFlow AI,',
  'building reliable agent systems and evaluation infrastructure',
  'Boston University Computer Science graduate'
]
const phrasesZh = [
  '我在 VisionFlow AI 从事 AI Agent 开发，',
  '构建可靠的 Agent 系统与评测基础设施',
  '波士顿大学计算机科学毕业生'
]

const phrases = computed(() => currentLanguage.value === 'zh' ? phrasesZh : phrasesEn)
const resumeLink = '/resume-zh.pdf'
const cvButtonText = computed(() => currentLanguage.value === 'zh' ? '查看简历' : 'Chinese CV')
const projectsButtonText = computed(() => currentLanguage.value === 'zh' ? '查看项目' : 'View Projects')
const blogButtonText = computed(() => currentLanguage.value === 'zh' ? '读 Blog' : 'Read Blog')
let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let animationFrameId: number | undefined

watch(currentLanguage, () => {
  typedText.value = ''
  phraseIndex = 0
  charIndex = 0
  isDeleting = false
})

onMounted(() => {
  setTimeout(() => {
    typeText()
  }, 500)

  window.addEventListener('mousemove', handlePointerMove)
  animationFrameId = window.requestAnimationFrame(animateCursor)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handlePointerMove)
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId)
  }
})

function typeText() {
  const currentPhrase = phrases.value[phraseIndex]
  if (!currentPhrase) return
  
  if (isDeleting) {
    typedText.value = currentPhrase.substring(0, charIndex - 1)
    charIndex--
  } else {
    typedText.value = currentPhrase.substring(0, charIndex + 1)
    charIndex++
  }
  
  if (!isDeleting && charIndex === currentPhrase.length) {
    setTimeout(() => {
      isDeleting = true
      typeText()
    }, 2000)
    return
  }
  
  if (isDeleting && charIndex === 0) {
    isDeleting = false
    phraseIndex = (phraseIndex + 1) % phrases.value.length
  }
  
  const speed = isDeleting ? 35 : 50
  setTimeout(typeText, speed)
}

function handlePointerMove(event: MouseEvent) {
  const rect = heroRef.value?.getBoundingClientRect()
  if (!rect) return

  targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  targetX = Math.max(-1, Math.min(1, targetX))
  targetY = Math.max(-1, Math.min(1, targetY))
}

function animateCursor() {
  currentX += (targetX - currentX) * 0.08
  currentY += (targetY - currentY) * 0.08
  cursorX.value = currentX
  cursorY.value = currentY
  animationFrameId = window.requestAnimationFrame(animateCursor)
}

function setSignal(signal: SignalKey) {
  activeSignal.value = signal
}

const coreStyle = computed(() => ({
  transform: `perspective(900px) rotateX(${(-cursorY.value * 8).toFixed(2)}deg) rotateY(${(cursorX.value * 10).toFixed(2)}deg) translate3d(${(cursorX.value * 14).toFixed(1)}px, ${(cursorY.value * 10).toFixed(1)}px, 0)`
}))

const visualStyle = computed(() => ({
  transform: `translate3d(${(cursorX.value * 6).toFixed(1)}px, ${(cursorY.value * 4).toFixed(1)}px, 0)`
}))

const nodeDriftStyle = (index: number) => ({
  transform: `translate3d(${(cursorX.value * (8 + index * 2)).toFixed(1)}px, ${(cursorY.value * (6 + index)).toFixed(1)}px, 0)`
})

const agentNodes = computed(() => [
  {
    key: 'skills' as SignalKey,
    label: 'Skills',
    detail: currentLanguage.value === 'zh' ? '沉淀与路由' : 'skill routing'
  },
  {
    key: 'evals' as SignalKey,
    label: 'Evals',
    detail: currentLanguage.value === 'zh' ? '回归评测' : 'regression'
  },
  {
    key: 'desktop' as SignalKey,
    label: 'Desktop',
    detail: currentLanguage.value === 'zh' ? 'Agent 基建' : 'agent tooling'
  },
  {
    key: 'voice' as SignalKey,
    label: 'ASR/TTS',
    detail: currentLanguage.value === 'zh' ? '语音链路' : 'voice stack'
  }
])

const signalMessages = computed<Record<SignalKey, string[]>>(() => {
  if (currentLanguage.value === 'zh') {
    return {
      idle: ['agent.boot(profile)', 'load: agent systems + evaluation', 'status: building at VisionFlow AI'],
      profile: ['profile.focus(Nathan)', 'role: AI agent engineer', 'base: Beijing + Boston University'],
      skills: ['skills.observe(runs)', 'policy -> candidate -> confirm', 'result: reusable + privacy-aware'],
      evals: ['evals.capture(failures)', 'replay: real runtime traces', 'judge: stable + reviewable'],
      desktop: ['desktop.launch(agent)', 'electron + codex app server', 'release: signed + observable'],
      voice: ['voice.run(interview)', 'asr -> agent -> feedback', 'session: resilient + resumable'],
      resume: ['resume.open()', 'profile: Nathan Shan', 'signal: AI agent engineer'],
      projects: ['projects.scan()', 'filter: agents, desktop, product', 'open: selected case studies'],
      blog: ['blog.open(notes)', 'topics: harness, eval, skill sediment', 'mode: long-form system thinking']
    }
  }

  return {
    idle: ['agent.boot(profile)', 'load: agent systems + evaluation', 'status: building at VisionFlow AI'],
    profile: ['profile.focus(Nathan)', 'role: AI agent engineer', 'base: Beijing + Boston University'],
    skills: ['skills.observe(runs)', 'policy -> candidate -> confirm', 'result: reusable + privacy-aware'],
    evals: ['evals.capture(failures)', 'replay: real runtime traces', 'judge: stable + reviewable'],
    desktop: ['desktop.launch(agent)', 'electron + codex app server', 'release: signed + observable'],
    voice: ['voice.run(interview)', 'asr -> agent -> feedback', 'session: resilient + resumable'],
    resume: ['resume.open()', 'profile: Nathan Shan', 'signal: AI agent engineer'],
    projects: ['projects.scan()', 'filter: agents, desktop, product', 'open: selected case studies'],
    blog: ['blog.open(notes)', 'topics: harness, eval, skill sediment', 'mode: long-form system thinking']
  }
})

const terminalLines = computed(() => signalMessages.value[activeSignal.value])
</script>

<template>
  <section id="home" ref="heroRef" class="hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            {{ currentLanguage === 'zh' ? '你好，我是' : "Hi, I'm" }}<br />
            <span class="name">{{ currentLanguage === 'zh' ? '单玉昆 (Nathan)' : 'Yukun (Nathan) Shan' }}</span>
          </h1>
          <p class="hero-subtitle">{{ typedText }}<span class="cursor">|</span></p>
          <div class="hero-actions">
            <a
              :href="resumeLink"
              target="_blank"
              class="cv-button"
              @mouseenter="setSignal('resume')"
              @mouseleave="setSignal('idle')"
            >
              {{ cvButtonText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>
            <a
              href="#portfolio"
              class="project-button"
              @mouseenter="setSignal('projects')"
              @mouseleave="setSignal('idle')"
            >
              {{ projectsButtonText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="M13 5l7 7-7 7"></path>
              </svg>
            </a>
            <a
              href="#blog"
              class="blog-button"
              @mouseenter="setSignal('blog')"
              @mouseleave="setSignal('idle')"
            >
              {{ blogButtonText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path>
              </svg>
            </a>
          </div>
        </div>

        <div class="hero-agent" :style="visualStyle" aria-label="Interactive AI agent visualization">
          <div class="agent-stage">
            <div class="agent-grid"></div>
            <button
              v-for="(node, index) in agentNodes"
              :key="node.key"
              :class="['agent-node', `node-${node.key}`, { active: activeSignal === node.key }]"
              :style="nodeDriftStyle(index)"
              type="button"
              @mouseenter="setSignal(node.key)"
              @mouseleave="setSignal('idle')"
            >
              <span>{{ node.label }}</span>
              <small>{{ node.detail }}</small>
            </button>

            <div
              class="portrait-module"
              :style="coreStyle"
              @mouseenter="setSignal('profile')"
              @mouseleave="setSignal('idle')"
            >
              <div class="portrait-glow"></div>
              <img src="/images/me.png" alt="Yukun Nathan Shan" />
              <div class="portrait-label">
                <span>Nathan Shan</span>
                <small>{{ currentLanguage === 'zh' ? 'AI Agent 开发工程师' : 'AI Agent Engineer' }}</small>
              </div>
            </div>

            <div class="agent-core">
              <div class="core-ring ring-one"></div>
              <div class="core-ring ring-two"></div>
              <div class="core-chip">
                <span>AI</span>
                <small>agent core</small>
              </div>
              <div class="core-eye">
                <span></span>
              </div>
            </div>
          </div>

          <div class="agent-terminal">
            <div class="terminal-bar">
              <span></span>
              <span></span>
              <span></span>
              <p>nathan.agent</p>
            </div>
            <div class="terminal-lines">
              <p v-for="line in terminalLines" :key="line">
                <span>›</span>{{ line }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
  overflow: hidden;
  position: relative;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}

.hero-text {
  max-width: 640px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.name {
  display: inline-block;
  background: linear-gradient(135deg, var(--accent-color), #0099ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--secondary-color);
  margin-bottom: 2rem;
  min-height: 2em;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-wrap: wrap;
}

.cursor {
  display: inline-block;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cv-button,
.project-button,
.blog-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cv-button {
  background-color: var(--text-color);
  color: var(--bg-color);
  border: 2px solid var(--text-color);
}

.project-button {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.blog-button {
  color: #fff;
  background:
    linear-gradient(135deg, #0f766e, #111 82%);
  border: 1px solid #0f766e;
  box-shadow: 0 12px 26px rgba(15, 118, 110, 0.16);
}

.cv-button:hover,
.project-button:hover,
.blog-button:hover {
  background-color: transparent;
  color: var(--text-color);
  transform: translateY(-2px);
}

.project-button:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.blog-button:hover {
  border-color: #0f766e;
  color: #0f766e;
  box-shadow: none;
}

.cv-button svg,
.project-button svg,
.blog-button svg {
  transition: transform 0.3s ease;
}

.cv-button:hover svg {
  transform: translateY(2px);
}

.project-button:hover svg {
  transform: translateX(3px);
}

.blog-button:hover svg {
  transform: rotate(-5deg) translateY(-1px);
}

.hero-agent {
  width: 100%;
  max-width: 520px;
  will-change: transform;
}

.agent-stage {
  position: relative;
  min-height: 380px;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background:
    linear-gradient(135deg, rgba(0, 102, 255, 0.08), transparent 44%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.035), rgba(0, 0, 0, 0.01));
  overflow: hidden;
}

.agent-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(circle at center, black 0%, transparent 76%);
  opacity: 0.55;
}

.portrait-module {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 47%;
  width: 244px;
  height: 296px;
  margin-left: -138px;
  margin-top: -158px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.75rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.68)),
    radial-gradient(circle at 50% 0%, rgba(0, 102, 255, 0.18), transparent 54%);
  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.62);
  transition: box-shadow 0.25s ease;
  transform-style: preserve-3d;
  will-change: transform;
  overflow: hidden;
}

.portrait-module:hover {
  box-shadow:
    0 30px 78px rgba(0, 102, 255, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.68);
}

.portrait-module img {
  position: absolute;
  inset: 12px 12px 68px;
  width: calc(100% - 24px);
  height: calc(100% - 80px);
  border-radius: 0.55rem;
  object-fit: cover;
  filter: saturate(0.96) contrast(1.04);
}

.portrait-glow {
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(circle at 30% 20%, rgba(0, 102, 255, 0.24), transparent 34%),
    radial-gradient(circle at 72% 78%, rgba(0, 168, 120, 0.18), transparent 36%);
  animation: portraitGlow 7s ease-in-out infinite;
}

.portrait-label {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  min-height: 48px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.55rem 0.7rem;
}

.portrait-label span {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-color);
}

.portrait-label small {
  margin-top: 0.1rem;
  font-size: 0.72rem;
  color: var(--secondary-color);
}

.agent-core {
  position: absolute;
  z-index: 3;
  left: calc(50% + 110px);
  top: calc(47% + 78px);
  width: 132px;
  height: 132px;
  margin-left: -66px;
  margin-top: -66px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 32%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.18) 24%, transparent 42%),
    radial-gradient(circle at center, #141414 0%, #050505 64%, #000 100%);
  box-shadow:
    0 24px 56px rgba(0, 0, 0, 0.28),
    inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  transform-style: preserve-3d;
}

.core-ring {
  position: absolute;
  inset: -14px;
  border: 1px solid rgba(0, 102, 255, 0.32);
  border-radius: 50%;
  animation: ringSpin 12s linear infinite;
}

.ring-two {
  inset: 14px;
  border-color: rgba(0, 180, 130, 0.34);
  animation-duration: 8s;
  animation-direction: reverse;
}

.core-ring::before,
.core-ring::after {
  content: '';
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: var(--accent-color);
}

.core-ring::before {
  top: 14px;
  left: 30px;
}

.core-ring::after {
  right: 22px;
  bottom: 24px;
  background-color: #00a878;
}

.core-chip {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 66px;
  height: 66px;
  margin-left: -33px;
  margin-top: -33px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
}

.core-chip span {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.core-chip small {
  margin-top: 0.2rem;
  font-size: 0.56rem;
  color: rgba(255, 255, 255, 0.62);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.core-eye {
  position: absolute;
  left: 50%;
  bottom: 24px;
  width: 38px;
  height: 10px;
  margin-left: -19px;
  border-radius: 999px;
  background: rgba(0, 102, 255, 0.22);
  overflow: hidden;
}

.core-eye span {
  display: block;
  width: 14px;
  height: 100%;
  border-radius: 999px;
  background-color: #5cc8ff;
  animation: eyeScan 2.2s ease-in-out infinite;
}

.agent-node {
  position: absolute;
  z-index: 2;
  min-width: 112px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 0.5rem;
  padding: 0.75rem 0.85rem;
  background: rgba(255, 255, 255, 0.84);
  color: var(--text-color);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  backdrop-filter: blur(10px);
  will-change: transform;
}

.agent-node span {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
}

.agent-node small {
  display: block;
  margin-top: 0.2rem;
  color: var(--secondary-color);
  font-size: 0.72rem;
}

.agent-node:hover,
.agent-node.active {
  border-color: var(--accent-color);
  color: var(--accent-color);
  box-shadow: 0 12px 28px rgba(0, 102, 255, 0.12);
}

.node-skills {
  top: 34px;
  left: 30px;
}

.node-evals {
  top: 48px;
  right: 28px;
}

.node-desktop {
  left: 40px;
  bottom: 50px;
}

.node-voice {
  right: 34px;
  bottom: 38px;
}

.agent-terminal {
  margin-top: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: #080808;
  color: #d7ffe9;
  overflow: hidden;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.14);
}

.terminal-bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  height: 36px;
  padding: 0 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.62);
}

.terminal-bar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff5f57;
}

.terminal-bar span:nth-child(2) {
  background-color: #ffbd2e;
}

.terminal-bar span:nth-child(3) {
  background-color: #28c840;
}

.terminal-bar p {
  margin-left: 0.45rem;
  font-size: 0.78rem;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
}

.terminal-lines {
  min-height: 112px;
  padding: 1rem;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
}

.terminal-lines p {
  color: rgba(215, 255, 233, 0.9);
  font-size: 0.86rem;
  line-height: 1.8;
}

.terminal-lines span {
  margin-right: 0.65rem;
  color: #5cc8ff;
}

@keyframes ringSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes eyeScan {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(32px);
  }
}

@keyframes portraitGlow {
  0%, 100% {
    transform: translate3d(-8px, -4px, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(8px, 4px, 0) rotate(8deg);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 6rem 1rem 3rem;
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-actions {
    align-items: stretch;
  }

  .cv-button,
  .project-button,
  .blog-button {
    justify-content: center;
    flex: 1 1 160px;
  }

  .hero-agent {
    max-width: 100%;
  }

  .agent-stage {
    min-height: 340px;
  }

  .portrait-module {
    width: 196px;
    height: 238px;
    margin-left: -112px;
    margin-top: -128px;
  }

  .portrait-module img {
    inset: 10px 10px 58px;
    width: calc(100% - 20px);
    height: calc(100% - 68px);
  }

  .agent-core {
    left: calc(50% + 78px);
    top: calc(47% + 66px);
    width: 106px;
    height: 106px;
    margin-left: -53px;
    margin-top: -53px;
  }

  .core-chip {
    width: 54px;
    height: 54px;
    margin-left: -27px;
    margin-top: -27px;
  }

  .agent-node {
    min-width: 96px;
    padding: 0.65rem 0.7rem;
  }

  .node-skills {
    top: 28px;
    left: 18px;
  }

  .node-evals {
    top: 44px;
    right: 16px;
  }

  .node-desktop {
    left: 18px;
    bottom: 38px;
  }

  .node-voice {
    right: 16px;
    bottom: 34px;
  }

  .terminal-lines p {
    font-size: 0.78rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .core-ring,
  .core-eye span,
  .cursor {
    animation: none;
  }
}
</style>

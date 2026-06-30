<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

type LocalizedText = {
  en: string
  zh: string
}

type ProjectLink = {
  type: 'github' | 'view'
  url: string
}

type FeaturedProject = {
  title: string
  period: string
  context: LocalizedText
  role: LocalizedText
  summary: LocalizedText
  image: string
  stack: string[]
  links: ProjectLink[]
}

type ArchiveProject = {
  title: string
  period: string
  summary: LocalizedText
  links: ProjectLink[]
  stack: string[]
}

const sectionTitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return { main: '精选', highlight: '项目' }
  }
  return { main: 'Selected', highlight: 'Projects' }
})

const sectionSubtitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return '按时间展示项目，保留早期作品，同时突出近期 AI / agent / 工具型项目。'
  }
  return 'Time-stamped projects, balancing recent AI and agent work with the earlier projects that shaped the foundation.'
})

const featuredProjects: FeaturedProject[] = [
  {
    title: 'yt-dub-studio',
    period: 'Jun 2026',
    context: {
      en: 'Local AI video dubbing studio',
      zh: '本地 AI 视频配音工作台'
    },
    role: {
      en: 'YouTube pipeline, Gradio workflow, source-voice dubbing, lip-sync integration',
      zh: 'YouTube 流水线、Gradio 工作流、源音色配音、唇形同步集成'
    },
    summary: {
      en: 'A local AI dubbing pipeline that turns English YouTube videos into Chinese dubbed videos with transcription, translation, source-voice TTS, mixing, and optional Wav2Lip lip sync.',
      zh: '本地 AI 视频配音流水线，输入英文 YouTube 链接后串联下载、转写、翻译、源音色中文配音、混音和可选 Wav2Lip 唇形同步。'
    },
    image: '/images/projects/yt-dub-studio-cover.webp',
    stack: ['Python', 'Gradio', 'Whisper', 'CosyVoice', 'Demucs', 'Wav2Lip', 'ffmpeg'],
    links: [
      { type: 'github', url: 'https://github.com/nateEc/yt-dub-studio' }
    ]
  },
  {
    title: 'Candidate Intel Agent',
    period: 'May 2026',
    context: {
      en: 'HR browser agent and talent intelligence system',
      zh: 'HR 浏览器 Agent 与人才索引系统'
    },
    role: {
      en: 'Local browser service, agent workflow, talent library API',
      zh: '本机浏览器服务、Agent 工作流、人才库 API'
    },
    summary: {
      en: 'A local HR agent stack for visible browser control, recruiting workflows, candidate indexing, and pgvector-backed talent search.',
      zh: '本地 HR Agent 技术栈，覆盖可见浏览器控制、招聘流程、候选人索引和 pgvector 人才搜索。'
    },
    image: '/images/projects/candidate-intel-agent-cover.webp',
    stack: ['Python', 'FastAPI', 'Playwright/CDP', 'Postgres', 'pgvector', 'Node.js'],
    links: [
      { type: 'github', url: 'https://github.com/nateEc/candidate-intel-agent' }
    ]
  },
  {
    title: 'DataFlow',
    period: 'Jan 2026',
    context: {
      en: 'AI-native spreadsheet editor',
      zh: 'AI Native 电子表格编辑器'
    },
    role: {
      en: 'Custom spreadsheet UI, AI command parser, diff preview flow',
      zh: '自定义表格 UI、AI 指令解析、Diff 预览流程'
    },
    summary: {
      en: 'A spreadsheet interface with an AI chat panel for natural-language template generation, cell edits, formulas, and previews.',
      zh: '带 AI 聊天面板的电子表格工具，支持自然语言生成模板、编辑单元格、公式和预览变更。'
    },
    image: '/images/projects/dataflow-cover.webp',
    stack: ['React', 'TypeScript', 'Vite', 'LLM', 'Spreadsheet UI', 'Diff Preview'],
    links: [
      { type: 'github', url: 'https://github.com/nateEc/DataFlow' }
    ]
  },
  {
    title: 'Pet Safe',
    period: 'Sep 2023',
    context: {
      en: 'Mobile map prototype',
      zh: '移动端地图原型'
    },
    role: {
      en: 'Ionic React prototype with mobile routing and Mapbox-style map layer',
      zh: 'Ionic React 原型，包含移动端路由和地图层'
    },
    summary: {
      en: 'A mobile-first prototype exploring pet-friendly location discovery with Capacitor, Ionic React, and map interactions.',
      zh: '移动优先原型，探索用 Capacitor、Ionic React 和地图交互做宠物友好地点发现。'
    },
    image: '/images/projects/pet-safe-cover.webp',
    stack: ['Ionic React', 'Capacitor', 'TypeScript', 'Mapbox', 'React Router'],
    links: [
      { type: 'github', url: 'https://github.com/nateEc/pet-safe' }
    ]
  },
  {
    title: 'Markdown Notes App',
    period: 'Jul 2022',
    context: {
      en: 'Early React productivity tool',
      zh: '早期 React 生产力工具'
    },
    role: {
      en: 'Markdown editing, preview layout, note workflow',
      zh: 'Markdown 编辑、预览布局、笔记工作流'
    },
    summary: {
      en: 'A lightweight markdown note-taking app built around split-pane editing, preview, and local note organization.',
      zh: '轻量 Markdown 笔记应用，围绕分栏编辑、实时预览和本地笔记组织构建。'
    },
    image: '/images/projects/markdown-notes-cover.webp',
    stack: ['React', 'React-MDE', 'Showdown', 'Webpack', 'nanoid'],
    links: [
      { type: 'github', url: 'https://github.com/nateEc/Markdown-Notes-App' }
    ]
  }
]

const archiveProjects: ArchiveProject[] = [
  {
    title: 'CS506 Assignments',
    period: 'Fall 2024',
    summary: {
      en: 'Coursework collection from CS506 with Python and notebook-based assignments.',
      zh: 'CS506 课程作业集合，包含 Python 与 notebook 类型任务。'
    },
    links: [{ type: 'view', url: '/assignments.html' }],
    stack: ['Python', 'Jupyter', 'Coursework']
  },
  {
    title: 'Task Manager',
    period: 'Dec 2022',
    summary: {
      en: 'Node, Express, MongoDB task backend built during early full-stack practice.',
      zh: '早期全栈练习项目，使用 Node、Express 和 MongoDB 实现任务管理后端。'
    },
    links: [{ type: 'github', url: 'https://github.com/nateEc/Task-Manager' }],
    stack: ['Node.js', 'Express', 'MongoDB']
  },
  {
    title: 'Tour in China',
    period: 'Nov 2023',
    summary: {
      en: 'Static travel site built with HTML, CSS, JavaScript, and Bootstrap.',
      zh: '使用 HTML、CSS、JavaScript 和 Bootstrap 构建的旅行主题静态网站。'
    },
    links: [
      { type: 'view', url: 'https://cs-people.bu.edu/yshan/cs103/finalProject/' },
      { type: 'github', url: 'https://github.com/nateEc/Tour-in-China' }
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'Bootstrap']
  }
]

const localized = (text: LocalizedText) => {
  return currentLanguage.value === 'zh' ? text.zh : text.en
}

const linkLabel = (type: ProjectLink['type']) => {
  if (currentLanguage.value === 'zh') {
    return type === 'github' ? '代码' : '查看'
  }
  return type === 'github' ? 'Code' : 'View'
}
</script>

<template>
  <section id="portfolio" class="portfolio-section">
    <div class="container">
      <div class="section-heading">
        <p class="section-kicker">{{ currentLanguage === 'zh' ? '按时间排序' : 'Time-stamped work' }}</p>
        <h2 class="section-title">{{ sectionTitle.main }} <span>{{ sectionTitle.highlight }}</span></h2>
        <p class="section-subtitle">{{ sectionSubtitle }}</p>
      </div>

      <div class="featured-grid">
        <article v-for="project in featuredProjects" :key="project.title" class="featured-card">
          <div class="project-cover">
            <img :src="project.image" :alt="`${project.title} cover`" loading="lazy" />
            <span class="project-period">{{ project.period }}</span>
          </div>

          <div class="project-body">
            <div class="project-meta">
              <span>{{ localized(project.context) }}</span>
            </div>
            <h3>{{ project.title }}</h3>
            <p class="project-summary">{{ localized(project.summary) }}</p>

            <div class="project-role">
              <span>{{ currentLanguage === 'zh' ? '角色' : 'Role' }}</span>
              <p>{{ localized(project.role) }}</p>
            </div>

            <div class="stack-list">
              <span v-for="item in project.stack" :key="item">{{ item }}</span>
            </div>

            <div class="project-links">
              <a
                v-for="link in project.links"
                :key="link.url"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
              >
                {{ linkLabel(link.type) }}
                <svg v-if="link.type === 'github'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="M13 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </article>
      </div>

      <div class="archive-section">
        <div class="archive-heading">
          <h3>{{ currentLanguage === 'zh' ? '早期项目归档' : 'Earlier Archive' }}</h3>
          <p>{{ currentLanguage === 'zh' ? '保留原有项目，但用更轻量的方式展示。' : 'Original projects kept in a lighter format.' }}</p>
        </div>

        <div class="archive-list">
          <article v-for="project in archiveProjects" :key="project.title" class="archive-card">
            <div>
              <span class="archive-period">{{ project.period }}</span>
              <h4>{{ project.title }}</h4>
              <p>{{ localized(project.summary) }}</p>
            </div>

            <div class="archive-footer">
              <div class="archive-stack">
                <span v-for="item in project.stack" :key="item">{{ item }}</span>
              </div>
              <div class="archive-links">
                <a
                  v-for="link in project.links"
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ linkLabel(link.type) }}
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-section {
  min-height: auto;
  padding: 5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background:
    linear-gradient(180deg, rgba(0, 102, 255, 0.035), transparent 26%),
    var(--bg-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-heading {
  max-width: 760px;
  margin: 0 auto 3rem;
  text-align: center;
}

.section-kicker {
  margin-bottom: 0.65rem;
  color: var(--accent-color);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-align: center;
  text-transform: uppercase;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-title span {
  color: var(--accent-color);
}

.section-subtitle {
  color: var(--secondary-color);
  line-height: 1.7;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  align-items: stretch;
}

.featured-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--border-color);
  border-radius: 0.65rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.78);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.featured-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 102, 255, 0.36);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.08);
}

.project-cover {
  position: relative;
  min-width: 0;
  aspect-ratio: 16 / 9;
  background: #060606;
  overflow: hidden;
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.featured-card:hover .project-cover img {
  transform: scale(1.04);
}

.project-period {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  padding: 0.38rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  color: #fff;
  background: rgba(0, 0, 0, 0.56);
  backdrop-filter: blur(10px);
  font-size: 0.76rem;
  font-weight: 700;
}

.project-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding: 1rem;
}

.project-meta {
  min-height: 1.2rem;
  margin-bottom: 0.55rem;
  color: var(--accent-color);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.project-body h3 {
  font-size: 1.22rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.6rem;
}

.project-summary {
  color: var(--secondary-color);
  font-size: 0.9rem;
  line-height: 1.55;
  margin-bottom: 0.85rem;
}

.project-role {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 0.7rem;
  margin-bottom: 0.9rem;
}

.project-role span {
  color: var(--accent-color);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
}

.project-role p {
  color: var(--secondary-color);
  font-size: 0.82rem;
  line-height: 1.45;
}

.stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.38rem;
  margin-top: auto;
  margin-bottom: 0.9rem;
}

.stack-list span {
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 0.28rem 0.48rem;
  color: var(--text-color);
  background: rgba(255, 255, 255, 0.72);
  font-size: 0.72rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0.58rem 0.72rem;
  border: 1px solid var(--text-color);
  border-radius: 0.45rem;
  color: var(--bg-color);
  background: var(--text-color);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 700;
  transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}

.project-link:hover {
  transform: translateY(-2px);
  color: var(--text-color);
  background: transparent;
}

.archive-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.archive-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.archive-heading h3 {
  font-size: 1.4rem;
  font-weight: 700;
}

.archive-heading p {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.archive-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.archive-card {
  display: flex;
  flex-direction: column;
  min-height: 190px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.55rem;
  background: rgba(255, 255, 255, 0.66);
}

.archive-period {
  display: inline-block;
  margin-bottom: 0.55rem;
  color: var(--accent-color);
  font-size: 0.76rem;
  font-weight: 700;
}

.archive-card h4 {
  margin-bottom: 0.45rem;
  font-size: 1rem;
  font-weight: 700;
}

.archive-card p {
  color: var(--secondary-color);
  font-size: 0.86rem;
  line-height: 1.55;
}

.archive-footer {
  margin-top: auto;
}

.archive-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 1rem 0 0.8rem;
}

.archive-stack span {
  color: var(--secondary-color);
  font-size: 0.75rem;
}

.archive-stack span + span::before {
  content: '/';
  margin-right: 0.35rem;
  color: var(--border-color);
}

.archive-links {
  display: flex;
  gap: 0.7rem;
}

.archive-links a {
  color: var(--text-color);
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.archive-links a:hover {
  color: var(--accent-color);
}

@media (max-width: 1080px) {
  .featured-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .portfolio-section {
    padding: 4rem 1rem;
  }

  .section-heading {
    margin-bottom: 2.3rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .archive-heading {
    display: block;
  }

  .archive-heading p {
    margin-top: 0.35rem;
  }

  .archive-list {
    grid-template-columns: 1fr;
  }
}
</style>

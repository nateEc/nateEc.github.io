<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const experiencesEn = [
  {
    duration: 'Mar 2026 — Present',
    title: 'AI Agent Engineer',
    company: 'VisionFlow AI',
    location: 'Beijing, China',
    bullets: [
      'Designed a user-level <strong>Skill learning loop</strong> that turns multi-turn agent runs into policy, observation, candidate, and human-confirmation stages with risk tiers, idempotent deduplication, and privacy minimization',
      'Built an <strong>agent failure regression platform</strong> that converts negative feedback, empty answers, and tool failures into reviewable cases across 6 repositories, 13 domains, and 29 suites',
      'Designed a <strong>Skill Router Rule Shadow</strong> framework for safe candidate-rule evaluation with stable-field comparison, latency statistics, atomic review bundles, and sensitive-output scanning',
      'Built <strong>HiPilot Desktop</strong> with Electron, Codex app server, and the t3code workbench, including short-lived model tokens, an SSE proxy, idempotent billing, redacted diagnostics, and macOS release verification',
      'Delivered recruiting and AI interview workflows spanning candidate sync, retrieval and matching, outreach reminders, operational reporting, and JD/resume-driven voice interviews'
    ],
    icon: 'briefcase'
  },
  {
    duration: 'May 2025 — Feb 2026',
    title: 'AI Algorithm Development Engineer',
    company: 'Iston AI',
    location: 'Shanghai, China',
    bullets: [
      'Designed the architecture for an AI digital-human product and integrated GPT, RAG, ASR/TTS, and Ollama-powered web search through <strong>FastAPI</strong> for real-time voice interaction',
      'Designed a load-balancing proxy for Ollama services and moved the pipeline to asynchronous execution, reducing average latency by <strong>70%</strong> and increasing throughput by nearly <strong>10×</strong>',
      'Refactored phoneme parsing and similarity scoring, then built K12 speaking tasks and dynamic question generation, improving scoring accuracy by approximately <strong>40%</strong>'
    ],
    icon: 'briefcase'
  },
  {
    duration: 'Jun 2024 — Jul 2024',
    title: 'Software Engineer Intern',
    company: 'Chinese Historical Christian Database',
    location: 'Boston, MA',
    bullets: [
      'Optimized <strong>Neo4j Cypher</strong> queries and fixed frontend data-fetching errors, reducing query time by approximately <strong>30%</strong> while improving regional church population data accuracy'
    ],
    icon: 'briefcase'
  },
  {
    duration: 'Sep 2023 — Dec 2023',
    title: 'Software Engineer',
    company: 'BU Spark!',
    location: 'Boston, MA',
    bullets: [
      'Coordinated one designer and three developers to build the Petventure full-stack application with <strong>Ionic React</strong>, <strong>PostgreSQL</strong>, and <strong>Prisma</strong> for pet-friendly venue search and distance filtering'
    ],
    icon: 'briefcase'
  },
  {
    duration: 'Sep 2021 — Jan 2025',
    title: 'B.S. in Computer Science',
    company: 'Boston University',
    location: 'Boston, MA',
    bullets: [
      'Coursework included algorithms, data structures, mobile software engineering, web programming, computer systems, databases, networks, linear algebra, and computational probability'
    ],
    icon: 'graduation'
  }
]

const experiencesZh = [
  {
    duration: '2026.03 — 至今',
    title: 'AI Agent 开发工程师',
    company: '北京目的涌现科技公司',
    location: '北京，中国',
    bullets: [
      '设计并实现用户级 <strong>Skill 自动沉淀闭环</strong>，将多轮 Agent 运行抽象为 Policy、Observation、Candidate 与人工确认链路，通过风险分级、幂等去重与隐私最小化，避免错误查数和不确定结论被固化为技能',
      '搭建 <strong>Agent 失败自动回归平台</strong>，将点踩、空答、工具失败等线上信号转化为可审核用例，并建设覆盖 6 个仓库、13 个领域、29 个套件的回归注册表',
      '设计 <strong>Skill Router Rule Shadow</strong> 安全灰度框架，通过稳定字段比对、延迟统计、原子审查包和敏感输出扫描支撑规则评审与快速回滚',
      '从 0 到 1 构建 <strong>HiPilot Desktop</strong>，集成 Electron、Codex app server 与 t3code workbench，实现模型代理、幂等计费、脱敏诊断及 macOS 签名发布验收链路',
      '实现招聘 Agent 与 AI 面试业务闭环，覆盖候选人同步、检索匹配、触达提醒、运营周报及 JD/简历驱动的语音 AI 面试能力'
    ],
    icon: 'briefcase'
  },
  {
    duration: '2025.05 — 2026.02',
    title: 'AI 算法开发工程师',
    company: '意仕腾人工智能科技',
    location: '上海，中国',
    bullets: [
      '作为后端核心开发完成 AI 数字人项目的需求分析与架构设计，基于 <strong>FastAPI</strong> 集成 GPT、RAG、ASR/TTS 及 Ollama 联网搜索，支撑实时语音交互',
      '为 Ollama 模型服务设计负载均衡代理并推进全链路异步化，降低平均响应时间 <strong>70%</strong>，提升系统吞吐量近 <strong>10 倍</strong>',
      '重构音素解析与相似度计算逻辑，并开发图片描述、情景对话等 K12 口语题型及动态出题流程，评分准确率提升约 <strong>40%</strong>'
    ],
    icon: 'briefcase'
  },
  {
    duration: '2024.06 — 2024.07',
    title: '软件工程师实习生',
    company: '中国历史基督教数据库',
    location: '美国波士顿',
    bullets: [
      '优化 <strong>Neo4j Cypher</strong> 查询并修复前端数据获取错误，使查询执行时间减少约 <strong>30%</strong>，提升教堂区域人口数据的准确性与可用性'
    ],
    icon: 'briefcase'
  },
  {
    duration: '2023.09 — 2023.12',
    title: '软件工程师',
    company: 'BU Spark!',
    location: '美国波士顿',
    bullets: [
      '协调 1 名设计师与 3 名开发者，使用 <strong>Ionic React</strong>、<strong>PostgreSQL</strong> 和 <strong>Prisma</strong> 构建 Petventure 全栈应用，为波士顿宠物主人提供宠物友好场所检索与距离筛选'
    ],
    icon: 'briefcase'
  },
  {
    duration: '2021.09 — 2025.01',
    title: '计算机科学学士',
    company: '波士顿大学',
    location: '美国波士顿',
    bullets: [
      '相关课程包括算法、数据结构、移动软件工程、Web 编程、计算机系统、数据库系统、计算机网络、线性代数和计算概率论'
    ],
    icon: 'graduation'
  }
]

const experiences = computed(() => currentLanguage.value === 'zh' ? experiencesZh : experiencesEn)

const sectionTitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return { main: '我的', highlight: '经历' }
  }
  return { main: 'My', highlight: 'Experience' }
})
</script>

<template>
  <section id="experience" class="experience-section">
    <div class="container">
      <h2 class="section-title">{{ sectionTitle.main }} <span>{{ sectionTitle.highlight }}</span></h2>
      
      <div class="timeline">
        <div v-for="(exp, index) in experiences" :key="index" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="duration">{{ exp.duration }}</span>
            <h3>{{ exp.title }} <span>— {{ exp.company }}</span></h3>
            <p v-if="exp.location" class="location">{{ exp.location }}</p>
            <ul class="bullet-list">
              <li v-for="(bullet, idx) in exp.bullets" :key="idx" v-html="bullet"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience-section {
  min-height: 100vh;
  padding: 6rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 4rem;
  text-align: center;
}

.section-title span {
  color: var(--accent-color);
}

.timeline {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  padding-left: 2rem;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--accent-color);
  border: 3px solid var(--bg-color);
  box-shadow: 0 0 0 2px var(--border-color);
}

.timeline-content {
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  border-color: var(--accent-color);
  transform: translateX(4px);
}

.duration {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.location {
  font-size: 0.875rem;
  color: var(--secondary-color);
  font-style: italic;
  margin-bottom: 0.5rem;
}

.timeline-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.timeline-content h3 span {
  color: var(--secondary-color);
  font-weight: 400;
}

.timeline-content p {
  color: var(--secondary-color);
  line-height: 1.6;
}

.bullet-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bullet-list li {
  color: var(--secondary-color);
  line-height: 1.8;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.bullet-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--accent-color);
  font-weight: bold;
  font-size: 1.2em;
}

.bullet-list li:last-child {
  margin-bottom: 0;
}

.bullet-list li :deep(strong) {
  color: var(--text-color);
  font-weight: 600;
}

@media (max-width: 768px) {
  .experience-section {
    padding: 4rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .timeline {
    padding-left: 1.5rem;
  }
  
  .timeline-item {
    padding-left: 1.5rem;
  }
  
  .timeline-dot {
    left: -1.56rem;
  }
}
</style>

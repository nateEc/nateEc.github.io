<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const experiencesEn = [
  {
    duration: '2025.05 — Present',
    title: 'AI Algorithm Engineer',
    company: 'Iston AI',
    location: 'Shanghai, China',
    bullets: [
      'Responsible for backend development, leading the data team in multi-modal data analysis and architecture design',
      'Utilized <strong>FastAPI</strong> to build high-performance <strong>RESTful APIs</strong>, integrated <strong>GPT</strong>, <strong>RAG</strong>, <strong>ASR/TTS</strong>, and <strong>Ollama</strong> models (Searxng) for algorithm development',
      'Optimized data processing and storage architecture to support front-end and real-time data query requirements',
      'Optimized <strong>Ollama</strong> model services to enhance monitoring and debugging, designed multi-agent scheduling and parallel processing (ainvoke), reducing average response time by <strong>70%</strong>',
      'Independently developed a complete evaluation and training pipeline, integrating voice parsing and root cause analysis, with a <strong>40%</strong> improvement in model accuracy',
      'Developed multiple <strong>HK12D</strong> base models (image description, emotion analysis) and post-training optimization methods, achieving intelligent emotion recognition and support for multilingual scenarios'
    ],
    icon: 'briefcase'
  },
  {
    duration: 'Sep 2023 — Dec 2023',
    title: 'Software Engineer',
    company: 'BU Spark!',
    location: 'Boston, MA',
    bullets: [
      'Orchestrated a cross-functional team of one UX designer and three developers to effectively launch and nurture a startup',
      'Employed <strong>Ionic React</strong> to construct a comprehensive full-stack mobile application',
      'Used <strong>PostgreSQL</strong> as the backend database repository for the extensive collection of data related to pet-friendly venues in the Boston area',
      'Serving more than <strong>500</strong> pet owners in Boston with precise insights on pet-friendly dining options and nearby destinations'
    ],
    icon: 'briefcase'
  },
  {
    duration: 'June 2023 — July 2023',
    title: 'Software Engineer Intern',
    company: 'XuDuo Trade Co',
    location: 'HangZhou, China',
    bullets: [
      'Designed and implemented backend infrastructure, <strong>APIs</strong>, and data validation',
      'Enhanced website performance by implementing efficient <strong>JavaScript</strong> functions in the backend that improve the efficiency by <strong>20%</strong>',
      'Conducted unit tests for a robust <strong>MongoDB</strong> database',
      'Actively participated in team meetings, brainstorming sessions, and agile development processes'
    ],
    icon: 'briefcase'
  },
  {
    duration: '2021 - 2025',
    title: 'Computer Science Student',
    company: 'Boston University',
    bullets: [
      "Pursuing Bachelor's degree in Computer Science",
      'Focused on software engineering, data science, and web development'
    ],
    icon: 'graduation'
  }
]

const experiencesZh = [
  {
    duration: '2025.05 — 至今',
    title: 'AI算法工程师',
    company: '意仕腾人工智能科技',
    location: '上海，中国',
    bullets: [
      '作为后端核心开发，主导数据团队的需求分析与架构设计，使用<strong>FastAPI</strong>构建高性能<strong>RESTful API</strong>，集成<strong>GPT</strong>、<strong>RAG</strong>、<strong>ASR/TTS</strong>、<strong>ollama</strong>联网模型（Searxng）等能力，并通过负载均衡与全链路异步改造，支撑高并发实时语音交互。',
      '对<strong>Ollama</strong>模型服务进行监控与调优，设计部署负载均衡代理，结合全链路异步并行化（ainvoke），降低平均响应时70%，提升系统吐量近10倍。',
      '独立负责英语发音评测训练流程迭代，重构音素解析与根因设计理逻辑，增强对连读、省略等自然语音现象的处理，并准确率提升40%，并且为标注接口集成到生产流程线。',
      '开发多种<strong>K12</strong>开发多种K12口语题型（如图片描述、情景对话）后端逻辑与动态题目生成算法，实现智能离题判断与交互流程。'
    ],
    icon: 'briefcase'
  },
  {
    duration: '2023年9月 — 2023年12月',
    title: '软件工程师',
    company: 'BU Spark!',
    location: '波士顿，马萨诸塞州',
    bullets: [
      '组织一个UX设计师和三名开发人员的跨职能团队，有效启动和培育创业项目',
      '使用<strong>Ionic React</strong>构建全栈移动应用程序',
      '使用<strong>PostgreSQL</strong>作为后端数据库，存储波士顿地区宠物友好场所的广泛数据',
      '为波士顿超过<strong>500</strong>名宠物主提供关于宠物友好餐饮选项和附近目的地的精确见解'
    ],
    icon: 'briefcase'
  },
  {
    duration: '2023年6月 — 2023年7月',
    title: '软件工程师实习生',
    company: '许多贸易公司',
    location: '杭州，中国',
    bullets: [
      '设计和实现后端基础设施、<strong>API</strong>和数据验证',
      '通过在后端实现高效的<strong>JavaScript</strong>函数，提高网站性能<strong>20%</strong>',
      '对健壮的<strong>MongoDB</strong>数据库进行单元测试',
      '积极参与团队会议、头脑风暴会议和敏捷开发流程'
    ],
    icon: 'briefcase'
  },
  {
    duration: '2021 - 2025',
    title: '计算机科学学生',
    company: '波士顿大学',
    bullets: [
      '攻读计算机科学学士学位',
      '专注于软件工程、数据科学和Web开发'
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

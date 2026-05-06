<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

type LocalizedText = {
  en: string
  zh: string
}

type Skill = {
  name: string | LocalizedText
  icon: string
}

type SkillCategory = {
  title: LocalizedText
  skills: Skill[]
}

const sectionTitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return { highlight: '我的', main: '技能' }
  }
  return { highlight: 'My', main: 'Skills' }
})

const skillCategories: SkillCategory[] = [
  {
    title: { en: 'AI & Machine Learning', zh: '人工智能与机器学习' },
    skills: [
      { name: 'MCP', icon: '/images/skills/mcp.png' },
      { name: 'RAG', icon: '/images/skills/rag.png' },
      { name: 'Agents', icon: '/images/skills/agents.png' },
      { name: 'Function Calling', icon: '/images/skills/function-calling.png' },
      { name: { en: 'LLM App Development', zh: '大语言模型应用开发' }, icon: '/images/skills/llm-apps.png' },
      { name: { en: 'Speech Recognition', zh: '语音识别' }, icon: '/images/skills/speech-recognition.png' },
      { name: { en: 'Text-to-Speech', zh: '语音合成' }, icon: '/images/skills/text-to-speech.png' },
      { name: 'Ollama', icon: '/images/skills/ollama.png' },
      { name: { en: 'Pronunciation Assessment', zh: '发音测评算法' }, icon: '/images/skills/pronunciation-scoring.png' },
      { name: { en: 'NLP Engineering', zh: 'NLP工程化' }, icon: '/images/skills/nlp-engineering.png' },
      { name: { en: 'Model Deployment & Load Testing', zh: '模型部署与压测' }, icon: '/images/skills/model-deployment.png' }
    ]
  },
  {
    title: { en: 'Programming Languages', zh: '编程语言' },
    skills: [
      { name: 'Python', icon: '/images/icons8-python.svg' },
      { name: 'Java', icon: '/images/icons8-java.svg' },
      { name: 'JavaScript', icon: '/images/javascript.svg' },
      { name: 'TypeScript', icon: '/images/skills/typescript.png' },
      { name: 'C', icon: '/images/icons8-c-programming-48.png' },
      { name: 'Assembly', icon: '/images/ass.png' },
      { name: 'SML', icon: '/images/sml.png' },
      { name: 'Bash', icon: '/images/bash.svg' },
      { name: 'SQL', icon: '/images/skills/sql.png' }
    ]
  },
  {
    title: { en: 'Backend Development', zh: '后端开发' },
    skills: [
      { name: 'FastAPI', icon: '/images/skills/fastapi.png' },
      { name: 'Node.js', icon: '/images/node.svg' },
      { name: 'Express.js', icon: '/images/expressjs-icon.svg' },
      { name: 'tRPC', icon: '/images/skills/trpc.png' },
      { name: 'Prisma', icon: '/images/skills/prisma.png' },
      { name: { en: 'RESTful API Development', zh: 'RESTful API开发' }, icon: '/images/skills/rest-api.png' },
      { name: { en: 'High Concurrency & Async', zh: '高并发与异步编程' }, icon: '/images/skills/async-concurrency.png' },
      { name: { en: 'Load Balancing', zh: '负载均衡' }, icon: '/images/skills/load-balancing.png' },
      { name: 'JMeter', icon: '/images/skills/jmeter.png' }
    ]
  },
  {
    title: { en: 'Frontend, Full Stack & Databases', zh: '前端、全栈与数据库' },
    skills: [
      { name: 'React.js', icon: '/images/react.svg' },
      { name: 'Bootstrap', icon: '/images/bootstrap.svg' },
      { name: 'Passport.js', icon: '/images/passportjs.png' },
      { name: 'PostgreSQL', icon: '/images/skills/postgresql.png' },
      { name: 'MongoDB', icon: '/images/mongodb-icon.svg' },
      { name: 'SQLite', icon: '/images/skills/sqlite.png' }
    ]
  },
  {
    title: { en: 'Cloud & DevOps', zh: '云与DevOps' },
    skills: [
      { name: 'Docker', icon: '/images/skills/docker.png' },
      { name: 'Nginx', icon: '/images/skills/nginx.png' },
      { name: 'Git', icon: '/images/icons8-git.svg' },
      { name: 'Jira', icon: '/images/skills/jira.png' },
      { name: 'Postman', icon: '/images/postman-icon-svgrepo-com.svg' },
      { name: 'GNU/Linux', icon: '/images/skills/gnu-linux.png' },
      { name: { en: 'Environment Configuration', zh: '环境配置' }, icon: '/images/skills/environment-config.png' },
      { name: 'CI/CD', icon: '/images/skills/cicd.png' }
    ]
  },
  {
    title: { en: 'Development Tools & Other', zh: '开发工具与其他' },
    skills: [
      { name: 'Cursor', icon: '/images/skills/cursor.png' },
      { name: 'Windsurf', icon: '/images/skills/windsurf.png' },
      { name: 'Gemini-CLI', icon: '/images/skills/gemini-cli.png' },
      { name: 'Xcode', icon: '/images/skills/xcode.png' },
      { name: 'LaTeX', icon: '/images/latex-svgrepo-com.svg' },
      { name: 'JSON/XML', icon: '/images/skills/json-xml.png' },
      { name: 'Microsoft Office', icon: '/images/skills/microsoft-office.png' },
      { name: 'Figma', icon: '/images/skills/figma.png' }
    ]
  }
]

const localizedSkillCategories = computed(() => {
  return skillCategories.map((category) => ({
    title: currentLanguage.value === 'zh' ? category.title.zh : category.title.en,
    skills: category.skills
  }))
})

const skillName = (skill: Skill) => {
  if (typeof skill.name === 'string') {
    return skill.name
  }
  return currentLanguage.value === 'zh' ? skill.name.zh : skill.name.en
}
</script>

<template>
  <section id="skills" class="skills-section">
    <div class="container">
      <h2 class="section-title"><span>{{ sectionTitle.highlight }}</span> {{ sectionTitle.main }}</h2>

      <div class="skills-grid">
        <div v-for="category in localizedSkillCategories" :key="category.title" class="skill-category">
          <h3>{{ category.title }}</h3>
          <div class="skills-list">
            <div v-for="skill in category.skills" :key="skillName(skill)" class="skill-item">
              <img :src="skill.icon" :alt="skillName(skill)" />
              <span>{{ skillName(skill) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
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

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

.skill-category h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.skills-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 128px;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.skill-item:hover {
  border-color: var(--accent-color);
  transform: translateY(-4px);
}

.skill-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.skill-item span {
  max-width: 100%;
  font-size: 0.875rem;
  line-height: 1.35;
  text-align: center;
  color: var(--secondary-color);
  overflow-wrap: anywhere;
}

@media (max-width: 768px) {
  .skills-section {
    padding: 4rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .skills-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
  }

  .skill-item {
    min-height: 112px;
    padding: 1rem;
  }

  .skill-item img {
    width: 36px;
    height: 36px;
  }
}
</style>

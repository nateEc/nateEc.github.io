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
    title: { en: 'AI & Agent Systems', zh: 'AI 与 Agent 系统' },
    skills: [
      { name: 'Agents', icon: '/images/skills/agents.png' },
      { name: { en: 'Skill & Tool Calling', zh: 'Skill 与工具调用' }, icon: '/images/skills/function-calling.png' },
      { name: { en: 'Agent Evaluation', zh: 'Agent 评测' }, icon: '/images/skills/model-deployment.png' },
      { name: 'RAG', icon: '/images/skills/rag.png' },
      { name: 'MCP', icon: '/images/skills/mcp.png' },
      { name: { en: 'LLM App Development', zh: '大语言模型应用开发' }, icon: '/images/skills/llm-apps.png' },
      { name: { en: 'Speech Recognition', zh: '语音识别' }, icon: '/images/skills/speech-recognition.png' },
      { name: { en: 'Text-to-Speech', zh: '语音合成' }, icon: '/images/skills/text-to-speech.png' },
      { name: { en: 'Context & Session Management', zh: '上下文与会话管理' }, icon: '/images/skills/environment-config.png' }
    ]
  },
  {
    title: { en: 'Engineering Development', zh: '工程开发' },
    skills: [
      { name: 'Python', icon: '/images/icons8-python.svg' },
      { name: 'TypeScript', icon: '/images/skills/typescript.png' },
      { name: 'JavaScript', icon: '/images/javascript.svg' },
      { name: 'FastAPI', icon: '/images/skills/fastapi.png' },
      { name: 'React / React Native', icon: '/images/react.svg' },
      { name: 'Electron', icon: '/images/skills/electron.svg' },
      { name: 'PostgreSQL', icon: '/images/skills/postgresql.png' },
      { name: 'Redis', icon: '/images/skills/redis.svg' },
      { name: 'SQL', icon: '/images/skills/sql.png' }
    ]
  },
  {
    title: { en: 'Infrastructure & Quality', zh: '工程化与质量' },
    skills: [
      { name: 'Docker', icon: '/images/skills/docker.png' },
      { name: 'Nginx', icon: '/images/skills/nginx.png' },
      { name: 'Git', icon: '/images/icons8-git.svg' },
      { name: 'CI/CD', icon: '/images/skills/cicd.png' },
      { name: 'Jenkins', icon: '/images/skills/cicd.png' },
      { name: 'Cloudflare', icon: '/images/skills/cloudflare.svg' },
      { name: { en: 'Async Programming', zh: '异步编程' }, icon: '/images/skills/async-concurrency.png' },
      { name: { en: 'Observability', zh: '可观测性' }, icon: '/images/skills/load-balancing.png' },
      { name: { en: 'Automated Testing', zh: '自动化测试' }, icon: '/images/skills/jmeter.png' }
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

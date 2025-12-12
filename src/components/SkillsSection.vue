<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const sectionTitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return { highlight: '我的', main: '技能' }
  }
  return { highlight: 'My', main: 'Skills' }
})

const categoryTitles = computed(() => {
  if (currentLanguage.value === 'zh') {
    return {
      programming: '编程语言',
      frontend: '前端工具',
      backend: '后端工具与开发工具'
    }
  }
  return {
    programming: 'Programming Languages',
    frontend: 'Front-end Tools',
    backend: 'Backend Tools & Dev Tools'
  }
})

const programmingLanguages = [
  { name: 'Java', icon: '/images/icons8-java.svg' },
  { name: 'Python', icon: '/images/icons8-python.svg' },
  { name: 'C', icon: '/images/icons8-c-programming-48.png' },
  { name: 'Javascript', icon: '/images/javascript.svg' },
  { name: 'Assembly', icon: '/images/ass.png' },
  { name: 'SML', icon: '/images/sml.png' },
  { name: 'Bash', icon: '/images/bash.svg' }
]

const frontendTools = [
  { name: 'HTML', icon: '/images/html.svg' },
  { name: 'CSS', icon: '/images/css.svg' },
  { name: 'JavaScript', icon: '/images/javascript.svg' },
  { name: 'Bootstrap', icon: '/images/bootstrap.svg' },
  { name: 'jQuery', icon: '/images/jquery.svg' },
  { name: 'React.js', icon: '/images/react.svg' }
]

const backendTools = [
  { name: 'Git', icon: '/images/icons8-git.svg' },
  { name: 'Github', icon: 'github' },
  { name: 'Node.js', icon: '/images/node.svg' },
  { name: 'Express.js', icon: '/images/expressjs-icon.svg' },
  { name: 'MongoDB', icon: '/images/mongodb-icon.svg' },
  { name: 'Chrome Dev', icon: '/images/Google_Chrome_icon_(February_2022).svg.png' },
  { name: 'Postman', icon: '/images/postman-icon-svgrepo-com.svg' },
  { name: 'LaTeX', icon: '/images/latex-svgrepo-com.svg' },
  { name: 'Passport.js', icon: '/images/passportjs.png' }
]
</script>

<template>
  <section id="skills" class="skills-section">
    <div class="container">
      <h2 class="section-title"><span>{{ sectionTitle.highlight }}</span> {{ sectionTitle.main }}</h2>
      
      <div class="skills-grid">
        <div class="skill-category">
          <h3>{{ categoryTitles.programming }}</h3>
          <div class="skills-list">
            <div v-for="skill in programmingLanguages" :key="skill.name" class="skill-item">
              <img :src="skill.icon" :alt="skill.name" />
              <span>{{ skill.name }}</span>
            </div>
          </div>
        </div>

        <div class="skill-category">
          <h3>{{ categoryTitles.frontend }}</h3>
          <div class="skills-list">
            <div v-for="skill in frontendTools" :key="skill.name" class="skill-item">
              <img :src="skill.icon" :alt="skill.name" />
              <span>{{ skill.name }}</span>
            </div>
          </div>
        </div>

        <div class="skill-category">
          <h3>{{ categoryTitles.backend }}</h3>
          <div class="skills-list">
            <div v-for="skill in backendTools" :key="skill.name" class="skill-item">
              <img v-if="skill.icon !== 'github'" :src="skill.icon" :alt="skill.name" />
              <svg v-else width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span>{{ skill.name }}</span>
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
  gap: 4rem;
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
  gap: 2rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.skill-item:hover {
  border-color: var(--accent-color);
  transform: translateY(-4px);
}

.skill-item img,
.skill-item svg {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.skill-item span {
  font-size: 0.875rem;
  text-align: center;
  color: var(--secondary-color);
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
    padding: 1rem;
  }
  
  .skill-item img,
  .skill-item svg {
    width: 36px;
    height: 36px;
  }
}
</style>

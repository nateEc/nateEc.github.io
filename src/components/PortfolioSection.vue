<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const sectionTitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return { main: '我的', highlight: '项目' }
  }
  return { main: 'My', highlight: 'Portfolio' }
})

const sectionSubtitle = computed(() => {
  if (currentLanguage.value === 'zh') {
    return '我参与的一些项目预览。'
  }
  return 'A preview of some projects I worked on.'
})

const projects = [
  {
    title: 'CS506 Assignments',
    image: '/images/channels4_profile.jpg',
    links: [
      { type: 'view', url: '/assignments.html' }
    ],
    technologies: []
  },
  {
    title: 'Task Manager',
    image: '/images/port1.png',
    links: [
      { type: 'github', url: 'https://github.com/nateEc/Task-Manager' }
    ],
    technologies: [
      '/images/html.svg',
      '/images/css.svg',
      '/images/javascript.svg',
      '/images/node.svg',
      '/images/expressjs-icon.svg',
      '/images/mongodb-icon.svg'
    ]
  },
  {
    title: 'Markdown Notes App',
    image: '/images/notesapp.png',
    links: [
      { type: 'github', url: 'https://github.com/nateEc/Markdown-Notes-App' }
    ],
    technologies: [
      '/images/html.svg',
      '/images/css.svg',
      '/images/javascript.svg',
      '/images/react.svg'
    ]
  },
  {
    title: 'Tour in China',
    image: '/images/port3.png',
    links: [
      { type: 'view', url: 'https://cs-people.bu.edu/yshan/cs103/finalProject/' },
      { type: 'github', url: 'https://github.com/nateEc/Tour-in-China' }
    ],
    technologies: [
      '/images/html.svg',
      '/images/css.svg',
      '/images/javascript.svg',
      '/images/bootstrap.svg'
    ]
  }
]
</script>

<template>
  <section id="portfolio" class="portfolio-section">
    <div class="container">
      <h2 class="section-title">{{ sectionTitle.main }} <span>{{ sectionTitle.highlight }}</span></h2>
      <p class="section-subtitle">{{ sectionSubtitle }}</p>
      
      <div class="projects-grid">
        <div v-for="project in projects" :key="project.title" class="project-card">
          <div class="project-image">
            <img :src="project.image" :alt="project.title" />
            <div class="project-overlay">
              <div class="project-info">
                <h3>{{ project.title }}</h3>
                <div class="project-links">
                  <a
                    v-for="(link, index) in project.links"
                    :key="index"
                    :href="link.url"
                    target="_blank"
                    class="project-link"
                  >
                    <svg v-if="link.type === 'github'" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </a>
                </div>
                <div v-if="project.technologies.length" class="project-tech">
                  <img
                    v-for="(tech, index) in project.technologies"
                    :key="index"
                    :src="tech"
                    alt="Technology"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-section {
  min-height: auto;
  padding: 4rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.section-title span {
  color: var(--accent-color);
}

.section-subtitle {
  text-align: center;
  color: var(--secondary-color);
  margin-bottom: 2rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.project-image {
  position: relative;
  width: 100%;
  padding-top: 66.67%;
  overflow: hidden;
}

.project-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-info {
  text-align: center;
  color: white;
  padding: 2rem;
}

.project-info h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.project-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.project-link {
  width: 40px;
  height: 40px;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.project-link:hover {
  background-color: white;
  color: black;
}

.project-tech {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.project-tech img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .portfolio-section {
    padding: 4rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>

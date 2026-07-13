<template>
  <section id="about" class="about-section">
    <div class="container">
      <h2 class="section-title">{{ content.title }} <span>{{ content.titleHighlight }}</span></h2>
      
      <div class="about-content">
        <div class="about-text">
          <h3>{{ content.subtitle }} <span>{{ content.subtitleHighlight }}</span> {{ currentLanguage === 'zh' ? '' : 'Me' }}</h3>
          <p v-html="content.description"></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const content = computed(() => {
  if (currentLanguage.value === 'zh') {
    return {
      title: '关于',
      titleHighlight: '我',
      subtitle: '了解',
      subtitleHighlight: '我',
      description: '我是<strong>波士顿大学计算机科学学士</strong>，目前在北京的<strong>目的涌现科技</strong>担任<strong>AI Agent 开发工程师</strong>。我的工作聚焦于可落地的 Agent 系统，包括<strong>Skill 沉淀与路由</strong>、失败回归与评测、桌面端 Agent 基础设施，以及招聘与语音 AI 工作流。此前我在<strong>意仕腾</strong>从事 AI 算法与实时语音后端开发，持续关注如何把模型能力构建成可靠、可观测、可验证的产品。'
    }
  }
  return {
    title: 'About',
    titleHighlight: 'me',
    subtitle: 'Get to',
    subtitleHighlight: 'Know',
    description: "I'm a <strong>Boston University Computer Science graduate</strong> and an <strong>AI Agent Engineer</strong> at <strong>VisionFlow AI</strong> in Beijing. I build production agent systems across <strong>skill learning and routing</strong>, evaluation and regression infrastructure, desktop agent tooling, and recruiting and voice workflows. Previously, I worked on AI algorithm and real-time voice backend systems at <strong>Iston AI</strong>, focusing on making model capabilities reliable, observable, and testable."
  }
})
</script>

<style scoped>
.about-section {
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
  margin-bottom: 2rem;
  text-align: center;
}

.section-title span {
  color: var(--accent-color);
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-text h3 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.about-text h3 span {
  color: var(--accent-color);
}

.about-text p {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--secondary-color);
}

.about-text p :deep(strong) {
  color: var(--text-color);
  font-weight: 600;
}

@media (max-width: 768px) {
  .about-section {
    padding: 3rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .about-text h3 {
    font-size: 1.5rem;
  }
  
  .about-text p {
    font-size: 1rem;
  }
}
</style>

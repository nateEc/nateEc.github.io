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
      description: '我是<strong>波士顿大学</strong>计算机科学专业的毕业生（<strong>2025届</strong>），目前在上海的<strong>Iston AI</strong>担任<strong>AI算法工程师</strong>。我具有好奇心和勤奋的个性，热衷于探索<strong>人工智能</strong>与<strong>Web开发</strong>的交叉领域，不断学习并构建创新解决方案，在不断发展的技术领域中成长。'
    }
  }
  return {
    title: 'About',
    titleHighlight: 'me',
    subtitle: 'Get to',
    subtitleHighlight: 'Know',
    description: "I'm a <strong>Boston University</strong> Computer Science alumni (<strong>Class of 2025</strong>), currently working as an <strong>AI Algorithm Engineer</strong> at <strong>Iston AI</strong> in <strong>Shanghai</strong>. With a curious mind and diligent personality, I'm passionate about exploring the intersection of <strong>artificial intelligence</strong> and <strong>web development</strong>, constantly learning and building innovative solutions in the ever-evolving tech landscape."
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

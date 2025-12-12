<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const typedText = ref('')
const phrasesEn = [
  "I'm a passionate software engineer,",
  "and undergraduate student at Boston University",
  "Explore more on my site 😉"
]
const phrasesZh = [
  "我是一名充满热情的软件工程师，",
  "波士顿大学计算机科学毕业生",
  "欢迎浏览我的网站 😉"
]

const phrases = computed(() => currentLanguage.value === 'zh' ? phrasesZh : phrasesEn)
const resumeLink = computed(() => currentLanguage.value === 'zh' ? '/单玉昆resume.pdf' : '/Resume.pdf')
const cvButtonText = computed(() => currentLanguage.value === 'zh' ? '查看简历' : 'View CV')
let phraseIndex = 0
let charIndex = 0
let isDeleting = false

onMounted(() => {
  setTimeout(() => {
    typeText()
  }, 500)
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
</script>

<template>
  <section id="home" class="hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            {{ currentLanguage === 'zh' ? '你好，我是' : "Hi, I'm" }}<br />
            <span class="name">{{ currentLanguage === 'zh' ? '单玉昆 (Nathan)' : 'Yukun (Nathan) Shan' }}</span>
          </h1>
          <p class="hero-subtitle">{{ typedText }}<span class="cursor">|</span></p>
          <a :href="resumeLink" target="_blank" class="cv-button">
            {{ cvButtonText }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>
        <div class="hero-image">
          <img src="/images/me.png" alt="Yukun Nathan Shan" />
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
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.hero-text {
  flex: 1;
}

.hero-image {
  flex-shrink: 0;
}

.hero-image img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--border-color);
  transition: all 0.3s ease;
}

.hero-image img:hover {
  border-color: var(--accent-color);
  transform: scale(1.05);
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

.cursor {
  display: inline-block;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cv-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background-color: var(--text-color);
  color: var(--bg-color);
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid var(--text-color);
}

.cv-button:hover {
  background-color: transparent;
  color: var(--text-color);
  transform: translateY(-2px);
}

.cv-button svg {
  transition: transform 0.3s ease;
}

.cv-button:hover svg {
  transform: translateY(2px);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 1rem;
  }
  
  .hero-content {
    flex-direction: column-reverse;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-image img {
    width: 200px;
    height: 200px;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLanguage } from './composables/useLanguage'
import IntroSection from './components/IntroSection.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ContactSection from './components/ContactSection.vue'
import Navigation from './components/Navigation.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

const showIntro = ref(true)
const currentTime = ref('')
const { initLanguage } = useLanguage()

onMounted(() => {
  initLanguage()
  
  setTimeout(() => {
    showIntro.value = false
  }, 3000)

  const updateClock = () => {
    const date = new Date()
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes
    currentTime.value = `${hours}:${minutesStr} ${ampm}`
    setTimeout(updateClock, 1000)
  }
  updateClock()
})
</script>

<template>
  <div class="app">
    <IntroSection v-if="showIntro" />
    <div v-show="!showIntro" class="main-content">
      <LanguageSwitcher />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <PortfolioSection />
      <ContactSection />
      <Navigation />
      <div class="clock">{{ currentTime }}</div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #000;
  --secondary-color: #666;
  --accent-color: #0066ff;
  --bg-color: #fff;
  --text-color: #000;
  --border-color: #e0e0e0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
}

.main-content {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.clock {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  font-size: 0.875rem;
  color: var(--secondary-color);
  font-variant-numeric: tabular-nums;
  z-index: 100;
}

@media (max-width: 768px) {
  .clock {
    bottom: 1rem;
    left: 1rem;
    font-size: 0.75rem;
  }
}
</style>

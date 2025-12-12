<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('home')

const navItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'user' },
  { id: 'skills', label: 'Skills', icon: 'code' },
  { id: 'portfolio', label: 'Portfolio', icon: 'briefcase' },
  { id: 'experience', label: 'Experience', icon: 'clock' },
  { id: 'contact', label: 'Contact', icon: 'mail' }
]

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
  }
}

const handleScroll = () => {
  const sections = navItems.map(item => document.getElementById(item.id))
  const scrollPosition = window.scrollY + window.innerHeight / 3

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    const navItem = navItems[i]
    if (section && navItem && section.offsetTop <= scrollPosition) {
      activeSection.value = navItem.id
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="navigation">
    <button
      v-for="item in navItems"
      :key="item.id"
      :class="['nav-button', { active: activeSection === item.id }]"
      @click="scrollToSection(item.id)"
      :title="item.label"
    >
      <svg v-if="item.icon === 'home'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      <svg v-else-if="item.icon === 'user'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <svg v-else-if="item.icon === 'code'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
      <svg v-else-if="item.icon === 'briefcase'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
      <svg v-else-if="item.icon === 'clock'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <svg v-else-if="item.icon === 'mail'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.navigation {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
}

.nav-button {
  position: relative;
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--secondary-color);
}

.nav-button:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: scale(1.1);
}

.nav-button.active {
  background-color: var(--text-color);
  border-color: var(--text-color);
  color: var(--bg-color);
}

.nav-label {
  position: absolute;
  right: 100%;
  margin-right: 1rem;
  background-color: var(--text-color);
  color: var(--bg-color);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.nav-button:hover .nav-label {
  opacity: 1;
}

@media (max-width: 768px) {
  .navigation {
    right: 1rem;
    gap: 0.75rem;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .nav-button svg {
    width: 16px;
    height: 16px;
  }
  
  .nav-label {
    display: none;
  }
}
</style>

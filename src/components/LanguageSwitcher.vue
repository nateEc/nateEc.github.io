<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage, toggleLanguage } = useLanguage()
</script>

<template>
  <button class="language-switcher" @click="toggleLanguage" :title="currentLanguage === 'en' ? 'Switch to Chinese' : '切换到英文'">
    <span class="lang-text">{{ currentLanguage === 'en' ? '中文' : 'EN' }}</span>
  </button>
</template>

<style scoped>
.language-switcher {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border: 2px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  font-weight: 600;
  font-size: 0.875rem;
}

.language-switcher:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: scale(1.1);
}

.lang-text {
  user-select: none;
}

@media (max-width: 768px) {
  .language-switcher {
    top: 1rem;
    right: 1rem;
    width: 48px;
    height: 48px;
    font-size: 0.75rem;
  }
}
</style>

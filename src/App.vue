<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
import { useLanguage } from './composables/useLanguage'
import { useTheme } from './composables/useTheme'

const { initLanguage } = useLanguage()
const { initTheme } = useTheme()

onMounted(() => {
  initLanguage()
  initTheme()
})
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <Navigation />
  <div id="main-content" tabindex="-1">
    <RouterView />
  </div>
  <footer class="site-footer">
    <div class="shell site-footer__inner">
      <p>© {{ new Date().getFullYear() }} Nathan Shan</p>
      <p>Designed as an evidence archive · Built with Vue</p>
    </div>
  </footer>
</template>

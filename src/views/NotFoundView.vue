<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { setPageMeta } from '../composables/usePageMeta'

const { currentLanguage } = useLanguage()
const copy = computed(() => currentLanguage.value === 'zh'
  ? { title: '这条路径没有留下轨迹。', body: '页面可能已经移动，或者这个地址从未存在。', action: '返回首页' }
  : { title: 'No trace exists for this path.', body: 'The page may have moved, or this address never existed.', action: 'Return home' })

onMounted(() => {
  setPageMeta({
    title: '404 — Nathan Shan',
    description: 'This route does not exist.',
    path: window.location.pathname,
    robots: 'noindex, nofollow',
  })
})
</script>

<template>
  <main class="not-found shell">
    <p class="eyebrow">404 / route_not_found</p>
    <h1>{{ copy.title }}</h1>
    <p>{{ copy.body }}</p>
    <RouterLink class="button" to="/">{{ copy.action }}</RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  display: grid;
  min-height: calc(100vh - 72px);
  padding-top: 150px;
  padding-bottom: 90px;
  align-content: center;
  justify-items: start;
}

.not-found h1 {
  max-width: 850px;
  margin: 24px 0;
  font-size: clamp(3.2rem, 8vw, 8rem);
  line-height: 0.9;
}

.not-found > p:not(.eyebrow) {
  margin-bottom: 35px;
  color: var(--muted);
  font-size: 1.1rem;
}
</style>

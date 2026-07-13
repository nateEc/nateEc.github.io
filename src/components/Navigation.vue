<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'

const route = useRoute()
const menuOpen = ref(false)
const { currentLanguage, toggleLanguage } = useLanguage()

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      work: '案例',
      experience: '经历',
      notes: '文章',
      contact: '联系',
      menu: '菜单',
      close: '关闭菜单',
      switchLabel: 'Switch to English',
      resume: '简历',
    }
  : {
      work: 'Casebook',
      experience: 'Experience',
      notes: 'Notes',
      contact: 'Contact',
      menu: 'Menu',
      close: 'Close menu',
      switchLabel: '切换到中文',
      resume: 'Résumé',
    })

const navItems = computed(() => [
  { hash: '#work', label: copy.value.work },
  { hash: '#experience', label: copy.value.experience },
  { hash: '#blog', label: copy.value.notes },
  { hash: '#contact', label: copy.value.contact },
])

const resumeHref = computed(() => currentLanguage.value === 'zh' ? '/resume-zh.pdf' : '/resume-en.pdf')

const closeMenu = () => {
  menuOpen.value = false
}

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(() => route.fullPath, closeMenu)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="site-header">
    <div class="shell nav-shell">
      <RouterLink class="wordmark" to="/" aria-label="Nathan Shan — home">
        <span class="wordmark__mark">NS</span>
        <span class="wordmark__name">Nathan Shan</span>
      </RouterLink>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.hash"
          :to="{ path: '/', hash: item.hash }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="nav-actions">
        <button class="language-button" type="button" :aria-label="copy.switchLabel" @click="toggleLanguage">
          {{ currentLanguage === 'en' ? '中' : 'EN' }}
        </button>
        <a class="resume-link" :href="resumeHref" target="_blank" rel="noopener">
          {{ copy.resume }} <span aria-hidden="true">↗</span>
        </a>
        <button
          class="menu-button"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? copy.close : copy.menu"
          @click="menuOpen = !menuOpen"
        >
          <span></span><span></span>
        </button>
      </div>
    </div>

    <div id="mobile-menu" :class="['mobile-menu', { 'is-open': menuOpen }]" :aria-hidden="!menuOpen">
      <nav aria-label="Mobile navigation">
        <RouterLink
          v-for="(item, index) in navItems"
          :key="item.hash"
          :to="{ path: '/', hash: item.hash }"
          :tabindex="menuOpen ? 0 : -1"
          @click="closeMenu"
        >
          <span>0{{ index + 1 }}</span>{{ item.label }}
        </RouterLink>
        <a :href="resumeHref" target="_blank" rel="noopener" :tabindex="menuOpen ? 0 : -1">
          <span>05</span>{{ copy.resume }} ↗
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid rgba(217, 222, 231, 0.9);
  background: rgba(247, 248, 250, 0.9);
  backdrop-filter: blur(18px);
}

.nav-shell {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 72px;
}

.wordmark {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: 11px;
  color: var(--ink);
  font-family: var(--display);
  font-weight: 700;
  text-decoration: none;
}

.wordmark__mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  color: var(--white);
  background: var(--ink);
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 0.69rem;
  letter-spacing: -0.04em;
}

.wordmark__name {
  font-size: 0.95rem;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.desktop-nav a,
.resume-link {
  position: relative;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.72rem;
  font-weight: 500;
  text-decoration: none;
}

.desktop-nav a::after {
  position: absolute;
  right: 0;
  bottom: -8px;
  left: 0;
  height: 1px;
  background: var(--ink);
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 160ms ease;
}

.desktop-nav a:hover,
.resume-link:hover {
  color: var(--ink);
}

.desktop-nav a:hover::after {
  transform: scaleX(1);
}

.nav-actions {
  display: flex;
  align-items: center;
  justify-self: end;
  gap: 16px;
}

.language-button {
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--ink);
  background: transparent;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 600;
}

.language-button:hover {
  border-color: var(--ink);
}

.menu-button {
  display: none;
  width: 42px;
  height: 42px;
  padding: 0 9px;
  border: 1px solid var(--line);
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
}

.menu-button span {
  display: block;
  width: 100%;
  height: 1px;
  margin: 6px 0;
  background: var(--ink);
  transition: transform 160ms ease;
}

.menu-button[aria-expanded='true'] span:first-child {
  transform: translateY(3.5px) rotate(45deg);
}

.menu-button[aria-expanded='true'] span:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

.mobile-menu {
  position: fixed;
  top: 72px;
  left: 0;
  z-index: -1;
  display: grid;
  width: 100%;
  height: calc(100dvh - 72px);
  padding: 32px 24px;
  place-items: start stretch;
  visibility: hidden;
  background: var(--paper);
  opacity: 0;
  transform: translateY(-16px);
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms;
}

.mobile-menu.is-open {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.mobile-menu nav {
  display: grid;
}

.mobile-menu a {
  display: flex;
  gap: 20px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-family: var(--display);
  font-size: clamp(1.75rem, 9vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.mobile-menu a span {
  padding-top: 8px;
  color: var(--blue);
  font-family: var(--mono);
  font-size: 0.67rem;
  letter-spacing: 0;
}

@media (max-width: 900px) {
  .nav-shell {
    grid-template-columns: 1fr auto;
  }

  .desktop-nav,
  .resume-link {
    display: none;
  }

  .menu-button {
    display: block;
  }
}
</style>

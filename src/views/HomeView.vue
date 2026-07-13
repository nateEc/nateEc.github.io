<script setup lang="ts">
import { watchEffect } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import ExperienceSection from '../components/ExperienceSection.vue'
import SkillsSection from '../components/SkillsSection.vue'
import PortfolioSection from '../components/PortfolioSection.vue'
import BlogSection from '../components/BlogSection.vue'
import ContactSection from '../components/ContactSection.vue'
import { useLanguage } from '../composables/useLanguage'
import { setPageMeta } from '../composables/usePageMeta'

const { currentLanguage } = useLanguage()

watchEffect(() => {
  setPageMeta(currentLanguage.value === 'zh'
    ? {
        title: 'Nathan Shan — AI Agent 工程师与可靠性系统',
        description: 'Nathan Shan 的 Agent Reliability Casebook：生产级 Agent、评测回归、桌面工具与实时语音系统。',
      }
    : {
        title: 'Nathan Shan — AI Agent Engineer & Reliability Systems',
        description: 'Nathan Shan builds reliable, observable, regression-tested agent systems, desktop tooling, and real-time voice products.',
      })
})
</script>

<template>
  <main>
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <SkillsSection />
    <PortfolioSection />
    <BlogSection />
    <ContactSection />
  </main>
</template>

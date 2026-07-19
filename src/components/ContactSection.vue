<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const form = ref({ name: '', email: '', subject: '', message: '' })

const copy = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: '联系',
      title: '有一个难以稳定下来的 Agent？',
      intro: '欢迎交流 Agent 可靠性、AI 产品和工程实践。你可以直接发邮件，也可以先在这里生成一封带上下文的邮件草稿。',
      email: '直接邮件',
      location: '北京，中国 · 可远程协作',
      formTitle: '生成邮件草稿',
      name: '你的名字',
      emailLabel: '你的邮箱',
      subject: '主题',
      message: '背景与问题',
      send: '在邮件应用中打开',
      privacy: '此表单不会上传或自动发送任何数据；提交后只会打开你的默认邮件应用。',
      placeholders: { name: '如何称呼你', email: 'you@company.com', subject: '想讨论的系统', message: '现在的背景、约束和希望改善的地方…' },
    }
  : {
      kicker: 'Contact',
      title: 'Have an agent that refuses to stay reliable?',
      intro: 'I’m open to thoughtful conversations about agent reliability, AI products, and engineering practice. Email me directly or prepare a contextual draft here.',
      email: 'Direct email',
      location: 'Beijing, China · Remote-friendly',
      formTitle: 'Prepare an email draft',
      name: 'Your name',
      emailLabel: 'Your email',
      subject: 'Subject',
      message: 'Context & problem',
      send: 'Open in email app',
      privacy: 'Nothing is uploaded or sent automatically. Submitting only opens a draft in your default email app.',
      placeholders: { name: 'How should I address you?', email: 'you@company.com', subject: 'The system you want to discuss', message: 'Share the context, constraints, and what you want to improve…' },
    })

const openDraft = () => {
  const subject = form.value.subject || (currentLanguage.value === 'zh' ? 'Portfolio 交流' : 'Portfolio conversation')
  const body = currentLanguage.value === 'zh'
    ? `Nathan 你好，\n\n${form.value.message}\n\n— ${form.value.name}\n${form.value.email}`
    : `Hi Nathan,\n\n${form.value.message}\n\n— ${form.value.name}\n${form.value.email}`
  window.location.href = `mailto:nathanshanusa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<template>
  <section id="contact" class="section contact" aria-labelledby="contact-title">
    <div class="shell contact-grid">
      <div class="contact-copy">
        <p class="eyebrow">{{ copy.kicker }}</p>
        <h2 id="contact-title">{{ copy.title }}</h2>
        <p class="contact-intro">{{ copy.intro }}</p>

        <dl class="contact-details">
          <div>
            <dt>{{ copy.email }}</dt>
            <dd><a href="mailto:nathanshanusa@gmail.com">nathanshanusa@gmail.com</a></dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{{ copy.location }}</dd>
          </div>
        </dl>

        <div class="social-links">
          <a href="https://github.com/nateEc" target="_blank" rel="noopener noreferrer" aria-label="Nathan Shan on GitHub">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/yukun-shan-803a02225/" target="_blank" rel="noopener noreferrer" aria-label="Nathan Shan on LinkedIn">LinkedIn ↗</a>
        </div>
      </div>

      <form class="contact-form" @submit.prevent="openDraft">
        <div class="form-heading">
          <p class="mono-label">{{ copy.formTitle }}</p>
          <span>mailto://</span>
        </div>

        <div class="field-row">
          <label>
            <span>{{ copy.name }}</span>
            <input v-model.trim="form.name" name="name" type="text" autocomplete="name" :placeholder="copy.placeholders.name" required />
          </label>
          <label>
            <span>{{ copy.emailLabel }}</span>
            <input v-model.trim="form.email" name="email" type="email" autocomplete="email" :placeholder="copy.placeholders.email" required />
          </label>
        </div>

        <label>
          <span>{{ copy.subject }}</span>
          <input v-model.trim="form.subject" name="subject" type="text" :placeholder="copy.placeholders.subject" />
        </label>

        <label>
          <span>{{ copy.message }}</span>
          <textarea v-model.trim="form.message" name="message" rows="6" :placeholder="copy.placeholders.message" required></textarea>
        </label>

        <button class="button" type="submit">{{ copy.send }} <span aria-hidden="true">↗</span></button>
        <p class="privacy-note"><span aria-hidden="true">ⓘ</span>{{ copy.privacy }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact {
  color: var(--white);
  background: #11161e;
}

.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(420px, 1.15fr);
  gap: clamp(60px, 10vw, 140px);
  align-items: start;
}

.contact .eyebrow {
  color: #7d9fff;
}

.contact-copy h2 {
  max-width: 640px;
  margin: 28px 0;
  font-size: clamp(3rem, 6vw, 6rem);
  line-height: 0.94;
}

.contact-intro {
  max-width: 610px;
  color: #9da8b8;
  font-size: 1.02rem;
}

.contact-details {
  display: grid;
  gap: 0;
  margin: 45px 0 30px;
  border-top: 1px solid #343c48;
}

.contact-details div {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 20px;
  padding: 17px 0;
  border-bottom: 1px solid #343c48;
}

.contact-details dt {
  color: #697587;
  font-family: var(--mono);
  font-size: 0.65rem;
  text-transform: uppercase;
}

.contact-details dd {
  margin: 0;
  color: #dbe2eb;
  font-size: 0.9rem;
}

.contact-details a {
  text-underline-offset: 4px;
}

.social-links {
  display: flex;
  gap: 24px;
}

.social-links a {
  color: #dbe2eb;
  font-family: var(--mono);
  font-size: 0.7rem;
  text-underline-offset: 5px;
}

.contact-form {
  display: grid;
  gap: 19px;
  padding: 30px;
  border: 1px solid #394250;
  background: #0b0f15;
  box-shadow: 12px 12px 0 rgba(37, 99, 235, 0.17);
}

.form-heading {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 17px;
  border-bottom: 1px solid #2e3642;
}

.form-heading p {
  margin: 0;
  color: #7d9fff;
}

.form-heading > span {
  color: #5e6a7b;
  font-family: var(--mono);
  font-size: 0.62rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

label {
  display: grid;
  gap: 7px;
}

label > span {
  color: #8995a6;
  font-family: var(--mono);
  font-size: 0.63rem;
  text-transform: uppercase;
}

input,
textarea {
  width: 100%;
  border: 1px solid #36404d;
  border-radius: 3px;
  color: #edf1f6;
  background: #121821;
}

input {
  min-height: 48px;
  padding: 0 13px;
}

textarea {
  min-height: 150px;
  padding: 13px;
  resize: vertical;
}

input::placeholder,
textarea::placeholder {
  color: #606c7d;
}

input:focus,
textarea:focus {
  border-color: #7193f0;
  outline: 2px solid rgba(37, 99, 235, 0.28);
}

.contact-form .button {
  justify-self: start;
  border-color: #f4f6f9;
  color: #0b0d10;
  background: #f4f6f9;
  cursor: pointer;
}

.privacy-note {
  display: flex;
  gap: 9px;
  margin: 0;
  color: #727f91;
  font-size: 0.73rem;
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .field-row {
    grid-template-columns: 1fr;
  }

  .contact-form {
    padding: 21px;
  }

  .contact-details div {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}
</style>

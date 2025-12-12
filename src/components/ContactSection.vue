<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const content = computed(() => {
  if (currentLanguage.value === 'zh') {
    return {
      title: '联系',
      titleHighlight: '我',
      heading: '保持联系',
      intro: '很高兴与您合作！<br>随时联系我...',
      labels: {
        name: '姓名',
        location: '位置',
        email: '邮箱',
        mobile: '手机号码'
      },
      form: {
        namePlaceholder: '您的姓名',
        emailPlaceholder: '您的邮箱',
        subjectPlaceholder: '输入主题',
        messagePlaceholder: '在此输入消息...',
        submit: '提交'
      },
      successMessage: '消息发送成功！'
    }
  }
  return {
    title: 'Contact',
    titleHighlight: 'Me',
    heading: 'GET IN TOUCH',
    intro: 'Hey! I am looking forward to start a project with you!<br>Feel free to reach out...',
    labels: {
      name: 'Name',
      location: 'Location',
      email: 'Email',
      mobile: 'Mobile Number'
    },
    form: {
      namePlaceholder: 'YOUR NAME',
      emailPlaceholder: 'YOUR EMAIL',
      subjectPlaceholder: 'ENTER SUBJECT',
      messagePlaceholder: 'Message Here...',
      submit: 'Submit'
    },
    successMessage: 'Message sent successfully!'
  }
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  alert(content.value.successMessage)
  formData.value = { name: '', email: '', subject: '', message: '' }
}
</script>

<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <h2 class="section-title">{{ content.title }} <span>{{ content.titleHighlight }}</span></h2>
      
      <div class="contact-grid">
        <div class="contact-info">
          <h3>{{ content.heading }}</h3>
          <p v-html="content.intro"></p>
          
          <div class="info-items">
            <div class="info-item">
              <div class="info-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {{ content.labels.name }}
              </div>
              <p>{{ currentLanguage === 'zh' ? '单玉昆 (Nathan)' : 'Nathan Shan' }}</p>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {{ content.labels.location }}
              </div>
              <a href="https://www.google.com/maps/place/Boston+University/@42.3504997,-71.1053991,15z/data=!4m6!3m5!1s0x89e379f063e53817:0x2b346e00e0a3bec8!8m2!3d42.3504997!4d-71.1053991!16zL20vMDFqZjk" target="_blank">
                {{ currentLanguage === 'zh' ? '上海，中国' : 'Shanghai, China' }}
              </a>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                {{ content.labels.email }}
              </div>
              <a href="mailto:nathanshanusa@gmail.com">nathanshanusa@gmail.com</a>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {{ content.labels.mobile }}
              </div>
              <a href="tel:+1234567890">+1 234 567 890</a>
            </div>
          </div>
          
          <div class="social-links">
            <a href="https://github.com/nateEc" target="_blank" class="social-link">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/yukun-nathan-shan-803a02225/" target="_blank" class="social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <form @submit="handleSubmit" class="contact-form">
          <div class="form-row">
            <input
              v-model="formData.name"
              type="text"
              :placeholder="content.form.namePlaceholder"
              required
            />
            <input
              v-model="formData.email"
              type="email"
              :placeholder="content.form.emailPlaceholder"
              required
            />
          </div>
          <input
            v-model="formData.subject"
            type="text"
            :placeholder="content.form.subjectPlaceholder"
          />
          <textarea
            v-model="formData.message"
            :placeholder="content.form.messagePlaceholder"
            rows="6"
            required
          ></textarea>
          <button type="submit" class="submit-button">
            {{ content.form.submit }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  min-height: 100vh;
  padding: 6rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 4rem;
  text-align: center;
}

.section-title span {
  color: var(--accent-color);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.contact-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.contact-info > p {
  color: var(--secondary-color);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--secondary-color);
}

.info-item p,
.info-item a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.info-item a:hover {
  color: var(--accent-color);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.social-link:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: translateY(-2px);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

.contact-form textarea {
  resize: vertical;
  min-height: 150px;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: var(--text-color);
  color: var(--bg-color);
  border: 2px solid var(--text-color);
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.submit-button:hover {
  background-color: transparent;
  color: var(--text-color);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

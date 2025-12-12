<template>
  <div class="intro-section">
    <div class="intro-content">
      <blockquote class="quote">
        "I am enough of an artist to draw freely upon my imagination. Imagination is more important
        than knowledge. Knowledge is limited. Imagination encircles the world."
      </blockquote>
      <div class="quote-author">
        <span>— Albert Einstein</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  z-index: 1000;
  animation: fadeOut 0.5s ease-out 2.5s forwards;
}

.intro-content {
  max-width: 800px;
  padding: 2rem;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

.quote {
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--text-color);
  font-style: italic;
  margin-bottom: 2rem;
}

.quote-author {
  font-size: 1rem;
  color: var(--secondary-color);
  font-style: normal;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@media (max-width: 768px) {
  .quote {
    font-size: 1rem;
  }
  
  .quote-author {
    font-size: 0.875rem;
  }
}
</style>

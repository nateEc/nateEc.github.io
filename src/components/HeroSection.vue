<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage } = useLanguage()
const activeStep = ref(3)

const content = computed(() => currentLanguage.value === 'zh'
  ? {
      kicker: 'AI Agent Engineer · Beijing',
      title: ['让 AI Agent', '经得住', '真实生产环境。'],
      intro: '我是 Nathan Shan。我把模型能力变成可靠、可观测、可回归的产品系统——从 Skill 路由与评测基础设施，到桌面 Agent 和实时语音工作流。',
      primary: '查看案例',
      secondary: '聊聊系统',
      availability: '目前在 VisionFlow AI 负责生产级 Agent 工程',
      traceTitle: 'Agent Trace Inspector',
      traceCase: 'sanitized · routing shadow',
      traceId: 'trace / vf-shadow-029',
      verdict: '判定：进入人工审核',
      stepLabel: '选择轨迹节点查看判定依据',
      detailLabels: ['输入', '结果', '门禁'],
    }
  : {
      kicker: 'AI Agent Engineer · Beijing',
      title: ['I make AI agents', 'survive contact', 'with production.'],
      intro: 'I’m Nathan Shan. I turn model capability into reliable, observable, regression-tested product systems—from skill routing and evaluation infrastructure to desktop agents and real-time voice workflows.',
      primary: 'Open the casebook',
      secondary: 'Discuss a system',
      availability: 'Currently building production agents at VisionFlow AI',
      traceTitle: 'Agent Trace Inspector',
      traceCase: 'sanitized · routing shadow',
      traceId: 'trace / vf-shadow-029',
      verdict: 'decision: held for review',
      stepLabel: 'Select a trace node to inspect its decision evidence',
      detailLabels: ['input', 'result', 'gate'],
    })

const traceSteps = computed(() => currentLanguage.value === 'zh'
  ? [
      { key: '01', name: '捕获运行', meta: 'tool + feedback', state: 'pass', detail: ['点踩 + 工具轨迹', '保存最小上下文', '隐私最小化'] },
      { key: '02', name: '标准化信号', meta: 'stable fields', state: 'pass', detail: ['route=calendar', '稳定字段已提取', '格式校验通过'] },
      { key: '03', name: '回放候选规则', meta: 'shadow mode', state: 'pass', detail: ['candidate=v17', '29 个套件中回放', '无线上流量影响'] },
      { key: '04', name: '比较语义', meta: 'latency + output', state: 'review', detail: ['基线 vs. 候选', '+184ms / 语义变化', '超出自动接受阈值'] },
      { key: '05', name: '发布决策', meta: 'atomic bundle', state: 'held', detail: ['原子审查包', '等待责任人确认', '未进入生产'] },
    ]
  : [
      { key: '01', name: 'Capture run', meta: 'tool + feedback', state: 'pass', detail: ['negative feedback + tool trace', 'minimal context retained', 'privacy minimization'] },
      { key: '02', name: 'Normalize signal', meta: 'stable fields', state: 'pass', detail: ['route=calendar', 'stable fields extracted', 'schema gate passed'] },
      { key: '03', name: 'Replay candidate rule', meta: 'shadow mode', state: 'pass', detail: ['candidate=v17', 'replayed across 29 suites', 'zero production traffic impact'] },
      { key: '04', name: 'Compare semantics', meta: 'latency + output', state: 'review', detail: ['baseline vs. candidate', '+184ms / semantic delta', 'outside auto-accept bound'] },
      { key: '05', name: 'Release decision', meta: 'atomic bundle', state: 'held', detail: ['atomic review bundle', 'owner confirmation required', 'not promoted to production'] },
    ])

const activeTrace = computed(() => traceSteps.value[activeStep.value] ?? traceSteps.value[0]!)
</script>

<template>
  <section id="home" class="hero" aria-labelledby="hero-title">
    <div class="shell hero-grid">
      <div :class="['hero-copy', { 'is-zh': currentLanguage === 'zh' }]">
        <p class="eyebrow">{{ content.kicker }}</p>
        <h1 id="hero-title">
          <span v-for="(line, index) in content.title" :key="line" :class="{ accent: index === 1 }">{{ line }}</span>
        </h1>
        <p class="hero-intro">{{ content.intro }}</p>
        <div class="hero-actions">
          <a class="button" href="#work">{{ content.primary }} <span aria-hidden="true">↓</span></a>
          <a class="button button--ghost" href="#contact">{{ content.secondary }}</a>
        </div>
        <p class="availability"><span aria-hidden="true"></span>{{ content.availability }}</p>
      </div>

      <article class="trace-window" aria-labelledby="trace-title">
        <div class="trace-chrome">
          <div class="window-dots" aria-hidden="true"><span></span><span></span><span></span></div>
          <p id="trace-title">{{ content.traceTitle }}</p>
          <span>LIVE / SCRUBBED</span>
        </div>

        <div class="trace-meta">
          <div>
            <p>{{ content.traceId }}</p>
            <strong>{{ content.traceCase }}</strong>
          </div>
          <span class="trace-verdict">{{ content.verdict }}</span>
        </div>

        <p class="sr-only">{{ content.stepLabel }}</p>
        <ol class="trace-steps">
          <li v-for="(step, index) in traceSteps" :key="step.key">
            <button
              type="button"
              :class="['trace-step', `state-${step.state}`, { active: activeStep === index }]"
              :aria-pressed="activeStep === index"
              @click="activeStep = index"
            >
              <span class="trace-index">{{ step.key }}</span>
              <span class="trace-node" aria-hidden="true"></span>
              <span class="trace-name"><strong>{{ step.name }}</strong><small>{{ step.meta }}</small></span>
              <span class="trace-state">{{ step.state }}</span>
            </button>
          </li>
        </ol>

        <div class="trace-detail" aria-live="polite">
          <p class="mono-label">node / {{ activeTrace.key }}</p>
          <dl>
            <div v-for="(item, index) in activeTrace.detail" :key="item">
              <dt>{{ content.detailLabels[index] }}</dt>
              <dd>{{ item }}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>

    <div class="shell hero-footnote" aria-hidden="true">
      <span>01 — observe</span><span>02 — replay</span><span>03 — decide</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: grid;
  min-height: 100svh;
  padding: 148px 0 42px;
  align-items: center;
  overflow: hidden;
}

.hero::after {
  position: absolute;
  top: 72px;
  right: -18vw;
  z-index: -1;
  width: 58vw;
  height: 58vw;
  border: 1px solid rgba(37, 99, 235, 0.12);
  border-radius: 50%;
  box-shadow: inset 0 0 0 80px rgba(37, 99, 235, 0.018), inset 0 0 0 160px rgba(37, 99, 235, 0.018);
  content: '';
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(500px, 0.92fr);
  gap: clamp(38px, 5vw, 70px);
  align-items: center;
}

.hero-copy h1 {
  max-width: 690px;
  margin: 22px 0 28px;
  font-size: clamp(3.4rem, 5.6vw, 6.25rem);
  line-height: 0.91;
}

.hero-copy h1 span {
  display: block;
}

.hero-copy h1 .accent {
  color: var(--blue);
}

.hero-intro {
  max-width: 625px;
  margin-bottom: 30px;
  color: var(--muted);
  font-size: clamp(1.04rem, 1.4vw, 1.2rem);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.availability {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 26px 0 0;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.7rem;
}

.availability span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--teal);
  box-shadow: 0 0 0 5px rgba(15, 118, 110, 0.12);
}

.trace-window {
  border: 1px solid #252b36;
  border-radius: 7px;
  color: #e7ebf1;
  background: #0d1118;
  box-shadow: var(--shadow), 14px 14px 0 rgba(37, 99, 235, 0.13);
  overflow: hidden;
}

.trace-chrome {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 45px;
  padding: 0 15px;
  border-bottom: 1px solid #252b36;
  color: #9ba5b4;
  font-family: var(--mono);
  font-size: 0.61rem;
  letter-spacing: 0.04em;
}

.trace-chrome p {
  margin: 0;
  color: #dce3ed;
}

.trace-chrome > span {
  justify-self: end;
  color: #6bd2c6;
}

.window-dots {
  display: flex;
  gap: 5px;
}

.window-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3a4350;
}

.trace-meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 20px 22px;
  border-bottom: 1px solid #252b36;
}

.trace-meta p,
.trace-meta strong {
  display: block;
  margin: 0;
  font-family: var(--mono);
}

.trace-meta p {
  margin-bottom: 3px;
  color: #778293;
  font-size: 0.62rem;
}

.trace-meta strong {
  color: #e7ebf1;
  font-size: 0.76rem;
}

.trace-verdict {
  padding: 5px 8px;
  border: 1px solid #765421;
  border-radius: 3px;
  color: #f0bd68;
  background: rgba(183, 121, 31, 0.11);
  font-family: var(--mono);
  font-size: 0.62rem;
  white-space: nowrap;
}

.trace-steps {
  padding: 10px 0;
  margin: 0;
  list-style: none;
}

.trace-step {
  display: grid;
  grid-template-columns: 30px 18px 1fr auto;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 10px 22px;
  border: 0;
  color: #9ba5b4;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.trace-step:hover,
.trace-step.active {
  color: #f4f6f9;
  background: #151b24;
}

.trace-step.active {
  box-shadow: inset 2px 0 0 var(--blue);
}

.trace-index,
.trace-state,
.trace-name small {
  font-family: var(--mono);
  font-size: 0.59rem;
}

.trace-index {
  color: #5d6877;
}

.trace-node {
  position: relative;
  width: 9px;
  height: 9px;
  border: 2px solid #0d1118;
  border-radius: 50%;
  background: #5ec5b8;
  box-shadow: 0 0 0 1px #5ec5b8;
}

.trace-node::after {
  position: absolute;
  top: 10px;
  left: 2px;
  width: 1px;
  height: 31px;
  background: #323b48;
  content: '';
}

.trace-steps li:last-child .trace-node::after {
  display: none;
}

.state-review .trace-node,
.state-held .trace-node {
  background: #e2a849;
  box-shadow: 0 0 0 1px #e2a849;
}

.trace-name strong,
.trace-name small {
  display: block;
}

.trace-name strong {
  color: inherit;
  font-size: 0.75rem;
  font-weight: 500;
}

.trace-name small {
  margin-top: 2px;
  color: #697586;
}

.trace-state {
  text-transform: uppercase;
}

.state-pass .trace-state {
  color: #5ec5b8;
}

.state-review .trace-state,
.state-held .trace-state {
  color: #e2a849;
}

.trace-detail {
  padding: 17px 22px 19px;
  border-top: 1px solid #252b36;
  background: #10151d;
}

.trace-detail .mono-label {
  margin-bottom: 12px;
  color: #718096;
}

.trace-detail dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 0;
}

.trace-detail dl div {
  min-width: 0;
  padding: 8px;
  border: 1px solid #252b36;
  border-radius: 3px;
}

.trace-detail dt {
  color: #697586;
  font-family: var(--mono);
  font-size: 0.55rem;
  text-transform: uppercase;
}

.trace-detail dd {
  margin: 4px 0 0;
  color: #d3d9e2;
  font-family: var(--mono);
  font-size: 0.58rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.hero-footnote {
  display: flex;
  gap: 30px;
  justify-content: flex-end;
  align-self: end;
  margin-top: 38px;
  color: var(--quiet);
  font-family: var(--mono);
  font-size: 0.61rem;
  text-transform: uppercase;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1100px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    max-width: 820px;
  }

  .trace-window {
    width: min(100%, 760px);
  }
}

@media (max-width: 620px) {
  .hero {
    padding-top: 120px;
  }

  .hero-copy h1 {
    font-size: clamp(3rem, 15vw, 4.2rem);
  }

  .hero-copy.is-zh h1 {
    font-size: clamp(2.9rem, 12.5vw, 3.4rem);
    line-height: 0.94;
  }

  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .trace-window {
    margin-inline: -8px;
    width: calc(100% + 16px);
  }

  .trace-chrome {
    grid-template-columns: 1fr auto;
  }

  .window-dots {
    display: none;
  }

  .trace-meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .trace-step {
    grid-template-columns: 24px 14px 1fr;
    padding-inline: 15px;
  }

  .trace-state {
    display: none;
  }

  .trace-detail {
    padding-inline: 15px;
  }

  .trace-detail dl {
    grid-template-columns: 1fr;
  }

  .hero-footnote {
    justify-content: flex-start;
    gap: 15px;
  }
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { Language } from '../../data/portfolio'

const props = defineProps<{ language: Language }>()

type ReplayFixture = {
  id: string
  signal: string
  severity: string
  title: { en: string; zh: string }
  prompt: { en: string; zh: string }
  baseline: { en: string; zh: string }
  candidate: { en: string; zh: string }
  verdict: 'pass' | 'review'
  evidence: string
  delta: string
}

const fixtures: ReplayFixture[] = [
  {
    id: 'empty-answer',
    signal: 'quality.empty_answer',
    severity: 'P1',
    title: { en: 'Empty final answer', zh: '最终回复为空' },
    prompt: {
      en: 'Summarize the attached invoice and flag any duplicate charges. [customer_id: REDACTED]',
      zh: '总结所附发票，并标记重复收费项。[customer_id: 已脱敏]',
    },
    baseline: { en: 'No final answer emitted.', zh: '没有输出最终回复。' },
    candidate: {
      en: 'Found one possible duplicate: “Platform fee”, billed twice for ¥480.',
      zh: '发现一项可能重复收费：“平台服务费”被收取两次，每次 ¥480。',
    },
    verdict: 'pass',
    evidence: 'final_answer.present = true',
    delta: '+1 stable signal',
  },
  {
    id: 'tool-failure',
    signal: 'tool.required_evidence_missing',
    severity: 'P1',
    title: { en: 'Missing tool evidence', zh: '缺少工具证据' },
    prompt: {
      en: 'Check the latest deployment status before answering. [workspace: synthetic-demo]',
      zh: '回答前先检查最新部署状态。[workspace: synthetic-demo]',
    },
    baseline: { en: '“Deployment is healthy.” No tool trace attached.', zh: '“部署状态健康。”但没有附带工具轨迹。' },
    candidate: { en: 'Health check passed at 09:42 UTC. Evidence: deploy_status#run-1842.', zh: '健康检查于 09:42 UTC 通过。证据：deploy_status#run-1842。' },
    verdict: 'pass',
    evidence: 'tool_evidence.status = present',
    delta: '0 duplicate calls',
  },
  {
    id: 'semantic-drift',
    signal: 'feedback.negative',
    severity: 'P2',
    title: { en: 'Semantic drift', zh: '语义偏移' },
    prompt: {
      en: 'Keep the rollout report-only until the owner approves blocking mode.',
      zh: '在负责人批准阻塞模式前，保持 report-only。',
    },
    baseline: { en: 'Promoted the suite to blocking.', zh: '已将套件升级为 blocking。' },
    candidate: { en: 'Kept report-only and attached the owner review request.', zh: '保持 report-only，并附上负责人审核请求。' },
    verdict: 'review',
    evidence: 'semantic_judge.score = 0.91',
    delta: 'human review required',
  },
]

const activeFixtureId = ref(fixtures[0]!.id)
const activeStep = ref(0)
const running = ref(false)
const completed = ref(true)
let timer: number | undefined

const activeFixture = computed<ReplayFixture>(() => fixtures.find((fixture) => fixture.id === activeFixtureId.value) ?? fixtures[0]!)
const t = (value: { en: string; zh: string }) => value[props.language]
const copy = computed(() => props.language === 'zh'
  ? {
      label: '交互式重建 · 合成数据 · 生产字段结构',
      title: 'Replay Lab',
      intro: '选择一种失败信号，运行一次脱敏回放，再检查真正参与发布判断的稳定证据。',
      cases: '失败样例',
      run: '重新回放',
      running: '正在回放',
      trace: '运行轨迹',
      baseline: '基线',
      candidate: '候选版本',
      expected: '稳定证据',
      verdict: '自动判断',
      pass: '通过',
      review: '需人工审核',
      privacy: 'PII scan',
      privacyValue: '0 命中',
      cost: '隔离成本',
      costValue: '$0.0068',
      source: '结构来源',
      sourceValue: 'RegressionCandidate → RegressionCase',
    }
  : {
      label: 'Interactive reconstruction · synthetic data · production field shape',
      title: 'Replay Lab',
      intro: 'Choose a failure signal, replay a scrubbed case, then inspect the stable evidence that actually informs a release decision.',
      cases: 'Failure fixtures',
      run: 'Replay case',
      running: 'Replaying',
      trace: 'Runtime trace',
      baseline: 'Baseline',
      candidate: 'Candidate',
      expected: 'Stable evidence',
      verdict: 'Automation verdict',
      pass: 'Pass',
      review: 'Needs review',
      privacy: 'PII scan',
      privacyValue: '0 findings',
      cost: 'Isolated cost',
      costValue: '$0.0068',
      source: 'Schema source',
      sourceValue: 'RegressionCandidate → RegressionCase',
    })

const steps = computed(() => props.language === 'zh'
  ? ['捕获候选', '脱敏快照', '原路径回放', '稳定字段比对', '生成审查包']
  : ['Capture candidate', 'Redact snapshot', 'Replay origin path', 'Compare stable fields', 'Build review bundle'])

const runReplay = () => {
  if (timer) window.clearInterval(timer)
  running.value = true
  completed.value = false
  activeStep.value = 0
  timer = window.setInterval(() => {
    if (activeStep.value >= steps.value.length - 1) {
      if (timer) window.clearInterval(timer)
      running.value = false
      completed.value = true
      return
    }
    activeStep.value += 1
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : 360)
}

const selectFixture = (fixture: ReplayFixture) => {
  activeFixtureId.value = fixture.id
  completed.value = true
  activeStep.value = steps.value.length - 1
}

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <section class="replay-demo" aria-labelledby="replay-demo-title">
    <header class="demo-header">
      <div>
        <p class="demo-kicker"><span aria-hidden="true"></span>{{ copy.label }}</p>
        <h2 id="replay-demo-title">{{ copy.title }}</h2>
      </div>
      <p>{{ copy.intro }}</p>
    </header>

    <div class="replay-console">
      <aside class="fixture-rail" :aria-label="copy.cases">
        <p>{{ copy.cases }}</p>
        <button
          v-for="fixture in fixtures"
          :key="fixture.id"
          type="button"
          :class="{ active: fixture.id === activeFixture.id }"
          :aria-pressed="fixture.id === activeFixture.id"
          @click="selectFixture(fixture)"
        >
          <span>{{ fixture.severity }}</span>
          <strong>{{ t(fixture.title) }}</strong>
          <small>{{ fixture.signal }}</small>
        </button>
      </aside>

      <div class="replay-workspace">
        <div class="case-bar">
          <div>
            <span class="status-light" aria-hidden="true"></span>
            <span>case / synthetic-{{ activeFixture.id }}</span>
          </div>
          <button type="button" :disabled="running" @click="runReplay">
            <span aria-hidden="true">↻</span> {{ running ? copy.running : copy.run }}
          </button>
        </div>

        <div class="prompt-strip">
          <span>prompt_excerpt</span>
          <p>{{ t(activeFixture.prompt) }}</p>
        </div>

        <ol class="trace" :aria-label="copy.trace">
          <li
            v-for="(step, index) in steps"
            :key="step"
            :class="{ reached: completed || index <= activeStep, current: running && index === activeStep }"
          >
            <button type="button" @click="activeStep = index">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              {{ step }}
            </button>
          </li>
        </ol>

        <div class="comparison-grid" :class="{ muted: !completed }" aria-live="polite">
          <article>
            <p>{{ copy.baseline }}</p>
            <div class="response response--baseline">{{ t(activeFixture.baseline) }}</div>
            <small>automation_verdict = fail</small>
          </article>
          <article>
            <p>{{ copy.candidate }}</p>
            <div class="response response--candidate">{{ t(activeFixture.candidate) }}</div>
            <small>{{ activeFixture.evidence }}</small>
          </article>
        </div>

        <div class="verdict-row" :class="{ muted: !completed }">
          <div>
            <span>{{ copy.verdict }}</span>
            <strong :class="`verdict-${activeFixture.verdict}`">
              {{ activeFixture.verdict === 'pass' ? copy.pass : copy.review }}
            </strong>
          </div>
          <div><span>{{ copy.privacy }}</span><strong>{{ copy.privacyValue }}</strong></div>
          <div><span>{{ copy.cost }}</span><strong>{{ copy.costValue }}</strong></div>
          <div><span>{{ copy.expected }}</span><strong>{{ activeFixture.delta }}</strong></div>
        </div>
      </div>
    </div>

    <footer class="schema-note">
      <span>{{ copy.source }}</span>
      <code>{{ copy.sourceValue }}</code>
    </footer>
  </section>
</template>

<style scoped>
.replay-demo {
  --demo-blue: #79a7ff;
  --demo-green: #6ee7b7;
  --demo-amber: #f7c66b;
  overflow: hidden;
  color: #e8edf6;
  background: #080c13;
  border: 1px solid #273140;
  border-radius: 12px;
  box-shadow: 0 28px 80px rgb(3 7 14 / 28%);
}

.demo-header {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(280px, 1.2fr);
  gap: 48px;
  padding: clamp(28px, 5vw, 54px);
  border-bottom: 1px solid #273140;
  background: radial-gradient(circle at 10% 0%, rgb(37 99 235 / 20%), transparent 42%);
}

.demo-kicker,
.fixture-rail > p,
.prompt-strip > span,
.comparison-grid article > p,
.verdict-row span,
.schema-note span {
  margin: 0;
  color: #8c99aa;
  font-family: var(--mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.demo-kicker span {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 9px;
  border-radius: 50%;
  background: var(--demo-green);
  box-shadow: 0 0 14px var(--demo-green);
}

.demo-header h2 {
  margin: 12px 0 0;
  color: #f8fbff;
  font-size: clamp(2.4rem, 5vw, 5rem);
  line-height: 0.92;
}

.demo-header > p {
  align-self: end;
  max-width: 640px;
  margin: 0;
  color: #a8b3c3;
  font-size: 1rem;
}

.replay-console {
  display: grid;
  grid-template-columns: 255px minmax(0, 1fr);
  min-height: 610px;
}

.fixture-rail {
  padding: 28px 18px;
  border-right: 1px solid #273140;
  background: #0b1018;
}

.fixture-rail > p {
  padding: 0 10px 13px;
}

.fixture-rail button {
  width: 100%;
  padding: 15px 12px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: #a8b3c3;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.fixture-rail button + button {
  margin-top: 7px;
}

.fixture-rail button:hover,
.fixture-rail button.active {
  border-color: #32435e;
  color: #f4f7fb;
  background: #111a28;
}

.fixture-rail button span {
  display: inline-grid;
  min-width: 28px;
  height: 20px;
  margin-right: 7px;
  place-items: center;
  border-radius: 999px;
  color: #07101e;
  background: var(--demo-amber);
  font-family: var(--mono);
  font-size: 0.6rem;
  font-weight: 700;
}

.fixture-rail button strong,
.fixture-rail button small {
  display: block;
}

.fixture-rail button strong {
  margin-top: 8px;
  font-family: var(--body);
  font-size: 0.84rem;
}

.fixture-rail button small {
  margin-top: 3px;
  color: #68778a;
  font-family: var(--mono);
  font-size: 0.58rem;
  overflow-wrap: anywhere;
}

.replay-workspace {
  min-width: 0;
  padding: 20px;
  background-image: linear-gradient(rgb(255 255 255 / 2.5%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 2.5%) 1px, transparent 1px);
  background-size: 34px 34px;
}

.case-bar,
.case-bar > div,
.verdict-row > div {
  display: flex;
  align-items: center;
}

.case-bar {
  justify-content: space-between;
  gap: 20px;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #273140;
  border-radius: 7px;
  background: #0c121c;
  font-family: var(--mono);
  font-size: 0.67rem;
}

.status-light {
  width: 8px;
  height: 8px;
  margin-right: 9px;
  border-radius: 50%;
  background: var(--demo-blue);
  box-shadow: 0 0 11px var(--demo-blue);
}

.case-bar button {
  padding: 7px 10px;
  border: 1px solid #3c4d66;
  border-radius: 5px;
  color: #eaf1ff;
  background: #16243a;
  font-family: var(--mono);
  font-size: 0.64rem;
  cursor: pointer;
}

.case-bar button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.prompt-strip {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 18px;
  padding: 20px 10px;
  border-bottom: 1px solid #273140;
}

.prompt-strip p {
  margin: 0;
  color: #d8e0ec;
  font-family: var(--mono);
  font-size: 0.72rem;
  line-height: 1.6;
}

.trace {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 26px 0;
  margin: 0;
  list-style: none;
}

.trace li {
  position: relative;
}

.trace li:not(:last-child)::after {
  position: absolute;
  top: 12px;
  left: calc(50% + 12px);
  width: calc(100% - 24px);
  height: 1px;
  background: #293546;
  content: '';
}

.trace li.reached:not(:last-child)::after {
  background: var(--demo-blue);
}

.trace button {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 5px;
  border: 0;
  color: #6e7c8f;
  background: transparent;
  font-family: var(--mono);
  font-size: 0.59rem;
  cursor: pointer;
}

.trace button span {
  display: grid;
  width: 25px;
  height: 25px;
  margin: 0 auto 8px;
  place-items: center;
  border: 1px solid #354255;
  border-radius: 50%;
  background: #0a0f17;
}

.trace .reached button {
  color: #c9d6e8;
}

.trace .reached button span {
  border-color: var(--demo-blue);
  color: #07101e;
  background: var(--demo-blue);
}

.trace .current button span {
  box-shadow: 0 0 0 5px rgb(121 167 255 / 13%), 0 0 18px rgb(121 167 255 / 35%);
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  transition: opacity 180ms ease;
}

.comparison-grid article {
  min-width: 0;
  padding: 16px;
  border: 1px solid #2b3543;
  border-radius: 8px;
  background: rgb(10 15 23 / 88%);
}

.response {
  min-height: 88px;
  padding: 14px;
  margin: 10px 0;
  border-left: 2px solid #ef7a7a;
  color: #d6deea;
  background: #0e141e;
  font-size: 0.8rem;
}

.response--candidate {
  border-left-color: var(--demo-green);
}

.comparison-grid small {
  color: #7f8da1;
  font-family: var(--mono);
  font-size: 0.6rem;
}

.verdict-row {
  display: grid;
  grid-template-columns: 1.1fr 0.8fr 0.8fr 1fr;
  margin-top: 12px;
  border: 1px solid #2b3543;
  border-radius: 8px;
  background: #0c121b;
  transition: opacity 180ms ease;
}

.verdict-row > div {
  min-height: 67px;
  padding: 10px 13px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-right: 1px solid #2b3543;
}

.verdict-row > div:last-child {
  border: 0;
}

.verdict-row strong {
  margin-top: 4px;
  color: #d9e2ef;
  font-family: var(--mono);
  font-size: 0.7rem;
}

.verdict-row strong.verdict-pass { color: var(--demo-green); }
.verdict-row strong.verdict-review { color: var(--demo-amber); }
.muted { opacity: 0.28; }

.schema-note {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 22px;
  border-top: 1px solid #273140;
  background: #0b1018;
}

.schema-note code {
  color: #aeb9c8;
  font-family: var(--mono);
  font-size: 0.67rem;
}

@media (max-width: 850px) {
  .demo-header { grid-template-columns: 1fr; gap: 20px; }
  .replay-console { grid-template-columns: 1fr; }
  .fixture-rail { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; border-right: 0; border-bottom: 1px solid #273140; }
  .fixture-rail > p { grid-column: 1 / -1; }
  .fixture-rail button + button { margin-top: 0; }
  .verdict-row { grid-template-columns: repeat(2, 1fr); }
  .verdict-row > div:nth-child(2) { border-right: 0; }
  .verdict-row > div:nth-child(-n + 2) { border-bottom: 1px solid #2b3543; }
}

@media (max-width: 620px) {
  .demo-header { padding: 24px 18px; }
  .fixture-rail { grid-template-columns: 1fr; }
  .replay-workspace { padding: 12px; }
  .prompt-strip { grid-template-columns: 1fr; gap: 5px; }
  .trace { overflow-x: auto; grid-template-columns: repeat(5, 105px); }
  .comparison-grid { grid-template-columns: 1fr; }
  .schema-note { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  .comparison-grid,
  .verdict-row { transition: none; }
}
</style>

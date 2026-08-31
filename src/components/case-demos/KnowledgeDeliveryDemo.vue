<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Language } from '../../data/portfolio'

const props = defineProps<{ language: Language }>()

type Localized = { en: string; zh: string }

type EvidencePhase = {
  id: string
  index: string
  label: Localized
  status: Localized
  headline: Localized
  description: Localized
  objectLabel: Localized
  objectValue: Localized
  assertion: Localized
  source: Localized
  version: string
  owner: Localized
}

const phases: EvidencePhase[] = [
  {
    id: 'intake',
    index: '01',
    label: { en: 'Intake', zh: '接入' },
    status: { en: 'REGISTERED', zh: '已登记' },
    headline: { en: 'Register the source before extracting a claim.', zh: '先登记来源，再提取结论。' },
    description: { en: 'The source register records provenance, access boundary, and the version that can be reviewed. No customer material is shown in this public demo.', zh: '来源登记记录出处、访问边界与可审核版本。本公开 Demo 不展示任何客户资料。' },
    objectLabel: { en: 'Source object', zh: '来源对象' },
    objectValue: { en: 'Operating brief · synthetic', zh: '运行简报 · 合成' },
    assertion: { en: 'Scope has not been inferred from a filename.', zh: '范围并非从文件名中被推断出来。' },
    source: { en: 'Synthetic brief / section 02', zh: '合成简报 / 第 02 节' },
    version: 'v1.3',
    owner: { en: 'Delivery lead', zh: '交付负责人' },
  },
  {
    id: 'distill',
    index: '02',
    label: { en: 'Distill', zh: '提炼' },
    status: { en: 'VERSIONED', zh: '已版本化' },
    headline: { en: 'Turn material into objects, not a one-way summary.', zh: '把资料转成对象，而不是一次性总结。' },
    description: { en: 'Distillation creates named knowledge objects with their own change history, instead of hiding interpretation inside one polished narrative.', zh: '提炼过程创建有名称、有变更历史的知识对象，而不是把解释隐藏进一篇精致叙事。' },
    objectLabel: { en: 'Knowledge object', zh: '知识对象' },
    objectValue: { en: 'Decision map · 4 linked units', zh: '决策地图 · 4 个关联单元' },
    assertion: { en: 'An unresolved dependency is carried forward as an exception.', zh: '未解决依赖会以例外状态被继续携带。' },
    source: { en: 'Object revision / change note 03', zh: '对象修订 / 变更说明 03' },
    version: 'v1.4',
    owner: { en: 'Knowledge editor', zh: '知识编辑' },
  },
  {
    id: 'bind',
    index: '03',
    label: { en: 'Bind', zh: '绑定' },
    status: { en: 'TRACEABLE', zh: '可追溯' },
    headline: { en: 'A decision claim earns its place with a trace.', zh: '决策结论必须用证据链证明其存在。' },
    description: { en: 'The assertion is linked to a precise source fragment, its current version, and a responsible reviewer. A citation is treated as a contract, not decoration.', zh: '结论关联到精确来源片段、当前版本和负责审核者。引用被视作契约，而非装饰。' },
    objectLabel: { en: 'Bound assertion', zh: '已绑定结论' },
    objectValue: { en: 'Readiness dependency · explicit', zh: '就绪依赖 · 已显式表达' },
    assertion: { en: 'Readiness stays conditional until the dependency is accepted.', zh: '在依赖被验收之前，就绪度保持条件状态。' },
    source: { en: 'Synthetic interview / minute 14:20', zh: '合成访谈 / 第 14:20 分钟' },
    version: 'v1.4',
    owner: { en: 'Domain reviewer', zh: '领域审核者' },
  },
  {
    id: 'review',
    index: '04',
    label: { en: 'Review', zh: '审核' },
    status: { en: 'NEEDS DECISION', zh: '待决策' },
    headline: { en: 'Human acceptance is a state, not an email thread.', zh: '人工验收是一种状态，不是一条邮件线程。' },
    description: { en: 'Review separates accepted evidence from open exceptions. The system can prepare a package, but it cannot silently promote a draft into a client decision.', zh: '审核将已接受的证据与开放例外分开。系统可准备交付包，但不能悄然把草稿升级为客户决策。' },
    objectLabel: { en: 'Review gate', zh: '审核门禁' },
    objectValue: { en: '1 accepted · 1 clarification', zh: '1 项已验收 · 1 项待澄清' },
    assertion: { en: 'The exception is visible to the approver before delivery.', zh: '例外会在交付前对批准人可见。' },
    source: { en: 'Review packet / decision item 07', zh: '审核包 / 决策项 07' },
    version: 'v1.5',
    owner: { en: 'Accountable approver', zh: '责任批准人' },
  },
  {
    id: 'deliver',
    index: '05',
    label: { en: 'Deliver', zh: '交付' },
    status: { en: 'PACKAGE READY', zh: '交付包就绪' },
    headline: { en: 'Ship a package whose decision path can be reopened.', zh: '交付一个可以重新打开决策路径的内容包。' },
    description: { en: 'The final package retains its manifest, version, acceptance status, and unresolved items so controlled environments do not lose context after handoff.', zh: '最终交付包保留清单、版本、验收状态与未解决项，使受控环境不会在交接后丢失上下文。' },
    objectLabel: { en: 'Delivery package', zh: '交付包' },
    objectValue: { en: 'Manifest · reviewable export', zh: '清单 · 可审核导出' },
    assertion: { en: 'Delivery can be reopened without recreating the reasoning path.', zh: '无需重新创建推理路径即可重新打开交付。' },
    source: { en: 'Package manifest / revision 05', zh: '交付包清单 / 修订版 05' },
    version: 'v1.5',
    owner: { en: 'Delivery owner', zh: '交付责任人' },
  },
]

const activeId = ref('bind')
const activePhase = computed(() => phases.find((phase) => phase.id === activeId.value) ?? phases[0]!)
const t = (value: Localized) => value[props.language]

const copy = computed(() => props.language === 'zh'
  ? {
      label: '合成案例数据 · 不含内部来源或客户信息',
      title: 'Evidence Rail',
      intro: '点击任一阶段，检查结论如何在交付前获得来源、版本与人工状态。',
      phase: '阶段',
      active: '当前结论',
      source: '来源片段',
      version: '版本',
      owner: '责任人',
      trace: '审计链路',
      traceValue: '来源 → 对象 → 结论 → 审核 → 交付',
      boundary: '公开边界',
      boundaryValue: '仅合成数据',
      status: '状态',
    }
  : {
      label: 'Synthetic case data · no internal sources or customer information',
      title: 'Evidence Rail',
      intro: 'Select a stage to inspect how a claim earns a source, version, and human state before delivery.',
      phase: 'Phase',
      active: 'Active assertion',
      source: 'Source fragment',
      version: 'Version',
      owner: 'Owner',
      trace: 'Audit trail',
      traceValue: 'source → object → assertion → review → delivery',
      boundary: 'Public boundary',
      boundaryValue: 'synthetic data only',
      status: 'Status',
    })
</script>

<template>
  <section class="knowledge-demo" aria-labelledby="knowledge-demo-title">
    <header class="knowledge-demo__header">
      <div>
        <p class="knowledge-demo__kicker"><span aria-hidden="true"></span>{{ copy.label }}</p>
        <h2 id="knowledge-demo-title">{{ copy.title }}</h2>
      </div>
      <p>{{ copy.intro }}</p>
    </header>

    <div class="knowledge-demo__frame">
      <nav class="evidence-rail" :aria-label="copy.title">
        <button
          v-for="phase in phases"
          :key="phase.id"
          type="button"
          :class="{ active: phase.id === activeId }"
          :aria-pressed="phase.id === activeId"
          @click="activeId = phase.id"
        >
          <span>{{ phase.index }}</span>
          <strong>{{ t(phase.label) }}</strong>
          <small>{{ t(phase.status) }}</small>
        </button>
      </nav>

      <div class="evidence-workspace" aria-live="polite">
        <article class="evidence-object">
          <p>{{ copy.phase }} / {{ activePhase.index }} · {{ t(activePhase.status) }}</p>
          <h3>{{ t(activePhase.headline) }}</h3>
          <p>{{ t(activePhase.description) }}</p>
          <div class="evidence-object__record">
            <span>{{ t(activePhase.objectLabel) }}</span>
            <strong>{{ t(activePhase.objectValue) }}</strong>
          </div>
        </article>

        <article class="assertion-card">
          <p>{{ copy.active }}</p>
          <blockquote>“{{ t(activePhase.assertion) }}”</blockquote>
          <div class="assertion-card__line" aria-hidden="true"><span></span><i></i><span></span></div>
          <dl>
            <div>
              <dt>{{ copy.source }}</dt>
              <dd>{{ t(activePhase.source) }}</dd>
            </div>
            <div>
              <dt>{{ copy.version }}</dt>
              <dd>{{ activePhase.version }}</dd>
            </div>
            <div>
              <dt>{{ copy.owner }}</dt>
              <dd>{{ t(activePhase.owner) }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </div>

    <footer class="knowledge-demo__footer">
      <div><span>{{ copy.trace }}</span><strong>{{ copy.traceValue }}</strong></div>
      <div><span>{{ copy.boundary }}</span><strong>{{ copy.boundaryValue }}</strong></div>
      <div><span>{{ copy.status }}</span><strong>{{ t(activePhase.status) }}</strong></div>
    </footer>
  </section>
</template>

<style scoped>
.knowledge-demo {
  --knowledge-violet: #b397ff;
  --knowledge-cyan: #7ce6ff;
  overflow: hidden;
  color: #f0eff8;
  border: 1px solid #40376a;
  border-radius: 20px;
  background: #0e0b19;
  box-shadow: 0 32px 90px rgb(32 18 77 / 24%);
}

.knowledge-demo__header {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(280px, 1.1fr);
  gap: 48px;
  padding: clamp(30px, 5vw, 58px);
  background:
    linear-gradient(110deg, rgb(137 94 255 / 14%), transparent 56%),
    radial-gradient(circle at 80% 5%, rgb(124 230 255 / 12%), transparent 27%);
}

.knowledge-demo__kicker,
.evidence-object > p:first-child,
.assertion-card > p,
.knowledge-demo__footer span {
  margin: 0;
  color: #aca5c8;
  font-family: var(--mono);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.knowledge-demo__kicker span {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 9px;
  border-radius: 50%;
  background: var(--knowledge-cyan);
  box-shadow: 0 0 0 5px rgb(124 230 255 / 11%), 0 0 20px var(--knowledge-cyan);
}

.knowledge-demo__header h2 {
  margin: 12px 0 0;
  color: #fbfaff;
  font-size: clamp(2.4rem, 5vw, 5rem);
  line-height: 0.92;
}

.knowledge-demo__header > p {
  align-self: end;
  max-width: 630px;
  margin: 0;
  color: #bbb6cd;
}

.knowledge-demo__frame {
  display: grid;
  grid-template-columns: minmax(184px, 0.32fr) minmax(0, 1fr);
  width: calc(100% - clamp(24px, 6vw, 76px));
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #40376a;
  border-radius: 12px 12px 0 0;
  background: #141122;
  box-shadow: 0 24px 70px rgb(0 0 0 / 34%);
}

.evidence-rail {
  padding: 11px;
  border-right: 1px solid #40376a;
  background: #100d1b;
}

.evidence-rail button {
  position: relative;
  display: grid;
  grid-template-columns: 26px 1fr;
  width: 100%;
  min-height: 85px;
  padding: 13px 12px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: #8f89a8;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.evidence-rail button::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 24px;
  width: 1px;
  background: #3a3455;
  content: '';
}

.evidence-rail button:first-child::before { top: 50%; }
.evidence-rail button:last-child::before { bottom: 50%; }

.evidence-rail button > span {
  z-index: 1;
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border: 1px solid #4d466b;
  border-radius: 50%;
  color: #aaa4be;
  background: #171327;
  font-family: var(--mono);
  font-size: 0.57rem;
}

.evidence-rail button strong,
.evidence-rail button small {
  grid-column: 2;
}

.evidence-rail button strong {
  align-self: end;
  color: inherit;
  font-family: var(--display);
  font-size: 0.94rem;
}

.evidence-rail button small {
  align-self: start;
  margin-top: 4px;
  color: #716b85;
  font-family: var(--mono);
  font-size: 0.52rem;
}

.evidence-rail button:hover,
.evidence-rail button.active {
  border-color: rgb(179 151 255 / 36%);
  color: #f0edff;
  background: linear-gradient(90deg, rgb(135 96 255 / 18%), rgb(135 96 255 / 3%));
}

.evidence-rail button.active > span {
  border-color: var(--knowledge-cyan);
  color: #0c1521;
  background: var(--knowledge-cyan);
  box-shadow: 0 0 0 5px rgb(124 230 255 / 10%), 0 0 20px rgb(124 230 255 / 38%);
}

.evidence-rail button.active small { color: var(--knowledge-cyan); }

.evidence-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(260px, 0.92fr);
  min-height: 480px;
}

.evidence-object,
.assertion-card {
  padding: clamp(26px, 4vw, 54px);
}

.evidence-object {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #40376a;
  background:
    linear-gradient(180deg, rgb(179 151 255 / 8%), transparent 38%),
    repeating-linear-gradient(0deg, transparent 0 43px, rgb(179 151 255 / 5%) 44px);
}

.evidence-object h3 {
  max-width: 520px;
  margin: 38px 0 19px;
  color: #fbfaff;
  font-size: clamp(1.8rem, 3.7vw, 3.65rem);
  line-height: 0.98;
}

.evidence-object > p:not(:first-child) {
  max-width: 525px;
  margin: 0;
  color: #ada7c0;
  font-size: 0.92rem;
}

.evidence-object__record {
  display: grid;
  gap: 7px;
  margin-top: auto;
  padding-top: 55px;
}

.evidence-object__record span {
  color: #847d99;
  font-family: var(--mono);
  font-size: 0.61rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.evidence-object__record strong {
  max-width: 330px;
  color: var(--knowledge-cyan);
  font-family: var(--mono);
  font-size: 0.76rem;
  font-weight: 500;
}

.assertion-card {
  display: flex;
  flex-direction: column;
  background: #100d1b;
}

.assertion-card blockquote {
  margin: 36px 0 0;
  color: #f5f2ff;
  font-family: var(--display);
  font-size: clamp(1.25rem, 2.1vw, 1.95rem);
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.assertion-card__line {
  display: grid;
  grid-template-columns: 1fr 16px 1fr;
  gap: 7px;
  align-items: center;
  margin: 38px 0 28px;
}

.assertion-card__line span {
  height: 1px;
  background: #4a4265;
}

.assertion-card__line i {
  width: 10px;
  height: 10px;
  border: 2px solid var(--knowledge-cyan);
  border-radius: 50%;
  box-shadow: 0 0 16px rgb(124 230 255 / 65%);
}

.assertion-card dl {
  display: grid;
  gap: 0;
  padding: 0;
  margin: auto 0 0;
  border-top: 1px solid #40376a;
}

.assertion-card dl div {
  display: grid;
  grid-template-columns: minmax(88px, 0.7fr) minmax(0, 1.3fr);
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px solid #302a46;
}

.assertion-card dt {
  color: #777087;
  font-family: var(--mono);
  font-size: 0.59rem;
  text-transform: uppercase;
}

.assertion-card dd {
  margin: 0;
  color: #c8c3d8;
  font-family: var(--mono);
  font-size: 0.62rem;
  line-height: 1.45;
}

.knowledge-demo__footer {
  display: grid;
  grid-template-columns: 1.25fr 0.9fr 0.85fr;
  padding: 30px clamp(24px, 6vw, 76px) 38px;
}

.knowledge-demo__footer div {
  min-width: 0;
  padding-right: 22px;
}

.knowledge-demo__footer div + div {
  padding-left: 22px;
  border-left: 1px solid #40376a;
}

.knowledge-demo__footer strong {
  display: block;
  margin-top: 5px;
  color: #ded9ed;
  font-family: var(--mono);
  font-size: 0.65rem;
  font-weight: 500;
  line-height: 1.45;
}

@media (max-width: 820px) {
  .knowledge-demo__header { grid-template-columns: 1fr; gap: 20px; }
  .knowledge-demo__frame { grid-template-columns: 1fr; }
  .evidence-rail { display: grid; grid-template-columns: repeat(5, minmax(126px, 1fr)); overflow-x: auto; border-right: 0; border-bottom: 1px solid #40376a; }
  .evidence-rail button { min-height: 78px; }
  .evidence-rail button::before { display: none; }
  .evidence-workspace { grid-template-columns: 1fr; }
  .evidence-object { min-height: 380px; border-right: 0; border-bottom: 1px solid #40376a; }
  .assertion-card { min-height: 330px; }
}

@media (max-width: 600px) {
  .knowledge-demo { border-radius: 12px; }
  .knowledge-demo__header { padding: 25px 18px; }
  .knowledge-demo__frame { width: calc(100% - 28px); }
  .evidence-rail { padding: 8px; grid-template-columns: repeat(5, 128px); }
  .evidence-object,
  .assertion-card { padding: 25px 20px; }
  .evidence-object { min-height: 360px; }
  .evidence-object h3 { margin-top: 28px; }
  .assertion-card dl div { grid-template-columns: 84px 1fr; }
  .knowledge-demo__footer { grid-template-columns: 1fr; gap: 14px; }
  .knowledge-demo__footer div { padding: 0; }
  .knowledge-demo__footer div + div { padding: 14px 0 0; border-top: 1px solid #40376a; border-left: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .evidence-rail button.active > span { box-shadow: 0 0 0 4px rgb(124 230 255 / 10%); }
}
</style>

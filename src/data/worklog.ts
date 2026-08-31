import type { LocalizedText } from './portfolio'

export type WorklogProject = {
  name: string
  commits: number
}

export type WorklogWeek = {
  id: string
  isoWeek: string
  start: string
  end: string
  range: LocalizedText
  commits: number
  projects: WorklogProject[]
  status: 'active' | 'quiet' | 'onboarding'
  title: LocalizedText
  summary: LocalizedText
  highlights: LocalizedText[]
}

export const worklogWeeks: WorklogWeek[] = [
  {
    id: '2026-w12',
    isoWeek: 'W12',
    start: '2026-03-16',
    end: '2026-03-22',
    range: { en: 'Mar 16–22', zh: '3 月 16–22 日' },
    commits: 0,
    projects: [],
    status: 'onboarding',
    title: {
      en: 'The evidence trail begins.',
      zh: '证据轨迹从这里开始。',
    },
    summary: {
      en: 'The company GitLab account was created on March 16. No attributable remote commit appears in the reachable repository history for this first week.',
      zh: '公司 GitLab 账号于 3 月 16 日创建。首周可达的远端仓库历史中，没有可归属到我的提交。',
    },
    highlights: [
      {
        en: 'Kept as an explicit zero instead of inventing work that Git cannot verify.',
        zh: '明确保留为零，不用 Git 无法验证的内容填补空白。',
      },
    ],
  },
  {
    id: '2026-w13',
    isoWeek: 'W13',
    start: '2026-03-23',
    end: '2026-03-29',
    range: { en: 'Mar 23–29', zh: '3 月 23–29 日' },
    commits: 5,
    projects: [{ name: 'ai-talkit-client', commits: 5 }],
    status: 'active',
    title: {
      en: 'Built the first voice-agent mobile loop.',
      zh: '搭起语音 Agent 移动端的第一个闭环。',
    },
    summary: {
      en: 'Started the agentic mobile client and connected streaming responses, speech-to-text, text-to-speech, mock modes, and the first production-shaped chat surface.',
      zh: '启动 Agent 移动端，串起流式回复、语音识别、语音合成、Mock 模式与首个接近生产形态的聊天界面。',
    },
    highlights: [
      { en: 'Integrated streaming text with STT and TTS.', zh: '接入流式文本、STT 与 TTS。' },
      { en: 'Expanded the mock engine across product modes.', zh: '扩展 Mock 引擎，覆盖不同产品模式。' },
      { en: 'Polished the chat UI and test authentication path.', zh: '完善聊天 UI 与测试认证路径。' },
    ],
  },
  {
    id: '2026-w14',
    isoWeek: 'W14',
    start: '2026-03-30',
    end: '2026-04-05',
    range: { en: 'Mar 30–Apr 5', zh: '3 月 30 日–4 月 5 日' },
    commits: 24,
    projects: [{ name: 'ai-talkit-client', commits: 24 }],
    status: 'active',
    title: {
      en: 'Turned a prototype into a testable release client.',
      zh: '把原型推进成可测试的发布客户端。',
    },
    summary: {
      en: 'Hardened the iOS delivery path while making environments, responsive layouts, feedback, and interaction details controllable by the team.',
      zh: '加固 iOS 交付链路，同时让环境切换、响应式布局、反馈系统与交互细节都变得可控。',
    },
    highlights: [
      { en: 'Added QA/UAT runtime environment switching.', zh: '加入 QA/UAT 运行环境切换。' },
      { en: 'Restored TestFlight permissions and release authentication.', zh: '恢复 TestFlight 权限与发布认证配置。' },
      { en: 'Adapted core screens for tablets, haptics, and sound feedback.', zh: '适配平板布局、触觉与声音反馈。' },
    ],
  },
  {
    id: '2026-w15',
    isoWeek: 'W15',
    start: '2026-04-06',
    end: '2026-04-12',
    range: { en: 'Apr 6–12', zh: '4 月 6–12 日' },
    commits: 30,
    projects: [
      { name: 'ai-talkit-client', commits: 20 },
      { name: 'ai-agent-os', commits: 10 },
    ],
    status: 'active',
    title: {
      en: 'Stabilized state across the agent and its client.',
      zh: '打通 Agent 与客户端之间的状态可靠性。',
    },
    summary: {
      en: 'Worked across runtime and UI boundaries so resumed sessions, podcasts, quizzes, drills, and roleplay kept the right state and actions.',
      zh: '横跨运行时与 UI 边界，修复会话恢复、播客、测验、练习与角色扮演中的状态和动作一致性。',
    },
    highlights: [
      { en: 'Recovered pending cards and completion state on resume.', zh: '恢复会话时保留待处理卡片与完成状态。' },
      { en: 'Repaired structured roleplay, podcast, and review flows.', zh: '修复结构化角色扮演、播客与复习流程。' },
      { en: 'Reduced chat bubble and voice-input render cost.', zh: '降低聊天气泡与语音输入的渲染开销。' },
    ],
  },
  {
    id: '2026-w16',
    isoWeek: 'W16',
    start: '2026-04-13',
    end: '2026-04-19',
    range: { en: 'Apr 13–19', zh: '4 月 13–19 日' },
    commits: 0,
    projects: [],
    status: 'quiet',
    title: { en: 'No attributable remote commits.', zh: '没有可归属的远端提交。' },
    summary: {
      en: 'No matching commit is reachable from the audited GitLab refs for this week. This is an evidence gap, not a claim that no work happened.',
      zh: '本周审计到的 GitLab refs 中没有匹配提交。这表示证据空档，不代表没有发生工作。',
    },
    highlights: [{ en: 'No activity inferred beyond the repository record.', zh: '不对仓库记录之外的活动作推断。' }],
  },
  {
    id: '2026-w17',
    isoWeek: 'W17',
    start: '2026-04-20',
    end: '2026-04-26',
    range: { en: 'Apr 20–26', zh: '4 月 20–26 日' },
    commits: 0,
    projects: [],
    status: 'quiet',
    title: { en: 'No attributable remote commits.', zh: '没有可归属的远端提交。' },
    summary: {
      en: 'The reachable remote history contains no commit under either audited author identity for this week.',
      zh: '本周可达的远端历史中，两个审计身份下都没有提交。',
    },
    highlights: [{ en: 'The zero remains visible for an honest weekly record.', zh: '保留这个零，让周度记录保持诚实。' }],
  },
  {
    id: '2026-w18',
    isoWeek: 'W18',
    start: '2026-04-27',
    end: '2026-05-03',
    range: { en: 'Apr 27–May 3', zh: '4 月 27 日–5 月 3 日' },
    commits: 0,
    projects: [],
    status: 'quiet',
    title: { en: 'No attributable remote commits.', zh: '没有可归属的远端提交。' },
    summary: {
      en: 'No matching commit is present in current branches, tags, or available merge-request refs.',
      zh: '当前分支、标签与可用 Merge Request refs 中没有匹配提交。',
    },
    highlights: [{ en: 'Unverified activity is deliberately left undescribed.', zh: '未经验证的活动被有意留白。' }],
  },
  {
    id: '2026-w19',
    isoWeek: 'W19',
    start: '2026-05-04',
    end: '2026-05-10',
    range: { en: 'May 4–10', zh: '5 月 4–10 日' },
    commits: 0,
    projects: [],
    status: 'quiet',
    title: { en: 'No attributable remote commits.', zh: '没有可归属的远端提交。' },
    summary: {
      en: 'The Git record stays quiet for one final week before the HiPilot contribution trail begins.',
      zh: '在 HiPilot 的贡献轨迹开始前，Git 记录最后安静了一周。',
    },
    highlights: [{ en: 'No work narrative added without commit evidence.', zh: '没有提交证据，就不添加工作叙事。' }],
  },
  {
    id: '2026-w20',
    isoWeek: 'W20',
    start: '2026-05-11',
    end: '2026-05-17',
    range: { en: 'May 11–17', zh: '5 月 11–17 日' },
    commits: 14,
    projects: [{ name: 'hipilot-backend', commits: 14 }],
    status: 'active',
    title: {
      en: 'Made organization intelligence operational.',
      zh: '让组织情报能力进入可运行状态。',
    },
    summary: {
      en: 'Wired organization-intelligence skills into the agent, then made recurring reports, polling, follow-ups, and sensitive-source handling deterministic.',
      zh: '把组织情报技能接入 Agent，并让周期报告、轮询、追问与敏感来源处理变得确定且可控。',
    },
    highlights: [
      { en: 'Connected organization-intelligence skills and recurring reports.', zh: '接入组织情报技能与周期报告。' },
      { en: 'Made ETA polling and report routing deterministic.', zh: '让 ETA 轮询与报告路由具备确定性。' },
      { en: 'Redacted sensitive sourcing detail from generated reports.', zh: '从生成报告中移除敏感来源细节。' },
    ],
  },
  {
    id: '2026-w21',
    isoWeek: 'W21',
    start: '2026-05-18',
    end: '2026-05-24',
    range: { en: 'May 18–24', zh: '5 月 18–24 日' },
    commits: 16,
    projects: [
      { name: 'hipilot-backend', commits: 14 },
      { name: 'hipilot-mobile', commits: 2 },
    ],
    status: 'active',
    title: {
      en: 'Connected recruiting data to a safer agent runtime.',
      zh: '把招聘数据接入更可靠的 Agent 运行时。',
    },
    summary: {
      en: 'Added candidate synchronization and user-scoped talent context while removing runtime tool noise and respecting disabled-skill boundaries.',
      zh: '接入候选人同步与用户级人才库上下文，同时消除运行时工具噪声，并守住禁用技能边界。',
    },
    highlights: [
      { en: 'Integrated Moka and Feishu recruiting candidate sync.', zh: '接入 Moka 与飞书招聘候选人同步。' },
      { en: 'Added user-scoped talent context and outreach reminders.', zh: '加入用户级人才上下文与外联提醒。' },
      { en: 'Hid internal tool-probing failures from the mobile transcript.', zh: '在移动端对话中隐藏内部工具探测失败。' },
    ],
  },
  {
    id: '2026-w22',
    isoWeek: 'W22',
    start: '2026-05-25',
    end: '2026-05-31',
    range: { en: 'May 25–31', zh: '5 月 25–31 日' },
    commits: 18,
    projects: [
      { name: 'hipilot-backend', commits: 14 },
      { name: 'hipilot-mobile', commits: 4 },
    ],
    status: 'active',
    title: {
      en: 'Productized the recruiting specialist.',
      zh: '把招聘专家能力产品化。',
    },
    summary: {
      en: 'Moved recruiting from isolated tools into an observable workflow spanning onboarding, résumé intake, scheduled talent operations, hiring decisions, and offer follow-up.',
      zh: '把招聘从零散工具推进成贯穿引导、简历入库、人才运营、录用决策与 Offer 跟进的可观察流程。',
    },
    highlights: [
      { en: 'Added scheduled talent-operation reports.', zh: '加入定时人才运营报告。' },
      { en: 'Connected hiring-decision and offer-follow-up skills.', zh: '接入录用决策与 Offer 跟进技能。' },
      { en: 'Exposed the recruiting specialist as an onboarding preset.', zh: '把招聘专家作为引导阶段的预设入口。' },
    ],
  },
  {
    id: '2026-w23',
    isoWeek: 'W23',
    start: '2026-06-01',
    end: '2026-06-07',
    range: { en: 'Jun 1–7', zh: '6 月 1–7 日' },
    commits: 1,
    projects: [{ name: 'hipilot-backend', commits: 1 }],
    status: 'active',
    title: {
      en: 'Added expert sourcing to the recruiting path.',
      zh: '把专家猎寻接入招聘路径。',
    },
    summary: {
      en: 'A focused backend change connected the expert-sourcing skill to the recruiting specialist.',
      zh: '一次聚焦的后端改动，将专家猎寻技能接入招聘专家。',
    },
    highlights: [{ en: 'One narrow commit, one complete capability bridge.', zh: '一个聚焦提交，完成一条能力桥接。' }],
  },
  {
    id: '2026-w24',
    isoWeek: 'W24',
    start: '2026-06-08',
    end: '2026-06-14',
    range: { en: 'Jun 8–14', zh: '6 月 8–14 日' },
    commits: 0,
    projects: [],
    status: 'quiet',
    title: { en: 'No attributable remote commits.', zh: '没有可归属的远端提交。' },
    summary: {
      en: 'No matching commit appears in the audited remote refs for this week.',
      zh: '本周审计到的远端 refs 中没有匹配提交。',
    },
    highlights: [{ en: 'A visible pause before the next delivery run.', zh: '下一轮密集交付前的一次可见停顿。' }],
  },
  {
    id: '2026-w25',
    isoWeek: 'W25',
    start: '2026-06-15',
    end: '2026-06-21',
    range: { en: 'Jun 15–21', zh: '6 月 15–21 日' },
    commits: 35,
    projects: [
      { name: 'hipilot-backend', commits: 29 },
      { name: 'hipilot-mobile', commits: 6 },
    ],
    status: 'active',
    title: {
      en: 'Hardened connectors, exports, and scheduled work.',
      zh: '加固连接器、文档导出与定时任务。',
    },
    summary: {
      en: 'Worked through the failure edges of Slack and Feishu connectors, long-document export, visual input, prompt governance, and timezone-aware schedules.',
      zh: '集中处理 Slack 与飞书连接器、长文档导出、视觉输入、Prompt 治理与时区定时任务的失败边界。',
    },
    highlights: [
      { en: 'Connected Slack messaging across backend and mobile.', zh: '在后端与移动端接入 Slack 消息通道。' },
      { en: 'Iterated browser-rendered HTML/PDF export for long documents.', zh: '迭代基于浏览器渲染的长文档 HTML/PDF 导出。' },
      { en: 'Unified schedule parsing and preserved explicit time zones.', zh: '收口定时解析并保留显式时区。' },
    ],
  },
  {
    id: '2026-w26',
    isoWeek: 'W26',
    start: '2026-06-22',
    end: '2026-06-28',
    range: { en: 'Jun 22–28', zh: '6 月 22–28 日' },
    commits: 45,
    projects: [
      { name: 'hipilot-backend', commits: 25 },
      { name: 'hipilot-mobile', commits: 11 },
      { name: 'hipilot-product', commits: 5 },
      { name: 'hipilot-workspace', commits: 4 },
    ],
    status: 'active',
    title: {
      en: 'Designed skill learning as a governed system.',
      zh: '把 Skill 学习设计成受治理的系统。',
    },
    summary: {
      en: 'Defined one cross-repository path for skill candidates: observe in shadow mode, aggregate evidence, apply risk gates, and ask for confirmation in the product.',
      zh: '跨仓库定义 Skill 候选的统一路径：影子观察、证据聚合、风险守门，再由产品端请求确认。',
    },
    highlights: [
      { en: 'Added shadow-mode candidate aggregation and calibration.', zh: '加入影子模式候选聚合与观测校准。' },
      { en: 'Documented risk tiers and a single source of truth.', zh: '明确风险分层与单一事实源。' },
      { en: 'Connected draft-confirmation states through backend and mobile.', zh: '打通后端与移动端的草稿确认状态。' },
    ],
  },
  {
    id: '2026-w27',
    isoWeek: 'W27',
    start: '2026-06-29',
    end: '2026-07-05',
    range: { en: 'Jun 29–Jul 5', zh: '6 月 29 日–7 月 5 日' },
    commits: 67,
    projects: [
      { name: 'hipilot-backend', commits: 31 },
      { name: 'hipilot-workspace', commits: 15 },
      { name: 'hipilot-admin', commits: 11 },
      { name: 'hipilot-product', commits: 10 },
    ],
    status: 'active',
    title: {
      en: 'Made rule changes reviewable before release.',
      zh: '让规则变更在发布前可审核。',
    },
    summary: {
      en: 'Built the rule-shadow review path across runtime, product specification, evidence tooling, and the admin surface instead of treating comparison as a backend-only concern.',
      zh: '把 Rule Shadow 审核链路铺到运行时、产品规范、证据工具与管理后台，而不是只做后端比对。',
    },
    highlights: [
      { en: 'Compared stable router signals in shadow mode.', zh: '在影子模式中比较 Router 稳定字段。' },
      { en: 'Generated atomic review packs with safety guardrails.', zh: '生成带安全护栏的原子审查包。' },
      { en: 'Added candidate review, scoring, and CI policy controls.', zh: '加入候选审核、评分与 CI 策略控制。' },
    ],
  },
  {
    id: '2026-w28',
    isoWeek: 'W28',
    start: '2026-07-06',
    end: '2026-07-12',
    range: { en: 'Jul 6–12', zh: '7 月 6–12 日' },
    commits: 112,
    projects: [
      { name: 'hipilot-workspace', commits: 66 },
      { name: 'hipilot-backend', commits: 23 },
      { name: 'hipilot-desktop', commits: 19 },
      { name: 'hipilot-admin', commits: 3 },
      { name: 'hipilot-product', commits: 1 },
    ],
    status: 'active',
    title: {
      en: 'Built the multi-repository regression operating layer.',
      zh: '搭起多仓回归的运行与验收层。',
    },
    summary: {
      en: 'Expanded regression from test cases into an operating system for branch selection, preflight, timeouts, progress, cleanup, semantic scoring, and review evidence.',
      zh: '把回归从用例集合扩展成覆盖分支选择、预检、超时、进度、清理、语义判分与审查证据的运行系统。',
    },
    highlights: [
      { en: 'Added multi-repository candidate resolution and preflight.', zh: '加入多仓候选分支解析与预检。' },
      { en: 'Made suite progress, timeouts, cleanup, and evidence explicit.', zh: '让套件进度、超时、清理与证据显式可见。' },
      { en: 'Hardened desktop workbench packaging and browser preview boundaries.', zh: '加固桌面工作台打包与浏览器预览边界。' },
    ],
  },
  {
    id: '2026-w29',
    isoWeek: 'W29',
    start: '2026-07-13',
    end: '2026-07-19',
    range: { en: 'Jul 13–19', zh: '7 月 13–19 日' },
    commits: 110,
    projects: [
      { name: 'hipilot-workspace', commits: 78 },
      { name: 'hipilot-backend', commits: 19 },
      { name: 'hipilot-desktop', commits: 9 },
      { name: 'hipilot-admin', commits: 3 },
      { name: 'hipilot-product', commits: 1 },
    ],
    status: 'active',
    title: {
      en: 'Expanded regression coverage while shaping the desktop product.',
      zh: '扩展回归覆盖，同时把桌面产品打磨成形。',
    },
    summary: {
      en: 'Added domain-specific regression suites and automatic repair evidence while shipping desktop permissions, checkpoints, settings, bilingual UI, and safer link previews.',
      zh: '加入领域回归套件与自动修复证据，同时交付桌面权限、检查点、设置、中英文界面与更安全的链接预览。',
    },
    highlights: [
      { en: 'Added commerce and runtime regression suites.', zh: '接入电商与运行时回归套件。' },
      { en: 'Built desktop permission modes, checkpoints, settings, and i18n.', zh: '构建桌面权限模式、检查点、设置与国际化。' },
      { en: 'Introduced lint baselines and tenant-aware capability boundaries.', zh: '加入 Lint 基线与租户级能力边界。' },
    ],
  },
  {
    id: '2026-w30',
    isoWeek: 'W30',
    start: '2026-07-20',
    end: '2026-07-26',
    range: { en: 'Jul 20–26', zh: '7 月 20–26 日' },
    commits: 49,
    projects: [
      { name: 'hipilot-fashion-radar', commits: 34 },
      { name: 'hipilot-backend', commits: 10 },
      { name: 'hipilot-workspace', commits: 3 },
      { name: 'hipilot-admin', commits: 1 },
      { name: 'hipilot-product', commits: 1 },
    ],
    status: 'active',
    title: {
      en: 'Closed the loop on fashion intelligence and regression contracts.',
      zh: '闭环时尚情报评测与回归契约。',
    },
    summary: {
      en: 'Built a source-to-review fashion trend loop with quality gates and visual evaluation, while tightening behavior taxonomy and configuration validation in the agent regression platform.',
      zh: '构建从数据源到审核的时尚趋势闭环，加入质量门槛与视觉评测，同时收紧 Agent 回归平台的行为分类与配置校验。',
    },
    highlights: [
      { en: 'Added source quality, rights, and seven-day increment gates.', zh: '加入来源质量、权利与七日增量门槛。' },
      { en: 'Completed blind review and a 200-image visual evaluation loop.', zh: '完成盲审与 200 张图片的视觉评测闭环。' },
      { en: 'Unified behavior taxonomy and emitted actionable config errors.', zh: '统一行为分类，并输出可行动的配置错误。' },
    ],
  },
  {
    id: '2026-w31',
    isoWeek: 'W31',
    start: '2026-07-27',
    end: '2026-08-02',
    range: { en: 'Jul 27–Aug 2', zh: '7 月 27 日–8 月 2 日' },
    commits: 176,
    projects: [
      { name: 'Knowledge delivery', commits: 107 },
      { name: 'Enterprise foundation', commits: 53 },
      { name: 'Agent runtime', commits: 16 },
    ],
    status: 'active',
    title: {
      en: 'Turned enterprise delivery into a traceable system boundary.',
      zh: '把企业交付收敛成可追溯的系统边界。',
    },
    summary: {
      en: 'Worked across knowledge delivery, foundational contracts, and the agent runtime to preserve source lineage, recoverable transitions, and explicit acceptance instead of treating delivery as a final document export.',
      zh: '横跨知识交付、基础契约与 Agent 运行时，保留来源链路、可恢复状态转换和显式验收，而不把交付视为一次最终文档导出。',
    },
    highlights: [
      { en: 'Defined source, version, and review boundaries for enterprise knowledge objects.', zh: '为企业知识对象定义来源、版本与审核边界。' },
      { en: 'Established recoverable delivery transitions instead of one-way publishing steps.', zh: '建立可恢复的交付状态转换，而不是单向发布步骤。' },
      { en: 'Kept runtime work aligned with the same traceability contracts.', zh: '让运行时工作与同一套可追溯契约对齐。' },
    ],
  },
  {
    id: '2026-w32',
    isoWeek: 'W32',
    start: '2026-08-03',
    end: '2026-08-09',
    range: { en: 'Aug 3–9', zh: '8 月 3–9 日' },
    commits: 153,
    projects: [
      { name: 'Knowledge delivery', commits: 128 },
      { name: 'Controlled delivery', commits: 20 },
      { name: 'Agent runtime', commits: 5 },
    ],
    status: 'active',
    title: {
      en: 'Made evidence binding a delivery primitive.',
      zh: '把证据绑定做成交付的基础能力。',
    },
    summary: {
      en: 'Extended the knowledge-delivery path from captured material to reviewable assertions, explicit exception states, and controlled handoff packages for production-shaped use.',
      zh: '将知识交付从资料接入扩展到可审核结论、明确例外状态和面向生产形态的受控交接包。',
    },
    highlights: [
      { en: 'Bound decision-relevant assertions back to their source and version.', zh: '将与决策相关的结论绑定回对应来源与版本。' },
      { en: 'Separated draft, clarification, acceptance, and delivery-ready states.', zh: '区分草稿、待澄清、已验收与可交付状态。' },
      { en: 'Hardened controlled-delivery boundaries alongside the agent runtime.', zh: '在推进 Agent 运行时的同时加固受控交付边界。' },
    ],
  },
  {
    id: '2026-w33',
    isoWeek: 'W33',
    start: '2026-08-10',
    end: '2026-08-16',
    range: { en: 'Aug 10–16', zh: '8 月 10–16 日' },
    commits: 265,
    projects: [
      { name: 'Knowledge delivery', commits: 124 },
      { name: 'Creative delivery', commits: 53 },
      { name: 'Desktop workbench', commits: 43 },
      { name: 'Controlled delivery', commits: 41 },
      { name: 'Agent runtime', commits: 4 },
    ],
    status: 'active',
    title: {
      en: 'Hardened desktop workbench and controlled delivery in parallel.',
      zh: '并行加固桌面工作台与受控交付。',
    },
    summary: {
      en: 'Integrated upstream workbench capabilities into the desktop product while advancing controlled knowledge and creative-delivery paths, keeping image input, project settings, collaboration actions, and review states explicit.',
      zh: '将上游工作台能力接入桌面产品，同时推进受控知识与创意交付链路，并让图片输入、项目设置、协作操作和审核状态保持显式。',
    },
    highlights: [
      { en: 'Synced upstream workbench behavior through desktop-specific product boundaries.', zh: '通过桌面产品边界同步上游工作台行为。' },
      { en: 'Added capability-aware paths for image input and visible agent lifecycle work.', zh: '为图片输入和可见的 Agent 生命周期工作加入能力感知路径。' },
      { en: 'Kept controlled delivery and creative tools attached to reviewable evidence.', zh: '让受控交付与创意工具始终附着于可审核证据。' },
    ],
  },
  {
    id: '2026-w34',
    isoWeek: 'W34',
    start: '2026-08-17',
    end: '2026-08-23',
    range: { en: 'Aug 17–23', zh: '8 月 17–23 日' },
    commits: 79,
    projects: [
      { name: 'Creative delivery', commits: 38 },
      { name: 'Knowledge delivery', commits: 25 },
      { name: 'Controlled delivery', commits: 16 },
    ],
    status: 'active',
    title: {
      en: 'Prepared an inspectable acceptance loop.',
      zh: '准备一条可检查的验收闭环。',
    },
    summary: {
      en: 'Focused on the last mile: making delivery materials, exceptions, and human acceptance visible enough to hand off in constrained operational environments.',
      zh: '聚焦最后一公里：让交付材料、例外与人工验收足够可见，从而能在受限的运行环境中完成交接。',
    },
    highlights: [
      { en: 'Strengthened human review and exception handling around knowledge delivery.', zh: '强化知识交付中的人工审核与例外处理。' },
      { en: 'Packaged controlled handoffs around explicit readiness states.', zh: '围绕明确的就绪状态打包受控交接。' },
      { en: 'Continued creative-delivery work without breaking the audit trail.', zh: '持续推进创意交付，同时不破坏审计轨迹。' },
    ],
  },
  {
    id: '2026-w35',
    isoWeek: 'W35',
    start: '2026-08-24',
    end: '2026-08-30',
    range: { en: 'Aug 24–30', zh: '8 月 24–30 日' },
    commits: 10,
    projects: [
      { name: 'Knowledge delivery', commits: 9 },
      { name: 'Creative delivery', commits: 1 },
    ],
    status: 'active',
    title: {
      en: 'Closed delivery details without inflating the record.',
      zh: '收束交付细节，不夸大记录。',
    },
    summary: {
      en: 'A deliberately compact week of delivery follow-through: continued versioned knowledge work and one small creative-delivery improvement, retained as the Git record shows it.',
      zh: '这是一个刻意保持简洁的交付跟进周：持续推进版本化知识工作，并完成一项小型创意交付改进，按 Git 记录如实保留。',
    },
    highlights: [
      { en: 'Continued delivery follow-through in the versioned knowledge path.', zh: '持续跟进版本化知识链路中的交付工作。' },
      { en: 'Kept a small, attributable creative-delivery change visible instead of filling the week with inference.', zh: '保留一项可归属的创意交付变更，而不以推断填补本周。' },
    ],
  },
  {
    id: '2026-w36',
    isoWeek: 'W36',
    start: '2026-08-31',
    end: '2026-08-31',
    range: { en: 'Aug 31 · partial week', zh: '8 月 31 日 · 周内进行中' },
    commits: 6,
    projects: [
      { name: 'Desktop workbench', commits: 3 },
      { name: 'Creative delivery', commits: 3 },
    ],
    status: 'active',
    title: {
      en: 'Started the next week without pretending it is finished.',
      zh: '启动下一周，但不假装它已经结束。',
    },
    summary: {
      en: 'This partial entry includes only August 31. It records the first desktop-workbench and creative-delivery changes, then waits for the week to close before claiming a fuller story.',
      zh: '这条周记只包含 8 月 31 日。它记录桌面工作台和创意交付的首批变更，并在本周结束前避免讲述更完整的故事。',
    },
    highlights: [
      { en: 'Recorded the first visible desktop-workbench changes of the new week.', zh: '记录新一周最早可见的桌面工作台变更。' },
      { en: 'Kept the snapshot partial by design rather than projecting future work.', zh: '刻意将快照保持为部分周记录，而不推演未来工作。' },
    ],
  },
]

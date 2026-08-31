export type Language = 'en' | 'zh'

export type LocalizedText = {
  en: string
  zh: string
}

export type Evidence = {
  value: string
  label: LocalizedText
  detail: LocalizedText
}

export type ArchitectureStep = {
  key: string
  label: LocalizedText
  detail: LocalizedText
}

export type Decision = {
  title: LocalizedText
  body: LocalizedText
}

export type CaseStudy = {
  slug: string
  period: string
  accent: 'blue' | 'teal' | 'amber' | 'violet'
  featured?: boolean
  kind: LocalizedText
  title: LocalizedText
  thesis: LocalizedText
  summary: LocalizedText
  challenge: LocalizedText
  constraints: LocalizedText[]
  architecture: ArchitectureStep[]
  decisions: Decision[]
  evidence: Evidence[]
  outcomes: LocalizedText[]
  stack: string[]
  image?: string
  sourceUrl?: string
}

export type Project = {
  title: string
  period: string
  featured?: boolean
  context: LocalizedText
  summary: LocalizedText
  role: LocalizedText
  image: string
  stack: string[]
  sourceUrl?: string
  liveUrl?: string
}

export type UpstreamContribution = {
  project: string
  merged: number
  focus: LocalizedText
  detail: LocalizedText
  sourceUrl: string
}

export const localize = (text: LocalizedText, language: Language) => text[language]

export const caseStudies: CaseStudy[] = [
  {
    slug: 'agent-failure-regression',
    period: '2026',
    accent: 'blue',
    featured: true,
    kind: {
      en: 'Sanitized production case',
      zh: '脱敏生产案例',
    },
    title: {
      en: 'Agent Failure Regression Platform',
      zh: 'Agent 失败自动回归平台',
    },
    thesis: {
      en: 'Turn noisy runtime failures into reviewable, replayable evidence.',
      zh: '把嘈杂的线上失败信号，转化为可审核、可回放的工程证据。',
    },
    summary: {
      en: 'A reliability layer that captures negative feedback, empty answers, and tool failures, then normalizes them into regression cases with stable comparisons, cost isolation, and review bundles.',
      zh: '一套可靠性基础设施：捕获点踩、空答和工具失败，将其标准化为回归用例，并提供稳定字段比对、模型成本隔离和原子审查包。',
    },
    challenge: {
      en: 'Production agent failures are heterogeneous. A useful platform must preserve the context needed for replay without copying sensitive output or turning every transient error into permanent test debt.',
      zh: '生产环境中的 Agent 失败形态并不统一。平台既要保留足够上下文支持回放，又不能复制敏感输出，更不能把每个瞬时错误都固化成永久测试债务。',
    },
    constraints: [
      {
        en: 'Six repositories with different runtime events and ownership boundaries.',
        zh: '6 个仓库具有不同的运行事件格式与责任边界。',
      },
      {
        en: 'Semantic output cannot be judged through brittle full-string equality.',
        zh: '语义输出不能依赖脆弱的整段字符串相等判断。',
      },
      {
        en: 'Replay cost, sensitive data, and human review load must remain bounded.',
        zh: '回放成本、敏感数据暴露与人工审核负担必须可控。',
      },
    ],
    architecture: [
      {
        key: 'capture',
        label: { en: 'Capture', zh: '捕获' },
        detail: { en: 'Feedback, empty answer, tool failure', zh: '点踩、空答、工具失败' },
      },
      {
        key: 'normalize',
        label: { en: 'Normalize', zh: '标准化' },
        detail: { en: 'Stable fields and redacted context', zh: '稳定字段与脱敏上下文' },
      },
      {
        key: 'register',
        label: { en: 'Register', zh: '注册' },
        detail: { en: 'Domain, suite, owner, expected signal', zh: '领域、套件、责任人与预期信号' },
      },
      {
        key: 'replay',
        label: { en: 'Replay', zh: '回放' },
        detail: { en: 'Runtime trace with model-cost isolation', zh: '真实运行轨迹与模型成本隔离' },
      },
      {
        key: 'review',
        label: { en: 'Review', zh: '审核' },
        detail: { en: 'Atomic bundle and release decision', zh: '原子审查包与发布决策' },
      },
    ],
    decisions: [
      {
        title: { en: 'Compare stable signals', zh: '只比较稳定信号' },
        body: {
          en: 'The platform separates stable fields from generated prose so wording changes do not create false regressions.',
          zh: '平台将稳定字段与生成文本拆开，避免措辞变化制造伪回归。',
        },
      },
      {
        title: { en: 'Make review atomic', zh: '让审核具备原子性' },
        body: {
          en: 'Each case carries the minimum trace, expected behavior, ownership, and sensitive-output scan needed for one decision.',
          zh: '每个用例只携带一次决策所需的最小轨迹、预期行为、责任归属和敏感输出扫描结果。',
        },
      },
      {
        title: { en: 'Keep cost visible', zh: '让成本可见' },
        body: {
          en: 'Model calls are isolated and reported so a more accurate judge cannot silently make every replay expensive.',
          zh: '模型调用被隔离并单独报告，避免更准确的判断器悄然抬高所有回放成本。',
        },
      },
    ],
    evidence: [
      {
        value: '6',
        label: { en: 'repositories', zh: '个仓库' },
        detail: { en: 'one regression registry', zh: '统一进入回归注册表' },
      },
      {
        value: '13',
        label: { en: 'domains', zh: '个领域' },
        detail: { en: 'explicit ownership and semantics', zh: '明确责任归属与语义' },
      },
      {
        value: '29',
        label: { en: 'suites', zh: '个套件' },
        detail: { en: 'reviewable runtime coverage', zh: '可审核的运行时覆盖' },
      },
    ],
    outcomes: [
      {
        en: 'Failures became durable engineering inputs instead of disappearing inside feedback streams.',
        zh: '失败不再消失在反馈流中，而是成为可持续处理的工程输入。',
      },
      {
        en: 'Teams could replay the real path while reviewing only the evidence needed for a release decision.',
        zh: '团队可以回放真实路径，同时只审核发布决策所需的证据。',
      },
      {
        en: 'Registry boundaries made coverage and ownership visible across repositories.',
        zh: '注册表边界让跨仓库的覆盖范围和责任归属清晰可见。',
      },
    ],
    stack: ['Python', 'Runtime traces', 'LLM evaluation', 'Jenkins', 'PII scanning'],
  },
  {
    slug: 'hipilot-desktop',
    period: '2026',
    accent: 'teal',
    kind: {
      en: 'Sanitized product case',
      zh: '脱敏产品案例',
    },
    title: {
      en: 'HiPilot Desktop',
      zh: 'HiPilot Desktop',
    },
    thesis: {
      en: 'Ship an agent workbench without hiding the hard production edges.',
      zh: '交付桌面 Agent 工作台，同时正面处理生产环境里的复杂边界。',
    },
    summary: {
      en: 'A desktop agent product built from Electron, the Codex app server, and an upstream-synced t3code workbench. The release-hardening path covers short-lived model credentials, capability-gated image input, explicit PR/MR handoffs, local project preferences, redacted diagnostics, and macOS verification.',
      zh: '基于 Electron、Codex app server 与同步上游的 t3code 工作台构建的桌面 Agent 产品。发布加固覆盖短期模型令牌、能力门控的图片输入、显式 PR/MR 交接、本地项目偏好、脱敏诊断和 macOS 验收。',
    },
    challenge: {
      en: 'A desktop agent is not only a chat interface. Upstream workbench changes, long-running streams, multimodal input, collaboration actions, billing retries, diagnostics, and signed releases all cross trust boundaries that must fail safely.',
      zh: '桌面 Agent 不只是聊天界面。上游工作台变更、长连接流式传输、多模态输入、协作操作、计费重试、诊断信息和签名发布跨越多个信任边界，任何一处失败都必须可控。',
    },
    constraints: [
      {
        en: 'Model credentials must not become durable desktop secrets.',
        zh: '模型凭证不能变成长期驻留在桌面端的秘密。',
      },
      {
        en: 'SSE sessions and retries must not duplicate billable events.',
        zh: 'SSE 会话与重试不能产生重复计费事件。',
      },
      {
        en: 'Support diagnostics must remain useful after sensitive fields are removed.',
        zh: '支持诊断在移除敏感字段后仍要保留排障价值。',
      },
      {
        en: 'Upstream capabilities must become intentional product integrations rather than uncontrolled surface area.',
        zh: '上游能力必须成为有意设计的产品集成，而不能变成失控的功能面。',
      },
      {
        en: 'Image input and Git collaboration actions need clear capability and confirmation boundaries.',
        zh: '图片输入与 Git 协作操作需要明确的能力与确认边界。',
      },
    ],
    architecture: [
      {
        key: 'workbench',
        label: { en: 'Workbench', zh: '工作台' },
        detail: { en: 'Electron shell, upstream sync, local appearance', zh: 'Electron 外壳、上游同步与本地外观' },
      },
      {
        key: 'runtime',
        label: { en: 'Agent runtime', zh: 'Agent 运行时' },
        detail: { en: 'Codex lifecycle and visible agent work', zh: 'Codex 生命周期与可见的 Agent 工作' },
      },
      {
        key: 'proxy',
        label: { en: 'Model proxy', zh: '模型代理' },
        detail: { en: 'Short-lived tokens, SSE, image capability gates', zh: '短期令牌、SSE 与图片能力门禁' },
      },
      {
        key: 'collaboration',
        label: { en: 'Collaboration', zh: '协作' },
        detail: { en: 'Explicit PR/MR handoffs and project settings', zh: '显式 PR/MR 交接与项目设置' },
      },
      {
        key: 'release',
        label: { en: 'Release gate', zh: '发布门禁' },
        detail: { en: 'Signing, diagnostics, verification', zh: '签名、诊断与验收' },
      },
    ],
    decisions: [
      {
        title: { en: 'Short-lived authority', zh: '短期授权' },
        body: {
          en: 'The desktop requests narrow, expiring model authority rather than storing a reusable provider credential.',
          zh: '桌面端只请求范围受限且会过期的模型授权，而不保存可重复使用的供应商凭证。',
        },
      },
      {
        title: { en: 'Idempotency before billing', zh: '计费之前先保证幂等' },
        body: {
          en: 'Usage events receive stable identities so reconnects and retries cannot silently charge twice.',
          zh: '用量事件拥有稳定身份，重连和重试不能悄然产生二次计费。',
        },
      },
      {
        title: { en: 'Redaction is part of observability', zh: '脱敏属于可观测性' },
        body: {
          en: 'Diagnostics are designed around useful safe fields instead of collecting everything and redacting later.',
          zh: '诊断从一开始就围绕安全且有用的字段设计，而不是先收集全部数据再事后脱敏。',
        },
      },
      {
        title: { en: 'Capability before multimodality', zh: '多模态之前先验证能力' },
        body: {
          en: 'Image input is routed only when the selected model path explicitly supports it, keeping a visual affordance from becoming an ambiguous request path.',
          zh: '仅在所选模型链路明确支持时才路由图片输入，避免视觉入口变成含糊的请求路径。',
        },
      },
      {
        title: { en: 'Show consequential handoffs', zh: '显式展示关键交接' },
        body: {
          en: 'Project settings, agent lifecycle, and GitHub/GitLab collaboration are exposed as visible choices and confirmations rather than background side effects.',
          zh: '项目设置、Agent 生命周期及 GitHub/GitLab 协作以可见的选择和确认呈现，而不是后台副作用。',
        },
      },
    ],
    evidence: [
      {
        value: 'UPSTREAM',
        label: { en: 'controlled integration', zh: '受控集成' },
        detail: { en: 'workbench changes pass through desktop policy', zh: '工作台变更经由桌面产品策略接入' },
      },
      {
        value: 'CAP-GATE',
        label: { en: 'image input boundary', zh: '图片输入边界' },
        detail: { en: 'only supported paths can accept an image', zh: '只有受支持的链路可以接受图片' },
      },
      {
        value: 'EXPLICIT',
        label: { en: 'visible handoffs', zh: '可见交接' },
        detail: { en: 'settings, agent state, and PR/MR actions stay reviewable', zh: '设置、Agent 状态和 PR/MR 操作均可审核' },
      },
    ],
    outcomes: [
      {
        en: 'The workbench joined UI, agent runtime, model access, usage accounting, and release checks into one verifiable product path.',
        zh: '工作台把 UI、Agent 运行时、模型访问、用量核算和发布验收串成一条可验证产品路径。',
      },
      {
        en: 'Operational failures could be diagnosed without exposing raw secrets or conversation payloads.',
        zh: '运维问题可以被诊断，同时不暴露原始密钥或完整对话载荷。',
      },
      {
        en: 'macOS release readiness became an explicit gate rather than a manual afterthought.',
        zh: 'macOS 发布就绪度成为明确门禁，而不是最后阶段的人工补丁。',
      },
      {
        en: 'Recent workbench capabilities became reviewable desktop integrations instead of invisible upstream drift.',
        zh: '近期工作台能力成为可审核的桌面产品集成，而不是不可见的上游漂移。',
      },
    ],
    stack: ['Electron', 'TypeScript', 'Codex app server', 't3code', 'Ghostty', 'GitHub/GitLab', 'macOS release'],
  },
  {
    slug: 'yt-dub-studio',
    period: '2026',
    accent: 'amber',
    kind: {
      en: 'Open-source build',
      zh: '开源项目',
    },
    title: {
      en: 'yt-dub-studio',
      zh: 'yt-dub-studio',
    },
    thesis: {
      en: 'Turn a multi-model dubbing pipeline into one inspectable local workflow.',
      zh: '把多模型配音流水线，收敛为一个可检查的本地工作流。',
    },
    summary: {
      en: 'A local pipeline that turns an English YouTube video into a Chinese dubbed video through download, transcription, translation, source-voice synthesis, mixing, optional lip sync, and quality reporting.',
      zh: '本地视频配音流水线：从英文 YouTube 视频开始，串联下载、转写、翻译、源音色合成、混音、可选唇形同步和质量报告。',
    },
    challenge: {
      en: 'Each model can succeed while the final video still fails. The product needed one visible workflow that preserved intermediate artifacts, exposed stage timing, and reported whether fallbacks changed the result.',
      zh: '每个模型都可能单独成功，但最终视频仍然失败。产品需要一条可见工作流，保留中间产物、展示阶段耗时，并报告 fallback 是否改变最终结果。',
    },
    constraints: [
      {
        en: 'Long local inference must remain observable without a hosted control plane.',
        zh: '长时间本地推理在没有云端控制面的情况下仍需可观测。',
      },
      {
        en: 'Source-voice synthesis, mixing, and lip sync can fail independently.',
        zh: '源音色合成、混音和唇形同步可能各自独立失败。',
      },
      {
        en: 'Users need final media plus subtitles, audio, reports, and intermediate files.',
        zh: '用户不仅需要最终成片，也需要字幕、音频、报告和中间文件。',
      },
    ],
    architecture: [
      {
        key: 'download',
        label: { en: 'Download', zh: '下载' },
        detail: { en: 'Source video and extracted audio', zh: '源视频与提取音频' },
      },
      {
        key: 'asr',
        label: { en: 'Transcribe', zh: '转写' },
        detail: { en: 'Whisper / faster-whisper', zh: 'Whisper / faster-whisper' },
      },
      {
        key: 'translate',
        label: { en: 'Translate', zh: '翻译' },
        detail: { en: 'Timestamp-aware captions', zh: '保留时间戳的字幕' },
      },
      {
        key: 'voice',
        label: { en: 'Synthesize', zh: '源音色' },
        detail: { en: 'CosyVoice source-voice TTS', zh: 'CosyVoice 源音色 TTS' },
      },
      {
        key: 'finish',
        label: { en: 'Finish', zh: '成片' },
        detail: { en: 'Mix, Wav2Lip, quality report', zh: '混音、Wav2Lip 与质量报告' },
      },
    ],
    decisions: [
      {
        title: { en: 'One stage contract', zh: '统一阶段契约' },
        body: {
          en: 'Every stage reports status, timing, output paths, and failure reasons through the same event model.',
          zh: '每个阶段通过同一事件模型报告状态、耗时、产物路径与失败原因。',
        },
      },
      {
        title: { en: 'Keep artifacts inspectable', zh: '保留可检查产物' },
        body: {
          en: 'The workspace keeps audio, captions, stems, dubbed media, and reports so failures can be isolated without rerunning everything.',
          zh: '工作区保留音频、字幕、分轨、配音媒体与报告，定位失败时无需重跑整条链路。',
        },
      },
      {
        title: { en: 'Report fallback truthfully', zh: '如实报告 fallback' },
        body: {
          en: 'The quality report distinguishes real lip sync and source voice from fallback outputs instead of presenting every completion as equivalent.',
          zh: '质量报告区分真实唇形同步、源音色与 fallback 产物，不把所有“完成”包装成相同结果。',
        },
      },
    ],
    evidence: [
      {
        value: '7',
        label: { en: 'pipeline stages', zh: '个流水线阶段' },
        detail: { en: 'one progress and artifact contract', zh: '共用进度与产物契约' },
      },
      {
        value: '0',
        label: { en: 'OpenAI tokens', zh: 'OpenAI token' },
        detail: { en: 'default local ASR, TTS, and lip sync', zh: '默认本地 ASR、TTS 与唇形推理' },
      },
      {
        value: '1',
        label: { en: 'quality report', zh: '份质量报告' },
        detail: { en: 'for every completed run', zh: '每次完成运行均生成' },
      },
    ],
    outcomes: [
      {
        en: 'A single Gradio workspace now exposes the full English-to-Chinese dubbing path.',
        zh: '单一 Gradio 工作台完整呈现英文到中文的配音路径。',
      },
      {
        en: 'Stage events support both live UI progress and JSON-lines automation.',
        zh: '阶段事件同时支持实时 UI 进度与 JSON Lines 自动化。',
      },
      {
        en: 'Quality reports make source voice, lip sync, duration differences, and fallback behavior auditable.',
        zh: '质量报告让源音色、唇形同步、时长差异和 fallback 行为可以被审核。',
      },
    ],
    stack: ['Python', 'Gradio', 'Whisper', 'CosyVoice', 'Demucs', 'Wav2Lip', 'ffmpeg'],
    image: '/images/projects/yt-dub-studio-cover.webp',
    sourceUrl: 'https://github.com/nateEc/yt-dub-studio',
  },
  {
    slug: 'enterprise-knowledge-delivery',
    period: '2026',
    accent: 'violet',
    featured: true,
    kind: {
      en: 'Sanitized production case',
      zh: '脱敏生产案例',
    },
    title: {
      en: 'Enterprise Knowledge Delivery',
      zh: '企业知识交付系统',
    },
    thesis: {
      en: 'Make what the system knows reviewable before it becomes a decision.',
      zh: '在结论成为决策之前，先让系统所知的内容可审核。',
    },
    summary: {
      en: 'A governed delivery workflow that turns incomplete source material and interviews into versioned knowledge objects, evidence-bound assertions, human review states, and client-ready delivery packages. This public case uses synthetic data only.',
      zh: '一套受治理的交付流程：把不完整的资料与访谈转化为版本化知识对象、证据绑定的结论、人工审核状态和面向交付的内容包。公开案例仅使用合成数据。',
    },
    challenge: {
      en: 'Enterprise source material is often partial, contradictory, and sensitive. A useful system cannot jump from ingestion to a polished answer; it must preserve lineage, expose uncertainty, and make readiness a human decision.',
      zh: '企业资料常常不完整、彼此矛盾且敏感。有效的系统不能从导入直接跳到精致结论；它必须保留来源链路、展示不确定性，并把就绪度交给人来确认。',
    },
    constraints: [
      {
        en: 'No internal source, customer identifier, or production output can appear in the public case.',
        zh: '公开案例中不能出现内部资料、客户标识或生产输出。',
      },
      {
        en: 'Every decision-relevant assertion needs a source path, version, and review state.',
        zh: '每条与决策相关的结论都需要来源路径、版本与审核状态。',
      },
      {
        en: 'Delivery must remain usable in controlled and intermittently connected environments.',
        zh: '交付必须能在受控、间歇联网的环境中保持可用。',
      },
    ],
    architecture: [
      {
        key: 'intake',
        label: { en: 'Intake', zh: '接入' },
        detail: { en: 'Source register and access boundary', zh: '来源登记与访问边界' },
      },
      {
        key: 'distill',
        label: { en: 'Distill', zh: '提炼' },
        detail: { en: 'Versioned knowledge objects', zh: '版本化知识对象' },
      },
      {
        key: 'bind',
        label: { en: 'Bind', zh: '绑定' },
        detail: { en: 'Assertion-to-evidence links', zh: '结论到证据的链接' },
      },
      {
        key: 'review',
        label: { en: 'Review', zh: '审核' },
        detail: { en: 'Human acceptance and exception state', zh: '人工验收与例外状态' },
      },
      {
        key: 'deliver',
        label: { en: 'Deliver', zh: '交付' },
        detail: { en: 'Versioned package and readiness record', zh: '版本化内容包与就绪记录' },
      },
    ],
    decisions: [
      {
        title: { en: 'Keep the intermediate state', zh: '保留中间状态' },
        body: {
          en: 'The workflow keeps source registration, distilled objects, exceptions, and review history visible, so delivery never relies on a final answer alone.',
          zh: '流程保留来源登记、提炼对象、例外与审核历史，使交付不只依赖最终答案。',
        },
      },
      {
        title: { en: 'Bind evidence at the assertion', zh: '在结论层绑定证据' },
        body: {
          en: 'A citation is not a footer. Each decision-relevant statement points back to a precise fragment and its current version.',
          zh: '引用不应只是页脚。每条与决策相关的陈述都指向具体片段及其当前版本。',
        },
      },
      {
        title: { en: 'Make delivery readiness explicit', zh: '显式表达交付就绪度' },
        body: {
          en: 'The system distinguishes draft, needs-clarification, accepted, and ready-to-deliver instead of treating generated content as automatically complete.',
          zh: '系统区分草稿、待澄清、已验收和可交付，而不把生成内容自动视为完成。',
        },
      },
    ],
    evidence: [
      {
        value: 'TRACE',
        label: { en: 'assertion lineage', zh: '结论链路' },
        detail: { en: 'source fragment, version, and owner remain inspectable', zh: '来源片段、版本和责任人保持可检查' },
      },
      {
        value: 'GATE',
        label: { en: 'human acceptance', zh: '人工验收' },
        detail: { en: 'readiness is a decision, not a completion animation', zh: '就绪度是一项决策，不是完成动画' },
      },
      {
        value: 'PACK',
        label: { en: 'controlled delivery', zh: '受控交付' },
        detail: { en: 'versioned materials stay recoverable and reviewable', zh: '版本化材料可恢复、可审核' },
      },
    ],
    outcomes: [
      {
        en: 'Reviewers can see what is known, what remains uncertain, and why a conclusion is present before it enters a delivery package.',
        zh: '审核者可在结论进入交付包之前看见已知信息、未确定项及结论出现的原因。',
      },
      {
        en: 'Operators can recover a decision path without reopening every original source or trusting a black-box summary.',
        zh: '执行人员无需重开每一份原始资料，也无需相信黑箱总结，即可恢复决策路径。',
      },
      {
        en: 'Human acceptance becomes a recorded stage of the system rather than an untracked offline handoff.',
        zh: '人工验收成为系统中被记录的阶段，而不是未追踪的线下交接。',
      },
    ],
    stack: ['TypeScript', 'Knowledge contracts', 'Evidence bindings', 'Versioned delivery', 'Human review'],
  },
]

export const projects: Project[] = [
  {
    title: 'DSH Git Workbench',
    period: 'Aug 2026',
    featured: true,
    context: {
      en: 'Open-source visual Git client for DSH',
      zh: '面向 DSH 的开源可视化 Git 客户端',
    },
    summary: {
      en: 'A Git DAG workbench that makes history, rich search, multi-diff review, WIP staging, worktrees, agent workspaces, and recovery-safe Git operations visible in one local desktop surface.',
      zh: '一套 Git DAG 工作台：把历史、富搜索、多 Diff 审阅、WIP 暂存、worktree、Agent 工作区和可恢复的 Git 操作放进同一本地桌面界面。',
    },
    role: {
      en: 'Product architecture, graph UI, Git service layer, safety model, test suite',
      zh: '产品架构、图谱 UI、Git 服务层、安全模型、测试套件',
    },
    image: '/images/projects/dsh-git-workbench-cover.jpg',
    stack: ['TypeScript', 'React', 'Cordis / DSH', 'Git DAG', 'Vitest'],
    sourceUrl: 'https://github.com/nateEc/dsh-gitKraken',
  },
  {
    title: 'Shortcutype',
    period: 'Jul 2026',
    context: {
      en: 'Keyboard-first shortcut recall trainer',
      zh: '键盘优先的快捷键回忆训练器',
    },
    summary: {
      en: 'A local-only trainer that turns developer commands into reflexes through hidden-answer recall, real chord capture, focused review, and adaptive practice.',
      zh: '纯本地训练工具，通过隐藏答案回忆、真实组合键捕获、错题复练和自适应练习，把开发者命令练成下意识。',
    },
    role: {
      en: 'Product design, adaptive scheduling, real-chord input, keyboard accessibility',
      zh: '产品设计、自适应调度、真实组合键输入、键盘无障碍',
    },
    image: '/images/projects/shortcutype-cover.webp',
    stack: ['React', 'TypeScript', 'Vitest', 'Playwright', 'Local-first'],
    sourceUrl: 'https://github.com/nateEc/Shortcutype',
  },
  {
    title: 'Candidate Intel Agent',
    period: 'May 2026',
    context: {
      en: 'HR browser agent and talent intelligence system',
      zh: 'HR 浏览器 Agent 与人才索引系统',
    },
    summary: {
      en: 'A local agent stack for visible browser control, recruiting workflows, candidate indexing, and pgvector-backed talent search.',
      zh: '本地 Agent 技术栈，覆盖可见浏览器控制、招聘流程、候选人索引和 pgvector 人才搜索。',
    },
    role: {
      en: 'Browser service, agent workflow, talent library API',
      zh: '浏览器服务、Agent 工作流、人才库 API',
    },
    image: '/images/projects/candidate-intel-agent-cover.webp',
    stack: ['Python', 'FastAPI', 'Playwright/CDP', 'Postgres', 'pgvector'],
    sourceUrl: 'https://github.com/nateEc/candidate-intel-agent',
  },
  {
    title: 'DataFlow',
    period: 'Jan 2026',
    context: {
      en: 'AI-native spreadsheet editor',
      zh: 'AI Native 电子表格编辑器',
    },
    summary: {
      en: 'A spreadsheet interface with an AI chat panel for template generation, cell edits, formulas, and diff previews.',
      zh: '带 AI 聊天面板的电子表格工具，支持生成模板、编辑单元格、公式和 Diff 预览。',
    },
    role: {
      en: 'Spreadsheet UI, AI command parser, diff preview flow',
      zh: '表格 UI、AI 指令解析、Diff 预览流程',
    },
    image: '/images/projects/dataflow-cover.webp',
    stack: ['React', 'TypeScript', 'Vite', 'LLM', 'Diff Preview'],
    sourceUrl: 'https://github.com/nateEc/DataFlow',
  },
  {
    title: 'Pet Safe',
    period: 'Sep 2023',
    context: {
      en: 'Mobile map prototype',
      zh: '移动端地图原型',
    },
    summary: {
      en: 'A mobile-first prototype for pet-friendly location discovery with Capacitor, Ionic React, and map interactions.',
      zh: '移动优先原型，使用 Capacitor、Ionic React 和地图交互探索宠物友好地点发现。',
    },
    role: {
      en: 'Mobile routing, location discovery, map interaction',
      zh: '移动端路由、地点发现、地图交互',
    },
    image: '/images/projects/pet-safe-cover.webp',
    stack: ['Ionic React', 'Capacitor', 'TypeScript', 'Mapbox'],
    sourceUrl: 'https://github.com/nateEc/pet-safe',
  },
]

export const upstreamContributions: UpstreamContribution[] = [
  {
    project: 'MetaBot',
    merged: 9,
    focus: {
      en: 'runtime reliability, safety, and developer setup',
      zh: '运行时可靠性、安全性与开发者配置',
    },
    detail: {
      en: 'Accepted upstream patches across the agent runtime and its operating edges.',
      zh: '已被上游接受的 Agent 运行时及其运行边界改进。',
    },
    sourceUrl: 'https://github.com/xvirobotics/metabot/pulls?q=is%3Apr+author%3AnateEc+is%3Amerged',
  },
  {
    project: 'T3 Code',
    merged: 5,
    focus: {
      en: 'workbench stability and streaming behavior',
      zh: '工作台稳定性与流式行为',
    },
    detail: {
      en: 'Merged fixes that improve the open-source workbench used as an upstream integration point.',
      zh: '已合入的修复，改善作为上游集成点的开源工作台。',
    },
    sourceUrl: 'https://github.com/pingdotgg/t3code/pulls?q=is%3Apr+author%3AnateEc+is%3Amerged',
  },
]

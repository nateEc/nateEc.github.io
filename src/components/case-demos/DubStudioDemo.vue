<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Language } from '../../data/portfolio'

const props = defineProps<{ language: Language }>()

const activeTrack = ref<'original' | 'dubbed'>('dubbed')
const player = ref<HTMLVideoElement | null>(null)

const copy = computed(() => props.language === 'zh'
  ? {
      label: '真实本地模型运行 · Portfolio 原创素材 · 无第三方视频',
      title: 'A/B 配音剪辑台',
      intro: '同一段原创动态画面，保留播放位置切换英文原声与 CosyVoice 中文源音色。字幕、音轨和验证记录都来自本地生成。',
      original: '英文原声',
      dubbed: '中文配音',
      sourceLabel: 'Original / 系统英文语音',
      dubbedLabel: 'Dubbed / CosyVoice cross-lingual',
      waveform: '音轨波形',
      transcript: '当前字幕',
      englishLine: 'Small failures become useful when a system can replay them, compare them, and turn them into evidence.',
      chineseLine: '当系统能够回放、比较并沉淀证据时，小故障也会变成有用的工程输入。',
      pipeline: '本次本地运行',
      app: '真实应用界面',
      appDetail: 'Gradio 工作台实际成功生成后的页面截图；下方媒体另用原创样例，避免复用截图中的第三方视频。',
      report: '质量报告',
      sourceVoice: '源音色',
      sourceVoiceValue: 'CosyVoice2 · true',
      sync: 'A/V 时长差',
      syncValue: '0.00 s',
      privacy: '素材权属',
      privacyValue: 'Portfolio 原创',
      fallback: 'Fallback',
      fallbackValue: '未发生',
      stages: ['英文参考音频', '字幕检查', '人工审校翻译', '源音色合成', '音画混合', '产物验证'],
      stageDetails: ['6.30 s', 'Whisper local', '1 segment', 'CosyVoice2', 'ffmpeg', '6 artifacts'],
      lipNote: '本段为动态排版画面，无人脸，因此 lip-sync 标记为 N/A；项目的真人素材 Wav2Lip gate 已在历史五连验证中 5/5 通过。',
    }
  : {
      label: 'Real local model run · original portfolio media · no third-party video',
      title: 'A/B dubbing desk',
      intro: 'Switch between the English source and the CosyVoice Chinese voice on the same original motion clip without losing your playhead. Captions, tracks, and evidence were generated locally.',
      original: 'English source',
      dubbed: 'Chinese dub',
      sourceLabel: 'Original / system English voice',
      dubbedLabel: 'Dubbed / CosyVoice cross-lingual',
      waveform: 'Audio waveform',
      transcript: 'Current caption',
      englishLine: 'Small failures become useful when a system can replay them, compare them, and turn them into evidence.',
      chineseLine: '当系统能够回放、比较并沉淀证据时，小故障也会变成有用的工程输入。',
      pipeline: 'This local run',
      app: 'Real application surface',
      appDetail: 'The Gradio workspace after a successful generation. The playable media below is a separate original sample, avoiding the third-party source visible in the capture.',
      report: 'Quality report',
      sourceVoice: 'Source voice',
      sourceVoiceValue: 'CosyVoice2 · true',
      sync: 'A/V duration delta',
      syncValue: '0.00 s',
      privacy: 'Media rights',
      privacyValue: 'Portfolio original',
      fallback: 'Fallback',
      fallbackValue: 'Not used',
      stages: ['English reference', 'Caption check', 'Human-reviewed translation', 'Source-voice synthesis', 'Audio/video mix', 'Artifact validation'],
      stageDetails: ['6.30 s', 'Whisper local', '1 segment', 'CosyVoice2', 'ffmpeg', '6 artifacts'],
      lipNote: 'This clip uses motion typography and has no face, so lip-sync is N/A. The project’s Wav2Lip gate on talking-head media passed its historical five-run validation 5/5.',
    })

const videoSrc = computed(() => activeTrack.value === 'original'
  ? '/demos/yt-dub/original.mp4'
  : '/demos/yt-dub/dubbed.mp4')
const trackSrc = computed(() => activeTrack.value === 'original'
  ? '/demos/yt-dub/original-en.vtt'
  : '/demos/yt-dub/dubbed-zh.vtt')
const posterSrc = computed(() => activeTrack.value === 'original'
  ? '/demos/yt-dub/original-background.png'
  : '/demos/yt-dub/dubbed-background.png')

const waveform = [10, 18, 28, 22, 42, 34, 16, 29, 48, 31, 24, 15, 34, 45, 22, 12, 26, 39, 51, 33, 18, 24, 44, 36, 20, 13, 30, 47, 29, 19, 38, 53, 34, 21, 14, 28, 40, 25, 17, 32, 46, 27]

watch(activeTrack, async () => {
  const video = player.value
  if (!video) return
  const time = video.currentTime
  const wasPlaying = !video.paused
  await nextTick()
  video.load()
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = Math.min(time, video.duration || time)
    if (wasPlaying) void video.play()
  }, { once: true })
})
</script>

<template>
  <section class="dub-demo" aria-labelledby="dub-demo-title">
    <header class="dub-header">
      <div>
        <p class="dub-kicker"><span aria-hidden="true"></span>{{ copy.label }}</p>
        <h2 id="dub-demo-title">{{ copy.title }}</h2>
      </div>
      <p>{{ copy.intro }}</p>
    </header>

    <figure class="app-proof">
      <img src="/demos/yt-dub/app-workspace.webp" :alt="copy.app" width="1280" height="720" />
      <figcaption><strong>{{ copy.app }}</strong><span>{{ copy.appDetail }}</span></figcaption>
    </figure>

    <div class="edit-suite">
      <div class="player-column">
        <div class="source-toggle" role="group" :aria-label="copy.title">
          <button type="button" :class="{ active: activeTrack === 'original' }" :aria-pressed="activeTrack === 'original'" @click="activeTrack = 'original'">
            <span>A</span>{{ copy.original }}
          </button>
          <button type="button" :class="{ active: activeTrack === 'dubbed' }" :aria-pressed="activeTrack === 'dubbed'" @click="activeTrack = 'dubbed'">
            <span>B</span>{{ copy.dubbed }}
          </button>
        </div>

        <div class="video-shell">
          <video ref="player" :key="videoSrc" controls playsinline preload="metadata" :src="videoSrc" :poster="posterSrc">
            <track kind="captions" :src="trackSrc" :srclang="activeTrack === 'original' ? 'en' : 'zh'" default />
          </video>
          <div class="video-label"><span></span>{{ activeTrack === 'original' ? copy.sourceLabel : copy.dubbedLabel }}</div>
        </div>

        <div class="waveform" aria-hidden="true">
          <span v-for="(height, index) in waveform" :key="index" :style="{ height: `${height}px` }"></span>
        </div>
        <div class="caption-card">
          <span>{{ copy.transcript }}</span>
          <p>{{ activeTrack === 'original' ? copy.englishLine : copy.chineseLine }}</p>
        </div>
      </div>

      <aside class="run-report">
        <p class="panel-label">{{ copy.pipeline }}</p>
        <ol>
          <li v-for="(stage, index) in copy.stages" :key="stage">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <div><strong>{{ stage }}</strong><small>{{ copy.stageDetails[index] }}</small></div>
            <i aria-label="completed">✓</i>
          </li>
        </ol>
        <div class="quality-report">
          <p class="panel-label">{{ copy.report }}</p>
          <dl>
            <div><dt>{{ copy.sourceVoice }}</dt><dd>{{ copy.sourceVoiceValue }}</dd></div>
            <div><dt>{{ copy.sync }}</dt><dd>{{ copy.syncValue }}</dd></div>
            <div><dt>{{ copy.privacy }}</dt><dd>{{ copy.privacyValue }}</dd></div>
            <div><dt>{{ copy.fallback }}</dt><dd>{{ copy.fallbackValue }}</dd></div>
          </dl>
          <p class="lip-note">{{ copy.lipNote }}</p>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.dub-demo {
  --dub-mint: #40ddca;
  --dub-orange: #ffab5c;
  overflow: hidden;
  color: #edf5f6;
  border: 1px solid #2b3940;
  border-radius: 14px;
  background: #091014;
  box-shadow: 0 30px 90px rgb(13 31 39 / 26%);
}

.dub-header {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(280px, 1.1fr);
  gap: 48px;
  padding: clamp(30px, 5vw, 56px);
  background: radial-gradient(circle at 12% 0%, rgb(64 221 202 / 16%), transparent 42%), radial-gradient(circle at 94% 0%, rgb(255 171 92 / 12%), transparent 38%);
}

.dub-kicker,
.panel-label,
.caption-card > span,
.video-label {
  margin: 0;
  color: #8ca1aa;
  font-family: var(--mono);
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.dub-kicker span,
.video-label span {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 9px;
  border-radius: 50%;
  background: var(--dub-mint);
  box-shadow: 0 0 14px var(--dub-mint);
}

.dub-header h2 {
  margin: 12px 0 0;
  color: #f5fbfc;
  font-size: clamp(2.4rem, 5vw, 5rem);
  line-height: 0.92;
}

.dub-header > p {
  align-self: end;
  max-width: 620px;
  margin: 0;
  color: #a2b5bd;
}

.app-proof {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(240px, 0.55fr);
  margin: 0;
  border-top: 1px solid #2b3940;
  border-bottom: 1px solid #2b3940;
  background: #0d151a;
}

.app-proof img {
  width: 100%;
  height: 100%;
  min-height: 300px;
  object-fit: cover;
  object-position: top left;
}

.app-proof figcaption {
  display: flex;
  padding: 28px;
  flex-direction: column;
  justify-content: flex-end;
  border-left: 1px solid #2b3940;
}

.app-proof strong {
  color: var(--dub-mint);
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.app-proof span {
  margin-top: 10px;
  color: #a3b4bc;
  font-size: 0.78rem;
}

.edit-suite {
  display: grid;
  grid-template-columns: minmax(0, 1.48fr) minmax(300px, 0.52fr);
  gap: 1px;
  background: #2b3940;
}

.player-column,
.run-report {
  min-width: 0;
  padding: clamp(20px, 4vw, 38px);
  background: #0b1217;
}

.source-toggle {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  margin-bottom: 14px;
  padding: 5px;
  border: 1px solid #2d3e45;
  border-radius: 8px;
  background: #0e181d;
}

.source-toggle button {
  min-height: 46px;
  border: 0;
  border-radius: 5px;
  color: #8da1aa;
  background: transparent;
  font-family: var(--mono);
  font-size: 0.68rem;
  cursor: pointer;
}

.source-toggle button:hover,
.source-toggle button.active {
  color: #071514;
  background: var(--dub-mint);
}

.source-toggle button span {
  display: inline-grid;
  width: 20px;
  height: 20px;
  margin-right: 7px;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.video-shell {
  position: relative;
  overflow: hidden;
  border: 1px solid #35474f;
  border-radius: 8px;
  background: #05090c;
}

.video-shell video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #05090c;
}

.video-label {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 7px 10px;
  border: 1px solid rgb(115 153 163 / 30%);
  border-radius: 999px;
  color: #d6e5e8;
  background: rgb(5 12 15 / 74%);
  backdrop-filter: blur(12px);
}

.waveform {
  display: flex;
  height: 72px;
  margin: 12px 0;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid #2d3e45;
  border-radius: 7px;
  background: linear-gradient(90deg, rgb(64 221 202 / 8%), transparent 70%);
}

.waveform span {
  width: 2px;
  min-height: 4px;
  border-radius: 3px;
  background: var(--dub-mint);
  opacity: 0.72;
}

.caption-card {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  padding: 16px;
  border: 1px solid #2d3e45;
  border-radius: 7px;
  background: #0f191e;
}

.caption-card p {
  margin: 0;
  color: #d2dfe3;
  font-size: 0.8rem;
}

.run-report ol {
  padding: 0;
  margin: 16px 0 30px;
  list-style: none;
}

.run-report li {
  display: grid;
  grid-template-columns: 29px 1fr 22px;
  gap: 10px;
  align-items: center;
  padding: 11px 0;
  border-bottom: 1px solid #27363d;
}

.run-report li > span {
  color: #627984;
  font-family: var(--mono);
  font-size: 0.6rem;
}

.run-report li strong,
.run-report li small {
  display: block;
}

.run-report li strong {
  color: #d8e4e7;
  font-size: 0.75rem;
  font-weight: 500;
}

.run-report li small {
  margin-top: 2px;
  color: #738892;
  font-family: var(--mono);
  font-size: 0.58rem;
}

.run-report li i {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 50%;
  color: #071311;
  background: var(--dub-mint);
  font-size: 0.65rem;
  font-style: normal;
}

.quality-report {
  padding: 18px;
  border: 1px solid #335058;
  border-radius: 8px;
  background: linear-gradient(145deg, rgb(64 221 202 / 8%), rgb(255 171 92 / 4%));
}

.quality-report dl {
  margin: 12px 0 0;
}

.quality-report dl > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 0;
  border-bottom: 1px solid rgb(96 131 141 / 22%);
  font-family: var(--mono);
  font-size: 0.62rem;
}

.quality-report dt { color: #8397a0; }
.quality-report dd { margin: 0; color: var(--dub-mint); text-align: right; }

.lip-note {
  margin: 14px 0 0;
  color: #7f939c;
  font-size: 0.68rem;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .dub-header { grid-template-columns: 1fr; gap: 20px; }
  .edit-suite { grid-template-columns: 1fr; }
  .app-proof { grid-template-columns: 1fr; }
  .app-proof figcaption { border-top: 1px solid #2b3940; border-left: 0; }
}

@media (max-width: 600px) {
  .dub-header { padding: 25px 18px; }
  .player-column,
  .run-report { padding: 18px 12px; }
  .caption-card { grid-template-columns: 1fr; gap: 6px; }
  .app-proof img { min-height: 220px; }
}
</style>

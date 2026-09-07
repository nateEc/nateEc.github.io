// Editorial motion studies from existing, real application captures.
// These are not represented as recordings of live application interaction.
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const temp = mkdtempSync(join(tmpdir(), 'portfolio-films-'))
const output = resolve(root, 'public/demos/cinema')
mkdirSync(output, { recursive: true })
const run = args => {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`ffmpeg exited ${result.status}`)
}
const encode = ['-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
const shot = (name, image, zoom, x, y) => {
  const path = join(temp, `${name}.mp4`)
  run(['-i', resolve(root, 'public', image), '-vf',
    `scale=1920:1200:force_original_aspect_ratio=decrease,pad=1920:1200:(ow-iw)/2:(oh-ih)/2:color=0x101725,zoompan=z='${zoom}':x='${x}':y='${y}':d=120:s=1280x800:fps=30,fade=t=in:st=0:d=0.25,fade=t=out:st=3.7:d=0.3`,
    '-t', '4', ...encode, path])
  return path
}
const combine = (name, paths) => run([
  ...paths.flatMap(path => ['-i', path]), '-filter_complex',
  `${paths.map((_, i) => `[${i}:v]`).join('')}concat=n=${paths.length}:v=1:a=0[v]`,
  '-map', '[v]', ...encode, join(output, `${name}.mp4`),
])
try {
  combine('hipilot', [
    shot('hp-panels', 'demos/hipilot/preview-panel.webp', '1.02+on*0.0015', 'iw/2-iw/zoom/2', 'ih/2-ih/zoom/2'),
    shot('hp-terminal', 'demos/hipilot/terminal.webp', '1.28-on*0.001', 'iw/2-iw/zoom/2', 'ih-ih/zoom'),
    shot('hp-settings', 'demos/hipilot/settings.webp', '1.02+on*0.001', 'iw-iw/zoom', '0'),
  ])
  const dubbed = join(temp, 'dub-output.mp4')
  run(['-i', resolve(root, 'public/demos/yt-dub/dubbed.mp4'), '-vf', 'scale=1280:800:force_original_aspect_ratio=decrease,pad=1280:800:(ow-iw)/2:(oh-ih)/2:color=0x101725,fps=30,fade=t=in:st=0:d=0.3,fade=t=out:st=7.7:d=0.3', '-t', '8', ...encode, dubbed])
  combine('dub-studio', [shot('dub-ui', 'demos/yt-dub/app-workspace.webp', '1+on*0.0014', 'iw/2-iw/zoom/2', '0'), dubbed])
  combine('git-workbench', [
    shot('git-wide', 'images/projects/dsh-git-workbench-cover.jpg', '1+on*0.0018', '0', 'ih/2-ih/zoom/2'),
    shot('git-graph', 'images/projects/dsh-git-workbench-cover.jpg', '1.5+on*0.001', 'iw*0.13', 'ih/2-ih/zoom/2'),
    shot('git-changes', 'images/projects/dsh-git-workbench-cover.jpg', '1.5-on*0.0038', 'iw-iw/zoom', 'ih/2-ih/zoom/2'),
  ])
} finally { rmSync(temp, { recursive: true, force: true }) }
console.log('Built three 12-second editorial films from existing application captures and dubbed output.')

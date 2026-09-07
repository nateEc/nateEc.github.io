import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Native scrolling is the timeline. Chapters remain readable without motion. */
export function useScrollChapters(root: Ref<HTMLElement | undefined>, selector: string) {
  const active = ref(0)
  const phase = ref(0)
  const visible = ref(false)
  const reduced = ref(false)
  let frame = 0
  let media: MediaQueryList | undefined
  let observer: IntersectionObserver | undefined
  let resize: ResizeObserver | undefined
  let chapters: HTMLElement[] = []
  const readingTop = () => {
    if (innerWidth > 700 || reduced.value) return innerHeight * .3
    const stage = root.value?.querySelector<HTMLElement>('[data-chapter-stage]')
    return Math.min(innerHeight * .7, 72 + (stage?.offsetHeight ?? 0) + 8)
  }
  const update = () => {
    frame = 0
    if (!visible.value || !chapters.length) return
    const marker = innerWidth <= 700 ? readingTop() + 55 : innerHeight * .5
    const boxes = chapters.map(el => el.getBoundingClientRect())
    let candidate = 0
    boxes.forEach((box, i) => { if (box.top <= marker) candidate = i })
    active.value = candidate
    const box = boxes[candidate]!
    phase.value = Math.max(0, Math.min(1, (marker - box.top) / Math.max(1, box.height)))
  }
  const schedule = () => { if (!frame && visible.value) frame = requestAnimationFrame(update) }
  const motionChanged = () => { reduced.value = media?.matches ?? false; schedule() }
  const select = (i: number) => {
    const chapter = chapters[i]
    if (!chapter) return
    active.value = i
    window.scrollTo({ top: chapter.getBoundingClientRect().top + scrollY - readingTop(), behavior: reduced.value ? 'auto' : 'smooth' })
  }
  onMounted(() => {
    chapters = [...(root.value?.querySelectorAll<HTMLElement>(selector) ?? [])]
    media = matchMedia('(prefers-reduced-motion: reduce)')
    motionChanged()
    media.addEventListener('change', motionChanged)
    observer = new IntersectionObserver(([entry]) => {
      visible.value = Boolean(entry?.isIntersecting)
      schedule()
    })
    if (root.value) {
      observer.observe(root.value)
      resize = new ResizeObserver(schedule)
      resize.observe(root.value)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  })
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
    resize?.disconnect()
    media?.removeEventListener('change', motionChanged)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  })
  return { active, phase, visible, reduced, select }
}

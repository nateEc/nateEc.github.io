# Portfolio motion studies

These silent, 12-second editorial films are derived from existing real application
captures. They are not recordings of live clicks or agent execution.

- `hipilot.mp4`: HiPilot panel, terminal, and settings captures in `../hipilot/`.
- `dub-studio.mp4`: the actual Gradio workspace capture, followed by an excerpt
  of the existing locally generated `../yt-dub/dubbed.mp4` output.
- `git-workbench.mp4`: wide and detail camera moves over the existing DSH Git
  Workbench capture in `/images/projects/dsh-git-workbench-cover.jpg`.

Rebuild from the repository root with `node scripts/build-cinema-media.mjs`.
Requires ffmpeg with libx264. Output is 1280 × 800, 30 fps, H.264, no audio,
with fast-start metadata. Only the active film is mounted on the homepage;
offscreen and hidden-tab playback pauses, and reduced motion uses stills.

# Nathan Shan — Agent Reliability Casebook

A bilingual portfolio for production AI-agent engineering. The site is organized as an evidence archive rather than a generic project gallery: a sanitized trace inspector in the Hero, three deep case studies, a smaller product/open-source archive, technical notes, and a transparent mail-draft contact flow.

## Local review

```bash
npm install
npm run check
npm run preview -- --host 127.0.0.1 --port 4173
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/).

`npm run check` performs the TypeScript check, production build, local-link checks, required-asset checks, metadata checks, and verifies that generated `dist/` files are not tracked.

## Content map

- `src/data/portfolio.ts` — bilingual case-study and project content
- `src/views/CaseStudyView.vue` — reusable deep-case route
- `src/components/HeroSection.vue` — sanitized Agent Trace Inspector
- `src/components/PortfolioSection.vue` — casebook and project archive
- `public/blog/` — long-form notes with a shared reading shell
- `resume/resume-en.tex` — reproducible English résumé source
- `public/resume-en.pdf` / `public/resume-zh.pdf` — public résumé files
- `scripts/check-site.mjs` — dependency-free site validation

## Commands

```bash
npm run dev         # Vite development server
npm run type-check  # Vue/TypeScript validation
npm run build       # Production build
npm run check       # Full local acceptance suite
npm run preview     # Preview the production build
```

## Publishing

This repository now uses GitHub Actions to publish on every push to `main` via `Deploy to GitHub Pages` workflow.

- Build and deploy are fully automated after `main` receives updates.
- `dist/` remains generated and ignored in git.
- Default site URL: `https://nateec.github.io/`

## Daily Tech Signal publishing

Hermes collects the AI digest and the Hacker News + TechCrunch digest at 11:00 Beijing time. At 11:30, `publish-tech-news.py` regenerates the public snapshot, runs the full acceptance suite, commits only `public/tech-news/latest.json`, and pushes `main`. The existing Pages workflow performs the deployment.

The publisher fails closed when the repository is not on `main`, when local changes exist outside the news snapshot, when `main` differs from `origin/main`, or when validation fails. Resolve the reported condition and rerun the Hermes job instead of bypassing these checks.

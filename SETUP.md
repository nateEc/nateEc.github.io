# Portfolio Vue Setup Guide

## Overview
Your portfolio has been transformed into a modern Vue.js application with a minimalistic design.

## Project Structure
```
portfolio-vue/
├── src/
│   ├── components/
│   │   ├── IntroSection.vue       # Einstein quote intro
│   │   ├── HeroSection.vue        # Main hero with your name
│   │   ├── AboutSection.vue       # About me section
│   │   ├── SkillsSection.vue      # Programming skills
│   │   ├── PortfolioSection.vue   # Project showcase
│   │   ├── ExperienceSection.vue  # Timeline of experience
│   │   ├── ContactSection.vue     # Contact form & info
│   │   └── Navigation.vue         # Fixed side navigation
│   ├── App.vue                    # Main app component
│   └── main.ts                    # App entry point
└── public/                        # Static assets
```

## Setup Instructions

### 1. Copy Images
You need to copy the `images` folder from the root directory to `portfolio-vue/public/`:

```bash
cp -r images portfolio-vue/public/
```

Also copy the Resume.pdf:
```bash
cp Resume.pdf portfolio-vue/public/
```

### 2. Install Dependencies
Navigate to the portfolio-vue directory and install dependencies:

```bash
cd portfolio-vue
npm install
```

### 3. Run Development Server
Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production
When ready to deploy:

```bash
npm run build
```

The built files will be in the `dist` folder.

## Design Features

### Minimalistic Style
- **Clean Typography**: System fonts for crisp, readable text
- **Simple Color Palette**: Black, white, and blue accent
- **Subtle Animations**: Smooth transitions and hover effects
- **Responsive Design**: Works perfectly on all screen sizes
- **Fixed Navigation**: Easy section jumping with circular nav buttons
- **Live Clock**: Bottom-left corner time display

### Components Breakdown

1. **IntroSection**: Displays Einstein quote for 3 seconds on load
2. **HeroSection**: Your name with animated typing effect
3. **AboutSection**: Brief introduction about yourself
4. **SkillsSection**: Grid display of your technical skills with icons
5. **PortfolioSection**: Project cards with hover overlays
6. **ExperienceSection**: Timeline view of your work history
7. **ContactSection**: Contact form and social links
8. **Navigation**: Fixed right-side navigation with smooth scrolling

## Customization

### Colors
Edit the CSS variables in `App.vue`:
```css
:root {
  --primary-color: #000;
  --secondary-color: #666;
  --accent-color: #0066ff;
  --bg-color: #fff;
  --text-color: #000;
  --border-color: #e0e0e0;
}
```

### Content
- Update text content directly in each component file
- Modify the arrays in `SkillsSection.vue`, `PortfolioSection.vue`, and `ExperienceSection.vue`
- Change contact info in `ContactSection.vue`

## Notes
- All original content from your HTML has been preserved
- The design is now more modern and minimalistic
- TypeScript is used for better type safety
- All animations are CSS-based for better performance

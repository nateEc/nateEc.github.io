# 🚀 Quick Start Guide

## Get Your Portfolio Running in 3 Steps

### Step 1: Navigate to the project
```bash
cd portfolio-vue
```

### Step 2: Run the setup script
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Copy your images folder
- Copy your Resume.pdf
- Install all dependencies

### Step 3: Start the development server
```bash
npm run dev
```

Your portfolio will be available at: **http://localhost:5173**

---

## 🎨 What You'll See

1. **Intro Screen** (3 seconds) - Einstein quote
2. **Hero Section** - Your name with animated typing
3. **About Section** - Your introduction
4. **Skills Section** - All your technical skills
5. **Portfolio Section** - Your projects
6. **Experience Section** - Your work timeline
7. **Contact Section** - Contact form and info

**Navigation**: Fixed circular buttons on the right side
**Clock**: Live time display in bottom-left corner

---

## 📝 Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Type checking
npm run type-check   # Check TypeScript types
```

---

## 🎯 Design Highlights

- **Minimalistic**: Clean black & white with blue accents
- **Responsive**: Works on all devices
- **Fast**: No heavy dependencies
- **Modern**: Vue 3 + TypeScript + Vite

---

## 🔧 Quick Customization

### Change Accent Color
Edit `src/App.vue`, line 61:
```css
--accent-color: #0066ff;  /* Change to your preferred color */
```

### Update Your Info
- **Contact**: `src/components/ContactSection.vue`
- **Projects**: `src/components/PortfolioSection.vue`
- **Skills**: `src/components/SkillsSection.vue`
- **Experience**: `src/components/ExperienceSection.vue`

---

## ❓ Need Help?

Check these files:
- `SETUP.md` - Detailed setup instructions
- `TRANSFORMATION_SUMMARY.md` - Complete transformation details

---

**That's it! Your modern portfolio is ready to go! 🎉**

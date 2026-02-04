# Care Connect: Design Context & Brief

## 1. Project Overview

**Care Connect** is a premium SaaS platform dedicated to connecting families with verified, professional care providers. We bridge the gap between need and trust, offering a seamless experience for finding help with what matters most.

### Core Services

- **Child Care**: Nannies, babysitters, and au pairs for children aged 5 months to 6 years+.
- **Senior Care**: Compassionate companionship and assistance for the elderly.
- **Pet Care**: Dog walking, pet sitting, and care.
- **Housekeeping**: Professional home cleaning and maintenance.

### Mission

To provide "Professional care tailored to your needs" with a focus on **trust, verification, and wellness**.

---

## 2. Design Philosophy: "Wellness & Trust"

The design should feel **premium, soft, and approachable**. It should move away from sterile "corporate" medical aesthetics and instead evoke feelings of warmth, safety, and community.

- **Keywords**: Soft, Premium, Friendly, Trustworthy, Modern, "Bento-style" layouts.
- **Vibe**: A helping hand, a safe harbor. Not checking a box, but finding a partner in care.

---

## 3. Visual Identity & Look/Feel

### Color Palette

The palette is earthy and calming, anchored by a deep professional navy but balanced with warm, vibrant accents.

#### **Primary Brand Colors**

- **Deep Navy**: `#1e3a5f` / `#0F172A` (Text, Headings, Primary Actions) - _Represents Authority & Trust_.
- **Soft White / Background**: `#FFFFFF`, `#F8F9FA` - _Cleanliness & Space_.

#### **Service & Accent Colors**

Used to distinguish different verticals and add life to the design.

- **Terracotta (Senior Care)**: `#E08E79` - _Warmth, Human connection_.
- **Mustard / Gold (Quality/Highlights)**: `#EEDC82` / `#F1B92B` - _Optimism, Premium quality_.
- **Primary Green (Child Care)**: `#1F6F5B` - _Growth, Safety, Nature_.
- **Mint (Backgrounds)**: `#E5F1EC` - _Freshness_.
- **Lavender / Coral**: `#C9C6E5`, `#D85A4F` - _Playful accents_.

### Typography

A mix of modern geometric sans-serifs for readability and character, with optional serif usage for "editorial" moments.

- **Headings**: **DM Sans** (Modern, friendly) or **Playfair Display** (Premium, editorial).
- **Body Copy**: **Inter** (Clean, highly legible interface text).

### Graphic Elements & UI Style

- **Rounded Aesthetics**: Use generous border radii (e.g., `rounded-[40px]` for large cards, `rounded-full` for buttons). Avoid sharp 90-degree corners.
- **Layouts**: **Bento Grids**. Organize content into modular, masonry-like grids that feel organic yet structured.
- **Decorations**: Soft "blobs", geometric shapes (circles, diamonds) in pastel opacities to link sections without clutter.
- **Imagery**: High-quality lifestyle photography featuring diverse people. Authentic moments of care, not staged stock photos.
- **Icons**: Clean stroke icons (Lucide style) - e.g., Baby, Heart, PawPrint, Home.

---

## 4. Key Screens & Components for Figma

### Landing Page Structure

1.  **Hero Section**:
    - **Left Panel**: Emotional background preview/video.
    - **Right Panel**: Strong value prop ("Professional care tailored to your needs") with immediate call-to-action cards.
2.  **Featured Services (The Bento Grid)**:
    - A grid showing Child Care, Senior Care, Pet Care, Housekeeping.
    - Mix of colored tiles (Navy, Mustard, Terracotta) and white tiles.
    - Interactive hover states (scale up, shadow increase).
3.  **Trust Signals**:
    - "Verified Professionals" badges.
    - Star ratings and reviews.
4.  **CTA**: Warm, inviting "Find your caregiver" prompts.

### Component Library Needs

- **Cards**: Service cards, Profile cards (Photo, Name, Rating, Hourly Rate).
- **Buttons**: Pill-shaped (`rounded-full`), varying from solid Navy (Primary) to Outline or Ghost (Secondary).
- **Input Fields**: Soft borders, large hit areas, `focus:ring` states in accent colors.
- **Navigation**: Simple, airy top bar. Sticky mobile bottom bar (if app-like).

---

## 5. Technical Constraints & Handoff

- **Grid System**: 12-column grid (Tailwind `grid-cols-12`).
- **Spacing**: based on 4px scaling (Tailwind spacing scale `p-4`, `m-8` etc).
- **Shadows**: Soft, multi-layer shadows (e.g., `box-shadow: 0 10px 15px -3px rgba(30, 58, 95, 0.1)`).
- **Responsiveness**: Design for Mobile (375px) and Desktop (1440px).

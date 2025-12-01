# CareConnect Design System Documentation

**Last Updated:** November 25, 2024

## Overview

CareConnect is a modern childcare platform with a design philosophy centered on "Soft Trust" - utilizing clean aesthetics, ample whitespace, and fluid interactions to create a welcoming, professional experience for families and caregivers.

---

## Design Philosophy

### Core Principles
1. **Soft Trust** - Approachable yet professional design that builds confidence
2. **Clarity** - Clear information hierarchy and intuitive navigation
3. **Consistency** - Unified design patterns across all pages and components
4. **Accessibility** - Readable typography, proper contrast, and semantic HTML

---

## Color System

### Brand Colors

**Primary (Soft Teal)**
- Variable: `hsl(var(--primary))`
- Usage: Main brand color, primary CTAs, active states, icons
- Represents: Health, calm, trust

**Secondary (Warm Coral)**
- Variable: `hsl(var(--secondary))`
- Usage: Accent color, secondary CTAs, highlights
- Represents: Warmth, care, energy

### Neutral Colors

**Background**
- `bg-neutral-50`: Main page background (#FAFAFA)
- `bg-white`: Card and component backgrounds

**Text**
- `text-neutral-900`: Primary text (#171717)
- `text-neutral-600`: Secondary text, labels
- `text-neutral-500`: Muted text, placeholders

**Borders**
- `border-neutral-100`: Subtle borders
- `border-neutral-200`: Standard borders

### Semantic Colors

**Destructive/Error**
- `bg-error-600`: Error states, destructive actions
- `bg-red-50`: Error backgrounds

**Success**
- `bg-green-50`: Success backgrounds
- `text-green-600`: Success text

**Warning**
- `bg-yellow-50`: Warning backgrounds
- `text-yellow-600`: Warning text

---

## Typography

### Font Families
- **Headings**: System font stack (optimized for performance)
- **Body**: System font stack
- **Monospace**: For code/technical content

### Scale
- `text-xs`: 12px - Small labels, badges
- `text-sm`: 14px - Secondary text, captions
- `text-base`: 16px - Body text
- `text-lg`: 18px - Large body text, card titles
- `text-xl`: 20px - Section subheadings
- `text-2xl`: 24px - Card headings
- `text-3xl`: 30px - Page headings
- `text-4xl`: 36px - Hero headings (mobile)
- `text-5xl`: 48px - Hero headings (desktop)
- `text-7xl`: 72px - Large hero text

### Font Weights
- `font-normal`: 400 - Body text
- `font-medium`: 500 - Emphasized text
- `font-semibold`: 600 - Subheadings
- `font-bold`: 700 - Headings, important text

---

## Spacing System

### Padding/Margin Scale
- `p-2` / `m-2`: 8px
- `p-3` / `m-3`: 12px
- `p-4` / `m-4`: 16px
- `p-5` / `m-5`: 20px
- `p-6` / `m-6`: 24px
- `p-8` / `m-8`: 32px
- `p-12` / `m-12`: 48px
- `p-20` / `m-20`: 80px

### Gap Scale
- `gap-2`: 8px - Tight spacing
- `gap-3`: 12px - Compact spacing
- `gap-4`: 16px - Standard spacing
- `gap-6`: 24px - Comfortable spacing
- `gap-8`: 32px - Generous spacing

---

## Border Radius

### Standard Radii
- `rounded-md`: 6px - Small elements
- `rounded-lg`: 8px - Buttons, inputs
- `rounded-xl`: 12px - Medium cards
- `rounded-[20px]`: 20px - Compact containers
- `rounded-[24px]` / `rounded-[2rem]`: 24px - Large cards, containers
- `rounded-full`: 9999px - Pills, circular elements

### Usage Guidelines
- **Cards**: `rounded-[24px]` or `rounded-[2rem]`
- **Buttons**: `rounded-full` for primary CTAs, `rounded-xl` for secondary
- **Inputs**: `rounded-lg` or `rounded-xl`
- **Badges**: `rounded-full`

---

## Shadows

### Shadow Utilities

**Soft Shadow** (Default for cards)
```css
shadow-soft: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)
```
- Usage: Cards, containers, elevated elements
- Creates: Subtle, ambient depth

**Strong Shadow** (Hover states)
```css
shadow-strong: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```
- Usage: Card hover states, modals
- Creates: Prominent elevation

**Standard Shadows**
- `shadow-sm`: Subtle shadow for borders
- `shadow-md`: Medium shadow for buttons
- `shadow-lg`: Large shadow for dropdowns
- `shadow-xl`: Extra large for modals

---

## Components

### Button Component

**Variants:**

1. **Default** (Primary)
   - `bg-primary text-neutral-900`
   - Usage: Primary actions
   - Example: "Get Started", "Sign Up"

2. **Outline**
   - `border border-neutral-200 bg-background`
   - Usage: Secondary actions
   - Example: "Cancel", "View Profile"

3. **Ghost**
   - `hover:bg-neutral-100`
   - Usage: Tertiary actions, icon buttons

4. **Secondary**
   - `bg-secondary text-neutral-900`
   - Usage: Alternative primary actions

5. **Destructive**
   - `bg-error-600 text-white`
   - Usage: Delete, remove actions

**Sizes:**
- `sm`: h-9, px-3, text-xs
- `default` / `md`: h-10, px-4
- `lg`: h-11, px-8, text-base
- `icon`: h-10, w-10

**Best Practices:**
- Use `rounded-full` for primary CTAs
- Use `rounded-xl` for secondary buttons
- Add `shadow-md hover:shadow-lg` for elevation
- Include icons with `gap-2` spacing

### ProfileCard Component

**Structure:**
- Image section: `h-48` (standard)
- Content padding: `p-5`
- Border radius: `rounded-[24px]`
- Shadow: `shadow-soft hover:shadow-lg`
- Hover effect: `hover:-translate-y-1`

**Elements:**
- Verified badge (top-right overlay)
- Name and location (gradient overlay on image)
- Rating badge (yellow background)
- Hourly rate (top-right of content)
- Description (line-clamp-2)
- Experience badge
- Action buttons (grid-cols-2)

### Navigation Sidebar

**ParentSidebar:**
- Width: `w-72` (fixed)
- Background: `bg-white`
- Border: `border-r border-neutral-100`
- Shadow: `shadow-soft`
- Top padding: `pt-20` (accounts for header)

**Navigation Items:**
- Padding: `px-4 py-3.5`
- Border radius: `rounded-2xl`
- Active state: `bg-primary/10`
- Hover state: `hover:bg-neutral-50`
- Icon size: 20px
- Gap: `gap-3`

---

## Animations

### Keyframe Animations

**Fade In**
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```
- Usage: Page load animations
- Class: `animate-fade-in`
- Duration: 0.5s

**Blob Animation**
```css
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
```
- Usage: Hero background elements
- Class: `animate-blob`
- Duration: 7s infinite

### Transition Classes
- `transition-all`: All properties
- `transition-colors`: Color changes
- `transition-transform`: Transform changes
- `duration-200`: 200ms
- `duration-300`: 300ms (standard)
- `duration-500`: 500ms

---

## Layout Patterns

### Hero Section
- Background: Gradient with blob animations
- Blob colors: `bg-primary/20`, `bg-secondary/20`, `bg-purple-100/40`
- Blob size: 500px x 500px
- Blur: `blur-3xl`
- Animation: Staggered with delays (0s, 2s, 4s)

### Search Bar (Conversational)
- Container: `bg-white rounded-[2rem] shadow-soft`
- Padding: `p-2 md:pl-8`
- Border: `border border-neutral-100`
- Layout: Flex row with dividers
- Button: Circular, right-aligned

### Card Grid
- Desktop: `grid-cols-2` or `grid-cols-3`
- Tablet: `grid-cols-2`
- Mobile: `grid-cols-1`
- Gap: `gap-6`

### Section Spacing
- Top/Bottom padding: `py-20`
- Side padding: `px-6`
- Max width: `max-w-6xl mx-auto` (standard)
- Max width: `max-w-4xl mx-auto` (narrow content)

---

## Page-Specific Patterns

### About Us & How It Works Pages

**Hero Section:**
- Animated blob background
- Large heading: `text-5xl md:text-7xl`
- Primary color in heading span
- Centered layout with `max-w-4xl`

**Content Sections:**
- Alternating layouts (image left/right)
- Icon badges: `bg-primary/10 rounded-full`
- Section headings: `text-4xl md:text-5xl`

**CTA Section:**
- Gradient background: `bg-gradient-to-br from-primary to-primary/80`
- Text color: `text-neutral-900` (all text including headings)
- Button styling: White background with black text
- Inline styles used for text color to override defaults

### Search Page

**Layout:**
- Fixed search bar at top
- Sidebar (filters): `w-80` (always visible)
- Main content: Scrollable grid
- Grid: `grid-cols-1 xl:grid-cols-2`

**Search Bar:**
- Compact design: `p-6 rounded-[24px]`
- Buttons: Nearby toggle
- Location display with update button

### Browse Page

**Header:**
- Sticky position: `top-20`
- Glassmorphism: `bg-white/80 backdrop-blur-xl`
- Location display (no search button)

---

## Best Practices

### Color Usage
1. **Never hardcode colors** - Always use design tokens
2. **Use primary for brand** - CTAs, active states, icons
3. **Use secondary sparingly** - Accents, highlights
4. **Maintain contrast** - Ensure text readability

### Spacing
1. **Consistent gaps** - Use standard gap scale
2. **Section padding** - `py-20` for vertical sections
3. **Card padding** - `p-5` or `p-6` for content
4. **Button padding** - Use size variants, not custom padding

### Typography
1. **Hierarchy** - Clear heading levels
2. **Line length** - Max 65-75 characters for readability
3. **Line height** - `leading-relaxed` for body text
4. **Truncation** - Use `truncate` or `line-clamp-*` for overflow

### Shadows
1. **Cards** - `shadow-soft` default, `shadow-strong` on hover
2. **Buttons** - `shadow-md hover:shadow-lg`
3. **Modals** - `shadow-xl`
4. **Avoid excessive shadows** - Use sparingly for depth

### Animations
1. **Subtle transitions** - 300ms duration standard
2. **Hover effects** - Scale (1.02-1.05), translate-y
3. **Page load** - Staggered fade-in with delays
4. **Performance** - Use transform and opacity only

---

## Component Library

### UI Components
- `Button` - Primary interaction component
- `SearchInput` - Search with clear functionality
- `Badge` - Status indicators, tags
- `Modal` - Overlays, dialogs
- `ProfileCard` - Caregiver display cards

### Feature Components
- `Hero` - Landing page hero section
- `FeaturedServices` - Service category grid
- `TrustedBy` - Social proof section
- `FilterSidebar` - Search filters
- `DirectBookingModal` - Booking interface

### Layout Components
- `ParentLayout` - Parent user layout wrapper
- `ParentSidebar` - Parent navigation sidebar
- `Header` - Global navigation header

---

## Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
1. Design for mobile first
2. Add complexity at larger breakpoints
3. Use `hidden md:flex` patterns for progressive enhancement
4. Test at all breakpoints

### Common Patterns
- Sidebar: `hidden md:flex` (desktop only)
- Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- Text: `text-3xl md:text-5xl`
- Padding: `p-4 md:p-8`

---

## Accessibility

### Requirements
1. **Semantic HTML** - Use proper heading hierarchy
2. **ARIA labels** - For icon buttons, toggles
3. **Keyboard navigation** - All interactive elements
4. **Focus states** - Visible focus rings
5. **Color contrast** - WCAG AA minimum (4.5:1)

### Implementation
- Use `aria-label` for icon-only buttons
- Include `title` attributes for collapsed sidebar items
- Ensure all images have `alt` text
- Use semantic elements (`nav`, `main`, `aside`, `section`)

---

## Performance

### Optimization Strategies
1. **Image optimization** - Use Next.js Image component
2. **Code splitting** - Dynamic imports for large components
3. **CSS optimization** - Tailwind purge unused styles
4. **Animation performance** - Use transform and opacity only
5. **Lazy loading** - Load images and components on demand

---

## Future Considerations

### Planned Enhancements
- Dark mode support (infrastructure in place)
- Additional color themes
- Enhanced animation library
- Component documentation site
- Design token export for other platforms

---

## Resources

### Tools
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Next.js**: React framework
- **TypeScript**: Type safety

### References
- Tailwind config: `tailwind.config.ts`
- Button component: `src/components/ui/button.tsx`
- Global styles: `src/app/globals.css`
UI Design Specification: Project "Care-Connect"

1. Project Objective

Create a modern, minimalist, and animated replica of the core Care.com experience. The design focuses on "Soft Trust," utilizing glassmorphism, ample whitespace, and fluid micro-interactions to replace the traditional dense directory look.

2. Design System & Global Variables

Color Palette

Background: #F7F9FC (Soft Cream/Off-White - Reduces eye strain)

Primary Brand: #38B2AC (Soft Teal - Represents health/calm)

Secondary/Accent: #FF8C94 (Warm Coral - Use for high-priority CTAs)

Text Dark: #2D3748 (Charcoal - Softer than black)

Text Muted: #718096 (Slate Grey - For subtitles)

Glass Effect: rgba(255, 255, 255, 0.7) with backdrop-filter: blur(12px)

Typography

Headings: DM Sans or Outfit (Rounded sans-serif, friendly/approachable).

Body: Inter or Lato (Clean, high legibility).

Shapes & Spacing

Border Radius:

Cards/Containers: 24px (Soft distinct curves)

Buttons: 9999px (Pill shape)

Shadows: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01) (Diffuse, ambient shadows).

3. Step-by-Step Implementation Guide

Step 1: Global Layout & Navbar

Directives:

Sticky Navbar: Create a fixed navbar that is initially transparent.

Scroll Effect: On scroll > 50px, transition navbar background to Glass Effect (White + Blur).

Logo: Use text "Care Connect" in Primary Brand color, bold font.

Links: Right-aligned. "Log In" (Text) and "Join Now" (Button: Solid Primary Color).

Mobile: Hamburger menu triggers a full-screen slide-over with glassmorphism backdrop.

Step 2: The Hero Section (Conversational)

Directives:

Background: Use a soft gradient blob animation or a high-quality image with a white gradient overlay (fade-to-bottom).

Headline: Centered. Large (4xl+). "Care for the ones you love."

Input Component (The "Conversation"):

Instead of a grid of inputs, create one large, shadow-elevated container.

Format: "I am looking for [Dropdown: Child Care] in [Input: Zip Code]"

Style: White background, rounded-full (pill shape), massive shadow.

Button: "Search" button circular icon inside the input bar (right side).

Step 3: Service Categories (The Grid)

Directives:

Layout: CSS Grid, 3 columns (1 col on mobile).

Cards:

White background.

aspect-ratio: 1/1 or slightly taller.

Content: Large Icon centered (e.g., Baby, Senior, Paw).

Typography: Label below icon.

Interaction:

Hover: transform: translateY(-10px) scale(1.02).

Shadow: Increase shadow intensity on hover.

Step 4: "Trusted By" Section (Infinite Marquee)

Directives:

Container: Full width, overflow-hidden.

Content: A horizontal flex row of User Avatars (Circular images) + Rating Stars.

Animation: CSS Keyframe animation translating X from 0% to -100% infinitely (slow speed).

Overlay: Add a white gradient fade on the left and right edges so items fade in/out smoothly.

Step 5: The Profile Listing (Search Results)

Directives:

Container: Max-width centered.

Profile Card:

Layout: Flex-row (Image Left, Info Right).

Styling: White bg, border 1px solid #E2E8F0, shadow-sm.

Tags: Use muted background colors for tags (e.g., bg-teal-50 text-teal-700 for "CPR Certified").

Price: Large, bold, aligned top-right.

CTA: "View Profile" button hidden by default, fades in on hover.

4. Animation & Micro-interactions

Transition Library: Framer Motion (React) or CSS Transitions

Staggered Entrance: When the page loads, the Navbar, Hero Text, and Search Bar should fade up one by one (delay: 0.1, delay: 0.2, delay: 0.3).

Button Hover: Buttons should scale up slightly (scale: 1.05) and increase brightness.

Input Focus: When clicking the Search Input, the outer ring should glow with the Primary Brand color.

5. Technical Assets Required

Icons: Lucide-React or FontAwesome (use thin/outline style for elegance).

Images: Placeholders from Unsplash (Keywords: "Happy Family", "Grandmother", "Dog playing").

CSS Framework: Tailwind CSS is required for the utility-first approach (e.g., backdrop-blur-md, shadow-xl, rounded-3xl).
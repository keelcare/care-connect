# Care Platform Design System Documentation
## Complete UI/UX Design Specification

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Grid System](#spacing--grid-system)
5. [Component Library](#component-library)
6. [Icons & Illustrations](#icons--illustrations)
7. [Animations & Transitions](#animations--transitions)
8. [Page Layouts](#page-layouts)
9. [Responsive Behavior](#responsive-behavior)
10. [Accessibility Standards](#accessibility-standards)

---

## Design Philosophy

### Core Principles
- **Trust-First Design**: Every element must convey safety, reliability, and professionalism
- **Emotional Connection**: Warm, approachable design that reduces anxiety about care decisions
- **Clarity Over Complexity**: Simplified user journeys with progressive disclosure
- **Mobile-First Approach**: 70% of care seekers use mobile devices
- **Inclusive Design**: Accessible to all age groups, especially seniors and caregivers

### Visual Language
- Clean, modern interface with breathing room
- Soft, rounded corners (8px-16px radius) for approachability
- Generous white space for reduced cognitive load
- Photography over illustrations for authenticity and trust
- Subtle depth through shadows rather than heavy borders

---

## Color System

### Primary Palette

#### Brand Primary - Trust Blue
```
Primary-50:  #E3F2FD (Lightest tint for backgrounds)
Primary-100: #BBDEFB (Hover states, light accents)
Primary-200: #90CAF9
Primary-300: #64B5F6
Primary-400: #42A5F5
Primary-500: #2196F3 (Main brand color)
Primary-600: #1E88E5 (Active states)
Primary-700: #1976D2 (Dark mode primary)
Primary-800: #1565C0
Primary-900: #0D47A1 (Darkest, high emphasis)
```

**Usage**: 
- Primary CTAs (Find Care, Apply Now buttons)
- Active navigation states
- Links and interactive elements
- Progress indicators
- Primary icons

**Accessibility**: Primary-500 on white background achieves 4.5:1 contrast ratio (WCAG AA compliant)

#### Brand Secondary - Warmth Coral
```
Secondary-50:  #FFF3E0 (Light backgrounds, badges)
Secondary-100: #FFE0B2
Secondary-200: #FFCC80
Secondary-300: #FFB74D
Secondary-400: #FFA726
Secondary-500: #FF9800 (Main secondary)
Secondary-600: #FB8C00 (Hover states)
Secondary-700: #F57C00
Secondary-800: #EF6C00
Secondary-900: #E65100
```

**Usage**:
- Secondary CTAs (View Profile, Message buttons)
- Highlights and featured content
- Pricing emphasis
- Premium features badges
- Caregiver availability indicators

### Semantic Colors

#### Success - Nurturing Green
```
Success-50:  #E8F5E9
Success-500: #4CAF50 (Main success color)
Success-700: #388E3C (Dark mode)
```
**Usage**: Verified badges, completed profiles, successful bookings, positive reviews

#### Warning - Attention Amber
```
Warning-50:  #FFF8E1
Warning-500: #FFC107 (Main warning)
Warning-700: #F57F17
```
**Usage**: Profile incomplete warnings, approaching deadlines, important notices

#### Error - Alert Red
```
Error-50:  #FFEBEE
Error-500: #F44336 (Main error)
Error-700: #C62828
```
**Usage**: Form validation errors, critical alerts, safety concerns

#### Info - Calm Teal
```
Info-50:  #E0F7FA
Info-500: #00BCD4 (Main info)
Info-700: #0097A7
```
**Usage**: Informational tooltips, tips, help sections, new features

### Neutral Palette

#### Grays (Warm-tinted for comfort)
```
Gray-50:  #FAFAFA (Page backgrounds)
Gray-100: #F5F5F5 (Card backgrounds)
Gray-200: #EEEEEE (Dividers, disabled states)
Gray-300: #E0E0E0 (Borders)
Gray-400: #BDBDBD (Placeholders)
Gray-500: #9E9E9E (Secondary text)
Gray-600: #757575 (Icons)
Gray-700: #616161 (Body text)
Gray-800: #424242 (Headings)
Gray-900: #212121 (Primary text)
```

### Gradient System

#### Hero Gradients
```css
/* Trustworthy Gradient */
gradient-trust: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);

/* Warmth Gradient (CTAs) */
gradient-warmth: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);

/* Success Gradient */
gradient-success: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);

/* Premium Gradient (Paid features) */
gradient-premium: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
```

### Color Usage Guidelines

**Text on Background Combinations** (All WCAG AA compliant):
- Primary text (Gray-900) on White: 16.1:1 ratio
- Secondary text (Gray-600) on White: 4.6:1 ratio
- White text on Primary-500: 4.7:1 ratio
- White text on Secondary-600: 4.8:1 ratio

**Dark Mode Palette** (Invert with adjustments):
- Background: Gray-900 (#121212 with slight blue tint: #0A0E13)
- Surface: Gray-800 (#1E1E1E)
- Primary colors remain but use lighter tints (Primary-300 instead of Primary-500)

---

## Typography

### Font Families

#### Primary Font - Inter (Sans-serif)
**Source**: Google Fonts
**Weights Used**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
**Purpose**: UI text, body copy, navigation, buttons
**CDN Link**: 
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Why Inter?**
- Excellent screen readability at all sizes
- Clear distinction between similar characters (Il1, 0O)
- Supports extensive character sets for internationalization
- Optimized for digital interfaces
- Wide range of weights for hierarchy

#### Display Font - Manrope (Sans-serif)
**Source**: Google Fonts
**Weights Used**: 600 (Semi-Bold), 700 (Bold), 800 (Extra-Bold)
**Purpose**: Headings, hero sections, marketing content
**CDN Link**:
```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
```

**Why Manrope?**
- Modern, geometric, friendly appearance
- High x-height for better readability
- Distinctive character that stands out in headlines
- Pairs beautifully with Inter

#### Monospace Font - JetBrains Mono
**Weights Used**: 400, 500
**Purpose**: Code snippets, reference numbers, technical content
**CDN Link**:
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Typography Scale

#### Desktop Scale (16px base)
```
Display 1:     Manrope 800, 72px/80px, -0.5px letter-spacing
Display 2:     Manrope 700, 60px/68px, -0.5px letter-spacing
Heading 1:     Manrope 700, 48px/56px, -0.25px letter-spacing
Heading 2:     Manrope 600, 36px/44px, -0.25px letter-spacing
Heading 3:     Manrope 600, 28px/36px, 0px letter-spacing
Heading 4:     Inter 600, 24px/32px, 0px letter-spacing
Heading 5:     Inter 600, 20px/28px, 0px letter-spacing
Heading 6:     Inter 600, 18px/24px, 0px letter-spacing
Body Large:    Inter 400, 18px/28px, 0px letter-spacing
Body:          Inter 400, 16px/24px, 0px letter-spacing
Body Small:    Inter 400, 14px/20px, 0px letter-spacing
Caption:       Inter 500, 12px/16px, 0.5px letter-spacing
Overline:      Inter 600, 12px/16px, 1px letter-spacing (uppercase)
Button Large:  Inter 600, 18px/24px, 0.25px letter-spacing
Button Medium: Inter 600, 16px/24px, 0.25px letter-spacing
Button Small:  Inter 600, 14px/20px, 0.25px letter-spacing
```

#### Mobile Scale (14px base - scales down)
```
Display 1:     Manrope 800, 48px/56px
Display 2:     Manrope 700, 40px/48px
Heading 1:     Manrope 700, 36px/44px
Heading 2:     Manrope 600, 28px/36px
Heading 3:     Manrope 600, 24px/32px
Heading 4:     Inter 600, 20px/28px
Body Large:    Inter 400, 16px/24px
Body:          Inter 400, 14px/22px
Body Small:    Inter 400, 13px/20px
Caption:       Inter 500, 11px/16px
```

#### Tablet Scale (15px base - intermediate)
Uses proportional scaling between mobile and desktop

### Typography Usage Guidelines

**Headings Hierarchy**:
- Display 1-2: Hero sections, landing page headers
- H1: Page titles
- H2: Major section headings
- H3: Sub-sections
- H4-H6: Card titles, component headers

**Body Text**:
- Body Large: Introduction paragraphs, important descriptions
- Body: Default body text, form labels
- Body Small: Secondary information, metadata, timestamps

**Special Cases**:
- Caption: Image captions, fine print, helper text
- Overline: Category labels, tags, section labels
- Button: All clickable button text

**Line Length**: 
- Optimal: 60-75 characters per line
- Maximum: 90 characters per line
- Mobile: 40-60 characters per line

**Paragraph Spacing**: 
- Bottom margin: 1.5em
- Between sections: 2.5em

---

## Spacing & Grid System

### Spacing Scale (8pt Grid System)

**Base Unit**: 8px (0.5rem)

```
Space-0:   0px
Space-1:   4px   (0.25rem) - Micro spacing
Space-2:   8px   (0.5rem)  - Tight spacing
Space-3:   12px  (0.75rem) - Compact spacing
Space-4:   16px  (1rem)    - Default spacing
Space-5:   20px  (1.25rem) - Comfortable spacing
Space-6:   24px  (1.5rem)  - Breathing room
Space-8:   32px  (2rem)    - Section spacing
Space-10:  40px  (2.5rem)  - Component separation
Space-12:  48px  (3rem)    - Large gaps
Space-16:  64px  (4rem)    - Major sections
Space-20:  80px  (5rem)    - Hero spacing
Space-24:  96px  (6rem)    - Extra large spacing
Space-32:  128px (8rem)    - Maximum spacing
```

### Layout Grid

#### Desktop (1440px standard, max 1920px)
```
Columns: 12
Gutter: 24px (Space-6)
Margin: 80px (Space-20)
Max Content Width: 1280px
```

#### Tablet (768px - 1024px)
```
Columns: 8
Gutter: 20px (Space-5)
Margin: 40px (Space-10)
Max Content Width: 100%
```

#### Mobile (320px - 767px)
```
Columns: 4
Gutter: 16px (Space-4)
Margin: 20px (Space-5)
Max Content Width: 100%
```

### Container Sizes
```
Container-XS:  480px  (Small cards, modals)
Container-SM:  640px  (Forms, single column)
Container-MD:  768px  (Medium content)
Container-LG:  1024px (Main content)
Container-XL:  1280px (Standard page width)
Container-2XL: 1536px (Wide layouts)
```

### Component Spacing

**Card Padding**:
- Small: Space-4 (16px)
- Medium: Space-6 (24px)
- Large: Space-8 (32px)

**Section Padding**:
- Mobile: Space-8 to Space-12 (32-48px)
- Tablet: Space-12 to Space-16 (48-64px)
- Desktop: Space-16 to Space-24 (64-96px)

**Component Gaps** (Between elements):
- Tight: Space-2 (8px)
- Normal: Space-4 (16px)
- Relaxed: Space-6 (24px)
- Loose: Space-8 (32px)

---

## Component Library

### 1. Buttons

#### Primary Button
```css
Component: PrimaryButton
Font: Inter 600, 16px
Height: 48px (Desktop), 44px (Mobile)
Padding: 12px 32px
Border-radius: 8px
Background: gradient-warmth OR Primary-500
Text Color: White
Box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3)
Transition: all 0.2s ease-in-out

States:
- Hover: Transform translateY(-2px), shadow increased
- Active: Transform translateY(0), shadow reduced
- Disabled: Opacity 0.5, cursor not-allowed
- Loading: Spinner animation, text opacity 0.6
```

**Use Cases**: Primary actions (Find Caregiver, Book Now, Create Account)

#### Secondary Button
```css
Component: SecondaryButton
Font: Inter 600, 16px
Height: 48px
Padding: 12px 32px
Border-radius: 8px
Background: Transparent
Border: 2px solid Primary-500
Text Color: Primary-500
Transition: all 0.2s ease-in-out

States:
- Hover: Background Primary-50, border Primary-600
- Active: Background Primary-100
- Disabled: Opacity 0.4
```

**Use Cases**: Secondary actions (Learn More, View Details, Cancel)

#### Tertiary/Text Button
```css
Component: TextButton
Font: Inter 600, 16px
Height: 44px
Padding: 8px 16px
Background: Transparent
Text Color: Primary-500
Underline: None initially, on hover
Transition: color 0.15s ease

States:
- Hover: Underline, color Primary-600
- Active: color Primary-700
```

**Use Cases**: Less important actions (Skip, Back, Learn More)

#### Icon Button
```css
Component: IconButton
Size: 40px × 40px (Medium), 32px × 32px (Small), 48px × 48px (Large)
Border-radius: 50%
Background: Gray-100
Icon Size: 20px (Medium)
Transition: background 0.2s ease

States:
- Hover: Background Gray-200
- Active: Background Gray-300
```

**Use Cases**: Favorite, Share, Close, Menu, Back navigation

#### Button Sizes
- Small: Height 36px, Padding 8px 20px, Font 14px
- Medium: Height 44px, Padding 10px 28px, Font 16px (Default)
- Large: Height 52px, Padding 14px 36px, Font 18px

### 2. Input Fields

#### Text Input
```css
Component: TextInput
Height: 48px (Desktop), 44px (Mobile)
Padding: 12px 16px
Border: 1px solid Gray-300
Border-radius: 8px
Font: Inter 400, 16px
Background: White
Transition: border-color 0.2s ease, box-shadow 0.2s ease

States:
- Focus: Border Primary-500, box-shadow 0 0 0 4px Primary-50
- Error: Border Error-500, box-shadow 0 0 0 4px Error-50
- Success: Border Success-500, box-shadow 0 0 0 4px Success-50
- Disabled: Background Gray-100, cursor not-allowed
```

**Label**:
- Font: Inter 500, 14px
- Color: Gray-700
- Margin-bottom: Space-2 (8px)

**Helper Text**:
- Font: Inter 400, 12px
- Color: Gray-600 (normal), Error-600 (error), Success-600 (success)
- Margin-top: Space-1 (4px)

**Required Indicator**: Red asterisk (Error-500) after label

#### Textarea
- Inherits TextInput styles
- Min-height: 120px
- Resize: vertical only
- Max-height: 400px

#### Select Dropdown
```css
Component: Select
Height: 48px
Appearance: Custom (hide native dropdown)
Icon: Chevron-down (Gray-600), 20px, right 16px
Padding: 12px 40px 12px 16px
Other: Same as TextInput

Dropdown Menu:
- Background: White
- Border: 1px solid Gray-200
- Border-radius: 8px
- Box-shadow: 0 8px 24px rgba(0,0,0,0.12)
- Max-height: 320px
- Overflow: auto
- Padding: 8px 0

Option:
- Height: 44px
- Padding: 12px 16px
- Hover: Background Gray-50
- Selected: Background Primary-50, Bold font
```

#### Checkbox
```css
Component: Checkbox
Size: 20px × 20px
Border: 2px solid Gray-400
Border-radius: 4px
Background: White
Transition: all 0.15s ease

Checked State:
- Background: Primary-500
- Border: Primary-500
- Checkmark: White, 14px

Indeterminate State:
- Background: Primary-500
- Dash: White, 10px × 2px
```

#### Radio Button
```css
Component: Radio
Size: 20px × 20px (outer circle)
Border: 2px solid Gray-400
Border-radius: 50%
Background: White

Selected State:
- Border: Primary-500
- Inner circle: Primary-500, 10px diameter
```

#### Toggle/Switch
```css
Component: Toggle
Width: 48px
Height: 24px
Border-radius: 12px
Background: Gray-300 (off), Primary-500 (on)
Transition: background 0.3s ease

Thumb:
- Size: 20px × 20px
- Background: White
- Border-radius: 50%
- Position: Left 2px (off), Right 2px (on)
- Transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Box-shadow: 0 2px 4px rgba(0,0,0,0.2)
```

#### Search Input
```css
Component: SearchInput
- Icon: Search (Gray-500), 20px, left 16px
- Padding: 12px 16px 12px 48px
- Clear button: Icon X, appears when text exists
- Other: Inherits TextInput
```

### 3. Cards

#### Profile Card (Caregiver/Family)
```css
Component: ProfileCard
Width: 100% (responsive)
Max-width: 400px
Border-radius: 12px
Background: White
Border: 1px solid Gray-200
Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
Transition: transform 0.2s ease, box-shadow 0.2s ease
Overflow: hidden

Hover State:
- Transform: translateY(-4px)
- Box-shadow: 0 8px 24px rgba(0,0,0,0.12)

Structure:
1. Image Container
   - Height: 200px
   - Object-fit: cover
   - Position: relative
   - Badge overlay (verified, premium, etc)
   
2. Content Container
   - Padding: Space-6 (24px)
   
3. Header
   - Name: Heading 5 (Inter 600, 20px)
   - Rating: 5-star display, Secondary-500
   - Location: Body Small, Gray-600, with pin icon
   
4. Description
   - Body Small, Gray-700
   - Line-clamp: 2 (show 2 lines, ellipsis)
   
5. Meta Information
   - Experience: Badge style
   - Hourly Rate: Heading 6, Primary-500
   - Availability: Status indicator
   
6. Actions
   - Button group: Primary and Secondary buttons
   - Icon buttons: Favorite, Share
```

#### Service Card (Child Care, Senior Care, etc.)
```css
Component: ServiceCard
Width: 100%
Max-width: 360px
Border-radius: 16px
Background: White
Box-shadow: 0 4px 16px rgba(0,0,0,0.08)
Overflow: hidden
Transition: all 0.3s ease

Hover:
- Transform: translateY(-6px)
- Box-shadow: 0 12px 32px rgba(0,0,0,0.15)

Structure:
1. Icon Container
   - Size: 80px × 80px
   - Border-radius: 20px
   - Background: gradient (service-specific)
   - Icon: 40px, White
   - Margin: Space-6 (24px)
   
2. Content
   - Padding: 0 Space-6 Space-6
   - Heading: Heading 4
   - Description: Body, Gray-700
   - CTA: Link or button
```

#### Testimonial Card
```css
Component: TestimonialCard
Max-width: 500px
Border-radius: 12px
Background: Gray-50
Padding: Space-8 (32px)
Border-left: 4px solid Primary-500

Structure:
1. Quote Icon
   - Size: 32px
   - Color: Primary-300
   - Margin-bottom: Space-4
   
2. Quote Text
   - Body Large
   - Color: Gray-800
   - Line-height: 1.75
   
3. Author Section
   - Display: flex
   - Gap: Space-3 (12px)
   - Avatar: 48px circle
   - Name: Heading 6
   - Role: Caption, Gray-600
```

### 4. Navigation

#### Header/Navbar
```css
Component: Header
Height: 72px (Desktop), 64px (Mobile)
Background: White
Border-bottom: 1px solid Gray-200
Position: sticky, top 0
Z-index: 100
Box-shadow: 0 2px 8px rgba(0,0,0,0.06) (on scroll)

Structure:
1. Container: Max-width Container-XL
2. Logo: Height 40px, left aligned
3. Nav Menu: Center (Desktop), Hidden (Mobile)
4. Actions: Right aligned
   - Notifications icon badge
   - Messages icon badge
   - User menu dropdown
5. Mobile Menu: Hamburger icon

Nav Link:
- Font: Inter 500, 16px
- Color: Gray-700
- Padding: 8px 16px
- Border-radius: 6px
- Hover: Background Gray-50, Color Primary-500
- Active: Background Primary-50, Color Primary-600, Bold
```

#### Mobile Navigation (Bottom Bar)
```css
Component: BottomNav
Height: 64px
Background: White
Border-top: 1px solid Gray-200
Position: fixed, bottom 0
Z-index: 100
Box-shadow: 0 -2px 8px rgba(0,0,0,0.06)

Nav Item:
- Width: Equal distribution (5 items = 20% each)
- Padding: 8px
- Text-align: center
- Icon: 24px, Gray-600
- Label: Caption, Gray-600
- Active: Icon & Label Primary-500, Bold
```

#### Breadcrumbs
```css
Component: Breadcrumbs
Font: Body Small
Color: Gray-600
Separator: "/" or ">" icon, Gray-400
Spacing: Space-2 (8px) between items

Current Page: 
- Color: Gray-900
- Bold
- Not clickable

Links:
- Hover: Color Primary-500, Underline
```

### 5. Modals & Dialogs

#### Modal
```css
Component: Modal
Max-width: 600px (Small), 800px (Medium), 1000px (Large)
Max-height: 90vh
Border-radius: 16px
Background: White
Box-shadow: 0 24px 48px rgba(0,0,0,0.2)
Padding: 0
Overflow: hidden

Backdrop:
- Background: rgba(0,0,0,0.5)
- Backdrop-filter: blur(4px)
- Animation: fadeIn 0.2s ease

Structure:
1. Header
   - Padding: Space-6 (24px)
   - Border-bottom: 1px solid Gray-200
   - Title: Heading 4
   - Close button: Top right, Icon button
   
2. Body
   - Padding: Space-6 (24px)
   - Max-height: calc(90vh - 180px)
   - Overflow-y: auto
   
3. Footer
   - Padding: Space-6 (24px)
   - Border-top: 1px solid Gray-200
   - Button group: Right aligned
   - Gap: Space-3 (12px)

Animation:
- Enter: slideUp + fadeIn (0.3s cubic-bezier)
- Exit: slideDown + fadeOut (0.2s ease)
```

#### Alert Dialog
```css
Component: AlertDialog
Max-width: 400px
Border-radius: 12px
Padding: Space-8 (32px)

Icon (top center):
- Size: 56px
- Success: Success-500
- Warning: Warning-500
- Error: Error-500
- Info: Info-500

Title: Heading 4, center aligned
Message: Body, center aligned, Gray-700
Buttons: Full width, stacked on mobile
```

#### Toast/Snackbar
```css
Component: Toast
Min-width: 320px
Max-width: 480px
Border-radius: 8px
Background: Gray-900
Color: White
Padding: Space-4 Space-5
Box-shadow: 0 6px 16px rgba(0,0,0,0.2)
Position: fixed, bottom 24px, center
Animation: slideUp + fadeIn

Variants:
- Success: Border-left 4px Success-500
- Error: Border-left 4px Error-500
- Warning: Border-left 4px Warning-500
- Info: Border-left 4px Info-500

Auto-dismiss: 5 seconds
Close button: Optional, right side
```

### 6. Lists & Tables

#### List Item
```css
Component: ListItem
Height: auto, min-height 64px
Padding: Space-4 (16px)
Border-bottom: 1px solid Gray-200
Display: flex, align-items center
Transition: background 0.15s ease

Hover:
- Background: Gray-50
- Cursor: pointer (if clickable)

Structure:
- Leading: Avatar or icon (40px)
- Content: Flex-grow 1, padding Space-3
- Trailing: Action or chevron icon
```

#### Data Table
```css
Component: DataTable
Width: 100%
Border: 1px solid Gray-200
Border-radius: 8px
Background: White
Overflow: hidden

Table Header:
- Background: Gray-50
- Font: Inter 600, 14px, Uppercase
- Color: Gray-700
- Padding: Space-3 Space-4
- Border-bottom: 2px solid Gray-300
- Sticky: top 0 (on scroll)

Table Row:
- Padding: Space-3 Space-4
- Border-bottom: 1px solid Gray-200
- Hover: Background Gray-50
- Transition: background 0.15s ease

Table Cell:
- Font: Body Small
- Color: Gray-800
- Vertical-align: middle

Sorting:
- Icon: Arrow up/down, Gray-500
- Active sort: Icon Primary-500
```

### 7. Badges & Tags

#### Badge
```css
Component: Badge
Height: 24px
Padding: 4px 12px
Border-radius: 12px
Font: Inter 600, 12px
Line-height: 16px
Display: inline-flex
Align-items: center

Variants:
- Default: Background Gray-200, Color Gray-800
- Primary: Background Primary-100, Color Primary-700
- Success: Background Success-100, Color Success-700
- Warning: Background Warning-100, Color Warning-700
- Error: Background Error-100, Color Error-700

Sizes:
- Small: Height 20px, Font 11px, Padding 2px 8px
- Large: Height 28px, Font 13px, Padding 6px 16px
```

#### Status Indicator
```css
Component: StatusIndicator
Size: 8px × 8px
Border-radius: 50%
Display: inline-block
Margin-right: Space-2

With label:
- Font: Caption
- Display: inline-flex
- Gap: Space-2

States:
- Online: Background Success-500
- Away: Background Warning-500
- Busy: Background Error-500
- Offline: Background Gray-400
```

### 8. Progress Indicators

#### Progress Bar
```css
Component: ProgressBar
Height: 8px (Thin), 12px (Medium), 16px (Thick)
Border-radius: Height / 2
Background: Gray-200
Overflow: hidden

Fill:
- Background: gradient-trust OR Primary-500
- Height: 100%
- Border-radius: inherit
- Transition: width 0.3s ease-in-out

With Label:
- Position: above bar
- Font: Caption
- Color: Gray-600
- Display: flex, justify-between
```

#### Circular Progress
```css
Component: CircularProgress
Size: 40px (Small), 60px (Medium), 80px (Large)
Stroke-width: 4px

Circle Track:
- Stroke: Gray-200
- Fill: none

Circle Fill:
- Stroke: Primary-500 OR gradient
- Fill: none
- Stroke-linecap: round
- Animation: rotate 1.4s linear infinite

Percentage Label:
- Position: center
- Font: Inter 600
- Size: 50% of circle size
```

#### Spinner
```css
Component: Spinner
Size: 24px (Small), 40px (Medium), 60px (Large)
Border: 3px solid Gray-200
Border-top-color: Primary-500
Border-radius: 50%
Animation: spin 0.8s linear infinite

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 9. Forms

#### Form Layout
```css
Component: Form
Max-width: 600px
Padding: Space-6 (24px)
Background: White
Border-radius: 12px

Form Group:
- Margin-bottom: Space-6 (24px)
- Last child: Margin-bottom 0

Form Section:
- Margin-bottom: Space-8 (32px)
- Section Title: Heading 5
- Section Description: Body Small, Gray-600
- Divider: Border-top 1px solid Gray-200, margin Space-6
```

#### Input Group (With Icon/Button)
```css
Component: InputGroup
Display: flex
Position: relative

Input:
- Flex: 1
- With leading icon: Padding-left 48px
- With trailing button: Border-radius 8px 0 0 8px

Icon:
- Position: absolute
- Left: 16px (leading), Right: 16px (trailing)
- Top: 50%, Transform: translateY(-50%)
- Size: 20px
- Color: Gray-500

Attached Button:
- Border-radius: 0 8px 8px 0
- Border-left: none
```

#### Form Validation
**Real-time validation**: On blur or after first submit attempt
**Error display**: Below field, Error-600 color, with error icon
**Success display**: Checkmark icon in field, Success-500 color

### 10. Images & Media

#### Avatar
```css
Component: Avatar
Size: 32px (XS), 40px (SM), 48px (MD), 64px (LG), 80px (XL), 120px (2XL)
Border-radius: 50%
Object-fit: cover
Background: Gray-200 (placeholder)

With Status:
- Status indicator: Bottom-right corner
- Size: 25% of avatar size
- Border: 2px solid White

Fallback:
- Initials: Center aligned, Inter 600
- Background: gradient or solid color (user-specific hash)
- Text color: White
```

#### Image Container
```css
Component: ImageContainer
Position: relative
Overflow: hidden
Background: Gray-100

Aspect Ratios:
- Square: 1:1
- Portrait: 3:4
- Landscape: 4:3
- Wide: 16:9
- Ultra-wide: 21:9

Image:
- Width: 100%
- Height: 100%
- Object-fit: cover
- Transition: transform 0.3s ease

Hover (if interactive):
- Transform: scale(1.05)

Overlay (optional):
- Position: absolute, bottom 0
- Background: linear-gradient(to top, rgba(0,0,0,0.6), transparent)
- Padding: Space-4 Space-5
- Color: White
```

#### Gallery/Carousel
```css
Component: Gallery
Width: 100%
Position: relative

Image Container:
- Display: flex or grid
- Gap: Space-2 (8px)

Navigation Arrows:
- Position: absolute, top 50%
- Size: 48px × 48px
- Background: White
- Border-radius: 50%
- Box-shadow: 0 4px 12px rgba(0,0,0,0.15)
- Icon: Chevron, 24px, Gray-700
- Hover: Background Gray-50

Indicators (Dots):
- Size: 8px × 8px
- Border-radius: 50%
- Background: Gray-400
- Active: Background Primary-500, Width 24px (pill shape)
- Gap: Space-2
```

### 11. Dropdowns & Popovers

#### Dropdown Menu
```css
Component: DropdownMenu
Min-width: 200px
Max-width: 320px
Border-radius: 8px
Background: White
Border: 1px solid Gray-200
Box-shadow: 0 8px 24px rgba(0,0,0,0.12)
Padding: Space-2 (8px) 0
Z-index: 1000

Menu Item:
- Height: 40px
- Padding: 8px 16px
- Font: Body Small
- Color: Gray-800
- Display: flex, align-items center
- Gap: Space-3 (12px)
- Border-radius: 4px
- Transition: background 0.1s ease

Menu Item Hover:
- Background: Gray-50
- Cursor: pointer

Menu Item Active:
- Background: Primary-50
- Color: Primary-600

Divider:
- Height: 1px
- Background: Gray-200
- Margin: Space-2 0

Menu Icon:
- Size: 20px
- Color: Gray-600
```

#### Popover/Tooltip
```css
Component: Popover
Max-width: 300px
Border-radius: 8px
Background: Gray-900
Color: White
Padding: Space-3 Space-4
Box-shadow: 0 4px 16px rgba(0,0,0,0.2)
Font: Body Small
Line-height: 1.5

Arrow:
- Size: 8px
- Color: Gray-900
- Position: adjusts based on placement

Animation:
- Fade in: 0.15s ease
- Scale from 0.95 to 1

Variants:
- Default: Dark background (above)
- Light: White background, Gray-900 text, Border Gray-200
```

### 12. Tabs

#### Tab Navigation
```css
Component: Tabs
Display: flex
Border-bottom: 2px solid Gray-200
Gap: Space-4 (16px)

Tab:
- Padding: Space-3 Space-4 (12px 16px)
- Font: Inter 600, 16px
- Color: Gray-600
- Border-bottom: 3px solid transparent
- Margin-bottom: -2px
- Transition: all 0.2s ease
- Cursor: pointer

Tab Hover:
- Color: Gray-900

Tab Active:
- Color: Primary-500
- Border-bottom-color: Primary-500

Tab Content:
- Padding: Space-6 0
- Animation: fadeIn 0.3s ease
```

### 13. Accordion

```css
Component: Accordion
Border: 1px solid Gray-200
Border-radius: 8px
Background: White
Overflow: hidden

Accordion Item:
- Border-bottom: 1px solid Gray-200
- Last child: Border-bottom none

Accordion Header:
- Padding: Space-5 Space-6 (20px 24px)
- Display: flex, justify-between, align-items center
- Cursor: pointer
- Transition: background 0.15s ease
- Font: Inter 600, 16px
- Color: Gray-800

Header Hover:
- Background: Gray-50

Icon:
- Size: 20px
- Color: Gray-600
- Transition: transform 0.3s ease
- Expanded: Transform rotate(180deg)

Accordion Content:
- Padding: 0 Space-6 Space-5
- Font: Body
- Color: Gray-700
- Max-height: 0 (collapsed)
- Overflow: hidden
- Transition: max-height 0.3s ease, padding 0.3s ease

Content Expanded:
- Max-height: 1000px (or auto with JS)
- Padding: 0 Space-6 Space-5
```

### 14. Search & Filters

#### Filter Chip
```css
Component: FilterChip
Height: 36px
Padding: 8px 16px
Border-radius: 18px
Border: 1px solid Gray-300
Background: White
Font: Inter 500, 14px
Color: Gray-700
Display: inline-flex
Align-items: center
Gap: Space-2
Cursor: pointer
Transition: all 0.15s ease

Hover:
- Border-color: Primary-300
- Background: Primary-50

Selected:
- Background: Primary-500
- Border-color: Primary-500
- Color: White

With Close Icon:
- Icon: X, 16px
- Hover on icon: Opacity 0.7
```

#### Filter Panel
```css
Component: FilterPanel
Width: 320px (Desktop), 100% (Mobile)
Background: White
Border: 1px solid Gray-200
Border-radius: 12px
Padding: Space-6 (24px)
Max-height: 80vh
Overflow-y: auto

Filter Group:
- Margin-bottom: Space-6
- Last child: Margin-bottom 0

Filter Title:
- Font: Inter 600, 16px
- Color: Gray-800
- Margin-bottom: Space-3

Filter Options:
- Display: flex, flex-direction column
- Gap: Space-3

Filter Footer:
- Margin-top: Space-6
- Padding-top: Space-6
- Border-top: 1px solid Gray-200
- Display: flex, justify-between
```

### 15. Pagination

```css
Component: Pagination
Display: flex
Gap: Space-2 (8px)
Align-items: center

Page Button:
- Size: 40px × 40px
- Border-radius: 8px
- Background: White
- Border: 1px solid Gray-300
- Font: Inter 600, 14px
- Color: Gray-700
- Transition: all 0.15s ease

Page Button Hover:
- Border-color: Primary-500
- Color: Primary-500

Page Button Active:
- Background: Primary-500
- Border-color: Primary-500
- Color: White

Ellipsis:
- Color: Gray-500

Nav Buttons (Prev/Next):
- Padding: 8px 16px
- Width: auto
- Display: flex, align-items center
- Gap: Space-2

Disabled State:
- Opacity: 0.4
- Cursor: not-allowed
```

---

## Icons & Illustrations

### Icon System

**Icon Library**: Lucide React (recommended) or Heroicons
**CDN/Install**: 
```bash
npm install lucide-react
# or
npm install @heroicons/react
```

#### Icon Sizes
```
XS:  16px (Inline text icons)
SM:  20px (Buttons, inputs)
MD:  24px (Default UI icons)
LG:  32px (Feature highlights)
XL:  40px (Section headers)
2XL: 48px (Hero sections)
3XL: 64px (Empty states, large features)
```

#### Icon Colors
- Default: Gray-600
- Primary: Primary-500
- Success: Success-500
- Warning: Warning-500
- Error: Error-500
- Disabled: Gray-400
- On Color: White (when on colored backgrounds)

#### Icon Usage Guidelines

**Navigation Icons**:
- Home: House/Home
- Search: Search/MagnifyingGlass
- Profile: User/UserCircle
- Messages: Mail/Envelope
- Notifications: Bell
- Settings: Cog/Settings
- Menu: Menu/Bars3
- Close: X/XMark
- Back: ChevronLeft/ArrowLeft
- Forward: ChevronRight/ArrowRight

**Action Icons**:
- Add: Plus/PlusCircle
- Edit: Pencil/PencilSquare
- Delete: Trash/Trash2
- Save: Check/CheckCircle
- Share: Share/Share2
- Favorite: Heart (outline/filled)
- Download: Download/ArrowDownTray
- Upload: Upload/ArrowUpTray
- Filter: Filter/Funnel
- Sort: ArrowsUpDown

**Status Icons**:
- Success: CheckCircle (Success-500)
- Error: XCircle (Error-500)
- Warning: AlertTriangle (Warning-500)
- Info: InfoCircle (Info-500)
- Verified: BadgeCheck (Primary-500)

**Service Category Icons**:
- Child Care: Baby/Users
- Senior Care: Heart/HeartPulse
- Pet Care: PawPrint
- Housekeeping: Home/Sparkles
- Tutoring: BookOpen/GraduationCap
- Special Needs: Heart/Shield

#### Illustration Style

**Illustration Library**: unDraw (customizable) or Storyset
**Color Scheme**: Match brand primary colors
**Style**: Friendly, inclusive, diverse representation
**Format**: SVG for scalability

**Usage Areas**:
- Empty states
- Onboarding screens
- Error pages (404, 500)
- Feature highlights
- Hero sections (subtle background)

**Size Guidelines**:
- Mobile: Max 240px width
- Tablet: Max 320px width
- Desktop: Max 480px width

---

## Animations & Transitions

### Animation Principles

1. **Purposeful**: Every animation should have a reason (feedback, guidance, delight)
2. **Fast**: Keep under 300ms for functional animations
3. **Natural**: Use easing functions that mimic physics
4. **Consistent**: Same animation types use same timing and easing

### Easing Functions

```css
/* Standard easing */
ease-standard: cubic-bezier(0.4, 0, 0.2, 1)

/* Deceleration (entering) */
ease-decelerate: cubic-bezier(0, 0, 0.2, 1)

/* Acceleration (exiting) */
ease-accelerate: cubic-bezier(0.4, 0, 1, 1)

/* Sharp (quick, purposeful) */
ease-sharp: cubic-bezier(0.4, 0, 0.6, 1)

/* Bounce (playful elements) */
ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Animation Durations

```
Instant:    0ms      (Immediate feedback)
Quick:      100ms    (Hover states, simple transitions)
Fast:       200ms    (Button clicks, toggles)
Standard:   300ms    (Default, cards, modals)
Moderate:   400ms    (Complex transitions, page changes)
Slow:       500ms    (Large movements, page transitions)
Emphasis:   600-800ms (Special attention, celebrations)
```

### Common Animations

#### Fade In/Out
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

Animation: fadeIn 300ms ease-standard
```

#### Slide In (From directions)
```css
@keyframes slideInUp {
  from { 
    opacity: 0;
    transform: translateY(24px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from { 
    opacity: 0;
    transform: translateY(-24px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from { 
    opacity: 0;
    transform: translateX(-24px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

Animation: slideInUp 400ms ease-decelerate
```

#### Scale & Fade
```css
@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.9);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

Animation: scaleIn 300ms ease-standard
```

#### Bounce
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

Animation: bounce 600ms ease-bounce
```

#### Shimmer (Loading placeholder)
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

Background: linear-gradient(
  90deg, 
  Gray-200 0%, 
  Gray-100 50%, 
  Gray-200 100%
)
Background-size: 1000px 100%
Animation: shimmer 2s infinite linear
```

#### Pulse (Attention grabber)
```css
@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
  }
}

Animation: pulse 2s infinite ease-standard
```

#### Spin (Loaders)
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

Animation: spin 800ms infinite linear
```

### Micro-interactions

#### Button Press
```css
Button:active {
  transform: scale(0.98);
  transition: transform 100ms ease-standard;
}
```

#### Card Lift
```css
Card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  transition: all 300ms ease-standard;
}
```

#### Input Focus
```css
Input:focus {
  border-color: Primary-500;
  box-shadow: 0 0 0 4px Primary-50;
  transition: all 200ms ease-standard;
}
```

#### Link Hover
```css
Link {
  position: relative;
  text-decoration: none;
}

Link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: Primary-500;
  transition: width 200ms ease-standard;
}

Link:hover::after {
  width: 100%;
}
```

#### Toggle Switch
```css
Toggle input:checked ~ .thumb {
  transform: translateX(24px);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Page Transitions

#### Route Change
```css
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

Animation: pageEnter 400ms ease-decelerate
```

#### Modal Enter/Exit
```css
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

Animation: modalEnter 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Loading States

#### Skeleton Screen
```css
Component: Skeleton
Background: Gray-200
Border-radius: 4px
Position: relative
Overflow: hidden

::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.5),
    transparent
  );
  animation: shimmer 1.5s infinite;
}
```

### Success/Celebration Animations

#### Checkmark Animation
```css
@keyframes checkmark {
  0% {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

SVG path {
  stroke-dasharray: 100;
  animation: checkmark 600ms ease-standard forwards;
}
```

#### Confetti (Use library like canvas-confetti)
Trigger on: Booking confirmed, Profile completed, First review received

### Scroll Animations

**Scroll-triggered animations**: Use Intersection Observer API
**Stagger children**: Delay 50-100ms between each item
**Parallax**: Subtle, max 20% speed difference

---

## Page Layouts

### 1. Landing Page / Homepage

#### Hero Section
```
Layout: Full-width, min-height 600px (Desktop), 500px (Mobile)
Background: gradient-trust OR hero image with overlay
Content: Center-aligned

Structure:
- Heading: Display 1, White text
- Subheading: Body Large, White text with 80% opacity
- CTA Group: 2 buttons, Primary + Secondary (outline white)
- Search Bar: Large, prominent (if applicable)
- Trust Indicators: Logos, stats, testimonials (below fold)

Spacing:
- Vertical padding: Space-24 (96px) Desktop, Space-16 Mobile
- Content max-width: Container-LG (1024px)
```

#### Featured Services Section
```
Layout: Grid
Columns: 4 (Desktop), 2 (Tablet), 1 (Mobile)
Gap: Space-6 (24px)
Padding: Space-16 (64px) vertical

Cards: Service Cards (see Component Library)
Background: White or Gray-50
```

#### How It Works
```
Layout: 3-column (Desktop), 1-column (Mobile)
Style: Timeline or stepped process
Icons: 64px, gradient backgrounds
Text: Centered under icons
Numbers: Large, Primary-500, Manrope 800
```

#### Testimonials
```
Layout: Carousel or 3-column grid
Cards: Testimonial Cards
Background: Gray-50
Padding: Space-16 vertical
```

#### CTA Section (Above footer)
```
Layout: Full-width, center-aligned
Background: gradient-warmth
Height: 400px
Content: White text, large heading, CTA button
```

### 2. Search Results Page

```
Layout: Sidebar + Main content

Desktop:
- Sidebar: 320px fixed width, left side
- Main: Flex-grow 1, min-width 0
- Gap: Space-8 (32px)

Mobile:
- Sidebar: Bottom sheet/modal
- Main: Full width
- Filter button: Fixed bottom

Header:
- Search bar: Full width
- Results count: Body Small, Gray-600
- Sort dropdown: Right-aligned
- View toggle: Grid/List view

Results Grid:
- 3 columns (Desktop large), 2 columns (Desktop small/Tablet), 1 column (Mobile)
- Gap: Space-6 (24px)
- Cards: Profile Cards

Pagination:
- Bottom center
- Spacing: Space-8 above
```

### 3. Profile Page (Caregiver/Family)

```
Layout: Two-column (Desktop), Single-column (Mobile)

Left Column (Main): 66% width
- Profile Header
  - Avatar: 120px
  - Name: Heading 2
  - Location, Rating, Reviews count
  - Action buttons: Message, Favorite, Share
  - Verified badges
  
- About Section
  - Heading 4
  - Body text, multi-paragraph
  
- Experience Section
  - Timeline/List of jobs
  - Duration, description
  
- Skills & Certifications
  - Badge display
  
- Photos/Gallery
  - Grid 3x3, lightbox on click
  
- Reviews Section
  - Average rating display
  - Review cards list
  - Pagination

Right Column (Sidebar): 33% width, sticky top 88px
- Availability card
- Pricing card
- Response time
- Quick stats
- CTA: Book/Contact button (sticky)
- Background check status
- Safety features

Mobile:
- Single column
- Sticky CTA bar bottom
- Sidebar content after main content
```

### 4. Booking/Checkout Page

```
Layout: Two-column, Main + Summary

Main (Left): 66% width
- Progress indicator (steps)
- Step 1: Service details form
- Step 2: Schedule selection
- Step 3: Payment information
- Step 4: Review & confirm

Summary (Right): 33% width, sticky
- Caregiver/service summary card
- Selected date/time
- Price breakdown
- Total (emphasized)
- Promo code input
- CTA: Proceed/Confirm button

Mobile:
- Single column
- Summary collapses to expandable section
- Sticky bottom bar with total + CTA
```

### 5. Dashboard (User Account)

```
Layout: Sidebar navigation + Main content

Sidebar: 280px, fixed
- User profile summary
- Navigation menu (stacked links)
- Logout button (bottom)

Main Content: Flex-grow 1
- Page header with title
- Quick stats cards (if applicable)
- Main content area
- Varies by section

Sections:
- Overview/Home
- Messages/Inbox
- Bookings/Jobs
- Calendar
- Payments
- Settings
- Help

Mobile:
- Bottom navigation (5 items)
- Hamburger menu for full navigation
- Content full width
```

### 6. Messaging/Chat Page

```
Layout: Three-column (Desktop), Full-width (Mobile)

Conversations List: 320px (Desktop left column)
- Search bar top
- Conversation items (sorted by recent)
- Unread indicators
- Scroll with infinite load

Chat Window: Flex-grow 1 (Center)
- Header: Contact info, video/call buttons
- Messages area: Scroll to bottom, infinite scroll up
- Input area: Text input + attachments + send
- Typing indicator

Contact Info: 320px (Desktop right column)
- Profile summary
- Quick actions
- Shared bookings/history
- Media/files

Mobile:
- Conversations list view
- Tap opens chat (full screen)
- Back button to list
```

### 7. Error Pages (404, 500, etc.)

```
Layout: Centered, max-width 600px

Content:
- Illustration: 320px
- Error code: Display 2, Gray-400
- Heading: Heading 2, Error message
- Description: Body, Gray-600
- CTA: Primary button (Go Home / Try Again)
- Secondary links: Help, Contact Support

Spacing: Generous vertical spacing (Space-12)
```

---

## Responsive Behavior

### Breakpoints

```css
/* Mobile First Approach */
xs: 320px   /* Small phones */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Responsive Patterns

#### Navigation
- **Desktop**: Horizontal navbar, all items visible
- **Tablet**: Condensed navbar, some items in dropdown
- **Mobile**: Hamburger menu + bottom navigation

#### Grid Layouts
```
Desktop (lg):   4 columns
Tablet (md):    2-3 columns
Mobile (sm):    1-2 columns
Mobile (xs):    1 column
```

#### Typography Scaling
- **Desktop**: Full scale (as defined)
- **Tablet**: 95% scale
- **Mobile**: 90% scale with adjusted line heights

#### Spacing Adjustments
```
Desktop:    Full spacing scale
Tablet:     85% of desktop
Mobile:     70% of desktop (minimum Space-4)
```

#### Images
- **Desktop**: Full resolution, larger sizes
- **Tablet**: Medium resolution, scaled sizes
- **Mobile**: Optimized/compressed, smaller sizes
- Use `srcset` and responsive images

#### Touch Targets
- **Minimum size**: 44px × 44px (WCAG 2.1)
- **Recommended**: 48px × 48px
- **Spacing between targets**: Min 8px

#### Modals
- **Desktop**: Centered overlay, max-width
- **Tablet**: Larger modals may go full-screen
- **Mobile**: Always full-screen or bottom sheet

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal text** (under 18px): Minimum 4.5:1 ratio
- **Large text** (18px+ or 14px+ bold): Minimum 3:1 ratio
- **UI components and graphics**: Minimum 3:1 ratio
- **Test all color combinations** with tools like WebAIM Contrast Checker

#### Keyboard Navigation
- **All interactive elements** must be keyboard accessible
- **Visible focus indicators**: 2px outline, Primary-500, offset 2px
- **Tab order**: Logical, follows visual flow
- **Skip links**: "Skip to main content" at top
- **Escape key**: Closes modals/dropdowns

#### Screen Readers
- **Semantic HTML**: Use proper heading hierarchy (h1-h6)
- **ARIA labels**: For icons, buttons without text
- **Alt text**: Descriptive for images, empty for decorative
- **Form labels**: Associated with inputs
- **Live regions**: For dynamic content updates
- **Focus management**: Move focus appropriately (e.g., to modal on open)

#### Forms
- **Labels**: Visible and associated with inputs
- **Error messages**: Announced to screen readers
- **Required fields**: Indicated visually and programmatically
- **Input types**: Use appropriate HTML5 types
- **Autocomplete**: Enable for appropriate fields

#### Interactive Elements
- **Minimum target size**: 44px × 44px
- **Hover states**: Must also work with focus
- **Active states**: Clear visual feedback
- **Disabled states**: Clearly distinguishable

#### Content
- **Headings**: Logical hierarchy, no skipped levels
- **Lists**: Use proper markup (ul, ol, dl)
- **Tables**: Header cells, captions, summary
- **Language**: Declared in HTML lang attribute
- **Reading order**: Matches visual order

#### Media
- **Video**: Captions and transcripts
- **Audio**: Transcripts provided
- **Animations**: Respect `prefers-reduced-motion`
- **Autoplay**: Disabled or user-controlled

#### Testing Requirements
- **Keyboard only**: Navigate entire site
- **Screen reader**: Test with NVDA, JAWS, or VoiceOver
- **Color blindness**: Test with simulator tools
- **Zoom**: Test at 200% zoom level
- **Automated tools**: Axe, WAVE, Lighthouse

---

## Implementation Notes

### Recommended UI Libraries

#### React Component Libraries
1. **shadcn/ui** (Recommended)
   - Accessible components
   - Customizable with Tailwind CSS
   - Copy-paste approach
   
2. **Material-UI (MUI)**
   - Comprehensive components
   - Good accessibility
   - Customizable theming

3. **Chakra UI**
   - Accessible by default
   - Excellent TypeScript support
   - Composable components

#### CSS Framework
**Tailwind CSS** (Primary choice)
- Utility-first approach
- Easy customization
- Excellent documentation
- JIT compiler for performance

#### Animation Libraries
1. **Framer Motion** - React animations
2. **GSAP** - Complex animations
3. **React Spring** - Physics-based animations

#### Icon Libraries
1. **Lucide React** (Primary)
2. **Heroicons**
3. **React Icons**

### Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary-50: #E3F2FD;
  --color-primary-500: #2196F3;
  /* ... all color scales */
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  /* ... all spacing values */
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Manrope', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Breakpoints (for JS) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        secondary: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
        success: {
          50: '#E8F5E9',
          500: '#4CAF50',
          700: '#388E3C',
        },
        warning: {
          50: '#FFF8E1',
          500: '#FFC107',
          700: '#F57F17',
        },
        error: {
          50: '#FFEBEE',
          500: '#F44336',
          700: '#C62828',
        },
        info: {
          50: '#E0F7FA',
          500: '#00BCD4',
          700: '#0097A7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-1': ['72px', { lineHeight: '80px', letterSpacing: '-0.5px' }],
        'display-2': ['60px', { lineHeight: '68px', letterSpacing: '-0.5px' }],
        'h1': ['48px', { lineHeight: '56px', letterSpacing: '-0.25px' }],
        'h2': ['36px', { lineHeight: '44px', letterSpacing: '-0.25px' }],
        'h3': ['28px', { lineHeight: '36px' }],
        'h4': ['24px', { lineHeight: '32px' }],
        'h5': ['20px', { lineHeight: '28px' }],
        'h6': ['18px', { lineHeight: '24px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'button': '0 4px 12px rgba(33, 150, 243, 0.3)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideInUp': 'slideInUp 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

---

## Additional Features & Components

### 1. Rating & Review System

#### Star Rating Display
```css
Component: StarRating
Display: inline-flex
Gap: Space-1 (4px)

Star:
- Size: 20px (Default), 16px (Small), 24px (Large)
- Filled: Secondary-500
- Empty: Gray-300
- Half-star: Gradient mask

With Count:
- Font: Body Small
- Color: Gray-600
- Format: "(123 reviews)"
```

#### Review Card
```css
Component: ReviewCard
Padding: Space-6 (24px)
Border: 1px solid Gray-200
Border-radius: 12px
Background: White

Structure:
1. Header
   - Avatar: 48px
   - Name: Heading 6
   - Date: Caption, Gray-600
   - Star rating: Right-aligned
   
2. Review Text
   - Body
   - Max-height: 150px (collapsed)
   - "Read more" link if longer
   
3. Helpful Section
   - "Was this helpful?" text
   - Thumbs up/down buttons
   - Count display
```

### 2. Calendar/Date Picker

```css
Component: DatePicker
Width: 320px
Border-radius: 12px
Background: White
Box-shadow: 0 8px 24px rgba(0,0,0,0.12)
Padding: Space-4

Header:
- Month/Year display: Heading 6, center
- Nav arrows: Left/Right, Icon buttons

Calendar Grid:
- 7 columns (days of week)
- Day names: Caption, Gray-600, center
- Date cells: 40px × 40px, center aligned

Date Cell:
- Normal: Gray-800
- Hover: Background Gray-100, Border-radius 50%
- Selected: Background Primary-500, Color White, Border-radius 50%
- Today: Border 2px Primary-500
- Disabled: Color Gray-400, cursor not-allowed
- Range: Background Primary-50 (between dates)

Range Selection:
- Start/End: Full circle, Primary-500
- Between: Rectangle, Primary-50
```

### 3. File Upload

```css
Component: FileUpload
Min-height: 200px
Border: 2px dashed Gray-300
Border-radius: 12px
Background: Gray-50
Padding: Space-8
Text-align: center
Cursor: pointer
Transition: all 0.2s ease

Hover/Drag-over:
- Border-color: Primary-500
- Background: Primary-50

Content:
- Icon: Upload, 48px, Primary-500
- Heading: "Drag & drop files here"
- Subtext: "or click to browse"
- Supported formats: Caption, Gray-600

File Preview:
- Display: Grid
- Columns: 4 (Desktop), 2 (Mobile)
- Gap: Space-4

File Item:
- Size: 100px × 100px
- Border-radius: 8px
- Position: relative
- Thumbnail or file icon
- Remove button: Top-right corner
```

### 4. Notification Center

```css
Component: NotificationPanel
Width: 400px
Max-height: 600px
Border-radius: 12px
Background: White
Box-shadow: 0 12px 32px rgba(0,0,0,0.15)

Header:
- Padding: Space-5 Space-6
- Border-bottom: 1px solid Gray-200
- Heading 5: "Notifications"
- Mark all read button: Right side

Notification List:
- Max-height: 500px
- Overflow-y: auto

Notification Item:
- Padding: Space-4 Space-6
- Border-bottom: 1px solid Gray-100
- Display: flex
- Gap: Space-3
- Position: relative
- Transition: background 0.15s ease

Unread:
- Background: Primary-50
- Unread indicator: 8px blue dot, left side

Hover:
- Background: Gray-50

Structure:
- Avatar/Icon: 40px
- Content: Flex-grow 1
  - Message: Body Small
  - Time: Caption, Gray-600
- Action: Chevron or X icon
```

### 5. Video Call Interface

```css
Component: VideoCallContainer
Width: 100%
Height: 100vh
Background: Gray-900
Position: relative

Main Video:
- Width: 100%
- Height: 100%
- Object-fit: cover

Self Video (Picture-in-Picture):
- Position: absolute
- Top: Space-6, Right: Space-6
- Width: 240px
- Height: 180px
- Border-radius: 12px
- Border: 2px solid White
- Box-shadow: 0 8px 24px rgba(0,0,0,0.3)

Controls Bar:
- Position: absolute, bottom 0
- Width: 100%
- Padding: Space-6
- Background: linear-gradient(to top, rgba(0,0,0,0.8), transparent)

Control Buttons:
- Size: 56px × 56px
- Border-radius: 50%
- Background: rgba(255,255,255,0.2)
- Backdrop-filter: blur(10px)
- Color: White
- Gap: Space-4

End Call Button:
- Background: Error-500
- Hover: Error-600

Participant List:
- Position: absolute, right 0
- Width: 300px
- Height: 100%
- Background: rgba(0,0,0,0.8)
- Backdrop-filter: blur(10px)
- Padding: Space-6
```

### 6. Background Check Badge

```css
Component: BackgroundCheckBadge
Display: inline-flex
Align-items: center
Gap: Space-2
Padding: Space-2 Space-4
Border-radius: 20px
Background: Success-50
Border: 1px solid Success-200

Icon:
- ShieldCheck
- Size: 20px
- Color: Success-600

Text:
- Font: Inter 600, 14px
- Color: Success-700

Hover:
- Cursor: pointer
- Popover with details
```

### 7. Availability Schedule

```css
Component: AvailabilitySchedule
Border: 1px solid Gray-200
Border-radius: 12px
Overflow: hidden

Day Row:
- Display: flex
- Align-items: center
- Padding: Space-4 Space-5
- Border-bottom: 1px solid Gray-100

Day Label:
- Width: 120px
- Font: Inter 600, 16px
- Color: Gray-800

Toggle:
- Margin-right: Space-4

Time Slots:
- Display: flex
- Gap: Space-2
- Flex-wrap: wrap

Time Slot Chip:
- Padding: Space-2 Space-3
- Border-radius: 6px
- Background: Primary-50
- Color: Primary-700
- Font: Body Small
- Remove button: X icon
```

### 8. Price Range Slider

```css
Component: PriceRangeSlider
Padding: Space-6 0

Track:
- Height: 6px
- Background: Gray-200
- Border-radius: 3px
- Position: relative

Active Track:
- Height: 6px
- Background: Primary-500
- Position: absolute

Thumb:
- Size: 20px × 20px
- Border-radius: 50%
- Background: White
- Border: 3px solid Primary-500
- Box-shadow: 0 2px 8px rgba(0,0,0,0.15)
- Cursor: pointer
- Position: absolute
- Top: -7px

Values Display:
- Display: flex
- Justify-content: space-between
- Margin-top: Space-4
- Font: Inter 600, 16px
- Color: Gray-800
```

### 9. Map Integration

```css
Component: MapContainer
Width: 100%
Height: 400px (Default)
Border-radius: 12px
Overflow: hidden
Position: relative

Map:
- Width: 100%
- Height: 100%

Map Marker:
- Custom icon or default pin
- Size: 40px × 48px
- Drop shadow

Info Window:
- Max-width: 300px
- Padding: Space-4
- Background: White
- Border-radius: 8px
- Box-shadow: 0 4px 16px rgba(0,0,0,0.15)

Controls:
- Position: absolute
- Zoom buttons: Top-right
- Locate me: Top-right, below zoom
- Style: Icon buttons with white background
```

### 10. Empty States

```css
Component: EmptyState
Width: 100%
Max-width: 500px
Margin: 0 auto
Padding: Space-16 Space-6
Text-align: center

Illustration:
- Width: 240px
- Margin-bottom: Space-8
- Opacity: 0.8

Heading:
- Heading 4
- Color: Gray-800
- Margin-bottom: Space-3

Description:
- Body
- Color: Gray-600
- Margin-bottom: Space-6

CTA Button:
- Primary button
- Center aligned
```

---

## Dark Mode Specifications

### Color Adjustments

```css
Dark Mode Color System:

Background:
- Primary: #0A0E13 (Dark blue-black)
- Surface: #1E1E1E
- Elevated: #2D2D2D

Text:
- Primary: #E0E0E0 (instead of Gray-900)
- Secondary: #A0A0A0 (instead of Gray-600)
- Disabled: #606060

Primary Colors:
- Use Primary-300 instead of Primary-500
- Reduce saturation by 10%

Secondary Colors:
- Use Secondary-400 instead of Secondary-500

Borders:
- Use rgba(255,255,255,0.1) instead of Gray-200
- Elevated borders: rgba(255,255,255,0.15)

Shadows:
- Increase opacity by 50%
- Add subtle glow for depth: 0 0 1px rgba(255,255,255,0.1)

Input Fields:
- Background: Surface color
- Border: rgba(255,255,255,0.15)
- Focus: Primary-400 with glow
```

### Implementation

```css
/* CSS Variables for Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0A0E13;
    --bg-surface: #1E1E1E;
    --text-primary: #E0E0E0;
    /* ... all color variables adjusted */
  }
}

/* Or use class-based approach */
.dark {
  --bg-primary: #0A0E13;
  /* ... */
}
```

---

## Performance Optimization

### Image Optimization
- **Format**: WebP with JPEG fallback
- **Lazy loading**: Use `loading="lazy"` attribute
- **Responsive images**: Use `srcset` and `sizes`
- **Avatar compression**: Maximum 200KB per image
- **Thumbnail generation**: 200px, 400px, 800px widths

### Font Loading
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display strategy -->
<style>
  @font-face {
    font-family: 'Inter';
    font-display: swap; /* Show fallback immediately */
    src: url('/fonts/inter-var.woff2') format('woff2');
  }
</style>
```

### CSS Optimization
- **Critical CSS**: Inline above-the-fold styles
- **Code splitting**: Load component styles on demand
- **Purge unused**: Use PurgeCSS or Tailwind's purge
- **Minification**: Production builds

### Animation Performance
- **Use transforms**: `transform` and `opacity` only (GPU accelerated)
- **Avoid**: `height`, `width`, `top`, `left` animations
- **Will-change**: Use sparingly for frequently animated elements
- **Reduce motion**: Respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Internationalization (i18n)

### Text Direction Support
- **RTL Languages**: Arabic, Hebrew
- **LTR Languages**: English, Spanish, etc.

```css
/* RTL Adjustments */
[dir="rtl"] {
  /* Mirror layout */
}

.icon {
  transform: scaleX(1);
}

[dir="rtl"] .icon {
  transform: scaleX(-1); /* Flip icons */
}
```

### Date & Time Formats
- **Use locale-aware formatting**: Intl.DateTimeFormat
- **Time zones**: Display in user's local time
- **Relative times**: "2 hours ago" localized

### Number & Currency
- **Currency symbols**: Before or after based on locale
- **Decimal separators**: , or . based on locale
- **Number formatting**: Intl.NumberFormat

---

## Component States Matrix

### Button States
| State | Background | Text | Border | Shadow | Cursor |
|-------|-----------|------|--------|--------|--------|
| Default | Primary-500 | White | None | Button shadow | pointer |
| Hover | Primary-600 | White | None | Increased | pointer |
| Active | Primary-700 | White | None | Reduced | pointer |
| Focus | Primary-500 | White | 4px Primary-100 | Button shadow | pointer |
| Disabled | Primary-500 | White | None | None | not-allowed |
| Loading | Primary-500 | White (60%) | None | Button shadow | wait |

### Input States
| State | Background | Border | Shadow | Text | Label |
|-------|-----------|--------|--------|------|-------|
| Default | White | Gray-300 | None | Gray-900 | Gray-700 |
| Hover | White | Gray-400 | None | Gray-900 | Gray-700 |
| Focus | White | Primary-500 | 4px Primary-50 | Gray-900 | Primary-600 |
| Filled | White | Gray-300 | None | Gray-900 | Gray-700 |
| Error | White | Error-500 | 4px Error-50 | Gray-900 | Error-600 |
| Success | White | Success-500 | 4px Success-50 | Gray-900 | Success-600 |
| Disabled | Gray-100 | Gray-200 | None | Gray-500 | Gray-500 |

---

## QA Checklist for Developers

### Visual QA
- [ ] All colors match the design system
- [ ] Spacing follows the 8pt grid
- [ ] Typography uses correct font families and sizes
- [ ] Border radius is consistent across similar components
- [ ] Shadows match specifications
- [ ] Hover states are implemented
- [ ] Active states are implemented
- [ ] Focus states are visible and accessible
- [ ] Disabled states are clearly distinguishable
- [ ] Loading states are implemented
- [ ] Error states are clear and helpful

### Responsive QA
- [ ] Mobile breakpoint (320px-767px) tested
- [ ] Tablet breakpoint (768px-1024px) tested
- [ ] Desktop breakpoint (1024px+) tested
- [ ] Touch targets are minimum 44px on mobile
- [ ] Text is readable at all sizes
- [ ] Images scale appropriately
- [ ] Navigation adapts correctly
- [ ] Modals/dialogs behave correctly on mobile

### Accessibility QA
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Tab order is logical
- [ ] ARIA labels are present where needed
- [ ] Alt text is provided for images
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Color contrast meets WCAG AA standards
- [ ] Tested with screen reader
- [ ] Works with browser zoom at 200%

### Performance QA
- [ ] Images are optimized and lazy loaded
- [ ] Fonts are loaded efficiently
- [ ] Animations use GPU-accelerated properties
- [ ] No layout shifts (CLS)
- [ ] Fast time to interactive (TTI)
- [ ] Bundle size is optimized

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Design System Governance

### Component Creation Process
1. **Identify need**: New component or pattern needed
2. **Research**: Check existing components, industry standards
3. **Design**: Create in Figma with all states
4. **Review**: Design team approval
5. **Document**: Add to this design system
6. **Develop**: Build according to specs
7. **Test**: QA checklist completion
8. **Deploy**: Add to component library

### Updating Components
1. **Propose change**: Document reason and impact
2. **Design**: Update with new specifications
3. **Review**: Stakeholder approval
4. **Update docs**: Modify this design.md file
5. **Deprecation notice**: If removing/changing existing component
6. **Implementation**: Roll out gradually
7. **Communication**: Notify all developers

### Design Tokens Update Workflow
1. Modify tokens in central location
2. Update this documentation
3. Regenerate CSS variables
4. Test across all components
5. Deploy token updates
6. Monitor for visual regressions

---

## Resources & Tools

### Design Tools
- **Figma**: Primary design tool
- **Adobe XD**: Alternative design tool
- **Sketch**: Alternative design tool

### Development Tools
- **Storybook**: Component documentation and testing
- **Chromatic**: Visual regression testing
- **Tailwind CSS**: CSS framework
- **React**: Component framework

### Accessibility Tools
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Chrome DevTools audit
- **Screen readers**: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)

### Performance Tools
- **Lighthouse**: Performance auditing
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: Performance profiling

### Testing Tools
- **BrowserStack**: Cross-browser testing
- **Percy**: Visual testing
- **Jest**: Unit testing
- **Cypress**: End-to-end testing

---

## Version History

### v1.0.0 - Initial Release
- Complete design system specification
- All core components defined
- Accessibility guidelines established
- Responsive behavior documented
- Dark mode specifications included

### Future Enhancements
- Advanced animation library
- Component composition patterns
- Design token automation
- Figma plugin for design-to-code
- Enhanced internationalization guidelines
- Mobile app specific guidelines
- Voice interface specifications

---

## Contact & Support

For questions about this design system:
- Create an issue in the design system repository
- Contact the design team lead
- Join the #design-system channel in Slack

For implementation support:
- Check component documentation in Storybook
- Review code examples in the repository
- Contact the frontend architecture team

---

**Last Updated**: November 2025  
**Maintained by**: Design & Frontend Engineering Teams  
**Version**: 1.0.0

---

## Appendix: Component Quick Reference

### Buttons
- PrimaryButton: Main CTAs, gradient/solid background
- SecondaryButton: Secondary actions, outlined style
- TextButton: Tertiary actions, text only
- IconButton: Icon-only actions, circular

### Inputs
- TextInput: Single-line text entry
- Textarea: Multi-line text entry
- Select: Dropdown selection
- Checkbox: Multiple selections
- Radio: Single selection from group
- Toggle: Binary on/off switch
- SearchInput: Search with icon

### Cards
- ProfileCard: Caregiver/family profiles
- ServiceCard: Service category display
- TestimonialCard: Review/testimonial display

### Navigation
- Header: Top navigation bar
- BottomNav: Mobile bottom navigation
- Breadcrumbs: Page hierarchy
- Tabs: Content organization

### Modals
- Modal: Standard dialog
- AlertDialog: Confirmation/alert
- Toast: Brief notifications

### Feedback
- Badge: Status/category labels
- StatusIndicator: Online/offline status
- ProgressBar: Linear progress
- CircularProgress: Circular progress
- Spinner: Loading indicator
- StarRating: Rating display

### Data Display
- ListItem: List entry
- DataTable: Tabular data
- Avatar: User image/initials
- ImageContainer: Image wrapper with ratios
- Gallery: Image carousel

### Overlays
- DropdownMenu: Action menus
- Popover: Contextual information
- Tooltip: Helpful hints

### Forms
- Form: Form container
- InputGroup: Input with icon/button
- DatePicker: Date selection
- FileUpload: File selection

### Advanced
- VideoCall: Video interface
- Map: Location display
- Calendar: Schedule display
- PriceSlider: Range selection
- EmptyState: No content display
- NotificationPanel: Notification center

---

*This design system is a living document and will evolve based on user feedback, technological advances, and business needs.*

---

## Extended Component Specifications

### 11. Stepper/Progress Tracker

```css
Component: Stepper
Display: flex
Justify-content: space-between
Align-items: center
Padding: Space-8 0
Max-width: 800px

Step Item:
- Display: flex
- Flex-direction: column
- Align-items: center
- Flex: 1
- Position: relative

Step Circle:
- Size: 48px × 48px
- Border-radius: 50%
- Display: flex
- Align-items: center
- Justify-content: center
- Font: Inter 600, 18px
- Z-index: 1

States:
- Completed: Background Success-500, Color White, Checkmark icon
- Active: Background Primary-500, Color White, Number
- Upcoming: Background Gray-200, Color Gray-600, Number

Step Label:
- Margin-top: Space-3
- Font: Body Small
- Text-align: center
- Max-width: 120px

Connector Line:
- Position: absolute
- Top: 24px (center of circle)
- Width: 100%
- Height: 2px
- Background: Gray-200 (default), Primary-500 (completed)
- Left: 50%
- Z-index: 0

Mobile Layout:
- Flex-direction: column
- Align-items: flex-start
- Connector: Vertical line on left
```

### 12. Chat Bubble/Message

```css
Component: ChatBubble
Max-width: 70%
Margin-bottom: Space-4
Display: flex
Flex-direction: column

Sent Message (Right):
- Align-self: flex-end
- Background: Primary-500
- Color: White
- Border-radius: 16px 16px 4px 16px
- Padding: Space-3 Space-4

Received Message (Left):
- Align-self: flex-start
- Background: Gray-100
- Color: Gray-900
- Border-radius: 16px 16px 16px 4px
- Padding: Space-3 Space-4

Message Content:
- Font: Body
- Line-height: 1.5
- Word-wrap: break-word

Timestamp:
- Font: Caption
- Color: Gray-500 (received), rgba(255,255,255,0.7) (sent)
- Margin-top: Space-1
- Align: Right (sent), Left (received)

Avatar:
- Size: 32px
- Margin: 0 Space-2
- Position: Adjacent to bubble

Message Status (Sent):
- Icon: Checkmark (sent), Double-checkmark (read)
- Size: 16px
- Color: rgba(255,255,255,0.7)

Attachment Preview:
- Border-radius: 8px
- Margin-top: Space-2
- Max-width: 300px
- Cursor: pointer
```

### 13. Skeleton Loader

```css
Component: Skeleton
Background: linear-gradient(
  90deg,
  Gray-200 0%,
  Gray-100 50%,
  Gray-200 100%
)
Background-size: 200% 100%
Animation: shimmer 1.5s infinite linear
Border-radius: 4px

Variants:
- Text: Height 16px, Width 100%
- Title: Height 24px, Width 60%
- Avatar: 48px circle
- Card: Height 200px, Width 100%
- Button: Height 44px, Width 120px

Usage in Components:
- ProfileCard Skeleton:
  - Avatar circle top
  - 2 text lines
  - 1 title line
  - Button skeleton bottom

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 14. Breadcrumb Navigation

```css
Component: BreadcrumbNav
Display: flex
Align-items: center
Gap: Space-2
Padding: Space-4 0
Font: Body Small
Color: Gray-600

Breadcrumb Item:
- Display: flex
- Align-items: center

Breadcrumb Link:
- Color: Gray-600
- Text-decoration: none
- Transition: color 0.15s ease

Link Hover:
- Color: Primary-500
- Text-decoration: underline

Current Page:
- Color: Gray-900
- Font-weight: 600
- Cursor: default

Separator:
- Icon: ChevronRight or "/"
- Size: 16px
- Color: Gray-400
- Margin: 0 Space-1

Home Icon:
- Size: 20px
- First item only
- Optional text label
```

### 15. Time Slot Selector

```css
Component: TimeSlotSelector
Display: grid
Grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))
Gap: Space-3
Padding: Space-4

Time Slot:
- Height: 48px
- Border: 1px solid Gray-300
- Border-radius: 8px
- Background: White
- Font: Inter 500, 14px
- Color: Gray-700
- Display: flex
- Align-items: center
- Justify-content: center
- Cursor: pointer
- Transition: all 0.15s ease

Hover:
- Border-color: Primary-500
- Background: Primary-50

Selected:
- Background: Primary-500
- Border-color: Primary-500
- Color: White
- Font-weight: 600

Disabled:
- Background: Gray-100
- Color: Gray-400
- Border-color: Gray-200
- Cursor: not-allowed
- Opacity: 0.6

With Icon:
- Icon: Clock, 16px, left of text
- Gap: Space-2
```

### 16. Location Autocomplete

```css
Component: LocationAutocomplete
Position: relative
Width: 100%

Input:
- Inherits TextInput styles
- Icon: MapPin, left side, 20px, Gray-500

Dropdown:
- Position: absolute
- Top: 100%, margin-top Space-2
- Width: 100%
- Background: White
- Border: 1px solid Gray-200
- Border-radius: 8px
- Box-shadow: 0 8px 24px rgba(0,0,0,0.12)
- Max-height: 320px
- Overflow-y: auto
- Z-index: 1000

Location Item:
- Padding: Space-3 Space-4
- Display: flex
- Gap: Space-3
- Cursor: pointer
- Border-bottom: 1px solid Gray-100
- Transition: background 0.1s ease

Item Hover:
- Background: Gray-50

Item Structure:
- Icon: MapPin, 20px, Gray-600
- Content:
  - Main text: Body Small, Gray-900
  - Secondary text: Caption, Gray-600

Current Location:
- Special item at top
- Icon: LocateFixed
- Background: Primary-50
- Color: Primary-700
```

### 17. Language Selector

```css
Component: LanguageSelector
Display: inline-flex
Align-items: center
Gap: Space-2
Cursor: pointer

Selected Language:
- Display: flex
- Align-items: center
- Gap: Space-2
- Padding: Space-2 Space-3
- Border-radius: 6px
- Transition: background 0.15s ease

Hover:
- Background: Gray-100

Flag Icon:
- Size: 20px × 20px
- Border-radius: 2px

Language Code:
- Font: Inter 500, 14px
- Color: Gray-700
- Text-transform: uppercase

Dropdown:
- Similar to DropdownMenu
- Min-width: 200px

Language Option:
- Display: flex
- Align-items: center
- Gap: Space-3
- Padding: Space-3 Space-4

Option Structure:
- Flag icon: 24px
- Language name: Body Small, Gray-800
- Native name: Caption, Gray-600
```

### 18. Profile Completion Indicator

```css
Component: ProfileCompletionCard
Background: White
Border: 1px solid Gray-200
Border-radius: 12px
Padding: Space-6

Header:
- Display: flex
- Justify-content: space-between
- Align-items: center
- Margin-bottom: Space-4

Title:
- Font: Heading 5
- Color: Gray-900

Percentage:
- Font: Inter 700, 24px
- Color: Primary-500

Progress Bar:
- Height: 8px
- Background: Gray-200
- Border-radius: 4px
- Overflow: hidden
- Margin-bottom: Space-5

Progress Fill:
- Height: 100%
- Background: gradient-success
- Border-radius: inherit
- Transition: width 0.6s ease-out

Checklist:
- Display: flex
- Flex-direction: column
- Gap: Space-3

Checklist Item:
- Display: flex
- Align-items: center
- Gap: Space-3
- Padding: Space-2 0

Checkbox Icon:
- Size: 20px
- Completed: CheckCircle, Success-500
- Incomplete: Circle, Gray-300

Item Text:
- Font: Body Small
- Color: Gray-700 (incomplete), Gray-500 (completed)
- Text-decoration: line-through (completed)

Action Link:
- Font: Body Small
- Color: Primary-500
- Text-decoration: underline
- Cursor: pointer
```

### 19. Certificate/Badge Display

```css
Component: CertificateBadge
Display: inline-flex
Align-items: center
Gap: Space-2
Padding: Space-3 Space-4
Border: 1px solid Gray-200
Border-radius: 8px
Background: White
Box-shadow: 0 2px 4px rgba(0,0,0,0.06)

Badge Icon:
- Size: 32px
- Color: Primary-500
- Icon: Award, Shield, Certificate

Content:
- Display: flex
- Flex-direction: column
- Gap: Space-1

Title:
- Font: Inter 600, 14px
- Color: Gray-900

Issuer:
- Font: Caption
- Color: Gray-600

Verification:
- Display: inline-flex
- Align-items: center
- Gap: Space-1
- Font: Caption
- Color: Success-600

Verified Icon:
- Size: 14px
- CheckCircle
- Color: Success-500

Hover:
- Cursor: pointer
- Box-shadow: 0 4px 8px rgba(0,0,0,0.1)
- Transform: translateY(-2px)
- Transition: all 0.2s ease
```

### 20. Social Share Buttons

```css
Component: SocialShareGroup
Display: flex
Gap: Space-3
Align-items: center

Share Button:
- Size: 40px × 40px
- Border-radius: 50%
- Display: flex
- Align-items: center
- Justify-content: center
- Cursor: pointer
- Transition: all 0.2s ease
- Border: 1px solid Gray-300

Icon:
- Size: 20px
- Color: Gray-700

Platforms:
- Facebook: Background #1877F2 on hover
- Twitter: Background #1DA1F2 on hover
- LinkedIn: Background #0A66C2 on hover
- WhatsApp: Background #25D366 on hover
- Email: Background Gray-700 on hover
- Link (Copy): Background Primary-500 on hover

Hover State:
- Icon color: White
- Transform: scale(1.1)
- Border: none

Tooltip:
- Show platform name on hover
- Position: bottom center
```

---

## Advanced Interaction Patterns

### 1. Drag and Drop

```css
Component: DragDropZone
Min-height: 200px
Border: 2px dashed Gray-300
Border-radius: 12px
Background: Gray-50
Padding: Space-8
Cursor: pointer
Transition: all 0.2s ease

Drag Over State:
- Border-color: Primary-500
- Background: Primary-50
- Border-style: solid

Drop Active:
- Background: Success-50
- Border-color: Success-500

Draggable Item:
- Cursor: grab
- Active: cursor move
- Touch-action: none

Drop Indicator:
- Height: 4px
- Background: Primary-500
- Border-radius: 2px
- Animation: pulse 1s infinite
```

### 2. Infinite Scroll

```css
Component: InfiniteScrollContainer
Position: relative
Overflow-y: auto

Loading Trigger:
- Position: absolute
- Bottom: 200px (trigger before end)
- Width: 100%
- Height: 1px

Loading Indicator:
- Display: flex
- Justify-content: center
- Padding: Space-8 0
- Component: Spinner (Medium)

End Message:
- Text-align: center
- Padding: Space-8 0
- Font: Body Small
- Color: Gray-600
- Content: "You've reached the end"
```

### 3. Multi-step Form Wizard

```css
Component: FormWizard
Max-width: 800px
Margin: 0 auto

Progress Indicator:
- Component: Stepper (see above)
- Margin-bottom: Space-8

Form Step:
- Background: White
- Border-radius: 12px
- Padding: Space-8
- Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- Animation: slideInRight 0.3s ease

Step Transition:
- Exit: slideOutLeft + fadeOut
- Enter: slideInRight + fadeIn

Navigation Footer:
- Display: flex
- Justify-content: space-between
- Margin-top: Space-8
- Padding-top: Space-6
- Border-top: 1px solid Gray-200

Back Button:
- Secondary button
- Display: flex with arrow icon

Next Button:
- Primary button
- Display: flex with arrow icon

Skip Link:
- Text button
- Align: right
- Color: Gray-600
```

### 4. Collapsible Sidebar

```css
Component: CollapsibleSidebar
Width: 280px (expanded), 64px (collapsed)
Transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1)
Background: White
Border-right: 1px solid Gray-200
Position: sticky
Top: 72px (header height)
Height: calc(100vh - 72px)

Toggle Button:
- Position: absolute
- Right: -16px
- Top: 24px
- Size: 32px × 32px
- Background: White
- Border: 1px solid Gray-200
- Border-radius: 50%
- Box-shadow: 0 2px 8px rgba(0,0,0,0.1)
- Z-index: 10

Nav Item (Expanded):
- Display: flex
- Align-items: center
- Gap: Space-3
- Padding: Space-3 Space-4
- Icon: 24px, visible
- Label: visible, opacity 1

Nav Item (Collapsed):
- Padding: Space-3 Space-2
- Icon: centered, 24px
- Label: opacity 0, width 0
- Tooltip on hover: show label

Collapsed State:
- All text opacity 0
- Icons remain visible, centered
- Width transitions smoothly
```

### 5. Command Palette (Search Everything)

```css
Component: CommandPalette
Position: fixed
Top: 20%
Left: 50%
Transform: translateX(-50%)
Width: 640px
Max-width: 90vw
Max-height: 60vh
Background: White
Border-radius: 12px
Box-shadow: 0 24px 48px rgba(0,0,0,0.2)
Z-index: 2000
Overflow: hidden

Backdrop:
- Background: rgba(0,0,0,0.5)
- Backdrop-filter: blur(4px)

Search Input:
- Height: 64px
- Padding: 0 Space-6
- Border: none
- Border-bottom: 1px solid Gray-200
- Font: Inter 400, 18px
- Background: transparent

Search Icon:
- Position: absolute
- Left: Space-6
- Top: 50%
- Transform: translateY(-50%)
- Size: 24px
- Color: Gray-400

Results List:
- Max-height: calc(60vh - 64px)
- Overflow-y: auto
- Padding: Space-2 0

Result Category:
- Padding: Space-3 Space-6 Space-2
- Font: Caption, Uppercase
- Color: Gray-600
- Letter-spacing: 0.5px

Result Item:
- Display: flex
- Align-items: center
- Gap: Space-3
- Padding: Space-3 Space-6
- Cursor: pointer
- Transition: background 0.1s ease

Item Hover/Selected:
- Background: Primary-50

Item Structure:
- Icon: 20px, Gray-600
- Content: Flex-grow 1
  - Title: Body Small, Gray-900
  - Breadcrumb: Caption, Gray-600
- Shortcut: Badge (optional)

Keyboard Navigation:
- Arrow keys: Navigate items
- Enter: Select item
- Escape: Close palette
- Cmd/Ctrl + K: Open palette

Empty State:
- Padding: Space-16
- Text-align: center
- Icon: Search, 48px, Gray-400
- Message: "No results found"
```

---

## Specialized Components for Care Platform

### 1. Availability Calendar View

```css
Component: AvailabilityCalendar
Border: 1px solid Gray-200
Border-radius: 12px
Overflow: hidden
Background: White

Calendar Header:
- Display: grid
- Grid-template-columns: 100px repeat(7, 1fr)
- Background: Gray-50
- Border-bottom: 2px solid Gray-200
- Padding: Space-3 0

Time Column:
- Width: 100px
- Background: Gray-50
- Border-right: 1px solid Gray-200

Day Headers:
- Text-align: center
- Font: Inter 600, 14px
- Color: Gray-700
- Padding: Space-2

Calendar Body:
- Display: grid
- Grid-template-columns: 100px repeat(7, 1fr)
- Grid-auto-rows: 48px

Time Slot:
- Border: 1px solid Gray-100
- Position: relative
- Transition: background 0.1s ease

Time Label:
- Padding: Space-2 Space-3
- Font: Caption
- Color: Gray-600
- Text-align: right

Available Slot:
- Background: Success-50
- Cursor: pointer
- Hover: Background Success-100

Booked Slot:
- Background: Primary-100
- Cursor: default
- Pointer-events: none

Blocked Slot:
- Background: Gray-100
- Pattern: Diagonal stripes

Booking Block:
- Position: absolute
- Top: 0
- Height: 100%
- Background: Primary-500
- Color: White
- Padding: Space-2
- Border-radius: 4px
- Font: Caption
- Z-index: 1
```

### 2. Service Package Card

```css
Component: ServicePackageCard
Width: 100%
Max-width: 380px
Background: White
Border: 2px solid Gray-200
Border-radius: 16px
Overflow: hidden
Transition: all 0.3s ease

Featured/Popular:
- Border-color: Primary-500
- Box-shadow: 0 8px 32px rgba(33, 150, 243, 0.15)
- Position: relative

Popular Badge:
- Position: absolute
- Top: 20px
- Right: -32px
- Background: Secondary-500
- Color: White
- Padding: Space-2 Space-10
- Font: Inter 700, 12px
- Text-transform: uppercase
- Transform: rotate(45deg)

Header:
- Padding: Space-8 Space-6
- Background: gradient-trust (Featured) OR White
- Text-align: center
- Color: White (Featured) OR Gray-900

Package Name:
- Font: Heading 4
- Margin-bottom: Space-2

Price:
- Font: Manrope 800, 48px
- Margin-bottom: Space-1
- Display: flex
- Align-items: baseline
- Justify-content: center

Currency:
- Font: Heading 5
- Opacity: 0.8

Period:
- Font: Body Small
- Opacity: 0.7
- Margin-top: Space-2

Description:
- Font: Body Small
- Opacity: 0.9
- Margin-top: Space-3

Features List:
- Padding: Space-6
- Border-top: 1px solid Gray-200

Feature Item:
- Display: flex
- Align-items: flex-start
- Gap: Space-3
- Padding: Space-3 0
- Font: Body Small
- Color: Gray-700

Feature Icon:
- Size: 20px
- Color: Success-500
- Flex-shrink: 0
- Icon: Check

Not Included Feature:
- Opacity: 0.5
- Icon: X, Color Gray-400

CTA Button:
- Width: calc(100% - 48px)
- Margin: 0 Space-6 Space-6
- Primary button (Featured) OR Secondary button

Hover State:
- Transform: translateY(-8px)
- Box-shadow: 0 12px 40px rgba(0,0,0,0.15)
```

### 3. Safety Feature Card

```css
Component: SafetyFeatureCard
Display: flex
Gap: Space-4
Padding: Space-6
Background: White
Border: 1px solid Gray-200
Border-radius: 12px
Align-items: flex-start

Icon Container:
- Size: 56px × 56px
- Border-radius: 12px
- Background: Success-50
- Display: flex
- Align-items: center
- Justify-content: center
- Flex-shrink: 0

Icon:
- Size: 28px
- Color: Success-600
- Icons: Shield, Lock, UserCheck, FileCheck

Content:
- Flex: 1

Title:
- Font: Inter 600, 18px
- Color: Gray-900
- Margin-bottom: Space-2

Description:
- Font: Body Small
- Color: Gray-600
- Line-height: 1.6

Verification Status:
- Display: inline-flex
- Align-items: center
- Gap: Space-1
- Margin-top: Space-3
- Font: Caption
- Color: Success-600

Status Icon:
- Size: 14px
- CheckCircle
- Color: Success-500
```

### 4. Experience Timeline

```css
Component: ExperienceTimeline
Position: relative
Padding-left: Space-10

Timeline Line:
- Position: absolute
- Left: 16px
- Top: 8px
- Bottom: 8px
- Width: 2px
- Background: Gray-200

Experience Item:
- Position: relative
- Margin-bottom: Space-8
- Padding-left: Space-6

Timeline Dot:
- Position: absolute
- Left: -42px
- Top: 4px
- Size: 12px × 12px
- Border-radius: 50%
- Background: Primary-500
- Border: 3px solid White
- Box-shadow: 0 0 0 2px Primary-200
- Z-index: 1

Current Job:
- Timeline Dot: Size 16px, Pulse animation

Item Header:
- Display: flex
- Justify-content: space-between
- Align-items: flex-start
- Margin-bottom: Space-2

Job Title:
- Font: Inter 600, 16px
- Color: Gray-900

Duration:
- Font: Caption
- Color: Gray-600
- Background: Gray-100
- Padding: Space-1 Space-2
- Border-radius: 4px

Company/Client:
- Font: Body Small
- Color: Primary-500
- Margin-bottom: Space-2

Description:
- Font: Body Small
- Color: Gray-700
- Line-height: 1.6
- Margin-bottom: Space-3

Skills:
- Display: flex
- Gap: Space-2
- Flex-wrap: wrap

Skill Tag:
- Component: Badge (Small)
- Background: Primary-50
- Color: Primary-700
```

### 5. Review Summary Card

```css
Component: ReviewSummaryCard
Background: White
Border: 1px solid Gray-200
Border-radius: 12px
Padding: Space-6

Overall Rating:
- Display: flex
- Align-items: center
- Justify-content: space-between
- Padding-bottom: Space-6
- Border-bottom: 1px solid Gray-200
- Margin-bottom: Space-6

Rating Number:
- Font: Manrope 800, 56px
- Color: Gray-900

Out of 5:
- Font: Body Small
- Color: Gray-600

Star Display:
- Component: StarRating (Large)
- Margin: Space-2 0

Review Count:
- Font: Body Small
- Color: Gray-600
- Content: "Based on X reviews"

Rating Breakdown:
- Display: flex
- Flex-direction: column
- Gap: Space-3

Rating Row:
- Display: grid
- Grid-template-columns: 60px 1fr 60px
- Align-items: center
- Gap: Space-3

Star Label:
- Font: Body Small
- Color: Gray-700
- Display: flex
- Align-items: center
- Gap: Space-1

Progress Bar:
- Height: 8px
- Background: Gray-200
- Border-radius: 4px
- Position: relative

Progress Fill:
- Height: 100%
- Background: Secondary-500
- Border-radius: inherit
- Transition: width 0.6s ease-out

Count:
- Font: Caption
- Color: Gray-600
- Text-align: right

Category Ratings:
- Margin-top: Space-6
- Padding-top: Space-6
- Border-top: 1px solid Gray-200

Category Row:
- Display: flex
- Justify-content: space-between
- Align-items: center
- Padding: Space-2 0

Category Name:
- Font: Body Small
- Color: Gray-700

Category Score:
- Display: flex
- Align-items: center
- Gap: Space-2
- Font: Inter 600, 16px
- Color: Gray-900
```

### 6. Emergency Contact Card

```css
Component: EmergencyContactCard
Background: Error-50
Border: 2px solid Error-200
Border-radius: 12px
Padding: Space-6

Alert Icon:
- Size: 40px
- Color: Error-500
- Margin-bottom: Space-4
- Icon: AlertTriangle

Heading:
- Font: Heading 5
- Color: Error-700
- Margin-bottom: Space-3

Description:
- Font: Body Small
- Color: Error-600
- Line-height: 1.6
- Margin-bottom: Space-5

Emergency Numbers:
- Display: flex
- Flex-direction: column
- Gap: Space-3

Contact Row:
- Display: flex
- Justify-content: space-between
- Align-items: center
- Padding: Space-3
- Background: White
- Border-radius: 8px

Service Name:
- Font: Inter 600, 14px
- Color: Gray-900

Phone Number:
- Display: flex
- Align-items: center
- Gap: Space-2
- Font: Inter 600, 16px
- Color: Error-600

Call Button:
- Size: 40px × 40px
- Background: Error-500
- Color: White
- Border-radius: 50%
- Display: flex
- Align-items: center
- Justify-content: center
- Icon: Phone, 20px
```

---

## Mobile-Specific Components

### 1. Bottom Sheet

```css
Component: BottomSheet
Position: fixed
Bottom: 0
Left: 0
Right: 0
Background: White
Border-radius: 20px 20px 0 0
Box-shadow: 0 -4px 24px rgba(0,0,0,0.15)
Z-index: 1050
Transform: translateY(100%)
Transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)

Open State:
- Transform: translateY(0)

Handle:
- Width: 40px
- Height: 4px
- Background: Gray-300
- Border-radius: 2px
- Margin: Space-3 auto
- Cursor: grab

Header:
- Padding: Space-4 Space-6
- Border-bottom: 1px solid Gray-200

Title:
- Font: Heading 5
- Color: Gray-900

Content:
- Padding: Space-6
- Max-height: 70vh
- Overflow-y: auto

Backdrop:
- Background: rgba(0,0,0,0.4)
- Touch: dismiss on tap
```

### 2. Floating Action Button (FAB)

```css
Component: FAB
Position: fixed
Bottom: 24px
Right: 24px
Size: 56px × 56px
Border-radius: 50%
Background: gradient-warmth
Color: White
Box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4)
Display: flex
Align-items: center
Justify-content: center
Z-index: 1000
Transition: all 0.3s ease

Icon:
- Size: 24px
- Color: White

Hover/Active:
- Transform: scale(1.1)
- Box-shadow: 0 8px 24px rgba(255, 152, 0, 0.5)

Extended FAB:
- Width: auto
- Padding: 0 Space-6
- Border-radius: 28px
- Gap: Space-2

Label:
- Font: Inter 600, 16px
- Color: White
- White-space: nowrap

Mini FAB:
- Size: 40px × 40px
- Icon: 20px
```

### 3. Pull to Refresh

```css
Component: PullToRefresh
Position: relative

Pull Indicator:
- Position: absolute
- Top: -60px
- Width: 100%
- Height: 60px
- Display: flex
- Align-items: center
- Justify-content: center
- Transition: transform 0.2s ease

Pulling State:
- Transform: translateY(distance)
- Opacity: progress

Spinner:
- Component: CircularProgress (Small)
- Color: Primary-500

Pull Arrow:
- Size: 24px
- Color: Gray-600
- Animation: bounce (when threshold reached)

Refreshing State:
- Height: 60px visible
- Spinner active
- Background: White
```

### 4. Swipeable Card

```css
Component: SwipeableCard
Position: relative
Touch-action: pan-y
User-select: none

Swipe Actions Background:
- Position: absolute
- Top: 0
- Height: 100%
- Display: flex
- Align-items: center
- Padding: 0 Space-6

Left Actions (Swipe Right):
- Left: 0
- Background: Success-500
- Justify-content: flex-start

Right Actions (Swipe Left):
- Right: 0
- Background: Error-500
- Justify-content: flex-end

Action Icon:
- Size: 24px
- Color: White
- Transition: transform 0.2s ease
- Scale: grows as swipe progresses

Card Content:
- Position: relative
- Background: White
- Z-index: 1
- Transform: translateX(swipe distance)
- Transition: transform 0.2s ease

Swipe Threshold:
- Distance: 80px (triggers action)
- Feedback: Haptic vibration

Return Animation:
- If threshold not met: spring back
- If threshold met: complete swipe off screen
```

---

## Form Patterns & Validation

### 1. Real-time Validation

```css
Component: ValidatedInput
Position: relative

Input States:
- Pristine: Default border (Gray-300)
- Touched + Valid: Border Success-500, Success icon right
- Touched + Invalid: Border Error-500, Error icon right
- Validating: Loading spinner right

Validation Icon:
- Position: absolute
- Right: Space-4
- Top: 50%
- Transform: translateY(-50%)
- Size: 20px

Success Icon:
- CheckCircle
- Color: Success-500
- Animation: scaleIn 0.2s ease

Error Icon:
- XCircle
- Color: Error-500
- Animation: shake 0.3s ease

Error Message:
- Display: flex
- Align-items: center
- Gap: Space-2
- Margin-top: Space-2
- Font: Caption
- Color: Error-600
- Animation: slideInDown 0.2s ease

Success Message:
- Similar to error
- Color: Success-600

Password Strength Indicator:
- Height: 4px
- Background: Gray-200
- Border-radius: 2px
- Margin-top: Space-2
- Overflow: hidden

Strength Fill:
- Height: 100%
- Transition: width 0.3s ease, background 0.3s ease
- Weak: 33% width, Error-500
- Medium: 66% width, Warning-500
- Strong: 100% width, Success-500

Strength Label:
- Font: Caption
- Margin-top: Space-1
- Color: matches strength level
```

### 2. Multi-select Dropdown

```css
Component: MultiSelect
Position: relative

Selected Items Container:
- Min-height: 48px
- Padding: Space-2 Space-4
- Border: 1px solid Gray-300
- Border-radius: 8px
- Display: flex
- Flex-wrap: wrap
- Gap: Space-2
- Cursor: pointer
- Transition: border-color 0.2s ease

Focus State:
- Border-color: Primary-500
- Box-shadow: 0 0 0 4px Primary-50

Selected Tag:
- Display: inline-flex
- Align-items: center
- Gap: Space-2
- Padding: Space-1 Space-2
- Background: Primary-100
- Color: Primary-700
- Border-radius: 4px
- Font: Caption
- Animation: scaleIn 0.15s ease

Remove Button:
- Size: 16px
- Icon: X
- Cursor: pointer
- Transition: opacity 0.15s ease
- Hover: opacity 0.7

Placeholder:
- Font: Body
- Color: Gray-500
- Display: when no selection

Dropdown Panel:
- Similar to Select dropdown
- Max-height: 320px
- Overflow-y: auto

Search Input (in dropdown):
- Padding: Space-3 Space-4
- Border-bottom: 1px solid Gray-200
- Font: Body Small

Option:
- Display: flex
- Align-items: center
- Gap: Space-3
- Padding: Space-3 Space-4

Checkbox:
- Size: 18px
- Checked: when selected

Option Label:
- Font: Body Small
- Color: Gray-800

Select All Option:
- Border-bottom: 1px solid Gray-200
- Font: Inter 600, 14px
- Color: Primary-500
```

### 3. Rich Text Editor Toolbar

```css
Component: RichTextToolbar
Display: flex
Gap: Space-2
Padding: Space-3 Space-4
Background: Gray-50
Border: 1px solid Gray-200
Border-bottom: none
Border-radius: 8px 8px 0 0

Tool Button:
- Size: 36px × 36px
- Border: none
- Background: transparent
- Border-radius: 6px
- Display: flex
- Align-items: center
- Justify-content: center
- Cursor: pointer
- Transition: background 0.15s ease

Icon:
- Size: 18px
- Color: Gray-700

Hover:
- Background: Gray-200

Active:
- Background: Primary-100
- Icon color: Primary-600

Divider:
- Width: 1px
- Height: 24px
- Background: Gray-300
- Margin: 0 Space-2

Dropdown Tool (Font, Size):
- Min-width: 100px
- Padding: 0 Space-3
- Height: 36px
- Border-radius: 6px
- Background: White
- Border: 1px solid Gray-300

Editor Content Area:
- Min-height: 200px
- Padding: Space-4
- Border: 1px solid Gray-200
- Border-radius: 0 0 8px 8px
- Background: White
- Font: Body
- Line-height: 1.6

Focus:
- Border-color: Primary-500
- Box-shadow: 0 0 0 4px Primary-50
```

### 4. Credit Card Input

```css
Component: CreditCardInput
Display: grid
Grid-template-columns: 1fr 1fr
Gap: Space-4

Card Number Input:
- Grid-column: 1 / -1
- Font: JetBrains Mono, 18px
- Letter-spacing: 2px
- Padding-left: 56px (for card icon)

Card Type Icon:
- Position: absolute
- Left: Space-4
- Top: 50%
- Transform: translateY(-50%)
- Size: 32px
- Auto-detect: Visa, Mastercard, Amex, etc.

Expiry Input:
- Grid-column: 1
- Placeholder: "MM/YY"
- Auto-format: adds "/" after MM

CVV Input:
- Grid-column: 2
- Type: password (optional)
- Max-length: 3 or 4

Card Preview:
- Width: 100%
- Aspect-ratio: 1.586 (standard card ratio)
- Background: gradient-trust
- Border-radius: 12px
- Padding: Space-6
- Color: White
- Position: relative
- Margin-bottom: Space-6

Card Preview Elements:
- Chip icon: Top-left, 40px
- Card number: Center, spaced (•••• •••• •••• 1234)
- Cardholder name: Bottom-left
- Expiry: Bottom-right
- Card brand: Top-right
```

---

## Data Visualization Components

### 1. Stats Card

```css
Component: StatsCard
Background: White
Border: 1px solid Gray-200
Border-radius: 12px
Padding: Space-6
Display: flex
Flex-direction: column
Gap: Space-4

Icon Container:
- Size: 48px × 48px
- Border-radius: 10px
- Background: Primary-50 (or variant color)
- Display: flex
- Align-items: center
- Justify-content: center

Icon:
- Size: 24px
- Color: Primary-500

Label:
- Font: Body Small
- Color: Gray-600
- Text-transform: uppercase
- Letter-spacing: 0.5px

Value:
- Font: Manrope 800, 36px
- Color: Gray-900
- Line-height: 1

Change Indicator:
- Display: flex
- Align-items: center
- Gap: Space-1
- Font: Inter 600, 14px
- Margin-top: Space-2

Positive Change:
- Color: Success-600
- Icon: TrendingUp

Negative Change:
- Color: Error-600
- Icon: TrendingDown

Change Value:
- Font: Inter 600, 14px

Time Period:
- Font: Caption
- Color: Gray-500
- Margin-left: Space-2
```

### 2. Activity Feed

```css
Component: ActivityFeed
Background: White
Border: 1px solid Gray-200
Border-radius: 12px
Overflow: hidden

Header:
- Padding: Space-5 Space-6
- Border-bottom: 1px solid Gray-200
- Display: flex
- Justify-content: space-between
- Align-items: center

Title:
- Font: Heading 5
- Color: Gray-900

View All Link:
- Font: Body Small
- Color: Primary-500

Feed Content:
- Max-height: 500px
- Overflow-y: auto
- Padding: Space-4 0

Activity Item:
- Display: flex
- Gap: Space-4
- Padding: Space-4 Space-6
- Transition: background 0.15s ease
- Border-left: 3px solid transparent

Hover:
- Background: Gray-50
- Border-left-color: Primary-500

Avatar:
- Size: 40px
- Flex-shrink: 0

Content:
- Flex: 1

Activity Text:
- Font: Body Small
- Color: Gray-700
- Line-height: 1.5

Highlighted Text (names, actions):
- Font: Inter 600
- Color: Gray-900

Timestamp:
- Font: Caption
- Color: Gray-500
- Margin-top: Space-1

Activity Type Indicator:
- Size: 8px × 8px
- Border-radius: 50%
- Position: absolute
- Bottom: 0
- Right: 0
- Border: 2px solid White

Type Colors:
- Message: Primary-500
- Booking: Success-500
- Payment: Warning-500
- Review: Secondary-500
```

### 3. Mini Line Chart

```css
Component: MiniLineChart
Height: 60px
Width: 100%
Position: relative

SVG:
- Width: 100%
- Height: 100%
- Overflow: visible

Path:
- Fill: none
- Stroke: Primary-500
- Stroke-width: 2px
- Stroke-linecap: round
- Stroke-linejoin: round

Gradient Fill (under line):
- Stop-color top: Primary-500 (opacity 0.2)
- Stop-color bottom: Primary-500 (opacity 0)

Hover Interaction:
- Show tooltip with value
- Highlight point with circle

Tooltip:
- Position: absolute
- Background: Gray-900
- Color: White
- Padding: Space-2 Space-3
- Border-radius: 6px
- Font: Caption
- White-space: nowrap
- Z-index: 10
```

### 4. Progress Ring

```css
Component: ProgressRing
Size: 120px (customizable)
Position: relative

SVG:
- Width: 100%
- Height: 100%
- Transform: rotate(-90deg)

Background Circle:
- Fill: none
- Stroke: Gray-200
- Stroke-width: 8px

Progress Circle:
- Fill: none
- Stroke: Primary-500 OR gradient
- Stroke-width: 8px
- Stroke-linecap: round
- Stroke-dasharray: calculated based on progress
- Transition: stroke-dashoffset 0.6s ease

Center Content:
- Position: absolute
- Top: 50%
- Left: 50%
- Transform: translate(-50%, -50%)
- Text-align: center

Percentage:
- Font: Manrope 800, 32px
- Color: Gray-900
- Line-height: 1

Label:
- Font: Caption
- Color: Gray-600
- Margin-top: Space-1
```

---

## Interactive Map Features

### 1. Service Area Map

```css
Component: ServiceAreaMap
Height: 500px
Border-radius: 12px
Position: relative
Overflow: hidden

Map Container:
- Width: 100%
- Height: 100%

Service Area Overlay:
- Fill: Primary-500
- Fill-opacity: 0.2
- Stroke: Primary-500
- Stroke-width: 2px
- Stroke-dasharray: 5, 5

Caregiver Markers:
- Cluster when close together
- Size: 40px × 40px
- Avatar or icon
- Border: 3px solid White
- Box-shadow: 0 2px 8px rgba(0,0,0,0.2)

Cluster Marker:
- Size: 48px × 48px
- Background: Primary-500
- Color: White
- Border-radius: 50%
- Font: Inter 700, 18px
- Box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4)

Marker Popup:
- Max-width: 280px
- Background: White
- Border-radius: 8px
- Padding: Space-4
- Box-shadow: 0 4px 16px rgba(0,0,0,0.15)
- Arrow: points to marker

Popup Content:
- Avatar: 48px
- Name: Heading 6
- Rating: Star display
- Distance: Caption, with pin icon
- View Profile button: Small

Map Controls:
- Position: absolute
- Right: Space-4
- Top: Space-4
- Display: flex
- Flex-direction: column
- Gap: Space-2

Control Button:
- Size: 40px × 40px
- Background: White
- Border-radius: 8px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.15)
- Icon: 20px
- Cursor: pointer
```

### 2. Distance Filter Slider

```css
Component: DistanceFilterSlider
Padding: Space-6
Background: White
Border-radius: 12px
Border: 1px solid Gray-200

Label:
- Display: flex
- Justify-content: space-between
- Align-items: center
- Margin-bottom: Space-4

Label Text:
- Font: Inter 600, 16px
- Color: Gray-800

Distance Value:
- Font: Inter 700, 20px
- Color: Primary-500

Slider:
- Height: 6px
- Background: Gray-200
- Border-radius: 3px
- Position: relative
- Cursor: pointer

Slider Track:
- Height: 100%
- Background: Primary-500
- Border-radius: inherit

Slider Thumb:
- Size: 24px × 24px
- Background: White
- Border: 4px solid Primary-500
- Border-radius: 50%
- Box-shadow: 0 2px 8px rgba(0,0,0,0.15)
- Position: absolute
- Top: -9px
- Cursor: grab

Active Thumb:
- Cursor: grabbing
- Box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4)

Distance Markers:
- Display: flex
- Justify-content: space-between
- Margin-top: Space-3

Marker:
- Font: Caption
- Color: Gray-500
- Text-align: center
```

---

## Gamification Elements

### 1. Achievement Badge

```css
Component: AchievementBadge
Display: inline-flex
Flex-direction: column
Align-items: center
Padding: Space-4
Border-radius: 12px
Background: White
Border: 1px solid Gray-200
Max-width: 120px
Cursor: pointer
Transition: all 0.2s ease

Hover:
- Transform: translateY(-4px)
- Box-shadow: 0 8px 16px rgba(0,0,0,0.1)

Badge Icon Container:
- Size: 64px × 64px
- Border-radius: 50%
- Background: gradient (based on tier)
- Display: flex
- Align-items: center
- Justify-content: center
- Margin-bottom: Space-3
- Position: relative

Badge Tiers:
- Bronze: gradient(#CD7F32, #B87333)
- Silver: gradient(#C0C0C0, #A8A8A8)
- Gold: gradient(#FFD700, #FFA500)
- Platinum: gradient(#E5E4E2, #D1D0CE)

Icon:
- Size: 32px
- Color: White

Lock Icon (if locked):
- Icon overlay for unearned
- Opacity: 0.5

Badge Name:
- Font: Inter 600, 14px
- Color: Gray-900
- Text-align: center
- Margin-bottom: Space-1

Progress Bar (if in progress):
- Width: 100%
- Height: 4px
- Background: Gray-200
- Border-radius: 2px
- Margin-top: Space-2

Progress Fill:
- Height: 100%
- Background: Success-500
- Border-radius: inherit

Progress Text:
- Font: Caption
- Color: Gray-600
- Text-align: center
- Margin-top: Space-1
```

### 2. Level Progress Bar

```css
Component: LevelProgressBar
Background: White
Border: 1px solid Gray-200
Border-radius: 12px
Padding: Space-6

Header:
- Display: flex
- Justify-content: space-between
- Align-items: center
- Margin-bottom: Space-4

Current Level:
- Display: flex
- Align-items: center
- Gap: Space-3

Level Badge:
- Size: 48px × 48px
- Border-radius: 50%
- Background: gradient-trust
- Color: White
- Font: Manrope 800, 20px
- Display: flex
- Align-items: center
- Justify-content: center

Level Text:
- Font: Heading 5
- Color: Gray-900

Next Level Text:
- Font: Body Small
- Color: Gray-600

Progress Bar:
- Height: 12px
- Background: Gray-200
- Border-radius: 6px
- Position: relative
- Overflow: visible
- Margin-bottom: Space-4

Progress Fill:
- Height: 100%
- Background: gradient-success
- Border-radius: inherit
- Position: relative
- Transition: width 0.6s ease

Progress Indicator:
- Position: absolute
- Right: -8px
- Top: -4px
- Size: 20px × 20px
- Background: Success-500
- Border-radius: 50%
- Border: 3px solid White
- Box-shadow: 0 2px 8px rgba(0,0,0,0.2)

XP Display:
- Display: flex
- Justify-content: space-between
- Font: Caption
- Color: Gray-600

Current XP:
- Color: Success-600
- Font-weight: 600

Rewards Preview:
- Display: flex
- Gap: Space-3
- Margin-top: Space-4
- Padding-top: Space-4
- Border-top: 1px solid Gray-200

Reward Item:
- Display: flex
- Align-items: center
- Gap: Space-2
- Font: Caption
- Color: Gray-600

Reward Icon:
- Size: 16px
- Color: Primary-500
```

### 3. Streak Counter

```css
Component: StreakCounter
Display: inline-flex
Align-items: center
Gap: Space-3
Padding: Space-4 Space-5
Background: gradient-warmth
Border-radius: 12px
Box-shadow: 0 4px 16px rgba(255, 152, 0, 0.3)

Fire Icon:
- Size: 32px
- Color: White
- Animation: flicker 2s infinite

Streak Number:
- Font: Manrope 800, 36px
- Color: White
- Line-height: 1

Streak Label:
- Font: Inter 600, 14px
- Color: White
- Opacity: 0.9
- Text-transform: uppercase
- Letter-spacing: 0.5px

@keyframes flicker {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
```

---

## Onboarding Flow Components

### 1. Welcome Screen

```css
Component: WelcomeScreen
Min-height: 100vh
Display: flex
Flex-direction: column
Align-items: center
Justify-content: center
Padding: Space-8 Space-6
Background: gradient-trust
Text-align: center

Logo:
- Width: 120px
- Margin-bottom: Space-8
- Animation: fadeIn 0.6s ease

Illustration:
- Max-width: 400px
- Margin-bottom: Space-8
- Animation: slideInUp 0.8s ease

Heading:
- Font: Display 2
- Color: White
- Margin-bottom: Space-4
- Animation: slideInUp 0.8s ease 0.2s both

Description:
- Font: Body Large
- Color: White
- Opacity: 0.9
- Max-width: 600px
- Margin-bottom: Space-8
- Animation: slideInUp 0.8s ease 0.4s both

CTA Button:
- Size: Large
- Background: White
- Color: Primary-500
- Animation: slideInUp 0.8s ease 0.6s both

Skip Link:
- Font: Body Small
- Color: White
- Opacity: 0.7
- Margin-top: Space-4
- Text-decoration: underline
```

### 2. Feature Carousel

```css
Component: FeatureCarousel
Max-width: 600px
Margin: 0 auto
Position: relative

Slide Container:
- Display: flex
- Transition: transform 0.4s ease
- Touch-action: pan-y

Slide:
- Min-width: 100%
- Padding: Space-8
- Text-align: center

Feature Icon:
- Size: 80px × 80px
- Background: gradient (feature-specific)
- Border-radius: 20px
- Display: flex
- Align-items: center
- Justify-content: center
- Margin: 0 auto Space-6

Icon:
- Size: 40px
- Color: White

Feature Title:
- Font: Heading 3
- Color: Gray-900
- Margin-bottom: Space-4

Feature Description:
- Font: Body Large
- Color: Gray-600
- Line-height: 1.6
- Margin-bottom: Space-8

Pagination Dots:
- Display: flex
- Justify-content: center
- Gap: Space-2
- Margin-top: Space-6

Dot:
- Size: 8px × 8px
- Border-radius: 50%
- Background: Gray-300
- Cursor: pointer
- Transition: all 0.3s ease

Active Dot:
- Width: 24px
- Border-radius: 4px
- Background: Primary-500

Navigation Buttons:
- Position: absolute
- Bottom: Space-8
- Width: 100%
- Display: flex
- Justify-content: space-between
- Padding: 0 Space-6
```

### 3. Progress Checklist

```css
Component: OnboardingChecklist
Background: White
Border: 1px solid Gray-200
Border-radius: 12px
Padding: Space-6
Max-width: 500px

Header:
- Display: flex
- Justify-content: space-between
- Align-items: center
- Margin-bottom: Space-6

Title:
- Font: Heading 4
- Color: Gray-900

Progress Percentage:
- Font: Inter 700, 20px
- Color: Primary-500

Overall Progress Bar:
- Height: 6px
- Background: Gray-200
- Border-radius: 3px
- Margin-bottom: Space-6
- Overflow: hidden

Progress Fill:
- Height: 100%
- Background: gradient-success
- Transition: width 0.6s ease

Checklist Items:
- Display: flex
- Flex-direction: column
- Gap: Space-4

Checklist Item:
- Display: flex
- Gap: Space-4
- Padding: Space-4
- Border-radius: 8px
- Cursor: pointer
- Transition: background 0.15s ease

Incomplete Item Hover:
- Background: Gray-50

Completed Item:
- Opacity: 0.6

Checkbox:
- Size: 24px × 24px
- Flex-shrink: 0

Content:
- Flex: 1

Item Title:
- Font: Inter 600, 16px
- Color: Gray-900
- Margin-bottom: Space-1

Item Description:
- Font: Body Small
- Color: Gray-600

Action Button:
- Font: Body Small
- Color: Primary-500
- Margin-top: Space-2
- Display: inline-flex
- Align-items: center
- Gap: Space-1

Completion Celebration:
- Text-align: center
- Padding: Space-8
- Background: Success-50
- Border-radius: 12px
- Animation: scaleIn 0.4s ease

Celebration Icon:
- Size: 64px
- Animation: bounce 0.6s ease

Celebration Text:
- Font: Heading 4
- Color: Success-700
- Margin-top: Space-4
```

---

## Error States & Empty States

### 1. Form Error Summary

```css
Component: ErrorSummary
Background: Error-50
Border: 1px solid Error-200
Border-radius: 8px
Padding: Space-5
Margin-bottom: Space-6

Header:
- Display: flex
- Align-items: flex-start
- Gap: Space-3
- Margin-bottom: Space-4

Error Icon:
- Size: 24px
- Color: Error-500
- Flex-shrink: 0

Title:
- Font: Inter 600, 16px
- Color: Error-700

Error List:
- Display: flex
- Flex-direction: column
- Gap: Space-2
- Padding-left: Space-8

Error Item:
- Display: flex
- Align-items: center
- Gap: Space-2
- Font: Body Small
- Color: Error-600
- Cursor: pointer
- Transition: color 0.15s ease

Hover:
- Color: Error-700
- Text-decoration: underline

Bullet:
- Size: 4px × 4px
- Background: Error-500
- Border-radius: 50%
```

### 2. Network Error Screen

```css
Component: NetworkErrorScreen
Display: flex
Flex-direction: column
Align-items: center
Justify-content: center
Min-height: 400px
Padding: Space-8
Text-align: center

Error Illustration:
- Width: 240px
- Margin-bottom: Space-8
- Opacity: 0.8

Error Code:
- Font: Display 1
- Color: Gray-300
- Margin-bottom: Space-4

Error Title:
- Font: Heading 2
- Color: Gray-900
- Margin-bottom: Space-3

Error Message:
- Font: Body Large
- Color: Gray-600
- Max-width: 500px
- Line-height: 1.6
- Margin-bottom: Space-8

Actions:
- Display: flex
- Gap: Space-4
- Justify-content: center

Retry Button:
- Primary button
- Icon: RefreshCw

Go Home Button:
- Secondary button
- Icon: Home

Connection Status:
- Display: flex
- Align-items: center
- Gap: Space-2
- Margin-top: Space-6
- Font: Caption
- Color: Gray-500

Status Indicator:
- Size: 8px × 8px
- Border-radius: 50%
- Background: Error-500 (offline) or Success-500 (online)
```

### 3. No Results Found

```css
Component: NoResults
Display: flex
Flex-direction: column
Align-items: center
Padding: Space-16 Space-6
Text-align: center

Search Icon:
- Size: 80px
- Color: Gray-300
- Margin-bottom: Space-6

Heading:
- Font: Heading 3
- Color: Gray-900
- Margin-bottom: Space-3

Message:
- Font: Body Large
- Color: Gray-600
- Max-width: 500px
- Margin-bottom: Space-6

Suggestions:
- Background: Gray-50
- Border-radius: 8px
- Padding: Space-5
- Max-width: 400px
- Margin-bottom: Space-6

Suggestions Title:
- Font: Inter 600, 14px
- Color: Gray-700
- Margin-bottom: Space-3

Suggestion List:
- Font: Body Small
- Color: Gray-600
- Text-align: left
- Line-height: 1.8

Suggestion Item:
- Display: list-item
- Margin-left: Space-5

Clear Filters Button:
- Secondary button
- Icon: X
```

---

## Print Styles

```css
@media print {
  /* Hide navigation and UI elements */
  header, nav, .sidebar, .fab, .bottom-nav,
  button, .modal-backdrop, .toast, footer {
    display: none !important;
  }

  /* Reset colors for readability */
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt;
  }

  /* Page setup */
  @page {
    margin: 2cm;
    size: A4 portrait;
  }

  /* Avoid page breaks inside elements */
  .card, .profile-card, .review-card,
  table, figure, img {
    page-break-inside: avoid;
  }

  /* Remove shadows and rounded corners */
  * {
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  /* Show URLs for links */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 10pt;
    color: #666;
  }

  /* Hide decorative images */
  img[alt=""] {
    display: none;
  }

  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background: #f5f5f5;
    font-weight: bold;
  }
}
```

---

## Component Testing Checklist

### Visual Regression Testing
- [ ] All states rendered correctly (default, hover, active, disabled)
- [ ] Colors match design system exactly
- [ ] Spacing follows 8pt grid
- [ ] Typography sizes and weights correct
- [ ] Border radius consistent
- [ ] Shadows match specifications
- [ ] Icons properly aligned and sized

### Interaction Testing
- [ ] Click/tap targets minimum 44px
- [ ] Hover states on desktop
- [ ] Active states on interaction
- [ ] Focus states visible and styled
- [ ] Loading states implemented
- [ ] Error states clear and helpful
- [ ] Success feedback provided
- [ ] Disabled states non-interactive

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] ARIA attributes present
- [ ] Color contrast WCAG AA compliant
- [ ] Focus trap in modals
- [ ] Escape closes overlays
- [ ] Alt text on images
- [ ] Form labels associated

### Responsive Testing
- [ ] Mobile (320px-767px) works
- [ ] Tablet (768px-1024px) works
- [ ] Desktop (1024px+) works
- [ ] Touch gestures on mobile
- [ ] Mouse interactions on desktop
- [ ] Text readable at all sizes
- [ ] Images scale appropriately
- [ ] No horizontal scroll

### Performance Testing
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Animations use GPU properties
- [ ] No layout shifts (CLS)
- [ ] Fast interaction time
- [ ] Bundle size reasonable

### Cross-browser Testing
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
- [ ] iOS Safari
- [ ] Android Chrome

---

## Advanced CSS Techniques

### 1. Custom Scrollbar Styling

```css
/* Webkit browsers (Chrome, Safari, Edge) */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: Gray-100;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: Gray-400;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: Gray-500;
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: Gray-400 Gray-100;
}
```

### 2. Glassmorphism Effect

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Dark mode variant */
.glass-card-dark {
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### 3. Text Gradient

```css
.gradient-text {
  background: linear-gradient(135deg, Primary-500, Secondary-500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
```

### 4. Smooth Scroll

```css
html {
  scroll-behavior: smooth;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### 5. Custom Focus Visible

```css
/* Remove default outline */
*:focus {
  outline: none;
}

/* Custom focus for keyboard navigation only */
*:focus-visible {
  outline: 2px solid Primary-500;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Exception for inputs (always show focus) */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: Primary-500;
  box-shadow: 0 0 0 4px Primary-50;
}
```

### 6. Clamp for Responsive Typography

```css
/* Fluid typography that scales between viewport sizes */
.fluid-heading {
  font-size: clamp(28px, 5vw, 48px);
  /* min: 28px, preferred: 5vw, max: 48px */
}

.fluid-body {
  font-size: clamp(14px, 2vw, 16px);
}
```

### 7. Container Queries (Modern browsers)

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Adjust layout based on container width, not viewport */
@container card (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## Micro-copy & Content Guidelines

### Button Labels

**Primary Actions:**
- ✓ "Find a Caregiver" (specific, action-oriented)
- ✗ "Search" (too generic)
- ✓ "Book Now" (urgent, clear)
- ✗ "Submit" (unclear what happens)

**Secondary Actions:**
- ✓ "Learn More" (informative)
- ✓ "View Profile" (clear destination)
- ✓ "Save for Later" (preserves work)

**Destructive Actions:**
- ✓ "Delete Account" (clear consequence)
- ✗ "Remove" (ambiguous)
- Include confirmation: "Yes, Delete" / "Cancel"

### Error Messages

**Good Error Messages:**
- Explain what happened
- Why it happened
- How to fix it

Examples:
- ✓ "This email is already registered. Try logging in or use a different email."
- ✗ "Error 422"
- ✓ "Password must be at least 8 characters with one number"
- ✗ "Invalid password"

### Empty States

**Formula: Explain + Encourage + Action**
- "No messages yet. Start a conversation with a caregiver to get help finding the perfect match."
- "Your favorites list is empty. Browse caregivers and tap the heart icon to save profiles you like."

### Success Messages

**Be Specific and Actionable:**
- ✓ "Profile updated! Caregivers can now see your new photo."
- ✗ "Success"
- ✓ "Booking confirmed for June 15 at 2:00 PM. We've sent details to your email."

### Loading States

**Set Expectations:**
- "Finding caregivers near you..."
- "Verifying your payment..."
- "Uploading your documents..."

### Form Labels

**Be Conversational:**
- ✓ "What's your phone number?" 
- ✗ "Phone Number:"
- ✓ "Tell us about your experience"
- ✗ "Experience Description"

---

## SEO Considerations

### Meta Tags Template

```html
<!-- Primary Meta Tags -->
<title>Find Trusted Caregivers Near You | CarePlatform</title>
<meta name="title" content="Find Trusted Caregivers Near You | CarePlatform">
<meta name="description" content="Connect with background-checked caregivers for child care, senior care, pet care, and more. Book trusted care in your neighborhood.">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://careplatform.com/">
<meta property="og:title" content="Find Trusted Caregivers Near You | CarePlatform">
<meta property="og:description" content="Connect with background-checked caregivers for child care, senior care, pet care, and more.">
<meta property="og:image" content="https://careplatform.com/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://careplatform.com/">
<meta property="twitter:title" content="Find Trusted Caregivers Near You | CarePlatform">
<meta property="twitter:description" content="Connect with background-checked caregivers for child care, senior care, pet care, and more.">
<meta property="twitter:image" content="https://careplatform.com/twitter-image.jpg">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "CarePlatform",
  "image": "https://careplatform.com/logo.png",
  "description": "Trusted caregiver marketplace",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "15000"
  }
}
</script>
```

### Semantic HTML Structure

```html
<!-- Use semantic elements for better SEO -->
<header>
  <nav aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>

<main>
  <article>
    <h1>Main Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <!-- Section content -->
    </section>
  </article>
</main>

<aside>
  <!-- Sidebar content -->
</aside>

<footer>
  <!-- Footer content -->
</footer>
```

---

## Email Template Design

### Email Container

```css
/* Email-safe CSS (inline styles recommended) */
.email-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #ffffff;
}

.email-header {
  padding: 32px 24px;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  text-align: center;
}

.email-logo {
  width: 120px;
  height: auto;
}

.email-body {
  padding: 40px 24px;
  color: #333333;
  line-height: 1.6;
}

.email-button {
  display: inline-block;
  padding: 14px 32px;
  background-color: #FF9800;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin: 24px 0;
}

.email-footer {
  padding: 24px;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 12px;
  color: #666666;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .email-container {
    background-color: #1e1e1e;
  }
  .email-body {
    color: #e0e0e0;
  }
}
```

### Email Types

**Booking Confirmation:**
- Clear subject: "Booking Confirmed: [Caregiver Name] on [Date]"
- Booking details prominently displayed
- Calendar add-to button
- Caregiver contact info
- Cancellation policy
- Primary CTA: "View Booking Details"

**Profile View Notification:**
- Subject: "Good news! [Name] viewed your profile"
- Brief profile summary
- CTA: "View Their Profile"
- Secondary CTA: "Send a Message"

**Review Request:**
- Subject: "How was your experience with [Name]?"
- Send 24 hours after service completion
- Star rating buttons (clickable)
- Text feedback option
- CTA: "Leave a Review"

---

## Analytics & Tracking

### Key Events to Track

**User Journey:**
- Page views
- Search performed
- Filter applied
- Profile viewed
- Message sent
- Booking started
- Booking completed
- Payment successful

**Engagement:**
- Time on page
- Scroll depth
- Video plays
- Document downloads
- Feature usage
- Return visits

**Conversion Funnel:**
```
Visitor → Search → Profile View → Message → Booking → Payment → Confirmation
```

Track drop-off at each stage.

### Heatmap Areas

**High Priority:**
- Hero section
- Search bar
- Featured caregivers
- CTA buttons
- Navigation menu
- Filter panel
- Profile cards

---

## Launch Checklist

### Pre-Launch

**Design:**
- [ ] Design system finalized
- [ ] All components documented
- [ ] Responsive designs approved
- [ ] Accessibility audit completed
- [ ] Brand guidelines established

**Development:**
- [ ] Component library built
- [ ] All pages responsive
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] SEO implemented
- [ ] Analytics integrated
- [ ] Error tracking setup

**Content:**
- [ ] All copy finalized
- [ ] Images optimized
- [ ] Alt text written
- [ ] Meta descriptions written
- [ ] Legal pages complete

**Testing:**
- [ ] User acceptance testing
- [ ] Load testing
- [ ] Security audit
- [ ] Accessibility testing
- [ ] Mobile device testing

### Post-Launch

**Monitor:**
- [ ] Analytics dashboard
- [ ] Error logs
- [ ] User feedback
- [ ] Performance metrics
- [ ] Conversion rates

**Iterate:**
- [ ] A/B testing plan
- [ ] User feedback reviews
- [ ] Performance improvements
- [ ] Feature enhancements
- [ ] Design refinements

---

## Component Library Structure

### Recommended File Organization

```
/design-system
  /tokens
    - colors.css
    - typography.css
    - spacing.css
    - shadows.css
  /components
    /atoms
      - Button.jsx
      - Input.jsx
      - Badge.jsx
      - Icon.jsx
    /molecules
      - InputGroup.jsx
      - Card.jsx
      - SearchBar.jsx
    /organisms
      - Header.jsx
      - Footer.jsx
      - ProfileCard.jsx
      - BookingForm.jsx
    /templates
      - LandingPage.jsx
      - SearchResults.jsx
      - ProfilePage.jsx
  /utils
    - helpers.js
    - validators.js
    - formatters.js
  /hooks
    - useMediaQuery.js
    - useDebounce.js
    - useIntersectionObserver.js
```

### Component Documentation Template

```markdown
# Component Name

## Description
Brief description of what the component does.

## Usage
```jsx
import { ComponentName } from '@/components';

<ComponentName
  prop1="value"
  prop2={true}
/>
```

## Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| prop1 | string | - | Yes | Description |
| prop2 | boolean | false | No | Description |

## Variants
- Default
- Primary
- Secondary
- Error

## States
- Default
- Hover
- Active
- Disabled
- Loading

## Accessibility
- Keyboard navigation: Tab, Enter, Space
- ARIA attributes: role, aria-label
- Screen reader: Announces correctly

## Examples
[Visual examples of different states and variants]

## Related Components
- ComponentA
- ComponentB
```

---

## Future Enhancements Roadmap

### Phase 1 (3 months)
- [ ] Advanced filtering system
- [ ] Video profile introductions
- [ ] In-app messaging improvements
- [ ] Mobile app launch (React Native)
- [ ] Push notifications

### Phase 2 (6 months)
- [ ] AI-powered caregiver matching
- [ ] Integrated video calls
- [ ] Smart scheduling assistant
- [ ] Loyalty program
- [ ] Referral system

### Phase 3 (12 months)
- [ ] Background check API integration
- [ ] Insurance partnerships
- [ ] Training certification programs
- [ ] Community forums
- [ ] Multi-language support (10+ languages)

### Experimental Features
- [ ] AR preview (see caregiver in your space)
- [ ] Voice search
- [ ] Chatbot assistant
- [ ] Predictive scheduling
- [ ] Smart home integration

---

## Design System Maintenance

### Monthly Reviews
- Component usage analytics
- Performance metrics
- User feedback themes
- Accessibility issues
- Browser compatibility issues

### Quarterly Updates
- New component additions
- Component deprecations
- Design token adjustments
- Documentation updates
- Breaking changes (major versions only)

### Yearly Audits
- Complete accessibility audit
- Performance audit
- Security audit
- Brand refresh evaluation
- Technology stack review

---

## Collaboration Guidelines

### Designer-Developer Handoff

**Designers Provide:**
- Figma files with components
- Design specifications document
- Interactive prototypes
- User flow diagrams
- Asset exports (SVG, PNG, WebP)
- Animation specifications
- Responsive breakpoint designs

**Developers Provide:**
- Component implementation status
- Technical constraints feedback
- Performance considerations
- Browser compatibility notes
- API integration requirements

### Design Review Process

1. **Initial Design** - Designer creates mockups
2. **Peer Review** - Design team feedback
3. **Stakeholder Review** - Business approval
4. **Technical Review** - Developer feasibility
5. **User Testing** - Validation with users
6. **Implementation** - Development phase
7. **QA Review** - Quality assurance
8. **Launch** - Deploy to production

### Communication Channels

- **Slack:** #design-system (daily updates)
- **Jira:** Design system project board
- **Figma:** Design file comments
- **GitHub:** Code reviews and PRs
- **Weekly Sync:** Design + Engineering meeting
- **Documentation:** Confluence wiki

---

## Legal & Compliance

### GDPR Compliance
- [ ] Cookie consent banner
- [ ] Privacy policy linked
- [ ] Data deletion requests
- [ ] User data export
- [ ] Clear consent language
- [ ] Opt-out mechanisms

### COPPA Compliance (if serving children)
- [ ] Parental consent flows
- [ ] Age verification
- [ ] Limited data collection
- [ ] Educational disclosure

### ADA/WCAG Compliance
- [ ] WCAG 2.1 Level AA minimum
- [ ] Accessibility statement page
- [ ] Contact for accessibility issues
- [ ] Regular audits
- [ ] Screen reader testing

### Terms & Conditions
- [ ] Clear service terms
- [ ] Booking policies
- [ ] Cancellation policies
- [ ] Refund policies
- [ ] User responsibilities
- [ ] Dispute resolution

---

## Support & Resources

### Internal Resources
- Design System Figma Library
- Component Storybook
- Code Repository (GitHub)
- Documentation Wiki
- Slack Community

### External Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Accessibility Resources](https://www.a11yproject.com/)
- [Web Performance](https://web.dev/performance)

### Learning Resources
- Design System Principles
- Component-Driven Development
- Accessibility Best Practices
- Performance Optimization
- React Patterns

### Tools
- **Design:** Figma, Adobe XD, Sketch
- **Prototyping:** Figma, Framer
- **Development:** VS Code, WebStorm
- **Testing:** Jest, React Testing Library, Cypress
- **Accessibility:** axe DevTools, WAVE, Lighthouse
- **Performance:** Lighthouse, WebPageTest
- **Version Control:** Git, GitHub
- **CI/CD:** GitHub Actions, Vercel
- **Monitoring:** Sentry, LogRocket, Google Analytics

---

## Glossary

**Accessibility (a11y):** Design practice ensuring usability for people with disabilities

**Atomic Design:** Design methodology organizing components into atoms, molecules, organisms, templates, and pages

**Breakpoint:** Viewport width where layout changes (responsive design)

**Color Contrast:** Difference in luminance between foreground and background colors

**Component Library:** Collection of reusable UI components

**Design System:** Complete set of standards, components, and guidelines

**Design Token:** Design decision represented as data (color, spacing, typography)

**Figma:** Collaborative design tool

**Focus State:** Visual indicator showing which element has keyboard focus

**Gradient:** Smooth color transition

**Grid System:** Layout structure using columns and rows

**Hover State:** Appearance when cursor is over an element

**Micro-interaction:** Small, functional animations providing feedback

**Modal:** Dialog box overlaying main content

**Progressive Disclosure:** Revealing information gradually to reduce cognitive load

**Responsive Design:** Adapting layout to different screen sizes

**Semantic HTML:** Using HTML elements according to their meaning

**State:** Different appearances of a component (hover, active, disabled)

**Tailwind CSS:** Utility-first CSS framework

**Toast:** Brief notification message

**Typography Scale:** System of related font sizes

**WCAG:** Web Content Accessibility Guidelines

**Whitespace:** Empty space around elements (also called negative space)

---

## Conclusion

This design system provides comprehensive specifications for building a modern, accessible, and user-friendly care marketplace platform. It emphasizes trust, safety, and ease of use—critical factors for connecting families with caregivers.

### Key Takeaways

1. **Trust-First Design:** Every component reinforces safety and reliability
2. **Accessibility:** WCAG 2.1 AA compliance throughout
3. **Responsive:** Mobile-first approach for 70% mobile users
4. **Performance:** Optimized for fast loading and smooth interactions
5. **Scalability:** Component-based architecture for easy maintenance
6. **Consistency:** Design tokens ensure visual harmony
7. **User-Centric:** Every decision based on user needs and feedback

### Next Steps

1. **Review:** Share with stakeholders for feedback
2. **Prototype:** Build interactive prototypes in Figma
3. **Test:** Conduct user testing with target audience
4. **Build:** Implement component library
5. **Document:** Maintain living documentation
6. **Iterate:** Continuously improve based on data

### Success Metrics

**User Satisfaction:**
- Net Promoter Score (NPS) > 50
- User satisfaction rating > 4.5/5
- Task completion rate > 90%

**Performance:**
- Page load time < 2 seconds
- Time to interactive < 3 seconds
- Lighthouse score > 90

**Accessibility:**
- Zero critical accessibility errors
- WCAG 2.1 AA compliant
- Keyboard navigation 100% functional

**Business:**
- Conversion rate improvement
- User retention increase
- Support ticket reduction

---

**Document Version:** 1.0.0  
**Last Updated:** November 2025  
**Authors:** Design & Engineering Teams  
**Status:** Complete & Ready for Implementation

**For Questions or Contributions:**
- GitHub Issues: [link]
- Slack: #design-system
- Email: design-system@careplatform.com

---

*This comprehensive design system documentation is now complete and ready for AI agents and developers to implement a world-class care marketplace platform.*
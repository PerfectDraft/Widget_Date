---
name: Widget Date
colors:
  surface: '#fff8f4'
  surface-dim: '#e1d9d2'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2eb'
  surface-container: '#f5ece5'
  surface-container-high: '#efe7e0'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#524346'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f8efe8'
  outline: '#847376'
  outline-variant: '#d6c1c5'
  surface-tint: '#894c5c'
  primary: '#894c5c'
  on-primary: '#ffffff'
  primary-container: '#f4a7b9'
  on-primary-container: '#733949'
  inverse-primary: '#ffb1c3'
  secondary: '#605e58'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2d9'
  on-secondary-container: '#66645e'
  tertiary: '#745a2f'
  on-tertiary: '#ffffff'
  tertiary-container: '#d9b784'
  on-tertiary-container: '#5f471e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#ffb1c3'
  on-primary-fixed: '#380a1a'
  on-primary-fixed-variant: '#6e3545'
  secondary-fixed: '#e6e2d9'
  secondary-fixed-dim: '#c9c6be'
  on-secondary-fixed: '#1c1c17'
  on-secondary-fixed-variant: '#484741'
  tertiary-fixed: '#ffdeac'
  tertiary-fixed-dim: '#e3c18d'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#5a431a'
  background: '#fff8f4'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  headline-xl:
    fontFamily: Epilogue
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  stack-gap: 16px
  section-gap: 48px
  gutter: 16px
---

## Brand & Style
The personality of this design system is "Modern Romanticism." It is designed to feel like a digital love letter—organized, serene, and warm, yet functionally precise for scheduling. It prioritizes emotional resonance over clinical efficiency, aiming to make the act of planning a date feel as special as the date itself.

The aesthetic direction blends **Minimalism** with subtle **Glassmorphism**. High levels of whitespace (airiness) are paired with translucent layers and soft, organic shapes to create a sense of lightness and approachability. The interface should feel "breathable," avoiding clutter to allow high-quality imagery and thoughtful typography to take center stage.

## Colors
The palette is rooted in a "Warm Sunset" spectrum. The **Primary** color is a soft, dusty rose used for call-to-actions and key highlights. The **Secondary** color is a rich, warm cream that serves as the primary canvas color, replacing harsh whites to reduce eye strain and increase the "cozy" factor. 

The **Tertiary** gold is reserved for accents, iconography, and decorative borders, providing a sense of premium quality. Neutrals are kept warm—avoiding pure blacks or greys—utilizing deep charcoal-browns for text to maintain a soft contrast that remains highly readable.

## Typography
The typography strategy pairs the distinctive, editorial feel of **Epilogue** for headlines with the friendly, rounded legibility of **Plus Jakarta Sans** for interface elements and body copy. 

Headlines use tighter letter spacing and bold weights to create a sense of modern confidence. Body text utilizes generous line heights (1.6x) to contribute to the airy, clean layout requested. Labels and utility text use slightly increased letter spacing and semi-bold weights in Plus Jakarta Sans to ensure they remain functional even at smaller scales.

## Layout & Spacing
This design system employs a **Fixed Grid** model for core content containers (centered on large screens) while using a fluid 4-column system for mobile. The spacing rhythm is based on an 8px base unit, but it leans heavily into "luxury spacing"—purposely over-allocating padding to avoid any sense of crowding.

Vertical rhythm is defined by large section gaps (48px+) to separate different phases of the dating schedule. Horizontal margins are set to a generous 24px on mobile to frame the content comfortably.

## Elevation & Depth
Depth is created through **Ambient Shadows** and **Tonal Layering**. Shadows must never be pure black; they are tinted with the primary rose or tertiary gold color at extremely low opacities (5-10%) to maintain a soft, romantic glow.

- **Surface Level 0:** The primary cream background (#FFFBF2).
- **Surface Level 1:** Raised cards with a 20px blur, 4px Y-offset shadow.
- **Surface Level 2:** Floating elements (like navigation bars) using a backdrop-filter (blur: 12px) and 60% opacity of the background color to achieve a glassmorphic effect.

## Shapes
The shape language is dominated by **Pill-shaped** and ultra-rounded containers. This softness removes the "clinical" feel of standard software. 

Corner radii are applied consistently:
- **Buttons and Chips:** Fully pill-shaped (rounded-full).
- **Cards and Containers:** Large 32px (2rem) radius.
- **Image Containers:** Use a "Squircle" aesthetic where possible, or a minimum 24px radius to ensure they feel organic and integrated into the soft layout.

## Components

### Buttons
Primary buttons are pill-shaped with a subtle gradient from the primary rose to a slightly warmer tint. They feature a soft shadow that matches the button's hue. Secondary buttons use a gold-tinted outline (2px) with a cream-filled center.

### Cards
Cards are the primary vehicle for scheduling information. They feature a 32px border radius, a white or very light cream background, and a soft ambient shadow. Internal padding should be no less than 24px to maintain the airy aesthetic.

### Image Containers
Images represent the "aspiration" of the date. They should always have a high border radius (24px+). For premium content, a 1px soft gold inner border can be used to frame the image, giving it a "gallery" feel.

### Chips & Tags
Used for date categories (e.g., "Dinner," "Outdoor"). These are small, pill-shaped elements with low-saturation pastel backgrounds and high-contrast text.

### Form Inputs
Input fields use the same 32px radius as cards. The stroke is a very light gold when inactive, turning into a soft rose pink when focused. Labels always sit above the input in the semi-bold Label-sm style.
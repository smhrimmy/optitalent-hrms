---
name: OptiTalent High-Density Enterprise
colors:
  surface: '#fff7fa'
  surface-dim: '#e6d5e2'
  surface-bright: '#fff7fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ffeffb'
  surface-container: '#fae9f6'
  surface-container-high: '#f4e3f0'
  surface-container-highest: '#eedeea'
  on-surface: '#221921'
  on-surface-variant: '#514250'
  inverse-surface: '#372d37'
  inverse-on-surface: '#fdecf9'
  outline: '#837282'
  outline-variant: '#d5c0d2'
  surface-tint: '#9c21b0'
  primary: '#9c21af'
  on-primary: '#ffffff'
  primary-container: '#b941cb'
  on-primary-container: '#100014'
  inverse-primary: '#faabff'
  secondary: '#824988'
  on-secondary: '#ffffff'
  secondary-container: '#fab5fc'
  on-secondary-container: '#79407f'
  tertiary: '#666000'
  on-tertiary: '#ffffff'
  tertiary-container: '#b6ae48'
  on-tertiary-container: '#454100'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd6fd'
  primary-fixed-dim: '#faabff'
  on-primary-fixed: '#36003f'
  on-primary-fixed-variant: '#7c008e'
  secondary-fixed: '#ffd6fd'
  secondary-fixed-dim: '#f4aff7'
  on-secondary-fixed: '#35003f'
  on-secondary-fixed-variant: '#68316e'
  tertiary-fixed: '#efe679'
  tertiary-fixed-dim: '#d2ca60'
  on-tertiary-fixed: '#1f1c00'
  on-tertiary-fixed-variant: '#4d4800'
  background: '#fff7fa'
  on-background: '#221921'
  surface-variant: '#eedeea'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  tabular-nums:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style
The design system is engineered for high-stakes workforce management, prioritizing clarity, trust, and professional efficiency. The visual style is **Corporate Modern** with a focus on high information density. It avoids decorative trends like glassmorphism in favor of a rigid, logical hierarchy that reduces cognitive load for HR professionals managing large datasets. 

The emotional response should be one of "controlled capability"—the UI feels like a powerful, reliable tool rather than a social media interface. It employs heavy whitespace for focus, but maintains tight component sizing to ensure maximum data visibility on a single screen.

## Colors
The palette is rooted in a "Regal Orchid" primary tone to project modern leadership and distinctiveness. "Muted Plum" is utilized for secondary actions and metadata to maintain a sophisticated, monochromatic-adjacent harmony without sacrificing functional clarity.

- **Surface Tiers:** Use `#FFFFFF` for primary cards and a neutral-tinted off-white for the global background to create subtle contrast between the canvas and containers.
- **Semantic Colors:** Emerald, Amber, and Rose are reserved strictly for status indicators (e.g., "Active," "On Leave," "Terminated"). The Tertiary "Citrine" provides a distinct path for specialized highlights or warnings.
- **Contrast:** Ensure all text on primary backgrounds meets WCAG AA standards. Neutral tones are skewed toward a warm, professional mauve-grey.

## Typography
Inter is the foundation of this design system, chosen for its exceptional legibility in dense data environments. 

- **Tabular Figures:** For all payroll, headcount, and time-tracking metrics, the `tnum` (tabular numbers) OpenType feature must be enabled to ensure columns of numbers align vertically.
- **Scale:** The system uses a 14px base for body text to maximize information density while maintaining readability.
- **Hierarchy:** Use Semibold (600) for section headers and Medium (500) for interactive labels. Avoid using weights below 400 to ensure clarity on low-resolution enterprise monitors.

## Layout & Spacing
The design system utilizes a **12-column fluid grid** with a maximum content width of 1440px for standard dashboards.

- **Density:** Components follow a 4px baseline grid. For high-density views (tables, directories), use the "Compact" rhythm where vertical padding is reduced to 8px.
- **Breakpoints:** 
  - Mobile: 4 columns, 16px margins.
  - Tablet: 8 columns, 24px margins.
  - Desktop: 12 columns, 24px margins.
- **Alignment:** Consistent left-alignment is mandatory for all data entries to facilitate rapid vertical scanning.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and minimal, sharp shadows. This system avoids floating elements, preferring to anchor components to the surface.

- **Level 0 (Base):** Neutral-tinted background.
- **Level 1 (Card):** White background with a 1px border (low-opacity neutral) and no shadow. Used for standard page sections.
- **Level 2 (Active/Hover):** White background with a subtle shadow (0px 4px 6px -1px rgba(0, 0, 0, 0.1)). Used for clickable cards or active states.
- **Level 3 (Overlays):** Modals and dropdowns use a more pronounced shadow and a defined neutral border to distinguish them from the base UI.

## Shapes
The system uses a "Soft" corner logic to maintain a professional, modern feel without appearing too casual or "bubbly."

- **Standard Radius:** 4px for buttons, input fields, and small components.
- **Container Radius:** 8px for cards and large panels.
- **Fully Rounded:** Only used for status badges (chips) and user avatars to provide a distinct visual break from the structural grid.

## Components
- **Buttons:** Primary buttons use the Regal Orchid (#b941cb) background with white text. Secondary buttons use a Muted Plum border with no fill. Padding should be 8px top/bottom and 16px left/right.
- **Data Tables:** The most critical component. Use a 1px horizontal-only border using the neutral-variant tone. Row height is fixed at 48px for standard and 40px for compact. Headers must be `label-md` in uppercase with a subtle background tint.
- **Input Fields:** Use a 1px neutral border. On focus, the border transitions to Primary Orchid with a 2px "halo" (low-opacity orchid).
- **Status Chips:** High-contrast text on low-opacity backgrounds (e.g., Emerald text on 10% Emerald background) for immediate recognition without overwhelming the layout.
- **Search:** Persistent global search in the top navigation with a keyboard shortcut hint (`Cmd+K`).
- **Cards:** Use for high-level metrics (KPIs). Include a small sparkline or trend indicator in the bottom right corner.
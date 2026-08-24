import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-source-sans)', 'sans-serif'],
        headline: ['var(--font-fraunces)', 'serif'],
        code: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        // Custom palette from design.md
        primary: '#fe6e00',
        'primary-strong': '#ff6b00',
        'primary-warm': '#ffb74d',
        'primary-focus': '#f97015',
        'on-primary': '#ffffff',
        shell: { base: '#000000', on: '#ffffff', border: '#ffffff' },
        success: '#00c758',
        warning: '#edb200',
        danger: '#fb2c36',
        info: '#3080ff',
        'status-mock-bg': '#fef9c2',
        'status-mock-fg': '#874b00',
        'status-planned-bg': '#f3f4f6',
        'status-planned-fg': '#364153',
        'status-development-bg': '#dbeafe',
        'status-development-fg': '#1447e6',
        'status-integrated-bg': '#f3e8ff',
        'status-integrated-fg': '#8200da',
        'status-production-bg': '#dcfce7',
        'status-production-fg': '#016630',
        'dark-background': '#413830',
        'dark-surface': '#4a423a',
        'dark-on-surface': '#fafaf9',
        'dark-on-surface-muted': '#b9b3ac',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        pill: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '64px',
        'container-padding': '32px',
      },
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;


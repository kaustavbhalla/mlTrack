import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#fbf9f6',
          dim: '#dbdad7',
          bright: '#fbf9f6',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3f0',
          container: '#efeeeb',
          'container-high': '#eae8e5',
          'container-highest': '#e4e2df',
          tint: '#486550',
          variant: '#e4e2df',
        },
        'on-surface': '#1b1c1a',
        'on-surface-variant': '#424843',
        'on-background': '#1b1c1a',
        primary: {
          DEFAULT: '#36533f',
          container: '#4e6b56',
          fixed: '#caebd0',
          'fixed-dim': '#aeceb5',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#caead0',
        'on-primary-fixed': '#042010',
        'on-primary-fixed-variant': '#314d3a',
        secondary: {
          DEFAULT: '#615e57',
          container: '#e8e2d9',
          fixed: '#e8e2d9',
          'fixed-dim': '#cbc6bd',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#68645d',
        'on-secondary-fixed': '#1d1b16',
        'on-secondary-fixed-variant': '#494640',
        tertiary: {
          DEFAULT: '#70402e',
          container: '#8c5744',
          fixed: '#ffdbcf',
          'fixed-dim': '#fbb69f',
        },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#ffdace',
        'on-tertiary-fixed': '#341004',
        'on-tertiary-fixed-variant': '#6a3a29',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        outline: {
          DEFAULT: '#727972',
          variant: '#c2c8c1',
        },
        inverse: {
          surface: '#30312f',
          'on-surface': '#f2f0ed',
          primary: '#aeceb5',
        },
        // Domain colors
        domain: {
          ml: { bg: '#edf2ee', text: '#4e6b56', border: 'rgba(78, 107, 86, 0.2)' },
          dl: { bg: '#ebf0f3', text: '#4d6475', border: 'rgba(77, 100, 117, 0.2)' },
          ai: { bg: '#f6eeeb', text: '#a36a56', border: 'rgba(163, 106, 86, 0.2)' },
          agents: { bg: '#f5f1e6', text: '#8c733e', border: 'rgba(140, 115, 62, 0.2)' },
          other: { bg: '#f0f0f0', text: '#666666', border: 'rgba(102, 102, 102, 0.2)' },
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      spacing: {
        '2xs': '0.25rem',
        xs: '0.375rem',
        sm: '0.5rem',
        md: '0.75rem',
        base: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4.5rem',
      },
      boxShadow: {
        'ambient': '0 1px 2px 0 rgba(43, 41, 39, 0.03), 0 2px 6px -1px rgba(43, 41, 39, 0.02)',
        'focus': '0 0 0 3px rgba(78, 107, 86, 0.12)',
      },
    },
  },
  plugins: [],
}
export default config

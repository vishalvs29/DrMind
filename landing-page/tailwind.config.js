/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#EEF2FF',
                    DEFAULT: '#6366F1',
                    dark: '#4F46E5',
                },
                secondary: {
                    light: '#F0FDFA',
                    DEFAULT: '#14B8A6',
                    dark: '#0D9488',
                },
                surface: {
                    DEFAULT: '#FFFFFF',
                    soft: '#F8FAFC',
                    glass: 'rgba(255, 255, 255, 0.7)',
                },
                mental: {
                    purple: '#8B5CF6',
                    teal: '#2DD4BF',
                    blue: '#3B82F6',
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}

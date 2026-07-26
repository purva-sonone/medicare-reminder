/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Prepare for dark mode option
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                slate: {
                    205: '#e2e8f0', // Soft bordered layout
                    450: '#94a3b8',
                    650: '#475569',
                    655: '#334155',
                    750: '#1e293b',
                    805: '#0f172a',
                },
            },
        },
    },
    plugins: [],
}

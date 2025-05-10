/* eslint-disable global-require */
import { Config } from 'tailwindcss'

const tailwindConfig = {
	darkMode: 'class',
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		screens: {
			desktop: { max: '1440px' },
			tablet: { max: '1280px' },
			mobile: { max: '720px' },
		},
		extend: {
			fontFamily: {
				sans: ['var(--font-outfit)'],
			},
			colors: {
				current: 'currentColor',
				transparent: 'transparent',
				default: 'rgb(var(--color-default) / <alpha-value>)',
				white: 'rgb(var(--color-white) / <alpha-value>)',
				black: 'rgb(var(--color-black) / <alpha-value>)',
				error: 'rgb(var(--color-error) / <alpha-value>)',
				success: 'rgb(var(--color-success) / <alpha-value>)',
				warning: 'rgb(var(--color-warning) / <alpha-value>)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwind-scrollbar')({ nocompatible: true }),
	],
} satisfies Config

export default tailwindConfig

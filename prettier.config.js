/** @type {import('prettier').Config} */
const prettierConfig = {
	tabWidth: 2,
	useTabs: true,
	semi: false,
	singleQuote: true,
	quoteProps: 'as-needed',
	trailingComma: 'all',
	bracketSpacing: true,
	arrowParens: 'avoid',
	plugins: ['prettier-plugin-tailwindcss'],
}

module.exports = prettierConfig

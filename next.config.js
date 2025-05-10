/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	webpack(config) {
		const fileLoaderRule = config.module.rules.find(rule =>
			rule.test?.test?.('.svg'),
		)
		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/,
			},
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
				use: ['@svgr/webpack'],
			},
		)
		fileLoaderRule.exclude = /\.svg$/i

		return config
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
				],
			},
		]
	},
}

module.exports = nextConfig

import { Metadata } from 'next'
import Script from 'next/script'
import { PropsWithChildren } from 'react'

import Maintenance from '#/views/maintainence'

import { ENV_MAP } from '#/constants/env'
import { NAME_MAP } from '#/constants/name'

import jsonLd from '#/libs/metadata'

import { outfit } from '#/styles/fonts'

import Providers from '#/src/providers'
import '#/styles/globals.css'

export async function generateMetadata(): Promise<Metadata> {
	const title = NAME_MAP.SERVICE_NAME
	const description = NAME_MAP.SERVICE_DESCRIPTION

	return {
		title,
		description,
		metadataBase: new URL(`${ENV_MAP.DEFAULT_CENTRAL_URL}`),
		icons: {
			icon: '/logo/logo.png',
		},
		openGraph: {
			title,
			description,
			url: `/`,
			siteName: NAME_MAP.SERVICE_NAME,
			images: [
				{
					url: `/og/small.png`,
					width: 600,
					height: 315,
				},
				{
					url: `/og/large.png`,
					width: 1200,
					height: 600,
				},
			],
			type: 'website',
		},
	}
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" className={`${outfit.className}`}>
			<body>
				{ENV_MAP.DEFAULT_MAINTENANCE === 'true' ? (
					<Maintenance />
				) : (
					<Providers>{children}</Providers>
				)}
			</body>
			<Script
				id="script"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</html>
	)
}

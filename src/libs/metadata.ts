import { ENV_MAP } from '#/constants/env'
import { NAME_MAP } from '#/constants/name'

// https://developers.google.com/search/docs/appearance?hl=en
const jsonLd = [
	{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: NAME_MAP.SERVICE_NAME,
		alternateName: NAME_MAP.SERVICE_ALTERNATE_NAME,
		url: ENV_MAP.DEFAULT_CENTRAL_URL,
	},
	{
		'@context': 'https://schema.org',
		'@type': 'Organization',
		url: ENV_MAP.DEFAULT_CENTRAL_URL,
		logo: `${ENV_MAP.DEFAULT_CENTRAL_URL}/logo/logo.png`,
	},
]

export default jsonLd

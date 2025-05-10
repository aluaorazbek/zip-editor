import * as process from 'process'

export const ENV_MAP = {
	IS_PRODUCTION: process.env.NODE_ENV !== 'production',

	DEFAULT_CENTRAL_URL: process.env.NEXT_PUBLIC_CENTRAL_URL as string,
	DEFAULT_MAINTENANCE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE as string,
}

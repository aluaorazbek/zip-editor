'use client'

import Link from 'next/link'

import { ROUTER_MAP } from '#/constants/router'

function GlobalError({ error }: { error: Error & { digest?: string } }) {
	return (
		<html lang="en">
			<body className="flex min-h-screen items-center justify-center px-4">
				<div className="flex flex-col gap-1.5">
					<h2 className="primary-clip-text text-[2.5rem] font-bold mobile:text-[2rem]">
						500 Error
					</h2>
					<p className="text-sm">{error.message}</p>
				</div>
				<Link href={ROUTER_MAP.HOME} replace className="text-center">
					Go Home
				</Link>
			</body>
		</html>
	)
}

export default GlobalError

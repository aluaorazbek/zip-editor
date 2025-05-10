'use client'

import Link from 'next/link'

import { ROUTER_MAP } from '#/constants/router'

export default function NotFound() {
	return (
		<html lang="en">
			<body className="flex min-h-screen items-center justify-center px-4">
				<div className="flex flex-col gap-1.5">
					<h2 className="text-[2.5rem] font-bold mobile:text-[2rem]">
						404 Error
					</h2>
					<p className="text-xl">Page not found</p>
				</div>
				<Link href={ROUTER_MAP.HOME} replace className="text-center">
					Go Home
				</Link>
			</body>
		</html>
	)
}

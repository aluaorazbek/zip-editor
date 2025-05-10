'use client'

import React, { PropsWithChildren } from 'react'

import RecoilProvider from '#/providers/recoil'

function Providers({ children }: PropsWithChildren) {
	return <RecoilProvider>{children}</RecoilProvider>
}

export default Providers

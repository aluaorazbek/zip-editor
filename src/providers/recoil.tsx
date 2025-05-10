import { PropsWithChildren } from 'react'
import { RecoilRoot } from 'recoil'

function RecoilProvider({ children }: PropsWithChildren) {
	return <RecoilRoot>{children}</RecoilRoot>
}

export default RecoilProvider

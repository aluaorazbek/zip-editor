export interface FileNode {
	name: string
	path: string
	isDirectory: boolean
	children?: FileNode[]
	content?: string
	type?: string
}

export type FileContent = string | ArrayBuffer

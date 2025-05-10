import { FileNode } from '#/types/file'

export const getFileType = (filename: string): string => {
	const ext = filename.toLowerCase().split('.').pop() || ''
	const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
	const textExts = [
		'txt',
		'md',
		'json',
		'xml',
		'html',
		'css',
		'js',
		'ts',
		'jsx',
		'tsx',
		'py',
		'java',
		'c',
		'cpp',
		'h',
		'hpp',
	]
	const docExts = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx']

	if (imageExts.includes(ext)) return 'image'
	if (textExts.includes(ext)) return 'text'
	if (docExts.includes(ext)) return 'document'
	return 'binary'
}

export const sortTree = (nodes: FileNode[]): void => {
	nodes.sort((a, b) => {
		if (a.isDirectory === b.isDirectory) {
			return a.name.localeCompare(b.name)
		}
		return a.isDirectory ? -1 : 1
	})
	nodes.forEach(node => {
		if (node.children) {
			sortTree(node.children)
		}
	})
}

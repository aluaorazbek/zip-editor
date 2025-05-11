import JSZip from 'jszip'
import { useState } from 'react'

import { getFileType, sortTree } from '#/utils/fileUtils'

import { FileNode, FileContent } from '#/types/file'

export const useZipFile = () => {
	const [zipFile, setZipFile] = useState<JSZip | null>(null)
	const [fileTree, setFileTree] = useState<FileNode[]>([])
	const [editorContent, setEditorContent] = useState<string>('')
	const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
	const [fileContent, setFileContent] = useState<FileContent>('')

	const processZipFile = async (file: File) => {
		const zip = new JSZip()
		try {
			const loadedZip = await zip.loadAsync(file)
			setZipFile(loadedZip)

			const rootNode: FileNode = {
				name: file.name,
				path: '',
				isDirectory: true,
				children: [],
			}

			const files = Object.keys(loadedZip.files).sort()

			let commonPrefix = ''
			if (files.length > 0) {
				const firstFile = files[0]
				const lastFile = files[files.length - 1]
				let i = 0
				while (
					i < firstFile.length &&
					i < lastFile.length &&
					firstFile[i] === lastFile[i]
				) {
					i++
				}
				commonPrefix = firstFile.substring(0, i).split('/')[0]
				if (commonPrefix && !commonPrefix.includes('.')) {
					commonPrefix += '/'
				} else {
					commonPrefix = ''
				}
			}

			files.forEach((filePath: string) => {
				const relativePath = commonPrefix
					? filePath.substring(commonPrefix.length)
					: filePath
				const parts = relativePath.split('/').filter(Boolean)
				let currentNode = rootNode

				for (let i = 0; i < parts.length; i++) {
					const part = parts[i]
					const isLast = i === parts.length - 1
					const currentPath = parts.slice(0, i + 1).join('/')

					let node = currentNode.children?.find(n => n.name === part)

					if (!node) {
						node = {
							name: part,
							path: filePath,
							isDirectory: !isLast,
							children: !isLast ? [] : undefined,
						}
						currentNode.children?.push(node)
					}

					if (!isLast) {
						currentNode = node
					}
				}
			})

			sortTree(rootNode.children || [])
			setFileTree([rootNode])
		} catch (error) {
			console.error('Error loading zip file:', error)
		}
	}

	const handleFileSelect = async (node: FileNode) => {
		if (!node.isDirectory && zipFile) {
			// Reset states before loading new file
			setSelectedFile(null)
			setFileContent('')
			setEditorContent('')

			try {
				const file = zipFile.file(node.path)
				if (file) {
					const fileType = getFileType(node.name)

					// Set the selected file first
					setSelectedFile(node)

					if (fileType === 'image') {
						const content = await file.async('arraybuffer')
						setFileContent(content)
					} else if (fileType === 'text') {
						const content = await file.async('string')
						setFileContent(content)
						setEditorContent(content)
					} else if (fileType === 'document' && node.name.endsWith('.docx')) {
						const content = await file.async('arraybuffer')
						setFileContent(content)
					} else {
						const content = await file.async('arraybuffer')
						setFileContent(content)
					}
				}
			} catch (error) {
				console.error('Error reading file:', error)
				// Reset states on error
				setSelectedFile(null)
				setFileContent('')
				setEditorContent('')
			}
		}
	}

	const handleDownload = async () => {
		if (zipFile) {
			if (selectedFile && getFileType(selectedFile.name) === 'text') {
				const file = zipFile.file(selectedFile.path)
				if (file) {
					zipFile.file(selectedFile.path, editorContent)
				}
			}

			const blob = await zipFile.generateAsync({ type: 'blob' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'edited.zip'
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	return {
		zipFile,
		fileTree,
		selectedFile,
		fileContent,
		editorContent,
		setEditorContent,
		handleFileSelect,
		processZipFile,
		handleDownload,
	}
}

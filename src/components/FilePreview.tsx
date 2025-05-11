import { renderAsync } from 'docx-preview'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'

import { getFileType } from '#/utils/fileUtils'

import { FileNode, FileContent } from '#/types/file'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
	ssr: false,
	loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
})

interface FilePreviewProps {
	file: FileNode
	content: FileContent
	onContentChange: (content: string) => void
}

export function FilePreview({
	file,
	content,
	onContentChange,
}: FilePreviewProps): JSX.Element {
	const fileType = getFileType(file.name)
	const [imageUrl, setImageUrl] = useState<string>('')
	const docxContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (imageUrl) {
			URL.revokeObjectURL(imageUrl)
		}

		if (fileType === 'image' && content instanceof ArrayBuffer) {
			try {
				const blob = new Blob([new Uint8Array(content)], {
					type: `image/${file.name.split('.').pop()?.toLowerCase()}`,
				})
				const url = URL.createObjectURL(blob)
				setImageUrl(url)
			} catch (error) {
				console.error('Error creating image preview:', error)
				setImageUrl('')
			}
		} else if (
			fileType === 'document' &&
			file.name.endsWith('.docx') &&
			content instanceof ArrayBuffer &&
			docxContainerRef.current
		) {
			if (docxContainerRef.current) {
				docxContainerRef.current.innerHTML = ''
			}

			renderAsync(content, docxContainerRef.current, docxContainerRef.current, {
				className: 'docx-wrapper',
				inWrapper: true,
				ignoreWidth: false,
				ignoreHeight: false,
				ignoreFonts: false,
				breakPages: true,
				useBase64URL: true,
				renderEndnotes: true,
				renderFootnotes: true,
				renderFooters: true,
				renderHeaders: true,
			}).catch(error => {
				console.error('Error rendering DOCX:', error)
				if (docxContainerRef.current) {
					docxContainerRef.current.innerHTML =
						'<p>Error loading document preview</p>'
				}
			})
		} else {
			setImageUrl('')
		}

		return () => {
			if (imageUrl) {
				URL.revokeObjectURL(imageUrl)
			}
		}
	}, [content, fileType, file.name])

	if (!file || !content) {
		return (
			<div className="flex h-full items-center justify-center bg-gray-100">
				<div className="p-4 text-center">
					<p className="mb-2 text-lg">Loading...</p>
				</div>
			</div>
		)
	}

	if (fileType === 'image') {
		return (
			<div className="flex h-full items-center justify-center bg-gray-100">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={file.name}
						className="max-h-full max-w-full object-contain"
					/>
				) : (
					<div className="p-4 text-center">
						<p className="mb-2 text-lg">Loading image...</p>
					</div>
				)}
			</div>
		)
	}

	if (fileType === 'document' && file.name.endsWith('.docx')) {
		return (
			<div className="h-full overflow-auto bg-white">
				<div
					ref={docxContainerRef}
					className="docx-container p-8"
					style={{ minHeight: '100%' }}
				/>
			</div>
		)
	}

	if (fileType === 'text') {
		return (
			<MonacoEditor
				height="100%"
				language="plaintext"
				value={typeof content === 'string' ? content : ''}
				onChange={value => onContentChange(value || '')}
				theme="vs-dark"
				options={{
					minimap: { enabled: false },
					fontSize: 14,
					wordWrap: 'on',
				}}
			/>
		)
	}

	return (
		<div className="flex h-full items-center justify-center bg-gray-100">
			<div className="p-4 text-center">
				<p className="mb-2 text-lg">File Preview</p>
				<p className="text-sm text-gray-600">
					This file type cannot be previewed directly.
				</p>
				<p className="text-sm text-gray-600">
					You can download it to view the contents.
				</p>
			</div>
		</div>
	)
}

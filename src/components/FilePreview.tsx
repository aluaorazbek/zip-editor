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

const getLanguageFromExtension = (filename: string): string => {
	const ext = filename.toLowerCase().split('.').pop() || ''
	const languageMap: Record<string, string> = {
		js: 'javascript',
		jsx: 'javascript',
		ts: 'typescript',
		tsx: 'typescript',
		html: 'html',
		css: 'css',
		json: 'json',
		md: 'markdown',
		py: 'python',
		java: 'java',
		c: 'c',
		cpp: 'cpp',
		h: 'c',
		hpp: 'cpp',
		xml: 'xml',
		yaml: 'yaml',
		yml: 'yaml',
	}
	return languageMap[ext] || 'plaintext'
}

const MONACO_THEMES = ['vs', 'vs-dark', 'hc-black', 'hc-light'] as const

export function FilePreview({
	file,
	content,
	onContentChange,
}: FilePreviewProps): JSX.Element {
	const fileType = getFileType(file.name)
	const [imageUrl, setImageUrl] = useState<string>('')
	const docxContainerRef = useRef<HTMLDivElement>(null)
	const [currentTheme, setCurrentTheme] =
		useState<(typeof MONACO_THEMES)[number]>('vs-dark')

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
			<div className="relative h-full">
				<select
					value={currentTheme}
					onChange={e =>
						setCurrentTheme(e.target.value as (typeof MONACO_THEMES)[number])
					}
					className="absolute right-4 top-4 z-10 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
				>
					{MONACO_THEMES.map(theme => (
						<option key={theme} value={theme}>
							{theme}
						</option>
					))}
				</select>

				<MonacoEditor
					height="100%"
					language={getLanguageFromExtension(file.name)}
					value={typeof content === 'string' ? content : ''}
					onChange={value => onContentChange(value || '')}
					theme={currentTheme}
					options={{
						minimap: { enabled: false },
						fontSize: 14,
						wordWrap: 'on',
						automaticLayout: true,
						suggestOnTriggerCharacters: true,
						quickSuggestions: true,
						parameterHints: { enabled: true },
						formatOnPaste: true,
						formatOnType: true,
						snippetSuggestions: 'inline',
						wordBasedSuggestions: 'currentDocument',
						tabSize: 2,
						scrollBeyondLastLine: false,
						renderWhitespace: 'selection',
						renderControlCharacters: true,
						renderLineHighlight: 'all',
						scrollbar: {
							vertical: 'visible',
							horizontal: 'visible',
							useShadows: true,
							verticalScrollbarSize: 10,
							horizontalScrollbarSize: 10,
						},
					}}
					beforeMount={monaco => {
						monaco.languages.typescript.javascriptDefaults.setEagerModelSync(
							true,
						)
						monaco.languages.typescript.typescriptDefaults.setEagerModelSync(
							true,
						)

						monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
							{
								noSemanticValidation: false,
								noSyntaxValidation: false,
							},
						)
						monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
							{
								noSemanticValidation: false,
								noSyntaxValidation: false,
							},
						)
					}}
				/>
			</div>
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

'use client'

import { Suspense } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiDownload } from 'react-icons/fi'

import { FilePreview } from '../components/FilePreview'
import { FileTreeItem } from '../components/FileTreeItem'
import { useZipFile } from '../hooks/useZipFile'

export default function HomePage() {
	const {
		fileTree,
		selectedFile,
		handleFileSelect,
		processZipFile,
		fileContent,
		setEditorContent,
		zipFile,
		handleDownload,
	} = useZipFile()

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: acceptedFiles => {
			const file = acceptedFiles[0]
			if (file) {
				processZipFile(file)
			}
		},
		accept: {
			'application/zip': ['.zip'],
			'application/x-zip-compressed': ['.zip'],
		},
		multiple: false,
	})

	return (
		<main className="flex h-screen flex-col">
			{/* Drop */}
			<div
				{...getRootProps()}
				className={`cursor-pointer border-2 border-dashed p-8 text-center transition-colors
              ${
								isDragActive
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-300 hover:border-blue-400'
							}`}
			>
				<input {...getInputProps()} />
				<FiUpload className="mx-auto mb-2 text-3xl" />
				<p>Drag and drop a zip file here, or click to select</p>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* ZIP Tree structue */}
				<div className="w-64 overflow-y-auto border-r p-4">
					{fileTree.map(node => (
						<FileTreeItem
							key={node.path}
							node={node}
							onSelect={handleFileSelect}
							selectedPath={selectedFile?.path}
						/>
					))}
				</div>

				{/* Editor/Preview area */}
				<div className="flex-1 overflow-hidden">
					{selectedFile ? (
						<Suspense
							fallback={
								<div className="flex h-full items-center justify-center">
									Loading preview...
								</div>
							}
						>
							<FilePreview
								file={selectedFile}
								content={fileContent}
								onContentChange={setEditorContent}
							/>
						</Suspense>
					) : (
						<div className="flex h-full items-center justify-center text-gray-500">
							Select a file to edit
						</div>
					)}
				</div>
			</div>

			{/* Download button */}
			{zipFile && (
				<button
					type="button"
					onClick={handleDownload}
					className="fixed bottom-4 right-4 rounded-full bg-blue-500 p-3 text-white shadow-lg transition-colors hover:bg-blue-600"
				>
					<FiDownload className="text-xl" />
				</button>
			)}
		</main>
	)
}

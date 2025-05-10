import { useState } from 'react'

import { FileNode } from '#/types/file'

interface FileTreeItemProps {
	node: FileNode
	onSelect: (node: FileNode) => void
	selectedPath?: string
}

export function FileTreeItem({
	node,
	onSelect,
	selectedPath,
}: FileTreeItemProps) {
	const [isOpen, setIsOpen] = useState(true)

	return (
		<div className="pl-2">
			<div
				className={`flex cursor-pointer items-center p-1 hover:bg-gray-100 ${
					selectedPath === node.path ? 'bg-blue-100' : ''
				}`}
				onClick={() => {
					if (node.isDirectory) {
						setIsOpen(!isOpen)
					} else {
						onSelect(node)
					}
				}}
			>
				{node.isDirectory ? (
					<span className="mr-1">{isOpen ? '📂' : '📁'}</span>
				) : (
					<span className="mr-1">📄</span>
				)}
				<span>{node.name}</span>
			</div>
			{node.isDirectory && isOpen && node.children && (
				<div className="pl-4">
					{node.children.map(child => (
						<FileTreeItem
							key={child.path}
							node={child}
							onSelect={onSelect}
							selectedPath={selectedPath}
						/>
					))}
				</div>
			)}
		</div>
	)
}

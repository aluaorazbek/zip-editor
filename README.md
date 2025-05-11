# Zip Editor

A web application for viewing and editing files within ZIP archives. Built with Next.js, TypeScript, and Monaco Editor.

## Features

- View and navigate ZIP file contents in a tree structure
- Edit text files with syntax highlighting
- Preview images
- View word documents
- Multiple editor themes
- Save changes back to ZIP

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── FilePreview.tsx    # File preview/editor component
│   ├── FileTreeItem.tsx   # Tree view item component
│   └── FileTree.tsx       # File tree component
├── hooks/                 # Custom React hooks
│   └── useZipFile.ts      # ZIP file handling logic
├── types/                 # TypeScript type definitions
│   └── file.ts           # File-related types
└── utils/                # Utility functions
    └── fileUtils.ts      # File handling utilities
```

## Core Components

### FileTree Component
- Displays the ZIP contents in a hierarchical tree structure
- Handles folder expansion
- Shows file icons based on file type
- Manages file selection

### FilePreview Component
- Uses Monaco Editor for text files with:
  - Syntax highlighting based on file extension
  - Multiple themes (vs, vs-dark, hc-black, hc-light)
  - Auto-completion and suggestions

- Handles different file types:
  - Text files: Editable in Monaco Editor
  - Images: Direct preview
  - Word documents: Document viewer
  - Other files: Download option

### useZipFile Hook
- Manages ZIP file state and operations
- Handles file tree building
- Processes file content loading
- Manages file editing and saving
- Provides download functionality

## File Type Support

### Text Files
- JavaScript/TypeScript (.js, .ts, .jsx, .tsx)
- HTML (.html, .htm)
- CSS (.css)
- JSON (.json)
- Markdown (.md)
- Python (.py)
- Java (.java)
- C/C++ (.c, .cpp, .h)
- XML (.xml)
- YAML (.yml, .yaml)
- Plain text (.txt)

### Other Files
- Images (.png, .jpg, .jpeg)
- Word documents (.docx)
- Other files (downloadable)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Usage

1. Click "Select ZIP File" to choose a ZIP archive
2. Navigate the file tree on the left
3. Click on files to view/edit them
4. For text files:
   - Edit content in the Monaco editor
   - Use the theme selector in the top-right corner
   - Changes are automatically saved to the ZIP
5. Click "Download" button to save changes

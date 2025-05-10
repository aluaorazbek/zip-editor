'use client';

import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload } from 'react-icons/fi';

export default function HomePage() {

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        processZipFile(file);
      }
    },
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    },
    multiple: false
  });

  return (
    <html lang="en">
      <head>
        <title>Zip Editor</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main className="flex flex-col h-screen">
          {/* Drop */}
          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
          >
            <input {...getInputProps()} />
            <FiUpload className="mx-auto text-3xl mb-2" />
            <p>Drag and drop a zip file here, or click to select</p>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* ZIP Tree structue */}
            <div className="w-64 border-r overflow-y-auto p-4">
				Tree
            </div>

            {/* Editor/Preview area */}
            <div className="flex-1 overflow-hidden">
              Editor
            </div>
          </div>

          {/* Download button */} 
            <button
              className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
              <FiDownload className="text-xl" />
            </button>
        </main>
      </body>
    </html>
  );
} 

function processZipFile<T extends File>(file: T) {
	throw new Error('Function not implemented.');
}

import { useState } from 'react';
import JSZip from 'jszip';
import { FileNode } from '#/types/file';
import { sortTree } from '#/utils/fileUtils';

export const useZipFile = () => {
  const [zipFile, setZipFile] = useState<JSZip | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [editorContent, setEditorContent] = useState<string>('');


  const processZipFile = async (file: File) => {
    const zip = new JSZip();
    try {
      const loadedZip = await zip.loadAsync(file);
      setZipFile(loadedZip);
      
      const rootNode: FileNode = {
        name: file.name,
        path: '',
        isDirectory: true,
        children: []
      };

      const files = Object.keys(loadedZip.files).sort();

      let commonPrefix = '';
      if (files.length > 0) {
        const firstFile = files[0];
        const lastFile = files[files.length - 1];
        let i = 0;
        while (i < firstFile.length && i < lastFile.length && firstFile[i] === lastFile[i]) {
          i++;
        }
        commonPrefix = firstFile.substring(0, i).split('/')[0];
        if (commonPrefix && !commonPrefix.includes('.')) {
          commonPrefix += '/';
        } else {
          commonPrefix = '';
        }
      }

      files.forEach((filePath: string) => {
        const relativePath = commonPrefix ? filePath.substring(commonPrefix.length) : filePath;
        const parts = relativePath.split('/').filter(Boolean);
        let currentNode = rootNode;
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const isLast = i === parts.length - 1;
          const currentPath = parts.slice(0, i + 1).join('/');
          
          let node = currentNode.children?.find(n => n.name === part);
          
          if (!node) {
            node = {
              name: part,
              path: filePath,
              isDirectory: !isLast,
              children: !isLast ? [] : undefined
            };
            currentNode.children?.push(node);
          }
          
          if (!isLast) {
            currentNode = node;
          }
        }
      });
      
      sortTree(rootNode.children || []);
      setFileTree([rootNode]);
    } catch (error) {
      console.error('Error loading zip file:', error);
    }
  };

  return {
    zipFile,
    fileTree,
    editorContent,
    setEditorContent,
    processZipFile
  };
}; 
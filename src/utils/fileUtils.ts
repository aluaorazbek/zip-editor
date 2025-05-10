import { FileNode } from "#/types/file";

export const sortTree = (nodes: FileNode[]): void => {
  nodes.sort((a, b) => {
    if (a.isDirectory === b.isDirectory) {
      return a.name.localeCompare(b.name);
    }
    return a.isDirectory ? -1 : 1;
  });
  nodes.forEach(node => {
    if (node.children) {
      sortTree(node.children);
    }
  });
}; 
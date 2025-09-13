export interface MindmapNode {
  id: string;
  content: string;
  children: MindmapNode[];
  depth: number;
}

export function parseMindmap(markdown: string): MindmapNode | null {
  const lines = markdown.split('\n').filter(line => line.trim().length > 0);
  if (lines.length === 0) return null;

  const getIndentLevel = (line: string) => {
    const indent = line.match(/^\s*/)?.[0].length || 0;
    return Math.floor(indent / 2); // Assuming 2 spaces per indent level
  }

  let root: MindmapNode | null = null;
  const stack: MindmapNode[] = [];
  let idCounter = 0;

  for (const line of lines) {
    const depth = getIndentLevel(line);
    const content = line.trim().replace(/^-|\*/, '').trim();
    if (!content) continue;

    const node: MindmapNode = { id: `node-${idCounter++}`, content, children: [], depth };

    while (stack.length > depth) {
      stack.pop();
    }

    if (stack.length > 0) {
      stack[stack.length - 1]!.children.push(node);
    } else {
      if (!root) {
        root = node;
      } else {
        // Handle multiple root-level items by creating a virtual root with empty content
        const virtualRoot: MindmapNode = {
          id: 'virtual-root',
          content: '', // Empty content to avoid showing "Topics"
          children: [root, node],
          depth: -1
        };
        root = virtualRoot;
      }
    }

    stack.push(node);
  }

  return root;
}
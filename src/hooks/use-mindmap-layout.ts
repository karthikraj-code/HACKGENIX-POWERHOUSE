'use client';

import { useMemo } from 'react';
import type { MindmapNode as MindmapNodeType } from '@/lib/mindmap-parser';

const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;
const VERTICAL_SPACING = 20;
const HORIZONTAL_SPACING = 60;

interface PositionedNode {
  data: MindmapNodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
}

interface Link {
  source: PositionedNode;
  target: PositionedNode;
}

export function useMindmapLayout(
  root: MindmapNodeType | null,
  collapsedNodes: Record<string, boolean>
) {
  return useMemo(() => {
    if (!root) {
      return { nodes: [], links: [], width: 0, height: 0 };
    }

    const positionedNodes: PositionedNode[] = [];
    const links: Link[] = [];
    let currentX = 0;
    let maxDepth = 0;

    const layoutTree = (node: MindmapNodeType, depth: number, parent?: PositionedNode) => {
      const isCollapsed = collapsedNodes[node.id];
      const children = isCollapsed ? [] : node.children;
      
      const nodeWidth = NODE_WIDTH;

      let childrenHeight = 0;
      if (children.length > 0) {
        childrenHeight = children.reduce((acc, child) => {
          const childNode = layoutTree(child, depth + 1);
          // Recalculate based on children's total height
          return acc + childNode.totalHeight;
        }, 0) + (children.length - 1) * VERTICAL_SPACING;
      }
      const nodeHeight = Math.max(NODE_HEIGHT, childrenHeight);

      const x = currentX;
      const y = depth * (NODE_WIDTH + HORIZONTAL_SPACING);
      
      const pNode: PositionedNode = {
        data: node,
        x,
        y,
        width: nodeWidth,
        height: NODE_HEIGHT,
        depth: depth
      };
      
      let childX = currentX;
      let totalChildHeight = 0;
      children.forEach(child => {
        const childNode = positionedNodes.find(n => n.data.id === child.id);
        if (childNode) {
          childNode.x = childX + (totalChildHeight > 0 ? (childNode.height/2) : 0);
          links.push({ source: pNode, target: childNode });
          totalChildHeight += childNode.height + VERTICAL_SPACING;
          childX = childNode.x;
        }
      });
      
      
      // Center parent over children
      if (children.length > 0) {
        const firstChild = positionedNodes.find(n => n.data.id === children[0].id);
        const lastChild = positionedNodes.find(n => n.data.id === children[children.length - 1].id);
        if(firstChild && lastChild) {
            pNode.x = firstChild.x + (lastChild.x + lastChild.height - firstChild.x) / 2 - pNode.height/2
        }
      } else {
         currentX += NODE_HEIGHT + VERTICAL_SPACING;
      }

      positionedNodes.push(pNode);
      if (depth > maxDepth) maxDepth = depth;
      
      return {node: pNode, totalHeight: nodeHeight};
    };

    const hierarchy = (node: MindmapNodeType, depth = 0) => {
      const isCollapsed = collapsedNodes[node.id];
      const children = isCollapsed ? [] : node.children;
      
      const pNode: PositionedNode = {
          data: node,
          x: 0,
          y: depth * (NODE_WIDTH + HORIZONTAL_SPACING),
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          depth,
      }
      positionedNodes.push(pNode);

      children.forEach(c => hierarchy(c, depth + 1));
    }

    hierarchy(root);

    const levels: MindmapNodeType[][] = [];
    const buildLevels = (node:MindmapNodeType, depth:number) => {
        if(!levels[depth]) levels[depth] = [];
        levels[depth].push(node);
        const isCollapsed = collapsedNodes[node.id];
        if(!isCollapsed) {
            node.children.forEach(c => buildLevels(c, depth + 1));
        }
    }
    buildLevels(root, 0);

    let finalNodes: PositionedNode[] = [];
    let finalLinks: Link[] = [];
    let totalHeight = 0;

    const leafNodes = positionedNodes.filter(p => {
       const isCollapsed = collapsedNodes[p.data.id];
       return isCollapsed || p.data.children.length === 0
    });
    totalHeight = leafNodes.length * (NODE_HEIGHT + VERTICAL_SPACING) - VERTICAL_SPACING;

    let currentLeaf = 0;
    const processedNodes = new Set<string>();

    const positionNodes = (node: MindmapNodeType) => {
        if (processedNodes.has(node.id)) return positionedNodes.find(n => n.data.id === node.id);
        
        const pNode = positionedNodes.find(n => n.data.id === node.id)!;
        const isCollapsed = collapsedNodes[node.id];
        const children = isCollapsed ? [] : node.children;

        if (children.length === 0) {
            pNode.x = currentLeaf * (NODE_HEIGHT + VERTICAL_SPACING);
            currentLeaf++;
        } else {
            const childPNodes = children.map(c => positionNodes(c)!);
            pNode.x = childPNodes[0].x + (childPNodes[childPNodes.length-1].x - childPNodes[0].x) / 2;
            childPNodes.forEach(c => {
                finalLinks.push({source: pNode, target: c});
            })
        }
        
        processedNodes.add(node.id);
        finalNodes.push(pNode);
        return pNode;
    }

    positionNodes(root);
    
    const width = (levels.length) * (NODE_WIDTH + HORIZONTAL_SPACING) - HORIZONTAL_SPACING;

    return {
      nodes: positionedNodes.sort((a,b) => a.depth - b.depth),
      links: finalLinks,
      width: width + 40,
      height: totalHeight + 40,
    };
  }, [root, collapsedNodes]);
}
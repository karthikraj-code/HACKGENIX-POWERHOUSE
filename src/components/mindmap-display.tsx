'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Minus, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseMindmap, MindmapNode as MindmapNodeType } from '@/lib/mindmap-parser';
import { useMindmapLayout } from '@/hooks/use-mindmap-layout';

interface MindmapNodeProps {
  node: ReturnType<typeof useMindmapLayout>['nodes'][0];
  onToggle: (id: string) => void;
  isExpanded: boolean;
}

const MindmapNode: React.FC<MindmapNodeProps> = React.memo(({ node, onToggle, isExpanded }) => (
  <>
    <g
      transform={`translate(${node.y}, ${node.x})`}
      className="transition-transform duration-500 ease-in-out"
    >
      <rect
        width={node.width}
        height={node.height}
        rx={8}
        className={node.depth === 0 ? "fill-primary stroke-border" : "fill-card stroke-border"}
      />
      <foreignObject width={node.width} height={node.height}>
         <div className={`flex items-center justify-center h-full text-center p-2 font-medium text-sm ${node.depth === 0 ? 'text-primary-foreground' : 'text-card-foreground'}`}>
           {node.data.content}
         </div>
      </foreignObject>
      
      {node.data.children.length > 0 && (
        <g transform={`translate(${node.depth > 0 ? -12 : node.width}, ${node.height / 2})`} className="cursor-pointer" onClick={() => onToggle(node.data.id)}>
            <circle r={12} className="fill-accent" />
            {node.depth > 0 ? (
                <ChevronLeft className="text-accent-foreground" size={16} x={-8} y={-8} />
            ) : isExpanded ? 
                <Minus className="text-accent-foreground" size={16} x={-8} y={-8} /> : 
                <Plus className="text-accent-foreground" size={16} x={-8} y={-8} />}
        </g>
      )}
    </g>
  </>
));
MindmapNode.displayName = 'MindmapNode';


const pathGenerator = (d: {
    source: { x: number; y: number; width: number, depth: number };
    target: { x: number; y: number; height: number, depth: number };
  }) => {
    const sourceX = d.source.depth === 0 ? d.source.y + d.source.width : d.source.y;
    const sourceY = d.source.x + 30;
    const targetX = d.target.depth > 1 ? d.target.y : d.target.y;
    const targetY = d.target.x + d.target.height / 2;
    
    return `M ${sourceX},${sourceY} C ${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`;
};

interface MindmapDisplayProps {
  mindmapString: string;
}

export default function MindmapDisplay({ mindmapString }: MindmapDisplayProps) {
  const mindmapTree = React.useMemo(() => parseMindmap(mindmapString), [mindmapString]);
  
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const handleToggleNode = useCallback((nodeId: string) => {
    setCollapsedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }, []);

  const { nodes, links, width, height } = useMindmapLayout(mindmapTree, collapsedNodes);

  if (!mindmapTree) {
    return <p className="text-center text-muted-foreground">Could not generate a mindmap. Please try another topic.</p>;
  }

  return (
    <Card className="shadow-lg bg-card overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Mindmap: {mindmapTree.content}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-auto">
          <svg 
            width={width} 
            height={height} 
            className="font-sans"
            style={{minWidth: '100%'}}
          >
            <g transform="translate(20, 20)">
              {links.map((link, i) => (
                <path
                  key={i}
                  d={pathGenerator({
                      source: { ...link.source, depth: link.source.data.depth },
                      target: { ...link.target, depth: link.target.data.depth }
                    })}
                  className="fill-none stroke-border stroke-2 transition-all duration-500 ease-in-out"
                />
              ))}
              {nodes.map(node => (
                <MindmapNode
                  key={node.data.id}
                  node={node}
                  onToggle={handleToggleNode}
                  isExpanded={!collapsedNodes[node.data.id]}
                />
              ))}
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
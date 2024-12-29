import { Shape } from '@mirohq/websdk-types/stable/features/widgets/shape';

// Define the ShapeStyle type
type ShapeStyle = {
    color: string;
    fillColor: string;
    fillOpacity: number;
    fontFamily: string;
    fontSize: number;
    textAlign: string;
    textAlignVertical: string;
    borderStyle: string;
    borderOpacity: number;
    borderColor: string;
    borderWidth: number;
    borderRadius?: number;
};

type DiagramOrientation = 'horizontal' | 'vertical' | 'tree';
type ShapeType = "circle" | "triangle" | "rectangle" | "wedge_round_rectangle_callout" | "round_rectangle" | "rhombus" | "parallelogram" | "star" | "right_arrow" | "left_arrow" | "pentagon" | "hexagon" | "octagon" | "trapezoid" | "flow_chart_predefined_process" | "left_right_arrow" | "cloud" | "left_brace" | "right_brace" | "cross" | "can" | "round_rectangle";

interface ProcessPseudoCodeOptions {
    orientation?: DiagramOrientation;
    startY?: number;
    nodeWidth?: number;
    nodeHeight?: number;
    fontSize?: number;
    textColor?: string;
    fillColor?: string;
    borderColor?: string;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    shape?: ShapeType;
}

export async function processPseudoCode(input: string, options: ProcessPseudoCodeOptions = {}) {
    const {
        orientation = 'tree',
        startY = 100,
        nodeWidth = 200,
        nodeHeight = 100,
        fontSize = 14,
        textColor = '#000000',
        fillColor = '#ffffff',
        borderColor = '#008080',
        horizontalSpacing = 2.5,
        verticalSpacing = 1.5,
        shape = 'round_rectangle',
    } = options;
    const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
    const nodes = new Map<string, { id: string, content: string, children: string[], parent: string | null, shapeId?: string, shape: ShapeType, color: string, fillColor: string, textColor: string }>();
    const connections: { from: string, to: string }[] = [];
    const xSpacing = nodeWidth * horizontalSpacing;
    const ySpacing = nodeHeight * verticalSpacing;
    let currentY = startY;

    // Parse nodes and connections
    for (const line of lines) {
        const nodeMatch = line.match(/^Node:(\d+)(?:<([^>]+)>)?:\"(.+)\"$/);
        if (nodeMatch) {
            const [, id, styleString, content] = nodeMatch;
            let nodeShape = shape;
            let nodeBorderColor = borderColor;
            let nodeFillColor = fillColor;
            let nodeTextColor = textColor;

            if (styleString) {
                const styleRegex = /(\w+)=([^,]+)/g;
                let match;
                while ((match = styleRegex.exec(styleString)) !== null) {
                    const key = match[1];
                    const value = match[2];
                    if (key === 'shape') {
                        nodeShape = value as ShapeType;
                    } else if (key === 'borderColor') {
                        nodeBorderColor = value;
                    } else if (key === 'backgroundColor') {
                        nodeFillColor = value;
                    } else if (key === 'textColor') {
                        nodeTextColor = value;
                    }
                }
            }
            nodes.set(id, { id, content, children: [], parent: null, shape: nodeShape, color: nodeBorderColor, fillColor: nodeFillColor, textColor: nodeTextColor });
        }
        const connectMatch = line.match(/^Connect:(\d+):(\d+)$/);
        if (connectMatch) {
            const [, from, to] = connectMatch;
            connections.push({ from, to });
        }
    }

    // Build the tree structure
    for (const { from, to } of connections) {
        const fromNode = nodes.get(from);
        const toNode = nodes.get(to);
        if (fromNode && toNode) {
            fromNode.children.push(to);
            toNode.parent = from;
        }
    }

    const visitedNodes = new Set<string>();
    const queue: string[] = [];

    // Find root nodes (nodes without parents)
    for (const [id, node] of nodes) {
        if (!node.parent) {
            queue.push(id);
        }
    }

    let maxDepth = 0;
    const nodeDepths: { [key: string]: number } = {};
    const nodePositions: { [key: string]: { x: number, y: number } } = {};

    const calculateTreeLayout = (nodeId: string, depth: number) => {
        if (nodeDepths[nodeId] !== undefined) {
            return;
        }
        nodeDepths[nodeId] = depth;
        maxDepth = Math.max(maxDepth, depth);

        const node = nodes.get(nodeId);
        if (node) {
            for (const childId of node.children) {
                calculateTreeLayout(childId, depth + 1);
            }
        }
    };

    if (orientation === 'tree') {
        for (const [id, node] of nodes) {
            if (!node.parent) {
                calculateTreeLayout(id, 0);
            }
        }
    }

    // Process nodes in breadth-first order
    let horizontalIndex = 0;
    while (queue.length > 0) {
        const nodeId = queue.shift()!;
        if (visitedNodes.has(nodeId)) continue;
        visitedNodes.add(nodeId);

        const node = nodes.get(nodeId)!;
        let x = 0;
        let y = currentY;

        if (orientation === 'horizontal') {
            // Horizontal layout logic
            const depth = nodeDepths[nodeId] || 0;
            
            x = horizontalIndex * (nodeWidth + xSpacing);
            y = currentY + (depth * ySpacing);
            horizontalIndex++;

        } else if (orientation === 'vertical') {
            // Vertical layout logic
            y = currentY + (visitedNodes.size - 1) * ySpacing;
        } else if (orientation === 'tree') {
            const depth = nodeDepths[nodeId] || 0;
            const siblings = nodes.get(node.parent || '')?.children.length || 1;
            x = depth * xSpacing;
            y = startY + depth * ySpacing;
            if (node.parent) {
                const parentNode = nodes.get(node.parent);
                if (parentNode) {
                    const parentDepth = nodeDepths[node.parent] || 0;
                    const parentX = nodePositions[node.parent]?.x || 0;
                    const parentY = nodePositions[node.parent]?.y || startY;
                    let childIndex = 0;
                    for (let i = 0; i < parentNode.children.length; i++) {
                        if (parentNode.children[i] === nodeId) {
                            childIndex = i;
                            break;
                        }
                    }
                    x = parentX + (childIndex - (siblings - 1) / 2) * xSpacing / 2;
                    y = parentY + ySpacing;
                }
            }
        }

        nodePositions[nodeId] = { x, y };

        const shapeWidget = await miro.board.createShape({
            shape: node.shape,
            content: node.content,
            x: x,
            y: y,
            width: nodeWidth,
            height: nodeHeight,
            style: {
                color: node.textColor,
                fillColor: node.fillColor,
                fillOpacity: 1,
                fontSize: fontSize,
                textAlign: 'center',
                textAlignVertical: 'middle',
                borderOpacity: 1,
                borderColor: node.color,
                borderWidth: 2,
            }
        });
        node.shapeId = shapeWidget.id;

        // Add children to the queue
        for (const childId of node.children) {
            if (!visitedNodes.has(childId)) {
                queue.push(childId);
            }
        }
    }

    // Create connections
    for (const { from, to } of connections) {
        const fromNode = nodes.get(from);
        const toNode = nodes.get(to);
        if (fromNode?.shapeId && toNode?.shapeId) {
            await miro.board.createConnector({
                start: { item: fromNode.shapeId },
                end: { item: toNode.shapeId },
                style: {
                    strokeColor: '#000000',
                    strokeWidth: 2,
                },
            });
        }
    }

    currentY = (orientation === 'tree' ? (maxDepth + 1) * ySpacing : (orientation === 'vertical' ? currentY - startY + ySpacing : 0));
    return currentY;
}

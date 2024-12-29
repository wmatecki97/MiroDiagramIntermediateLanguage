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

interface ProcessPseudoCodeOptions {
    orientation?: DiagramOrientation;
    startY?: number;
}

export async function processPseudoCode(input: string, options: ProcessPseudoCodeOptions = {}) {
    const { orientation = 'horizontal', startY = 100 } = options;
    const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
    const nodes: { [key: string]: string } = {};
    let currentX = 0;
    let currentY = startY;
    const xSpacing = 300;
    const ySpacing = 200;
    let maxDepth = 0;
    const nodeDepths: { [key: string]: number } = {};

    // Helper function to calculate tree layout
    const calculateTreeLayout = (nodeId: string, depth: number) => {
        if (nodeDepths[nodeId] !== undefined) {
            return;
        }
        nodeDepths[nodeId] = depth;
        maxDepth = Math.max(maxDepth, depth);

        for (const line of lines) {
            const connectMatch = line.match(/^Connect:(\d+):(\d+)$/);
            if (connectMatch && connectMatch[1] === nodeId) {
                calculateTreeLayout(connectMatch[2], depth + 1);
            }
        }
    };

    // First pass to calculate tree depths if tree orientation is selected
    if (orientation === 'tree') {
        for (const line of lines) {
            const nodeMatch = line.match(/^Node:(\d+):"(.+)"$/);
            if (nodeMatch) {
                calculateTreeLayout(nodeMatch[1], 0);
            }
        }
    }

    // Process each line
    for (const line of lines) {
        try {
            if (line.startsWith('Node:')) {
                const match = line.match(/^Node:(\d+):"(.+)"$/);
                if (match) {
                    const [, id, content] = match;
                    let x = currentX;
                    let y = currentY;

                    if (orientation === 'horizontal') {
                        x = currentX;
                    } else if (orientation === 'vertical') {
                        y = currentY;
                    } else if (orientation === 'tree') {
                        const depth = nodeDepths[id] || 0;
                        x = depth * xSpacing;
                        y = startY + depth * ySpacing;
                    }

                    const shape = await miro.board.createShape({
                        shape: 'round_rectangle',
                        content: content,
                        x: x,
                        y: y,
                        width: 200,
                        height: 100,
                        style: {
                            color: '#000000',
                            fillColor: '#ffffff',
                            fillOpacity: 1,
                            fontSize: 14,
                            textAlign: 'center',
                            textAlignVertical: 'middle',
                            borderOpacity: 1,
                            borderColor: '#008080',
                            borderWidth: 2,
                        }
                    });
                    nodes[id] = shape.id;
                    if (orientation === 'horizontal') {
                        currentX += xSpacing;
                    } else if (orientation === 'vertical') {
                        currentY += ySpacing;
                    }
                } else {
                    console.error(`Invalid Node syntax: ${line}`);
                }
            } else if (line.startsWith('Connect:')) {
                const match = line.match(/^Connect:(\d+):(\d+)$/);
                if (match) {
                    const [, from, to] = match;
                    if (nodes[from] && nodes[to]) {
                        await miro.board.createConnector({
                            start: { item: nodes[from] },
                            end: { item: nodes[to] },
                            style: {
                                strokeColor: '#000000',
                                strokeWidth: 2,
                            },
                        });
                    } else {
                        console.error(`Missing nodes for connection: ${line}`);
                    }
                } else {
                    console.error(`Invalid Connect syntax: ${line}`);
                }
            }
        } catch (error) {
            console.error(`Error processing line: ${line}`, error);
        }
    }

    console.log('Nodes created:', nodes);
    return (orientation === 'tree' ? (maxDepth + 1) * ySpacing : (orientation === 'vertical' ? currentY - startY + ySpacing : 0));
}

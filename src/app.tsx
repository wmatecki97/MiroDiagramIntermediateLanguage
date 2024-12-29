import * as React from 'react';
import { createRoot } from 'react-dom/client';

import '../src/assets/style.css';
async function processPseudoCode(input: string) {
  const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
  const nodes = {};

  let currentX = 0; // Starting X position
  const startY = 100; // Starting Y position
  const xSpacing = 300; // Horizontal spacing between nodes

  // Process each line
  for (const line of lines) {
    try {
      if (line.startsWith('Node:')) {
        // Match the Node syntax: Node:<NodeID>:"<TextContent>"
        const match = line.match(/^Node:(\d+):"(.+)"$/);
        if (match) {
          const [, id, content] = match;
          const shape = await miro.board.createShape({
            shape: 'rectangle',
            content: content,
            x: currentX,
            y: startY,
            width: 200,
            height: 100,
            style: {
              fillColor: '#ffffff',
              borderColor: '#008080',
              borderWidth: 2,
              borderRadius: 10,
            }
          });
          nodes[id] = shape.id; // Store the ID of the created shape
          currentX += xSpacing; // Move to the right for the next node
        } else {
          console.error(`Invalid Node syntax: ${line}`);
        }
      } else if (line.startsWith('Connect:')) {
        // Match the Connect syntax: Connect:<FromNodeID>:<ToNodeID>
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
}



const App: React.FC = () => {
  const [pseudoCode, setPseudoCode] = React.useState('');

  const handleGenerate = () => {
    processPseudoCode(pseudoCode);
  };

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>Diagram Generator</h1>
        <textarea
          placeholder="Enter pseudo-code here"
          value={pseudoCode}
          onChange={(e) => setPseudoCode(e.target.value)}
          rows={10}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button className="button button-primary" onClick={handleGenerate}>
          Generate Diagram
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

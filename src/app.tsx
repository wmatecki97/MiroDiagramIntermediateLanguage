import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '../src/assets/style.css';
import { processPseudoCode } from './diagram-processor';

const App: React.FC = () => {
  const [pseudoCode, setPseudoCode] = React.useState('');
  const [diagramYOffset, setDiagramYOffset] = React.useState(0);
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical' | 'tree'>('horizontal');

  const handleGenerate = async () => {
    const yOffset = await processPseudoCode(pseudoCode, { startY: 100 + diagramYOffset, orientation: orientation });
    setDiagramYOffset(diagramYOffset + yOffset);
  };

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>Diagram Generator</h1>
        <p>
          Enter pseudo-code to generate a diagram. Use the following syntax:
          <br />
          <code>Node:&lt;NodeID&gt;:&quot;&lt;TextContent&gt;&quot;</code> to create a node.
          <br />
          <code>Connect:&lt;FromNodeID&gt;:&lt;ToNodeID&gt;</code> to connect two nodes.
          <br />
          For example:
          <br />
          <code>Node:1:"Start"</code>
          <br />
          <code>Node:2:"End"</code>
          <br />
          <code>Connect:1:2</code>
        </p>
        <label htmlFor="orientation">Diagram Orientation:</label>
        <select
          id="orientation"
          value={orientation}
          onChange={(e) => setOrientation(e.target.value as 'horizontal' | 'vertical' | 'tree')}
          style={{ marginBottom: '10px', display: 'block' }}
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
          <option value="tree">Tree</option>
        </select>
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

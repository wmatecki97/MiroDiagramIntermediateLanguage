import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '../src/assets/style.css';
import { processPseudoCode } from './diagram-processor';

const App: React.FC = () => {
  const [pseudoCode, setPseudoCode] = React.useState('');
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical' | 'tree'>('tree');
  const [nodeWidth, setNodeWidth] = React.useState(200);
  const [nodeHeight, setNodeHeight] = React.useState(100);
  const [borderColor, setBorderColor] = React.useState('#008080');
  const [textColor, setTextColor] = React.useState('#000000');
  const [horizontalSpacing, setHorizontalSpacing] = React.useState(0.5);
  const [verticalSpacing, setVerticalSpacing] = React.useState(1.5);
  const [minX, setMinX] = React.useState(Infinity);
  const [maxX, setMaxX] = React.useState(-Infinity);
  const [minY, setMinY] = React.useState(Infinity);
  const [maxY, setMaxY] = React.useState(-Infinity);

  const handleGenerate = async () => {
    let startX = 0;
    let startY = 100;

    if (minX !== Infinity && maxX !== -Infinity && minY !== Infinity && maxY !== -Infinity) {
      if (orientation === 'horizontal') {
        startX = maxX;
        startY = minY;
      } else if (orientation === 'vertical') {
        startX = minX;
        startY = maxY;
      } else {
        startX = minX;
        startY = maxX;
      }
    }

    await processPseudoCode(pseudoCode, {
      startX: startX,
      startY: startY,
      orientation: orientation,
      nodeWidth: nodeWidth,
      nodeHeight: nodeHeight,
      borderColor: borderColor,
      textColor: textColor,
      minX: minX,
      maxX: maxX,
      minY: minY,
      maxY: maxY,
    });

    setMinX(Infinity);
    setMaxX(-Infinity);
    setMinY(Infinity);
    setMaxY(-Infinity);
  };


  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>Diagram Generator</h1>
        <h1>Diagram Generator Syntax</h1>

        <p>This document describes the syntax for generating diagrams using a simple pseudo-code.</p>

        <h2>Node Creation</h2>

        <p>Use the following format to create a node:</p>
        <pre><code>Node:NodeID&lt;attributes&gt;:TextContent</code></pre>

        <ul>
          <li><code>NodeID</code>: An integer representing the unique identifier for the node.</li>
          <li><code>attributes</code>: A comma-separated list of key-value pairs enclosed in double angle brackets: <code>&lt;&lt;key1=value1,key2=value2,...&gt;&gt;</code>. Supported attributes include:
            <ul>
              <li><code>shape</code>: Node shape (e.g., <code>circle</code>, <code>rectangle</code>, <code>triangle</code>, <code>cloud</code>, <code>left_brace</code>, etc.).</li>
              <li><code>backgroundColor</code>: Background color in hexadecimal format (e.g., <code>#00FF00</code>).</li>
              <li><code>borderColor</code>: Border color in hexadecimal format (e.g., <code>#0000FF</code>).</li>
              <li><code>textColor</code>: Text color in hexadecimal format (e.g., <code>#FFFFFF</code>).</li>
            </ul>
          </li>
          <li><code>TextContent</code>: The text displayed inside the node, enclosed in double quotes: <code>"TextContent"</code>.</li>
        </ul>

        <h2>Connection Creation</h2>

        <p>Use the following format to create a connection between two nodes:</p>
        <pre><code>Connect:FromNodeID:ToNodeID</code></pre>

        <ul>
          <li><code>FromNodeID</code>: The <code>NodeID</code> of the starting node.</li>
          <li><code>ToNodeID</code>: The <code>NodeID</code> of the ending node.</li>
        </ul>

        <h2>Example</h2>

        <div className="example">
          <p>Here's an example demonstrating node and connection creation:</p>
          <pre><code>
            Node:1&lt;shape=circle&gt;:"Start"
            <br />
            Node:2&lt;shape=rectangle&gt;:"User Query Received"
            <br />
            Node:3&lt;shape=rectangle,backgroundColor=#00FF00&gt;:"Multiple Attributes"
            <br />
            Connect:1:2
            <br />
            Connect:2:3</code></pre>
        </div>



        <div style={{ marginBottom: '10px' }}>
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="orientation">Diagram Orientation:</label>
            <select
              id="orientation"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as 'horizontal' | 'vertical' | 'tree')}
              style={{ display: 'block' }}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="tree">Tree</option>
            </select>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="nodeWidth">Node Width:</label>
            <input
              type="number"
              id="nodeWidth"
              value={nodeWidth}
              onChange={(e) => setNodeWidth(Number(e.target.value))}
              style={{ display: 'block' }}
            />
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="nodeHeight">Node Height:</label>
            <input
              type="number"
              id="nodeHeight"
              value={nodeHeight}
              onChange={(e) => setNodeHeight(Number(e.target.value))}
              style={{ display: 'block' }}
            />
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="borderColor">Border Color:</label>
            <input
              type="color"
              id="borderColor"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              style={{ display: 'block' }}
            />
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="textColor">Text Color:</label>
            <input
              type="color"
              id="textColor"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={{ display: 'block' }}
            />
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="horizontalSpacing">Horizontal Spacing:</label>
            <input
              type="number"
              id="horizontalSpacing"
              value={horizontalSpacing}
              onChange={(e) => setHorizontalSpacing(Number(e.target.value))}
              style={{ display: 'block' }}
            />
          </div>
          <div style={{ marginBottom: '5px' }}>
            <label htmlFor="verticalSpacing">Vertical Spacing:</label>
            <input
              type="number"
              id="verticalSpacing"
              value={verticalSpacing}
              onChange={(e) => setVerticalSpacing(Number(e.target.value))}
              style={{ display: 'block' }}
            />
          </div>
        </div>
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

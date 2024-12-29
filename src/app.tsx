import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '../src/assets/style.css';
import { processPseudoCode } from './diagram-processor';

const App: React.FC = () => {
  const [pseudoCode, setPseudoCode] = React.useState('');
  const [diagramYOffset, setDiagramYOffset] = React.useState(0);
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical' | 'tree'>('tree');
  const [nodeWidth, setNodeWidth] = React.useState(200);
  const [nodeHeight, setNodeHeight] = React.useState(100);
  const [borderColor, setBorderColor] = React.useState('#008080');
  const [textColor, setTextColor] = React.useState('#000000');
  const [horizontalSpacing, setHorizontalSpacing] = React.useState(0.5);
  const [verticalSpacing, setVerticalSpacing] = React.useState(1.5);

  const handleGenerate = async () => {
    const yOffset = await processPseudoCode(pseudoCode, {
      startY: 100 + diagramYOffset,
      orientation: orientation,
      nodeWidth: nodeWidth,
      nodeHeight: nodeHeight,
      borderColor: borderColor,
      textColor: textColor,
    });
    setDiagramYOffset(diagramYOffset + yOffset);
  };

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>Diagram Generator</h1>
        <p>
          Enter pseudo-code to generate a diagram. Use the following syntax:
          <br />
          <code>Node:&lt;NodeID&gt;[&lt;shape=ShapeType,backgroundColor=Color,borderColor=Color,textColor=Color&gt;]:&quot;&lt;TextContent&gt;&quot;</code> to create a node.
          <br />
          <code>Connect:&lt;FromNodeID&gt;:&lt;ToNodeID&gt;</code> to connect two nodes.
          <br />
          Shape types: <code>circle</code>, <code>triangle</code>, <code>rectangle</code>, <code>wedge_round_rectangle_callout</code>, <code>round_rectangle</code>, <code>rhombus</code>, <code>parallelogram</code>, <code>star</code>, <code>right_arrow</code>, <code>left_arrow</code>, <code>pentagon</code>, <code>hexagon</code>, <code>octagon</code>, <code>trapezoid</code>, <code>flow_chart_predefined_process</code>, <code>left_right_arrow</code>, <code>cloud</code>, <code>left_brace</code>, <code>right_brace</code>, <code>cross</code>, <code>can</code>
          <br />
          Colors must be in the format #000000.
          <br />
          For example:
          <br />
          <code>Node:1:"Start"</code>
          <br />
          <code>Node:2&lt;shape=rectangle,backgroundColor=#00FF00,borderColor=#0000FF,textColor=#FFFFFF&gt;:"End"</code>
          <br />
          <code>Connect:1:2</code>
        </p>
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

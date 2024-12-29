## MiroIntermediateLanguageDiagramDesigner

**&nbsp;ℹ&nbsp;Note**:

- We recommend a Chromium-based web browser for local development with HTTP. \
  Safari enforces HTTPS; therefore, it doesn't allow localhost through HTTP.
- For more information, visit our [developer documentation](https://developers.miro.com).

### How to start locally

- Run `npm i` to install dependencies.
- Run `npm start` to start developing. \
  Your URL should be similar to this example:
 ```
 http://localhost:3000
 ```
- Paste the URL under **App URL** in your
  [app settings](https://developers.miro.com/docs/build-your-first-hello-world-app#step-3-configure-your-app-in-miro).
- Open a board; you should see your app in the app toolbar or in the **Apps**
  panel.

### How to build the app

- Run `npm run build`. \
  This generates a static output inside [`dist/`](./dist), which you can host on a static hosting
  service.

### Folder structure

<!-- The following tree structure is just an example -->

```
.
├── src
│  ├── assets
│  │  └── style.css
│  ├── app.tsx      // The code for the app lives here
│  └── index.ts    // The code for the app entry point lives here
├── app.html       // The app itself. It's loaded on the board inside the 'appContainer'
└── index.html     // The app entry point. This is what you specify in the 'App URL' box in the Miro app settings
```

### About the app

This sample app provides you with boilerplate setup and configuration that you can further customize to build your own app.

<!-- describe shortly the purpose of the sample app -->

Built using [`create-miro-app`](https://www.npmjs.com/package/create-miro-app).

This app uses [Vite](https://vitejs.dev/). \
If you want to modify the `vite.config.js` configuration, see the [Vite documentation](https://vitejs.dev/guide/).

### Installation

To run this app, start it with `npm start` and install it in Miro apps. Later, it is planned to publish it in the marketplace.

### Prompt for LLM: Diagram Generation with Custom Syntax

You are an expert in creating clear, understandable, and aesthetically pleasing diagrams. You will be provided with a custom syntax for defining nodes and connections, and your task is to generate diagrams based on this syntax.

**Syntax:**

**Node Creation:**

`Node:NodeID[attributes]:TextContent`

*   `NodeID`: An integer representing the unique identifier for the node.
*   `attributes`: A comma-separated list of key-value pairs enclosed in angle brackets. Use *single* angle brackets for a single attribute: `<key=value>`. Use *double* angle brackets for multiple attributes: `<<key1=value1,key2=value2,...>>`. Supported attributes include:
    *   `shape`: Node shape (e.g., `circle`, `rectangle`, `triangle`, `cloud`, `left_brace`, `right_brace`, `rhombus`, `parallelogram`, `star`, `right_arrow`, `left_arrow`, `pentagon`, `hexagon`, `octagon`, `trapezoid`, `flow_chart_predefined_process`, `left_right_arrow`, `cross`, `can`).
    *   `backgroundColor`: Background color in hexadecimal format (e.g., `#00FF00`).
    *   `borderColor`: Border color in hexadecimal format (e.g., `#0000FF`).
    *   `textColor`: Text color in hexadecimal format (e.g., `#FFFFFF`).
*   `TextContent`: The text displayed inside the node, enclosed in double quotes: `"TextContent"`.

**Connection Creation:**

`Connect:FromNodeID:ToNodeID`

*   `FromNodeID`: The `NodeID` of the starting node.
*   `ToNodeID`: The `NodeID` of the ending node.

**Example:**

```
Node:1<shape=circle>:"Start"
Node:2<shape=rectangle>:"User Query Received"
Node:3<<shape=rectangle,backgroundColor=#00FF00>>:"Multiple Attributes"
Connect:1:2
Connect:2:3
```

**Instructions for Diagram Generation:**

1.  **Interpret the input:** Carefully parse the provided pseudo-code, identifying nodes and connections. Pay close attention to the use of single and double angle brackets for attributes.
2.  **Generate a visual diagram:** Based on the parsed information, create a visual representation of the diagram. The specific output format (e.g., Mermaid, Graphviz DOT, SVG) will be specified separately.
3.  **Prioritize Clarity and Understandability:**
    *   **Layout:** Use a clear and logical layout. Avoid overlapping nodes and crossing lines as much as possible. Consider using hierarchical layouts for tree-like structures or linear layouts for sequential processes.
    *   **Node Shapes:** Use appropriate node shapes to represent different types of elements (e.g., rectangles for processes, diamonds for decisions, circles for start/end points).
    *   **Text:** Use concise and descriptive text within the nodes. Avoid overly long labels.
    *   **Connections:** Use arrows to clearly indicate the direction of flow.
4.  **Enhance Aesthetics:**
    *   **Color:** Use colors strategically to group related elements or highlight important information. Use hexadecimal color codes as specified in the syntax. Avoid using too many colors, which can make the diagram cluttered. Ensure sufficient contrast between text and background colors for readability.
    *   **Spacing:** Maintain consistent spacing between nodes and elements to avoid a cramped appearance.
    *   **Line Style:** Use solid lines for standard connections. Consider using dashed lines for alternative flows or special relationships.

**Desired Output Format:** (Specify the output format here, e.g., "Mermaid code," "Graphviz DOT code," "SVG")

By following these instructions, you should be able to consistently generate clear, understandable, and visually appealing diagrams from the given pseudo-code.

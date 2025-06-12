import React from "react";
import GraphBuilder from "./components/GraphBuilder";
import SimulationCanvas from "./components/SimulationCanvas";
import LaplacianViewer from "./components/LaplacianViewer";
import EigenmodeViewer from "./components/EigenmodeViewer";

function App() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Mass-Spring Network Simulator</h1>
      <GraphBuilder />
      <SimulationCanvas />
      <LaplacianViewer />
      <EigenmodeViewer />
    </div>
  );
}

export default App;

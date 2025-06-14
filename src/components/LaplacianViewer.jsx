import React from "react";
import { BlockMath } from "react-katex";
import { matrixToLatex } from "../utils/laplacian";
import "katex/dist/katex.min.css";

function LaplacianViewer({ matrix }) {
  if (!matrix || matrix.length === 0) return null;

  return (
    <div>
      <h3>Laplacian Matrix</h3>
      <div style={{ marginBottom: "1rem" }}>
        <BlockMath
          math={String.raw`
            L_{ij} = 
            \begin{cases}
              -k & \text{if nodes } i \text{ and } j \text{ are connected by a spring of constant } k \\
              \sum k & \text{if } i = j \text{ (sum over all springs connected to node } i) \\
              0 & \text{otherwise}
            \end{cases}
          `}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <BlockMath math={matrixToLatex(matrix)} />
      </div>
    </div>
  );
}

export default LaplacianViewer;

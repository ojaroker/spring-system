import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import { matrixToLatex } from "../utils/laplacian";
import "katex/dist/katex.min.css";

function LaplacianViewer({ matrix }) {
  if (!matrix || matrix.length === 0) return null;

  return (
    <div>
      <h3>2D Stiffness Matrix (Spring-Laplacian)</h3>
      <div style={{ marginBottom: "1rem" }}>
        <BlockMath
          math={String.raw`
            L_{ij} = 
            \begin{cases}
              -k_{ij} \mathbf{e}_{ij}\mathbf{e}_{ij}^T & \text{if } i \neq j \text{ connected} \\
              \sum_{j} k_{ij} \mathbf{e}_{ij}\mathbf{e}_{ij}^T & \text{if } i = j \\
              0 & \text{otherwise}
            \end{cases}
          `}
        />
        <div
          style={{ marginTop: "1rem", fontSize: "0.9rem", lineHeight: "1.5" }}
        >
          <p>
            <strong>Matrix Structure Explained:</strong>
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li>
              Each <InlineMath math="\mathbf{e}_{ij}\mathbf{e}_{ij}^T" /> block
              expands to:
              <BlockMath
                math={String.raw`
                \begin{bmatrix}
                  k_{ij}e_xe_x & k_{ij}e_xe_y \\
                  k_{ij}e_ye_x & k_{ij}e_ye_y
                \end{bmatrix}
              `}
              />
              showing how x and y coordinates couple through springs
            </li>
            <li>
              Matrix entries alternate x/y components:
              <InlineMath math="[x_1, y_1, x_2, y_2, \dots]^T" />
            </li>
            <li>
              Diagonal blocks (<InlineMath math="i=j" />) sum{" "}
              <strong>all</strong> spring connections to that mass
            </li>
            <li>
              Off-diagonal blocks (<InlineMath math="i\neq j" />) show{" "}
              <strong>direct</strong> spring connections
            </li>
          </ul>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content auto",
              gap: "0.5rem",
              marginTop: "1rem",
              fontSize: "0.85rem",
            }}
          >
            <div>
              <strong>Quick Guide:</strong>
            </div>
            <div></div>
            <div style={{ color: "#d32f2f" }}>▉ Negative values:</div>
            <div>Spring coupling between different masses</div>
            <div style={{ color: "#1976d2" }}>▉ Positive values:</div>
            <div>Mass's total spring connections (diagonal)</div>
            <div>Zero values:</div>
            <div>No direct spring connection</div>
          </div>
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
          marginTop: "1rem",
          border: "1px solid #eee",
          padding: "0.5rem",
          backgroundColor: "#fafafa",
        }}
      >
        <BlockMath math={matrixToLatex(matrix)} />
      </div>
    </div>
  );
}

export default LaplacianViewer;

import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import { matrixToLatex } from "../utils/massLaplacian";
import "katex/dist/katex.min.css";

function LaplacianViewer({ matrix }) {
  if (!matrix || matrix.length === 0) return null;

  return (
    <div>
      <h3>2D Dynamic System Matrices</h3>

      {/* Stiffness Matrix Section */}
      <div
        style={{
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #eee",
        }}
      >
        <h4 style={{ color: "#2c3e50" }}>Stiffness Matrix (K)</h4>
        <BlockMath
          math={String.raw`
            K_{ij} = 
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
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li>Each block couples x/y motion through spring orientation</li>
            <li>Diagonal dominance increases with more springs</li>
          </ul>
        </div>
      </div>

      {/* Mass Matrix Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ color: "#2c3e50" }}>Mass Matrix (M)</h4>
        <BlockMath
          math="M = \begin{bmatrix}
          m_1 & 0 & 0 & \cdots \\
          0 & m_1 & 0 & \cdots \\
          0 & 0 & m_2 & \cdots \\
          \vdots & \vdots & \vdots & \ddots
        \end{bmatrix}"
        />
        <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          <p>Diagonal matrix with mass values repeated for x/y components:</p>
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li>
              Mass <InlineMath math="m_i" /> appears at positions{" "}
              <InlineMath math="(2i,2i)" /> and{" "}
              <InlineMath math="(2i+1,2i+1)" />
            </li>
            <li>All off-diagonal terms are zero</li>
          </ul>
        </div>
      </div>

      {/* Combined System Section */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ color: "#2c3e50" }}>Dynamic System (M⁻¹K)</h4>
        <BlockMath math="\text{Normal modes solve: } (K - \omega^2 M)\mathbf{v} = 0" />
        <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          <p>Key properties:</p>
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li>
              Eigenvalues <InlineMath math="\lambda = \omega^2" /> give squared
              vibration frequencies
            </li>
            <li>
              Eigenvectors <InlineMath math="\mathbf{v}" /> show mass-weighted
              displacements
            </li>
            <li>
              Heavier masses (larger <InlineMath math="m_i" />) reduce
              corresponding <InlineMath math="\omega" />
            </li>
          </ul>
        </div>
      </div>

      {/* Matrix Display */}
      <div style={{ marginTop: "2rem" }}>
        <h4>Current Matrix Display</h4>
        <div
          style={{
            overflowX: "auto",
            border: "1px solid #eee",
            padding: "0.5rem",
            backgroundColor: "#fafafa",
          }}
        >
          <BlockMath math={matrixToLatex(matrix)} />
        </div>
      </div>
    </div>
  );
}
export default LaplacianViewer;

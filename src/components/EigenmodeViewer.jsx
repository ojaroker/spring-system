import React, { useState } from "react";
import { BlockMath } from "react-katex";
import { computeEigenDecomposition } from "../utils/eigen";
import SimulationCanvas from "./SimulationCanvas";

// takes laplacian and calculates eigenvalues of M^-1 * L

function EigenmodeViewer({ matrix, masses, springs }) {
  const [eigenData, setEigenData] = useState(null);
  const [massMatrix, setMassMatrix] = useState(null);
  const [scaledMatrix, setScaledMatrix] = useState(null);

  function computeEigenvalues() {
    try {
      const n = masses.length;

      // Build diagonal mass matrix M
      const M = masses.map((m, i) => {
        const row = Array(n).fill(0);
        row[i] = m.mass;
        return row;
      });

      // Build M^{-1}
      const M_inv = M.map((row, i) => {
        const newRow = Array(n).fill(0);
        newRow[i] = 1 / masses[i].mass;
        return newRow;
      });

      // Compute M^{-1}L
      const M_inv_L = M_inv.map((row, i) =>
        row.map((_, j) =>
          row.reduce((sum, val, k) => sum + val * matrix[k][j], 0)
        )
      );

      const result = computeEigenDecomposition(M_inv_L);

      setMassMatrix(M);
      setScaledMatrix(M_inv_L);
      setEigenData(result);
    } catch (err) {
      console.error(err);
      alert("Eigenvalue computation failed.");
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Eigenvalues and Normal Modes (Mass-Scaled)</h3>
      <button onClick={computeEigenvalues}>Compute Eigenvalues</button>

      {eigenData && (
        <>
          {/* Mass Matrix M */}
          <div style={{ marginTop: "1rem" }}>
            <BlockMath math={"\\text{Mass Matrix } M:"} />
            <BlockMath
              math={`\\begin{bmatrix}
                ${massMatrix
                  .map((row) => row.map((v) => v.toFixed(2)).join(" & "))
                  .join(" \\\\ ")}
              \\end{bmatrix}`}
            />
          </div>

          {/* Scaled Matrix M^{-1}L */}
          <div style={{ marginTop: "1rem" }}>
            <BlockMath math={"\\text{Mass-scaled Matrix } M^{-1}L:"} />
            <BlockMath
              math={`\\begin{bmatrix}
                ${scaledMatrix
                  .map((row) => row.map((v) => v.toFixed(2)).join(" & "))
                  .join(" \\\\ ")}
              \\end{bmatrix}`}
            />
          </div>

          {/* Eigenvalues */}
          <div style={{ marginTop: "1rem" }}>
            <BlockMath
              math={`\\text{Eigenvalues of }M^{-1}L\\text{: } \\left[ ${eigenData.values
                .map((v) => v.toFixed(2))
                .join(", ")} \\right]`}
            />

            <BlockMath math={"\\text{Matrix } P \\text{ (columns = eigenvectors):}"} />
            <BlockMath
              math={`\\begin{bmatrix}
                ${eigenData.P
                  .map((row) => row.map((v) => v.toFixed(2)).join(" & "))
                  .join(" \\\\ ")}
              \\end{bmatrix}`}
            />

            <BlockMath math={"\\text{Diagonal matrix } D:"} />
            <BlockMath
              math={`\\begin{bmatrix}
                ${eigenData.D
                  .map((row) => row.map((v) => v.toFixed(2)).join(" & "))
                  .join(" \\\\ ")}
              \\end{bmatrix}`}
            />
          </div>

          

          {/* Show Simulation */}
          <SimulationCanvas
            masses={masses}
            springs={springs}
            eigenData={eigenData}
          />
        </>
      )}
    </div>
  );
}

export default EigenmodeViewer;

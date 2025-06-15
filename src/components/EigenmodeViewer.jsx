import React, { useState } from "react";
import { BlockMath } from "react-katex";
import { computeEigenDecomposition } from "../utils/eigen";

function EigenmodeViewer({ matrix }) {
  const [eigenData, setEigenData] = useState(null);

  function computeEigenvalues() {
  try {
    const result = computeEigenDecomposition(matrix);
    setEigenData(result);
  } catch {
    alert("Eigenvalue computation failed.");
  }
}

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Eigenvalues and Diagonalization</h3>
      <button onClick={computeEigenvalues}>Compute Eigenvalues</button>

      {eigenData && (
        <div style={{ marginTop: "1rem" }}>
          <BlockMath math={`\\text{Eigenvalues: } \\left[ ${eigenData.values.map((v) => v.toFixed(2)).join(", ")} \\right]`} />

          <BlockMath math={"\\text{Matrix } P \\text{ (columns = eigenvectors):}"} />
          <BlockMath
            math={`\\begin{bmatrix}
              ${eigenData.P.map((row) => row.map((v) => v.toFixed(2)).join(" & ")).join(" \\\\ ")}
            \\end{bmatrix}`}
          />

          <BlockMath math={"\\text{Diagonal matrix } D:"} />
          <BlockMath
            math={`\\begin{bmatrix}
              ${eigenData.D.map((row) => row.map((v) => v.toFixed(2)).join(" & ")).join(" \\\\ ")}
            \\end{bmatrix}`}
          />

          <BlockMath math={"\\text{Reconstructed } L = P D P^{-1}:"} />
          <BlockMath
            math={`\\begin{bmatrix}
              ${eigenData.reconstructedL.map((row) => row.map((v) => v.toFixed(2)).join(" & ")).join(" \\\\ ")}
            \\end{bmatrix}`}
          />
        </div>
      )}
    </div>
  );
}

export default EigenmodeViewer;

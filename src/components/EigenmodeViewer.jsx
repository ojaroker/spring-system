import React, { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";

function formatEigenvalues(values) {
  const tolerance = 1e-6;
  const zeroCount = values.filter((v) => Math.abs(v) < tolerance).length;
  const nonZeroValues = values.filter((v) => Math.abs(v) >= tolerance);

  return zeroCount > 0
    ? `0^{(${zeroCount})}, ${nonZeroValues.map((v) => v.toFixed(2)).join(", ")}`
    : nonZeroValues.map((v) => v.toFixed(2)).join(", ");
}

function EigenmodeViewer({ eigenData }) {
  const [selectedMode, setSelectedMode] = useState(0);

  if (!eigenData) return null;

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>Normal Mode Analysis</h3>

      <div style={{ marginBottom: "1.5rem" }}>
        <BlockMath
          math={`\\text{Eigenvalues (}\\omega^2\\text{): } [${formatEigenvalues(eigenData.values)}]`}
        />
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Each eigenvalue represents a squared angular frequency (
          <InlineMath math="\omega^2" />) of vibration.
        </p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>
          Select Mode:
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(parseInt(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          >
            {eigenData.physicalModes.map((mode, idx) => (
              <option key={mode.index} value={idx}>
                Mode {idx} (ω = {mode.angularFrequency.toFixed(2)} rad/s)
              </option>
            ))}
          </select>
        </label>
      </div>

      {eigenData.vectors && eigenData.vectors.length > 0 && (
        <div>
          <div style={{ marginBottom: "0.5rem" }}>
            <BlockMath math={`\\text{Mode Shape Vector:}`} />
          </div>
          <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
            <BlockMath
              math={`\\begin{bmatrix}
                ${eigenData.physicalModes[selectedMode].vector
                  .map((v) => v.toFixed(4))
                  .join(" \\\\ ")}
              \\end{bmatrix}`}
            />
          </div>
          <div style={{ fontSize: "0.9rem" }}>
            <p>
              <strong>Vector Interpretation:</strong>
            </p>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li>
                Alternating x/y components:{" "}
                <InlineMath math="[x_1, y_1, x_2, y_2, \dots]" />
              </li>
              <li>
                Values describe{" "}
                <strong>relative amplitudes and directions</strong> of mass
                displacements
              </li>
              <li>Larger values indicate more motion along that axis</li>
              <li>
                Positive/negative signs indicate{" "}
                <strong>relative direction</strong> of movement
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EigenmodeViewer;

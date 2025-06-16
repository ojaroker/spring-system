import React, { useState } from "react";
import { BlockMath } from "react-katex";
import { computeEigenDecomposition } from "../utils/eigen";
import SimulationCanvas from "./SimulationCanvas";

function formatEigenvalues(values) {
  const tolerance = 1e-6;
  const zeroCount = values.filter((v) => Math.abs(v) < tolerance).length;
  const nonZeroValues = values.filter((v) => Math.abs(v) >= tolerance);

  return zeroCount > 0
    ? `0^{(${zeroCount})}, ${nonZeroValues.map((v) => v.toFixed(2)).join(", ")}`
    : nonZeroValues.map((v) => v.toFixed(2)).join(", ");
}

function EigenmodeViewer({ matrix, masses, springs, eigenData }) {
  const [selectedMode, setSelectedMode] = useState(0);
  const [amplitude, setAmplitude] = useState(1);

  if (!eigenData) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Eigenmodes Analysis</h3>

      <div style={{ marginBottom: "1rem" }}>
        <BlockMath
          math={`\\text{Eigenvalues: } [${formatEigenvalues(eigenData.values)}]`}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Mode:
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(parseInt(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          >
            {eigenData.physicalModes.map((mode, idx) => (
              <option key={mode.index} value={mode.index}>
                Mode {idx} (f = {mode.frequency.toFixed(2)} Hz)
              </option>
            ))}
          </select>
        </label>
      </div>

      {eigenData.vectors && eigenData.vectors.length > 0 && (
        <div>
          <BlockMath math={`\\text{Selected Mode Shape (${selectedMode}):}`} />
          <div style={{ overflowX: "auto" }}>
            <BlockMath
              math={`\\begin{bmatrix}
                ${eigenData.vectors[selectedMode]
                  .map((v) => v.toFixed(4))
                  .join(" \\\\ ")}
              \\end{bmatrix}`}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <label>
          Amplitude:
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          />
          {amplitude.toFixed(1)}
        </label>
      </div>
    </div>
  );
}

export default EigenmodeViewer;

import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function MassTable({ masses, eigenData }) {
  if (!eigenData?.vectors || !masses?.length) return null;

  // Filter out trivial modes (near-zero eigenvalues)
  const physicalModes = eigenData.values
    .map((value, index) => ({
      value,
      index,
      vector: eigenData.vectors[index],
      angularFrequency: eigenData.angularFrequencies[index],
      frequency: eigenData.frequencies[index],
    }))
    .filter((mode) => Math.abs(mode.value) > 1e-6);

  return (
    <div
      style={{
        margin: "2rem 0",
        backgroundColor: "#f8f9fa",
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        Mass Properties and Physical Normal Modes
      </h3>

      <div style={{ marginBottom: "1.5rem" }}>
        <p>
          <strong>Physical normal modes</strong> represent the system's natural
          vibration patterns. Trivial modes (rigid body motions) have been
          filtered out.
        </p>

        <p style={{ marginTop: "0.5rem" }}>
          Showing {physicalModes.length} physical mode(s) of{" "}
          {eigenData.values.length} total solutions.
        </p>
      </div>

      {physicalModes.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={thStyle}>Mass</th>
                <th style={thStyle}>Value (kg)</th>
                <th style={thStyle}>Mode</th>
                <th style={thStyle}>ω (rad/s)</th>
                <th style={thStyle}>Frequency (Hz)</th>
                <th style={thStyle}>X Component</th>
                <th style={thStyle}>Y Component</th>
                <th style={thStyle}>Phase</th>
              </tr>
            </thead>
            <tbody>
              {masses.map((mass, massIndex) =>
                physicalModes.map((mode, modeIdx) => {
                  const xComp = mode.vector[2 * massIndex] || 0;
                  const yComp = mode.vector[2 * massIndex + 1] || 0;
                  const amplitude = Math.sqrt(xComp ** 2 + yComp ** 2);
                  const phase = (Math.atan2(yComp, xComp) * 180) / Math.PI;

                  return (
                    <tr
                      key={`${massIndex}-${modeIdx}`}
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      {modeIdx === 0 && (
                        <>
                          <td rowSpan={physicalModes.length} style={tdStyle}>
                            Mass {mass.id}
                          </td>
                          <td rowSpan={physicalModes.length} style={tdStyle}>
                            {mass.mass.toFixed(2)}
                          </td>
                        </>
                      )}
                      <td style={tdStyle}>Mode {modeIdx}</td>
                      <td style={tdStyle}>
                        {mode.angularFrequency.toFixed(2)}
                      </td>
                      <td style={tdStyle}>{mode.frequency.toFixed(2)}</td>
                      <td style={tdStyle}>{xComp.toFixed(4)}</td>
                      <td style={tdStyle}>{yComp.toFixed(4)}</td>
                      <td style={tdStyle}>
                        {amplitude.toFixed(2)} ∠ {phase.toFixed(0)}°
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            color: "#d32f2f",
            padding: "1rem",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          No physical vibration modes detected (only rigid body motions).
        </div>
      )}

      <div style={{ fontStyle: "italic", color: "#555", marginTop: "1rem" }}>
        <p>
          <strong>Interpretation:</strong> Each row shows a mass's motion in a
          specific mode. Phase angle indicates direction of displacement (0° =
          +x, 90° = +y).
        </p>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
  position: "sticky",
  top: 0,
  backgroundColor: "#f2f2f2",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top",
};

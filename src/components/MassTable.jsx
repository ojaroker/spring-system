import React from "react";

export default function MassTable({ masses, eigenData }) {
  if (!eigenData || !masses || masses.length === 0) return null;

  const { values, P } = eigenData;

  return (
    <div style={{ margin: "2rem 0" }}>
      <h3>Masses and Normal Modes</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>Mass ID</th>
            <th style={thStyle}>Mass Value</th>
            <th style={thStyle}>Eigenvalue</th>
            <th style={thStyle}>Normal Mode Vector</th>
          </tr>
        </thead>
        <tbody>
          {masses.map((mass, i) => (
            <tr key={i}>
              <td style={tdStyle}>{mass.id}</td>
              <td style={tdStyle}>{mass.mass.toFixed(2)}</td>
              <td style={tdStyle}>{values[i]?.toFixed(4)}</td>
              <td style={tdStyle}>
                [{P.map((row) => row[i].toFixed(2)).join(", ")}]
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

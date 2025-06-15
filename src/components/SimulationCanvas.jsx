import React from "react";
import MassTable from "./MassTable";

export default function SimulationCanvas({ masses, eigenData }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      {eigenData ? (
        <MassTable masses={masses} eigenData={eigenData} />
      ) : (
        <div>Please compute eigenvalues first to see the mass table.</div>
      )}
    </div>
  );
}

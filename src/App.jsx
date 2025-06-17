import React, { useState, useEffect } from "react";
import GraphBuilder from "./components/GraphBuilder";
import LaplacianViewer from "./components/LaplacianViewer";
import EigenmodeViewer from "./components/EigenmodeViewer";
import MassTable from "./components/MassTable";
import SimulationCanvas from "./components/SimulationCanvas";
import { buildMassStiffness } from "./utils/massLaplacian";
import { computeEigenDecomposition } from "./utils/eigen";

function App() {
  const [masses, setMasses] = useState([]);
  const [springs, setSprings] = useState([]);
  const [laplacian, setLaplacian] = useState(null);
  const [eigenData, setEigenData] = useState(null);
  const [isComputing, setIsComputing] = useState(false);

  // Build Laplacian matrix when masses or springs change
  useEffect(() => {
    if (masses.length > 0 && springs.length > 0) {
      const MS = buildMassStiffness(masses, springs);
      setLaplacian(MS);
    } else {
      setLaplacian(null);
      setEigenData(null);
    }
  }, [masses, springs]);

  // Compute eigenvalues when Laplacian changes
  useEffect(() => {
    if (!laplacian) {
      setEigenData(null);
      return;
    }

    const computeEigenvalues = async () => {
      setIsComputing(true);
      try {
        const result = computeEigenDecomposition(laplacian);
        setEigenData(result);
      } catch (error) {
        console.error("Eigenvalue computation failed:", error);
        alert(
          "Eigenvalue computation failed. Please check your system configuration.",
        );
      } finally {
        setIsComputing(false);
      }
    };

    computeEigenvalues();
  }, [laplacian]);

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#2c3e50" }}>2D Mass-Spring System Simulator</h1>
        <p style={{ color: "#7f8c8d" }}>
          Visualize normal modes of a 2D mass-spring network
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <GraphBuilder setMasses={setMasses} setSprings={setSprings} />
        </div>

        {laplacian && (
          <>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <LaplacianViewer
                matrix={laplacian}
                masses={masses}
                springs={springs}
              />
            </div>

            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <EigenmodeViewer
                matrix={laplacian}
                masses={masses}
                springs={springs}
                eigenData={eigenData}
                isComputing={isComputing}
              />
            </div>
          </>
        )}
      </div>

      {/* Simulation Canvas Section */}
      {eigenData && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#f8f9fa",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <SimulationCanvas
            masses={masses}
            springs={springs}
            eigenData={eigenData}
          />
        </div>
      )}

      {/* Mass Table Section */}
      {eigenData && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#f8f9fa",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <MassTable masses={masses} eigenData={eigenData} />
        </div>
      )}
    </div>
  );
}

export default App;

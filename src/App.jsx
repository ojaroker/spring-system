import React, { useState, useEffect } from "react";
import GraphBuilder from "./components/GraphBuilder";
import LaplacianViewer from "./components/LaplacianViewer";
import EigenmodeViewer from "./components/EigenmodeViewer";
import { buildLaplacian } from "./utils/laplacian";

function App() {
  const [masses, setMasses] = useState([]);
  const [springs, setSprings] = useState([]);
  const [laplacian, setLaplacian] = useState(null);

  useEffect(() => {
    if (masses.length > 0 && springs.length > 0) {
      const L = buildLaplacian(masses, springs);
      console.log("Built Laplacian:", L);
      setLaplacian(L);
    } else {
      setLaplacian(null);
    }
  }, [masses, springs]);

  console.log("Masses:", masses);
  console.log("Springs:", springs);
  console.log("Laplacian:", laplacian);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Mass-Spring Network Simulator</h2>
      <GraphBuilder setMasses={setMasses} setSprings={setSprings} />

      {laplacian && (
        <>
          <LaplacianViewer matrix={laplacian} />
          <EigenmodeViewer
            matrix={laplacian}
            masses={masses}
            springs={springs}
          />
        </>
      )}
    </div>
  );
}

export default App;

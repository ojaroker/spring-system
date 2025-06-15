import React, { useState } from "react";
import { buildLaplacian } from "../utils/laplacian";
import LaplacianViewer from "./LaplacianViewer";
import EigenmodeViewer from "./EigenmodeViewer";

export default function GraphBuilder() {
  const [numMasses, setNumMasses] = useState("");
  const [masses, setMasses] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(400);
  const [springs, setSprings] = useState([]);
  const [selectedMasses, setSelectedMasses] = useState([]);
  const [springPlacementMode, setSpringPlacementMode] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const n = parseInt(numMasses);
    if (isNaN(n) || n <= 0) return;

    const radius = 150;
    const centerX = 250;
    const centerY = 200;
    const newMasses = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n;
      return {
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        mass: 1.0,
      };
    });

    setMasses(newMasses);
    setHasSubmitted(true);
  }

  function handleMouseDown(id) {
    if (springPlacementMode) {
      if (!selectedMasses.includes(id)) {
        const newSelection = [...selectedMasses, id];
        setSelectedMasses(newSelection);

        if (newSelection.length === 2) {
          const [id1, id2] = newSelection;
          const k = parseFloat(prompt("Enter spring constant (k):", "1.0"));
          if (!isNaN(k) && k > 0) {
            setSprings((prev) => [...prev, { id1, id2, k }]);
          }
          setSelectedMasses([]); // Reset selection
        }
      }
    } else {
      setDraggingId(id); // normal drag mode
    }
  }

  function handleMouseUp() {
    setDraggingId(null);
  }

  function handleMouseMove(e) {
    if (draggingId === null) return;

    const svg = e.target.closest("svg");
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMasses((prev) =>
      prev.map((m) => (m.id === draggingId ? { ...m, x, y } : m)),
    );
  }

  function handleMassChange(id, newMass) {
    const massVal = parseFloat(newMass);
    if (isNaN(massVal) || massVal <= 0) return; // prevent zero or negative mass

    setMasses((prev) =>
      prev.map((m) => (m.id === id ? { ...m, mass: massVal } : m)),
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {!hasSubmitted && (
        <form onSubmit={handleSubmit}>
          <label>
            How many masses? (Enter value between 2 and 20)
            <input
              type="number"
              value={numMasses}
              onChange={(e) => setNumMasses(e.target.value)}
              min="2"
              max="20"
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
          <button type="submit" style={{ marginLeft: "1rem" }}>
            Create
          </button>
        </form>
      )}

      {hasSubmitted && (
        <>
          <svg
            width={canvasWidth}
            height={canvasHeight}
            style={{ border: "1px solid gray", marginBottom: "1rem" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Render springs */}
            {springs.map((s, i) => {
              const m1 = masses.find((m) => m.id === s.id1);
              const m2 = masses.find((m) => m.id === s.id2);
              if (!m1 || !m2) return null;

              return (
                <g key={i}>
                  <line
                    x1={m1.x}
                    y1={m1.y}
                    x2={m2.x}
                    y2={m2.y}
                    stroke="green"
                    strokeWidth="2"
                  />
                  <text
                    x={(m1.x + m2.x) / 2}
                    y={(m1.y + m2.y) / 2 - 5}
                    fontSize="12px"
                    fill="darkgreen"
                  >
                    k = {s.k}
                  </text>
                </g>
              );
            })}

            {/* Render masses */}
            {masses.map((m) => (
              <React.Fragment key={m.id}>
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={Math.sqrt(m.mass) * 6}
                  fill="steelblue"
                  onMouseDown={() => handleMouseDown(m.id)}
                  style={{ cursor: "pointer" }}
                />
                <text x={m.x + 12} y={m.y + 4} fontSize="12px">
                  m = {m.mass}
                </text>
                <foreignObject x={m.x - 20} y={m.y + 15} width="40" height="30">
                  <input
                    type="number"
                    value={m.mass}
                    onChange={(e) => handleMassChange(m.id, e.target.value)}
                    style={{ width: "35px", fontSize: "12px" }}
                    min="0.1"
                    step="0.1"
                  />
                </foreignObject>
              </React.Fragment>
            ))}
          </svg>

          {/* Controls under canvas */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Width:
              <input
                type="number"
                value={canvasWidth}
                onChange={(e) =>
                  setCanvasWidth(parseInt(e.target.value) || 100)
                }
                min="100"
                style={{ marginLeft: "0.5rem", marginRight: "1rem" }}
              />
            </label>
            <label>
              Height:
              <input
                type="number"
                value={canvasHeight}
                onChange={(e) =>
                  setCanvasHeight(parseInt(e.target.value) || 100)
                }
                min="100"
              />
            </label>
          </div>

          <div>
            <button
              onClick={() => setSpringPlacementMode(!springPlacementMode)}
            >
              {springPlacementMode
                ? "Exit Spring Placement Mode"
                : "Enter Spring Placement Mode"}
            </button>

            <button
              onClick={() =>
                setSprings((prev) => prev.slice(0, prev.length - 1))
              }
              disabled={springs.length === 0}
              style={{ marginLeft: "1rem" }}
            >
              Undo Last Spring
            </button>
          </div>
          {springs.length > 0 && (
            <div>
              <LaplacianViewer matrix={buildLaplacian(masses, springs)} />
              <EigenmodeViewer matrix={buildLaplacian(masses, springs)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";

const SimulationCanvas = ({ masses, springs, eigenData }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedModeIdx, setSelectedModeIdx] = useState(0);
  const [amplitude, setAmplitude] = useState(0.5);
  const animationRef = useRef(null);

  const physicalModes = eigenData?.physicalModes || [];
  const currentMode = physicalModes[selectedModeIdx] || null;

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = (timestamp) => {
      setTime(timestamp / 1000);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  // Draw the system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentMode) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = 50 * amplitude;
    const omega = currentMode.angularFrequency;

    // Draw springs
    springs.forEach((spring) => {
      const m1 = masses.find((m) => m.id === spring.id1);
      const m2 = masses.find((m) => m.id === spring.id2);
      if (!m1 || !m2) return;

      const dx1 = currentMode.vector[2 * spring.id1] || 0;
      const dy1 = currentMode.vector[2 * spring.id1 + 1] || 0;
      const dx2 = currentMode.vector[2 * spring.id2] || 0;
      const dy2 = currentMode.vector[2 * spring.id2 + 1] || 0;

      const x1 = m1.x + dx1 * scale * Math.cos(omega * time);
      const y1 = m1.y + dy1 * scale * Math.cos(omega * time);
      const x2 = m2.x + dx2 * scale * Math.cos(omega * time);
      const y2 = m2.y + dy2 * scale * Math.cos(omega * time);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "rgba(0, 128, 0, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw masses
    masses.forEach((mass) => {
      const dx = currentMode.vector[2 * mass.id] || 0;
      const dy = currentMode.vector[2 * mass.id + 1] || 0;
      const x = mass.x + dx * scale * Math.cos(omega * time);
      const y = mass.y + dy * scale * Math.cos(omega * time);

      // Original position
      ctx.beginPath();
      ctx.arc(mass.x, mass.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      ctx.fill();

      // Displacement vector
      ctx.beginPath();
      ctx.moveTo(mass.x, mass.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "rgba(255, 165, 0, 0.5)";
      ctx.stroke();

      // Current position
      ctx.beginPath();
      ctx.arc(x, y, Math.sqrt(mass.mass) * 6, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(70, 130, 180, 0.8)";
      ctx.fill();
    });
  }, [masses, springs, currentMode, time, amplitude]);

  if (!eigenData) return <div>No eigen data available</div>;

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
      }}
    >
      <h3>Normal Mode Visualization</h3>

      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
        <select
          value={selectedModeIdx}
          onChange={(e) => setSelectedModeIdx(Number(e.target.value))}
        >
          {physicalModes.map((mode, idx) => (
            <option key={idx} value={idx}>
              Mode {idx} (ω={mode.angularFrequency.toFixed(2)})
            </option>
          ))}
        </select>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={amplitude}
          onChange={(e) => setAmplitude(Number(e.target.value))}
        />
        <span>{amplitude.toFixed(2)}</span>

        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button onClick={() => setTime(0)}>↻ Reset</button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ width: "100%", border: "1px solid #ddd" }}
      />

      {currentMode && <p>Frequency: {currentMode.frequency.toFixed(2)} Hz</p>}
    </div>
  );
};

export default SimulationCanvas;

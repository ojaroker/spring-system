export function buildLaplacian(masses, springs) {
  const n = masses.length;
  // Create 2n × 2n matrix for 2D system (x1,y1,x2,y2,...)
  const L = Array(2 * n)
    .fill(0)
    .map(() => Array(2 * n).fill(0));

  for (const spring of springs) {
    const { id1, id2, k } = spring;
    const m1 = masses[id1];
    const m2 = masses[id2];

    // Get direction vector between masses
    const dx = m2.x - m1.x;
    const dy = m2.y - m1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) continue; // avoid division by zero

    // Normalized direction vector components
    const ex = dx / dist;
    const ey = dy / dist;

    // Spring stiffness tensor (outer product of direction vector)
    const kxx = k * ex * ex;
    const kxy = k * ex * ey;
    const kyx = k * ey * ex;
    const kyy = k * ey * ey;

    // Indices for x and y components of each mass
    const i_x = 2 * id1;
    const i_y = 2 * id1 + 1;
    const j_x = 2 * id2;
    const j_y = 2 * id2 + 1;

    // Helper function to set small values to 0
    const cleanValue = (val) => (Math.abs(val) < 1e-10 ? 0 : val);

    // Diagonal blocks (mass i)
    L[i_x][i_x] += cleanValue(kxx);
    L[i_x][i_y] += cleanValue(kxy);
    L[i_y][i_x] += cleanValue(kyx);
    L[i_y][i_y] += cleanValue(kyy);

    // Diagonal blocks (mass j)
    L[j_x][j_x] += cleanValue(kxx);
    L[j_x][j_y] += cleanValue(kxy);
    L[j_y][j_x] += cleanValue(kyx);
    L[j_y][j_y] += cleanValue(kyy);

    // Off-diagonal blocks (i-j and j-i)
    L[i_x][j_x] -= cleanValue(kxx);
    L[i_x][j_y] -= cleanValue(kxy);
    L[i_y][j_x] -= cleanValue(kyx);
    L[i_y][j_y] -= cleanValue(kyy);

    L[j_x][i_x] -= cleanValue(kxx);
    L[j_x][i_y] -= cleanValue(kxy);
    L[j_y][i_x] -= cleanValue(kyx);
    L[j_y][i_y] -= cleanValue(kyy);
  }

  // Clean up the entire matrix one more time to catch any accumulated rounding errors
  for (let i = 0; i < L.length; i++) {
    for (let j = 0; j < L[i].length; j++) {
      L[i][j] = Math.abs(L[i][j]) < 1e-10 ? 0 : L[i][j];
    }
  }

  return L;
}

export function matrixToLatex(matrix) {
  const rows = matrix.map((row) =>
    row
      .map((x) => {
        const num = Number(x);
        // Handle very small numbers
        if (Math.abs(num) < 1e-10) return "0";
        // Handle numbers that would display as 0.00... with toPrecision(3)
        const precision3 = num.toPrecision(3);
        return precision3.includes("e")
          ? "0"
          : precision3.replace(/\.?0+$/, "");
      })
      .join(" & "),
  );
  return `\\begin{bmatrix}\n${rows.join(" \\\\\n")}\n\\end{bmatrix}`;
}

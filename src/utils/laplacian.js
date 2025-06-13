export function buildLaplacian(masses, springs) {
  const n = masses.length;
  const L = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (const spring of springs) {
    const { id1, id2, k } = spring;
    const i = id1;
    const j = id2;

    L[i][i] += k;
    L[j][j] += k;
    L[i][j] -= k;
    L[j][i] -= k;
  }

  return L;
}

export function matrixToLatex(matrix) {
  const rows = matrix.map(
    row => row.map(x => x.toFixed(2)).join(" & ")
  );
  return `\\begin{bmatrix}\n${rows.join(" \\\\\n")}\n\\end{bmatrix}`;
}

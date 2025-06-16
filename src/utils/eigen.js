import { Matrix, EigenvalueDecomposition } from "ml-matrix";

export function computeEigenDecomposition(matrix) {
  try {
    const mat = new Matrix(matrix);
    const eig = new EigenvalueDecomposition(mat);

    // Process eigenvalues and eigenvectors
    const eigenvalues = eig.realEigenvalues;
    const eigenvectors = [];

    // Eigenvectors are in columns of the eigenvector matrix
    for (let col = 0; col < eig.eigenvectorMatrix.columns; col++) {
      const eigenvector = [];
      for (let row = 0; row < eig.eigenvectorMatrix.rows; row++) {
        eigenvector.push(eig.eigenvectorMatrix.get(row, col));
      }
      eigenvectors.push(eigenvector);
    }

    // Calculate derived quantities
    const angularFrequencies = eigenvalues.map((v) => Math.sqrt(Math.abs(v)));
    const frequencies = angularFrequencies.map((ω) => ω / (2 * Math.PI));

    // Filter physical modes (non-trivial vibrations)
    const physicalModes = eigenvalues
      .map((value, index) => ({
        value,
        index,
        vector: eigenvectors[index],
        angularFrequency: angularFrequencies[index],
        frequency: frequencies[index],
      }))
      .filter((mode) => Math.abs(mode.value) > 1e-6);

    return {
      values: eigenvalues, // All eigenvalues
      vectors: eigenvectors, // All eigenvectors
      angularFrequencies, // All √|λ|
      frequencies, // All f = ω/2π
      physicalModes, // Filtered non-trivial modes
    };
  } catch (err) {
    console.error("Eigen decomposition failed:", err);
    return {
      values: [],
      vectors: [],
      angularFrequencies: [],
      frequencies: [],
      physicalModes: [],
    };
  }
}

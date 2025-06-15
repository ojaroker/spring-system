import { Matrix, EigenvalueDecomposition, inverse } from "ml-matrix";

export function computeEigenDecomposition(matrix) {
  try {
    const A = new Matrix(matrix);
    const eig = new EigenvalueDecomposition(A);
    const values = eig.realEigenvalues;
    const P = eig.eigenvectorMatrix;
    const D = inverse(P).mmul(A).mmul(P);
    const reconstructedL = P.mmul(D).mmul(inverse(P)); // L = P D P⁻¹

    return {
      values,
      P: P.to2DArray(),
      D: D.to2DArray(),
      reconstructedL: reconstructedL.to2DArray(),
    };
  } catch (err) {
    console.error("Eigen decomposition failed:", err);
    throw err;
  }
}

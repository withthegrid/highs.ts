interface Variable {
  type: string;
  prefix: string;
  /**
   * Defaulted to -Infinity
   */
  lowerBound?: number;
  /**
   * Defaulted to Infinity
   */
  upperBound?: number;
}

interface VariableWithFactor {
  type: string;
  prefix: string;
  /**
   * Defaulted to 1
   */
  factor?: number;
}

interface Constraint {
  /**
   * Defaulted to -Infinity
   */
  lowerBound?: number;
  /**
   * Defaulted to Infinity
   */
  upperBound?: number;
  variables: VariableWithFactor[];
  identifier: string;
}

export interface Input {
  objective: VariableWithFactor[];
  variables: Variable[];
  constraints: Constraint[];
}

// type LinearProgramModel = {
//   objectiveVector: number[];
//   constraintMatrix: number[][];
//   bounds: {
//     constraint: {
//       lower: number[];
//       upper: number[];
//     };
//     variable: {
//       lower: number[];
//       upper: number[];
//     };
//   };
//   variableNames: string[];
//   constraintIdentifiers: string[];
// };

// type CompressedSparseRowMatrix = {
//   offsets: number[];
//   indices: number[];
//   values: number[];
// };

// function denseToCompressedSparseRow(
//   constraintMatrix: number[][]
// ): CompressedSparseRowMatrix {
//   const offsets: number[] = [0];
//   const indices: number[] = [];
//   const values: number[] = [];

//   if (constraintMatrix.length === 0) {
//     throw new Error('Matrix must have at least one row.');
//   }

//   const numberOfRows = constraintMatrix.length;
//   const numberOfColumns = constraintMatrix[0]!.length;
//   for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex += 1) {
//     const row = constraintMatrix[rowIndex];

//     if (row === undefined) {
//       throw new Error(`Row ${rowIndex} is undefined.`);
//     }

//     if (row.length !== numberOfColumns) {
//       throw new Error(
//         `Row ${rowIndex} has inconsistent length: expected ${numberOfColumns}, got ${row.length}`
//       );
//     }

//     for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex += 1) {
//       const value = row[columnIndex]!;
//       if (value !== 0) {
//         indices.push(columnIndex);
//         values.push(value);
//       }
//     }

//     offsets.push(indices.length);
//   }

//   return {
//     offsets: offsets.slice(0, -1), // remove the last offset to match HiGHS-style CSR format
//     indices,
//     values,
//   };
// }

// const model: LinearProgramModel = {
//   objectiveVector: [
//     0, 0, 15840, 0, 0, 15840, 0, 0, 0, 0, 0, 3, 0, 0, 15840, 0, 4, 0, 0, 0, 0,
//     0, 0, 3, 0, 0, 15840, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2,
//     0, 4, 0, 0, 0, 15840, 0, 0, 15840, 0, 4, 0, 0, 0, 0, 0, 0, 1,
//   ],
//   constraintMatrix: [
//     // [
//     //   0, 0, 15840, 0, 0, 15840, 0, 0, 0, 0, 0, 0, 0, 0, 15840, 0, 0, 0, 0, 0, 0,
//     //   0, 0, 0, 0, 0, 15840, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     //   0, 0, 0, 0, 0, 0, 15840, 0, 0, 15840, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     // ],
//     [
//       1, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 1, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//       -1, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//       -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 1, -1, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, 0, 0,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1,
//     ],
//     [
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 1, -1, -1, 0, 0, 0,
//     ],
//   ],
//   bounds: {
//     variable: {
//       lower: [
//         -15.219,
//         -Infinity,
//         0,
//         -8,
//         -Infinity,
//         0,
//         0,
//         -0,
//         0,
//         0,
//         2.675178,
//         0,
//         -8,
//         -Infinity,
//         0,
//         -4.52,
//         0,
//         0,
//         0,
//         -0,
//         0,
//         0,
//         2.675178,
//         0,
//         -16,
//         -Infinity,
//         0,
//         0,
//         -0,
//         0,
//         0,
//         2.675178,
//         0,
//         0,
//         -0,
//         0,
//         0,
//         2.0732629499999997,
//         0,
//         0,
//         -0,
//         0,
//         0,
//         2.34078075,
//         0,
//         -4.52,
//         0,
//         0,
//         -17.5,
//         -Infinity,
//         0,
//         -17.5,
//         -Infinity,
//         0,
//         -9.04,
//         0,
//         0,
//         0,
//         -0,
//         0,
//         0,
//         5.350356,
//         0,
//       ],
//       upper: [
//         24.13,
//         Infinity,
//         Infinity,
//         8,
//         Infinity,
//         Infinity,
//         0,
//         -0,
//         8.8,
//         Infinity,
//         2.675178,
//         Infinity,
//         7.6,
//         Infinity,
//         Infinity,
//         0,
//         Infinity,
//         Infinity,
//         0,
//         -0,
//         8.8,
//         Infinity,
//         2.675178,
//         Infinity,
//         14,
//         Infinity,
//         Infinity,
//         0,
//         -0,
//         6.415200000000001,
//         Infinity,
//         2.675178,
//         Infinity,
//         0,
//         -0,
//         4.971780000000001,
//         Infinity,
//         2.0732629499999997,
//         Infinity,
//         0,
//         -0,
//         5.6133000000000015,
//         Infinity,
//         2.34078075,
//         Infinity,
//         5,
//         Infinity,
//         Infinity,
//         16.685,
//         Infinity,
//         Infinity,
//         13.125,
//         Infinity,
//         Infinity,
//         10,
//         Infinity,
//         Infinity,
//         0,
//         -0,
//         17.0016,
//         Infinity,
//         5.350356,
//         Infinity,
//       ],
//     },
//     constraint: {
//       lower: [
//         // 0,
//         0,
//         0,
//         0,
//         -1.50435,
//         0,
//         0,
//         -Infinity,
//         -Infinity,
//         0,
//         -0.00709,
//         0,
//         0,
//         -1.5199875,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         0,
//         -3.50328,
//         0,
//         0,
//         -5.3301725,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         0,
//         0,
//         0,
//         -0.98121,
//         0,
//         0,
//         -4.68601,
//         0,
//         0,
//         -9.470530000631312,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         -Infinity,
//         0,
//       ],
//       upper: [
//         // 0.000009999999999999999,
//         0,
//         Infinity,
//         Infinity,
//         -1.50435,
//         Infinity,
//         Infinity,
//         2.675178,
//         -2.675178,
//         0,
//         -0.00709,
//         Infinity,
//         Infinity,
//         1.5199875,
//         0,
//         -0,
//         2.675178,
//         -2.675178,
//         0,
//         -3.50328,
//         Infinity,
//         Infinity,
//         -2.2901975000000006,
//         2.675178,
//         -2.675178,
//         2.0732629499999997,
//         -2.0732629499999997,
//         2.34078075,
//         -2.34078075,
//         -5,
//         5,
//         0,
//         0,
//         0,
//         -0.98121,
//         Infinity,
//         Infinity,
//         -4.68601,
//         Infinity,
//         Infinity,
//         -3.3905800006313123,
//         -9.470530000631312,
//         9.470530000631312,
//         5.350356,
//         -5.350356,
//         0,
//       ],
//     },
//   },
//   variableNames: [
//     '0.pExchange',
//     '0.pSlack',
//     '0.dBus',
//     '0.0.pExchange',
//     '0.0.pSlack',
//     '0.0.dBus',
//     '0.0.limitableAsset.0.p',
//     '0.0.limitableAsset.0.pStandalone',
//     '0.0.limitableAsset.0.pEssNetting',
//     '0.0.limitableAsset.0.d',
//     '0.0.limitableAsset.0.dStandalone',
//     '0.0.limitableAsset.0.dEssNetting',
//     '0.1.pExchange',
//     '0.1.pSlack',
//     '0.1.dBus',
//     '0.1.controllableAsset.3.p',
//     '0.1.controllableAsset.3.dSecondary',
//     '0.1.controllableAsset.3.dTertiary',
//     '0.1.limitableAsset.4.p',
//     '0.1.limitableAsset.4.pStandalone',
//     '0.1.limitableAsset.4.pEssNetting',
//     '0.1.limitableAsset.4.d',
//     '0.1.limitableAsset.4.dStandalone',
//     '0.1.limitableAsset.4.dEssNetting',
//     '0.2.pExchange',
//     '0.2.pSlack',
//     '0.2.dBus',
//     '0.2.limitableAsset.7.p',
//     '0.2.limitableAsset.7.pStandalone',
//     '0.2.limitableAsset.7.pEssNetting',
//     '0.2.limitableAsset.7.d',
//     '0.2.limitableAsset.7.dStandalone',
//     '0.2.limitableAsset.7.dEssNetting',
//     '0.2.limitableAsset.8.p',
//     '0.2.limitableAsset.8.pStandalone',
//     '0.2.limitableAsset.8.pEssNetting',
//     '0.2.limitableAsset.8.d',
//     '0.2.limitableAsset.8.dStandalone',
//     '0.2.limitableAsset.8.dEssNetting',
//     '0.2.limitableAsset.9.p',
//     '0.2.limitableAsset.9.pStandalone',
//     '0.2.limitableAsset.9.pEssNetting',
//     '0.2.limitableAsset.9.d',
//     '0.2.limitableAsset.9.dStandalone',
//     '0.2.limitableAsset.9.dEssNetting',
//     '0.2.controllableAsset.10.p',
//     '0.2.controllableAsset.10.dSecondary',
//     '0.2.controllableAsset.10.dTertiary',
//     '0.3.pExchange',
//     '0.3.pSlack',
//     '0.3.dBus',
//     '0.3.0.pExchange',
//     '0.3.0.pSlack',
//     '0.3.0.dBus',
//     '0.3.0.controllableAsset.12.p',
//     '0.3.0.controllableAsset.12.dSecondary',
//     '0.3.0.controllableAsset.12.dTertiary',
//     '0.3.0.limitableAsset.13.p',
//     '0.3.0.limitableAsset.13.pStandalone',
//     '0.3.0.limitableAsset.13.pEssNetting',
//     '0.3.0.limitableAsset.13.d',
//     '0.3.0.limitableAsset.13.dStandalone',
//     '0.3.0.limitableAsset.13.dEssNetting',
//   ],
//   constraintIdentifiers: [
//     'createSlackObjectiveBoundingRow',
//     'createNodalBalanceRow for node 0',
//     'createNodalSlackRows positive row for node 0',
//     'createNodalSlackRows negative row for node 0',
//     'createNodalBalanceRow for node 0.0',
//     'createNodalSlackRows positive row for node 0.0',
//     'createNodalSlackRows negative row for node 0.0',
//     'createAssetsPowerLimitRows netting upper row for asset 0.0.limitableAsset.0',
//     'createAssetsPowerLimitRows netting lower low for asset 0.0.limitableAsset.0',
//     'createActivePowerSetpointRows for asset 0.0.limitableAsset.0',
//     'createNodalBalanceRow for node 0.1',
//     'createNodalSlackRows positive row for node 0.1',
//     'createNodalSlackRows negative row for node 0.1',
//     'createRampRateRows for asset 0.1.controllableAsset.3',
//     'createAssetsPowerLimitRows netting upper row for asset 0.1.controllableAsset.3',
//     'createAssetsPowerLimitRows netting lower low for asset 0.1.controllableAsset.3',
//     'createAssetsPowerLimitRows netting upper row for asset 0.1.limitableAsset.4',
//     'createAssetsPowerLimitRows netting lower low for asset 0.1.limitableAsset.4',
//     'createActivePowerSetpointRows for asset 0.1.limitableAsset.4',
//     'createNodalBalanceRow for node 0.2',
//     'createNodalSlackRows positive row for node 0.2',
//     'createNodalSlackRows negative row for node 0.2',
//     'createRampRateRows for asset 0.2.controllableAsset.10',
//     'createAssetsPowerLimitRows netting upper row for asset 0.2.limitableAsset.7',
//     'createAssetsPowerLimitRows netting lower low for asset 0.2.limitableAsset.7',
//     'createAssetsPowerLimitRows netting upper row for asset 0.2.limitableAsset.8',
//     'createAssetsPowerLimitRows netting lower low for asset 0.2.limitableAsset.8',
//     'createAssetsPowerLimitRows netting upper row for asset 0.2.limitableAsset.9',
//     'createAssetsPowerLimitRows netting lower low for asset 0.2.limitableAsset.9',
//     'createAssetsPowerLimitRows netting upper row for asset 0.2.controllableAsset.10',
//     'createAssetsPowerLimitRows netting lower low for asset 0.2.controllableAsset.10',
//     'createActivePowerSetpointRows for asset 0.2.limitableAsset.7',
//     'createActivePowerSetpointRows for asset 0.2.limitableAsset.8',
//     'createActivePowerSetpointRows for asset 0.2.limitableAsset.9',
//     'createNodalBalanceRow for node 0.3',
//     'createNodalSlackRows positive row for node 0.3',
//     'createNodalSlackRows negative row for node 0.3',
//     'createNodalBalanceRow for node 0.3.0',
//     'createNodalSlackRows positive row for node 0.3.0',
//     'createNodalSlackRows negative row for node 0.3.0',
//     'createRampRateRows for asset 0.3.0.controllableAsset.12',
//     'createAssetsPowerLimitRows netting upper row for asset 0.3.0.controllableAsset.12',
//     'createAssetsPowerLimitRows netting lower low for asset 0.3.0.controllableAsset.12',
//     'createAssetsPowerLimitRows netting upper row for asset 0.3.0.limitableAsset.13',
//     'createAssetsPowerLimitRows netting lower low for asset 0.3.0.limitableAsset.13',
//     'createActivePowerSetpointRows for asset 0.3.0.limitableAsset.13',
//   ],
// };

// const issues = checkModelConsistency(model);

// console.log(`issues: ${issues}`);

// const compressedSparseRowMatrix = denseToCompressedSparseRow(
//   model.constraintMatrix
// );

// export function getModel(): {
//   model: LinearProgramModel;
//   compressedSparseRowMatrix: CompressedSparseRowMatrix;
// } {
//   return {
//     model,
//     compressedSparseRowMatrix,
//   };
// }

// /**
//  * Performs basic consistency checks on an LP model:
//  * - variable lower <= upper
//  * - constraint lower <= upper
//  * Returns an array of issues found.
//  */
// export function checkModelConsistency(model: LinearProgramModel): string[] {
//   const issues: string[] = [];

//   // Variable bounds
//   const conflictingCols = [0, 1, 2, 3, 4, 5, 6, 24, 25, 26, 27, 45, 53, 54, 57];
//   for (let i = 0; i < model.variableNames.length; i++) {
//     const l = model.bounds.variable.lower[i]!;
//     const u = model.bounds.variable.upper[i]!;
//     if (l > u) {
//       issues.push(
//         `Variable '${model.variableNames[i]}' has inconsistent bounds: lower=${l}, upper=${u}`
//       );
//     }

//     if (
//       conflictingCols.includes(i) ||
//       model.variableNames[i]!.includes('0.3.0')
//     ) {
//       console.log(
//         `Variable ${i}:'${model.variableNames[i]}' has bounds:
//         lower=${l}
//         upper=${u}`
//       );
//     }
//   }

//   // Constraint bounds
//   const conflictingRows = [0, 1, 2, 5, 10, 22, 34, 37];
//   for (let i = 0; i < model.constraintIdentifiers.length; i++) {
//     const l = model.bounds.constraint.lower[i]!;
//     const u = model.bounds.constraint.upper[i]!;
//     if (l > u) {
//       issues.push(
//         `Constraint '${model.constraintIdentifiers[i]}' has inconsistent bounds: lower=${l}, upper=${u}`
//       );
//     }

//     if (
//       conflictingRows.includes(i) ||
//       model.constraintIdentifiers[i]!.includes('0.3.0')
//     ) {
//       console.log(
//         `Constraint ${i}:'${model.constraintIdentifiers[i]}' has bounds:
//         lower=${l}
//         upper=${u}
//         constraint matrix: ${model.constraintMatrix[i]}`
//       );
//     }
//   }

//   return issues;
// }

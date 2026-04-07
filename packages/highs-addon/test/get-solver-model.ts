import {getInput} from './get-input.js';

interface CompressedSparseRowMatrix {
  offsets: number[];
  indices: number[];
  values: number[];
}

function denseToCompressedSparseRow(
  constraintMatrix: number[][]
): CompressedSparseRowMatrix {
  const offsets: number[] = [0];
  const indices: number[] = [];
  const values: number[] = [];

  if (constraintMatrix.length === 0) {
    throw new Error('Matrix must have at least one row.');
  }

  const numberOfRows = constraintMatrix.length;
  const numberOfColumns = constraintMatrix[0]!.length;
  for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex += 1) {
    const row = constraintMatrix[rowIndex];

    if (row === undefined) {
      throw new Error(`Row ${rowIndex} is undefined.`);
    }

    if (row.length !== numberOfColumns) {
      throw new Error(
        `Row ${rowIndex} has inconsistent length: expected ${numberOfColumns}, got ${row.length}`
      );
    }

    for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex += 1) {
      const value = row[columnIndex]!;
      if (value !== 0) {
        indices.push(columnIndex);
        values.push(value);
      }
    }

    offsets.push(indices.length);
  }

  return {
    offsets: offsets.slice(0, -1), // remove the last offset to match HiGHS-style CSR format
    indices,
    values,
  };
}

export function getSolverModel() {
  const input = getInput();
  const variableLowerBounds: number[] = [];
  const variableUpperBounds: number[] = [];
  input.variables.forEach((variable) => {
    variableLowerBounds.push(variable.lowerBound ?? Number.NEGATIVE_INFINITY);
    variableUpperBounds.push(variable.upperBound ?? Number.POSITIVE_INFINITY);
  });

  const objectiveVector = input.variables.map((v) => {
    let factorSum = 0;
    input.objective.forEach(({prefix, type, factor}) => {
      if (v.prefix !== prefix || v.type !== type) {
        return;
      }
      factorSum += factor ?? 0;
    });
    return factorSum;
  });

  const constraintMatrix: number[][] = [];
  const constraintLowerBounds: number[] = [];
  const constraintUpperBounds: number[] = [];
  input.constraints.forEach((constraint) => {
    constraintLowerBounds.push(
      constraint.lowerBound ?? Number.NEGATIVE_INFINITY
    );
    constraintUpperBounds.push(
      constraint.upperBound ?? Number.POSITIVE_INFINITY
    );
    constraintMatrix.push(
      input.variables.map((v) => {
        let factorSum = 0;
        constraint.variables.forEach(({prefix, type, factor}) => {
          if (v.prefix !== prefix || v.type !== type) {
            return;
          }
          factorSum += factor ?? 0;
        });
        return factorSum;
      })
    );
  });

  const compressedSparseRowMatrix =
    denseToCompressedSparseRow(constraintMatrix);

  return {
    isMaximization: false,
    objectiveLinearWeights: new Float64Array(objectiveVector),
    columnLowerBounds: new Float64Array(variableLowerBounds),
    columnUpperBounds: new Float64Array(variableUpperBounds),
    rowLowerBounds: new Float64Array(constraintLowerBounds),
    rowUpperBounds: new Float64Array(constraintUpperBounds),
    weights: {
      offsets: new Int32Array(compressedSparseRowMatrix.offsets),
      indices: new Int32Array(compressedSparseRowMatrix.indices),
      values: new Float64Array(compressedSparseRowMatrix.values),
    },
  };
}

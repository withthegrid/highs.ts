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

function sanitize(value: number, epsilon: number): number {
  return Math.abs(value) < epsilon ? 0 : value;
}

export function getSolverModel() {
  const primalFeasibilityTolerance = 1e-7;

  const input = getInput();
  const variableLowerBounds: number[] = [];
  const variableUpperBounds: number[] = [];
  const variableIdentifiers: string[] = [];

  input.variables.forEach((variable) => {
    variableLowerBounds.push(variable.lowerBound ?? Number.NEGATIVE_INFINITY);
    variableUpperBounds.push(variable.upperBound ?? Number.POSITIVE_INFINITY);
    variableIdentifiers.push(`${variable.prefix}.${variable.type}`);
  });

  if (new Set(variableIdentifiers).size !== variableIdentifiers.length) {
    throw new Error(`Model has duplicate variables: ${variableIdentifiers}`);
  }

  const objectiveVector = input.variables.map((v) => {
    let factorSum = 0;
    input.objective.forEach(({prefix, type, factor}) => {
      if (!variableIdentifiers.includes(`${prefix}.${type}`)) {
        throw new Error(
          `Unsupported variable in objective (prefix: ${prefix}, type: ${type})`
        );
      }
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
  const constraintIdentifiers: string[] = [];

  input.constraints.forEach((constraint) => {
    constraintLowerBounds.push(
      constraint.lowerBound ?? Number.NEGATIVE_INFINITY
    );
    constraintUpperBounds.push(
      constraint.upperBound ?? Number.POSITIVE_INFINITY
    );
    constraintIdentifiers.push(constraint.identifier.replace(/\s+/g, '_'));
    constraintMatrix.push(
      input.variables.map((v) => {
        let factorSum = 0;
        constraint.variables.forEach(({prefix, type, factor}) => {
          if (!variableIdentifiers.includes(`${prefix}.${type}`)) {
            throw new Error(
              `Unsupported variable in constraint (prefix: ${prefix}, type: ${type},` +
                ` constraint: ${constraint.identifier})`
            );
          }
          if (v.prefix !== prefix || v.type !== type) {
            return;
          }
          factorSum += factor ?? 0;
        });
        return sanitize(factorSum, primalFeasibilityTolerance);
      })
    );
  });

  if (new Set(constraintIdentifiers).size !== constraintIdentifiers.length) {
    throw new Error(
      `Model has duplicate constraints: ${constraintIdentifiers}`
    );
  }

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
    columnNames: variableIdentifiers,
    rowNames: constraintIdentifiers,
  };
}

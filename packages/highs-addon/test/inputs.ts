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

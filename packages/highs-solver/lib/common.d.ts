export declare const packageInfo: {
    readonly name: string;
    readonly version?: string;
};
export declare enum ColumnType {
    CONTINUOUS = 0,
    INTEGER = 1,
    SEMI_CONTINUOUS = 2,
    SEMI_INTEGER = 3,
    IMPLICIT_INTEGER = 4
}
export declare enum SolutionStatus {
    NO_SOLUTION = 0,
    INFEASIBLE = 1,
    FEASIBLE = 2
}
export declare enum SolutionStyle {
    RAW = 0,
    PRETTY = 1,
    GLPSOL_RAW = 2,
    GLPSOL_PRETTY = 3,
    SPARSE = 4
}

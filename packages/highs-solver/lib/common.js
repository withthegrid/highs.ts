export const packageInfo = {
    "name": "highs-solver",
    "version": "0.0.0"
};
export var ColumnType;
(function (ColumnType) {
    ColumnType[ColumnType["CONTINUOUS"] = 0] = "CONTINUOUS";
    ColumnType[ColumnType["INTEGER"] = 1] = "INTEGER";
    ColumnType[ColumnType["SEMI_CONTINUOUS"] = 2] = "SEMI_CONTINUOUS";
    ColumnType[ColumnType["SEMI_INTEGER"] = 3] = "SEMI_INTEGER";
    ColumnType[ColumnType["IMPLICIT_INTEGER"] = 4] = "IMPLICIT_INTEGER";
})(ColumnType || (ColumnType = {}));
export var SolutionStatus;
(function (SolutionStatus) {
    SolutionStatus[SolutionStatus["NO_SOLUTION"] = 0] = "NO_SOLUTION";
    SolutionStatus[SolutionStatus["INFEASIBLE"] = 1] = "INFEASIBLE";
    SolutionStatus[SolutionStatus["FEASIBLE"] = 2] = "FEASIBLE";
})(SolutionStatus || (SolutionStatus = {}));
export var SolutionStyle;
(function (SolutionStyle) {
    SolutionStyle[SolutionStyle["RAW"] = 0] = "RAW";
    SolutionStyle[SolutionStyle["PRETTY"] = 1] = "PRETTY";
    SolutionStyle[SolutionStyle["GLPSOL_RAW"] = 2] = "GLPSOL_RAW";
    SolutionStyle[SolutionStyle["GLPSOL_PRETTY"] = 3] = "GLPSOL_PRETTY";
    SolutionStyle[SolutionStyle["SPARSE"] = 4] = "SPARSE";
})(SolutionStyle || (SolutionStyle = {}));

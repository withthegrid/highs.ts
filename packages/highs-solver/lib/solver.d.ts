import { Telemetry } from '@mtth/stl-telemetry';
import { PathLike } from '@mtth/stl-utils/files';
import addon from 'highs-addon';
import util from 'util';
import { SolveMonitor } from './monitor.js';
/** Symbol used as key to store the active server in error tags. */
export declare const solverErrorTag: unique symbol;
declare const errorCodes: import("@mtth/stl-errors").ErrorCodesFor<{
    invalidWarmStart: string;
    nativeMethodFailed: (method: string, cause: unknown) => {
        message: string;
        tags: {
            method: string;
        };
        cause: unknown;
    };
    solveFailed: (solver: Solver, status: SolverStatus, cause?: unknown) => {
        message: string;
        tags: {
            [solverErrorTag]: Solver;
            status: SolverStatus;
        };
        cause: unknown;
    };
    solveInProgress: string;
    solveNonOptimal: (solver: Solver, status: SolverStatus, cause?: unknown) => {
        message: string;
        tags: {
            [solverErrorTag]: Solver;
            status: SolverStatus;
        };
        cause: unknown;
    };
}>;
export { errorCodes };
/** Higher level wrapping class around the HiGHS addon. */
export declare class Solver {
    private readonly delegate;
    private readonly telemetry;
    private solving;
    private constructor();
    /**
     * Creates a new solver. Console logging (`log_to_console` option) is disabled
     * by default.
     */
    static create(opts?: SolverCreationOptions): Solver;
    /** Merges options with existing ones. */
    updateOptions(opts: SolverOptions): void;
    /**
     * Retrieves an option's current value. This method will throw if the name
     * does not match a valid option.
     */
    getOption<N extends keyof addon.TypedOptions>(name: N): addon.TypedOptions[N];
    getOption(name: string): addon.OptionValue;
    /** Sets the model to be solved. */
    setModel(model: SolverModel): void;
    /**
     * Sets the model to be solved from a file stored on disk. Any format accepted
     * by HiGHS is permissible (e.g. `.lp,` `.mps`).
     */
    setModelFromFile(pl: PathLike): Promise<void>;
    /**
     * Write the current model. The file path must end in one HiGHS' supported
     * extensions (`.lp`, `.mps`, ...).
     */
    writeModel(pl: PathLike): Promise<void>;
    /**
     * Updates the model's objective, keeping everything else as-is. Any fields
     * undefined in the input will be left unchanged.
     */
    updateObjective(args: {
        readonly isMaximization?: boolean;
        readonly offset?: number;
        /**
         * New model linear costs. If present, must have length equal to the model's
         * number of variables.
         */
        readonly linearWeights?: Float64Array;
    }): void;
    /** Adds constraint rows to the loaded model. */
    addRows(args: {
        readonly weights: addon.Matrix;
        readonly lowerBounds: Float64Array;
        readonly upperBounds: Float64Array;
    }): void;
    /**
     * Warm-starts the solver with a solution. By default this method will also
     * check that the solution is valid and throw an illegal warm-start error if
     * not.
     */
    warmStart(args: {
        /** New primal solution values. */
        readonly primalColumns: Float64Array;
        /** Optional dual values. */
        readonly dualRows?: Float64Array;
        /** Do not check that the solution is valid. */
        readonly allowInvalid?: boolean;
    }): void;
    /**
     * Runs the solver on the last set model using the current options. No
     * mutating operations may be performed on the solver until the returned
     * promise is resolved (i.e. the solve ends).
     *
     * By default this method will throw if the solver did not find an optimal
     * solution. See the `allowNonOptimal` option to change this behavior.
     */
    solve(opts?: {
        /** Solver status event consumer. */
        readonly monitor?: SolveMonitor;
        /** Do not throw if the underlying solver exited with non-OPTIMAL status. */
        readonly allowNonOptimal?: boolean;
    }): Promise<void>;
    /** Returns true if the solver is currently solving the model. */
    isSolving(): boolean;
    /** Returns the cumulative wall-clock time spent in the last solve */
    getRunTime(): number;
    /** Returns the current solver status, set from the last solve. */
    getStatus(): SolverStatus;
    /** Returns the current solver info, set from the last solve. */
    getInfo(): SolverInfo;
    /** Returns the current solution, set from the last solve. */
    getSolution(): SolverSolution | undefined;
    /** Write the current solution to the given path. */
    writeSolution(pl: PathLike, style?: addon.SolutionStyle): Promise<void>;
    private delegated;
    private delegatedPromise;
    private assertNotSolving;
    [util.inspect.custom](): string;
}
export interface SolverCreationOptions {
    /**
     * Initial options for the underlying solver. These can be updated later via
     * the `updateOptions` method.
     */
    readonly options?: SolverOptions;
    /** Solver telemetry instance, defaults to a no-op implementation. */
    readonly telemetry?: Telemetry;
}
export type SolverInfo = addon.Info;
export type SolverModel = Omit<addon.Model, 'columnCount' | 'rowCount' | 'objectiveLinearWeights' | 'objectiveHessian'> & {
    /** Can be omitted if all-zero. */
    readonly objectiveLinearWeights?: Float64Array;
    /**
     * Only top-right half (assuming row-wise) entries need be present. The matrix
     * will be assumed symmetric and entries in the lower-left half will be
     * ignored.
     */
    readonly objectiveQuadraticWeights?: addon.Matrix;
};
export interface SolverSolution {
    readonly objectiveValue: number;
    readonly relativeGap?: number;
    readonly primal: SolverSolutionValues;
    readonly dual?: SolverSolutionValues;
}
export interface SolverSolutionValues {
    readonly rows: Float64Array;
    readonly columns: Float64Array;
}
export interface SolverOptions extends Partial<addon.TypedOptions> {
    readonly [name: string]: addon.OptionValue | undefined;
}
export declare enum SolverStatus {
    NOT_SET = 0,
    LOAD_ERROR = 1,
    MODEL_ERROR = 2,
    PRESOLVE_ERROR = 3,
    SOLVE_ERROR = 4,
    POSTSOLVE_ERROR = 5,
    MODEL_EMPTY = 6,
    OPTIMAL = 7,
    INFEASIBLE = 8,
    UNBOUNDED_OR_INFEASIBLE = 9,
    UNBOUNDED = 10,
    OBJECTIVE_BOUND = 11,
    OBJECTIVE_TARGET = 12,
    TIME_LIMIT = 13,
    ITERATION_LIMIT = 14,
    UNKNOWN = 15,
    SOLUTION_LIMIT = 16
}

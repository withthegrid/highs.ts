import { PathLike } from '@mtth/stl-utils/files';
import { MarkPresent } from '@mtth/stl-utils/objects';
import addon from 'highs-addon';
import { SolutionStyle } from './common.js';
import { SolveMonitor } from './monitor.js';
import { SolverCreationOptions, SolverModel, SolverSolution } from './solver.js';
export { ColumnType, SolutionStatus, SolutionStyle } from './common.js';
export { SolveMonitor, solveMonitor, SolveProgress } from './monitor.js';
export { Solver, SolverCreationOptions, solverErrorTag, SolverInfo, SolverModel, SolverOptions, SolverSolution, SolverSolutionValues, SolverStatus, } from './solver.js';
export type { Matrix, OptionValue } from 'highs-addon';
export declare const solverVersion: typeof addon.solverVersion;
/**
 * Solves an optimization problem asynchronously. The model can be specified
 * inline or via a file path, using any format supported by HiGHS. This method
 * will throw an error if the solution is not optimal.
 */
export declare function solve(model: SolverModel | PathLike, opts?: SolveOptions): Promise<SolverSolution>;
export declare function solve(model: SolverModel | PathLike, opts: MarkPresent<SolveOptions, 'style'>): Promise<string>;
/** Solving options. */
export interface SolveOptions extends SolverCreationOptions {
    /** Listening hooks for solver events. */
    readonly monitor?: SolveMonitor;
    /**
     * Solution formatting style. If omitted, the solution will be returned in
     * its in-memory format.
     */
    readonly style?: SolutionStyle;
}

import { assert, assertType, errorFactories, errorMessage, } from '@mtth/stl-errors';
import { noopTelemetry } from '@mtth/stl-telemetry';
import { localPath } from '@mtth/stl-utils/files';
import { ifPresent } from '@mtth/stl-utils/functions';
import { writeFile } from 'fs/promises';
import addon from 'highs-addon';
import * as tmp from 'tmp-promise';
import util from 'util';
import { packageInfo, SolutionStyle } from './common.js';
import { SolveTracker } from './monitor.js';
/** Symbol used as key to store the active server in error tags. */
export const solverErrorTag = Symbol('solver');
const [errors, errorCodes] = errorFactories({
    definitions: {
        invalidWarmStart: 'The solution used to warm-start the model was invalid',
        nativeMethodFailed: (method, cause) => ({
            message: `Native method '${method}' failed (message: ${errorMessage(cause)}). ` +
                'Check solver logs for more information.',
            tags: { method },
            cause,
        }),
        solveFailed: (solver, status, cause) => ({
            message: `Solve failed with status ${SolverStatus[status]}`,
            tags: { [solverErrorTag]: solver, status },
            cause,
        }),
        solveInProgress: 'No mutations may be performed while a solve is running',
        solveNonOptimal: (solver, status, cause) => ({
            message: 'Solve ended with non-optimal status ' + SolverStatus[status],
            tags: { [solverErrorTag]: solver, status },
            cause,
        }),
    },
    prefix: 'ERR_HIGHS_',
});
export { errorCodes };
/** Higher level wrapping class around the HiGHS addon. */
export class Solver {
    constructor(delegate, telemetry) {
        this.delegate = delegate;
        this.telemetry = telemetry;
        this.solving = false;
    }
    /**
     * Creates a new solver. Console logging (`log_to_console` option) is disabled
     * by default.
     */
    static create(opts) {
        const tel = opts?.telemetry?.via(packageInfo) ?? noopTelemetry();
        const solver = new Solver(new addon.Solver(), tel);
        solver.updateOptions({ log_to_console: false, ...opts?.options });
        return solver;
    }
    /** Merges options with existing ones. */
    updateOptions(opts) {
        this.assertNotSolving();
        for (const [name, val] of Object.entries(opts)) {
            if (val != null) {
                this.delegated('setOption', name, val);
            }
        }
    }
    getOption(name) {
        return this.delegated('getOption', name);
    }
    /** Sets the model to be solved. */
    setModel(model) {
        this.assertNotSolving();
        this.telemetry.logger.debug('Setting inline model.');
        const width = model.columnLowerBounds.length;
        const height = model.rowLowerBounds.length;
        assert(model.columnUpperBounds.length === width &&
            (model.columnTypes?.length ?? width) === width &&
            (model.objectiveLinearWeights?.length ?? width) === width &&
            (model.objectiveQuadraticWeights?.offsets.length ?? width) === width, 'Inconsistent width');
        assert(model.rowUpperBounds.length === height &&
            model.weights.offsets.length <= height, 'Inconsistent height');
        const { objectiveLinearWeights: lweights, objectiveQuadraticWeights: qweights, ...rest } = model;
        let hessian;
        if (qweights) {
            // We multiply diagonal values by 2 to keep effective objective weight
            // equal to the input weight.
            const { offsets, indices, values } = qweights;
            const scaledValues = values.slice();
            for (const [row, ix0] of offsets.entries()) {
                const ix1 = offsets[row + 1] ?? indices.length;
                for (let ix = ix0; ix < ix1; ix++) {
                    const col = indices[ix];
                    // TODO: Binary search.
                    if (col === row) {
                        scaledValues[ix] = values[ix] * 2;
                    }
                    else if (col > row) {
                        break;
                    }
                }
            }
            hessian = { offsets, indices, values: scaledValues };
        }
        this.delegated('passModel', {
            columnCount: width,
            rowCount: height,
            objectiveLinearWeights: lweights ?? new Float64Array(width),
            objectiveHessian: hessian,
            ...rest,
        });
    }
    /**
     * Sets the model to be solved from a file stored on disk. Any format accepted
     * by HiGHS is permissible (e.g. `.lp,` `.mps`).
     */
    async setModelFromFile(pl) {
        this.assertNotSolving();
        const { telemetry: tel } = this;
        tel.logger.debug('Setting model from %j...', pl);
        await tel.withActiveSpan({ name: 'HiGHS read model file' }, () => this.delegatedPromise('readModel', localPath(pl)));
    }
    /**
     * Write the current model. The file path must end in one HiGHS' supported
     * extensions (`.lp`, `.mps`, ...).
     */
    async writeModel(pl) {
        const { telemetry: tel } = this;
        tel.logger.debug('Wring model to %j...', pl);
        await tel.withActiveSpan({ name: 'HiGHS write model' }, () => this.delegatedPromise('writeModel', localPath(pl)));
    }
    /**
     * Updates the model's objective, keeping everything else as-is. Any fields
     * undefined in the input will be left unchanged.
     */
    updateObjective(args) {
        this.assertNotSolving();
        this.telemetry.logger.debug('Updating objective.');
        ifPresent(args.isMaximization, (s) => void this.delegated('changeObjectiveSense', s));
        ifPresent(args.offset, (o) => void this.delegated('changeObjectiveOffset', o));
        ifPresent(args.linearWeights, (c) => void this.delegated('changeColsCost', c));
    }
    /** Adds constraint rows to the loaded model. */
    addRows(args) {
        this.assertNotSolving();
        this.telemetry.logger.debug('Adding rows.');
        const { weights, lowerBounds: lbs, upperBounds: ubs } = args;
        const height = weights.offsets.length;
        assert(lbs.length === height && ubs.length === height, 'Inconsistent height');
        assert(weights.indices.length === weights.values.length, 'Inconsistent width');
        this.delegated('addRows', height, lbs, ubs, weights);
    }
    /**
     * Warm-starts the solver with a solution. By default this method will also
     * check that the solution is valid and throw an illegal warm-start error if
     * not.
     */
    warmStart(args) {
        this.assertNotSolving();
        this.telemetry.logger.debug('Adding warm-start solution.');
        this.delegated('setSolution', {
            columnValues: args.primalColumns,
            rowDualValues: args.dualRows,
        });
        if (!args.allowInvalid) {
            const { isValid } = this.delegated('assessPrimalSolution');
            if (!isValid) {
                throw errors.invalidWarmStart();
            }
        }
    }
    /**
     * Runs the solver on the last set model using the current options. No
     * mutating operations may be performed on the solver until the returned
     * promise is resolved (i.e. the solve ends).
     *
     * By default this method will throw if the solver did not find an optimal
     * solution. See the `allowNonOptimal` option to change this behavior.
     */
    async solve(opts) {
        this.assertNotSolving();
        const { telemetry: tel } = this;
        tel.logger.debug('Starting solve...');
        this.delegated('zeroAllClocks');
        let logPath = this.delegated('getOption', 'log_file');
        assertType('string', logPath);
        let tempLog;
        let tracker;
        if (opts?.monitor) {
            if (!logPath) {
                // We need the logs to track progress.
                tempLog = await tmp.file();
                logPath = tempLog.path;
                this.delegated('setOption', 'log_file', logPath);
            }
            // Make sure the file exists to we can tail it.
            await writeFile(logPath, '', { flag: 'a' });
            tracker = SolveTracker.create({ logPath, monitor: opts.monitor });
        }
        this.solving = true;
        let err;
        let status;
        await tel.withActiveSpan({ name: 'HiGHS solve' }, async (span) => {
            try {
                await this.delegatedPromise('run');
            }
            catch (cause) {
                err = cause;
            }
            this.solving = false;
            tracker?.shutdown();
            if (tempLog) {
                this.delegated('setOption', 'log_file', '');
                await tempLog.cleanup();
            }
            status = this.getStatus();
            span.setAttribute('solver.status', SolverStatus[status]);
            switch (status) {
                case SolverStatus.OPTIMAL:
                case SolverStatus.INFEASIBLE:
                case SolverStatus.ITERATION_LIMIT:
                case SolverStatus.OBJECTIVE_BOUND:
                case SolverStatus.OBJECTIVE_TARGET:
                case SolverStatus.SOLUTION_LIMIT:
                case SolverStatus.TIME_LIMIT:
                case SolverStatus.UNBOUNDED:
                case SolverStatus.UNBOUNDED_OR_INFEASIBLE:
                    break; // Do not throw here
                default:
                    throw errors.solveFailed(this, status, err);
            }
        });
        assert(status != null, 'Missing status');
        tel.logger.info('Solve ended with status %s.', SolverStatus[status]);
        if (!opts?.allowNonOptimal && status !== SolverStatus.OPTIMAL) {
            throw errors.solveNonOptimal(this, status, err);
        }
    }
    /** Returns true if the solver is currently solving the model. */
    isSolving() {
        return this.solving;
    }
    /** Returns the cumulative wall-clock time spent in the last solve */
    getRunTime() {
        return this.delegated('getRunTime');
    }
    /** Returns the current solver status, set from the last solve. */
    getStatus() {
        return asSolverStatus(this.delegated('getModelStatus'));
    }
    /** Returns the current solver info, set from the last solve. */
    getInfo() {
        return this.delegated('getInfo');
    }
    /** Returns the current solution, set from the last solve. */
    getSolution() {
        const sol = this.delegated('getSolution');
        if (!sol.isValueValid) {
            return undefined;
        }
        const info = this.delegated('getInfo');
        return {
            objectiveValue: info.objective_function_value,
            relativeGap: info.mip_node_count >= 0 ? info.mip_gap : undefined,
            primal: { rows: sol.rowValues, columns: sol.columnValues },
            dual: sol.isDualValid
                ? { rows: sol.rowDualValues, columns: sol.columnDualValues }
                : undefined,
        };
    }
    /** Write the current solution to the given path. */
    async writeSolution(pl, style) {
        this.assertNotSolving();
        const { telemetry: tel } = this;
        tel.logger.debug('Writing solution to %j...', pl);
        await tel.withActiveSpan({ name: 'HiGHS write solution' }, () => this.delegatedPromise('writeSolution', localPath(pl), style ?? SolutionStyle.RAW));
    }
    delegated(method, ...args) {
        const { delegate } = this;
        try {
            return delegate[method].bind(delegate)(...args);
        }
        catch (cause) {
            throw errors.nativeMethodFailed(method, cause);
        }
    }
    async delegatedPromise(method, ...args) {
        const { delegate } = this;
        try {
            return await util.promisify(delegate[method]).bind(delegate)(...args);
        }
        catch (cause) {
            throw errors.nativeMethodFailed(method, cause);
        }
    }
    assertNotSolving() {
        if (this.solving) {
            throw errors.solveInProgress();
        }
    }
    [util.inspect.custom]() {
        return `<Solver HiGHS ${addon.solverVersion()}>`;
    }
}
// https://github.com/ERGO-Code/HiGHS/blob/master/src/lp_data/HConst.h#L162
export var SolverStatus;
(function (SolverStatus) {
    SolverStatus[SolverStatus["NOT_SET"] = 0] = "NOT_SET";
    SolverStatus[SolverStatus["LOAD_ERROR"] = 1] = "LOAD_ERROR";
    SolverStatus[SolverStatus["MODEL_ERROR"] = 2] = "MODEL_ERROR";
    SolverStatus[SolverStatus["PRESOLVE_ERROR"] = 3] = "PRESOLVE_ERROR";
    SolverStatus[SolverStatus["SOLVE_ERROR"] = 4] = "SOLVE_ERROR";
    SolverStatus[SolverStatus["POSTSOLVE_ERROR"] = 5] = "POSTSOLVE_ERROR";
    SolverStatus[SolverStatus["MODEL_EMPTY"] = 6] = "MODEL_EMPTY";
    SolverStatus[SolverStatus["OPTIMAL"] = 7] = "OPTIMAL";
    SolverStatus[SolverStatus["INFEASIBLE"] = 8] = "INFEASIBLE";
    SolverStatus[SolverStatus["UNBOUNDED_OR_INFEASIBLE"] = 9] = "UNBOUNDED_OR_INFEASIBLE";
    SolverStatus[SolverStatus["UNBOUNDED"] = 10] = "UNBOUNDED";
    SolverStatus[SolverStatus["OBJECTIVE_BOUND"] = 11] = "OBJECTIVE_BOUND";
    SolverStatus[SolverStatus["OBJECTIVE_TARGET"] = 12] = "OBJECTIVE_TARGET";
    SolverStatus[SolverStatus["TIME_LIMIT"] = 13] = "TIME_LIMIT";
    SolverStatus[SolverStatus["ITERATION_LIMIT"] = 14] = "ITERATION_LIMIT";
    SolverStatus[SolverStatus["UNKNOWN"] = 15] = "UNKNOWN";
    SolverStatus[SolverStatus["SOLUTION_LIMIT"] = 16] = "SOLUTION_LIMIT";
})(SolverStatus || (SolverStatus = {}));
function asSolverStatus(num) {
    assert(SolverStatus[num] != null, 'Invalid status: %s', num);
    return num;
}

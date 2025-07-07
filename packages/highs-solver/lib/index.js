import { assert } from '@mtth/stl-errors';
import { readFile } from 'fs/promises';
import addon from 'highs-addon';
import * as tmp from 'tmp-promise';
import { Solver, } from './solver.js';
export { ColumnType, SolutionStatus, SolutionStyle } from './common.js';
export { solveMonitor } from './monitor.js';
export { Solver, solverErrorTag, SolverStatus, } from './solver.js';
export const { solverVersion } = addon;
export async function solve(model, opts) {
    const { monitor, style, ...options } = opts ?? {};
    const solver = Solver.create(options);
    if (typeof model == 'string' || model instanceof URL) {
        await solver.setModelFromFile(model);
    }
    else {
        solver.setModel(model);
    }
    await solver.solve({ monitor });
    if (opts?.style != null) {
        return intoFile((fp) => solver.writeSolution(fp, style));
    }
    const sol = solver.getSolution();
    assert(sol, 'Missing solution');
    return sol;
}
function intoFile(fn) {
    return tmp.withFile(async (res) => {
        await fn(res.path);
        return readFile(res.path, 'utf8');
    });
}

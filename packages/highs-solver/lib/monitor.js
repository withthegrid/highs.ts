/** Solve progress tracking */
import { assert, check } from '@mtth/stl-errors';
import { typedEmitter } from '@mtth/stl-utils/events';
import { atMostOnce, resolvable } from '@mtth/stl-utils/functions';
import { Tail } from 'tail';
const iterationHeaderPattern = /^\s*.*Proc\. InQueue.*$/;
const iterationDataPattern = /^\s+(\w\s+)?\d+\s+\d+\s+\d+\s+\S+\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+\d+\s+\d+\s+(\d+)\s+\S+\s*$/;
const reportHeaderPattern = /^Solving report$/;
/** Creates a new solve monitor */
export function solveMonitor() {
    return typedEmitter();
}
export class SolveTracker {
    constructor(monitor, done, setDone) {
        this.monitor = monitor;
        this.done = done;
        this.setDone = setDone;
        this.state = ProgressState.PREPARATION;
    }
    static create(args) {
        const tail = new Tail(args.logPath, { fromBeginning: args.fromBeginning });
        const [done, setDone] = resolvable(atMostOnce(() => void tail.unwatch()));
        const tracker = new SolveTracker(args.monitor, done, setDone);
        tail.on('line', (line) => void tracker.ingest(line));
        tail.on('error', setDone);
        return tracker;
    }
    shutdown() {
        this.setDone();
    }
    wait() {
        return this.done;
    }
    ingest(line) {
        if (iterationHeaderPattern.test(line)) {
            this.state = ProgressState.ITERATION;
        }
        else if (reportHeaderPattern.test(line)) {
            this.state = ProgressState.REPORT;
            this.setDone();
        }
        else {
            switch (this.state) {
                case ProgressState.ITERATION: {
                    const progress = parseProgress(line);
                    if (progress) {
                        this.monitor.emit('progress', progress);
                    }
                    break;
                }
                default:
            }
        }
    }
}
var ProgressState;
(function (ProgressState) {
    ProgressState[ProgressState["PREPARATION"] = 0] = "PREPARATION";
    ProgressState[ProgressState["ITERATION"] = 1] = "ITERATION";
    ProgressState[ProgressState["REPORT"] = 2] = "REPORT";
})(ProgressState || (ProgressState = {}));
function parseNumber(arg) {
    return arg === 'inf'
        ? Infinity
        : arg.endsWith('%')
            ? +arg.slice(0, -1) / 100
            : +arg;
}
export function parseProgress(line) {
    const match = iterationDataPattern.exec(line);
    if (!match) {
        return undefined;
    }
    assert(match.length === 7, 'Bad match', match);
    return {
        relativeGap: parseNumber(check.isPresent(match[4])),
        primalBound: parseNumber(check.isPresent(match[3])),
        dualBound: parseNumber(check.isPresent(match[2])),
        cutCount: +check.isPresent(match[5]),
        lpIterationCount: +check.isPresent(match[6]),
    };
}

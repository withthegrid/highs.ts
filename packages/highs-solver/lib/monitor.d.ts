/** Solve progress tracking */
import { TypedEmitter } from '@mtth/stl-utils/events';
/** Active solve events */
export interface SolveListeners {
    readonly progress: (prog: SolveProgress) => void;
}
/** Active solve progress notifications */
export interface SolveProgress {
    readonly relativeGap: number;
    readonly primalBound: number;
    readonly dualBound: number;
    readonly cutCount: number;
    readonly lpIterationCount: number;
}
/** Typed event-emitter of solve progress events */
export type SolveMonitor = TypedEmitter<SolveListeners>;
/** Creates a new solve monitor */
export declare function solveMonitor(): SolveMonitor;
export declare class SolveTracker {
    private readonly monitor;
    private readonly done;
    private readonly setDone;
    private state;
    constructor(monitor: SolveMonitor, done: Promise<void>, setDone: (err?: unknown) => void);
    static create(args: {
        readonly monitor: SolveMonitor;
        readonly logPath: string;
        readonly fromBeginning?: boolean;
    }): SolveTracker;
    shutdown(): void;
    wait(): Promise<void>;
    private ingest;
}
export declare function parseProgress(line: string): SolveProgress | undefined;

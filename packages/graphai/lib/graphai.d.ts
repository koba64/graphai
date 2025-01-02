import { AgentFunctionInfoDictionary, AgentFilterInfo, GraphData, DataSource, ResultDataDictionary, ResultData, DefaultResultData, GraphOptions, PropFunction, GraphDataLoader, ConfigDataDictionary } from "./type";
import { TransactionLog } from "./transaction_log";
import { ComputedNode, GraphNodes } from "./node";
import { TaskManager } from "./task_manager";
export declare const defaultConcurrency = 8;
export declare const graphDataLatestVersion = 0.5;
export declare class GraphAI {
    readonly version: number;
    private readonly graphId;
    private readonly graphData;
    private readonly loop?;
    private readonly logs;
    readonly bypassAgentIds: string[];
    readonly config?: ConfigDataDictionary;
    readonly agentFunctionInfoDictionary: AgentFunctionInfoDictionary;
    readonly taskManager: TaskManager;
    readonly agentFilters: AgentFilterInfo[];
    readonly retryLimit?: number;
    readonly propFunctions: PropFunction[];
    readonly graphLoader?: GraphDataLoader;
    nodes: GraphNodes;
    onLogCallback: (__log: TransactionLog, __isUpdate: boolean) => void;
    verbose: boolean;
    private onComplete;
    private repeatCount;
    private createNodes;
    private getValueFromResults;
    private initializeStaticNodes;
    private updateStaticNodes;
    constructor(graphData: GraphData, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, options?: GraphOptions);
    getAgentFunctionInfo(agentId?: string): import("./type").AgentFunctionInfo | {
        agent: () => Promise<null>;
        inputs: null;
        cacheType: undefined;
    };
    asString(): string;
    results<T = DefaultResultData>(all: boolean): ResultDataDictionary<T>;
    errors(): Record<string, Error>;
    private pushReadyNodesIntoQueue;
    private pushQueueIfReady;
    pushQueueIfReadyAndRunning(node: ComputedNode): void;
    pushQueue(node: ComputedNode): void;
    run<T = DefaultResultData>(all?: boolean): Promise<ResultDataDictionary<T>>;
    isRunning(): boolean;
    onExecutionComplete(node: ComputedNode): void;
    private processLoopIfNecessary;
    initializeGraphAI(): void;
    setPreviousResults(previousResults: ResultDataDictionary<DefaultResultData>): void;
    setLoopLog(log: TransactionLog): void;
    appendLog(log: TransactionLog): void;
    updateLog(log: TransactionLog): void;
    transactionLogs(): TransactionLog[];
    injectValue(nodeId: string, value: ResultData, injectFrom?: string): void;
    resultsOf(inputs?: Record<string, any>, anyInput?: boolean): Record<string, ResultData>;
    resultOf(source: DataSource): ResultData;
}

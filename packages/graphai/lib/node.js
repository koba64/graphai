"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticNode = exports.ComputedNode = exports.Node = void 0;
const utils_1 = require("./utils/utils");
const nodeUtils_1 = require("./utils/nodeUtils");
const type_1 = require("./type");
const utils_2 = require("./utils/utils");
const transaction_log_1 = require("./transaction_log");
const result_1 = require("./utils/result");
class Node {
    constructor(nodeId, graph) {
        this.waitlist = new Set(); // List of nodes which need data from this node.
        this.state = type_1.NodeState.Waiting;
        this.result = undefined;
        this.nodeId = nodeId;
        this.graph = graph;
        this.log = new transaction_log_1.TransactionLog(nodeId);
        this.console = {};
    }
    asString() {
        return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
    }
    // This method is called either as the result of computation (computed node) or
    // injection (static node).
    onSetResult() {
        this.waitlist.forEach((waitingNodeId) => {
            const waitingNode = this.graph.nodes[waitingNodeId];
            if (waitingNode.isComputedNode) {
                waitingNode.removePending(this.nodeId);
                this.graph.pushQueueIfReadyAndRunning(waitingNode);
            }
        });
    }
    afterConsoleLog(result) {
        if (this.console === false) {
            return;
        }
        else if (this.console === true || this.console.after === true) {
            console.log(typeof result === "string" ? result : JSON.stringify(result, null, 2));
        }
        else if (this.console.after) {
            if ((0, utils_2.isObject)(this.console.after)) {
                console.log(JSON.stringify((0, result_1.resultsOf)(this.console.after, { self: { result } }, this.graph.propFunctions, true), null, 2));
            }
            else {
                console.log(this.console.after);
            }
        }
    }
}
exports.Node = Node;
class ComputedNode extends Node {
    constructor(graphId, nodeId, data, graph) {
        super(nodeId, graph);
        this.retryCount = 0;
        this.dataSources = []; // no longer needed. This is for transaction log.
        this.isSkip = false;
        this.isStaticNode = false;
        this.isComputedNode = true;
        this.graphId = graphId;
        this.params = data.params ?? {};
        this.console = data.console ?? {};
        this.filterParams = data.filterParams ?? {};
        this.passThrough = data.passThrough;
        this.retryLimit = data.retry ?? graph.retryLimit ?? 0;
        this.timeout = data.timeout;
        this.isResult = data.isResult ?? false;
        this.priority = data.priority ?? 0;
        (0, utils_2.assert)(["function", "string"].includes(typeof data.agent), "agent must be either string or function");
        if (typeof data.agent === "string") {
            this.agentId = data.agent;
        }
        else {
            const agent = data.agent;
            this.agentFunction = async ({ namedInputs, params }) => agent(namedInputs, params);
        }
        this.anyInput = data.anyInput ?? false;
        this.inputs = data.inputs;
        this.output = data.output;
        this.dataSources = [
            ...(data.inputs ? (0, nodeUtils_1.inputs2dataSources)(data.inputs).flat(10) : []),
            ...(data.params ? (0, nodeUtils_1.inputs2dataSources)(data.params).flat(10) : []),
            ...(this.agentId ? [(0, utils_2.parseNodeName)(this.agentId)] : []),
        ];
        if (data.inputs && Array.isArray(data.inputs)) {
            throw new Error(`array inputs have been deprecated. nodeId: ${nodeId}: see https://github.com/receptron/graphai/blob/main/docs/NamedInputs.md`);
        }
        this.pendings = new Set((0, nodeUtils_1.dataSourceNodeIds)(this.dataSources));
        if (data.graph) {
            this.nestedGraph = typeof data.graph === "string" ? this.addPendingNode(data.graph) : data.graph;
        }
        if (data.graphLoader && graph.graphLoader) {
            this.nestedGraph = graph.graphLoader(data.graphLoader);
        }
        if (data.if) {
            this.ifSource = this.addPendingNode(data.if);
        }
        if (data.unless) {
            this.unlessSource = this.addPendingNode(data.unless);
        }
        if (data.defaultValue) {
            this.defaultValue = data.defaultValue;
        }
        this.isSkip = false;
        this.log.initForComputedNode(this, graph);
    }
    getAgentId() {
        return this.agentId ?? "__custom__function"; // only for display purpose in the log.
    }
    getConfig(hasGraphData, agentId) {
        if (agentId) {
            if (hasGraphData) {
                return this.graph.config;
            }
            const config = this.graph.config ?? {};
            return {
                ...(config["global"] ?? {}),
                ...(config[agentId] ?? {}),
            };
        }
        return {};
    }
    addPendingNode(nodeId) {
        const source = (0, utils_2.parseNodeName)(nodeId);
        (0, utils_2.assert)(!!source.nodeId, `Invalid data source ${nodeId}`);
        this.pendings.add(source.nodeId);
        return source;
    }
    isReadyNode() {
        if (this.state !== type_1.NodeState.Waiting || this.pendings.size !== 0) {
            return false;
        }
        this.isSkip = !!((this.ifSource && !(0, utils_2.isLogicallyTrue)(this.graph.resultOf(this.ifSource))) ||
            (this.unlessSource && (0, utils_2.isLogicallyTrue)(this.graph.resultOf(this.unlessSource))));
        if (this.isSkip && this.defaultValue === undefined) {
            this.state = type_1.NodeState.Skipped;
            this.log.onSkipped(this, this.graph);
            return false;
        }
        return true;
    }
    // This private method (only called while executing execute()) performs
    // the "retry" if specified. The transaction log must be updated before
    // callling this method.
    retry(state, error) {
        this.state = state; // this.execute() will update to NodeState.Executing
        this.log.onError(this, this.graph, error.message);
        if (this.retryCount < this.retryLimit) {
            this.retryCount++;
            this.execute();
        }
        else {
            this.result = undefined;
            this.error = error;
            this.transactionId = undefined; // This is necessary for timeout case
            this.graph.onExecutionComplete(this);
        }
    }
    checkDataAvailability() {
        return Object.values(this.graph.resultsOf(this.inputs))
            .flat()
            .some((result) => result !== undefined);
    }
    // This method is called right before the Graph add this node to the task manager.
    beforeAddTask() {
        this.state = type_1.NodeState.Queued;
        this.log.beforeAddTask(this, this.graph);
    }
    // This method is called when the data became available on one of nodes,
    // which this node needs data from.
    removePending(nodeId) {
        if (this.anyInput) {
            if (this.checkDataAvailability()) {
                this.pendings.clear();
            }
        }
        else {
            this.pendings.delete(nodeId);
        }
    }
    isCurrentTransaction(transactionId) {
        return this.transactionId === transactionId;
    }
    // This private method (called only fro execute) checks if the callback from
    // the timer came before the completion of agent function call, record it
    // and attempt to retry (if specified).
    executeTimeout(transactionId) {
        if (this.state === type_1.NodeState.Executing && this.isCurrentTransaction(transactionId)) {
            console.warn(`-- timeout ${this.timeout} with ${this.nodeId}`);
            this.retry(type_1.NodeState.TimedOut, Error("Timeout"));
        }
    }
    // Check if we need to apply this filter to this node or not.
    shouldApplyAgentFilter(agentFilter, agentId) {
        if (agentFilter.agentIds && Array.isArray(agentFilter.agentIds) && agentFilter.agentIds.length > 0) {
            if (agentId && agentFilter.agentIds.includes(agentId)) {
                return true;
            }
        }
        if (agentFilter.nodeIds && Array.isArray(agentFilter.nodeIds) && agentFilter.nodeIds.length > 0) {
            if (agentFilter.nodeIds.includes(this.nodeId)) {
                return true;
            }
        }
        return !agentFilter.agentIds && !agentFilter.nodeIds;
    }
    agentFilterHandler(context, agentFunction, agentId) {
        let index = 0;
        const next = (innerContext) => {
            const agentFilter = this.graph.agentFilters[index++];
            if (agentFilter) {
                if (this.shouldApplyAgentFilter(agentFilter, agentId)) {
                    if (agentFilter.filterParams) {
                        innerContext.filterParams = { ...agentFilter.filterParams, ...innerContext.filterParams };
                    }
                    return agentFilter.agent(innerContext, next);
                }
                return next(innerContext);
            }
            return agentFunction(innerContext);
        };
        return next(context);
    }
    // This method is called when this computed node became ready to run.
    // It asynchronously calls the associated with agent function and set the result,
    // then it removes itself from the "running node" list of the graph.
    // Notice that setting the result of this node may make other nodes ready to run.
    async execute() {
        if (this.isSkip) {
            this.afterExecute(this.defaultValue, []);
            return;
        }
        const previousResults = this.graph.resultsOf(this.inputs, this.anyInput);
        const agentId = this.agentId ? this.graph.resultOf((0, utils_2.parseNodeName)(this.agentId)) : this.agentId;
        const config = this.getConfig(!!this.nestedGraph, agentId);
        const transactionId = Date.now();
        this.prepareExecute(transactionId, Object.values(previousResults));
        if (this.timeout && this.timeout > 0) {
            setTimeout(() => {
                this.executeTimeout(transactionId);
            }, this.timeout);
        }
        try {
            const agentFunction = this.agentFunction ?? this.graph.getAgentFunctionInfo(agentId).agent;
            const localLog = [];
            const context = this.getContext(previousResults, localLog, agentId, config);
            // NOTE: We use the existence of graph object in the agent-specific params to determine
            // if this is a nested agent or not.
            if (this.nestedGraph) {
                this.graph.taskManager.prepareForNesting();
                context.forNestedGraph = {
                    graphData: "nodes" in this.nestedGraph ? this.nestedGraph : this.graph.resultOf(this.nestedGraph), // HACK: compiler work-around
                    agents: this.graph.agentFunctionInfoDictionary,
                    graphOptions: {
                        agentFilters: this.graph.agentFilters,
                        taskManager: this.graph.taskManager,
                        bypassAgentIds: this.graph.bypassAgentIds,
                        config,
                        graphLoader: this.graph.graphLoader,
                    },
                    onLogCallback: this.graph.onLogCallback,
                };
            }
            this.beforeConsoleLog(context);
            const result = await this.agentFilterHandler(context, agentFunction, agentId);
            this.afterConsoleLog(result);
            if (this.nestedGraph) {
                this.graph.taskManager.restoreAfterNesting();
            }
            if (!this.isCurrentTransaction(transactionId)) {
                // This condition happens when the agent function returns
                // after the timeout (either retried or not).
                console.log(`-- transactionId mismatch with ${this.nodeId} (probably timeout)`);
                return;
            }
            // after process
            this.afterExecute(result, localLog);
        }
        catch (error) {
            this.errorProcess(error, transactionId, previousResults);
        }
    }
    afterExecute(result, localLog) {
        this.state = type_1.NodeState.Completed;
        this.result = this.getResult(result);
        if (this.output) {
            this.result = (0, result_1.resultsOf)(this.output, { self: this }, this.graph.propFunctions, true);
        }
        this.log.onComplete(this, this.graph, localLog);
        this.onSetResult();
        this.graph.onExecutionComplete(this);
    }
    // This private method (called only by execute()) prepares the ComputedNode object
    // for execution, and create a new transaction to record it.
    prepareExecute(transactionId, inputs) {
        this.state = type_1.NodeState.Executing;
        this.log.beforeExecute(this, this.graph, transactionId, inputs);
        this.transactionId = transactionId;
    }
    // This private method (called only by execute) processes an error received from
    // the agent function. It records the error in the transaction log and handles
    // the retry if specified.
    errorProcess(error, transactionId, namedInputs) {
        if (error instanceof Error && error.message !== utils_1.strIntentionalError) {
            console.error(`<-- NodeId: ${this.nodeId}, Agent: ${this.agentId}`);
            console.error({ namedInputs });
            console.error(error);
            console.error("-->");
        }
        if (!this.isCurrentTransaction(transactionId)) {
            console.warn(`-- transactionId mismatch with ${this.nodeId} (not timeout)`);
            return;
        }
        if (error instanceof Error) {
            this.retry(type_1.NodeState.Failed, error);
        }
        else {
            console.error(`-- NodeId: ${this.nodeId}: Unknown error was caught`);
            this.retry(type_1.NodeState.Failed, Error("Unknown"));
        }
    }
    getContext(previousResults, localLog, agentId, config) {
        const context = {
            params: this.graph.resultsOf(this.params),
            namedInputs: previousResults,
            inputSchema: this.agentFunction ? undefined : this.graph.getAgentFunctionInfo(agentId)?.inputs,
            debugInfo: this.getDebugInfo(agentId),
            cacheType: this.agentFunction ? undefined : this.graph.getAgentFunctionInfo(agentId)?.cacheType,
            filterParams: this.filterParams,
            agentFilters: this.graph.agentFilters,
            config,
            log: localLog,
        };
        return context;
    }
    getResult(result) {
        if (result && this.passThrough) {
            if ((0, utils_2.isObject)(result) && !Array.isArray(result)) {
                return { ...result, ...this.passThrough };
            }
            else if (Array.isArray(result)) {
                return result.map((r) => ((0, utils_2.isObject)(r) && !Array.isArray(r) ? { ...r, ...this.passThrough } : r));
            }
        }
        return result;
    }
    getDebugInfo(agentId) {
        return {
            nodeId: this.nodeId,
            agentId,
            retry: this.retryCount,
            verbose: this.graph.verbose,
            version: this.graph.version,
            isResult: this.isResult,
        };
    }
    beforeConsoleLog(context) {
        if (this.console === false) {
            return;
        }
        else if (this.console === true || this.console.before === true) {
            console.log(JSON.stringify(context.namedInputs, null, 2));
        }
        else if (this.console.before) {
            console.log(this.console.before);
        }
    }
}
exports.ComputedNode = ComputedNode;
class StaticNode extends Node {
    constructor(nodeId, data, graph) {
        super(nodeId, graph);
        this.isStaticNode = true;
        this.isComputedNode = false;
        this.value = data.value;
        this.update = data.update ? (0, utils_2.parseNodeName)(data.update) : undefined;
        this.isResult = data.isResult ?? false;
        this.console = data.console ?? {};
    }
    injectValue(value, injectFrom) {
        this.state = type_1.NodeState.Injected;
        this.result = value;
        this.log.onInjected(this, this.graph, injectFrom);
        this.onSetResult();
    }
    consoleLog() {
        this.afterConsoleLog(this.result);
    }
}
exports.StaticNode = StaticNode;

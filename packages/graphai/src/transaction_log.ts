import { ResultData, NodeDataParams, NodeState } from "@/type";
import type { GraphAI } from "@/graphai";
import type { ComputedNode, StaticNode } from "@/node";
import { debugResultKey } from "@/utils/utils";
import { dataSourceNodeIds } from "@/utils/nodeUtils";

export class TransactionLog {
  public nodeId: string;
  public state: NodeState;
  public startTime?: number;
  public endTime?: number;
  public retryCount?: number;
  public agentId?: string;
  public params?: NodeDataParams;
  public inputs?: string[];
  public inputsData?: Array<ResultData>;
  public injectFrom?: string;
  public errorMessage?: string;
  public result?: ResultData;
  public resultKeys?: string[];
  public mapIndex?: number;
  public isLoop?: boolean;
  public repeatCount?: number;
  public log?: TransactionLog[];
  constructor(nodeId: string) {
    this.nodeId = nodeId;
    this.state = NodeState.Waiting;
  }

  public initForComputedNode(node: ComputedNode, graph: GraphAI) {
    this.agentId = node.getAgentId();
    this.params = node.params;
    graph.appendLog(this);
  }

  public onInjected(node: StaticNode, graph: GraphAI, injectFrom?: string) {
    const isUpdating = "endTime" in this;
    this.result = node.result;
    this.state = node.state;
    this.endTime = Date.now();
    this.injectFrom = injectFrom;
    graph.setLoopLog(this);
    // console.log(this)
    if (isUpdating) {
      graph.updateLog(this);
    } else {
      graph.appendLog(this);
    }
  }

  public onComplete(node: ComputedNode, graph: GraphAI, localLog: TransactionLog[]) {
    this.result = node.result;
    this.resultKeys = debugResultKey(this.agentId || "", node.result);
    this.state = node.state;
    this.endTime = Date.now();
    graph.setLoopLog(this);
    if (localLog.length > 0) {
      this.log = localLog;
    }
    graph.updateLog(this);
  }

  public beforeExecute(node: ComputedNode, graph: GraphAI, transactionId: number, inputs: ResultData[]) {
    this.state = node.state;
    this.retryCount = node.retryCount > 0 ? node.retryCount : undefined;
    this.startTime = transactionId;
    this.inputs = dataSourceNodeIds(node.dataSources);
    this.inputsData = inputs.length > 0 ? inputs : undefined;
    graph.setLoopLog(this);
    graph.appendLog(this);
  }

  public beforeAddTask(node: ComputedNode, graph: GraphAI) {
    this.state = node.state;
    graph.setLoopLog(this);
    graph.appendLog(this);
  }

  public onError(node: ComputedNode, graph: GraphAI, errorMessage: string) {
    this.state = node.state;
    this.errorMessage = errorMessage;
    this.endTime = Date.now();
    graph.setLoopLog(this);
    graph.updateLog(this);
  }

  public onSkipped(node: ComputedNode, graph: GraphAI) {
    this.state = node.state;
    graph.setLoopLog(this);
    graph.updateLog(this);
  }
}
